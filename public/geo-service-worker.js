// geo-service-worker.js
self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(clients.claim());
});

// Interceptar TODAS las solicitudes de geolocalización
self.addEventListener('fetch', event => {
  if (event.request.url.includes('geolocation') || 
      event.request.url.includes('location') ||
      event.request.url.includes('permissions')) {
    event.respondWith(new Response('', {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }));
  }
});
