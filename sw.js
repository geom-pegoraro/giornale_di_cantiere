// ═══════════════════════════════════════════════════════════
//  GIORNALE DI CANTIERE — Service Worker
//  Aggiorna APP_VERSION ad ogni rilascio su GitHub
// ═══════════════════════════════════════════════════════════

const APP_VERSION = '1.2.0';
const CACHE_NAME  = 'cantiere-v' + APP_VERSION;

// ── Changelog ──
const CHANGELOG = {
  '1.0.0': {
    title: '🚀 Prima versione',
    items: [
      'Gestione multi-cantiere',
      'Report giornaliero con 5 sezioni',
      'Note vocali e foto',
      'GPS automatico',
      'Archivio report',
      'Funzionamento offline'
    ]
  },
  '1.2.0': {
    title: '✨ Novità 1.2.0',
    items: [
      'Modifica dati cantiere in qualsiasi momento',
      'PDF completamente ridisegnato: sfondo chiaro, layout professionale',
      'Tutte le sezioni sempre visibili nel PDF (anche se vuote)',
      'Footer PDF fisso in fondo al foglio A4',
      'Avanzamento % con pulsanti +/- senza tastiera'
    ]
  },
  '1.1.0': {
    title: '✨ Novità versione 1.1.0',
    items: [
      'Cantieri come cartelle: entra nel cantiere e gestisci i report',
      'Un solo report per giorno (nessun duplicato)',
      'Export PDF: singolo report o raccolta completa del cantiere',
      'Copertina PDF con dati cantiere e indice',
      'Logo aziendale personalizzabile nel PDF',
      'Footer PDF con dati azienda (nome, indirizzo, contatti)',
      'Fix: cursore avanzamento % senza tastiera virtuale',
      'Campo Impresa esecutrice nel cantiere'
    ]
  }
};

const ASSETS_TO_CACHE = [
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  'https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500&family=Syne:wght@400;600;700;800&display=swap'
];

// ── INSTALL ──
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      cache.addAll(ASSETS_TO_CACHE).catch(() => {})
    )
  );
});

// ── ACTIVATE ──
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k.startsWith('cantiere-') && k !== CACHE_NAME)
            .map(k => caches.delete(k))
      )
    ).then(() => {
      self.clients.claim();
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

// ── FETCH ──
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

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
