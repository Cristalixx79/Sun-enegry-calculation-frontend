import { OpenAPI } from './api';

// Запросы идут на тот же адрес, что и приложение: /api и /s3 проксирует Vite
// (см. vite.config.ts), поэтому BASE пустой, а CORS не нужен.
OpenAPI.BASE = '';
OpenAPI.WITH_CREDENTIALS = true;
