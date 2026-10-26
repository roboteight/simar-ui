// WCAG 2.2 AA checks that axe doesn't cover. Run with `npm run test:a11y`.
//   1.4.10 Reflow           no horizontal page scroll at 320px wide, axe clean at that width
//   1.4.11 / forced colours controls stay visible and distinguishable with forced-colors: active
//   2.3.3  Reduced motion   nothing transitions when prefers-reduced-motion is set
//   2.5.8  Target size      every interactive target is at least 24x24 CSS px
//   2.5.7  Dragging         knobs and two-handle ranges can be set with a plain click
//   4.1.2  Name, role, value the accessibility tree describes each control the way a screen reader would
// Exits non-zero on any failure.

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
  const scrollers = (n) => n.closest('pre, .ref-scroll, .code__body, .snippet__tabs, .daterange__pop'); // may scroll on their own
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
  const targets = [...document.querySelectorAll('button, a[href], summary, input:not([type="radio"]):not(.fader):not(.knob input):not(.rknob input):not(.range2 input), .key, .day, label.well, .knob__dial, .rknob__handle')]
    .filter(visible).filter((n) => !n.closest('.knob__tick-label'));
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
  const checked = document.querySelector('input[name="mode"]:checked + .key');
  const unchecked = document.querySelector('input[name="mode"]:not(:checked):not(:disabled) + .key');
  if (checked && unchecked && getComputedStyle(checked).backgroundColor === getComputedStyle(unchecked).backgroundColor) issues.push('the selected key looks the same as an unselected one');
  const thumb = document.querySelector('#bright');
  if (thumb && getComputedStyle(thumb, '::-webkit-slider-thumb').backgroundColor === 'rgba(0, 0, 0, 0)') issues.push('fader cap has no fill');
  return issues;
});
forced.length ? forced.forEach(fail) : pass('keys keep a border and the selected state is distinguishable');
await page.screenshot({ path: path.join(process.env.TMPDIR ?? '/tmp', 'simar-ui-forced-colors.png') });
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
    const root = getComputedStyle(document.querySelector('#loader-demo'));
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

// ---- 2.5.7 Dragging alternatives ---------------------------------------------------------
console.log('\nSetting a draggable control with a plain click (WCAG 2.5.7)');
await open(1000);
const clickAt = async (selector, dx, dy, from = 'center') => {
  await page.$eval(selector, (n) => n.scrollIntoView({ block: 'center' }));
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
await clickAt('.range2', 0, 0);                // centre of the groove, between the handles
await clickAt('.range2', 250, 0);              // right of the upper handle
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
expect('Volume knob is a slider named "Volume" reading "7"', find('slider', 'Volume'), (n) => String(n.value ?? n.valuetext) === '7');
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
