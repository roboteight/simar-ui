// WCAG 2.2 AA checks that axe doesn't cover. Run with `npm run test:a11y`.
//   1.4.10 Reflow           no horizontal page scroll at 320px wide, axe clean at that width
//   1.4.11 / forced colours controls stay visible and distinguishable with forced-colors: active
//   2.3.3  Reduced motion   nothing transitions when prefers-reduced-motion is set
//   2.5.8  Target size      every interactive target is at least 24x24 CSS px
//   2.5.7  Dragging         knobs and two-handle ranges can be set with a plain click
//   4.1.2  Name, role, value the accessibility tree describes each control the way a screen reader would
// Exits non-zero on any failure.

import { PNG } from 'pngjs';
import puppeteer from 'puppeteer-core';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const require = createRequire(import.meta.url);
const axeSource = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const url = (q = '') => pathToFileURL(path.join(root, 'index.html')).href + q;
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: 'new',
  args: ['--no-sandbox'],
});
const page = await browser.newPage();
let failures = 0;
const fail = (msg) => { failures++; console.log(`  ✗ ${msg}`); };
const pass = (msg) => console.log(`  ✓ ${msg}`);

const open = async (width, query = '') => {
  await page.setViewport({ width, height: 900 });
  await page.goto(url(query));
  await wait(600);
};

// ---- 1.4.10 Reflow -----------------------------------------------------------------------
console.log('\nReflow at 320px (a 1280px screen at 400% zoom)');
await open(320);
const reflow = await page.evaluate(() => {
  const limit = document.documentElement.clientWidth;
  const scrollers = (n) => n.closest('pre, .ref-scroll, .table-wrap, .code__body, .snippet__tabs, .daterange__pop'); // may scroll on their own
  const wide = [...document.body.querySelectorAll('*')]
    .filter((n) => !n.closest('svg, [hidden], .needs-js:not(:root *)') && !scrollers(n) && n.getBoundingClientRect().width)
    .filter((n) => n.getBoundingClientRect().right > limit + 1)
    .map((n) => `${n.tagName.toLowerCase()}.${String(n.className).split(' ')[0]} (right edge ${Math.round(n.getBoundingClientRect().right)}px)`);
  return { pageOverflow: document.documentElement.scrollWidth - limit, wide: [...new Set(wide)].slice(0, 8) };
});
reflow.pageOverflow > 1 ? fail(`page scrolls sideways by ${reflow.pageOverflow}px`) : pass('no horizontal page scroll');
reflow.wide.length ? fail(`content wider than the screen: ${reflow.wide.join('; ')}`) : pass('nothing wider than the screen');
await page.evaluate(axeSource);
const axe320 = await page.evaluate(() => axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'] }));
axe320.violations.length ? fail(`axe at 320px: ${axe320.violations.map((v) => v.id).join(', ')}`) : pass('axe is clean at 320px');

// ---- 2.5.8 Target size -------------------------------------------------------------------
console.log('\nTarget size (minimum 24x24 CSS px)');
await open(1000);
const small = await page.evaluate(() => {
  const visible = (n) => { const r = n.getBoundingClientRect(); const s = getComputedStyle(n); return r.width && s.visibility !== 'hidden' && s.display !== 'none' && !n.closest('[hidden], dialog:not([open]), .needs-js:not(:root *)'); };
  // Hidden native inputs are operated through their visible stand-in (the key, the dial), which is measured instead.
  const targets = [...document.querySelectorAll('button, a[href], summary, input:not([type="radio"]):not([type="checkbox"]):not(.fader):not(.knob input):not(.rknob input):not(.range2 input), .key, .day, label.well, .knob__dial, .rknob__handle')]
    .filter(visible).filter((n) => !n.closest('.knob__tick-label'))
    // A link inside a sentence is exempt (WCAG 2.5.8, "inline"): its size is set by the text around it.
    .filter((n) => !(n.matches('a') && [...n.parentElement.childNodes].some((c) => c.nodeType === 3 && c.textContent.trim())));
  return targets.map((n) => { const r = n.getBoundingClientRect(); return { n: `${n.tagName.toLowerCase()}${n.className ? '.' + String(n.className).split(' ')[0] : ''} "${(n.textContent || n.getAttribute('aria-label') || '').trim().slice(0, 18)}"`, w: Math.round(r.width), h: Math.round(r.height) }; })
    .filter((t) => t.w < 24 || t.h < 24);
});
small.length ? fail(`too small: ${small.slice(0, 6).map((s) => `${s.n} ${s.w}x${s.h}`).join('; ')}`) : pass('every interactive target is at least 24x24');

// ---- reduced motion ----------------------------------------------------------------------
console.log('\nReduced motion');
await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
await open(1000);
await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
await page.reload();
await wait(600);
const moving = await page.evaluate(() => {
  const dur = (v) => v.split(',').some((d) => parseFloat(d) > 0.001 * (d.includes('ms') ? 1 : 1000) && parseFloat(d) > 0);
  const found = new Set();
  for (const n of document.querySelectorAll('*')) for (const pseudo of [null, '::before', '::after', '::details-content', '::backdrop']) {
    let cs; try { cs = getComputedStyle(n, pseudo); } catch { continue; }
    if (cs.transitionDuration && cs.transitionDuration.split(',').some((d) => parseFloat(d) > 0)) found.add(`${n.tagName.toLowerCase()}.${String(n.className).split(' ')[0]}${pseudo ?? ''}: ${cs.transitionDuration}`);
    if (cs.animationName !== 'none' && cs.animationDuration.split(',').some((d) => parseFloat(d) > 0)) found.add(`${n.tagName.toLowerCase()}.${String(n.className).split(' ')[0]} animation`);
  }
  return [...found].slice(0, 8);
});
moving.length ? fail(`still animating with reduced motion: ${moving.join('; ')}`) : pass('no transitions or animations');
await page.emulateMediaFeatures([]);

// ---- forced colours ----------------------------------------------------------------------
console.log('\nForced colours (Windows High Contrast)');
await page.emulateMediaFeatures([{ name: 'forced-colors', value: 'active' }]);
await page.reload();
await wait(600);
const forced = await page.evaluate(() => {
  const issues = [];
  const edge = (n) => { const s = getComputedStyle(n); return ['Top', 'Right', 'Bottom', 'Left'].some((side) => s[`border${side}Style`] !== 'none' && parseFloat(s[`border${side}Width`]) > 0); };
  for (const key of document.querySelectorAll('button.key:not(:disabled), a.key')) if (!edge(key)) issues.push(`key has no border: "${key.textContent.trim().slice(0, 14)}"`);
  // A gradient behind text makes the browser paint a plate behind it (a white box over the label).
  for (const node of document.querySelectorAll('.key, .lcd, .code pre, .daterange__field input')) {
    if (getComputedStyle(node).backgroundImage !== 'none') { issues.push(`gradient still painted in forced colours: ${node.className || node.tagName}`); break; }
  }
  for (const panel of [...document.querySelectorAll('.panel')].slice(0, 3)) if (!edge(panel)) { issues.push('a panel has no visible edge'); break; }
  for (const field of [...document.querySelectorAll('.input:not(:disabled)')].slice(0, 6)) if (!edge(field)) { issues.push('a form field has no visible edge'); break; }
  const checked = document.querySelector('input[name="mode"]:checked + .key');
  const unchecked = document.querySelector('input[name="mode"]:not(:checked):not(:disabled) + .key');
  if (checked && unchecked && getComputedStyle(checked).backgroundColor === getComputedStyle(unchecked).backgroundColor) issues.push('the selected key looks the same as an unselected one');
  return issues;
});
forced.length ? forced.forEach(fail) : pass('keys keep a border and the selected state is distinguishable');
await page.screenshot({ path: path.join(process.env.TMPDIR ?? '/tmp', 'simar-ui-forced-colors.png') });
// The fader cap is a pseudo-element, which getComputedStyle reports unreliably under forced colours,
// so look at the pixels: the middle of the cap must not be the page's own background.
await page.$eval('#bright', (n) => n.scrollIntoView({ block: 'center', behavior: 'instant' }));
await wait(200);
const capPoint = await page.$eval('#bright', (n) => { const r = n.getBoundingClientRect(); const f = (n.value - n.min) / (n.max - n.min); return { x: r.left + scrollX + 22 + f * (r.width - 44), y: r.top + scrollY + r.height / 2, bgY: r.top + scrollY - 6 }; });
const capShot = PNG.sync.read(await page.screenshot({ clip: { x: Math.round(capPoint.x) - 1, y: Math.round(capPoint.y) - 1, width: 3, height: 3 } }));
const bgShot = PNG.sync.read(await page.screenshot({ clip: { x: Math.round(capPoint.x) - 1, y: Math.max(0, Math.round(capPoint.bgY) - 1), width: 3, height: 3 } }));
const capPx = [...capShot.data.slice(0, 3)];
const bgPx = [...bgShot.data.slice(0, 3)];
capPx.some((c, k) => Math.abs(c - bgPx[k]) > 40) ? pass('the fader cap is filled (not the same as the page) under forced colours') : fail(`fader cap pixel ${capPx} matches the background ${bgPx}`);
await page.emulateMediaFeatures([]);

// ---- 1.4.11 Non-text contrast ------------------------------------------------------------
console.log('\nNon-text contrast of the preloader (3:1 or better), in both themes');
for (const theme of ['light', 'dark']) {
  await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: theme }, { name: 'prefers-reduced-motion', value: 'reduce' }]);
  await open(1000);
  await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: theme }, { name: 'prefers-reduced-motion', value: 'reduce' }]);
  await page.reload();
  await wait(700);
  const ratios = await page.evaluate(() => {
    const ctx = document.createElement('canvas').getContext('2d', { willReadFrequently: true });
    ctx.canvas.width = ctx.canvas.height = 1;
    const rgb = (css) => { ctx.clearRect(0, 0, 1, 1); ctx.fillStyle = '#000'; ctx.fillStyle = css; ctx.fillRect(0, 0, 1, 1); const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data; return [r, g, b]; };
    const lum = ([r, g, b]) => { const [x, y, z] = [r, g, b].map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return 0.2126 * x + 0.7152 * y + 0.0722 * z; };
    const ratio = (a, b) => { const [hi, lo] = [lum(rgb(a)), lum(rgb(b))].sort((p, q) => q - p); return (hi + 0.05) / (lo + 0.05); };
    const root = getComputedStyle(document.querySelector('#progress-demo'));
    const bar = getComputedStyle(document.querySelector('#upload'));
    const lit = bar.color;                                           // the fill and the spinner's lit tick
    const get = (name) => root.getPropertyValue(name).trim();
    return {
      'bar fill vs groove (top)': ratio(lit, get('--groove-top')),
      'bar fill vs groove (bottom)': ratio(lit, get('--groove-bottom')),
      'lit spinner tick vs panel (top)': ratio(lit, get('--surface-top')),
      'lit spinner tick vs panel (bottom)': ratio(lit, get('--surface-bottom')),
    };
  });
  for (const [label, value] of Object.entries(ratios)) value >= 3 ? pass(`${theme}: ${label} ${value.toFixed(1)}:1`) : fail(`${theme}: ${label} is only ${value.toFixed(1)}:1`);
}
await page.emulateMediaFeatures([]);

// ---- 1.4.13 Content on hover or focus (tooltips) -----------------------------------------
console.log('\nTooltips (dismissible, hoverable, persistent, keyboard, described)');
await open(1000);
const shownTip = () => page.evaluate(() => { const t = document.querySelector('[role="tooltip"]:popover-open'); return t ? t.textContent : null; });
const keyboardFocus = async (selector) => {
  await page.$eval(selector, (n) => n.scrollIntoView({ block: 'center', behavior: 'instant' }));
  await page.keyboard.press('Tab'); // puts the page in keyboard mode, so :focus-visible applies
  await page.$eval(selector, (n) => n.focus());
  await wait(200);
};
const save = '#tooltip-demo button[data-tooltip="Saves a copy to this device"]';
const gear = '#tooltip-demo button[data-tooltip="Settings"]';

await keyboardFocus(save);
(await shownTip()) === 'Saves a copy to this device' ? pass('appears on keyboard focus') : fail(`no tooltip on keyboard focus (got ${await shownTip()})`);
const wiring = await page.evaluate((sel) => { const b = document.querySelector(sel); const ids = (b.getAttribute('aria-describedby') ?? '').split(' ').filter(Boolean); const t = ids.map((id) => document.getElementById(id)).find((n) => n?.getAttribute('role') === 'tooltip'); return { linked: !!t, text: t?.textContent }; }, save);
wiring.linked && wiring.text === 'Saves a copy to this device' ? pass('linked to its key with aria-describedby') : fail('the tooltip is not linked with aria-describedby');
const described = await page.accessibility.snapshot({ interestingOnly: true });
const flat = []; (function w(n) { flat.push(n); (n.children ?? []).forEach(w); })(described);
const saveNode = flat.find((n) => n.role === 'button' && n.name === 'Save');
saveNode?.description === 'Saves a copy to this device' ? pass('a screen reader gets it as the key\'s description') : fail(`the accessibility tree description is ${JSON.stringify(saveNode?.description)}`);
const dup = await page.$eval(gear, (b) => ({ label: b.getAttribute('aria-label'), described: b.hasAttribute('aria-describedby') }));
dup.label === 'Settings' && !dup.described ? pass('an icon-only key keeps its aria-label, and is not described twice') : fail(`icon-only key: ${JSON.stringify(dup)}`);

await page.keyboard.press('Escape');
await wait(150);
const afterEsc = await page.evaluate((sel) => ({ shown: !!document.querySelector('[role="tooltip"]:popover-open'), stillFocused: document.activeElement === document.querySelector(sel) }), save);
!afterEsc.shown && afterEsc.stillFocused ? pass('Esc dismisses it and focus stays where it was') : fail(`after Esc: ${JSON.stringify(afterEsc)}`);

await page.$eval(save, (n) => n.blur());
await wait(150);
(await shownTip()) === null ? pass('goes away when focus leaves') : fail('stays after focus leaves');

// mouse: waits a moment, can be reached, and stays
await page.$eval(save, (n) => n.scrollIntoView({ block: 'center', behavior: 'instant' }));
await wait(200);
const rectOf = (selector) => page.$eval(selector, (n) => { const r = n.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; });
const key = await rectOf(save);
await page.mouse.move(key.x + key.w / 2, key.y + key.h / 2);
await wait(120);
const early = await shownTip();
await wait(700);
const later = await shownTip();
early === null && later ? pass('mouse hover waits a moment, then shows') : fail(`hover timing: after 120ms ${early}, after 820ms ${later}`);
const tipRect = await page.evaluate(() => { const r = document.querySelector('[role="tooltip"]:popover-open')?.getBoundingClientRect(); return r && { x: r.x, y: r.y, w: r.width, h: r.height }; });
if (tipRect) {
  await page.mouse.move(tipRect.x + tipRect.w / 2, tipRect.y + tipRect.h / 2, { steps: 8 });
  await wait(600);
  (await shownTip()) ? pass('stays when the pointer moves onto it (hoverable)') : fail('it vanished as the pointer moved onto it');
  await wait(1800);
  (await shownTip()) ? pass('stays as long as the pointer is on it (persistent)') : fail('it timed out while hovered');
}
await page.mouse.move(5, 5);
await wait(600);
(await shownTip()) === null ? pass('goes away when the pointer leaves') : fail('stays after the pointer leaves');

// at the edge of the screen it stays on screen (the appearance control is top right)
await keyboardFocus('#appearance');
const edge = await page.evaluate(() => { const r = document.querySelector('[role="tooltip"]:popover-open')?.getBoundingClientRect(); return r && { l: Math.round(r.left), r: Math.round(r.right), t: Math.round(r.top), b: Math.round(r.bottom), w: innerWidth, h: innerHeight }; });
edge && edge.l >= 0 && edge.r <= edge.w && edge.t >= 0 && edge.b <= edge.h ? pass(`stays on screen at the page edge (${edge.l}-${edge.r} of ${edge.w})`) : fail(`off screen: ${JSON.stringify(edge)}`);
await page.keyboard.press('Escape');

for (const theme of ['light', 'dark']) {
  await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: theme }]);
  await page.reload();
  await wait(500);
  const ratio = await page.evaluate(() => {
    const ctx = document.createElement('canvas').getContext('2d', { willReadFrequently: true }); ctx.canvas.width = ctx.canvas.height = 1;
    const rgb = (css) => { ctx.clearRect(0, 0, 1, 1); ctx.fillStyle = '#000'; ctx.fillStyle = css; ctx.fillRect(0, 0, 1, 1); return [...ctx.getImageData(0, 0, 1, 1).data].slice(0, 3); };
    const lum = (c) => { const [x, y, z] = c.map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return 0.2126 * x + 0.7152 * y + 0.0722 * z; };
    const cs = getComputedStyle(document.querySelector('[role="tooltip"]'));
    const [hi, lo] = [lum(rgb(cs.color)), lum(rgb(cs.backgroundColor))].sort((a, b) => b - a);
    return (hi + 0.05) / (lo + 0.05);
  });
  ratio >= 4.5 ? pass(`${theme}: text contrast ${ratio.toFixed(1)}:1`) : fail(`${theme}: tooltip text contrast is only ${ratio.toFixed(1)}:1`);
}
await page.emulateMediaFeatures([]);

// ---- table of contents ----------------------------------------------------------------------
console.log('\nTable of contents');
await open(1280);
const toc = await page.evaluate(() => {
  const heads = [...document.querySelectorAll('main > section[aria-labelledby] > h3[id]')].map((h) => h.id);
  const links = [...document.querySelectorAll('.toc a[href^="#"]')].map((a) => a.getAttribute('href').slice(1));
  const nav = document.querySelector('nav.toc');
  const r = nav.getBoundingClientRect(); const m = document.querySelector('main').getBoundingClientRect();
  return { missing: heads.filter((id) => !links.includes(id)), dead: links.filter((id) => !document.getElementById(id)), landmark: nav.getAttribute('aria-label'), fixed: getComputedStyle(nav).position, right: Math.round(r.right), left: Math.round(r.left), mainLeft: Math.round(m.left) };
});
toc.missing.length ? fail(`sections with no link: ${toc.missing.join(', ')}`) : pass('every section is linked');
toc.dead.length ? fail(`links to nothing: ${toc.dead.join(', ')}`) : pass('every link goes somewhere');
toc.landmark ? pass(`is a navigation landmark ("${toc.landmark}")`) : fail('the contents has no label');
toc.fixed === 'fixed' && toc.left >= 0 && toc.right <= toc.mainLeft ? pass(`floats on the left, clear of the content (${toc.left}-${toc.right}px, page starts at ${toc.mainLeft}px)`) : fail(`placement: ${JSON.stringify(toc)}`);
await page.$eval('#knobs', (n) => n.scrollIntoView({ behavior: 'instant' }));
await wait(500);
const current = await page.$$eval('.toc a[aria-current="location"]', (n) => n.map((a) => a.getAttribute('href')));
current.length === 1 && current[0] === '#knobs' ? pass('marks the section being read (aria-current)') : fail(`current: ${JSON.stringify(current)}`);
await page.evaluate(() => scrollTo(0, 0));
await page.click('.toc a[href="#spinners"]');
let last = -1;
for (let i = 0; i < 40; i++) { await wait(100); const y = await page.evaluate(() => scrollY); if (y === last) break; last = y; } // wait for the smooth scroll to finish
const landed = await page.evaluate(() => ({ hash: location.hash, top: Math.round(document.getElementById('spinners').getBoundingClientRect().top) }));
landed.hash === '#spinners' && landed.top >= 0 && landed.top < 120 ? pass(`a link takes you to its section (heading ${landed.top}px from the top)`) : fail(`link landed at ${JSON.stringify(landed)}`);
await open(1280, '?js=off');
await page.click('.toc a[href="#tooltips"]');
await wait(500);
(await page.evaluate(() => location.hash)) === '#tooltips' ? pass('the links work with JavaScript off') : fail('the contents does not work without JavaScript');

// ---- checkboxes and switches ------------------------------------------------------------------
console.log('\nCheckboxes and switches');
await open(1000);
const state = (name) => page.$eval(`input[name="${name}"]`, (i) => ({ checked: i.checked, indeterminate: i.indeterminate }));
await page.$eval('input[name="reminders"]', (n) => n.scrollIntoView({ block: 'center', behavior: 'instant' }));
await page.keyboard.press('Tab');
await page.$eval('input[name="reminders"]', (n) => n.focus());
await page.keyboard.press('Space');
(await state('reminders')).checked ? pass('Space toggles a checkbox') : fail('Space did not toggle the checkbox');
await page.click('label.check:has(input[name="reminders"]) .check__text');
!(await state('reminders')).checked ? pass('clicking the label toggles it') : fail('clicking the label did not toggle it');
const mixed = await page.$eval('input[name="everything"]', (i) => i.indeterminate);
mixed ? pass('data-indeterminate gives the mixed state') : fail('the mixed state was not set');
await page.click('label.check:has(input[name="everything"]) .key');
const afterClick = await state('everything');
!afterClick.indeterminate && afterClick.checked ? pass('pressing a mixed box resolves it to checked') : fail(`mixed box after a press: ${JSON.stringify(afterClick)}`);
await page.$eval('input[name="notify"]', (n) => n.scrollIntoView({ block: 'center', behavior: 'instant' }));
const cap = () => page.$eval('input[name="notify"] + .key', (k) => Math.round(k.getBoundingClientRect().left));
const before = await cap();
await page.keyboard.press('Tab'); await page.$eval('input[name="notify"]', (n) => n.focus());
await page.keyboard.press('Space');
await wait(500);
const after = await cap();
Math.abs(after - before) > 12 ? pass(`a switch's cap slides (${before}px -> ${after}px), so the state is not color alone`) : fail(`the switch cap did not move (${before} -> ${after})`);
const a11y = await page.accessibility.snapshot({ interestingOnly: true });
const all = []; (function w(n) { all.push(n); (n.children ?? []).forEach(w); })(a11y);
const news = all.find((n) => n.role === 'checkbox' && /newsletter/i.test(n.name ?? ''));
const notify = all.find((n) => n.role === 'switch' && /notifications/i.test(n.name ?? ''));
news && news.checked === true ? pass('a screen reader gets a checked checkbox named "Newsletter"') : fail(`checkbox in the tree: ${JSON.stringify(news)}`);
notify ? pass(`a screen reader gets a switch named "Notifications" (${notify.checked ? 'on' : 'off'})`) : fail('the switch is not a switch in the accessibility tree');
const mix = all.find((n) => n.role === 'checkbox' && /everything/i.test(n.name ?? ''));
mix ? pass(`mixed state reported to assistive technology: checked=${JSON.stringify(mix.checked)}`) : fail('the "Everything" checkbox is missing from the tree');

// ---- form controls ----------------------------------------------------------------------------
console.log('\nForm controls');
await open(1000);
const visibleText = (sel) => page.$eval(sel, (n) => n.textContent.trim());

// validation: submit the empty sign-up form
await page.$eval('#signup', (n) => n.scrollIntoView({ block: 'center', behavior: 'instant' }));
await page.click('#signup button[type="submit"]');
await wait(300);
const v = await page.evaluate(() => {
  const form = document.querySelector('#signup');
  const summary = form.querySelector('.form__summary');
  const bad = [...form.querySelectorAll('[aria-invalid="true"]')];
  return {
    summaryShown: !summary.hidden, summaryRole: summary.getAttribute('role'), summaryText: summary.textContent,
    focused: document.activeElement.name,
    fields: bad.map((c) => { const id = (c.getAttribute('aria-describedby') ?? '').split(' ').find((i) => i.endsWith('-error')); const e = id && document.getElementById(id); return { name: c.name, text: e?.textContent.trim(), visible: e && !e.hidden, hasIcon: !!e?.querySelector('svg') }; }),
  };
});
v.summaryShown && v.summaryRole === 'alert' ? pass(`a summary is announced (role=alert): "${v.summaryText}"`) : fail(`summary: ${JSON.stringify(v)}`);
v.fields.length === 4 && v.fields.every((f) => f.visible && f.text && f.hasIcon) ? pass('each invalid field has a visible message with an icon, linked by aria-describedby') : fail(`field errors: ${JSON.stringify(v.fields)}`);
v.focused === 'name' ? pass('focus goes to the first problem') : fail(`focus went to "${v.focused}"`);
v.fields.find((f) => f.name === 'email')?.text === 'Enter an email like name@chrissimari.com' ? pass('uses the author\'s own message when there is one') : fail('custom message not used');

await page.type('#v-name', 'Darby');
const cleared = await page.evaluate(() => ({ invalid: document.querySelector('#v-name').getAttribute('aria-invalid'), summary: document.querySelector('#signup .form__summary').textContent }));
cleared.invalid === null ? pass('an error clears as soon as the field is valid') : fail('the error stayed after fixing the field');
/3 fields/.test(cleared.summary) ? pass('and the summary count follows') : fail(`summary after fixing one: "${cleared.summary}"`);

await page.type('#v-email', 'darby@chrissimari.com');
await page.type('#v-age', '36');
await page.focus('input[name="terms"]');
await page.keyboard.press('Space');
await page.click('#signup button[type="submit"]');
await wait(300);
const done = await page.evaluate(() => ({ formHidden: document.querySelector('#signup').hidden, sentShown: !document.querySelector('#signup-sent').hidden, focus: document.activeElement.className, anyInvalid: document.querySelectorAll('#signup [aria-invalid="true"]').length }));
done.formHidden && done.sentShown && done.focus === 'sent__title' && !done.anyInvalid ? pass('a valid form is replaced by the "sent" message, which takes focus so it is announced') : fail(`valid submit: ${JSON.stringify(done)}`);
await page.click('[data-sent-again]');
await wait(100);
const backName = await page.evaluate(() => document.activeElement.name);
!(await page.$eval('#signup', (f) => f.hidden)) && backName === 'name' ? pass('"Send another" brings the form back with focus on the first field') : fail(`send another: form hidden or focus on "${backName}"`);
await page.click('#signup button[type="reset"]');
const afterReset = await page.evaluate(() => ({ errors: [...document.querySelectorAll('#signup .field__error')].filter((e) => !e.hidden).length, value: document.querySelector('#v-name').value }));
afterReset.errors === 0 && afterReset.value === '' ? pass('Reset clears the values and any errors') : fail(`after reset: ${JSON.stringify(afterReset)}`);

// stepper keyboard: synthetic key events are not stepped by the browser itself, so a pass here means the script does it
console.log('\nNumber stepper keyboard');
await open(1280);
const stepKeys = await page.evaluate(() => {
  const input = document.querySelector('#g-qty');
  const press = (key, extra = {}) => { const e = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...extra }); input.dispatchEvent(e); return { value: input.value, prevented: e.defaultPrevented }; };
  input.value = '5';
  const events = []; input.addEventListener('change', () => events.push(input.value));
  const out = {};
  out.up = press('ArrowUp'); out.down = press('ArrowDown'); out.down2 = press('ArrowDown');
  input.value = '5'; out.pageUp = press('PageUp');            // 5 + 10 clamps to max 10
  input.value = '5'; out.pageDown = press('PageDown');        // 5 - 10 clamps to min 1
  input.value = '10'; out.atMax = press('ArrowUp');
  input.value = '1'; out.atMin = press('ArrowDown');
  input.value = '5'; out.withCtrl = press('ArrowUp', { ctrlKey: true });
  out.changes = events.length;
  input.value = '2';
  return out;
});
const sk = stepKeys;
sk.up.value === '6' && sk.down.value === '5' && sk.down2.value === '4' && sk.up.prevented ? pass('Up and Down arrows step by one, and fire input and change events') : fail(`stepper arrows: ${JSON.stringify(sk)}`);
sk.pageUp.value === '10' && sk.pageDown.value === '1' ? pass('Page Up and Page Down step by ten and stop at max and min') : fail(`stepper page keys: ${JSON.stringify(sk)}`);
sk.atMax.value === '10' && sk.atMin.value === '1' ? pass('the arrows do not go past max or below min') : fail(`stepper limits: ${JSON.stringify(sk)}`);
sk.withCtrl.value === '5' && !sk.withCtrl.prevented ? pass('a key with Ctrl held is left alone') : fail(`stepper modifiers: ${JSON.stringify(sk)}`);
await page.$eval('#g-qty', (i) => { i.scrollIntoView({ block: 'center', behavior: 'instant' }); i.focus(); });
const realBefore = await page.$eval('#g-qty', (i) => +i.value);
await page.keyboard.press('ArrowUp');
(await page.$eval('#g-qty', (i) => +i.value)) === realBefore + 1 ? pass('a real arrow key press steps exactly once (no double step)') : fail('a real arrow key press stepped the wrong amount');
await page.$eval('#g-qty', (i) => { i.value = '2'; });

// stepper
await page.$eval('#g-qty', (n) => n.scrollIntoView({ block: 'center', behavior: 'instant' }));
const qtyBefore = +(await page.$eval('#g-qty', (i) => i.value));
await page.click('.stepper button[data-step="1"]');
const afterInc = await page.evaluate(() => ({ value: +document.querySelector('#g-qty').value, said: document.querySelector('.stepper__status')?.textContent }));
afterInc.value === qtyBefore + 1 && /Quantity: 3/.test(afterInc.said ?? '') ? pass(`the + key steps the number and announces it ("${afterInc.said}")`) : fail(`stepper: ${JSON.stringify(afterInc)}`);
await page.$eval('#g-qty', (i) => { i.value = 10; });
await page.click('.stepper button[data-step="1"]');
(+(await page.$eval('#g-qty', (i) => i.value))) === 10 ? pass('and stops at max') : fail('the stepper went past max');

// password reveal
await page.click('[data-reveal]');
const rev = await page.evaluate(() => ({ type: document.querySelector('#g-pass').type, pressed: document.querySelector('[data-reveal]').getAttribute('aria-pressed'), label: document.querySelector('[data-reveal]').getAttribute('aria-label') }));
rev.type === 'text' && rev.pressed === 'true' && rev.label === 'Hide password' ? pass('the reveal button shows the password and says so (aria-pressed, label)') : fail(`reveal: ${JSON.stringify(rev)}`);
await page.click('[data-reveal]');

// color readout
await page.$eval('#f-color', (i) => { i.value = '#ff4d6d'; i.dispatchEvent(new Event('input', { bubbles: true })); });
(await visibleText('.color output')) === '#ff4d6d' ? pass('the color readout follows the swatch') : fail('the color readout did not update');

// the three meter states look different, not only a different color
await page.$eval('#m-good', (n) => n.scrollIntoView({ block: 'center', behavior: 'instant' }));
await wait(200);
const PNGlib = (await import('pngjs')).PNG;
const looks = [];
for (const id of ['m-good', 'm-mid', 'm-low']) {
  const handle = await page.$(`#${id}`);
  await handle.evaluate((n) => n.scrollIntoView({ block: 'center', behavior: 'instant' }));
  const png = PNGlib.sync.read(await handle.screenshot());
  const colors = new Set();
  for (let y = Math.floor(png.height * 0.35); y < Math.floor(png.height * 0.65); y++) for (let x = 4; x < Math.min(png.width * 0.1, 40); x++) {
    const i = (y * png.width + x) * 4; colors.add(`${png.data[i] >> 4},${png.data[i + 1] >> 4},${png.data[i + 2] >> 4}`);
  }
  looks.push(colors.size);
}
looks[0] <= 3 && looks[1] > looks[0] && looks[2] > looks[0] ? pass(`good is solid, middling and poor have a pattern (${looks.join(' / ')} distinct tones)`) : fail(`meter fills: ${looks.join(' / ')} distinct tones`);

// a screen reader gets names and roles for the new controls
const formTree = await page.accessibility.snapshot({ interestingOnly: false });
const formNodes = []; (function w(n) { formNodes.push(n); (n.children ?? []).forEach(w); })(formTree);
const named = (role, re) => formNodes.find((n) => n.role === role && re.test(n.name ?? ''));
named('textbox', /^name$/i) && named('textbox', /message/i) ? pass('text fields and the textarea are textboxes with names') : fail('textbox names missing');
named('combobox', /^size$/i) ? pass('a select is a combobox named "Size"') : fail('select not found in the tree');
(named('listbox', /devices/i) || named('combobox', /devices/i)) ? pass('a multiple select is a list box named "Input devices"') : fail('multiple select not found');
const meterNode = formNodes.find((n) => n.role === 'meter' && /battery, good/i.test(n.name ?? ''));
meterNode ? pass(`a meter is a meter named "Battery, good" (value ${meterNode.value})`) : fail('meter not found in the tree');
formNodes.find((n) => n.role === 'progressbar' && /uploading/i.test(n.name ?? '')) ? pass('a progress bar is a progressbar named "Uploading"') : fail('progress bar not found');

// ---- the settings tab -------------------------------------------------------------------------
console.log('\nSettings tab (an icon-only disclosure)');
await open(1280);
const tabState = () => page.evaluate(() => ({ shown: !document.querySelector('.settings-tab').hidden, open: !document.querySelector('.settings-tab__drawer').hidden }));
const tabAtTop = await tabState();
!tabAtTop.shown ? pass('hidden while the Page settings panel is on screen') : fail('the tab is showing at the top of the page');
await page.evaluate(() => scrollTo({ top: 1400, behavior: 'instant' }));
await wait(300);
(await tabState()).shown ? pass('appears once the panel has scrolled past') : fail('the tab did not appear after scrolling past');
const toggleInfo = await page.$eval('.settings-tab__toggle', (b) => ({ text: b.textContent.trim(), name: b.getAttribute('aria-label'), expanded: b.getAttribute('aria-expanded'), controls: b.getAttribute('aria-controls'), w: b.getBoundingClientRect().width, h: b.getBoundingClientRect().height }));
toggleInfo.text === '' && toggleInfo.name === 'Page settings' && toggleInfo.controls === 'settings-drawer' && toggleInfo.w >= 24 && toggleInfo.h >= 24
  ? pass(`has no visible word but is named "${toggleInfo.name}", with aria-controls and a ${Math.round(toggleInfo.w)}x${Math.round(toggleInfo.h)}px target`) : fail(`toggle: ${JSON.stringify(toggleInfo)}`);
await page.click('.settings-tab__toggle');
await wait(200);
const opened = await page.$eval('.settings-tab__toggle', (b) => b.getAttribute('aria-expanded'));
(await tabState()).open && opened === 'true' ? pass('opens, and aria-expanded says so') : fail('the drawer did not open');
await page.select('#lit-select-tab', 'violet');
await wait(200);
const synced = await page.evaluate(() => ({ lit: document.documentElement.dataset.lit, top: document.querySelector('input[name="lit"]:checked').value, stillOpen: !document.querySelector('.settings-tab__drawer').hidden }));
synced.lit === 'violet' && synced.top === 'violet' && synced.stillOpen ? pass('the highlight dropdown changes it, and the panel at the top follows') : fail(`swatch: ${JSON.stringify(synced)}`);
await page.keyboard.press('Escape');
await wait(150);
const afterEsc2 = await page.evaluate(() => ({ open: !document.querySelector('.settings-tab__drawer').hidden, onToggle: document.activeElement.classList.contains('settings-tab__toggle') }));
!afterEsc2.open && afterEsc2.onToggle ? pass('Esc closes it and returns focus to the tab') : fail(`after Esc: ${JSON.stringify(afterEsc2)}`);
await page.keyboard.press('Enter');
await wait(150);
(await tabState()).open ? pass('the keyboard opens it too') : fail('Enter did not open the drawer');
for (let i = 0; i < 12; i++) await page.keyboard.press('Tab');
await wait(200);
!(await tabState()).open ? pass('closes when focus moves on, so it never covers the control you are on') : fail('the drawer stayed open after focus left it');
await page.evaluate(() => { delete document.documentElement.dataset.lit; });
await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
await wait(300);
!(await tabState()).shown ? pass('goes away again at the top') : fail('the tab stayed after returning to the top');

// ---- the contents drawer ------------------------------------------------------------------------
console.log('\nContents drawer (below 76rem)');
await open(1024);
const tocState = () => page.evaluate(() => ({ drawer: document.querySelector('.toc').classList.contains('toc--drawer'), shown: !document.querySelector('.toc').hidden, expanded: document.querySelector('.toc-toggle').getAttribute('aria-expanded'), onToggle: document.activeElement.classList.contains('toc-toggle') }));
const t0 = await tocState();
t0.drawer && !t0.shown && t0.expanded === 'false' ? pass('folds into an icon with the list closed') : fail(`start: ${JSON.stringify(t0)}`);
const tInfo = await page.$eval('.toc-toggle', (b) => ({ text: b.textContent.trim(), name: b.getAttribute('aria-label'), controls: b.getAttribute('aria-controls'), w: b.getBoundingClientRect().width, h: b.getBoundingClientRect().height, left: b.getBoundingClientRect().left }));
tInfo.text === '' && tInfo.name === 'Contents' && tInfo.controls === 'toc-nav' && tInfo.w >= 24 && tInfo.h >= 24 && tInfo.left === 0 ? pass(`floats on the left edge, named "${tInfo.name}", ${Math.round(tInfo.w)}x${Math.round(tInfo.h)}px`) : fail(`toggle: ${JSON.stringify(tInfo)}`);
await page.click('.toc-toggle');
await wait(200);
const t1 = await tocState();
t1.shown && t1.expanded === 'true' ? pass('opens, and aria-expanded says so') : fail(`open: ${JSON.stringify(t1)}`);
await page.keyboard.press('Escape');
await wait(150);
const t2 = await tocState();
!t2.shown && t2.onToggle ? pass('Esc closes it and returns focus to the icon') : fail(`esc: ${JSON.stringify(t2)}`);
await page.focus('.toc-toggle');
await page.keyboard.press('Enter');
await wait(150);
(await tocState()).shown ? pass('the keyboard opens it') : fail('Enter did not open it');
await page.keyboard.press('Tab');
await page.keyboard.press('Enter');
await wait(500);
const t3 = await tocState();
!t3.shown ? pass('choosing a link closes it and goes to the section') : fail(`link: ${JSON.stringify(t3)}`);
await page.setViewport({ width: 1400, height: 800 });
await wait(200);
const t4 = await page.evaluate(() => ({ drawer: document.querySelector('.toc').classList.contains('toc--drawer'), nav: !document.querySelector('.toc').hidden, icon: getComputedStyle(document.querySelector('.toc-toggle')).display }));
!t4.drawer && t4.nav && t4.icon === 'none' ? pass('wide screens keep the list in the margin, with no icon') : fail(`wide: ${JSON.stringify(t4)}`);

// ---- responsive grid ----------------------------------------------------------------------------
console.log('\nResponsive grid and breakpoints');
const gridAt = async (width) => {
  await page.setViewport({ width, height: 800 });
  await wait(150);
  return page.evaluate(() => {
    const items = [...document.querySelector('#layout').closest('section').querySelectorAll('.row')[0].children];
    const rows = new Set(items.map((n) => Math.round(n.getBoundingClientRect().top)));
    const shown = ['d-md-none', 'd-md-inline'].map((c) => [...document.querySelectorAll('#layout ~ * strong, section[aria-labelledby="layout"] strong')].filter((n) => n.classList.contains(c)).some((n) => getComputedStyle(n).display !== 'none'));
    return { rows: rows.size, phoneText: shown[0], overflow: document.documentElement.scrollWidth > innerWidth + 1 };
  });
};
const g375 = await gridAt(375);
const g800 = await gridAt(800);
const g1300 = await gridAt(1300);
g375.rows === 3 && g800.rows === 2 && g1300.rows === 1 ? pass('three columns stack on a phone, pair up from md and sit in one row from lg') : fail(`rows at 375, 800 and 1300px: ${g375.rows}, ${g800.rows}, ${g1300.rows}`);
g375.phoneText && !g800.phoneText ? pass('d-md-none shows below md and hides from md up') : fail(`display helpers: ${JSON.stringify([g375.phoneText, g800.phoneText])}`);
!g375.overflow && !g800.overflow && !g1300.overflow ? pass('no sideways scrolling at any of those widths') : fail('the grid page overflows sideways');
await page.setViewport({ width: 1280, height: 800 });

// ---- tabs -----------------------------------------------------------------------------------------
console.log('\nTabs');
await open(1280);
const tabsNow = () => page.evaluate(() => ({ sel: [...document.querySelectorAll('[role="tab"]')].map((t) => t.getAttribute('aria-selected') === 'true' ? 1 : 0).join(''), shown: [...document.querySelectorAll('[role="tabpanel"]')].map((n) => (n.hidden ? 0 : 1)).join(''), stops: [...document.querySelectorAll('[role="tab"]')].map((t) => t.tabIndex).join(','), named: [...document.querySelectorAll('[role="tabpanel"]')].every((n) => n.getAttribute('aria-labelledby') && document.getElementById(n.getAttribute('aria-labelledby'))) }));
const tab0 = await tabsNow();
tab0.sel === '001' && tab0.shown === '001' && tab0.stops === '-1,-1,0' && tab0.named ? pass('one tab selected and one panel shown, a single tab stop, every panel named by its tab') : fail(`tabs: ${JSON.stringify(tab0)}`);
await page.focus('[role="tab"][aria-selected="true"]');
await page.keyboard.press('ArrowRight');
const tabWrap = await tabsNow();
tabWrap.sel === '100' && tabWrap.shown === '100' ? pass('ArrowRight wraps to the first tab and shows its panel') : fail(`wrap: ${JSON.stringify(tabWrap)}`);
await page.keyboard.press('End');
(await tabsNow()).sel === '001' ? pass('End goes to the last tab, Home to the first') : fail('End did not select the last tab');
await page.keyboard.press('Tab');
(await page.evaluate(() => document.activeElement.getAttribute('role'))) === 'tabpanel' ? pass('Tab moves from the tabs into the panel') : fail('Tab did not reach the panel');

// ---- dropdown menu --------------------------------------------------------------------------------
console.log('\nDropdown menu (ARIA menu button pattern)');
await open(1280);
const menuNow = () => page.evaluate(() => ({ open: document.querySelector('#menu-demo').matches(':popover-open'), expanded: document.querySelector('#menu-demo-button').getAttribute('aria-expanded'), focus: document.activeElement.textContent.trim() }));
const menuAttrs = await page.evaluate(() => { const b = document.querySelector('#menu-demo-button'); const l = document.querySelector('#menu-demo'); return { haspopup: b.getAttribute('aria-haspopup'), controls: b.getAttribute('aria-controls'), role: l.getAttribute('role'), named: !!(l.getAttribute('aria-labelledby') && document.getElementById(l.getAttribute('aria-labelledby'))), items: [...l.querySelectorAll('.menu__item')].every((i) => i.getAttribute('role') === 'menuitem' && i.tabIndex === -1), wrappers: [...l.querySelectorAll(':scope > li')].map((li) => li.getAttribute('role')).join(',') }; });
menuAttrs.haspopup === 'menu' && menuAttrs.role === 'menu' && menuAttrs.named && menuAttrs.items && menuAttrs.wrappers === 'none,none,none,separator,none,none' ? pass('roles are menu, menuitem, none (list items) and separator, and the menu is named by its button') : fail(`menu roles: ${JSON.stringify(menuAttrs)}`);
await page.$eval('#menu-demo-button', (b) => b.scrollIntoView({ block: 'center', behavior: 'instant' }));
await page.focus('#menu-demo-button');
await page.keyboard.press('Enter');
await wait(250);
const m1 = await menuNow();
m1.open && m1.expanded === 'true' && m1.focus === 'Edit' ? pass('Enter opens it with focus on the first item, and aria-expanded follows') : fail(`open: ${JSON.stringify(m1)}`);
await page.keyboard.press('End');
(await menuNow()).focus === 'Delete' ? pass('End goes to the last item') : fail('End did not reach the last item');
await page.keyboard.press('ArrowDown');
(await menuNow()).focus === 'Edit' ? pass('ArrowDown wraps to the first item') : fail('ArrowDown did not wrap');
await page.keyboard.type('d');
(await menuNow()).focus === 'Duplicate' ? pass('typing a letter moves to the next item starting with it') : fail('type-ahead failed');
await page.keyboard.press('Escape');
await wait(200);
const m2 = await menuNow();
!m2.open && m2.expanded === 'false' && m2.focus.startsWith('Actions') ? pass('Esc closes it and returns focus to the button') : fail(`esc: ${JSON.stringify(m2)}`);
await page.keyboard.press('ArrowUp');
await wait(250);
(await menuNow()).focus === 'Delete' ? pass('ArrowUp on the button opens it on the last item') : fail('ArrowUp did not open on the last item');
await page.keyboard.press('Tab');
await wait(200);
!(await menuNow()).open ? pass('Tab closes it and moves on') : fail('Tab left the menu open');

// ---- datalist and autocomplete ----------------------------------------------------------------------
console.log('\nDatalist and autocomplete (ARIA editable combobox)');
await open(1280);
const listsOk = await page.evaluate(() => [...document.querySelectorAll('input[list], input[data-autocomplete]')].every((i) => { const id = i.getAttribute('list') ?? i.getAttribute('aria-controls'); return i.id && document.querySelector(`label[for="${i.id}"]`) && (i.hasAttribute('data-autocomplete') || (document.getElementById(id)?.localName === 'datalist' && document.getElementById(id).options.length)); }));
listsOk ? pass('every datalist field has a label and points at a datalist with options') : fail('a field with suggestions has no label or no datalist');
const acNow = () => page.evaluate(() => { const i = document.querySelector('#ac-country'); const l = document.querySelector('.suggest'); const a = i.getAttribute('aria-activedescendant'); return { open: l.matches(':popover-open'), expanded: i.getAttribute('aria-expanded'), role: i.getAttribute('role'), auto: i.getAttribute('aria-autocomplete'), active: a ? document.getElementById(a)?.textContent : null, count: l.children.length, value: i.value, status: i.parentNode.querySelector('.suggest__status').textContent, focusIn: document.activeElement === i }; });
await page.$eval('#ac-country', (i) => i.scrollIntoView({ block: 'center', behavior: 'instant' }));
await page.focus('#ac-country');
await page.keyboard.type('un', { delay: 30 });
await wait(200);
const ac1 = await acNow();
ac1.role === 'combobox' && ac1.auto === 'list' && ac1.open && ac1.expanded === 'true' && ac1.count === 2 && /2 suggestions/.test(ac1.status) && ac1.focusIn ? pass('typing opens a filtered list, focus stays in the field, and the count is announced') : fail(`type: ${JSON.stringify(ac1)}`);
await page.keyboard.press('ArrowDown');
await page.keyboard.press('ArrowDown');
(await acNow()).active === 'United States' ? pass('arrow keys move through the options (aria-activedescendant)') : fail('arrow keys did not move');
await page.keyboard.press('Enter');
await wait(100);
const ac2 = await acNow();
ac2.value === 'United States' && !ac2.open && ac2.expanded === 'false' ? pass('Enter picks the option and closes the list') : fail(`enter: ${JSON.stringify(ac2)}`);
await page.$eval('#ac-country', (i) => { i.value = ''; });
await page.keyboard.type('po', { delay: 30 });
await wait(150);
await page.keyboard.press('Escape');
await wait(100);
const ac3 = await acNow();
!ac3.open && ac3.value === 'po' ? pass('Esc closes the list and keeps what was typed') : fail(`esc: ${JSON.stringify(ac3)}`);

// ---- header and search ----------------------------------------------------------------------------
console.log('\nHeader and in-page search');
for (const width of [1280, 375]) {
  await open(width);
  const head = await page.evaluate(() => { const h = document.querySelector('header.topbar'); const input = document.querySelector('#site-search'); const r = h.getBoundingClientRect(); return { banner: getComputedStyle(h).position, search: !!input.closest('search'), label: !!document.querySelector('label[for="site-search"]'), groups: document.querySelectorAll('#site-index option').length, appearance: (() => { const sel = h.querySelector('select#appearance'); return sel && { opts: [...sel.options].map((o) => o.value).join(), value: sel.value, label: !!h.querySelector('label[for="appearance"]') }; })(), overflow: document.documentElement.scrollWidth > innerWidth + 1, h: r.height }; });
  head.banner === 'sticky' && head.search && head.label && head.groups > 20 && head.appearance?.opts === 'auto,light,dark' && head.appearance.value === 'auto' && head.appearance.label && !head.overflow ? pass(`${width}px: a sticky header holds a labelled search (${head.groups} entries) and an Appearance dropdown (Auto, Light, Dark) that starts on Auto`) : fail(`${width}px header: ${JSON.stringify(head)}`);
}
await open(1280);
await page.waitForFunction(() => document.querySelector('#site-search')?.getAttribute('role') === 'combobox');
await page.keyboard.down('Control');
await page.keyboard.press('KeyK');
await page.keyboard.up('Control');
(await page.evaluate(() => document.activeElement.id)) === 'site-search' ? pass('Ctrl+K focuses the search (a modifier key, so typing never triggers it)') : fail('Ctrl+K did not focus the search');
await page.keyboard.type('dropdo', { delay: 30 });
await wait(250);
const sr = await page.evaluate(() => { const lists = [...document.querySelectorAll('.suggest')]; const l = lists.find((n) => n.matches(':popover-open')); return { items: l ? [...l.children].map((c) => c.textContent) : [], status: document.querySelector('#site-search').parentNode.querySelector('.suggest__status').textContent }; });
sr.items.some((t) => t.startsWith('Dropdown menu')) && /suggestion/.test(sr.status) ? pass('typing lists matching sections and announces the count') : fail(`results: ${JSON.stringify(sr)}`);
await page.keyboard.press('Enter');
await wait(1500);
const nav = await page.evaluate(() => ({ hash: location.hash, focus: document.activeElement.id, value: document.querySelector('#site-search').value }));
nav.hash === '#menus' && nav.focus === 'menus' && nav.value === '' ? pass('Enter goes to the section, moves focus to its heading and clears the search') : fail(`navigate: ${JSON.stringify(nav)}`);

// ---- alerts and toasts -----------------------------------------------------------------------------
console.log('\nAlerts and toasts');
await open(1280);
const alertInfo = await page.evaluate(() => [...document.querySelectorAll('#alerts ~ .panel .alert')].map((a) => ({ role: a.getAttribute('role'), icon: !!a.querySelector('.alert__icon[aria-hidden="true"]'), title: !!a.querySelector('.alert__title')?.textContent.trim() })));
alertInfo.length === 4 && alertInfo.every((a) => a.icon && a.title) && alertInfo.map((a) => a.role).join() === 'status,status,status,alert' ? pass('each alert has an icon and a title (not color alone); errors use role="alert", the rest role="status"') : fail(`alerts: ${JSON.stringify(alertInfo)}`);
await page.$eval('#alerts', (n) => n.scrollIntoView({ block: 'start', behavior: 'instant' }));
await page.focus('.alert .alert__close');
await page.keyboard.press('Enter');
const afterDismiss = await page.evaluate(() => ({ left: document.querySelectorAll('#alerts ~ .panel .alert').length, focusOn: document.activeElement.className }));
afterDismiss.left === 3 && afterDismiss.focusOn.includes('alert-stack') ? pass('dismissing an alert removes it and keeps focus in the list') : fail(`dismiss: ${JSON.stringify(afterDismiss)}`);
const region = await page.evaluate(() => { const r = document.querySelector('.toasts'); return r ? { role: r.getAttribute('role'), live: r.getAttribute('aria-live'), name: r.getAttribute('aria-label') } : null; });
await page.click('[data-toast-variant="success"]');
const region2 = await page.evaluate(() => { const r = document.querySelector('.toasts'); return { role: r.getAttribute('role'), live: r.getAttribute('aria-live'), name: r.getAttribute('aria-label'), n: r.children.length, text: r.textContent }; });
region2.role === 'region' && region2.live === 'polite' && region2.name === 'Notifications' && region2.n === 1 && /Success/.test(region2.text) ? pass('a toast appears in a named, polite live region') : fail(`toast region: ${JSON.stringify(region2)}`);
await page.click('[data-toast-variant="danger"]');
(await page.evaluate(() => document.querySelector('.toast.alert--danger').getAttribute('role'))) === 'alert' ? pass('an error toast is role="alert" so it interrupts') : fail('error toast is not role="alert"');
await page.focus('.toast .alert__close');
await page.keyboard.press('Escape');
(await page.evaluate(() => document.querySelectorAll('.toast').length)) === 1 ? pass('Esc dismisses the toast with focus') : fail('Esc did not dismiss the toast');
await page.evaluate(() => window.SimarUI.toast('Quick one', { duration: 300 }));
await wait(700);
(await page.evaluate(() => !document.body.textContent.includes('Quick one') || ![...document.querySelectorAll('.toast')].some((t) => t.textContent.includes('Quick one')))) ? pass('a toast goes away by itself after its duration') : fail('the toast did not time out');
await page.evaluate(() => window.SimarUI.toast('Hold on', { duration: 300 }));
await page.focus('.toast:last-child .alert__close');
await wait(800);
(await page.evaluate(() => [...document.querySelectorAll('.toast')].some((t) => t.textContent.includes('Hold on')))) ? pass('a toast waits while it has focus (WCAG 2.2.1)') : fail('the toast left while focused');
await page.evaluate(() => document.querySelectorAll('.toast').forEach((t) => t.remove()));

// ---- badge and table -------------------------------------------------------------------------------
console.log('\nBadge and table');
await open(1280);
const badges = await page.evaluate(() => [...document.querySelectorAll('#badges ~ .panel .badge')].map((b) => ({ words: b.textContent.trim().length > 0, count: b.classList.contains('badge--count'), hidden: !!b.querySelector('.visually-hidden') })));
badges.length === 6 && badges.every((b) => b.words) && badges.filter((b) => b.count).every((b) => b.hidden) ? pass('every badge has words, and a count carries hidden words after the number') : fail(`badges: ${JSON.stringify(badges)}`);
const tbl = await page.evaluate(() => { const w = document.querySelector('.table-wrap'); const t = w.querySelector('table'); return { region: w.getAttribute('role'), focus: w.tabIndex, named: !!document.getElementById(w.getAttribute('aria-labelledby')), caption: !!t.caption, cols: [...t.querySelectorAll('thead th')].every((th) => th.getAttribute('scope') === 'col'), rows: [...t.querySelectorAll('tbody th')].every((th) => th.getAttribute('scope') === 'row'), sort: [...t.querySelectorAll('thead th[aria-sort]')].map((th) => th.getAttribute('aria-sort')).join(), buttons: t.querySelectorAll('thead th .table__sort').length }; });
tbl.region === 'region' && tbl.focus === 0 && tbl.named && tbl.caption && tbl.cols && tbl.rows && tbl.sort === 'none,none,none,none' && tbl.buttons === 4 ? pass('the table has a caption, scoped headers, a focusable named scroll region and a sort button per sortable header') : fail(`table: ${JSON.stringify(tbl)}`);
await page.$eval('.table', (n) => n.scrollIntoView({ block: 'center', behavior: 'instant' }));
await page.focus('.table th:nth-child(3) .table__sort');
await page.keyboard.press('Enter');
const s1 = await page.evaluate(() => ({ first: document.querySelector('.table tbody th').textContent, sort: [...document.querySelectorAll('.table thead th')].map((th) => th.getAttribute('aria-sort')[0]).join('') }));
s1.first === '#1045' && s1.sort === 'nnan' ? pass('Enter on a header sorts ascending by number ($9.99 first) and marks only that column') : fail(`sort asc: ${JSON.stringify(s1)}`);
await page.keyboard.press('Space');
const s2 = await page.evaluate(() => ({ first: document.querySelector('.table tbody th').textContent, sort: [...document.querySelectorAll('.table thead th')].map((th) => th.getAttribute('aria-sort')[0]).join('') }));
s2.first === '#1044' && s2.sort === 'nndn' ? pass('pressing again sorts descending') : fail(`sort desc: ${JSON.stringify(s2)}`);
await page.setViewport({ width: 320, height: 700 });
await wait(200);
const narrow = await page.evaluate(() => { const w = document.querySelector('.table-wrap'); return { scrolls: w.scrollWidth > w.clientWidth, page: document.documentElement.scrollWidth > innerWidth + 1 }; });
narrow.scrolls && !narrow.page ? pass('at 320px the table scrolls inside its wrapper and the page does not') : fail(`320px table: ${JSON.stringify(narrow)}`);
await page.setViewport({ width: 1280, height: 800 });

// ---- pagination ---------------------------------------------------------------------------------------
console.log('\nPagination');
await open(1280);
const pg = await page.evaluate(() => { const nav = document.querySelector('nav.pagination'); const links = [...nav.querySelectorAll('a.key')]; return { label: nav.getAttribute('aria-label'), current: nav.querySelectorAll('[aria-current="page"]').length, rels: [...nav.querySelectorAll('[rel]')].map((a) => a.rel).join(), namesHaveText: links.every((a) => { const name = (a.getAttribute('aria-label') ?? a.textContent).toLowerCase(); return name.includes(a.textContent.trim().toLowerCase()); }), gapHidden: nav.querySelector('.pagination__gap').getAttribute('aria-hidden') === 'true', list: nav.querySelector('ul')?.children.length }; });
pg.label && pg.current === 1 && pg.rels === 'prev,next' && pg.namesHaveText && pg.gapHidden && pg.list === 7 ? pass('a labelled nav with one current page, prev and next, names that contain the visible text, and a hidden gap') : fail(`pagination: ${JSON.stringify(pg)}`);

// ---- footer ---------------------------------------------------------------------------------------
console.log('\nFooter');
await open(1280);
const foot = await page.evaluate(() => { const f = document.querySelector('footer.sitefoot'); const a = f?.querySelector('a[href]'); return { copy: f?.textContent.includes('\u00a9 2026 Chris Simari'), href: a?.href, name: a?.textContent.trim(), h: a?.getBoundingClientRect().height }; });
foot.copy && foot.href === 'https://chrissimari.com/projects/simar-ui' && foot.name === 'simar-ui' && foot.h >= 24 ? pass('the footer has the copyright and links to chrissimari.com/projects/simar-ui (24px target)') : fail(`footer: ${JSON.stringify(foot)}`);

// ---- breadcrumb -----------------------------------------------------------------------------------
console.log('\nBreadcrumb');
await open(1280);
const bc = await page.evaluate(() => { const nav = document.querySelector('nav[aria-label="Breadcrumb"]'); const items = [...nav.querySelectorAll('ol > li')]; const last = items.at(-1); return { list: nav.querySelector('ol') !== null, n: items.length, current: nav.querySelectorAll('[aria-current="page"]').length, lastIsText: last.getAttribute('aria-current') === 'page' && !last.querySelector('a'), links: items.slice(0, -1).every((li) => li.querySelector('a[href]')), heights: [...nav.querySelectorAll('a')].every((a) => a.getBoundingClientRect().height >= 24) }; });
bc.list && bc.n === 4 && bc.current === 1 && bc.lastIsText && bc.links && bc.heights ? pass('an ordered list in a labelled nav: links, then the current page as plain text (24px targets)') : fail(`breadcrumb: ${JSON.stringify(bc)}`);
await page.setViewport({ width: 320, height: 700 });
await wait(200);
(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)) ? pass('a long breadcrumb wraps at 320px without sideways scrolling') : fail('the breadcrumb overflows at 320px');
await page.setViewport({ width: 1280, height: 800 });

// ---- media ----------------------------------------------------------------------------------------
console.log('\nMedia');
await open(1280);
const md = await page.evaluate(() => {
  const figs = [...document.querySelectorAll('section[aria-labelledby="media"] figure.media')];
  const imgs = [...document.querySelectorAll('section[aria-labelledby="media"] figure.media img')];
  return {
    figs: figs.length,
    named: imgs.every((i) => i.hasAttribute('alt') && i.alt.trim() !== ''),
    sized: imgs.every((i) => i.hasAttribute('width') && i.hasAttribute('height')),
    captioned: figs.every((f) => f.querySelector('figcaption')),
    audioNamed: [...document.querySelectorAll('section[aria-labelledby="media"] audio')].every((a) => a.hasAttribute('controls') && a.getAttribute('aria-labelledby')),
    square: (() => { const r = document.querySelector('.media--1x1 img').getBoundingClientRect(); return Math.abs(r.width - r.height) <= 1; })(),
    wide: (() => { const r = document.querySelector('.media--16x9 img').getBoundingClientRect(); return Math.abs(r.width / r.height - 16 / 9) < 0.02; })(),
  };
});
md.figs === 3 && md.named && md.sized && md.captioned && md.audioNamed ? pass('each figure has a caption, each image its alt, width and height, and the audio is named and has controls') : fail(`media markup: ${JSON.stringify(md)}`);
md.square && md.wide ? pass('media--1x1 and media--16x9 hold their shape') : fail(`media shapes: ${JSON.stringify(md)}`);
await page.setViewport({ width: 320, height: 700 });
await wait(200);
const mo = await page.evaluate(() => {
  const fig = document.createElement('figure');
  fig.className = 'media';
  fig.innerHTML = '<video controls width="1920" height="1080"></video>';
  document.querySelector('section[aria-labelledby="media"] .panel').append(fig);
  const v = fig.querySelector('video').getBoundingClientRect();
  const out = { page: document.documentElement.scrollWidth <= innerWidth + 1, video: v.right <= innerWidth };
  fig.remove();
  return out;
});
mo.page && mo.video ? pass('a wide image and a 1920px video shrink to fit at 320px without sideways scrolling') : fail(`media at 320px: ${JSON.stringify(mo)}`);
await page.setViewport({ width: 1280, height: 800 });

// ---- card -----------------------------------------------------------------------------------------
console.log('\nCard');
await open(1280);
const cd = await page.evaluate(() => {
  const cards = [...document.querySelectorAll('section[aria-labelledby="cards"] article.card')];
  const linked = cards[0];
  const link = linked.querySelector('.card__link');
  const lr = link.getBoundingClientRect(), cr = linked.getBoundingClientRect();
  const after = getComputedStyle(link, '::after');
  // A footer button added to the linked card must still be clickable above the stretched link.
  const footer = document.createElement('div');
  footer.className = 'card__footer';
  footer.innerHTML = '<button class="key" type="button">Follow</button>';
  linked.append(footer);
  const btn = footer.querySelector('button');
  btn.scrollIntoView({ block: 'center', behavior: 'instant' });
  const br = btn.getBoundingClientRect();
  const top = document.elementFromPoint(br.x + br.width / 2, br.y + br.height / 2);
  return {
    n: cards.length,
    headings: cards.every((c) => c.querySelector('h4.card__title')),
    oneLink: linked.querySelectorAll('a[href]').length === 1 && link.closest('h4') !== null,
    covers: after.position === 'absolute' && cr.height > lr.height,
    imgAlt: linked.querySelector('img').getAttribute('alt') === '',
    footerClickable: top === btn || btn.contains(top),
    done: footer.remove(),
  };
});
cd.n === 3 && cd.headings && cd.oneLink && cd.imgAlt ? pass('each card is an article with a heading; the linked card has one link, inside its heading') : fail(`card markup: ${JSON.stringify(cd)}`);
cd.covers && cd.footerClickable ? pass('the link covers the whole card and footer buttons stay clickable above it') : fail(`card link cover: ${JSON.stringify(cd)}`);
await page.focus('section[aria-labelledby="cards"] .card__link');
await page.keyboard.press('Shift'); // a key press makes the focus count as keyboard focus (:focus-visible)
const ring = await page.evaluate(() => { const l = document.querySelector('.card__link'); const o = getComputedStyle(l, '::after'); return { w: parseFloat(o.outlineWidth), style: o.outlineStyle }; });
ring.w >= 2 && ring.style !== 'none' ? pass('keyboard focus on the card link draws a ring round the card') : fail(`card focus ring: ${JSON.stringify(ring)}`);
await page.setViewport({ width: 320, height: 700 });
await wait(200);
(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)) ? pass('cards stack at 320px without sideways scrolling') : fail('cards overflow at 320px');
await page.setViewport({ width: 1280, height: 800 });

// ---- button group ---------------------------------------------------------------------------------
console.log('\nButton group');
await open(1280);
const kg = await page.evaluate(() => {
  const sec = document.querySelector('section[aria-labelledby="key-groups"]');
  const groups = [...sec.querySelectorAll('.key-group')];
  const radii = (g) => [...g.querySelectorAll('.key')].map((k) => getComputedStyle(k));
  const h = groups[0] && radii(groups[0]);
  const r = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--radius'));
  return {
    n: groups.length,
    named: groups.every((g) => ['group', 'radiogroup'].includes(g.getAttribute('role')) && g.getAttribute('aria-label')),
    endsOnly: h && parseFloat(h[0].borderTopLeftRadius) === r && parseFloat(h[0].borderTopRightRadius) === 0 && parseFloat(h.at(-1).borderTopRightRadius) === r && parseFloat(h[1].borderTopLeftRadius) === 0,
    toggles: [...sec.querySelectorAll('[aria-pressed]')].every((b) => b.tagName === 'BUTTON' && ['true', 'false'].includes(b.getAttribute('aria-pressed'))),
    radios: [...sec.querySelectorAll('input[type=radio]')].every((i) => i.closest('label')) && sec.querySelectorAll('input[name="kg-size"]').length === 4,
    heights: [...sec.querySelectorAll('.key')].every((k) => k.getBoundingClientRect().height >= 24),
  };
});
kg.n === 4 && kg.named && kg.toggles && kg.radios && kg.heights ? pass('each group has a role and a name; toggles are buttons with aria-pressed; radios are native in labels (24px targets)') : fail(`key group markup: ${JSON.stringify(kg)}`);
kg.endsOnly ? pass('only the two outer ends of a group are rounded') : fail(`key group radii: ${JSON.stringify(kg)}`);
const tg = await page.evaluate(() => { const b = document.querySelector('[data-toggle-group] [aria-pressed="false"]'); b.click(); return b.getAttribute('aria-pressed'); });
tg === 'true' ? pass('a toggle key flips aria-pressed when clicked') : fail(`toggle: ${tg}`);
await page.focus('input[name="kg-size"][value="m"]');
await page.keyboard.press('ArrowRight');
const arrow = await page.evaluate(() => document.querySelector('input[name="kg-size"]:checked')?.value);
arrow === 'l' ? pass('the arrow keys move the choice through the radio group, skipping the disabled one') : fail(`radio arrows: ${arrow}`);
await page.keyboard.press('ArrowRight');
(await page.evaluate(() => document.querySelector('input[name="kg-size"]:checked')?.value)) === 's' ? pass('and it wraps round') : fail('radio group did not wrap');
await page.setViewport({ width: 320, height: 700 });
await wait(200);
(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)) ? pass('groups wrap at 320px without sideways scrolling') : fail('a button group overflows at 320px');
await page.setViewport({ width: 1280, height: 800 });

// ---- styles ---------------------------------------------------------------------------------------
console.log('\nStyles');
await open(1280);
const STYLES = { classic: ['14px', '18px'], flat: ['4px', '4px'], soft: ['12px', '20px'], crisp: ['8px', '12px'], line: ['6px', '10px'], round: ['20px', '28px'], deep: ['8px', '14px'], brutal: ['0px', '0px'] };
const styleInfo = await page.evaluate(() => ({
  panel: !!document.querySelector('#page-settings select#style-select'),
  label: !!document.querySelector('label[for="style-select"]'),
  options: [...document.querySelector('#style-select').options].map((o) => o.value || 'flat').join(),
  start: document.documentElement.dataset.style ?? '',
}));
styleInfo.panel && styleInfo.label && styleInfo.start === '' && styleInfo.options === 'flat,classic,soft,crisp,line,round,deep,brutal' ? pass('the Page settings panel has a labelled Style select with eight styles, starting on Flat') : fail(`style select: ${JSON.stringify(styleInfo)}`);
const applied = [];
for (const [name, [radius, large]] of Object.entries(STYLES)) {
  await page.select('#style-select', name === 'flat' ? '' : name);
  const got = await page.evaluate(() => {
    const key = document.querySelector('section[aria-labelledby="buttons"] .key'), panel = document.querySelector('.panel');
    return { attr: document.documentElement.dataset.style ?? '', key: getComputedStyle(key).borderTopLeftRadius, panel: getComputedStyle(panel).borderTopLeftRadius, tab: document.querySelector('#style-select-tab').value };
  });
  if (!(got.attr === (name === 'flat' ? '' : name) && got.key === radius && got.panel === large && got.tab === (name === 'flat' ? '' : name))) applied.push(`${name}: ${JSON.stringify(got)}`);
}
applied.length === 0 ? pass('each style sets its own radius on keys and surfaces, and the settings tab select follows') : fail(`styles: ${applied.join(' | ')}`);
await page.select('#style-select', 'brutal');
const outline = await page.evaluate(() => { const i = document.querySelector('#f-name'); const sh = getComputedStyle(i).boxShadow; const k = getComputedStyle(document.querySelector('.panel')).boxShadow; return { input: sh.includes('2px'), panel: k.includes('2px') }; });
outline.input && outline.panel ? pass('a style with no soft shadows still draws an outline round inputs and panels') : fail(`outline: ${JSON.stringify(outline)}`);
await page.reload();
await wait(400);
(await page.evaluate(() => document.documentElement.dataset.style ?? '')) === 'brutal' ? pass('the chosen style is remembered and applied on reload') : fail('the style was not remembered');
await page.select('#style-select', '');
(await page.evaluate(() => localStorage.getItem('simar-ui:style'))) === null ? pass('choosing Flat clears the remembered style') : fail('Flat left a remembered style');
await page.setViewport({ width: 320, height: 700 });
await wait(200);
await page.select('#style-select', 'round');
(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)) ? pass('the roundest style fits at 320px without sideways scrolling') : fail('a style overflows at 320px');
await page.select('#style-select', '');
await page.setViewport({ width: 1280, height: 800 });

// ---- code block gutter ----------------------------------------------------------------------------
console.log('\nCode gutter');
await open(1280);
const gut = await page.evaluate(() => {
  const pre = [...document.querySelectorAll('.code pre')].find((p) => p.querySelector('.code__line') && p.scrollWidth > p.clientWidth);
  if (!pre) return { none: true };
  const line = pre.querySelector('.code__line');
  const b = getComputedStyle(line, '::before'); return { pad: getComputedStyle(pre).paddingLeft, gutter: b.paddingLeft, gap: b.paddingRight, margin: b.marginRight, sticky: b.position };
});
gut.none ? pass('(no code block wide enough to scroll sideways on this page, so the gutter check is skipped)') : gut.pad === '0px' && gut.sticky === 'sticky' && parseFloat(gut.gutter) >= 16 && parseFloat(gut.gap) >= 16 && gut.margin === '0px' ? pass('the sticky line numbers carry the left padding and the gap, so scrolled code cannot show beside them') : fail(`code gutter: ${JSON.stringify(gut)}`);

// ---- switch cap -----------------------------------------------------------------------------------
console.log('\nSwitch cap');
await open(1280);
const swc = await page.evaluate(async () => {
  const sw = document.querySelector('.switch'); const input = sw.querySelector('input'); const key = sw.querySelector('.key');
  sw.scrollIntoView({ block: 'center', behavior: 'instant' });
  const read = () => { const c = getComputedStyle(key); return { w: key.offsetWidth, h: key.offsetHeight, radius: c.borderTopLeftRadius, shadow: c.boxShadow !== 'none', dot: parseFloat(getComputedStyle(key, '::after').width) }; };
  const out = {};
  for (const style of ['', 'classic', 'line', 'brutal']) {
    if (style) document.documentElement.dataset.style = style; else delete document.documentElement.dataset.style;
    for (const on of [false, true]) { input.checked = on; await new Promise((r) => setTimeout(r, 350)); out[`${style || 'flat'}-${on ? 'on' : 'off'}`] = read(); }
  }
  delete document.documentElement.dataset.style;
  return out;
});
const swBad = Object.keys(swc).filter((k) => k.endsWith('-on')).filter((on) => { const off = swc[on.replace('-on', '-off')], o = swc[on]; return !(o.w === off.w && o.h === off.h && o.radius === off.radius && o.shadow && o.w > 14); });
swBad.length === 0 ? pass('the switch cap keeps its size, round shape and raised look when turned on, in four styles (never just the dot)') : fail(`switch cap: ${swBad.join(', ')} ${JSON.stringify(swc)}`);

// ---- confirmation dialog --------------------------------------------------------------------------
console.log('\nConfirmation dialog');
await open(1280);
const confirmUi = async (id) => {
  const trigger = `[data-dialog-open="${id}"]`;
  await page.$eval(trigger, (n) => n.scrollIntoView({ block: 'center', behavior: 'instant' }));
  await page.click(trigger);
  await wait(350);
  return page.evaluate((id) => {
    const d = document.getElementById(id);
    const ref = (attr) => { const t = document.getElementById(d.getAttribute(attr)); return t ? t.textContent.trim().length > 0 : false; };
    return { open: d.open, role: d.getAttribute('role'), named: ref('aria-labelledby'), described: ref('aria-describedby'), focus: document.activeElement.value, inside: d.contains(document.activeElement) };
  }, id);
};
const cd1 = await confirmUi('confirm-delete');
cd1.open && cd1.role === 'alertdialog' && cd1.named && cd1.described ? pass('the confirmation is an alertdialog named by its title and described by its message') : fail(`confirm markup: ${JSON.stringify(cd1)}`);
cd1.inside && cd1.focus === 'cancel' ? pass('focus starts on the safe action, Cancel') : fail(`confirm focus: ${JSON.stringify(cd1)}`);
const trapped = [];
// The page behind a modal is inert, so Tab either stays in the dialog or goes out to the browser's own UI (focus on <body>); it never lands on the page.
for (let i = 0; i < 4; i++) { await page.keyboard.press('Tab'); trapped.push(await page.evaluate(() => document.activeElement === document.body || !!document.activeElement.closest('#confirm-delete'))); }
trapped.every(Boolean) ? pass('Tab never reaches the page behind the open confirmation') : fail(`Tab reached the page behind the dialog: ${trapped}`);
await page.focus('#confirm-delete button[value="cancel"]');
await page.keyboard.press('Escape');
await wait(300);
const esc = await page.evaluate(() => ({ open: document.getElementById('confirm-delete').open, how: document.querySelector('output[for="confirm-delete"]').value, back: document.activeElement.getAttribute('data-dialog-open') }));
!esc.open && esc.how === 'dismissed' && esc.back === 'confirm-delete' ? pass('Esc cancels ("dismissed") and focus returns to the button that opened it') : fail(`confirm Esc: ${JSON.stringify(esc)}`);
await confirmUi('confirm-delete');
await page.click('#confirm-delete button[value="deleted"]');
await wait(300);
(await page.$eval('output[for="confirm-delete"]', (o) => o.value)) === 'deleted' ? pass('the destructive action closes it with its own value ("deleted")') : fail('confirm action value');
const cd2 = await confirmUi('confirm-send');
cd2.open && cd2.focus === 'cancel' && cd2.role === 'alertdialog' && cd2.named && cd2.described === false ? pass('a dialog with no separate description is still named, and starts on the safe action') : fail(`confirm 2: ${JSON.stringify(cd2)}`);
await page.keyboard.press('Escape');
await wait(250);
await page.setViewport({ width: 320, height: 700 });
await confirmUi('confirm-delete');
const confirmNarrow = await page.evaluate(() => { const r = document.getElementById('confirm-delete').getBoundingClientRect(); return { fits: r.left >= 0 && r.right <= innerWidth, page: document.documentElement.scrollWidth <= innerWidth + 1 }; });
confirmNarrow.fits && confirmNarrow.page ? pass('the confirmation fits a 320px screen') : fail(`confirm at 320px: ${JSON.stringify(confirmNarrow)}`);
await page.keyboard.press('Escape');
await wait(250);
await page.setViewport({ width: 1280, height: 800 });

// ---- fonts ---------------------------------------------------------------------------------------
console.log('\nFont choices');
await open(1280);
const fontOf = (selector) => page.evaluate((sel) => getComputedStyle(document.querySelector(sel)).fontFamily, selector);
const sysBody = await fontOf('body');
for (const choice of ['sans', 'serif', 'both']) {
  await page.evaluate((value) => { document.documentElement.dataset.font = value; }, choice);
  const fam = { body: await fontOf('body'), heading: await fontOf('h3'), code: await fontOf('.code pre') };
  const monoOk = /mono|ui-monospace|Menlo|Consolas/i.test(fam.code);
  const bodyOk = choice === 'serif' ? /serif/i.test(fam.body) && !/sans/i.test(fam.body) : /Inter/.test(fam.body);
  const headOk = choice === 'sans' ? /Inter/.test(fam.heading) : /Source Serif/.test(fam.heading);
  monoOk && bodyOk && headOk ? pass(`"${choice}": body, headings and code take the right families (code stays monospace)`) : fail(`"${choice}": ${JSON.stringify(fam)}`);
  for (const width of [320, 768]) {
    await page.setViewport({ width, height: 800 });
    const wide = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
    !wide ? pass(`"${choice}" fits ${width}px without sideways scrolling`) : fail(`"${choice}" overflows at ${width}px`);
  }
  await page.setViewport({ width: 1280, height: 800 });
}
await page.evaluate(() => { delete document.documentElement.dataset.font; });
(await fontOf('body')) === sysBody ? pass('Default returns to the visitor\'s own fonts') : fail('Default did not restore the system fonts');

// ---- 2.5.7 Dragging alternatives ---------------------------------------------------------
console.log('\nSetting a draggable control with a plain click (WCAG 2.5.7)');
await open(1000);
const clickAt = async (selector, dx, dy, from = 'center') => {
  await page.$eval(selector, (n) => n.scrollIntoView({ block: 'center', behavior: 'instant' }));
  await wait(150);
  const box = await (await page.$(selector)).boundingBox();
  await page.mouse.click(box.x + (from === 'center' ? box.width / 2 : 0) + dx, box.y + (from === 'center' ? box.height / 2 : 0) + dy);
  await wait(150);
};
// knob: 70px to the right of the centre is 90 degrees clockwise, so about 83% of the range
const knob0 = +(await page.$eval('#volume', (i) => i.value));
await clickAt('.knob:has(#volume) .knob__dial', 70, -8);
const knob1 = +(await page.$eval('#volume', (i) => i.value));
knob1 !== knob0 && knob1 >= 8 ? pass(`clicking the knob ring set Volume ${knob0} -> ${knob1}`) : fail(`clicking the knob ring did not set Volume (${knob0} -> ${knob1})`);
// two-handle fader: click near the right end of the groove
const hi0 = +(await page.$eval('[aria-label="Maximum price"]', (i) => i.value));
const priceRange = '.range2:has([aria-label="Maximum price"])';
await clickAt(priceRange, 0, 0);                // centre of the groove, between the handles
await clickAt(priceRange, 250, 0);              // right of the upper handle
const hi1 = +(await page.$eval('[aria-label="Maximum price"]', (i) => i.value));
hi1 > hi0 ? pass(`clicking the groove moved the upper handle ${hi0} -> ${hi1}`) : fail(`clicking the groove did not move a handle (${hi0} -> ${hi1})`);
// rotary range: click the arc on the right side
const rhi0 = +(await page.$eval('[aria-label="Band high"]', (i) => i.value));
await clickAt('.rknob:has([aria-label="Band high"]) .rknob__dial', 66, 0);
const rhi1 = +(await page.$eval('[aria-label="Band high"]', (i) => i.value));
rhi1 > rhi0 ? pass(`clicking the arc moved the high handle ${rhi0} -> ${rhi1}`) : fail(`clicking the arc did not move a handle (${rhi0} -> ${rhi1})`);

// ---- 4.1.2 Name, role, value -------------------------------------------------------------
console.log('\nWhat a screen reader is told (accessibility tree)');
await open(1000);
const tree = await page.accessibility.snapshot({ interestingOnly: true });
const nodes = [];
(function walk(n) { nodes.push(n); (n.children ?? []).forEach(walk); })(tree);
// Chrome builds names from rendered text, so labels styled in capitals read "VOLUME" here;
// compare without case. Screen readers still speak them as words.
const find = (role, name) => nodes.find((n) => (role instanceof RegExp ? role.test(n.role) : n.role === role)
  && (name instanceof RegExp ? name.test(n.name ?? '') : (n.name ?? '').toLowerCase() === name.toLowerCase()));
const expect = (label, node, check = () => true) => (node && check(node) ? pass(label) : fail(`${label} — ${node ? JSON.stringify({ role: node.role, name: node.name, value: node.value, checked: node.checked, expanded: node.expanded }) : 'not found'}`));
// (the Declarative tags demo has a Volume knob too, so look at all of them)
expect('Volume knob is a slider named "Volume" reading "7"', nodes.find((n) => n.role === 'slider' && n.name?.toLowerCase() === 'volume' && String(n.value ?? n.valuetext) === '7'));
// Chrome's automation interface never reports aria-valuetext (not even for a plain div slider),
// so check the standard attribute itself. Confirm the spoken result with a real screen reader.
(await page.$eval('#tone', (i) => i.getAttribute('aria-valuetext'))) === 'Warm' ? pass('Tone knob has aria-valuetext "Warm" (a label, not a number)') : fail('aria-valuetext missing on the Tone knob');
expect('Brightness fader is a named slider', find('slider', 'Brightness'));
expect('range handles are two named sliders', find('slider', 'Minimum price') && find('slider', 'Maximum price'), Boolean);
expect('radio key "Auto" is checked', find('radio', 'Auto'), (n) => n.checked === true);
expect('icon-only key has a name ("Align left")', find('radio', 'Align left'));
expect('calendar toggle is a named button, collapsed', find('button', 'Choose dates'), (n) => n.expanded === false);
expect('accordion item is a button that reports expanded', find(/disclosure|button/i, /What is simar-ui/), (n) => typeof n.expanded === 'boolean');
expect('date fields are named', find('Date', 'Check in') && find('Date', 'Check out'), Boolean);
expect('the dialog is closed, so not in the tree', nodes.find((n) => n.role === 'dialog' && n.name === 'Output settings') ? null : { role: 'none' }, Boolean);
const unnamed = nodes.filter((n) => ['button', 'slider', 'radio', 'checkbox', 'combobox', 'textbox', 'spinbutton'].includes(n.role) && !(n.name ?? '').trim());
unnamed.length ? fail(`${unnamed.length} control(s) with no name: ${unnamed.slice(0, 4).map((n) => n.role).join(', ')}`) : pass('no control is nameless');

await browser.close();
console.log(failures ? `\n✗ ${failures} WCAG 2.2 check(s) failed` : '\n✓ WCAG 2.2 checks passed');
process.exit(failures ? 1 : 0);
