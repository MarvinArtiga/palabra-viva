import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/icon-192.svg', 'icons/icon-512.svg'],
      manifest: {
        name: 'Palabra Viva - Lecturas Catolicas',
        short_name: 'Palabra Viva',
        description: 'Lecturas catolicas diarias y mensuales en espanol.',
        theme_color: '#f5f1e8',
        background_color: '#f5f1e8',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/icons/icon-192.svg',
            sizes: '192x192',
            type: 'image/svg+xml'
          },
          {
            src: '/icons/icon-512.svg',
            sizes: '512x512',
            type: 'image/svg+xml'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,json}'],
        runtimeCaching: [
          {
            urlPattern: /\/data\/month-\d{4}-\d{2}\.json$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'month-readings-cache',
              expiration: {
                maxEntries: 12,
                maxAgeSeconds: 60 * 60 * 24 * 90
              }
            }
          },
          {
            urlPattern: /\/data\/latest\.json$/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'latest-reading-cache',
              networkTimeoutSeconds: 3,
              expiration: {
                maxEntries: 1,
                maxAgeSeconds: 60 * 60 * 24 * 7
              }
            }
          },
          {
            urlPattern: /\/api\/v1\/tts\//,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'tts-audio-cache',
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 7
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ]
});
