// Accessibility check. Runs the axe engine over the demo page in every state that changes
// the DOM: JavaScript on and off, the calendar popover open, the dialog open.
//   npm run test:a11y          (set CHROME_PATH if Chrome is not in the default macOS location)
// Exits non-zero on any violation, so it can gate a commit or CI.

import puppeteer from 'puppeteer-core';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const require = createRequire(import.meta.url);
const axeSource = (await import('node:fs')).readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const page_url = (query = '') => pathToFileURL(path.join(root, 'index.html')).href + query;

const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: 'new',
  args: ['--no-sandbox'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1000, height: 900 });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
// Self-test hook: EXTRA_CSS='...' is injected after every page load, to prove a check can fail.
const load = async (href) => { await page.goto(href); if (process.env.EXTRA_CSS) await page.addStyleTag({ content: process.env.EXTRA_CSS }); };

const run = async (label) => {
  // axe scrolls offscreen targets into view to measure them; with smooth scrolling it can measure mid-scroll
  // (a link half behind the sticky header), so the result changes from run to run. Scroll instantly instead.
  await page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; });
  await page.evaluate(axeSource);
  const result = await page.evaluate(() => axe.run(document, {
    runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] },
    // No rules are switched off. If one fails, fix the page.
  }));
  console.log(`\n${label}: ${result.violations.length} violation(s), ${result.passes.length} rules passed, ${result.incomplete.length} need review`);
  for (const v of result.violations) {
    console.log(`  [${v.impact}] ${v.id}: ${v.help}`);
    for (const n of v.nodes.slice(0, 4)) console.log(`      ${n.target.join(' ')}\n        ${n.failureSummary.split('\n').slice(1).join(' ').slice(0, 170)}`);
    if (v.nodes.length > 4) console.log(`      …and ${v.nodes.length - 4} more`);
  }
  // Items axe can't decide on its own (usually text over gradients or images): list them so a
  // human looks, without failing the run.
  for (const item of result.incomplete) {
    console.log(`  needs a human look: ${item.id} (${item.nodes.length}) e.g. ${item.nodes[0].target.join(' ')}`);
  }
  return result;
};

// axe cannot compute contrast over gradients (every key cap is one), so check text against both
// ends of any gradient behind it. Normal text needs 4.5:1; large text (24px, or 18.66px bold) 3:1.
const gradientContrast = async (label) => {
  await wait(450); // let colour fades finish, so the final colours are measured
  const found = await page.evaluate(() => {
    // Any CSS colour (rgb, color(srgb), oklab mid-transition, ...) is converted by painting it.
    const ctx = document.createElement('canvas').getContext('2d', { willReadFrequently: true });
    ctx.canvas.width = ctx.canvas.height = 1;
    const toRgba = (css) => {
      ctx.clearRect(0, 0, 1, 1);
      ctx.fillStyle = '#000'; ctx.fillStyle = css;
      ctx.fillRect(0, 0, 1, 1);
      const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
      return { r, g, b, a: a / 255 };
    };
    const parse = (text) => (text.match(/(?:rgba?|color|oklab|oklch|lab|lch|hsla?|hwb)\([^)]*\)/g) ?? []).map(toRgba);
    const over = (c, under) => ({ r: c.r * c.a + under.r * (1 - c.a), g: c.g * c.a + under.g * (1 - c.a), b: c.b * c.a + under.b * (1 - c.a), a: 1 });
    const white = { r: 255, g: 255, b: 255, a: 1 };
    const lum = ({ r, g, b }) => {
      const [x, y, z] = [r, g, b].map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; });
      return 0.2126 * x + 0.7152 * y + 0.0722 * z;
    };
    const ratio = (a, b) => { const [hi, lo] = [lum(a), lum(b)].sort((p, q) => q - p); return (hi + 0.05) / (lo + 0.05); };
    const backdrop = (node) => {
      for (let n = node; n; n = n.parentElement) {
        const cs = getComputedStyle(n);
        if (cs.backgroundImage.includes('gradient')) {
          const stops = parse(cs.backgroundImage).filter((c) => c.a > 0.9);
          if (stops.length) return stops;
        }
        const bg = parse(cs.backgroundColor)[0];
        if (bg && bg.a > 0.9) {
          // The page itself carries a vignette: measure against its darkest point as well.
          if (n === document.body) {
            const v = parse(getComputedStyle(document.documentElement).getPropertyValue('--vignette'))[0];
            if (v) return [bg, over(v, bg)];
          }
          return [bg];
        }
      }
      return [white];
    };
    const out = [];
    const seen = new Set();
    for (const node of document.body.querySelectorAll('*')) {
      if (node.closest('svg, dialog:not([open]), [hidden], .needs-js:not(:root *)')) continue;
      const own = [...node.childNodes].some((c) => c.nodeType === 3 && c.textContent.trim());
      const isField = node.matches('input[type="date"]');
      if (!own && !isField) continue;
      // Disabled controls are exempt from WCAG contrast, but they are held to the same 4.5:1 here:
      // a disabled button should still be readable.
      const cs = getComputedStyle(node);
      if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity === 0) continue;
      const rect = node.getBoundingClientRect();
      if (!rect.width) continue;
      const size = parseFloat(cs.fontSize);
      const large = size >= 24 || (size >= 18.66 && +cs.fontWeight >= 700);
      const need = large ? 3 : 4.5;
      const text = parse(cs.color)[0];
      let worst = Infinity;
      for (const bg of backdrop(node)) worst = Math.min(worst, ratio(over(text, bg), bg));
      if (worst < need) {
        const key = node.tagName + node.className + node.textContent.trim().slice(0, 20);
        if (!seen.has(key)) { seen.add(key); out.push({ el: `${node.tagName.toLowerCase()}${node.className ? '.' + String(node.className).split(' ')[0] : ''} "${(node.textContent || node.value || '').trim().slice(0, 24)}"`, ratio: +worst.toFixed(2), need }); }
      }
    }
    return out;
  });
  console.log(`\n${label}: ${found.length} gradient contrast failure(s)`);
  for (const f of found) console.log(`  ${f.ratio}:1 (needs ${f.need}:1)  ${f.el}`);
  return found.length;
};

let total = 0;
const add = (r) => { total += r.violations.length; };

// The whole suite runs once per theme: light and dark are both first-class.
const suite = async (theme) => {
  await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: theme }]);
  const t = `${theme} theme`;

  await load(page_url());
  await wait(600);
  add(await run(`${t}, JavaScript on`));
  total += await gradientContrast(`${t}, JavaScript on`);
  // Lit text has to stay readable whichever highlight colour is chosen.
  for (const preset of ['blue', 'amber', 'red', 'violet', 'deep-orange', 'orange', 'yellow', 'lime', 'light-green', 'teal', 'cyan', 'light-blue', 'indigo', 'deep-purple', 'purple', 'pink', 'brown', 'blue-grey']) {
    await page.evaluate((name) => { document.documentElement.dataset.lit = name; }, preset);
    total += await gradientContrast(`${t}, highlight ${preset}`);
  }
  await page.evaluate(() => { delete document.documentElement.dataset.lit; });
  // Every whole-page theme has to pass too, with its own surfaces and highlight.
  for (const palette of ['indigo', 'teal', 'rose', 'amber', 'forest', 'ocean']) {
    await page.evaluate((name) => { document.documentElement.dataset.palette = name; }, palette);
    add(await run(`${t}, ${palette} palette`));
    total += await gradientContrast(`${t}, ${palette} palette`);
  }
  await page.evaluate(() => { delete document.documentElement.dataset.palette; });
  // Every style (shape and depth) has to pass too: a style with no shadows still needs visible edges.
  for (const style of ['basic', 'brutal', 'classic', 'crisp', 'deep', 'line', 'round', 'soft']) {
    await page.evaluate((name) => { document.documentElement.dataset.style = name; }, style);
    add(await run(`${t}, ${style} style`));
    total += await gradientContrast(`${t}, ${style} style`);
  }
  await page.evaluate(() => { delete document.documentElement.dataset.style; });

  // calendar popover open
  await page.evaluate(() => document.querySelector('[data-daterange] button[popovertarget]').scrollIntoView({ block: 'center' }));
  await page.click('[data-daterange] button[popovertarget]');
  await wait(400);
  add(await run(`${t}, calendar open`));
  total += await gradientContrast(`${t}, calendar open`);
  await page.keyboard.press('Escape');
  await wait(200);

  // dialog open
  await page.evaluate(() => document.querySelector('[commandfor="settings"]').scrollIntoView({ block: 'center' }));
  await page.click('[commandfor="settings"]');
  await wait(400);
  add(await run(`${t}, dialog open`));
  total += await gradientContrast(`${t}, dialog open`);
  await page.keyboard.press('Escape');

  // confirmation dialog open
  await page.evaluate(() => document.querySelector('[commandfor="confirm-delete"]').scrollIntoView({ block: 'center', behavior: 'instant' }));
  await page.click('[commandfor="confirm-delete"]');
  await wait(400);
  add(await run(`${t}, confirmation dialog open`));
  total += await gradientContrast(`${t}, confirmation dialog open`);
  await page.keyboard.press('Escape');
  await wait(300);

  // bottom sheet open
  await page.evaluate(() => document.querySelector('[commandfor="share-sheet"]').scrollIntoView({ block: 'center', behavior: 'instant' }));
  await page.click('[commandfor="share-sheet"]');
  await wait(450);
  add(await run(`${t}, bottom sheet open`));
  total += await gradientContrast(`${t}, bottom sheet open`);
  await page.keyboard.press('Escape');
  await wait(300);

  // a tooltip showing (keyboard focus on an icon key)
  await page.evaluate(() => document.querySelector('#tooltip-demo button[data-tooltip="Settings"]').scrollIntoView({ block: 'center', behavior: 'instant' }));
  await page.keyboard.press('Tab');
  await page.evaluate(() => document.querySelector('#tooltip-demo button[data-tooltip="Settings"]').focus());
  await wait(300);
  add(await run(`${t}, tooltip showing`));
  total += await gradientContrast(`${t}, tooltip showing`);
  await page.keyboard.press('Escape');

  // the sign-up form with its errors showing
  await page.evaluate(() => document.querySelector('#signup').scrollIntoView({ block: 'center', behavior: 'instant' }));
  await page.click('#signup button[type="submit"]');
  await wait(300);
  add(await run(`${t}, form errors showing`));
  total += await gradientContrast(`${t}, form errors showing`);
  await page.click('#signup button[type="reset"]');

  // autocomplete suggestions showing
  await page.evaluate(() => document.querySelector('#ac-country').scrollIntoView({ block: 'center', behavior: 'instant' }));
  await page.focus('#ac-country');
  await page.keyboard.type('un', { delay: 30 });
  await wait(300);
  add(await run(`${t}, autocomplete open`));
  total += await gradientContrast(`${t}, autocomplete open`);
  await page.$eval('#ac-country', (i) => { i.value = ''; i.blur(); });

  // toasts showing
  await page.evaluate(() => { window.SimarUI.toast('Your changes are in.', { variant: 'success', duration: 0 }); window.SimarUI.toast('Check the card number.', { variant: 'danger', title: 'Payment failed', duration: 0 }); window.SimarUI.toast('Storage almost full.', { variant: 'warning', duration: 0 }); });
  await wait(300);
  add(await run(`${t}, toasts showing`));
  total += await gradientContrast(`${t}, toasts showing`);
  await page.evaluate(() => document.querySelectorAll('.toast').forEach((n) => n.remove()));

  // the dropdown menu open
  await page.evaluate(() => document.querySelector('#menu-demo-button').scrollIntoView({ block: 'center', behavior: 'instant' }));
  await page.click('#menu-demo-button');
  await wait(300);
  add(await run(`${t}, menu open`));
  total += await gradientContrast(`${t}, menu open`);
  await page.keyboard.press('Escape');

  // the settings drawer open
  await page.evaluate(() => scrollTo({ top: 1400, behavior: 'instant' }));
  await wait(300);
  await page.click('#settings-toggle');
  await wait(300);
  add(await run(`${t}, settings drawer open`));
  total += await gradientContrast(`${t}, settings drawer open`);
  await page.keyboard.press('Escape');
  await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));

  // the plain-HTML fallback
  await load(page_url('?js=off'));
  await wait(500);
  add(await run(`${t}, JavaScript off`));
  total += await gradientContrast(`${t}, JavaScript off`);
};

await suite('light');
await suite('dark');

await browser.close();
console.log(total ? `\n✗ ${total} accessibility violation(s)` : '\n✓ no accessibility violations');
process.exit(total ? 1 : 0);
