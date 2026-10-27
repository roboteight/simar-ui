// App checks for the docs page: the manifest and its icons, the service worker (served over http, since
// service workers don't run from file://), and that the page loads with the network turned off.
import puppeteer from 'puppeteer-core';
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.webmanifest': 'application/manifest+json', '.json': 'application/json' };
let failed = 0;
const pass = (m) => console.log(`  \u2713 ${m}`);
const fail = (m) => { failed++; console.log(`  \u2717 ${m}`); };
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

console.log('Manifest, icons and service worker');
const manifest = JSON.parse(readFileSync(path.join(root, 'manifest.webmanifest'), 'utf8'));
const pkg = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'));
const missing = manifest.icons.filter((icon) => !existsSync(path.join(root, icon.src)));
const sizes = manifest.icons.map((icon) => icon.sizes);
manifest.name && manifest.start_url && manifest.display === 'standalone' && !missing.length && sizes.includes('192x192') && sizes.includes('512x512') && manifest.icons.some((i) => i.purpose === 'maskable')
  ? pass('the manifest names the app and lists 192, 512 and maskable icons that exist') : fail(`manifest problem; missing: ${missing.map((m) => m.src)}`);
const swSource = readFileSync(path.join(root, 'sw.js'), 'utf8');
swSource.includes(`const VERSION = '${pkg.version}'`) ? pass(`sw.js VERSION matches package.json (${pkg.version})`) : fail(`sw.js VERSION is out of step with package.json ${pkg.version}`);
const listed = [...swSource.matchAll(/^\s+'([^']+)',$/gm)].map((m) => m[1]).filter((f) => f !== './');
const notThere = listed.filter((f) => !existsSync(path.join(root, f)));
!notThere.length ? pass(`all ${listed.length} cached files exist`) : fail(`sw.js lists files that don't exist: ${notThere}`);

const server = createServer((req, res) => {
  let file = path.join(root, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (existsSync(file) && statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!existsSync(file)) { res.writeHead(404).end('not found'); return; }
  res.writeHead(200, { 'content-type': types[path.extname(file)] ?? 'application/octet-stream' }).end(readFileSync(file));
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const url = `http://localhost:${server.address().port}/`;

const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.goto(url);
await page.waitForFunction(() => navigator.serviceWorker.ready.then(() => true), { timeout: 8000 }).catch(() => {});
await wait(800);
const reg = await page.evaluate(async () => { const r = await navigator.serviceWorker.getRegistration(); return { active: !!r?.active, scope: r?.scope, cached: (await caches.keys()).join() }; });
reg.active && /simar-ui-/.test(reg.cached) ? pass(`the service worker is active (scope ${reg.scope}) and its cache is ${reg.cached}`) : fail(`service worker: ${JSON.stringify(reg)}`);
const link = await page.$eval('link[rel="manifest"]', (l) => l.href);
(await page.evaluate((href) => fetch(href).then((r) => r.ok), link)) ? pass('the manifest link in the page resolves') : fail('the manifest link does not resolve');

await page.reload();
await wait(500);
await page.setOfflineMode(true);
await page.reload({ waitUntil: 'load' });
await wait(800);
const offline = await page.evaluate(() => ({ title: document.title, sections: document.querySelectorAll('main section').length, library: document.querySelector('[data-simar]') !== null, css: getComputedStyle(document.body).backgroundColor !== 'rgba(0, 0, 0, 0)' }));
offline.sections > 20 && offline.library && offline.css ? pass(`offline, the page loads whole (${offline.sections} sections, the library runs, styles apply)`) : fail(`offline: ${JSON.stringify(offline)}`);
await page.goto(`${url}?js=off`).catch(() => {});
await wait(500);
(await page.evaluate(() => document.querySelectorAll('main section').length)) > 20 ? pass('offline, the no-JavaScript view (?js=off) also loads') : fail('offline ?js=off did not load');
await page.setOfflineMode(false);
await browser.close();
server.close();
console.log(failed ? `\n\u2717 ${failed} app check(s) failed` : '\n\u2713 app checks passed');
process.exit(failed ? 1 : 0);
