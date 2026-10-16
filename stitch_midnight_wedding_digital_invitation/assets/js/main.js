(function () {
  'use strict';

  var EVENT = {
    title: 'Mariage de Samuel & Grâce — Noces nocturnes',
    start: '2026-12-19T18:30:00+01:00',
    end: '2026-12-20T05:00:00+01:00',
    location: 'Hôtel de Bourbon-Condé, 12 rue Monsieur, 75007 Paris',
    description: 'Tenue de soirée de rigueur. Accès sur registre nominatif.',
    filename: 'samuel-grace-19-12-2026.ics'
  };

  var guest = Invite.guest('');
  if (guest) Invite.fill('data-guest', guest);
  if (guest) Invite.fill('data-guest-input', guest);

  /* Lever de rideau */
  var curtainDelay = Invite.reduceMotion ? 0 : 1900;
  window.setTimeout(function () {
    document.body.classList.remove('is-loading');
    document.body.classList.add('is-ready');
  }, curtainDelay);

  Invite.header(document.querySelector('[data-topbar]'), { autoHide: true });
  Invite.activeNav(Array.prototype.slice.call(document.querySelectorAll('.topbar__nav a')));
  Invite.reveal();

  Invite.countdown(EVENT.start, {
    days: document.querySelector('[data-cd="days"]'),
    hours: document.querySelector('[data-cd="hours"]'),
    minutes: document.querySelector('[data-cd="minutes"]'),
    seconds: document.querySelector('[data-cd="seconds"]')
  });

  /* Lueur de bougie : suit le pointeur dans le hero */
  var hero = document.querySelector('[data-hero]');
  if (hero && !Invite.reduceMotion && window.matchMedia('(pointer: fine)').matches) {
    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect();
      hero.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
      hero.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
    });
  }

  /* Braises : quelques particules cuivrées qui s'élèvent (canvas, ~40 points) */
  var canvas = document.querySelector('.hero__embers');
  if (canvas && !Invite.reduceMotion) {
    var ctx = canvas.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var embers = [];
    var running = true;
    var resize = function () {
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
    };
    var spawn = function (initial) {
      return {
        x: Math.random() * canvas.width,
        y: initial ? Math.random() * canvas.height : canvas.height + 10,
        r: (Math.random() * 1.4 + .4) * dpr,
        vy: (Math.random() * .35 + .15) * dpr,
        sway: Math.random() * Math.PI * 2,
        a: Math.random() * .5 + .25
      };
    };
    resize();
    for (var i = 0; i < 42; i++) embers.push(spawn(true));
    window.addEventListener('resize', resize);
    new IntersectionObserver(function (entries) { running = entries[0].isIntersecting; if (running) loop(); }).observe(hero);

    function loop() {
      if (!running) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      embers.forEach(function (p, idx) {
        p.y -= p.vy;
        p.sway += .012;
        p.x += Math.sin(p.sway) * .25 * dpr;
        if (p.y < -10) embers[idx] = spawn(false);
        var g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
        g.addColorStop(0, 'rgba(240,196,156,' + p.a + ')');
        g.addColorStop(1, 'rgba(196,141,98,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
        ctx.fill();
      });
      window.requestAnimationFrame(loop);
    }
  }

  /* Constellation : le tracé se dessine et les étoiles s'allument au scroll */
  var constellation = document.querySelector('[data-constellation]');
  if (constellation) {
    var stars = constellation.querySelectorAll('.star');
    var svg = constellation.querySelector('svg');
    var path = svg.querySelector('path');
    // Pose chaque étoile exactement sur la courbe (viewBox 1000×120, étirée en largeur).
    var placeStars = function () {
      if (getComputedStyle(svg).display === 'none') {
        stars.forEach(function (s) { s.style.removeProperty('--y'); });
        return;
      }
      var total = path.getTotalLength();
      var samples = [];
      for (var k = 0; k <= 200; k++) samples.push(path.getPointAtLength(total * k / 200));
      stars.forEach(function (s) {
        var x = (s.offsetLeft + s.offsetWidth / 2) / constellation.clientWidth * 1000;
        var best = samples.reduce(function (a, b) { return Math.abs(b.x - x) < Math.abs(a.x - x) ? b : a; });
        s.style.setProperty('--y', (best.y * svg.clientHeight / 120 - 7).toFixed(1) + 'px');
      });
    };
    placeStars();
    window.addEventListener('resize', placeStars);
    var onScroll = function () {
      var r = constellation.getBoundingClientRect();
      var vh = window.innerHeight;
      var p = Math.min(1, Math.max(0, (vh * .85 - r.top) / (r.height + vh * .3)));
      constellation.style.setProperty('--progress', (1 - p).toFixed(3));
      stars.forEach(function (s, i) { s.classList.toggle('is-lit', p > i / stars.length * .9 + .05); });
    };
    if (Invite.reduceMotion) {
      constellation.style.setProperty('--progress', 0);
      stars.forEach(function (s) { s.classList.add('is-lit'); });
    } else {
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }
  }

  /* Parallaxe douce sur la photo du lieu */
  var parallax = document.querySelectorAll('[data-parallax]');
  if (parallax.length && !Invite.reduceMotion) {
    window.addEventListener('scroll', function () {
      parallax.forEach(function (img) {
        var r = img.parentElement.getBoundingClientRect();
        var shift = (r.top + r.height / 2 - window.innerHeight / 2) * -0.08;
        img.style.transform = 'translate3d(0,' + (shift - r.height * .07).toFixed(1) + 'px,0)';
      });
    }, { passive: true });
  }

  /* Pass & QR */
  function refreshPass(data) {
    var name = (data && data.nom) || guest || 'Invité d\'honneur';
    var count = (data && data.convives) || '2';
    var ref = 'SG-' + (1000 + Math.abs(hash(name)) % 9000);
    document.querySelectorAll('.ticket__name').forEach(function (el) { el.textContent = name; });
    document.querySelector('[data-pass-count]').textContent = count + (count === '1' ? ' personne' : ' personnes');
    document.querySelector('[data-pass-ref]').textContent = ref;
    Invite.qr(document.querySelector('[data-qr]'), 'S&G·19.12.2026|' + ref + '|' + name + '|' + count, { style: 'square', margin: 1, dark: '#0e131b' });
  }
  function hash(str) {
    for (var h = 0, i = 0; i < str.length; i++) h = (h << 5) - h + str.charCodeAt(i) | 0;
    return h;
  }

  refreshPass(null);

  var done = document.querySelector('[data-rsvp-done]');
  Invite.rsvp(document.querySelector('[data-rsvp]'), {
    key: 'samuel-grace-nocturne',
    onSaved: function (data, meta) {
      refreshPass(data);
      done.hidden = false;
      done.textContent = data.presence === 'non'
        ? 'Votre réponse est bien notée. Vous nous manquerez — merci pour votre délicatesse.'
        : 'Merci infiniment — votre réponse est inscrite au livre d\'or. Votre pass personnel est prêt ci-dessous.';
      if (!meta.restored) Invite.toast('Réponse enregistrée');
    }
  });

  document.querySelector('[data-ics]').addEventListener('click', function () {
    Invite.ics(EVENT);
    Invite.toast('Événement ajouté à votre calendrier');
  });
  document.querySelector('[data-share]').addEventListener('click', function () {
    Invite.share({ title: 'Samuel & Grâce', text: 'Noces nocturnes — 19 décembre 2026, Paris' });
  });
})();
