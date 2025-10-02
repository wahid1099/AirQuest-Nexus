// CleanSpace Service Worker
const CACHE_NAME = "cleanspace-v1.0.0";
const STATIC_CACHE = "cleanspace-static-v1.0.0";
const DYNAMIC_CACHE = "cleanspace-dynamic-v1.0.0";
const API_CACHE = "cleanspace-api-v1.0.0";

// Files to cache immediately
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/static/js/bundle.js",
  "/static/css/main.css",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
];

// API endpoints to cache
const API_ENDPOINTS = [
  "/api/nasa/power",
  "/api/nasa/merra2",
  "/api/air-quality",
  "/api/weather",
];

// Network-first resources (always try network first)
const NETWORK_FIRST = [
  "/api/auth",
  "/api/user",
  "/api/telemetry",
  "/api/realtime",
];

// Cache-first resources (use cache if available)
const CACHE_FIRST = [
  "/static/",
  "/icons/",
  "/images/",
  "https://fonts.googleapis.com",
  "https://fonts.gstatic.com",
];

// Install event - cache static assets
self.addEventListener("install", (event) => {
  console.log("Service Worker: Installing...");

  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => {
        console.log("Service Worker: Caching static assets");
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log("Service Worker: Static assets cached");
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error("Service Worker: Failed to cache static assets", error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activating...");

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (
              cacheName !== STATIC_CACHE &&
              cacheName !== DYNAMIC_CACHE &&
              cacheName !== API_CACHE
            ) {
              console.log("Service Worker: Deleting old cache", cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log("Service Worker: Activated");
        return self.clients.claim();
      })
  );
});

// Fetch event - handle requests
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== "GET") {
    return;
  }

  // Handle different types of requests
  if (isStaticAsset(url.pathname)) {
    event.respondWith(handleStaticAsset(request));
  } else if (isAPIRequest(url.pathname)) {
    event.respondWith(handleAPIRequest(request));
  } else if (isNetworkFirst(url.pathname)) {
    event.respondWith(handleNetworkFirst(request));
  } else {
    event.respondWith(handleDefault(request));
  }
});

// Background sync for offline actions
self.addEventListener("sync", (event) => {
  console.log("Service Worker: Background sync triggered", event.tag);

  if (event.tag === "sync-offline-actions") {
    event.waitUntil(syncOfflineActions());
  } else if (event.tag === "sync-telemetry") {
    event.waitUntil(syncTelemetry());
  }
});

// Push notifications
self.addEventListener("push", (event) => {
  console.log("Service Worker: Push received", event);

  const options = {
    body: event.data ? event.data.text() : "New update available!",
    icon: "/icons/icon-192x192.png",
    badge: "/icons/badge-72x72.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
    actions: [
      {
        action: "explore",
        title: "Open App",
        icon: "/icons/action-explore.png",
      },
      {
        action: "close",
        title: "Close",
        icon: "/icons/action-close.png",
      },
    ],
  };

  event.waitUntil(self.registration.showNotification("CleanSpace", options));
});

// Notification click
self.addEventListener("notificationclick", (event) => {
  console.log("Service Worker: Notification clicked", event);

  event.notification.close();

  if (event.action === "explore") {
    event.waitUntil(clients.openWindow("/"));
  }
});

// Helper functions
function isStaticAsset(pathname) {
  return CACHE_FIRST.some((pattern) => pathname.startsWith(pattern));
}

function isAPIRequest(pathname) {
  return (
    pathname.startsWith("/api/") ||
    API_ENDPOINTS.some((endpoint) => pathname.startsWith(endpoint))
  );
}

function isNetworkFirst(pathname) {
  return NETWORK_FIRST.some((pattern) => pathname.startsWith(pattern));
}

// Handle static assets (cache-first)
async function handleStaticAsset(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error("Service Worker: Static asset fetch failed", error);
    return new Response("Offline", { status: 503 });
  }
}

// Handle API requests (network-first with cache fallback)
async function handleAPIRequest(request) {
  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      // Cache successful API responses
      const cache = await caches.open(API_CACHE);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }

    throw new Error("Network response not ok");
  } catch (error) {
    console.log("Service Worker: API network failed, trying cache", error);

    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      // Add offline header
      const response = cachedResponse.clone();
      response.headers.set("X-Served-By", "ServiceWorker-Cache");
      return response;
    }

    // Return offline response for critical APIs
    if (
      request.url.includes("/api/air-quality") ||
      request.url.includes("/api/weather")
    ) {
      return new Response(
        JSON.stringify({
          error: "Offline",
          message: "Using cached data",
          offline: true,
        }),
        {
          headers: { "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    throw error;
  }
}

// Handle network-first requests
async function handleNetworkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    return networkResponse;
  } catch (error) {
    console.log("Service Worker: Network-first failed", error);

    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    return new Response("Offline", { status: 503 });
  }
}

// Handle default requests
async function handleDefault(request) {
  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Return offline page for navigation requests
    if (request.mode === "navigate") {
      return caches.match("/");
    }

    return new Response("Offline", { status: 503 });
  }
}

// Sync offline actions
async function syncOfflineActions() {
  try {
    console.log("Service Worker: Syncing offline actions");

    // Get offline actions from IndexedDB or localStorage
    const offlineActions = await getOfflineActions();

    for (const action of offlineActions) {
      try {
        await fetch("/api/sync", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(action),
        });

        // Remove synced action
        await removeOfflineAction(action.id);
      } catch (error) {
        console.error(
          "Service Worker: Failed to sync action",
          action.id,
          error
        );
      }
    }
  } catch (error) {
    console.error("Service Worker: Sync failed", error);
  }
}

// Sync telemetry data
async function syncTelemetry() {
  try {
    console.log("Service Worker: Syncing telemetry");

    const telemetryData = await getTelemetryData();

    if (telemetryData.length > 0) {
      await fetch("/api/telemetry/batch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(telemetryData),
      });

      await clearTelemetryData();
    }
  } catch (error) {
    console.error("Service Worker: Telemetry sync failed", error);
  }
}

// IndexedDB helpers (simplified)
async function getOfflineActions() {
  // Implementation would use IndexedDB
  return [];
}

async function removeOfflineAction(id) {
  // Implementation would use IndexedDB
}

async function getTelemetryData() {
  // Implementation would use IndexedDB
  return [];
}

async function clearTelemetryData() {
  // Implementation would use IndexedDB
}

// Message handling
self.addEventListener("message", (event) => {
  console.log("Service Worker: Message received", event.data);

  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  } else if (event.data && event.data.type === "CACHE_URLS") {
    event.waitUntil(
      caches.open(DYNAMIC_CACHE).then((cache) => cache.addAll(event.data.urls))
    );
  }
});

console.log("Service Worker: Loaded");

