'use strict';
(() => {
  document.querySelectorAll('.upvc-slider').forEach(slider => {
    const track = slider.querySelector('.upvc-track');
    const dots = [...slider.querySelectorAll('[data-slide]')];
    const status = slider.querySelector('.upvc-status');
    const count = track.querySelectorAll('.upvc-slide').length;
    let index = 0, timer, drag = null;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    function update() {
      index = Math.max(0, Math.min(count - 1, Math.round(track.scrollLeft / track.clientWidth)));
      dots.forEach((dot,i) => { if(i === index) dot.setAttribute('aria-current','true'); else dot.removeAttribute('aria-current'); });
      status.textContent = `Image ${index + 1} of ${count}`;
    }
    function go(i) { index = ((i % count) + count) % count; track.scrollTo({left:index * track.clientWidth,behavior:reduced.matches ? 'auto' : 'smooth'}); }
    slider.querySelector('.upvc-controls').hidden = false;
    slider.querySelector('.upvc-prev').addEventListener('click',() => go(index - 1));
    slider.querySelector('.upvc-next').addEventListener('click',() => go(index + 1));
    dots.forEach((dot,i) => dot.addEventListener('click',() => go(i)));
    track.addEventListener('scroll',() => { clearTimeout(timer); timer = setTimeout(update,100); },{passive:true});
    track.addEventListener('keydown',e => { if(e.key === 'ArrowLeft' || e.key === 'ArrowRight'){e.preventDefault();go(index + (e.key === 'ArrowRight' ? 1 : -1));} });
    // Touch uses native horizontal scrolling; mouse/pen uses pointer dragging.
    track.addEventListener('pointerdown',e => {
      if(e.pointerType === 'touch' || e.button !== 0) return;
      drag = {x:e.clientX,left:track.scrollLeft,id:e.pointerId};
      track.classList.add('upvc-dragging');track.setPointerCapture(e.pointerId);
    });
    track.addEventListener('pointermove',e => {if(drag) track.scrollLeft = drag.left + drag.x - e.clientX;});
    function end(e) {
      if(!drag)return;
      const moved=track.scrollLeft-drag.left;
      const start=Math.round(drag.left/track.clientWidth);
      const next=Math.abs(moved)>track.clientWidth*.15 ? start+Math.sign(moved) : start;
      drag=null;track.classList.remove('upvc-dragging');
      if(track.hasPointerCapture(e.pointerId))track.releasePointerCapture(e.pointerId);
      go(Math.max(0,Math.min(count - 1,next)));
    }
    track.addEventListener('pointerup',end);track.addEventListener('pointercancel',end);
    window.addEventListener('resize',() => {track.scrollTo({left:index*track.clientWidth,behavior:'auto'});});
    update();
  });
})();
