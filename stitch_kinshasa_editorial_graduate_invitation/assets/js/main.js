(function () {
  'use strict';

  var EVENT = {
    title: 'Collation de Kahindo Mutombo',
    start: '2026-11-21T08:00:00+01:00',
    end: '2026-11-21T23:30:00+01:00',
    location: 'Université Protestante au Congo, Kinshasa',
    description: 'Cérémonie académique à 9h, cocktail d\'honneur à 15h30 aux Jardins du Fleuve (Gombe).',
    filename: 'collation-kahindo-mutombo.ics'
  };
  var SESSION_KEY = 'kahindo:opened';

  var guest = Invite.guest('');
  if (guest) {
    Invite.fill('data-guest', guest);
    Invite.fill('data-guest-input', guest);
  }

  /* Enveloppe : on brise le sceau pour entrer (une fois par session) */
  var envelope = document.querySelector('[data-envelope]');
  var openBtn = envelope.querySelector('[data-open]');
  var unseal = function (instant) {
    document.body.classList.remove('is-sealed');
    envelope.classList.add('is-open');
    window.setTimeout(function () {
      envelope.classList.add('is-gone');
      envelope.setAttribute('aria-hidden', 'true');
    }, instant ? 0 : 1700);
    try { sessionStorage.setItem(SESSION_KEY, '1'); } catch (e) { /* navigation privée */ }
  };
  var alreadyOpened = false;
  try { alreadyOpened = sessionStorage.getItem(SESSION_KEY) === '1'; } catch (e) { alreadyOpened = false; }
  if (alreadyOpened) {
    envelope.classList.add('is-gone');
    document.body.classList.remove('is-sealed');
  } else {
    openBtn.focus({ preventScroll: true });
    openBtn.addEventListener('click', function () { unseal(Invite.reduceMotion); });
    document.addEventListener('keydown', function onKey(e) {
      if (e.key === 'Escape' && document.body.classList.contains('is-sealed')) { unseal(true); document.removeEventListener('keydown', onKey); }
    });
  }

  Invite.reveal();
  Invite.activeNav(Array.prototype.slice.call(document.querySelectorAll('.bar__nav a')));

  /* Décompte en anneaux */
  var ringMax = { days: 60, hours: 24, minutes: 60, seconds: 60 };
  Invite.countdown(EVENT.start, {
    days: document.querySelector('[data-cd="days"]'),
    hours: document.querySelector('[data-cd="hours"]'),
    minutes: document.querySelector('[data-cd="minutes"]'),
    seconds: document.querySelector('[data-cd="seconds"]')
  }, function (t) {
    var values = { days: t.d, hours: t.h, minutes: t.m, seconds: t.s };
    Object.keys(values).forEach(function (k) {
      var pct = Math.min(100, values[k] / ringMax[k] * 100);
      document.querySelector('[data-ring="' + k + '"]').style.setProperty('--pct', pct.toFixed(1));
    });
  });

  /* Parcours : le fil d'or progresse et allume chaque année */
  var path = document.querySelector('[data-path]');
  if (path) {
    var steps = path.querySelectorAll('.path__step');
    var io = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      path.style.setProperty('--p', 1);
      steps.forEach(function (s, i) {
        window.setTimeout(function () { s.classList.add('is-on'); }, Invite.reduceMotion ? 0 : 250 + i * 500);
      });
      io.disconnect();
    }, { threshold: .4 });
    io.observe(path);
  }

  /* Onglets Acte I / Acte II (clavier : flèches gauche/droite) */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.acts__tab'));
  var select = function (tab) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
  };
  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { select(tab); });
    tab.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      var next = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
      select(next);
      next.focus();
    });
  });

  /* Billet */
  function refreshPass(data) {
    var name = (data && data.nom) || guest || 'Maître Jean-Paul & Famille';
    var ref = '#KN-2026-' + String(Math.abs(hash(name)) % 900 + 100);
    document.querySelector('[data-pass-name]').textContent = name;
    document.querySelector('[data-pass-ref]').textContent = ref;
    Invite.qr(document.querySelector('[data-qr]'), 'COLLATION-KM-2026|' + ref + '|' + name, { style: 'round', margin: 0, dark: '#4d0c1d' });
  }
  function hash(str) {
    for (var h = 0, i = 0; i < str.length; i++) h = (h << 5) - h + str.charCodeAt(i) | 0;
    return h;
  }
  refreshPass(null);

  var done = document.querySelector('[data-rsvp-done]');
  Invite.rsvp(document.querySelector('[data-rsvp]'), {
    key: 'kahindo-collation',
    onSaved: function (data, meta) {
      refreshPass(data);
      done.hidden = false;
      done.textContent = data.presence === 'non'
        ? 'Votre réponse est bien reçue. Merci pour votre attention.'
        : 'Votre confirmation est scellée. Au plaisir de vous recevoir à Kinshasa.';
      if (!meta.restored) Invite.toast('Présence confirmée');
    }
  });

  document.querySelector('[data-ics]').addEventListener('click', function () {
    Invite.ics(EVENT);
    Invite.toast('Ajouté au calendrier');
  });
  document.querySelector('[data-share]').addEventListener('click', function () {
    Invite.share({ title: 'Collation de Kahindo Mutombo', text: 'Samedi 21 novembre 2026 — Kinshasa' });
  });
})();
