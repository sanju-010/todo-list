const CACHE_NAME = "todo-pwa-cache-v1";
const urlsToCache = [
  "index.html",
  "calendar.html",
  "completed.html",
  "./css/styles.css",
  "./js/tasks.js",
  "./js/calendar.js",
  "./js/completed.js",
  "./js/darkmode.js",
  "./js/firebase.js",
  "./js/authGuard.js",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png"
];

// Install and cache files
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

// Intercept requests
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// Clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      )
    )
  );
});
