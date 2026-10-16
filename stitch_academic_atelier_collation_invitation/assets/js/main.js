(function () {
  'use strict';

  var EVENT = {
    title: 'Collation des grades — Kabeya Mukendi Marc',
    start: '2026-11-21T09:30:00+01:00',
    end: '2026-11-21T23:30:00+01:00',
    location: 'Amphithéâtre Patrice Lumumba, Université de Kinshasa',
    description: 'Accueil 08:00 · Collation 09:00 · Réception 15:00 aux Jardins du Fleuve (Gombe). Pass nominatif requis.',
    filename: 'collation-kabeya-mukendi-marc.ics'
  };
  var ACADEMIC_YEAR_START = new Date('2025-10-01T00:00:00+01:00').getTime();
  var KINSHASA_OFFSET = 60; // WAT = UTC+1

  var guest = Invite.guest('');
  if (guest) {
    Invite.fill('data-guest', guest);
    Invite.fill('data-guest-input', guest);
  }

  Invite.reveal();
  Invite.activeNav(Array.prototype.slice.call(document.querySelectorAll('.nav__links a')));

  /* Horloge de Kinshasa en direct (indépendante du fuseau du visiteur) */
  var clock = document.querySelector('[data-clock]');
  var kinshasaNow = function () {
    var now = new Date();
    return new Date(now.getTime() + (now.getTimezoneOffset() + KINSHASA_OFFSET) * 60000);
  };
  var pad = function (n) { return String(n).padStart(2, '0'); };
  (function tick() {
    var k = kinshasaNow();
    clock.textContent = pad(k.getHours()) + ':' + pad(k.getMinutes()) + ':' + pad(k.getSeconds());
    window.setTimeout(tick, 1000 - (Date.now() % 1000));
  })();

  /* Décompte + avancement de l'année académique */
  var meter = document.querySelector('[data-meter]');
  var meterLabel = document.querySelector('[data-meter-label]');
  var end = new Date(EVENT.start).getTime();
  Invite.countdown(EVENT.start, {
    days: document.querySelector('[data-cd="days"]'),
    hours: document.querySelector('[data-cd="hours"]'),
    minutes: document.querySelector('[data-cd="minutes"]'),
    seconds: document.querySelector('[data-cd="seconds"]')
  }, function () {
    var pct = Math.min(1, Math.max(0, (Date.now() - ACADEMIC_YEAR_START) / (end - ACADEMIC_YEAR_START)));
    meter.querySelector('span').style.setProperty('--v', pct.toFixed(4));
    meter.setAttribute('aria-valuenow', Math.round(pct * 100));
    meterLabel.textContent = (pct * 100).toFixed(1).replace('.', ',') + ' %';
  });

  /* Programme : surligne la séquence en cours le jour J (heure de Kinshasa) */
  var rows = document.querySelectorAll('[data-timetable] tbody tr');
  var highlight = function () {
    var k = kinshasaNow();
    var sameDay = k.getFullYear() === 2026 && k.getMonth() === 10 && k.getDate() === 21;
    var minutes = k.getHours() * 60 + k.getMinutes();
    var toMin = function (s) { var p = s.split(':'); return +p[0] * 60 + +p[1]; };
    rows.forEach(function (tr) {
      tr.classList.toggle('is-now', sameDay && minutes >= toMin(tr.dataset.from) && minutes <= toMin(tr.dataset.to));
    });
  };
  highlight();
  window.setInterval(highlight, 60000);

  /* Compteurs du registre */
  var counters = document.querySelectorAll('[data-count]');
  var runCounter = function (el) {
    var target = +el.dataset.count;
    var size = +(el.dataset.pad || 0);
    var suffix = el.dataset.suffix || '';
    var start = null;
    var duration = Invite.reduceMotion ? 1 : 1400;
    (function frame(ts) {
      if (!start) start = ts;
      var p = Math.min(1, (ts - start) / duration);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = String(Math.round(target * eased)).padStart(size, '0') + (p === 1 ? suffix : '');
      if (p < 1) window.requestAnimationFrame(frame);
    })(performance.now());
  };
  if ('IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { runCounter(e.target); cio.unobserve(e.target); } });
    }, { threshold: .6 });
    counters.forEach(function (el) { cio.observe(el); });
  } else {
    counters.forEach(runCounter);
  }

  /* Pass d'accréditation */
  var stamp = document.querySelector('[data-stamp]');
  var status = document.querySelector('[data-rsvp-status]');
  function refreshPass(data) {
    var name = (data && data.nom) || guest || 'Madame Céleste Mbuyi';
    var ref = 'KIN-26-' + String(Math.abs(hash(name)) % 900 + 100);
    document.querySelector('[data-pass-name]').textContent = name;
    document.querySelector('[data-pass-ref]').textContent = ref;
    document.querySelector('[data-pass-status]').textContent = data ? (data.presence === 'non' ? 'Excusé·e' : 'Confirmé·e') : 'En attente';
    Invite.qr(document.querySelector('[data-qr]'), 'UNIKIN-COLLATION-2026|' + ref + '|' + name, { style: 'square', margin: 0, dark: '#15191d' });
  }
  function hash(str) {
    for (var h = 0, i = 0; i < str.length; i++) h = (h << 5) - h + str.charCodeAt(i) | 0;
    return h;
  }
  refreshPass(null);

  Invite.rsvp(document.querySelector('[data-rsvp]'), {
    key: 'marc-kabeya-collation',
    onSaved: function (data, meta) {
      refreshPass(data);
      var today = new Date();
      document.querySelector('[data-stamp-date]').textContent = pad(today.getDate()) + '.' + pad(today.getMonth() + 1) + '.' + today.getFullYear();
      stamp.querySelector('span').textContent = data.presence === 'non' ? 'Excusé' : 'Confirmé';
      stamp.classList.remove('is-on');
      void stamp.offsetWidth;
      stamp.classList.add('is-on');
      status.textContent = 'Statut : enregistré au greffe ✓';
      status.classList.add('is-done');
      if (!meta.restored) Invite.toast('Transmission effectuée');
    }
  });

  document.querySelector('[data-ics]').addEventListener('click', function () {
    Invite.ics(EVENT);
    Invite.toast('Événement exporté (.ics)');
  });
  document.querySelector('[data-share]').addEventListener('click', function () {
    Invite.share({ title: 'Collation — Kabeya Mukendi Marc', text: '21 novembre 2026 · Université de Kinshasa' });
  });
})();
