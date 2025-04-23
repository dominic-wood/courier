// public/sw.js
const CACHE_NAME = 'courier-cache-v1';
const ASSETS = [
  '/', 
  '/index.html',
  '/favicon.ico',
  '/manifest.json',
  // add your main JS/CSS bundles here, e.g.:
  '/static/js/main.js',
  '/static/css/main.css'
];

self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', evt => {
  evt.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', evt => {
  evt.respondWith(
    caches.match(evt.request).then(cachedRes => {
      return cachedRes || fetch(evt.request);
    })
  );
});
