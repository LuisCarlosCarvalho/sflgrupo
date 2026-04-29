// public/sw.js
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Estratégia básica de rede primeiro, mas essencial para PWA ser válido
  event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
});
