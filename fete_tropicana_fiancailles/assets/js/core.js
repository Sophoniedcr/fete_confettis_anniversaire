/*!
 * invite-core — utilitaires partagés des invitations digitales
 * Personnalisation (?invite=), compte à rebours, révélations au scroll,
 * RSVP persistant, export .ics, QR code SVG, partage natif.
 * Aucune dépendance obligatoire (qrcode-generator est optionnel).
 */
(function (global) {
  'use strict';

  var reduceMotion = global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var pad = function (n) { return String(n).padStart(2, '0'); };

  /* ---------- Invité ---------- */
  function guest(fallback) {
    var params = new URLSearchParams(global.location.search);
    var raw = params.get('invite') || params.get('nom') || '';
    var clean = raw.replace(/\s+/g, ' ').trim().slice(0, 80);
    return clean || fallback || '';
  }

  function fill(attr, value) {
    document.querySelectorAll('[' + attr + ']').forEach(function (el) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        if (!el.value) el.value = value;
      } else {
        el.textContent = value;
      }
    });
  }

  /* ---------- Compte à rebours ---------- */
  function countdown(target, els, onTick) {
    var end = new Date(target).getTime();
    var last = {};
    function set(key, value) {
      if (!els[key] || last[key] === value) return;
      last[key] = value;
      els[key].textContent = value;
      els[key].classList.remove('is-ticking');
      void els[key].offsetWidth;
      els[key].classList.add('is-ticking');
    }
    function tick() {
      var diff = Math.max(0, end - Date.now());
      var d = Math.floor(diff / 864e5);
      var h = Math.floor(diff / 36e5) % 24;
      var m = Math.floor(diff / 6e4) % 60;
      var s = Math.floor(diff / 1e3) % 60;
      set('days', d < 10 ? pad(d) : String(d));
      set('hours', pad(h));
      set('minutes', pad(m));
      set('seconds', pad(s));
      if (onTick) onTick({ diff: diff, d: d, h: h, m: m, s: s });
      if (diff > 0) global.setTimeout(tick, 1000 - (Date.now() % 1000));
    }
    tick();
  }

  /* ---------- Révélations au scroll ---------- */
  function reveal(selector) {
    var items = document.querySelectorAll(selector || '[data-reveal]');
    if (reduceMotion || !('IntersectionObserver' in global)) {
      items.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Navigation : en-tête + section active ---------- */
  function header(el, opts) {
    if (!el) return;
    opts = opts || {};
    var lastY = global.scrollY;
    var ticking = false;
    function update() {
      var y = global.scrollY;
      el.classList.toggle('is-scrolled', y > (opts.offset || 40));
      if (opts.autoHide) el.classList.toggle('is-hidden', y > lastY && y > 320);
      lastY = y;
      ticking = false;
    }
    global.addEventListener('scroll', function () {
      if (!ticking) { global.requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  }

  function activeNav(links) {
    if (!('IntersectionObserver' in global)) return;
    var map = {};
    links.forEach(function (a) {
      var id = a.getAttribute('href').slice(1);
      var section = document.getElementById(id);
      if (section) map[id] = a;
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) { a.removeAttribute('aria-current'); });
        var link = map[entry.target.id];
        if (link) link.setAttribute('aria-current', 'true');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(map).forEach(function (id) { io.observe(document.getElementById(id)); });
  }

  /* ---------- Calendrier (.ics) ---------- */
  function toICSDate(iso) {
    return new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  }
  function escapeICS(text) {
    return String(text || '').replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
  }
  function ics(evt) {
    var body = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Invitation digitale//FR', 'CALSCALE:GREGORIAN', 'BEGIN:VEVENT',
      'UID:' + (evt.uid || Date.now() + '@invitation'),
      'DTSTAMP:' + toICSDate(new Date().toISOString()),
      'DTSTART:' + toICSDate(evt.start),
      'DTEND:' + toICSDate(evt.end),
      'SUMMARY:' + escapeICS(evt.title),
      'LOCATION:' + escapeICS(evt.location),
      'DESCRIPTION:' + escapeICS(evt.description),
      'BEGIN:VALARM', 'TRIGGER:-P1D', 'ACTION:DISPLAY', 'DESCRIPTION:' + escapeICS(evt.title), 'END:VALARM',
      'END:VEVENT', 'END:VCALENDAR'
    ].join('\r\n');
    var blob = new Blob([body], { type: 'text/calendar;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = evt.filename || 'invitation.ics';
    document.body.appendChild(a);
    a.click();
    a.remove();
    global.setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  /* ---------- QR code SVG ---------- */
  var QR_SRC = 'https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js';
  var qrQueue = null;
  // Charge la librairie QR à la demande, sans bloquer le rendu de la page.
  function withQR(callback) {
    if (typeof global.qrcode === 'function') return callback();
    if (qrQueue) return qrQueue.push(callback);
    qrQueue = [callback];
    var script = document.createElement('script');
    script.src = QR_SRC;
    script.async = true;
    script.onload = script.onerror = function () {
      var queue = qrQueue; qrQueue = null;
      queue.forEach(function (fn) { fn(); });
    };
    document.head.appendChild(script);
  }

  function qr(container, text, opts) {
    withQR(function () { renderQR(container, text, opts); });
  }

  function renderQR(container, text, opts) {
    if (!container) return false;
    opts = opts || {};
    if (typeof global.qrcode !== 'function') {
      container.classList.add('qr-unavailable');
      return false;
    }
    var code = global.qrcode(0, 'M');
    code.addData(unescape(encodeURIComponent(text)));
    code.make();
    var count = code.getModuleCount();
    var margin = opts.margin == null ? 2 : opts.margin;
    var size = count + margin * 2;
    var dark = opts.dark || 'currentColor';
    var shapes = [];
    var isFinder = function (r, c) {
      return (r < 7 && c < 7) || (r < 7 && c >= count - 7) || (r >= count - 7 && c < 7);
    };
    for (var r = 0; r < count; r++) {
      for (var c = 0; c < count; c++) {
        if (!code.isDark(r, c) || (opts.style !== 'square' && isFinder(r, c))) continue;
        var x = c + margin, y = r + margin;
        if (opts.style === 'dot') shapes.push('<circle cx="' + (x + 0.5) + '" cy="' + (y + 0.5) + '" r="0.42"/>');
        else if (opts.style === 'round') shapes.push('<rect x="' + (x + 0.06) + '" y="' + (y + 0.06) + '" width="0.88" height="0.88" rx="0.3"/>');
        else shapes.push('<rect x="' + x + '" y="' + y + '" width="1.02" height="1.02"/>');
      }
    }
    if (opts.style !== 'square') {
      [[0, 0], [0, count - 7], [count - 7, 0]].forEach(function (p) {
        var x = p[1] + margin, y = p[0] + margin;
        var rx = opts.style === 'dot' ? 2.2 : 1.4;
        shapes.push('<rect x="' + (x + 0.5) + '" y="' + (y + 0.5) + '" width="6" height="6" rx="' + rx + '" fill="none" stroke="' + dark + '" stroke-width="1"/>');
        shapes.push('<rect x="' + (x + 2) + '" y="' + (y + 2) + '" width="3" height="3" rx="' + (rx / 2) + '"/>');
      });
    }
    container.innerHTML =
      '<svg viewBox="0 0 ' + size + ' ' + size + '" role="img" aria-label="QR code d\'accès" shape-rendering="' + (opts.style === 'square' ? 'crispEdges' : 'geometricPrecision') + '">' +
      (opts.light ? '<rect width="100%" height="100%" fill="' + opts.light + '"/>' : '') +
      '<g fill="' + dark + '">' + shapes.join('') + '</g></svg>';
    return true;
  }

  /* ---------- RSVP ---------- */
  function rsvp(form, opts) {
    if (!form) return;
    var key = 'rsvp:' + opts.key;
    var stored = null;
    try { stored = JSON.parse(global.localStorage.getItem(key) || 'null'); } catch (e) { stored = null; }

    function collect() {
      var data = {};
      new FormData(form).forEach(function (value, name) { data[name] = String(value).trim(); });
      return data;
    }
    function restore(data) {
      Object.keys(data).forEach(function (name) {
        var field = form.elements[name];
        if (!field) return;
        if (field instanceof RadioNodeList || (field.length && field[0] && field[0].type === 'radio')) {
          Array.prototype.forEach.call(field, function (r) { r.checked = r.value === data[name]; });
        } else if (field.type === 'checkbox') {
          field.checked = !!data[name];
        } else {
          field.value = data[name];
        }
      });
    }

    if (stored && stored.data) {
      restore(stored.data);
      if (opts.onSaved) opts.onSaved(stored.data, { restored: true });
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      if (!form.checkValidity()) {
        form.classList.add('was-validated');
        var invalid = form.querySelector(':invalid');
        if (invalid) invalid.focus();
        return;
      }
      var data = collect();
      var button = form.querySelector('[type="submit"]');
      if (button) { button.disabled = true; button.setAttribute('aria-busy', 'true'); }
      // Simule l'envoi réseau : à remplacer par un fetch() vers l'API ou un webhook.
      global.setTimeout(function () {
        try { global.localStorage.setItem(key, JSON.stringify({ data: data, at: new Date().toISOString() })); } catch (e) { /* stockage indisponible */ }
        if (button) { button.disabled = false; button.removeAttribute('aria-busy'); }
        if (opts.onSaved) opts.onSaved(data, { restored: false });
      }, 650);
    });
  }

  /* ---------- Partage & toast ---------- */
  var toastEl;
  function toast(message) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'toast';
      toastEl.setAttribute('role', 'status');
      toastEl.setAttribute('aria-live', 'polite');
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = message;
    toastEl.classList.add('is-visible');
    global.clearTimeout(toastEl._t);
    toastEl._t = global.setTimeout(function () { toastEl.classList.remove('is-visible'); }, 2600);
  }

  function share(data) {
    var url = data.url || global.location.href;
    if (navigator.share) {
      navigator.share({ title: data.title, text: data.text, url: url }).catch(function () {});
      return;
    }
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(function () { toast('Lien copié dans le presse-papiers'); });
    } else {
      toast(url);
    }
  }

  global.Invite = {
    reduceMotion: reduceMotion,
    guest: guest,
    fill: fill,
    countdown: countdown,
    reveal: reveal,
    header: header,
    activeNav: activeNav,
    ics: ics,
    qr: qr,
    rsvp: rsvp,
    toast: toast,
    share: share
  };
})(window);
