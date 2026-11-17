/**
 * Motion layer (GSAP + ScrollTrigger + SplitText).
 *
 *  data-hero              hero timeline on load (children: [data-hero-item], [data-hero-img], [data-hero-pop])
 *  data-split             heading lines rise from a mask (on load inside a hero, on scroll elsewhere)
 *  data-reveal            fade-up · ="fade" · ="scale" · ="mask" (clip-path wipe + image settle)
 *  data-stagger           children reveal one after another
 *  data-parallax="0.2"    element drifts on scroll (positive = slower than the page)
 *  data-parallax-img      image drifts inside its frame
 *  data-depth="12"        element follows the pointer (fine pointers only)
 *  data-spin              rotates with scroll
 *  data-count="1998"      number counts up when seen
 *  data-draw              SVG path draws itself when seen
 *  data-deck              pinned card deck: each card swipes away to reveal the next
 *  data-fan               cards fan out from a stack as the section scrolls in
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

declare global { interface Window { __gfsAnim?: boolean } }

const $$ = <T extends Element = HTMLElement>(sel: string, scope: ParentNode = document) =>
  Array.from(scope.querySelectorAll<T>(sel) as NodeListOf<T>) as T[];

const EASE = 'expo.out';
/** Hand control of hidden-until-animated elements from CSS to GSAP (see global.css "Motion"). */
const mark = (els: Element | Element[]) => (Array.isArray(els) ? els : [els]).forEach((e) => e.classList.add('is-in'));

export async function initAnimations() {
  window.__gfsAnim = true;
  const root = document.documentElement;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduce) {
    root.classList.remove('js-anim');
    $$('[data-count]').forEach((el) => (el.textContent = formatCount(el, Number(el.dataset.count))));
    return;
  }

  // Wait for fonts so split lines are measured with the real typeface.
  try { await Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1200))]); } catch { /* ignore */ }

  heroTimeline();
  splitHeadings();
  reveals();
  staggers();
  parallax();
  pointerDepth();
  spinners();
  counters();
  draws();
  deck();
  fans();
  wordScrub();
  bars();

  // Images loading late can change layout; refresh triggers once everything is in.
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

/* ---------------------------------------------------------------- */
function heroTimeline() {
  const hero = document.querySelector<HTMLElement>('[data-hero]');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: EASE }, delay: 0.1 });

  const imgs = $$('[data-hero-img]', hero);
  imgs.forEach((frame, i) => {
    const img = frame.querySelector('img');
    tl.fromTo(frame,
      { clipPath: 'inset(100% 0% 0% 0%)' },
      { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'expo.inOut', clearProps: 'clipPath' },
      0.15 + i * 0.16);
    mark(frame);
    if (img) tl.fromTo(img, { scale: 1.35 }, { scale: 1, duration: 2, ease: 'expo.out' }, 0.15 + i * 0.16);
  });

  const items = $$('[data-hero-item]', hero);
  if (items.length) {
    tl.fromTo(items, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.1, stagger: 0.09, clearProps: 'transform' }, 0.55);
    mark(items);
  }

  const pops = $$('[data-hero-pop]', hero);
  if (pops.length) {
    tl.fromTo(pops, { opacity: 0, scale: 0.4, rotate: -25 }, { opacity: 1, scale: 1, rotate: 0, duration: 1.2, ease: 'back.out(1.8)', stagger: 0.12 }, 0.9);
    mark(pops);
  }

  // Gentle floating for decorative petals once they are in.
  $$('[data-float]', hero).forEach((el, i) => {
    gsap.to(el, { y: i % 2 ? 14 : -14, rotation: i % 2 ? 12 : -12, duration: 3.6 + i * 0.4, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1.5 });
  });
}

/* ---------------------------------------------------------------- */
function splitHeadings() {
  $$('[data-split]').forEach((el) => {
    const inHero = !!el.closest('[data-hero]');
    SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      linesClass: 'split-line',
      autoSplit: true,
      onSplit(self) {
        gsap.set(el, { visibility: 'visible' });
        mark(el);
        return gsap.from(self.lines, {
          yPercent: 115,
          rotate: inHero ? 3 : 0,
          transformOrigin: '0% 100%',
          duration: inHero ? 1.35 : 1.1,
          stagger: inHero ? 0.11 : 0.08,
          ease: EASE,
          delay: inHero ? 0.3 : 0,
          scrollTrigger: inHero ? undefined : { trigger: el, start: 'top 88%', once: true },
        });
      },
    });
    // The hand-drawn underline inside a heading draws after the words land.
    $$('.scribble path', el).forEach((p) => {
      gsap.fromTo(p, { strokeDashoffset: 1 }, {
        strokeDashoffset: 0, duration: 1.2, ease: 'power2.inOut', delay: inHero ? 1.2 : 0.5,
        scrollTrigger: inHero ? undefined : { trigger: el, start: 'top 85%', once: true },
      });
    });
  });
}

/* ---------------------------------------------------------------- */
function reveals() {
  const plain = $$('[data-reveal]').filter((el) => el.dataset.reveal !== 'mask' && !el.closest('[data-hero]'));
  ScrollTrigger.batch(plain, {
    start: 'top 90%',
    once: true,
    onEnter: (batch) => {
      const from = (el: HTMLElement) => el.dataset.reveal === 'scale' ? { opacity: 0, scale: 0.92 } : el.dataset.reveal === 'fade' ? { opacity: 0 } : { opacity: 0, y: 32 };
      batch.forEach((el, i) => {
        gsap.fromTo(el, from(el as HTMLElement), { opacity: 1, y: 0, scale: 1, duration: 1.1, ease: EASE, delay: i * 0.09, clearProps: 'opacity,transform' });
        mark(el);
      });
    },
  });

  $$('[data-reveal="mask"]').filter((el) => !el.closest('[data-hero]')).forEach((el) => {
    const img = el.querySelector('img');
    gsap.set(el, { clipPath: 'inset(100% 0% 0% 0%)' });
    mark(el);
    const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
    tl.to(el, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'expo.inOut', clearProps: 'clipPath' });
    if (img && !img.hasAttribute('data-parallax-img')) tl.fromTo(img, { scale: 1.3 }, { scale: 1, duration: 1.8, ease: EASE, clearProps: 'transform' }, 0);
  });
}

function staggers() {
  $$('[data-stagger]').forEach((group) => {
    const kids = Array.from(group.children) as HTMLElement[];
    gsap.fromTo(kids, { opacity: 0, y: 28 }, {
      opacity: 1, y: 0, duration: 1, ease: EASE, stagger: Number(group.dataset.stagger) || 0.08, clearProps: 'opacity,transform',
      scrollTrigger: { trigger: group, start: 'top 88%', once: true },
    });
    mark(kids);
  });
}

/* ---------------------------------------------------------------- */
function parallax() {
  $$('[data-parallax]').forEach((el) => {
    const speed = Number(el.dataset.parallax) || 0.15;
    gsap.to(el, {
      yPercent: -speed * 100, ease: 'none',
      scrollTrigger: { trigger: el.closest('section') ?? el, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
    });
  });
  $$('img[data-parallax-img]').forEach((img) => {
    gsap.fromTo(img, { yPercent: -7 }, {
      yPercent: 7, ease: 'none',
      scrollTrigger: { trigger: img.closest('.frame') ?? img, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });
}

function pointerDepth() {
  if (!window.matchMedia('(pointer: fine)').matches) return;
  const els = $$('[data-depth]');
  if (!els.length) return;
  const setters = els.map((el) => ({
    x: gsap.quickTo(el, 'x', { duration: 1.2, ease: 'power3.out' }),
    y: gsap.quickTo(el, 'y', { duration: 1.2, ease: 'power3.out' }),
    d: Number(el.dataset.depth) || 10,
  }));
  window.addEventListener('pointermove', (e) => {
    const nx = e.clientX / window.innerWidth - 0.5;
    const ny = e.clientY / window.innerHeight - 0.5;
    setters.forEach((s) => { s.x(nx * s.d); s.y(ny * s.d); });
  }, { passive: true });
}

function spinners() {
  $$('[data-spin]').forEach((el) => {
    gsap.to(el, { rotation: 300, ease: 'none', scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 1.2 } });
  });
}

/* ---------------------------------------------------------------- */
function formatCount(el: HTMLElement, n: number) {
  const s = 'raw' in el.dataset ? String(Math.round(n)) : Math.round(n).toLocaleString('en-NG');
  return s + (el.dataset.suffix ?? '');
}
function counters() {
  $$('[data-count]').forEach((el) => {
    const end = Number(el.dataset.count);
    const start = Number(el.dataset.from ?? 0);
    const obj = { v: start };
    el.textContent = formatCount(el, start);
    gsap.to(obj, {
      v: end, duration: 2.2, ease: 'power3.out',
      onUpdate: () => (el.textContent = formatCount(el, obj.v)),
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    });
  });
}

function draws() {
  $$('[data-draw] path').forEach((p) => {
    gsap.fromTo(p, { strokeDashoffset: 1 }, {
      strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut',
      scrollTrigger: { trigger: p.closest('[data-draw]') ?? p, start: 'top 85%', once: true },
    });
  });
}

/* ---------------------------------------------------------------- */
/** Pinned card deck: as the reader scrolls, the top card swipes away and the next rises into place. */
function deck() {
  const sections = $$('[data-deck]');
  if (!sections.length) return;
  ScrollTrigger.config({ ignoreMobileResize: true });
  const mm = gsap.matchMedia();
  mm.add('(min-height: 520px)', () => {
    sections.forEach((section) => {
      const cards = $$('[data-deck-card]', section);
      const n = cards.length;
      if (n < 2) return;
      const bar = section.querySelector<HTMLElement>('[data-deck-bar]');
      const current = section.querySelector<HTMLElement>('[data-deck-current]');
      const gos = $$<HTMLButtonElement>('[data-deck-go]', section);
      const root = document.documentElement;
      section.classList.add('is-deck');

      const PEEK = 12, SHRINK = 0.045;
      const level = (d: number) => ({ y: Math.min(d, 2) * PEEK, scale: 1 - Math.min(d, 2) * SHRINK, opacity: d > 2 ? 0 : 1 });
      cards.forEach((c, i) => gsap.set(c, { zIndex: n - i, ...level(i) }));

      const tl = gsap.timeline({ defaults: { ease: 'none' } });
      for (let k = 0; k < n - 1; k++) {
        const dir = k % 2 ? 1 : -1;
        tl.to(cards[k], { yPercent: -125, xPercent: dir * 22, rotation: dir * 9, ease: 'power1.in', duration: 1 }, k)
          .to(cards[k], { opacity: 0, ease: 'power1.in', duration: 0.35 }, k + 0.65);
        for (let j = k + 1; j < n; j++) tl.to(cards[j], { ...level(j - k - 1), duration: 1, ease: 'power1.inOut' }, k);
      }

      let active = -1;
      const setActive = (i: number) => {
        if (i === active) return;
        active = i;
        gos.forEach((b, j) => b.classList.toggle('is-active', j === i));
        if (current) current.textContent = String(i + 1).padStart(2, '0');
      };
      setActive(0);

      const st = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: () => `+=${(n - 1) * window.innerHeight * 0.7}`,
        pin: true,
        scrub: 0.6,
        animation: tl,
        invalidateOnRefresh: true,
        snap: { snapTo: 1 / (n - 1), inertia: false, duration: { min: 0.2, max: 0.6 }, delay: 0.1, ease: 'power1.inOut' },
        onUpdate: (self) => {
          if (bar) bar.style.transform = `scaleX(${self.progress})`;
          setActive(Math.round(self.progress * (n - 1)));
        },
        onToggle: (self) => root.classList.toggle('deck-pinned', self.isActive),
      });

      // Jump to a stage: from the index, or when a keyboard user tabs onto a card further down the deck.
      const goTo = (i: number, smooth = true) => {
        const y = st.start + (st.end - st.start) * (i / (n - 1));
        window.scrollTo({ top: y, behavior: smooth ? 'smooth' : 'auto' });
      };
      gos.forEach((b) => b.addEventListener('click', () => goTo(Number(b.dataset.deckGo))));
      const onFocus = (e: FocusEvent) => {
        const i = cards.findIndex((c) => c.contains(e.target as Node));
        if (i > -1 && i !== active) goTo(i, false);
      };
      section.addEventListener('focusin', onFocus);

      return () => {
        section.removeEventListener('focusin', onFocus);
        section.classList.remove('is-deck');
        root.classList.remove('deck-pinned');
        gsap.set(cards, { clearProps: 'all' });
      };
    });
  });
}

function fans() {
  $$('[data-fan]').forEach((group) => {
    const cards = Array.from(group.children) as HTMLElement[];
    const mid = (cards.length - 1) / 2;
    const mm = gsap.matchMedia();
    mm.add('(min-width: 760px)', () => {
      gsap.from(cards, {
        x: (i) => (mid - i) * 140,
        y: (i) => Math.abs(mid - i) * -30 + 60,
        rotation: (i) => (i - mid) * 7,
        opacity: 0.3,
        ease: 'none',
        scrollTrigger: { trigger: group, start: 'top 95%', end: 'top 35%', scrub: 1 },
      });
    });
  });
}

/* ---------------------------------------------------------------- */
/** Words light up one by one as the reader scrolls through the section. */
function wordScrub() {
  $$('[data-word-scrub]').forEach((el) => {
    const words = el.textContent!.trim().split(/\s+/);
    el.innerHTML = words.map((w) => `<span class="w">${w}</span>`).join(' ');
    const spans = $$('.w', el);
    ScrollTrigger.create({
      trigger: el,
      start: 'top 75%',
      end: 'bottom 45%',
      scrub: true,
      onUpdate: (st) => {
        const n = Math.round(st.progress * spans.length);
        spans.forEach((sp, i) => sp.classList.toggle('on', i < n));
      },
    });
  });
}

/** Proportion bars grow from the left when seen. */
function bars() {
  $$('[data-split-bar]').forEach((bar) => {
    gsap.from(Array.from(bar.children), {
      scaleX: 0, duration: 1.4, ease: 'expo.out', stagger: 0.15,
      scrollTrigger: { trigger: bar, start: 'top 88%', once: true },
    });
  });
}
