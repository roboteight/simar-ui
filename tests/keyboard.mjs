// Keyboard check. Tabs through the whole demo page and checks that
//   - every stop shows a visible focus indicator (the control itself, or its styled stand-in),
//   - focus is never trapped (Tab reaches the end),
//   - the library raised no accessibility warnings of its own.
//   npm run test:a11y

import puppeteer from 'puppeteer-core';
import { PNG } from 'pngjs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const url = pathToFileURL(path.join(root, 'index.html')).href;

const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: 'new',
  args: ['--no-sandbox'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1000, height: 900 });
const theme = process.env.THEME ?? 'light'; // run once per theme: npm run test:a11y does both
await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }, { name: 'prefers-color-scheme', value: theme }]);
const warnings = [];
page.on('console', (m) => { if (['warn', 'warning'].includes(m.type()) && m.text().includes('[simar-ui]')) warnings.push(m.text()); });
await page.goto(url);
await new Promise((r) => setTimeout(r, 600));
// Self-test: SABOTAGE=1 removes every focus ring, and the run must fail.
if (process.env.SABOTAGE) await page.addStyleTag({ content: '*, *::before, *::after { outline: none !important; }' });

// Does the focused control show a focus ring? Computed styles can't answer this (rings are drawn
// on stand-in parts, or on pseudo-elements like a range thumb), so look at the pixels: screenshot
// the control's visual container and require the focus colour (#2f6fed) to be on screen.
let RING = [0x2f, 0x6f, 0xed]; // read from the page's --focus token below, since dark mode uses a lighter blue
const readRing = async () => {
  const hex = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--focus').trim());
  RING = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
};
const indicator = async () => {
  const target = await page.evaluate(() => {
    const el = document.activeElement;
    if (!el || el === document.body) return null;
    const box = el.closest('.well, .knob, .rknob, .field, .code__body, .snippet, .day, .accordion__item') ?? el;
    const r = box.getBoundingClientRect();
    const name = `${el.tagName.toLowerCase()}${el.name ? `[name=${el.name}]` : el.id ? `#${el.id}` : ''}${el.className ? '.' + String(el.className).split(' ')[0] : ''}`;
    // WCAG 2.4.11: the floating toggle must not hide what has focus.
    let covered = 0;
    for (const fixed of [...document.querySelectorAll('.jsbar > .well, .themebar > .well')].map((n) => n.getBoundingClientRect())) {
      if (box.closest('.jsbar, .themebar')) continue;
      const w = Math.max(0, Math.min(r.right, fixed.right) - Math.max(r.left, fixed.left));
      const h = Math.max(0, Math.min(r.bottom, fixed.bottom) - Math.max(r.top, fixed.top));
      covered = Math.max(covered, (w * h) / Math.max(1, r.width * r.height));
    }
    return { name, covered, x: r.x + scrollX - 14, y: r.y + scrollY - 14, width: r.width + 28, height: r.height + 28 };
  });
  if (!target) return { ok: true, name: '(body)' };
  const clip = { x: Math.max(0, target.x), y: Math.max(0, target.y), width: Math.min(target.width, 960), height: Math.min(target.height, 700) };
  const png = PNG.sync.read(await page.screenshot({ clip, captureBeyondViewport: true }));
  let hits = 0;
  for (let i = 0; i < png.data.length; i += 4) {
    if (RING.every((c, k) => Math.abs(png.data[i + k] - c) < 14)) hits++;
  }
  return { ok: hits >= 25, name: target.name, covered: target.covered };
};

await readRing(); // the focus ring colour is a theme token
const missing = [];
const hidden = [];
let stops = 0;
// A date or time field keeps focus while Tab walks its segments (month, day, year, hour...), so the
// same element coming back a few times in a row is normal. A real trap keeps it forever.
let sameRun = 0;
let trapped = false;
for (; stops < 700; stops++) {
  await page.keyboard.press('Tab');
  // <body> means focus has left the page's last control.
  const state = await page.evaluate(() => {
    const same = window.__prev === document.activeElement;
    window.__prev = document.activeElement;
    return { same, body: document.activeElement === document.body };
  });
  if (state.body) break;
  sameRun = state.same ? sameRun + 1 : 0;
  if (sameRun > 8) { trapped = true; break; }
  if (state.same) continue;
  const r = await indicator();
  if (!r.ok && !missing.includes(r.name)) missing.push(r.name);
  if (r.covered > 0.5 && !hidden.includes(r.name)) hidden.push(r.name);
}

console.log(`${theme} theme: tabbed through ${stops} stops`);
console.log(missing.length ? `✗ no visible focus indicator on: ${missing.join(', ')}` : '✓ every stop shows a focus indicator');
console.log(hidden.length ? `✗ focus is hidden behind the floating button on: ${hidden.join(', ')}` : '✓ focus is never hidden behind the floating button');
console.log(trapped || stops >= 700 ? '✗ focus did not reach the end (a trap?)' : '✓ focus is not trapped, and reaches the end of the page');
console.log(warnings.length ? `✗ the library warned:\n  ${warnings.join('\n  ')}` : '✓ the library raised no accessibility warnings');
await browser.close();
process.exit(missing.length || hidden.length || trapped || stops >= 700 || warnings.length ? 1 : 0);
