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

const run = async (label) => {
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
        if (bg && bg.a > 0.9) return [bg];
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
      if (node.closest(':disabled, input:disabled + *, label:has(input:disabled)')) continue;
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

  await page.goto(page_url());
  await wait(600);
  add(await run(`${t}, JavaScript on`));
  total += await gradientContrast(`${t}, JavaScript on`);
  // Lit text has to stay readable whichever highlight colour is chosen.
  for (const preset of ['blue', 'amber', 'red', 'violet']) {
    await page.evaluate((name) => { document.documentElement.dataset.lit = name; }, preset);
    total += await gradientContrast(`${t}, highlight ${preset}`);
  }
  await page.evaluate(() => { delete document.documentElement.dataset.lit; });

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

  // the plain-HTML fallback
  await page.goto(page_url('?js=off'));
  await wait(500);
  add(await run(`${t}, JavaScript off`));
  total += await gradientContrast(`${t}, JavaScript off`);
};

await suite('light');
await suite('dark');

await browser.close();
console.log(total ? `\n✗ ${total} accessibility violation(s)` : '\n✓ no accessibility violations');
process.exit(total ? 1 : 0);
