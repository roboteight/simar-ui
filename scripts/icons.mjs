// Renders the application icons from the logo SVGs: npm run icons
// Needs Chrome (set CHROME_PATH if it isn't in the default macOS location).

import puppeteer from 'puppeteer-core';
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const dir = path.join(root, 'docs', 'logo');
const jobs = [
  ['simar-ui-mark.svg', 'icon-16.png', 16],
  ['simar-ui-mark.svg', 'icon-32.png', 32],
  ['simar-ui-mark.svg', 'icon-48.png', 48],
  ['simar-ui-mark.svg', 'apple-touch-icon.png', 180],
  ['simar-ui-mark.svg', 'icon-192.png', 192],
  ['simar-ui-mark.svg', 'icon-512.png', 512],
  ['simar-ui-mark-maskable.svg', 'icon-maskable-512.png', 512],
];

const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: 'new',
  args: ['--no-sandbox'],
});
const page = await browser.newPage();
for (const [source, out, size] of jobs) {
  await page.setViewport({ width: size, height: size });
  const svg = readFileSync(path.join(dir, source), 'utf8').replace('<svg ', `<svg width="${size}" height="${size}" `);
  await page.setContent(`<body style="margin:0;background:transparent">${svg}</body>`);
  writeFileSync(path.join(dir, out), await page.screenshot({ omitBackground: true }));
  console.log(`  ${out.padEnd(26)} ${size}x${size}`);
}
await browser.close();
