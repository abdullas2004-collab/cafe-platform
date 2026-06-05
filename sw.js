// ProfitGuard AI Service Worker
// Enables offline-first behavior and background notifications

const CACHE_NAME = "profitguard-v1";
const RUNTIME_CACHE = "profitguard-runtime";

// Files to cache on install (shell)
const PRECACHE_URLS = [
  "/",
  "/index.html",
  "/manifest.json"
];

// On install: precache the app shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// On activate: clean up old caches
self.addEventListener("activate", (event) => {
  const currentCaches = [CACHE_NAME, RUNTIME_CACHE];
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return cacheNames.filter((name) => !currentCaches.includes(name));
      })
      .then((cachesToDelete) => {
        return Promise.all(
          cachesToDelete.map((name) => caches.delete(name))
        );
      })
      .then(() => self.clients.claim())
  );
});

// On fetch: network-first for API calls, cache-first for assets
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Skip non-GET requests
  if (event.request.method !== "GET") return;

  // Skip Supabase and external APIs (always go to network)
  if (
    url.hostname.includes("supabase") ||
    url.hostname.includes("anthropic") ||
    url.hostname !== self.location.hostname
  ) {
    return;
  }

  // For navigation requests, try network first, fall back to cache
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => caches.match("/index.html"))
    );
    return;
  }

  // For everything else, cache first then network
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        // Cache successful responses
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      });
    })
  );
});

// Handle push notifications (for future server-side push)
self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || "ProfitGuard AI";
  const options = {
    body: data.body || "You have a new update.",
    icon: data.icon || "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxOTIgMTkyIj48cmVjdCB3aWR0aD0iMTkyIiBoZWlnaHQ9IjE5MiIgZmlsbD0iIzFhNmNmZiIgcng9IjQyIi8+PC9zdmc+",
    badge: data.badge,
    tag: data.tag || "profitguard",
    data: data.data || {},
    requireInteraction: data.persist || false
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/";
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        // If a tab is already open, focus it
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && "focus" in client) {
            return client.focus();
          }
        }
        // Otherwise open a new tab
        if (clients.openWindow) return clients.openWindow(url);
      })
  );
});
