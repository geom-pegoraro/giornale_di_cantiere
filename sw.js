// ═══════════════════════════════════════════════════════════
//  GIORNALE DI CANTIERE — Service Worker
//  Aggiorna APP_VERSION ad ogni rilascio su GitHub
// ═══════════════════════════════════════════════════════════

const APP_VERSION = '1.0.0';
const CACHE_NAME  = 'cantiere-v' + APP_VERSION;

// ── Changelog: mostrato al primo avvio della nuova versione ──
// Questo oggetto viene letto dalla pagina tramite postMessage
const CHANGELOG = {
  '1.0.0': {
    title: '🚀 Prima versione',
    items: [
      'Gestione multi-cantiere: crea e seleziona cantieri',
      'Report giornaliero con 5 sezioni swipeable',
      'Registrazione note vocali',
      'Documentazione fotografica',
      'Rilevamento coordinate GPS automatico',
      'Archivio report per cantiere',
      'Funzionamento completamente offline'
    ]
  }
  // ── Aggiungi qui le versioni future, es:
  // '1.1.0': {
  //   title: '✨ Novità versione 1.1.0',
  //   items: [
  //     'Export PDF del report',
  //     'Firma digitale del DL',
  //     'Foto con annotazioni'
  //   ]
  // }
};

const ASSETS_TO_CACHE = [
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  'https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500&family=Syne:wght@400;600;700;800&display=swap'
];

// ── INSTALL: cache assets ──
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      cache.addAll(ASSETS_TO_CACHE).catch(() => {})
    )
  );
});

// ── ACTIVATE: remove old caches, notify clients ──
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k.startsWith('cantiere-') && k !== CACHE_NAME)
            .map(k => caches.delete(k))
      )
    ).then(() => {
      self.clients.claim();
      // Notify all open tabs about the new version
      self.clients.matchAll({ type: 'window' }).then(clients => {
        clients.forEach(client => {
          client.postMessage({
            type: 'NEW_VERSION',
            version: APP_VERSION,
            changelog: CHANGELOG[APP_VERSION] || null
          });
        });
      });
    })
  );
});

// ── FETCH: cache-first for assets, network-first for navigation ──
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Google Fonts: network first, fallback to cache
  if (url.hostname.includes('fonts.g')) {
    event.respondWith(
      fetch(event.request)
        .then(resp => {
          const clone = resp.clone();
          caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
          return resp;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // App shell: cache first, fallback network
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(resp => {
        if (resp && resp.status === 200 && event.request.method === 'GET') {
          const clone = resp.clone();
          caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
        }
        return resp;
      }).catch(() => caches.match('./index.html'));
    })
  );
});
