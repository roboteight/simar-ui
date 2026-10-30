// Regenerates the README screenshots from the live demo: npm run screenshots
// Needs Chrome (set CHROME_PATH if it isn't in the default macOS location).

import puppeteer from 'puppeteer-core';
import { pathToFileURL } from 'node:url';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const out = path.join(root, 'docs', 'screenshots');
mkdirSync(out, { recursive: true });
const url = (file, query = '') => pathToFileURL(path.join(root, file)).href + query;
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: 'new',
  args: ['--no-sandbox'],
});
const page = await browser.newPage();
await page.setViewport({ width: 860, height: 900, deviceScaleFactor: 2 });
// Light first (the dark shots switch it below), whatever the machine is set to; no half-finished frames.
await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }, { name: 'prefers-color-scheme', value: 'light' }]);

const open = async (file, query) => {
  await page.goto(url(file, query));
  await wait(700);
  // Keep the floating toggle and the collapsed HTML keys out of the shots.
  await page.addStyleTag({ content: '.jsbar > .well, .themebar, .snippet:not([open]) { display: none !important; }' });
};

// A screenshot of whatever the given elements cover, with a little room for shadows.
const rect = (handle) => handle.evaluate((n) => { const r = n.getBoundingClientRect(); return { x: r.left + scrollX, y: r.top + scrollY, r: r.right + scrollX, b: r.bottom + scrollY }; });
const shoot = async (name, handles, pad = 14) => {
  const rs = await Promise.all(handles.map(rect));
  const x = Math.max(0, Math.min(...rs.map((r) => r.x)) - pad);
  const y = Math.max(0, Math.min(...rs.map((r) => r.y)) - pad);
  const clip = { x, y, width: Math.max(...rs.map((r) => r.r)) + pad - x, height: Math.max(...rs.map((r) => r.b)) + pad - y };
  await page.screenshot({ path: path.join(out, `${name}.png`), clip, captureBeyondViewport: true });
  console.log(`  ${name}.png  ${Math.round(clip.width)}x${Math.round(clip.height)}`);
};
const panel = async (legend) => {
  const handle = await page.evaluateHandle((text) => [...document.querySelectorAll('.panel')].find((p) => p.querySelector('legend')?.textContent.trim() === text) ?? null, legend);
  if (!handle.asElement()) throw new Error(`No panel with the legend "${legend}"`);
  return handle;
};
const section = (id) => page.$(`section[aria-labelledby="${id}"]`);

const heroStyle = '.panel.needs-js, main > section:not([aria-labelledby="buttons"]), main > h2.group, main > .jsbar { display: none !important; }';
console.log('Demo page');
await open('index.html');

// hero: the title and the first controls, without the page settings and install notes
await page.addStyleTag({ content: heroStyle });
await shoot('hero', [await page.$('h1'), await panel('Keys')], 24);
await page.reload();
await wait(700);
await page.addStyleTag({ content: '.jsbar > .well, .themebar, .snippet:not([open]) { display: none !important; }' });

await shoot('keys', [await panel('Keys'), await panel('Icon keys')]);
await shoot('radios', [await panel('Mode'), await panel('Channel'), await panel('Align')]);
await shoot('checks', [await panel('Checkboxes'), await panel('Switches')]);
await shoot('checklist', [await panel('Packing list')]);
await shoot('faders', [await panel('Faders'), await panel('Min and max')]);
await shoot('knobs', [await panel('Output'), await panel('Options')]);
await shoot('rotary', [await panel('Range')]);
await shoot('accordion', [await section('accordion')], 4);
await shoot('code', [await panel('Code block')]);
for (const key of await page.$$('[data-pause]')) await key.click();   // freeze the motion for a steady frame
await shoot('progress', [await panel('Progress')]);
await shoot('select-icons', [await panel('Select with icons')]);
await shoot('spinners', [await panel('Spinners')]);
for (const key of await page.$$('[data-pause]')) await key.click();
await shoot('meter', [await panel('Meter')]);
await shoot('typography', [await panel('Headings'), await panel('Text')]);
await shoot('quotes', [await panel('Blockquote'), await panel('Pull quote')]);
await shoot('blurbs', [await panel('Blurbs')]);
await shoot('tabs', [await panel('Tabs')]);
await shoot('alerts', [await panel('Alerts')]);
await shoot('appbars', [await panel('Top and bottom bars')]);
await shoot('sticky-table', [await panel('Sticky header and footer')]);
await shoot('bottom-nav', [await panel('Bottom navigation')]);
await shoot('chips', [await panel('Chips')]);
await shoot('searchbar', [await panel('Search bar')]);
await shoot('badges', [await panel('Badges')]);
await shoot('table', [await panel('Table')]);
await shoot('pagination', [await panel('Pagination')]);
await shoot('breadcrumb', [await panel('Breadcrumb')]);
await shoot('media', [await panel('Media')]);
await shoot('carousel', [await panel('Carousel')]);
await shoot('gallery', [await panel('Photo gallery')]);
await shoot('cards', [await panel('Cards')]);
await shoot('button-group', [await panel('Button group')]);
await shoot('theme-builder', [await panel('Theme builder')]);
await shoot('charts', [await panel('Line chart'), await panel('Bar chart'), await panel('Donut chart')]);
await wait(1500); // let the map tiles arrive
await shoot('map', [await panel('Map')]);
await shoot('timeline', [await panel('Vertical timeline'), await panel('Horizontal timeline, with progress')]);
await page.focus('#ac-country');
await page.keyboard.type('un');
await wait(300);
await shoot('autocomplete', [await panel('Autocomplete'), await page.$('.suggest')], 16);
await page.$eval('#ac-country', (i) => { i.value = ''; i.blur(); });
await shoot('datalist', [await panel('Suggestions')]);
await page.click('#menu-demo-button');
await wait(300);
await shoot('menu', [await panel('Menu'), await page.$('#menu-demo')], 16);
await page.keyboard.press('Escape');
await shoot('form-control', [await panel('Text inputs'), await panel('Textarea')]);
await shoot('date-time', [await panel('Date and time'), await panel('File and color')]);
await shoot('select', [await panel('Select')]);
await shoot('input-group', [await panel('Number stepper'), await panel('Password')]);
await shoot('validation', [await panel('Sign up')]);
await page.click('#signup button[type="submit"]');
await wait(400);
await shoot('validation-errors', [await panel('Sign up')]);
await page.click('#signup button[type="reset"]');
await page.evaluate(() => {
  for (const field of document.querySelectorAll('#signup input, #signup select')) {
    if (field.type === 'checkbox') field.checked = true;
    else if (field.tagName === 'SELECT') field.selectedIndex = 1;
    else if (field.type === 'email') field.value = 'hello@chrissimari.com';
    else if (field.type === 'number') field.value = '30';
    else if (!field.value && field.type === 'password') field.value = 'longenough1';
    else if (!field.value && field.type !== 'submit' && field.type !== 'reset') field.value = 'Chris';
  }
});
await page.click('#signup button[type="submit"]');
await wait(1300);
await shoot('form-sent', [await panel('Sign up')]);
await page.click('[data-sent-again]');

// the date range, with the calendar open and a range chosen
await (await page.$('section[aria-labelledby="dates"] .daterange button[popovertarget]')).evaluate((b) => b.scrollIntoView({ block: 'center' }));
await page.click('section[aria-labelledby="dates"] .daterange button[popovertarget]');
await wait(400);
const pop = await page.$('section[aria-labelledby="dates"] .daterange__pop');
await (await pop.$('[data-date="2026-11-04"]')).click();
await (await pop.$('[data-date="2026-11-12"]')).click();
await page.mouse.move(2, 2);
await wait(200);
// hide the page content around the calendar so the shot is just the component
await page.addStyleTag({ content: 'section[aria-labelledby="dates"] > .note, section[aria-labelledby="dates"] > .panel:nth-of-type(n+2), section[aria-labelledby="dates"] ~ section, section[aria-labelledby="dates"] > .snippet { visibility: hidden !important; }' });
await shoot('date-range', [await panel('Stay, two months'), pop], 18);
await page.keyboard.press('Escape');

// the HTML key opened to show how something is written
await (await panel('Keys')).evaluate((n) => n.scrollIntoView({ block: 'center' }));
const keysPanel = await panel('Keys');
const htmlKey = await keysPanel.evaluateHandle((n) => n.nextElementSibling);
await htmlKey.evaluate((d) => { d.open = true; });
await wait(300);
await (await (await htmlKey.$$('.snippet__tabs label'))[1]).click();
await wait(200);
await shoot('html-key', [keysPanel, htmlKey]);

// a tooltip, shown the way a keyboard user sees it (on a fresh page, so earlier steps can't interfere)
await open('index.html');
await (await page.$('#tooltip-demo')).evaluate((n) => n.scrollIntoView({ block: 'center', behavior: 'instant' }));
await page.mouse.move(0, 0);
await page.keyboard.press('Tab');
await page.focus('#tooltip-demo button[data-tooltip="Saves a copy to this device"]');
await page.waitForSelector('[role="tooltip"]:popover-open', { timeout: 4000 });
await wait(300);
await shoot('tooltip', [await panel('Tooltips'), await page.$('[role="tooltip"]:popover-open')], 20);
await page.evaluate(() => document.activeElement.blur());

// the dialog
await page.evaluate(() => document.querySelector('[commandfor="settings"]').scrollIntoView({ block: 'center' }));
await page.click('[commandfor="settings"]');
await wait(500);
await page.screenshot({ path: path.join(out, 'dialog.png'), clip: await page.evaluate(() => { const r = document.querySelector('#settings').getBoundingClientRect(); return { x: r.x + scrollX - 30, y: r.y + scrollY - 30, width: r.width + 60, height: r.height + 60 }; }) });
console.log('  dialog.png');
await page.keyboard.press('Escape');

// the confirmation dialog
await page.evaluate(() => document.querySelector('[commandfor="confirm-delete"]').scrollIntoView({ block: 'center' }));
await page.click('[commandfor="confirm-delete"]');
await wait(500);
await page.screenshot({ path: path.join(out, 'confirm-dialog.png'), clip: await page.evaluate(() => { const r = document.querySelector('#confirm-delete').getBoundingClientRect(); return { x: r.x + scrollX - 30, y: r.y + scrollY - 30, width: r.width + 60, height: r.height + 60 }; }) });
console.log('  confirm-dialog.png');
await page.keyboard.press('Escape');
// the time picker, open
await page.evaluate(() => document.querySelector('#tp-call').scrollIntoView({ block: 'start' }));
await page.click('#tp-call ~ .timepicker__button');
await wait(500);
await page.screenshot({ path: path.join(out, 'timepicker.png'), clip: await page.evaluate(() => { const a = document.querySelector('#tp-call').getBoundingClientRect(), r = document.querySelector('#tp-call ~ .timepicker__pop').getBoundingClientRect(); return { x: Math.max(0, a.x + scrollX - 20), y: Math.max(0, a.y + scrollY - 20), width: Math.max(a.width, r.width) + 40, height: r.bottom - a.y + 40 }; }) });
console.log('  timepicker.png');
await page.keyboard.press('Escape');
await wait(300);
// the bottom sheet (phone width, whole screen)
await page.setViewport({ width: 420, height: 560, deviceScaleFactor: 2 });
await page.evaluate(() => document.querySelector('[commandfor="share-sheet"]').scrollIntoView({ block: 'center' }));
await page.click('[commandfor="share-sheet"]');
await wait(500);
await page.screenshot({ path: path.join(out, 'bottom-sheet.png') });
console.log('  bottom-sheet.png');
await page.keyboard.press('Escape');
await wait(300);
await page.setViewport({ width: 860, height: 900, deviceScaleFactor: 2 });

// highlight colours
console.log('Themes page');
await open('docs/themes.html');
await shoot('themes', [await page.$('.themes')], 16);

// without JavaScript, and in Windows High Contrast
console.log('Dark theme');
await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }, { name: 'prefers-color-scheme', value: 'dark' }]);
await open('index.html');
await page.addStyleTag({ content: heroStyle });
await shoot('hero-dark', [await page.$('h1'), await panel('Keys')], 24);
await page.reload();
await wait(700);
await page.addStyleTag({ content: '.jsbar > .well, .themebar, .snippet:not([open]) { display: none !important; }' });
await shoot('radios-dark', [await panel('Mode'), await panel('Channel'), await panel('Align')]);
await shoot('checks-dark', [await panel('Checkboxes'), await panel('Switches')]);
await shoot('faders-dark', [await panel('Faders'), await panel('Min and max')]);
await shoot('knobs-dark', [await panel('Output'), await panel('Options')]);
for (const key of await page.$$('[data-pause]')) await key.click();
await shoot('progress-dark', [await panel('Progress')]);
await shoot('form-control-dark', [await panel('Text inputs'), await panel('Textarea')]);
await page.click('#signup button[type="submit"]');
await wait(400);
await shoot('validation-errors-dark', [await panel('Sign up')]);
await page.click('#signup button[type="reset"]');

// the Auto / Light / Dark dropdown, top right of the page
await page.addStyleTag({ content: '.themebar { display: block !important; }' });
await page.evaluate(() => scrollTo(0, 0));
await page.screenshot({ path: path.join(out, 'theme-control.png'), clip: { x: 860 - 190, y: 0, width: 190, height: 74 } });
console.log('  theme-control.png');
await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }, { name: 'prefers-color-scheme', value: 'light' }]);

console.log('Table of contents');
await page.setViewport({ width: 1280, height: 720, deviceScaleFactor: 2 });
await open('index.html');
await page.addStyleTag({ content: '.themebar { display: block !important; }' });
await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
await wait(300);
await page.screenshot({ path: path.join(out, 'toc.png'), clip: { x: 0, y: 0, width: 620, height: 640 } });
console.log('  toc.png');
await page.setViewport({ width: 860, height: 900, deviceScaleFactor: 2 });

console.log('Without JavaScript');
await open('index.html', '?js=off');
await page.addStyleTag({ content: '.jsbar > .note { display: none !important; }' });
await shoot('no-js', [await panel('Faders'), await panel('Output')]);

console.log('Forced colours');
await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }, { name: 'forced-colors', value: 'active' }]);
await open('index.html');
await shoot('forced-colors', [await panel('Mode'), await panel('Faders')]);

await browser.close();
console.log('Done: docs/screenshots');
