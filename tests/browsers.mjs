// Cross-browser smoke test: the same page, the same axe run and the same key behaviors in another engine.
//   BROWSER=firefox node tests/browsers.mjs                 Firefox, driven by Puppeteer (FIREFOX_PATH if not in /Applications)
//   BROWSER=webkit  PLAYWRIGHT_DIR=/path node tests/browsers.mjs
//                                                           WebKit (the engine inside Safari), driven by Playwright installed
//                                                           in PLAYWRIGHT_DIR (npm i playwright; npx playwright install webkit)
// Chromium browsers (Chrome, Edge) run the full suite instead: CHROME_PATH=".../Microsoft Edge" npm run test:a11y.
// This is a smoke test, not the whole suite: the full suite leans on Chrome's automation (pixel focus checks, the
// accessibility tree). Differences it finds are listed; features a browser lacks are reported, not failed, because the
// library has fallbacks for them. Safari itself (not just WebKit) still needs a hand check.

import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const which = process.env.BROWSER ?? 'firefox';
const require = createRequire(import.meta.url);
const axeSource = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const site = (file) => pathToFileURL(path.join(root, file)).href;
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// ---- the adapter: one small surface over Puppeteer and Playwright ----------------------------------
let browser;
let page;
const errors = [];
if (which === 'firefox') {
  const puppeteer = (await import('puppeteer-core')).default;
  browser = await puppeteer.launch({ browser: 'firefox', executablePath: process.env.FIREFOX_PATH ?? '/Applications/Firefox.app/Contents/MacOS/firefox', headless: true });
  page = await browser.newPage();
} else if (which === 'webkit') {
  const dir = process.env.PLAYWRIGHT_DIR;
  if (!dir) throw new Error('Set PLAYWRIGHT_DIR to a folder with playwright installed.');
  const { webkit } = await import(pathToFileURL(path.join(dir, 'node_modules', 'playwright', 'index.mjs')).href);
  browser = await webkit.launch();
  page = await browser.newPage();
} else throw new Error(`Unknown BROWSER: ${which}`);
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', (e) => errors.push(String(e)));

const b = {
  async open(file, { width = 1280, scheme = 'light', blockScript = false } = {}) {
    if (which === 'webkit') {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ colorScheme: scheme, reducedMotion: 'reduce' });
      await page.route('**/*', (route) => (blockScript && route.request().url().endsWith('/dist/simar-ui.js') ? route.abort() : route.continue()));
    } else {
      await page.setViewport({ width, height: 900 });
      await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: scheme }, { name: 'prefers-reduced-motion', value: 'reduce' }]).catch(() => {});
    }
    await page.goto(site(file));
    await page.addStyleTag({ content: 'html { scroll-behavior: auto !important; }' });
    await wait(700);
  },
  eval: (fn, arg) => page.evaluate(fn, arg),
  click: (selector) => page.click(selector),
  press: (key) => page.keyboard.press(key),
  type: (text) => page.keyboard.type(text),
  focus: (selector) => page.focus(selector),
};

let failures = 0;
const notes = [];
const pass = (m) => console.log(`  ✓ ${m}`);
const fail = (m) => { failures++; console.log(`  ✗ ${m}`); };
const check = (ok, good, bad) => (ok ? pass(good) : fail(bad));
const section = (t) => console.log(`\n${t}`);

console.log(`Browser: ${which} ${browser.version ? await browser.version() : ''}`.trim());

// ---- axe, light and dark, desktop and phone ---------------------------------------------------------
section('axe');
const axe = async (label) => {
  await b.eval(axeSource);
  const r = await b.eval(() => axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] } }).then((x) => ({ v: x.violations.map((v) => `${v.id} (${v.nodes.slice(0, 3).map((n) => n.target.join(' ')).join('; ')})`), passes: x.passes.length })));
  check(r.v.length === 0, `axe is clean, ${label} (${r.passes} rules passed)`, `axe, ${label}: ${r.v.join(', ')}`);
};
for (const [file, scheme, width] of [['index.html', 'light', 1280], ['index.html', 'dark', 1280], ['index.html', 'light', 320], ['docs/flows.html', 'light', 1280], ['docs/flows.html', 'dark', 320]]) {
  await b.open(file, { scheme, width });
  await axe(`${file}, ${scheme}, ${width}px`);
}
await b.open('index.html', { scheme: 'light', blockScript: true });
await axe('index.html with the script blocked');

// ---- what the engine supports, and what the page did with it ----------------------------------------
section('Platform features (reported, not failed: the library has fallbacks)');
await b.open('index.html');
const feats = await b.eval(() => ({
  has: CSS.supports('selector(:has(a))'), popover: 'popover' in HTMLElement.prototype, command: 'command' in HTMLButtonElement.prototype,
  startingStyle: CSS.supports('selector(:popover-open)'), colorMix: CSS.supports('color', 'color-mix(in srgb, red, blue)'), search: typeof HTMLElement !== 'undefined' && !!document.createElement('search'),
  dialog: typeof HTMLDialogElement === 'function', property: !!(window.CSS && CSS.registerProperty), forcedColors: matchMedia('(forced-colors: none)').matches, checkVisibility: 'checkVisibility' in Element.prototype,
}));
for (const [k, v] of Object.entries(feats)) console.log(`  ${v ? '·' : '!'} ${k}: ${v ? 'supported' : 'not supported'}`);
const jsOn = await b.eval(() => document.documentElement.dataset.js);
check(jsOn === 'on', 'the script ran and set data-js="on"', `data-js is ${jsOn}`);

// ---- behaviors ---------------------------------------------------------------------------------------
section('Behavior');
const sel = (s) => document.querySelector(s);
await b.eval(() => document.querySelector('[data-dialog-open="settings"]').scrollIntoView({ block: 'center', behavior: 'instant' }));
await b.click('[data-dialog-open="settings"]');
await wait(400);
check(await b.eval(() => document.getElementById('settings').open), 'the dialog opens as a modal', 'the dialog did not open');
check(await b.eval(() => document.getElementById('settings').contains(document.activeElement)), 'focus moves inside the dialog', 'focus did not move into the dialog');
await b.press('Escape');
await wait(300);
check(await b.eval(() => !document.getElementById('settings').open && document.activeElement.getAttribute('data-dialog-open') === 'settings'), 'Esc closes it and focus returns to the key that opened it', 'dialog Esc/focus return failed');

await b.eval(() => document.querySelector('[data-dialog-open="share-sheet"]').scrollIntoView({ block: 'center', behavior: 'instant' }));
await b.click('[data-dialog-open="share-sheet"]');
await wait(450);
check(await b.eval(() => { const d = document.getElementById('share-sheet'), r = d.getBoundingClientRect(); return d.open && Math.abs(r.bottom - innerHeight) <= 1; }), 'the bottom sheet opens docked to the bottom edge', 'bottom sheet not docked');
await b.press('Escape');
await wait(300);

await b.eval(() => document.getElementById('dial-end').scrollIntoView({ block: 'center', behavior: 'instant' }));
await b.focus('#dial-end summary');
await b.press('Enter');
await wait(200);
check(await b.eval(() => document.getElementById('dial-end').open && document.querySelector('#dial-end .speed-dial__list').checkVisibility()), 'Enter opens the speed dial and shows its actions', 'speed dial did not open');
await b.press('Escape');
await wait(150);
check(await b.eval(() => !document.getElementById('dial-end').open && document.activeElement === document.querySelector('#dial-end summary')), 'Esc closes it and returns focus to its key', 'speed dial Esc failed');

await b.eval(() => document.getElementById('tp-call').scrollIntoView({ block: 'center', behavior: 'instant' }));
await b.click('#tp-call ~ .timepicker__button');
await wait(350);
check(await b.eval(() => document.querySelector('#tp-call ~ .timepicker__pop').matches(':popover-open')), 'the time picker popover opens', 'time picker did not open');
const hourBefore = await b.eval(() => document.getElementById('tp-call').value);
await b.press('ArrowRight');
await wait(80);
check(await b.eval((v) => document.getElementById('tp-call').value !== v, hourBefore), 'an arrow key changes the hour and writes the field', 'time picker arrow did nothing');
await b.press('Escape');
await wait(250);

await b.eval(() => document.getElementById('crew-swipe').scrollIntoView({ block: 'center', behavior: 'instant' }));
await b.click('#crew-swipe > li:nth-child(1) .swipe-list__toggle');
await wait(300);
check(await b.eval(() => { const li = document.querySelector('#crew-swipe > li:nth-child(1)'); return li.classList.contains('is-open') && getComputedStyle(li.querySelector('.swipe-list__actions')).visibility === 'visible'; }), 'the swipe-list key opens a row and shows its actions', 'swipe list did not open');
await b.press('Escape');

await b.eval(() => document.getElementById('crew-q').scrollIntoView({ block: 'center', behavior: 'instant' }));
check(await b.eval(() => !document.querySelector('#crew-q ~ [data-clear]').hidden), 'the search bar shows Clear while it has text', 'search Clear hidden with text');
await b.click('#crew-q ~ [data-clear]');
check(await b.eval(() => document.getElementById('crew-q').value === '' && document.activeElement.id === 'crew-q'), 'Clear empties the field and returns focus to it', 'search Clear failed');

await b.eval(() => document.getElementById('manifest-wizard').scrollIntoView({ block: 'center', behavior: 'instant' }));
await b.click('#manifest-wizard [data-next]');
check(await b.eval(() => !document.querySelector('#manifest-wizard .wizard__step').hidden && document.activeElement.id === 'wz-name'), 'the wizard will not move on with a required field empty', 'wizard validation failed');
await b.click('#wz-name');
await b.type('Ellen Ripley');
await b.press('Enter');
await wait(150);
check(await b.eval(() => document.activeElement.tagName === 'LEGEND' && document.getElementById('manifest-done').textContent === ''), 'Enter goes to the next step (no early submit) and focuses its heading', 'wizard Enter/focus failed');

// ---- keyboard and focus -------------------------------------------------------------------------------
section('Keyboard');
await b.open('index.html');
let missing = [];
let tabs = 0;
for (let i = 0; i < 80; i++) {
  await b.press('Tab');
  const r = await b.eval(() => {
    const el = document.activeElement;
    if (!el || el === document.body) return { body: true };
    const box = el.closest('.well, .rating__star, .field, .chip, .knob, .rknob, .day, .accordion__item, .card, .code__body') ?? el;
    const ring = (c) => (c.outlineStyle !== 'none' && parseFloat(c.outlineWidth) > 0) || (c.boxShadow !== 'none' && /rgb/.test(c.boxShadow));
    const r = el.getBoundingClientRect();
    return { name: el.tagName + (el.id ? `#${el.id}` : el.className ? `.${String(el.className).split(' ')[0]}` : ''), ring: ring(getComputedStyle(el)) || ring(getComputedStyle(box)) || getComputedStyle(el, ':focus-visible').outlineStyle !== 'none', visible: r.width > 0 };
  });
  if (r.body) break;
  tabs++;
  if (!r.ring && r.visible && !missing.includes(r.name)) missing.push(r.name);
}
check(tabs >= 40, `Tab moved through ${tabs} stops without getting stuck`, `Tab got stuck after ${tabs} stops`);
check(missing.length === 0, 'every stop has an outline or a ring', `no ring found on: ${missing.join(', ')}`);

// ---- reflow --------------------------------------------------------------------------------------------
section('Reflow');
for (const file of ['index.html', 'docs/flows.html']) {
  await b.open(file, { width: 320 });
  check(await b.eval(() => document.documentElement.scrollWidth <= innerWidth + 1), `${file} has no sideways scroll at 320px`, `${file} scrolls sideways at 320px`);
}

section('Console');
const real = errors.filter((e) => !/Failed to load resource|favicon|manifest|service ?worker|ServiceWorker|tiles?\.|openstreetmap|ERR_/i.test(e));
check(real.length === 0, 'no script errors', `console errors: ${real.slice(0, 5).join(' | ')}`);

await browser.close();
console.log(failures ? `\n✗ ${failures} ${which} check(s) failed` : `\n✓ ${which} checks passed`);
process.exit(failures ? 1 : 0);
