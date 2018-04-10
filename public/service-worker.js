self.addEventListener('install', e => {
    e.waitUntil(
        caches.open('away').then(cache => {

            return cache.addAll([

            ])
                .then(() => self.skipWaiting());
        })
    )
});

self.addEventListener('activate',  event => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(
            event.request, {
                ignoreSearch : true
            }
        ).then(response => {

            return response || fetch(event.request);
        }).catch(function(error) {
             console.log('Fetch failed; returning offline page instead.', error);
        })
    );
});