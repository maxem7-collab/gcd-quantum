// GCD Quantum 1.1.0 · trabajador de servicio: guarda la aplicación para usarla sin conexión
const CACHE = 'gcd-quantum-1.1.0-5c3ce5762b41';
const ASSETS = ["./","index.html","manifest.webmanifest","icon-192.png","icon-512.png","apple-touch-icon.png"];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  // la página se busca primero en la red (para recibir versiones nuevas) y, sin conexión, en el caché
  if (e.request.mode === 'navigate') { e.respondWith(fetch(e.request).then((r) => { const c = r.clone(); caches.open(CACHE).then((k) => k.put('index.html', c)); return r; }).catch(() => caches.match('index.html'))); return; }
  e.respondWith(caches.match(e.request).then((r) => r || fetch(e.request)));
});
