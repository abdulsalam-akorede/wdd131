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

  // Contact form: sends the message through Web3Forms without leaving the page
  var form = document.getElementById('contact-form');
  if (!form) return;
  var status = document.getElementById('form-status');
  var button = form.querySelector('button[type="submit"]');
  var WHATSAPP = 'https://wa.me/2348128460590';

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }

    var original = button.textContent;
    button.disabled = true;
    button.textContent = 'Sending...';
    status.style.color = '';
    status.textContent = '';

    fetch(form.action, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(Object.fromEntries(new FormData(form)))
    })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (!data.success) throw new Error(data.message || 'Failed');
        status.textContent = 'Thank you. Your message has been sent and we will reply soon.';
        form.reset();
      })
      .catch(function () {
        status.style.color = '#a93226';
        status.innerHTML = 'Your message could not be sent. Please message us on <a href="' + WHATSAPP + '">WhatsApp</a> instead.';
      })
      .finally(function () {
        button.disabled = false;
        button.textContent = original;
      });
  });
})();