const CACHE_ESTATICO = 'aurix-estatico-v1';
const CACHE_API = 'aurix-api-v1';
const CACHE_OFFLINE = 'aurix-offline-v1';

const URLS_ESTATICOS = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/static/js/bundle.js',
  '/static/css/main.css',
];

const API_PATTERN = /^https?:\/\/localhost:8080\/api\//;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_ESTATICO).then((cache) => {
      return cache.addAll(URLS_ESTATICOS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((nomesCache) => {
      return Promise.all(
        nomesCache
          .filter((nome) => nome !== CACHE_ESTATICO && nome !== CACHE_API && nome !== CACHE_OFFLINE)
          .map((nome) => caches.delete(nome))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET') {
    event.respondWith(
      fetch(request).catch(() => {
        return new Response(JSON.stringify({ erro: 'Sem conexão com a rede' }), {
          status: 503,
          headers: { 'Content-Type': 'application/json' },
        });
      })
    );
    return;
  }

  if (API_PATTERN.test(request.url)) {
    event.respondWith(redeComCache(request));
    return;
  }

  event.respondUntil(cacheFirst(request));
});

async function cacheFirst(request) {
  const cache = await caches.open(CACHE_ESTATICO);
  const respostaCache = await cache.match(request);

  if (respostaCache) {
    return respostaCache;
  }

  try {
    const respostaRede = await fetch(request);
    if (respostaRede.ok) {
      cache.put(request, respostaRede.clone());
    }
    return respostaRede;
  } catch (erro) {
    return caches.match('/offline.html');
  }
}

async function redeComCache(request) {
  const cache = await caches.open(CACHE_API);

  try {
    const respostaRede = await fetch(request);
    if (respostaRede.ok) {
      cache.put(request, respostaRede.clone());
    }
    return respostaRede;
  } catch (erro) {
    const respostaCache = await cache.match(request);
    if (respostaCache) {
      return respostaCache;
    }

    return new Response(JSON.stringify({ erro: 'Sem conexão com a rede', offline: true }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'abrir') {
    event.waitUntil(
      self.clients.matchAll({ type: 'window' }).then((clientes) => {
        const cliente = clientes.find((c) => c.visibilityState === 'visible');
        if (cliente) {
          return cliente.focus();
        }
        return self.clients.openWindow('/');
      })
    );
  }
});

self.addEventListener('push', (event) => {
  const dados = event.data ? event.data.json() : {};

  const opcoes = {
    body: dados.mensagem || 'Nova notificação do Aurix',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-192x192.png',
    vibrate: [200, 100, 200],
    tag: dados.tag || 'aurix-notificacao',
    renotify: true,
    data: {
      url: dados.url || '/',
    },
    actions: [
      { action: 'abrir', title: 'Abrir' },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(dados.titulo || 'Aurix Banking', opcoes)
  );
});
