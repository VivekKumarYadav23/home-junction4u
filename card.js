'use strict';
(() => {
  const dialog = document.getElementById('business-details');
  const open = document.getElementById('open-details');
  const status = document.getElementById('copy-status');
  const manual = document.getElementById('manual-copy');
  const value = document.getElementById('copy-value');
  open.hidden = false;
  open.addEventListener('click', () => {
    status.textContent = ''; manual.hidden = true;
    dialog.showModal(); document.body.classList.add('modal-open');
    document.getElementById('details-title').focus();
  });
  dialog.querySelector('.close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => { document.body.classList.remove('modal-open'); open.focus(); });
  dialog.addEventListener('click', e => {
    const r = dialog.getBoundingClientRect();
    if (e.target === dialog && (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom)) dialog.close();
  });
  async function copy(text, confirmation) {
    status.textContent = ''; manual.hidden = true;
    try {
      if (!navigator.clipboard || !window.isSecureContext) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(text);
      status.textContent = confirmation;
    } catch (_) {
      manual.hidden = false; value.value = text; value.focus(); value.select();
      status.textContent = 'Automatic copy is unavailable. Select and copy the details below.';
    }
  }
  document.querySelectorAll('[data-copy]').forEach(button => button.addEventListener('click', () => copy(button.dataset.copy, button.dataset.confirm || 'Copied')));
  const share = document.getElementById('share-profile');
  const fallback = document.getElementById('copy-profile');
  const data = {title:'Home Junction4u',text:'Home Junction4u – Interior Design Studio',url:'https://homejunction4u.com/card.html'};
  if (typeof navigator.share !== 'function') share.hidden = true;
  share.addEventListener('click', async () => {
    try { await navigator.share(data); }
    catch (error) {
      if (error.name !== 'AbortError') { fallback.hidden = false; status.textContent = 'Sharing is unavailable here. Use Copy Profile Link instead.'; }
    }
  });
})();
