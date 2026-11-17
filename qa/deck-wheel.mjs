// Scrolls through the journey deck with the mouse wheel / touch-like steps, recording the active card.
// Usage: node qa/probe.mjs [width] [height]
import { chromium } from 'playwright-core';
const [w = 1440, h = 900] = process.argv.slice(2).map(Number);
const b = await chromium.launch({ channel: 'chrome' });
const p = await b.newPage({ viewport: { width: w, height: h } });
await p.goto('http://localhost:4321/', { waitUntil: 'networkidle' });
await p.waitForTimeout(1000);
const top = await p.evaluate(() => document.querySelector('.journey').getBoundingClientRect().top + scrollY);
await p.evaluate((y) => scrollTo(0, y - 10), top);
await p.waitForTimeout(800);
const seen = [];
await p.mouse.move(w / 2, h / 2);
for (let i = 0; i < 9; i++) {
  await p.mouse.wheel(0, h * 0.7);
  await p.waitForTimeout(1300);
  const s = await p.evaluate(() => ({
    cur: document.querySelector('[data-deck-current]').textContent,
    idx: document.querySelector('.journey__index .is-active')?.textContent,
    pinned: document.documentElement.classList.contains('deck-pinned'),
    top: Math.round(document.querySelector('.journey').getBoundingClientRect().top),
  }));
  seen.push(s);
  await p.screenshot({ path: `qa/shots/wheel-${w}-${i}.png` });
}
console.log(JSON.stringify(seen));
await b.close();
