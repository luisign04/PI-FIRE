const CACHE_NAME = 'registro-bombeiros-cache-v1';
const FILES_TO_CACHE = [
  '/',
  // os arquivos abaixo usam o caminho relativo ao root do site
  '/pages/login/login.html',
  '/global.css',
  '/pages/home/home.html',
  '/assets/icone2.png',
  '/assets/icone.png',
  '/manifest.json',
];

// Instalação do Service Worker e cache de arquivos essenciais
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  // força o SW recém-instalado a assumir o controle imediatamente
  self.skipWaiting();
});

// Ativação do Service Worker
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // garante que o SW ativo controle as páginas abertas
  self.clients.claim();
});

// Interceptação das requisições de rede para utilizar o cache
self.addEventListener('fetch', (event) => {
  // Estratégia: cache first, fallback para rede; apenas para requisições GET
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then((response) => {
        // Se resposta inválida, apenas retorna
        if (!response || response.status !== 200) {
          return response;
        }

        // Clona e armazena no cache
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache).catch(() => {
            // ignore erros de cache (e.g., requisição cross-origin sem CORS)
          });
        });

        return response;
      }).catch(() => {
        // Em caso de falha de rede, se for navegação, retorna o cache da página inicial
        if (event.request.mode === 'navigate') {
          return caches.match('/');
        }
        return new Response('Offline', { status: 503, statusText: 'Offline' });
      });
    })
  );
});
