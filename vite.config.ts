import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Адреса запущенных сервисов (по умолчанию как в docker-compose проекта)
const BACKEND = 'http://127.0.0.1:8000'; // FastAPI
const S3 = 'http://127.0.0.1:9000'; // MinIO

// Проксирование решает проблему CORS: браузер обращается только к адресу
// приложения, а Vite пересылает запросы дальше.
//   /api/...  -> FastAPI  (методы веб-сервиса)
//   /s3/...   -> MinIO    (изображения и видео услуг)
const proxy = {
  '/api': { target: BACKEND, changeOrigin: true },
  '/s3': { target: S3, changeOrigin: true, rewrite: (path: string) => path.replace(/^\/s3/, '') },
};

// base: './' — чтобы собранное приложение открывалось из любой папки
// (в том числе с GitHub Pages); маршрутизация сделана через HashRouter.
export default defineConfig({
  plugins: [react()],
  base: './',
  server: { proxy },
  preview: { proxy },
});
