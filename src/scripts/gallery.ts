/**
 * Gallery: animated category filter (GSAP Flip) and an accessible lightbox
 * built on <dialog> with keyboard, button and swipe navigation.
 */
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';
gsap.registerPlugin(Flip);

export function initGallery() {
  document.querySelectorAll<HTMLElement>('[data-gallery]').forEach((gallery) => {
    const grid = gallery.querySelector<HTMLElement>('[data-gallery-grid]');
    const items = Array.from(gallery.querySelectorAll<HTMLElement>('[data-gallery-item]'));
    const filters = Array.from(gallery.querySelectorAll<HTMLButtonElement>('[data-filter]'));
    const count = gallery.querySelector<HTMLElement>('[data-gallery-count]');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---- Filter ---- */
    filters.forEach((btn) => {
      btn.addEventListener('click', () => {
        const cat = btn.dataset.filter!;
        filters.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
        const state = Flip.getState(items);
        let shown = 0;
        items.forEach((it) => {
          const show = cat === 'all' || (it.dataset.cat || '').split(' ').includes(cat);
          it.hidden = !show;
          if (show) shown++;
        });
        if (count) count.textContent = `${shown} photograph${shown === 1 ? '' : 's'}`;
        if (!reduce) {
          Flip.from(state, {
            duration: 0.7, ease: 'expo.inOut', absolute: true, scale: true, nested: true,
            onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'expo.out' }),
            onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.85, duration: 0.4 }),
          });
        }
        grid?.setAttribute('aria-busy', 'false');
      });
    });

    /* ---- Lightbox ---- */
    const dialog = gallery.querySelector<HTMLDialogElement>('[data-lightbox]');
    if (!dialog) return;
    const img = dialog.querySelector<HTMLImageElement>('[data-lb-img]')!;
    const caption = dialog.querySelector<HTMLElement>('[data-lb-caption]')!;
    const counter = dialog.querySelector<HTMLElement>('[data-lb-counter]')!;
    let index = 0;

    const visible = () => items.filter((i) => !i.hidden);
    const show = (i: number, dir = 0) => {
      const list = visible();
      index = (i + list.length) % list.length;
      const link = list[index].querySelector<HTMLAnchorElement>('a')!;
      const thumb = link.querySelector('img');
      const apply = () => {
        img.src = link.href;
        img.alt = thumb?.alt ?? '';
        caption.textContent = thumb?.alt ?? '';
        counter.textContent = `${index + 1} / ${list.length}`;
      };
      if (reduce || !dir) { apply(); return; }
      gsap.to(img, { opacity: 0, x: -40 * dir, duration: 0.2, ease: 'power2.in', onComplete: () => {
        apply();
        gsap.fromTo(img, { opacity: 0, x: 40 * dir }, { opacity: 1, x: 0, duration: 0.45, ease: 'expo.out' });
      } });
    };

    items.forEach((it) => {
      it.querySelector('a')?.addEventListener('click', (e) => {
        e.preventDefault();
        show(visible().indexOf(it));
        dialog.showModal();
        document.documentElement.classList.add('lb-open');
        if (!reduce) gsap.fromTo(img, { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'expo.out' });
      });
    });
    dialog.querySelector('[data-lb-prev]')?.addEventListener('click', () => show(index - 1, -1));
    dialog.querySelector('[data-lb-next]')?.addEventListener('click', () => show(index + 1, 1));
    dialog.querySelector('[data-lb-close]')?.addEventListener('click', () => dialog.close());
    dialog.addEventListener('close', () => document.documentElement.classList.remove('lb-open'));
    dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
    dialog.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') show(index + 1, 1);
      if (e.key === 'ArrowLeft') show(index - 1, -1);
    });
    let startX = 0;
    dialog.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
    dialog.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
    });
  });
}
