// ═══════════════════════════════════════════════════════════
//  REPORT CANTIERE (Operaio) — Service Worker
// ═══════════════════════════════════════════════════════════

const APP_VERSION = '1.2.0';
const CACHE_NAME  = 'operaio-v' + APP_VERSION;

const ASSETS_TO_CACHE = [
  './index.html',
  './manifest.json',
  './icons/icon-operaio-192.png',
  './icons/icon-operaio-512.png',
  'https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500&family=Syne:wght@400;600;700;800&display=swap'
];

const CHANGELOG = {
  '1.2.0': {
    title: '📐 Layout & UX migliorata',
    items: [
      'Bottoni Salva/Firma sempre visibili senza scorrere',
      'Nuova opzione "Scatta foto" direttamente dalla fotocamera',
      'Prima di firmare devi salvare il report (messaggio di avviso)',
      'Report firmati: tocca per vedere opzioni (Visualizza / Invia / Elimina)'
    ]
  },
  '1.1.0': {
    title: '📎 Fix condivisione file',
    items: [
      'File report rinominato in .txt: WhatsApp ora lo accetta e allega correttamente',
      'Il contenuto del file rimane identico — l\'app capocantiere lo legge senza problemi',
      'Condivisione via Web Share API migliorata su Android Chrome PWA',
      'Messaggio di fallback più chiaro se WhatsApp non supporta allegati diretti'
    ]
  },
  '1.0.9': {
    title: '🔧 Miglioramenti',
    items: [
      'Invio report: scegli tra WhatsApp o Email',
      'Messaggio errore preciso su cosa manca alla firma',
      'Report firmati: solo visualizzazione e reinvio',
      'Rilevamento GPS automatico all\'apertura report',
      'Pulizia automatica report firmati dopo 7 giorni'
    ]
  }
};

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data && event.data.type === 'GET_VERSION') {
    if (event.ports && event.ports[0]) {
      event.ports[0].postMessage({
        type: 'VERSION_INFO',
        version: APP_VERSION,
        changelog: CHANGELOG[APP_VERSION] || null
      });
    }
  }
});

self.addEventListener('install', event => {
  // NON chiamare skipWaiting() qui — il nuovo SW deve aspettare in 'waiting'
  // così la pagina può rilevarlo, mostrare il popup e attivarlo solo dopo
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      cache.addAll(ASSETS_TO_CACHE).catch(() => {})
    )
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k.startsWith('operaio-') && k !== CACHE_NAME)
            .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

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
