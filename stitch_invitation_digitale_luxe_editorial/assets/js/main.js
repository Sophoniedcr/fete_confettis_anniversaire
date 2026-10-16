(function () {
  'use strict';

  var EVENT = {
    title: 'Mariage de Samuel & Grâce',
    start: '2026-11-14T14:00:00+01:00',
    end: '2026-11-15T02:00:00+01:00',
    location: 'Cathédrale Notre-Dame du Mont Carmel, Gombe, Kinshasa',
    description: 'Bénédiction nuptiale à 14h, puis banquet au Domaine des Hauts Arches (Ngaliema) dès 18h. Black tie.',
    filename: 'samuel-grace-14-11-2026.ics'
  };

  var guest = Invite.guest('');
  if (guest) {
    Invite.fill('data-guest', guest);
    Invite.fill('data-guest-input', guest);
  }

  Invite.reveal();
  Invite.activeNav(Array.prototype.slice.call(document.querySelectorAll('.strip__nav a')));
  Invite.countdown(EVENT.start, {
    days: document.querySelector('[data-cd="days"]'),
    hours: document.querySelector('[data-cd="hours"]'),
    minutes: document.querySelector('[data-cd="minutes"]'),
    seconds: document.querySelector('[data-cd="seconds"]')
  });

  /* Masthead : la taille s'ajuste pour remplir exactement la largeur de la page */
  var mast = document.querySelector('.cover__masthead');
  var fitMast = function () {
    mast.style.fontSize = '100px';
    var total = Array.prototype.reduce.call(mast.children, function (sum, el) {
      return sum + el.getBoundingClientRect().width;
    }, 0);
    var size = Math.min(200, 100 * mast.clientWidth / total * 0.985);
    mast.style.fontSize = size.toFixed(2) + 'px';
  };
  fitMast();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitMast);
  window.addEventListener('resize', fitMast);

  /* Barre de progression de lecture */
  var bar = document.querySelector('[data-progress]');
  var onScroll = function () {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.setProperty('--p', max > 0 ? (window.scrollY / max).toFixed(4) : 0);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Code-barres de couverture, généré à partir de la date */
  var barcode = document.querySelector('[data-barcode]');
  if (barcode) {
    var seed = '3141126202614';
    var x = 0, rects = '';
    for (var i = 0; i < 46; i++) {
      var w = (Number(seed[i % seed.length]) % 3) + 1;
      if (i % 2 === 0) rects += '<rect x="' + x + '" y="0" width="' + w + '" height="40"/>';
      x += w + 0.6;
    }
    barcode.setAttribute('fill', '#111110');
    barcode.innerHTML = rects;
    barcode.ownerSVGElement.setAttribute('viewBox', '0 0 ' + x.toFixed(1) + ' 40');
  }

  /* Programme : défilement horizontal à la molette sur desktop */
  var pages = document.querySelector('.pages');
  if (pages) {
    pages.addEventListener('wheel', function (e) {
      if (Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;
      var atStart = pages.scrollLeft <= 0 && e.deltaY < 0;
      var atEnd = pages.scrollLeft + pages.clientWidth >= pages.scrollWidth - 1 && e.deltaY > 0;
      if (atStart || atEnd) return;
      e.preventDefault();
      pages.scrollLeft += e.deltaY;
    }, { passive: false });
  }

  /* Lightbox native (<dialog>) */
  var dialog = document.querySelector('[data-lightbox-dialog]');
  var dialogImg = dialog.querySelector('img');
  document.querySelectorAll('[data-lightbox]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      dialogImg.src = btn.getAttribute('data-lightbox');
      dialogImg.alt = btn.querySelector('img').alt;
      if (dialog.showModal) dialog.showModal();
    });
  });
  dialog.addEventListener('click', function (e) { if (e.target === dialog) dialog.close(); });

  /* Carton d'accès */
  function refreshPass(data) {
    var name = (data && data.nom) || guest || 'Invité d\'honneur';
    var count = (data && data.convives) || '2';
    var ref = 'S&G-2026-' + String(Math.abs(hash(name)) % 9000 + 1000);
    document.querySelector('[data-pass-name]').textContent = name;
    document.querySelector('[data-pass-count]').textContent = count;
    document.querySelector('[data-pass-ref]').textContent = ref;
    Invite.qr(document.querySelector('[data-qr]'), 'SG-MAGAZINE|14.11.2026|' + ref + '|' + name + '|' + count, { style: 'square', margin: 0, dark: '#111110' });
  }
  function hash(str) {
    for (var h = 0, i = 0; i < str.length; i++) h = (h << 5) - h + str.charCodeAt(i) | 0;
    return h;
  }
  refreshPass(null);

  var done = document.querySelector('[data-rsvp-done]');
  Invite.rsvp(document.querySelector('[data-rsvp]'), {
    key: 'samuel-grace-magazine',
    onSaved: function (data, meta) {
      refreshPass(data);
      done.hidden = false;
      done.textContent = data.presence === 'non'
        ? 'Votre courrier est bien arrivé. Nous regretterons votre absence.'
        : 'Votre courrier est bien arrivé — votre carton VIP vous attend page 30.';
      if (!meta.restored) Invite.toast('Réponse envoyée');
    }
  });

  document.querySelector('[data-ics]').addEventListener('click', function () {
    Invite.ics(EVENT);
    Invite.toast('Ajouté au calendrier');
  });
  document.querySelector('[data-share]').addEventListener('click', function () {
    Invite.share({ title: 'S&G Magazine', text: 'Samuel & Grâce se marient — 14.11.2026, Kinshasa' });
  });
})();
