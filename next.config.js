// next.config.js

const withPWA = require('next-pwa')({
  dest: 'public',                          // Output location for service worker
  register: true,                          // Auto register SW
  skipWaiting: true,                       // Activate new SW immediately
  disable: process.env.NODE_ENV === 'development', // Disable PWA in dev mode
  runtimeCaching: [
    {
      urlPattern: /^\/(whisper|tts)\/.*$/, // Cache whisper/ and tts/ folder files
      handler: 'CacheFirst',
      options: {
        cacheName: 'model-cache',
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 1 week
        },
        cacheableResponse: {
          statuses: [0, 200],              // Cache opaque and OK responses
        },
      },
    },
  ],
});

module.exports = withPWA({
  reactStrictMode: true,
});
