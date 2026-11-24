import fs from 'node:fs';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// Адреса запущенных сервисов (по умолчанию как в docker-compose проекта).
// Прокси работает на ноутбуке, поэтому и при заходе с телефона по IP ноутбука
// запросы уходят на бэкенд и MinIO ноутбука.
const BACKEND = 'http://127.0.0.1:8000'; // FastAPI
const S3 = 'http://127.0.0.1:9000'; // MinIO

// Реверс-прокси (сервер Node.js, который встроен в Vite):
//   /api/...  -> FastAPI  (методы веб-сервиса)
//   /s3/...   -> MinIO    (изображения и видео услуг)
const proxy = {
  '/api': { target: BACKEND, changeOrigin: true },
  '/s3': { target: S3, changeOrigin: true, rewrite: (path: string) => path.replace(/^\/s3/, '') },
};

// HTTPS: сертификат создаётся утилитой mkcert (см. README) и кладётся в папку cert/.
// Если файлов нет, сервер запускается по HTTP — для разработки на ноутбуке этого достаточно,
// но телефон и режим PWA требуют HTTPS.
const KEY_FILE = 'cert/key.pem';
const CERT_FILE = 'cert/cert.pem';
const https =
  fs.existsSync(KEY_FILE) && fs.existsSync(CERT_FILE)
    ? { key: fs.readFileSync(KEY_FILE), cert: fs.readFileSync(CERT_FILE) }
    : undefined;
if (!https) {
  console.warn(`[vite] ${KEY_FILE} / ${CERT_FILE} не найдены: сервер запущен по HTTP (без HTTPS).`);
}

// host: true — слушать все сетевые интерфейсы, чтобы приложение открывалось
// с телефона по IP-адресу ноутбука в локальной сети.
const serverOptions = { host: true, https, proxy };

// base: './' — чтобы собранное приложение открывалось из любой папки
// (в том числе с GitHub Pages: https://<user>.github.io/<repo>/);
// маршрутизация сделана через HashRouter.
export default defineConfig({
  base: './',
  plugins: [
    react(),
    // PWA: манифест и service worker (кэширует оболочку приложения и ресурсы,
    // поэтому после первого открытия оно запускается и без сети)
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/*.png'],
      manifest: {
        name: 'Солнечные панели',
        short_name: 'Панели',
        description: 'Каталог солнечных панелей: лента и плитка услуг',
        lang: 'ru',
        start_url: './',
        scope: './',
        display: 'standalone',
        orientation: 'any',
        background_color: '#ffffff',
        theme_color: '#127627',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,jpg,svg,mp4}'],
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
        navigateFallback: 'index.html',
        // запросы к бэкенду и MinIO service worker не перехватывает
        navigateFallbackDenylist: [/^\/api/, /^\/s3/],
      },
    }),
  ],
  server: serverOptions,
  preview: serverOptions,
});
