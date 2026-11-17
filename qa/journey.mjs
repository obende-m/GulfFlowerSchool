// Checks the homepage deck, facilities accordion and admission tabs (needs `npm run dev` on :4321).
// Usage: node qa/journey.mjs [baseUrl]
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';
const base = process.argv[2] ?? 'http://localhost:4321/';
mkdirSync('qa/shots', { recursive: true });
const b = await chromium.launch({ channel: 'chrome' });
const out = {};
const errors = [];

for (const [name, vp] of [['desk', { width: 1440, height: 900 }], ['lap', { width: 1280, height: 720 }], ['mob', { width: 390, height: 664 }], ['se', { width: 320, height: 568 }]]) {
  const p = await b.newPage({ viewport: vp, isMobile: vp.width < 500, hasTouch: vp.width < 500 });
  p.on('pageerror', (e) => errors.push(`${name}: ${e.message}`));
  await p.goto(base, { waitUntil: 'networkidle' });
  await p.waitForTimeout(800);
  // Scroll down gradually so ScrollTrigger/lazy images see every position.
  const top = await p.evaluate(() => document.querySelector('.journey').getBoundingClientRect().top + scrollY);
  for (let y = 0; y < top; y += 600) { await p.evaluate((v) => scrollTo(0, v), y); await p.waitForTimeout(60); }
  const res = [];
  for (const step of [0, 1, 3, 6]) {
    const y = await p.evaluate((s) => {
      const sec = document.querySelector('.journey');
      const anchor = sec.parentElement.classList.contains('pin-spacer') ? sec.parentElement : sec;
      const start = anchor.getBoundingClientRect().top + scrollY;
      const len = (7 - 1) * innerHeight * 0.7;
      return Math.round(start + (len * s) / 6);
    }, step);
    await p.evaluate((v) => scrollTo(0, v), y);
    await p.waitForTimeout(1400);
    res.push(await p.evaluate(() => {
      const sec = document.querySelector('.journey');
      const vis = [...sec.querySelectorAll('[data-deck-card]')].map((c) => { const r = c.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight ? 1 : 0; });
      const deck = sec.querySelector('.journey__deck').getBoundingClientRect();
      const card = sec.querySelector('[data-deck-card]:not(.jcard--end)').getBoundingClientRect();
      return {
        deck: sec.classList.contains('is-deck'), pinned: document.documentElement.classList.contains('deck-pinned'),
        current: sec.querySelector('[data-deck-current]')?.textContent, secTop: Math.round(sec.getBoundingClientRect().top),
        deckBottom: Math.round(deck.bottom), vh: innerHeight, cardH: Math.round(card.height),
        overflowX: document.documentElement.scrollWidth > innerWidth,
      };
    }));
    await p.screenshot({ path: `qa/shots/deck-${name}-${step}.png` });
  }
  out[name] = res;

  if (vp.width < 500) {
    // Facilities: open the 4th row and check its photo is on screen.
    const btn = p.locator('[data-fac-item="3"]');
    await btn.scrollIntoViewIfNeeded();
    await p.waitForTimeout(400);
    const before = await btn.evaluate((e) => Math.round(e.getBoundingClientRect().top));
    await btn.click();
    await p.waitForTimeout(2000);
    out[name + '-fac'] = await p.evaluate((b4) => {
      const btn = document.querySelector('[data-fac-item="3"]');
      const ph = btn.closest('li').querySelector('.fac__mphoto').getBoundingClientRect();
      return { btnMoved: Math.round(btn.getBoundingClientRect().top) - b4, photoTop: Math.round(ph.top), photoBottom: Math.round(ph.bottom), photoH: Math.round(ph.height), vh: innerHeight, expanded: btn.getAttribute('aria-expanded') };
    }, before);
    await p.screenshot({ path: `qa/shots/fac-${name}.png` });

    // Admission tabs: all three fit, no internal scroll.
    const tabs = p.locator('#home-route-tab-other');
    await tabs.scrollIntoViewIfNeeded();
    await tabs.click();
    await p.waitForTimeout(700);
    out[name + '-adm'] = await p.evaluate(() => {
      const list = document.querySelector('.routes__tabs');
      const ts = [...list.querySelectorAll('[role=tab]')].map((t) => { const r = t.getBoundingClientRect(); return [Math.round(r.left), Math.round(r.right), Math.round(r.height)]; });
      const ind = document.querySelector('.routes__indicator').getBoundingClientRect();
      return { fits: list.scrollWidth <= list.clientWidth + 1, listRight: Math.round(list.getBoundingClientRect().right), vw: innerWidth, tabs: ts, indicator: [Math.round(ind.left), Math.round(ind.right)] };
    });
    await p.locator('.adm').screenshot({ path: `qa/shots/adm-${name}.png` });
  }
  await p.close();
}
console.log(JSON.stringify(out, null, 1));
console.log('errors', errors);
await b.close();
