/* ============================================================
   LIBRAVIA — CONTACT PAGE
   Form validation · submit handling · smooth UX
   ============================================================ */

(function () {
  'use strict';

  var form = document.getElementById('bk_contact_form');
  if (!form) return;

  var submitBtn = document.getElementById('bk_contact_submit');
  var successBlock = document.getElementById('bk_contact_success');

  /* ============================================================
     VALIDATORS
     ============================================================ */
  var validators = {
    name: function (value) {
      var v = value.trim();
      if (!v) return 'Please enter your name.';
      if (v.length < 2) return 'Name looks a little short.';
      return '';
    },
    email: function (value) {
      var v = value.trim();
      if (!v) return 'Please enter your email.';
      var re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      if (!re.test(v)) return 'Please enter a valid email address.';
      return '';
    },
    subject: function (value) {
      if (!value) return 'Please choose a topic.';
      return '';
    },
    message: function (value) {
      var v = value.trim();
      if (!v) return 'Please write a message.';
      if (v.length < 10) return 'A little more detail helps us reply usefully.';
      return '';
    }
  };

  /* ============================================================
     HELPERS
     ============================================================ */
  function getFieldEl(name) {
    return form.querySelector('[name="' + name + '"]');
  }

  function getErrorEl(name) {
    return form.querySelector('[data-error-for="' + name + '"]');
  }

  function showError(name, message) {
    var field = getFieldEl(name);
    var errorEl = getErrorEl(name);

    if (field) field.classList.add('bk_contact_invalid');

    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.add('bk_contact_error_visible');
    }
  }

  function clearError(name) {
    var field = getFieldEl(name);
    var errorEl = getErrorEl(name);

    if (field) field.classList.remove('bk_contact_invalid');

    if (errorEl) {
      errorEl.textContent = '';
      errorEl.classList.remove('bk_contact_error_visible');
    }
  }

  function validateField(name) {
    var field = getFieldEl(name);
    if (!field) return true;

    var error = validators[name] ? validators[name](field.value) : '';

    if (error) {
      showError(name, error);
      return false;
    }

    clearError(name);
    return true;
  }

  /* ============================================================
     LIVE VALIDATION — on blur + on input (after error)
     ============================================================ */
  Object.keys(validators).forEach(function (name) {
    var field = getFieldEl(name);
    if (!field) return;

    field.addEventListener('blur', function () {
      if (field.value.trim() !== '' || field.hasAttribute('required')) {
        validateField(name);
      }
    });

    field.addEventListener('input', function () {
      if (field.classList.contains('bk_contact_invalid')) {
        validateField(name);
      }
    });

    if (field.tagName === 'SELECT') {
      field.addEventListener('change', function () {
        validateField(name);
      });
    }
  });

  /* ============================================================
     SUBMIT HANDLER
     ============================================================ */
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Validate everything
    var firstInvalid = null;

    Object.keys(validators).forEach(function (name) {
      var ok = validateField(name);
      if (!ok && !firstInvalid) firstInvalid = getFieldEl(name);
    });

    if (firstInvalid) {
      firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(function () {
        firstInvalid.focus({ preventScroll: true });
      }, 250);
      return;
    }

    /* ---- Simulated submit ---- */
    var originalText = submitBtn.querySelector('.bk_contact_submit_text')
      ? submitBtn.querySelector('.bk_contact_submit_text').textContent
      : 'Send Message';

    submitBtn.disabled = true;

    var textEl = submitBtn.querySelector('.bk_contact_submit_text');
    if (textEl) textEl.textContent = 'Sending…';

    setTimeout(function () {
      // Reset button
      submitBtn.disabled = false;
      if (textEl) textEl.textContent = originalText;

      // Hide form fields, show success
      var fields = form.querySelectorAll(
        '.bk_contact_field, .bk_contact_row, .bk_contact_submit_row'
      );
      fields.forEach(function (el) {
        el.style.display = 'none';
      });

      if (successBlock) {
        successBlock.hidden = false;
        successBlock.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 1200);
  });

})();