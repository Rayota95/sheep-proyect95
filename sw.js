// Majada: guarda la app para que abra aunque no haya internet.
const CACHE = 'majada-v2';
const CORE = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png'];
const TILES = 'majada-mapa-v1', MAX_TILES = 1500;
self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE && k !== TILES).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  const req = e.request; if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const esMapa = url.hostname === 'server.arcgisonline.com' || url.hostname === 'tile.openstreetmap.org';
  const esFuente = url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';
  if (esMapa) { // el mapa que ya viste queda guardado para verlo sin señal
    e.respondWith(caches.open(TILES).then(async c => { const hit = await c.match(req); if (hit) return hit;
      try { const r = await fetch(req); if (r.ok || r.type === 'opaque') { c.put(req, r.clone()); c.keys().then(ks => { if (ks.length > MAX_TILES) ks.slice(0, ks.length - MAX_TILES).forEach(k => c.delete(k)); }); } return r; }
      catch (err) { return new Response('', { status: 504 }); } }));
    return;
  }
  if (url.origin !== location.origin && !esFuente) return;
  e.respondWith(caches.open(CACHE).then(async c => {
    const key = req.mode === 'navigate' ? './index.html' : req; const hit = await c.match(key);
    const red = fetch(req).then(r => { if (r && (r.ok || r.type === 'opaque')) c.put(key, r.clone()); return r; }).catch(() => hit);
    return hit || red;
  }));
});
self.addEventListener('notificationclick', e => { e.notification.close(); e.waitUntil(self.clients.matchAll({ type: 'window' }).then(ws => ws.length ? ws[0].focus() : self.clients.openWindow('./'))); });
