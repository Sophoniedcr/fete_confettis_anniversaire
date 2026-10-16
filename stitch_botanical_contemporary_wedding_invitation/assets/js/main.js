(function () {
  'use strict';

  var EVENT = {
    title: 'Mariage de Samuel & Grâce — Provence',
    start: '2027-06-19T15:00:00+02:00',
    end: '2027-06-20T02:00:00+02:00',
    location: 'Domaine de Fontenille, Route de Roquefraiche, 84360 Lauris',
    description: 'Cocktail champêtre chic — tons naturels. Allées en gravier.',
    filename: 'samuel-grace-19-06-2027.ics'
  };

  var guest = Invite.guest('');
  if (guest) {
    Invite.fill('data-guest', guest);
    Invite.fill('data-guest-input', guest);
  }

  /* Les rameaux d'olivier sont clonés depuis le <symbol> pour pouvoir être animés en CSS */
  var symbol = document.getElementById('olive');
  document.querySelectorAll('svg.olive').forEach(function (svg) {
    svg.setAttribute('viewBox', symbol.getAttribute('viewBox'));
    svg.innerHTML = symbol.innerHTML;
  });
  if ('IntersectionObserver' in window && !Invite.reduceMotion) {
    var grow = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-grown'); grow.unobserve(e.target); }
      });
    }, { threshold: .3 });
    document.querySelectorAll('svg.olive').forEach(function (svg) { grow.observe(svg); });
  } else {
    document.querySelectorAll('svg.olive').forEach(function (svg) { svg.classList.add('is-grown'); });
  }

  Invite.header(document.querySelector('[data-nav]'));
  Invite.activeNav(Array.prototype.slice.call(document.querySelectorAll('.nav__side a')));
  Invite.reveal();

  Invite.countdown(EVENT.start, {
    days: document.querySelector('[data-cd="days"]'),
    hours: document.querySelector('[data-cd="hours"]'),
    minutes: document.querySelector('[data-cd="minutes"]'),
    seconds: document.querySelector('[data-cd="seconds"]')
  });

  /* La vigne pousse au rythme du défilement */
  var vine = document.querySelector('[data-vine]');
  if (vine) {
    var steps = vine.querySelectorAll('.vine__step');
    var update = function () {
      var r = vine.getBoundingClientRect();
      var progress = Math.min(1, Math.max(0, (window.innerHeight * .6 - r.top) / r.height));
      vine.style.setProperty('--grow', progress.toFixed(3));
      steps.forEach(function (step) {
        step.classList.toggle('is-on', step.offsetTop + 10 <= progress * r.height);
      });
    };
    if (Invite.reduceMotion) {
      vine.style.setProperty('--grow', 1);
      steps.forEach(function (s) { s.classList.add('is-on'); });
    } else {
      window.addEventListener('scroll', update, { passive: true });
      update();
    }
  }

  /* Pass jour J */
  function refreshPass(data) {
    var name = (data && data.nom) || guest || 'Jean Kabeya';
    var count = (data && data.convives) || '2';
    var ref = '#2027-' + String(Math.abs(hash(name)) % 900 + 100);
    document.querySelector('[data-pass-name]').textContent = name;
    document.querySelector('[data-pass-count]').textContent = count + (count === '1' ? ' personne' : ' personnes');
    document.querySelector('[data-pass-ref]').textContent = ref;
    Invite.qr(document.querySelector('[data-qr]'), 'S&G·19.06.2027|' + ref + '|' + name + '|' + count, { style: 'dot', margin: 0, dark: '#283023' });
  }
  function hash(str) {
    for (var h = 0, i = 0; i < str.length; i++) h = (h << 5) - h + str.charCodeAt(i) | 0;
    return h;
  }
  refreshPass(null);

  var done = document.querySelector('[data-rsvp-done]');
  Invite.rsvp(document.querySelector('[data-rsvp]'), {
    key: 'samuel-grace-jardin',
    onSaved: function (data, meta) {
      refreshPass(data);
      done.hidden = false;
      var first = (data.nom || '').split(' ')[0];
      done.querySelector('p').textContent = data.presence === 'non'
        ? 'Merci ' + first + ', nous penserons à vous ce jour-là.'
        : 'Merci infiniment ' + first + ' ! Votre pass d\'accès est prêt juste en dessous.';
      if (!meta.restored) Invite.toast('Réponse envoyée — merci !');
    }
  });

  document.querySelector('[data-ics]').addEventListener('click', function () {
    Invite.ics(EVENT);
    Invite.toast('Ajouté à votre calendrier');
  });
  document.querySelector('[data-share]').addEventListener('click', function () {
    Invite.share({ title: 'Samuel & Grâce', text: 'Un mariage en Provence — 19 juin 2027' });
  });
})();
