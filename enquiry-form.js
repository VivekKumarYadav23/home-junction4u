'use strict';
(() => {
  const form = document.getElementById('enquiry-form');
  if (!form) return;
  const submit = form.querySelector('button[type="submit"]');
  const fields = form.querySelector('fieldset');
  const status = document.getElementById('enquiry-status');
  const inputs = ['name', 'phone', 'location', 'email', 'message'].map(name => form.elements.namedItem(name));
  const originalButton = submit.innerHTML;
  let sending = false;
  // Keep native validation as the no-script fallback; validate trimmed values here.
  form.noValidate = true;
  inputs.forEach(input => input.addEventListener('input', () => {
    input.setCustomValidity('');
    input.removeAttribute('aria-invalid');
  }));
  function show(message, state) {
    status.textContent = message;
    status.dataset.state = state;
  }
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (sending) return;
    show('', '');
    inputs.forEach(input => {
      input.value = input.value.trim();
      input.setCustomValidity('');
      input.removeAttribute('aria-invalid');
      if (input.required && !input.value) input.setCustomValidity('Please complete this field.');
    });
    const phone = form.elements.namedItem('phone');
    if (phone.value && (!/^[+()\d\s.-]+$/.test(phone.value) || phone.value.replace(/\D/g, '').length < 7 || phone.value.replace(/\D/g, '').length > 15)) {
      phone.setCustomValidity('Please enter a valid phone number with 7 to 15 digits.');
    }
    if (!form.checkValidity()) {
      inputs.forEach(input => { if (!input.validity.valid) input.setAttribute('aria-invalid', 'true'); });
      show('Please check the highlighted fields and try again.', 'error');
      form.reportValidity();
      return;
    }
    if (form.elements.namedItem('botcheck').checked) {
      show('Something went wrong. Please try again or contact us directly.', 'error');
      return;
    }
    const data = Object.fromEntries(new FormData(form).entries());
    // Empty optional fields need not be sent to the provider.
    if (!data.email) delete data.email;
    if (!data.message) delete data.message;
    sending = true;
    fields.disabled = true;
    submit.disabled = true;
    submit.textContent = 'Submitting…';
    form.setAttribute('aria-busy', 'true');
    show('Sending your enquiry…', 'pending');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);
    try {
      const response = await fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
        signal: controller.signal
      });
      const result = await response.json();
      if (!response.ok || result.success !== true) throw new Error('Submission not confirmed');
      form.reset();
      show('Thank you! Your enquiry has been submitted successfully. We will contact you shortly.', 'success');
      window.location.assign('thank-you.html');
    } catch (error) {
      show(error.name === 'AbortError'
        ? 'We could not confirm your enquiry in time. Please contact us directly before retrying to avoid a duplicate enquiry.'
        : 'Something went wrong. Please try again or contact us directly.', 'error');
    } finally {
      clearTimeout(timeout);
      fields.disabled = false;
      submit.disabled = false;
      submit.innerHTML = originalButton;
      form.removeAttribute('aria-busy');
      sending = false;
    }
  });
})();
