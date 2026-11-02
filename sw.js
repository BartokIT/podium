// Stage Plan service worker: makes the app installable and usable offline.
const CACHE = "stageplan-v1";
const CORE = ["./", "./index.html", "./config.js", "./drive.js", "./manifest.webmanifest", "./icons/icon-192.png", "./icons/icon-512.png", "./icons/icon-maskable-512.png", "./icons/apple-touch-icon.png"];
const FONT_HOSTS = ["fonts.googleapis.com", "fonts.gstatic.com"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  const same = url.origin === self.location.origin;
  // Google sign-in and Drive: always from the network, never cached.
  if (!same && !FONT_HOSTS.includes(url.hostname)) return;
  // App files: network first (latest version), cached copy as fallback.
  if (same) {
    e.respondWith(fetch(req).then(r => {
      if (r && r.ok) { const c = r.clone(); caches.open(CACHE).then(x => x.put(req.mode === "navigate" ? "./index.html" : req, c)); }
      return r;
    }).catch(() => caches.match(req.mode === "navigate" ? "./index.html" : req).then(h => h || caches.match("./index.html"))));
    return;
  }
  // Fonts: cached copy first.
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => {
    if (r && (r.ok || r.type === "opaque")) { const c = r.clone(); caches.open(CACHE).then(x => x.put(req, c)); }
    return r;
  })));
});
