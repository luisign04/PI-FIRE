const CACHE_NAME = 'registro-bombeiros-cache-v1';
const FILES_TO_CACHE = [
  '/',
  '/frontend/pages/login.html',
  '/frontend/global.css',
  '/frontend/pages/home/home.html',
  '/frontend/assets/icone2.png',
  '/frontend/assets/icone.png',
  '/manifest.json',
];

// Instalação do Service Worker e cache de arquivos essenciais
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
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
});

// Interceptação das requisições de rede para utilizar o cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Se encontrar a resposta em cache, retorna ela
      if (cachedResponse) {
        return cachedResponse;
      }

      // Caso não, faz a requisição de rede e retorna a resposta
      return fetch(event.request).then((response) => {
        // Verifica se a resposta é válida
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // Adiciona a resposta ao cache para futuras requisições
        const responseToCache = response.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    })
  );
});
