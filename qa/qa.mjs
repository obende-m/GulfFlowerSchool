/**
 * Browser QA for the built site.  Usage:  npm run build && node qa/qa.mjs [--shots]
 * Serves dist/ itself, drives the installed Chrome via playwright-core, and never
 * submits a real form (the form relay is intercepted and mocked).
 */
import { chromium } from 'playwright-core';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const DIST = path.resolve('dist');
const SHOTS = process.argv.includes('--shots');
const ONLY = process.argv.find((a) => a.startsWith('--only='))?.slice(7);
const PORT = 4398;
const pages = ['/', '/about/', '/leadership/', '/schools/', '/schools/nursery-primary/', '/schools/high-school/', '/campus-life/', '/admissions/', '/gallery/', '/contact/', '/portals/', '/404.html']
  .filter((p) => !ONLY || p === ONLY);
const widths = [[1440, 900], [1024, 768], [768, 1024], [390, 844], [320, 640]];

const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.jpg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.avif': 'image/avif', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain' };
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  let f = path.join(DIST, p);
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
  if (!fs.existsSync(f)) { res.writeHead(404, { 'content-type': 'text/html' }); return res.end(fs.readFileSync(path.join(DIST, '404.html'))); }
  res.writeHead(200, { 'content-type': types[path.extname(f)] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
}).listen(PORT);
const base = `http://127.0.0.1:${PORT}`;

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const problems = [];
const report = (page, w, msg) => { problems.push(`${page} @${w}: ${msg}`); };

async function scrollThrough(page) {
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.6;
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 140)); }
    window.scrollTo(0, document.documentElement.scrollHeight);
    await new Promise((r) => setTimeout(r, 900));
  });
}

for (const url of pages) {
  for (const [w, h] of widths) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    page.on('console', (m) => { if (m.type() === 'error' && !/maps|google|gstatic/.test(m.text())) report(url, w, `console error: ${m.text()}`); });
    page.on('pageerror', (e) => report(url, w, `page error: ${e.message}`));
    page.on('response', (r) => { if (r.status() >= 400 && r.url().startsWith(base) && !r.url().endsWith('/404.html') && !url.includes('404')) report(url, w, `HTTP ${r.status()} ${r.url()}`); });
    await page.goto(base + url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);
    await scrollThrough(page);

    const res = await page.evaluate(() => {
      const out = {};
      const de = document.documentElement;
      out.overflow = de.scrollWidth - de.clientWidth;
      out.offenders = [];
      if (out.overflow > 0) {
        document.querySelectorAll('body *').forEach((el) => {
          const r = el.getBoundingClientRect();
          if (r.right > de.clientWidth + 1 && r.width > 0 && getComputedStyle(el).position !== 'fixed' && !el.closest('.marquee, .journey__viewport, .mosaic, [aria-hidden=true]'))
            out.offenders.push(`${el.tagName.toLowerCase()}.${[...el.classList].join('.')} right=${Math.round(r.right)}`);
        });
        out.offenders = out.offenders.slice(0, 6);
      }
      out.brokenImgs = [...document.images].filter((i) => i.complete && i.naturalWidth === 0 && i.getAttribute('src')).map((i) => i.currentSrc || i.src);
      out.noAlt = [...document.images].filter((i) => !i.hasAttribute('alt')).map((i) => i.src);
      out.hidden = [...document.querySelectorAll('[data-reveal],[data-stagger] > *,[data-hero-item],[data-hero-img]')]
        .filter((el) => { const cs = getComputedStyle(el); return (Number(cs.opacity) < 0.05 || (cs.clipPath && cs.clipPath.includes('100%'))) && el.getClientRects().length && !el.closest('[hidden]'); })
        .map((el) => `${el.tagName.toLowerCase()}.${[...el.classList].join('.')}`).slice(0, 5);
      out.h1 = document.querySelectorAll('h1').length;
      out.links = [...document.querySelectorAll('a[href]')].map((a) => a.getAttribute('href'));
      out.smallTargets = [...document.querySelectorAll('a, button, input, select, summary')]
        .filter((el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && r.height < 24 && cs.visibility !== 'hidden' && !el.closest('p, li p, .prose, .crumbs, figcaption, .footer__bottom, .hp, .lede, .help, .note') && el.tagName !== 'INPUT'; })
        .map((el) => `${el.tagName.toLowerCase()}.${[...el.classList].join('.')}(${Math.round(el.getBoundingClientRect().height)}px) "${el.textContent.trim().slice(0, 30)}"`).slice(0, 5);
      // heading order
      const hs = [...document.querySelectorAll('h1,h2,h3,h4')].filter((h) => !h.closest('[hidden]'));
      out.headingSkips = [];
      for (let i = 1; i < hs.length; i++) { const a = +hs[i - 1].tagName[1], b = +hs[i].tagName[1]; if (b > a + 1) out.headingSkips.push(`${hs[i - 1].tagName}→${hs[i].tagName} "${hs[i].textContent.trim().slice(0, 30)}"`); }
      return out;
    });
    if (res.overflow > 0) report(url, w, `horizontal overflow ${res.overflow}px: ${res.offenders.join(', ')}`);
    if (res.brokenImgs.length) report(url, w, `broken images: ${res.brokenImgs.join(', ')}`);
    if (res.noAlt.length) report(url, w, `images without alt: ${res.noAlt.length}`);
    if (res.hidden.length) report(url, w, `still hidden after scroll: ${res.hidden.join(', ')}`);
    if (res.h1 !== 1) report(url, w, `h1 count = ${res.h1}`);
    if (w === 390 && res.smallTargets.length) report(url, w, `small tap targets: ${res.smallTargets.join(' | ')}`);
    if (w === 1440 && res.headingSkips.length) report(url, w, `heading skips: ${res.headingSkips.join(' | ')}`);
    if (w === 1440) {
      for (const href of new Set(res.links)) {
        if (!href.startsWith('/') || href.startsWith('//')) continue;
        const [p, hash] = href.split('#');
        let f = path.join(DIST, p);
        if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
        if (!fs.existsSync(f)) { report(url, w, `broken internal link ${href}`); continue; }
        if (hash && !/id="?/.test('') ) {
          const html = fs.readFileSync(f, 'utf8');
          if (!html.includes(`id="${hash}"`) && hash !== 'top') report(url, w, `missing anchor ${href}`);
        }
      }
    }
    if (SHOTS && (w === 1440 || w === 390)) {
      const name = (url === '/' ? 'home' : url.replace(/\//g, '-').replace(/^-|-$/g, '').replace('.html', '')) + `-${w}`;
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(400);
      await page.screenshot({ path: `qa/shots/${name}.png`, fullPage: true });
    }
    await ctx.close();
  }
  console.log('checked', url);
}

/* ---------------- Interaction tests ---------------- */
async function interactions() {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => report('interactions', 390, `page error: ${e.message}`));

  // Mobile menu
  await page.goto(base + '/', { waitUntil: 'networkidle' });
  await page.click('[data-menu-toggle]');
  await page.waitForTimeout(800);
  const open = await page.evaluate(() => ({ exp: document.querySelector('[data-menu-toggle]').getAttribute('aria-expanded'), vis: !document.querySelector('[data-mobile-menu]').hidden }));
  if (open.exp !== 'true' || !open.vis) report('menu', 390, 'mobile menu did not open');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(800);
  const closed = await page.evaluate(() => document.querySelector('[data-mobile-menu]').hidden);
  if (!closed) report('menu', 390, 'mobile menu did not close on Escape');
  await page.click('[data-menu-toggle]');
  await page.waitForTimeout(700);
  await page.click('.mm-link[href="/gallery/"]');
  await page.waitForURL('**/gallery/');
  console.log('menu ok');

  // Gallery filter + lightbox
  await page.waitForTimeout(800);
  await page.click('[data-filter="graduates"]');
  await page.waitForTimeout(1000);
  const shown = await page.evaluate(() => [...document.querySelectorAll('[data-gallery-item]')].filter((i) => !i.hidden).length);
  if (shown !== 5) report('gallery', 390, `graduates filter shows ${shown}, expected 5`);
  await page.click('[data-gallery-item]:not([hidden]) a');
  await page.waitForTimeout(800);
  const lb = await page.evaluate(() => ({ open: document.querySelector('[data-lightbox]').open, src: document.querySelector('[data-lb-img]').naturalWidth }));
  if (!lb.open || !lb.src) report('gallery', 390, `lightbox open=${lb.open} imgWidth=${lb.src}`);
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(800);
  const counter = await page.textContent('[data-lb-counter]');
  if (counter.trim() !== '2 / 5') report('gallery', 390, `lightbox counter after next = "${counter}"`);
  await page.keyboard.press('Escape');
  console.log('gallery ok');

  // Tabs
  await ctx.close();
  const ctx2 = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const p2 = await ctx2.newPage();
  await p2.goto(base + '/schools/high-school/', { waitUntil: 'networkidle' });
  await p2.click('#t-sss');
  const tabs = await p2.evaluate(() => ({ jss: document.getElementById('p-jss').hidden, sss: document.getElementById('p-sss').hidden }));
  if (!tabs.jss || tabs.sss) report('tabs', 1440, 'subject tabs did not switch');
  await p2.focus('#t-sss');
  await p2.keyboard.press('ArrowLeft');
  const back = await p2.evaluate(() => document.getElementById('t-jss').getAttribute('aria-selected'));
  if (back !== 'true') report('tabs', 1440, 'arrow-key tab navigation failed');
  console.log('tabs ok');

  // Age guide
  await p2.goto(base + '/schools/', { waitUntil: 'networkidle' });
  await p2.$eval('[data-age-input]', (el) => { el.value = '7'; el.dispatchEvent(new Event('input')); });
  const cls = await p2.textContent('[data-age-class]');
  if (cls.trim() !== 'Basic 3') report('ageguide', 1440, `age 7 → "${cls}", expected Basic 3`);
  console.log('age guide ok');

  // Forms: validation, mocked success, mocked failure (no real submission)
  let posted = null;
  await p2.route('https://formsubmit.co/**', async (route) => {
    posted = JSON.parse(route.request().postData());
    if (posted.parent_name === 'Fail Test') return route.fulfill({ status: 500, contentType: 'application/json', body: '{"success":"false"}' });
    return route.fulfill({ status: 200, contentType: 'application/json', body: '{"success":"true","message":"The form was submitted successfully."}' });
  });
  await p2.goto(base + '/admissions/', { waitUntil: 'networkidle' });
  await p2.click('#form-admission button[type=submit]');
  await p2.waitForTimeout(300);
  const errs = await p2.$$eval('#form-admission .field.is-invalid', (els) => els.length);
  if (errs < 6) report('form', 1440, `empty submit flagged ${errs} fields, expected 6`);
  if (posted) report('form', 1440, 'empty form was posted');
  await p2.fill('#form-admission-email', 'not-an-email');
  await p2.locator('#form-admission-email').blur();
  const emailErr = await p2.textContent('#form-admission-email-err');
  if (!/valid email/i.test(emailErr)) report('form', 1440, `email error text "${emailErr}"`);

  const fill = async (name) => {
    await p2.fill('#form-admission-parent', name);
    await p2.fill('#form-admission-child', 'Ada Test');
    await p2.fill('#form-admission-email', 'parent@example.com');
    await p2.fill('#form-admission-phone', '0812 345 6789');
    await p2.selectOption('#form-admission-level', 'Basic 3');
    await p2.check('input[name=day_or_boarding][value=Day]', { force: true });
  };
  await fill('Grace Test');
  await p2.click('#form-admission button[type=submit]');
  await p2.waitForSelector('#form-admission .form-status--success.is-shown', { timeout: 5000 }).catch(() => report('form', 1440, 'no success message after mocked success'));
  if (posted?.class_applying_for !== 'Basic 3' || posted?._subject?.includes('waoooo')) report('form', 1440, `posted payload unexpected ${JSON.stringify(posted)}`);
  await fill('Fail Test');
  await p2.click('#form-admission button[type=submit]');
  await p2.waitForSelector('#form-admission .form-status--error.is-shown', { timeout: 5000 }).catch(() => report('form', 1440, 'no error message after mocked failure'));
  const errText = await p2.textContent('#form-admission [data-status]');
  if (!/could not be sent/.test(errText)) report('form', 1440, `failure text "${errText}"`);
  console.log('forms ok');

  // FAQ accordion
  await p2.click('#faq details:nth-of-type(2) summary');
  const openCount = await p2.$$eval('#faq details[open]', (d) => d.length);
  if (openCount !== 1) report('faq', 1440, `exclusive accordion open count ${openCount}`);
  await ctx2.close();

  // Reduced motion: nothing stays hidden
  const ctx3 = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const p3 = await ctx3.newPage();
  await p3.goto(base + '/', { waitUntil: 'networkidle' });
  const hiddenRM = await p3.evaluate(() => [...document.querySelectorAll('[data-reveal],[data-hero-img],[data-hero-item],[data-split]')].filter((el) => { const cs = getComputedStyle(el); return Number(cs.opacity) < 0.05 || cs.visibility === 'hidden'; }).length);
  if (hiddenRM) report('reduced-motion', 1440, `${hiddenRM} elements hidden`);
  const yr = await p3.textContent('.stat__num');
  if (yr.trim() !== '1998') report('reduced-motion', 1440, `stat shows "${yr}"`);
  console.log('reduced motion ok');
  await ctx3.close();
}
if (!ONLY) await interactions();

await browser.close();
server.close();
console.log(`\n${problems.length} problem(s)`);
for (const p of problems) console.log(' - ' + p);
