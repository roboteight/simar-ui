// The suggested flows page (docs/flows.html): sign-in, checkout, onboarding, and empty and error pages.
// axe with every rule on, light and dark, at desktop and 320px, with JavaScript on and off; then the behavior
// of the sign-in and checkout flows, and the page basics (language, one h1, landmarks, named controls).
//   node tests/flows.mjs          (set CHROME_PATH if Chrome is not in the default macOS location)

import puppeteer from 'puppeteer-core';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const require = createRequire(import.meta.url);
const axeSource = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const url = pathToFileURL(path.join(root, 'docs', 'flows.html')).href;
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

// "JavaScript off" blocks the library's script (the page's own scripts are inline handlers only), so axe can still run.
let blockScript = false;
await page.setRequestInterception(true);
page.on('request', (req) => (blockScript && req.url().endsWith('/dist/simar-ui.js') ? req.abort() : req.continue()));

const open = async ({ width = 1280, scheme = 'light', js = true } = {}) => {
  blockScript = !js;
  await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: scheme }, { name: 'prefers-reduced-motion', value: 'reduce' }]);
  await page.setViewport({ width, height: 900 });
  await page.goto(url);
  await page.addStyleTag({ content: 'html { scroll-behavior: auto !important; }' });
  await wait(500);
};

const axeRun = async (label) => {
  await page.evaluate(axeSource);
  const result = await page.evaluate(() => axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] } }));
  if (result.violations.length) {
    fail(`axe, ${label}: ${result.violations.map((v) => `${v.id} (${v.nodes.slice(0, 3).map((n) => n.target.join(' ')).join('; ')})`).join(', ')}`);
  } else pass(`axe is clean, ${label} (${result.passes.length} rules passed)`);
};

console.log('Suggested flows: axe');
for (const [scheme, width, js] of [['light', 1280, true], ['dark', 1280, true], ['light', 320, true], ['dark', 320, true], ['light', 1280, false]]) {
  await open({ width, scheme, js });
  await axeRun(`${scheme}, ${width}px, JavaScript ${js ? 'on' : 'off'}`);
}

console.log('\nSuggested flows: the page');
await open();
const basics = await page.evaluate(() => ({
  lang: document.documentElement.lang, title: document.title, h1: document.querySelectorAll('h1').length, main: document.querySelectorAll('main').length,
  nav: document.querySelector('nav')?.getAttribute('aria-label'), sections: [...document.querySelectorAll('main > section')].map((s) => !!document.getElementById(s.getAttribute('aria-labelledby'))?.textContent.trim()),
}));
basics.lang === 'en' && basics.title && basics.h1 === 1 && basics.main === 1 && basics.nav && basics.sections.length === 4 && basics.sections.every(Boolean) ? pass('the page has a language, a title, one h1, one main, a named nav and four named sections') : fail(`page basics: ${JSON.stringify(basics)}`);
const tree = await page.accessibility.snapshot({ interestingOnly: true });
const nodes = [];
(function walk(n) { nodes.push(n); (n.children ?? []).forEach(walk); })(tree);
const nameless = nodes.filter((n) => ['button', 'link', 'textbox', 'checkbox', 'radio', 'combobox', 'spinbutton'].includes(n.role) && !(n.name ?? '').trim());
nameless.length === 0 ? pass('every button, link and field has a name') : fail(`${nameless.length} control(s) with no name: ${nameless.map((n) => n.role).join(', ')}`);

console.log('\nSuggested flows: sign in');
await page.$eval('#signin-form', (n) => n.scrollIntoView({ block: 'center', behavior: 'instant' }));
await page.click('#signin-form button[type="submit"]');
await wait(150);
const si1 = await page.evaluate(() => ({ focus: document.activeElement.id, alert: document.getElementById('signin-alert').hidden, msgs: [...document.querySelectorAll('#signin-form [data-error-message], #signin-form .field__error')].map((n) => n.textContent.trim()).filter(Boolean) }));
si1.focus === 'si-email' && si1.alert ? pass('submitting an empty form keeps the failure alert hidden and puts focus on the first field to fix') : fail(`sign-in empty: ${JSON.stringify(si1)}`);
await page.type('#si-email', 'ripley@chrissimari.com');
await page.type('#si-pass', 'nostromo');
await page.click('#signin-form [data-reveal]');
const si2 = await page.evaluate(() => ({ type: document.getElementById('si-pass').type, pressed: document.querySelector('#signin-form [data-reveal]').getAttribute('aria-pressed') }));
si2.type === 'text' && si2.pressed === 'true' ? pass('the reveal key shows the password and reports it with aria-pressed') : fail(`reveal: ${JSON.stringify(si2)}`);
await page.click('#signin-form button[type="submit"]');
await wait(150);
const si3 = await page.evaluate(() => { const a = document.getElementById('signin-alert'); return { shown: !a.hidden, role: a.getAttribute('role'), text: a.textContent.trim().length > 20 }; });
si3.shown && si3.role === 'alert' && si3.text ? pass('a failed attempt reveals the alert (role="alert") with words that say what to do') : fail(`sign-in alert: ${JSON.stringify(si3)}`);

console.log('\nSuggested flows: checkout');
await page.$eval('#checkout-form', (n) => n.scrollIntoView({ block: 'center', behavior: 'instant' }));
const ck0 = await page.evaluate(() => ({ shown: [...document.querySelectorAll('#checkout-form .wizard__step')].map((s) => !s.hidden).join(), steps: document.querySelectorAll('#checkout-form .steps__item').length }));
ck0.shown === 'true,false,false,false' && ck0.steps === 4 ? pass('the wizard starts on the cart with four steps listed') : fail(`checkout start: ${JSON.stringify(ck0)}`);
await page.click('#checkout-form [data-next]');
await page.click('#checkout-form [data-next]');
const ck1 = await page.evaluate(() => ({ step: document.querySelector('#checkout-form .wizard__status').textContent, focus: document.activeElement.id }));
ck1.step === 'Step 2 of 4' && ck1.focus === 'co-name' ? pass('shipping will not move on while its fields are empty, and focus goes to the first one') : fail(`checkout validation: ${JSON.stringify(ck1)}`);
await page.type('#co-name', 'Ellen Ripley');
await page.type('#co-addr', '1 Nostromo Way');
await page.type('#co-zip', 'LV426');
await page.click('#checkout-form [data-next]');
await page.type('#co-card', '4242 4242 4242 4242');
await page.type('#co-exp', '08 / 27');
await page.click('#checkout-form [data-next]');
const ck2 = await page.evaluate(() => ({ step: document.querySelector('#checkout-form .wizard__status').textContent, done: [...document.querySelectorAll('#checkout-form .steps__item.is-done')].length }));
ck2.step === 'Step 4 of 4' && ck2.done === 3 ? pass('with every step valid it reaches the review, and the three earlier steps read as done') : fail(`checkout review: ${JSON.stringify(ck2)}`);
await page.click('#checkout-form button[type="submit"]');
(await page.$eval('#checkout-done', (n) => n.textContent)).startsWith('Order placed') ? pass('placing the order says so in a status message') : fail('checkout order');

console.log('\nSuggested flows: reflow');
await open({ width: 320 });
(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)) ? pass('no sideways scroll at 320px') : fail('flows overflow at 320px');

await browser.close();
console.log(failures ? `\n✗ ${failures} flows check(s) failed` : '\n✓ flows checks passed');
process.exit(failures ? 1 : 0);
