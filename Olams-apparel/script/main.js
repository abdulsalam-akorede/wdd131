/* Olam's Apparel — shared behaviour for every page */
(function () {
  'use strict';

  // Mobile menu
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.getElementById('nav-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.textContent = open ? 'Close' : 'Menu';
    });
  }

  // Footer year
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Show a styled block when a placeholder image is missing
  document.querySelectorAll('.ph img').forEach(function (img) {
    var mark = function () { img.parentElement.classList.add('is-missing'); };
    if (img.complete && img.naturalWidth === 0) mark();
    img.addEventListener('error', mark);
  });

  // Contact form
  var form = document.getElementById('contact-form');
  if (!form) return;
  var status = document.getElementById('form-status');

  function setError(field, message) {
    var wrap = field.closest('.field');
    wrap.classList.toggle('has-error', Boolean(message));
    wrap.querySelector('.error').textContent = message || '';
  }

  function validate(field) {
    var value = field.value.trim();
    var message = '';
    if (field.required && !value) message = 'This field is required.';
    else if (field.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) message = 'Enter a valid email address.';
    else if (field.name === 'message' && value && value.length < 10) message = 'Please write at least 10 characters.';
    setError(field, message);
    return !message;
  }

  var fields = form.querySelectorAll('input, select, textarea');
  fields.forEach(function (f) {
    f.addEventListener('blur', function () { validate(f); });
    f.addEventListener('input', function () { if (f.closest('.field').classList.contains('has-error')) validate(f); });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = true;
    fields.forEach(function (f) { if (!validate(f)) ok = false; });
    if (!ok) { status.textContent = ''; return; }

    // Opens WhatsApp with the order details. Replace the number below (country code, no + or spaces).
    var WHATSAPP_NUMBER = '234XXXXXXXXXX';
    var d = new FormData(form);
    var text = 'Hello Olam\'s Apparel, my name is ' + d.get('name') +
      '. I am interested in: ' + d.get('interest') + '.\n' + d.get('message') +
      '\nEmail: ' + d.get('email');
    status.textContent = 'Thank you. Opening WhatsApp to send your message.';
    window.open('https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
    form.reset();
  });
})();