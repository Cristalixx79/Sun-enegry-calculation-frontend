/**
 * Режим «только mock»: приложение вообще не обращается к бэкенду и работает
 * на данных из mock-коллекции. Включается при сборке для GitHub Pages
 * (`npm run build:pages`, файл .env.pages: VITE_MOCK_ONLY=true), потому что
 * на статическом хостинге нет ни веб-сервиса, ни MinIO.
 */
export const MOCK_ONLY: boolean = import.meta.env.VITE_MOCK_ONLY === 'true';
