import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

const icon = (src, sizes, purpose = 'any') => ({ src, sizes, type: 'image/png', purpose });

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // নতুন ডেপ্লয় হলে অটো আপডেট
      includeAssets: ['favicon.ico', 'favicon-16.png', 'favicon-32.png', 'icons/apple-touch-icon.png'],
      manifest: {
        id: '/',
        name: 'BRSP Batch 2 (Public)',
        short_name: 'BRSP Batch 2',
        description: 'BRSP Batch 2 (Morning) – কোর্স তথ্য, ভর্তি ও মেডিকেল ফরম, শিক্ষার্থী তালিকা',
        lang: 'bn',
        dir: 'ltr',
        start_url: '/?source=pwa',
        scope: '/',
        display: 'standalone',
        display_override: ['standalone', 'minimal-ui', 'browser'],
        orientation: 'any',
        background_color: '#ffffff',
        theme_color: '#0a3631',
        categories: ['education'],
        prefer_related_applications: false,
        icons: [
          icon('/icons/icon-192.png', '192x192'),
          icon('/icons/icon-512.png', '512x512'),
          icon('/icons/maskable-512.png', '512x512', 'maskable'),
        ],
        // ইনস্টল ডায়ালগে প্রিভিউ (Android/Chrome/Edge)
        screenshots: [
          { src: '/screenshots/wide.png', sizes: '1280x720', type: 'image/png', form_factor: 'wide', label: 'হোম পেজ' },
          { src: '/screenshots/narrow.png', sizes: '540x960', type: 'image/png', form_factor: 'narrow', label: 'শিক্ষার্থী তালিকা' },
        ],
        shortcuts: [
          { name: 'শিক্ষার্থী তালিকা', short_name: 'তালিকা', url: '/?tab=students', icons: [icon('/icons/icon-192.png', '192x192')] },
          { name: 'শাটল ট্রেন', short_name: 'ট্রেন', url: '/?tab=train', icons: [icon('/icons/icon-192.png', '192x192')] },
          { name: 'ট্রাফিক ও স্টাডি', short_name: 'শিখুন', url: '/?tab=learn', icons: [icon('/icons/icon-192.png', '192x192')] },
          { name: 'কুইজ', short_name: 'কুইজ', url: '/?tab=quiz', icons: [icon('/icons/icon-192.png', '192x192')] },
        ],
      },
      workbox: {
        // অ্যাপ শেল, ফন্ট, আইকন, ছোট ছবি, ফরম PDF — সব প্রি-ক্যাশে (অফলাইনে কাজ করবে)
        globPatterns: ['**/*.{js,css,html,ico,png,jpg,svg,woff2,gif,webmanifest,pdf}'],
        globIgnores: ['**/*.woff', '**/train-schedule.png', '**/BRTA_Traffic_Signs.pdf', 'study/**', '**/assets/g[0-9][0-9]-*.jpg', 'screenshots/**'],
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/\.pdf$/],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        // বড় ছবি: প্রথমবার দেখলে ক্যাশে জমে, পরে অফলাইনেও দেখা যায়
        runtimeCaching: [
          {
            urlPattern: ({ url }) => /\/assets\/g\d\d-.*\.jpg$/.test(url.pathname) || url.pathname === '/train-schedule.png' || url.pathname === '/BRTA_Traffic_Signs.pdf' || url.pathname.startsWith('/study/'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'big-images',
              expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 90 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
});
