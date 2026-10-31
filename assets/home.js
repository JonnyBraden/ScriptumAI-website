/* Scriptum AI: homepage and pricing behaviour (2026 redesign).
   Used only by index.html and pricing.html. assets/main.js is unchanged
   and still serves the blog and product pages. */
(function () {
  'use strict';

  /* Mobile menu */
  var burger = document.querySelector('.burger');
  var menu = document.getElementById('nav-menu');
  if (burger && menu) {
    burger.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        menu.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* Dropdowns: click and keyboard support (hover is handled in CSS) */
  document.querySelectorAll('.drop-btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var drop = btn.closest('.drop');
      var open = drop.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });
  document.addEventListener('click', function () {
    document.querySelectorAll('.drop.open').forEach(function (d) {
      d.classList.remove('open');
      var b = d.querySelector('.drop-btn');
      if (b) b.setAttribute('aria-expanded', 'false');
    });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.drop.open').forEach(function (d) { d.classList.remove('open'); });
      if (menu) menu.classList.remove('open');
    }
  });

  /* Forms: sent to Netlify Forms. Each form has data-netlify="true" and a
     hidden form-name field, so Netlify records submissions and can email
     them to you (Site configuration > Forms > Form notifications). */
  function encode(form) {
    var data = new FormData(form);
    var parts = [];
    data.forEach(function (value, key) {
      parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
    });
    return parts.join('&');
  }

  document.querySelectorAll('form[data-netlify]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var status = form.querySelector('.form-status');
      var button = form.querySelector('button[type="submit"]');
      if (status) { status.className = 'form-status full'; status.textContent = ''; }
      if (button) { button.disabled = true; button.dataset.label = button.textContent; button.textContent = 'Sending…'; }

      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode(form)
      }).then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        if (status) {
          status.className = 'form-status full ok';
          status.textContent = form.dataset.success || 'Thank you. We will be in touch within one business day.';
        }
        form.querySelectorAll('input:not([type="hidden"]), textarea, select').forEach(function (f) {
          if (f.name !== 'bot-field') f.value = '';
        });
        if (button) button.style.display = 'none';
      }).catch(function () {
        if (status) {
          status.className = 'form-status full err';
          status.innerHTML = 'Something went wrong sending that. Please email us at <a href="mailto:hello@scriptum.ai">hello@scriptum.ai</a>.';
        }
        if (button) { button.disabled = false; button.textContent = button.dataset.label || 'Send'; }
      });
    });
  });
})();
