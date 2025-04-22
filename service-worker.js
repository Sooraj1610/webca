const CACHE_NAME = 'hospital-cache-v1';
const urlsToCache = [
    '/',
    '/hospital.html',
    '/aboutus.html',
    '/special-care.html',
    '/outreach.html',
    '/telemedicine.html',
    '/contact.html',
    '/css/styles.css',
    '/js/script.js',
    '/images/header.png',
    '/images/generalcare.png',
    '/images/emergency.png',
    '/images/diagonastic.png',
    '/images/surgery.png'
];

// Install the service worker and cache resources
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('Opened cache');
            return cache.addAll(urlsToCache);
        })
    );
});

// Fetch resources from the cache or network
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});

// Activate the service worker and clean up old caches
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});