import { initAnimations } from './animations';

const root = document.documentElement;

/* ---------------- Header: shadow on scroll, hide on scroll down ---------------- */
function initHeader() {
  const header = document.querySelector<HTMLElement>('[data-header]');
  if (!header) return;
  let lastY = window.scrollY;
  let ticking = false;
  const update = () => {
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 50);
    const goingDown = y > lastY && y > 420;
    if (!root.classList.contains('menu-open') && !header.matches(':focus-within')) {
      header.classList.toggle('is-hidden', goingDown && Math.abs(y - lastY) > 2);
    }
    root.classList.toggle('show-action-bar', y > 480);
    lastY = y;
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
  update();
}

/* ---------------- Mobile menu ---------------- */
function initMenu() {
  const btn = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const menu = document.querySelector<HTMLElement>('[data-mobile-menu]');
  if (!btn || !menu) return;
  const label = btn.querySelector('.menu-btn__label');
  let closeTimer: number | undefined;

  const focusables = () =>
    [btn, ...menu.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')];

  const open = () => {
    clearTimeout(closeTimer);
    menu.hidden = false;
    requestAnimationFrame(() => requestAnimationFrame(() => menu.classList.add('is-open')));
    btn.setAttribute('aria-expanded', 'true');
    if (label) label.textContent = 'Close';
    root.classList.add('menu-open');
    menu.querySelector<HTMLElement>('a')?.focus({ preventScroll: true });
  };
  const close = (returnFocus = true) => {
    menu.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
    if (label) label.textContent = 'Menu';
    root.classList.remove('menu-open');
    closeTimer = window.setTimeout(() => { menu.hidden = true; }, 650);
    if (returnFocus) btn.focus({ preventScroll: true });
  };

  btn.addEventListener('click', () => (btn.getAttribute('aria-expanded') === 'true' ? close() : open()));
  menu.addEventListener('click', (e) => {
    const a = (e.target as HTMLElement).closest('a');
    if (!a) return;
    const url = new URL(a.href, location.href);
    if (url.pathname === location.pathname) close(false);
  });
  // Restore a closed menu when the page is shown again from the back/forward cache.
  window.addEventListener('pageshow', (e) => { if (e.persisted && btn.getAttribute('aria-expanded') === 'true') close(false); });
  document.addEventListener('keydown', (e) => {
    if (btn.getAttribute('aria-expanded') !== 'true') return;
    if (e.key === 'Escape') close();
    if (e.key === 'Tab') {
      const items = focusables();
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  window.matchMedia('(min-width: 1080px)').addEventListener('change', (m) => {
    if (m.matches && btn.getAttribute('aria-expanded') === 'true') close(false);
  });
}

/* ---------------- Lazy feature modules ---------------- */
function initFeatures() {
  if (document.querySelector('[data-form]')) import('./forms').then((m) => m.initForms());
  if (document.querySelector('[data-gallery]')) import('./gallery').then((m) => m.initGallery());
  if (document.querySelector('[data-tabs]')) import('./tabs').then((m) => m.initTabs());
}

initHeader();
initMenu();
initFeatures();
initAnimations();
