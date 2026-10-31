// Service worker for the demo and docs page: makes it work offline and lets it be installed as an app.
// It is for the docs only; the library itself (dist/) does not need it. It runs on https and localhost.
//
// Keep VERSION in step with package.json (a test checks). A new version caches the files again and
// removes the old cache; the page is told, and offers a reload.
const VERSION = '1.2.1';
const CACHE = `simar-ui-${VERSION}`;
const FILES = [
  './',
  'index.html',
  'manifest.webmanifest',
  'dist/simar-ui.css',
  'dist/simar-ui.js',
  'dist/simar-ui-icons.svg',
  'docs/docs.css',
  'docs/loader.js',
  'docs/snippets.js',
  'docs/search.js',
  'docs/page.js',
  'docs/vendor/chartist.min.js',
  'docs/vendor/chartist.min.css',
  'dist/simar-ui-charts.js',
  'docs/vendor/leaflet/leaflet.js',
  'docs/vendor/leaflet/leaflet.css',
  'dist/simar-ui-maps.js',
  'docs/media/lv-426-surface.svg',
  'docs/media/hypersleep-bay.svg',
  'docs/media/ship-corridor.svg',
  'docs/media/nostromo-exterior.svg',
  'docs/logo/simar-ui-mark.svg',
  'docs/logo/icon-32.png',
  'docs/logo/icon-192.png',
  'docs/logo/icon-512.png',
  'docs/logo/icon-maskable-512.png',
  'docs/logo/apple-touch-icon.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(FILES)));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key.startsWith('simar-ui-') && key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

// Pages and files from this site: answer from the cache at once, and refresh the cache from the network
// in the background. Anything else (such as web fonts from Google) goes straight to the network.
self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;
  event.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const cached = await cache.match(request, { ignoreSearch: request.mode === 'navigate' });
      const fresh = fetch(request).then((response) => {
        if (response.ok) cache.put(request, response.clone());
        return response;
      }).catch(() => cached);
      return cached ?? fresh;
    }),
  );
});

self.addEventListener('message', (event) => {
  if (event.data === 'skip-waiting') self.skipWaiting();
});
