// ═══════════════════════════════════════════════════════════
//  GIORNALE DI CANTIERE — Service Worker
//  Aggiorna APP_VERSION ad ogni rilascio su GitHub
// ═══════════════════════════════════════════════════════════

const APP_VERSION = '1.5.5';
const CACHE_NAME  = 'cantiere-v' + APP_VERSION;

// ── Changelog ──
const CHANGELOG = {
  '1.5.5': {
    title: '📄 PDF nativo A4',
    items: [
      'Export PDF vero A4 — generato direttamente sul dispositivo',
      'Supporto multi-pagina automatico per report lunghi',
      'Funziona su Android e iOS senza aprire il browser'
    ]
  },
  '1.5.4': {
    title: '📄 Fix stampa PDF',
    items: [
      'PDF: usa Web Share API nativa Android — apre menu condivisione/stampa come le foto',
      'Fallback automatico: scarica il file HTML apribile con stampante nativa'
    ]
  },
  '1.5.3': {
    title: '🔧 Fix 1.5.3',
    items: [
      'Fix PDF: la stampa apre ora la stampante nativa Android/iOS senza aprire il browser',
      'Fix app operaio: il SW dell\'app madre non intercetta più operaio.html',
      'Messaggio WhatsApp con istruzioni passo-passo per installare l\'app operaio'
    ]
  },
  '1.5.2': {
    title: '👷 Novità 1.5.2',
    items: [
      'App operaio: nuova PWA separata per muratori, elettricisti e altri — report semplificato con ore, lavori, note, materiali e foto',
      'Invita operaio: genera link dal cantiere da inviare via WhatsApp — il cantiere si aggiunge automaticamente sull\'app dell\'operaio',
      'Importa report: ricevi il JSON dall\'operaio e importalo direttamente nel cantiere',
      'Riepilogo giornaliero: vedi i report di ogni operaio separati per ruolo con totale ore',
      'Fondi report: unisci i dati degli operai al tuo report giornaliero con un tap'
    ]
  },
  '1.5.1': {
    title: '🔧 Fix 1.5.1',
    items: [
      'Aggiornamento automatico migliorato: il browser verifica nuove versioni ogni 60 secondi',
      'Fix aggiornamento PWA: la nuova versione viene rilevata in modo affidabile anche da cache'
    ]
  },
  '1.4.1': {
    title: '🔧 Fix 1.4.1',
    items: [
      'Fix verifica orologio: tolleranza portata a 15 minuti — niente più falsi blocchi con deriva normale del telefono',
      'Fix latenza di rete: il confronto con il server ora compensa il tempo di risposta dell'API'
    ]
  },
  '1.4.0': {
    title: '🛠️ Novità 1.4.0',
    items: [
      'Fix personale: tastiera attiva sui campi operai — si chiude solo con lo swipe o toccando fuori',
      'Fix PDF: ora apre direttamente la stampante del telefono (senza aprire il browser)',
      'Fix condivisione: condivide il report come file HTML apribile e stampabile',
      'Archivio spostato nella schermata cantiere — con grafico, stats, ricerca e ordinamento',
      'Rimosse tab ridondanti nel form report: ora solo Report, Vocali, Foto'
    ]
  },
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
  '1.3.7': {
    title: '🔧 Novità 1.3.7',
    items: [
      'Fix PDF: risolto il problema della pagina bianca — ora si apre correttamente la stampante del telefono',
      'Fix personale: cifre grigie come placeholder, campo vuoto quando selezionato (fix definitivo su iOS/Android)',
      'Fix swipe: tutti gli input vengono bloccati durante il trascinamento — zero sfasamento garantito',
      'Rimosso secondo bottone Salva nell\'ultima pagina — rimane solo quello fisso in basso',
      'Bottone report cantiere: "Modifica report di oggi" se aperto, grigio "firmato" se firmato'
    ]
  },
  '1.3.6': {
    title: '🔧 Novità 1.3.6',
    items: [
      'Fix: report di oggi non firmato ora si riapre correttamente in modifica anche dopo essere usciti dall\'app o tornati alla home',
      'Fix: campi personale (muratori, ecc.) ora mostrano 0 grigio come placeholder — la casella è vuota quando selezionata',
      'Fix: swipe tra le sezioni del report deseleziona automaticamente la casella attiva, eliminando lo sfasamento delle pagine'
    ]
  },
  '1.3.5': {
    title: '✏️ Novità 1.3.5',
    items: [
      'Report non firmati sempre modificabili: bottone "Modifica" nel modale di ogni report aperto',
      'Icona matita ✏️ nella lista cantieri per modificare i dati del cantiere direttamente dalla home',
      'Rimosso bottone "Modifica" dalla schermata dettaglio cantiere (ridondante)',
      'Scroll foto risolto: con più foto la lista scorre correttamente senza nascondere i campi'
    ]
  },
  '1.3.4': {
    title: '📷 Novità 1.3.4',
    items: [
      'Documentazione fotografica completamente facoltativa',
      'Titolo sezione fotografica personalizzabile (appare nel PDF come intestazione)',
      'Ogni foto ha titolo (sopra) e nota descrittiva (sotto), entrambi visibili nel PDF',
      'Layout foto rinnovato: schede verticali con immagine grande e campi chiari',
      'PDF: 2 foto per pagina con titolo in grassetto e nota a tutta larghezza',
      'Limite foto/audio: solo lo spazio del dispositivo (nessun limite artificiale)'
    ]
  },
  '1.3.3': {
    title: '🔒 Novità 1.3.3',
    items: [
      'Ancoraggio orologio automatico: al primo avvio o alla prima connessione disponibile, l\'ora reale viene salvata in background',
      'L\'ancoraggio si aggiorna silenziosamente ogni ora quando c\'è connessione',
      'Offline con ancoraggio presente: funziona normalmente con stima dell\'ora',
      'Offline senza ancoraggio (primo avvio mai connesso): avviso toast, non bloccante'
    ]
  },
  '1.3.2': {
    title: '✨ Novità 1.3.2',
    items: [
      'Foto salvate su IndexedDB: niente più limite 5MB di localStorage',
      'Bottone "Salva Report" fisso e visibile da qualsiasi step del form',
      'Verifica orologio: spiegazione chiara del perché si attende prima di creare un report',
      'Ricerca globale: cerca tra tutti i cantieri e tutti i report dalla home',
      'Ordinamento cantieri: per data creazione, nome A-Z, o ultimo report',
      'Ordinamento report in archivio: più recente, più vecchio, o % avanzamento'
    ]
  },
  '1.3.1': {
    title: '🐛 Fix 1.3.1',
    items: [
      'Tasto Back e swipe-back del telefono ora navigano tra le schermate (non chiudono l\'app)',
      'Report del giorno corrente non firmato: si apre direttamente in modifica senza popup intermedio',
    ]
  },
  '1.3.0': {
    title: '✨ Novità 1.3.0',
    items: [
      'Firma report con nome: blocca il report e registra il firmatario',
      'Chiusura automatica al giorno successivo con notifica push',
      'Report firmati in sola lettura: nessuna modifica accidentale',
      'Colori PDF personalizzabili: header, fascia cantiere e accento',
      'Ricerca/filtro live nell\'archivio report',
      'Grafico avanzamento lavori nel tempo',
      'Duplica ultimo report: copia operai, meteo e DL nel nuovo report',
      'Condivisione report via Web Share API (mobile)',
      'Backup e ripristino dati completo in JSON',
      'Note vocali persistenti tra sessioni (IndexedDB)',
      'Protezione storage: foto compresse automaticamente se spazio scarso',
      'Conteggio foto e audio sempre aggiornato in tempo reale',
      'Conferma prima dell\'eliminazione di un report'
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

// ── MESSAGE (SKIP_WAITING) ──
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// ── INSTALL ──
self.addEventListener('install', event => {
  // Non fare skipWaiting automatico: aspetta il messaggio dalla pagina
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

  // Non intercettare mai i file dell'app operaio
  if (url.pathname.includes('operaio') || url.pathname.includes('sw-operaio') || url.pathname.includes('manifest-operaio')) {
    return; // lascia passare al network direttamente
  }

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
