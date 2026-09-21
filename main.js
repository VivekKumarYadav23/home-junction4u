'use strict';
document.documentElement.classList.add('js');
const toggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function setMenu(open) {
  navigation.classList.toggle('open', open);
  toggle.setAttribute('aria-expanded', String(open));
  toggle.innerHTML = open ? 'Close <span aria-hidden="true">×</span>' : 'Menu <span aria-hidden="true">☰</span>';
}
toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
    setMenu(false);
    toggle.focus();
  }
});
document.addEventListener('click', event => {
  if (!event.target.closest('.header')) setMenu(false);
});
navigation.addEventListener('click', event => { if (event.target.closest('a')) setMenu(false); });
navigation.addEventListener('focusout', () => {
  setTimeout(() => { if (!document.activeElement.closest('.header')) setMenu(false); }, 0);
});
const mobile = window.matchMedia('(max-width: 650px)');
mobile.addEventListener('change', () => setMenu(false));
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  document.documentElement.classList.add('motion');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.remove('pending'); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(element => { element.classList.add('pending'); observer.observe(element); });
}
document.querySelector('#year').textContent = new Date().getFullYear();
