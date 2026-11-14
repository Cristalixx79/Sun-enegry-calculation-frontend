import defaultImage from '../assets/default-panel.jpg';
import defaultVideo from '../assets/default-video.mp4';

/** Изображение по умолчанию: src/assets/default-panel.jpg */
export const DEFAULT_IMAGE: string = defaultImage;
/** Видео по умолчанию: src/assets/default-video.mp4 */
export const DEFAULT_VIDEO: string = defaultVideo;

// Бэкенд отдаёт в image_url / video_url прямой адрес MinIO (MINIO_ENDPOINT).
// Из браузера он блокируется политикой CORS, поэтому такие адреса переписываются
// на маршрут /s3, который Vite проксирует на MinIO (см. vite.config.ts).
const S3_ORIGIN: string = (import.meta.env.VITE_S3_ORIGIN as string | undefined) ?? 'http://localhost:9000';
const S3_PREFIX = '/s3';
const LOOPBACK = ['localhost', '127.0.0.1', '[::1]'];

/** Адрес MinIO -> адрес через прокси. Остальные адреса не меняются. */
export function toS3Proxy(url: string): string {
  try {
    const target = new URL(url, window.location.href);
    const s3 = new URL(S3_ORIGIN);
    const sameHost =
      target.hostname === s3.hostname || (LOOPBACK.includes(target.hostname) && LOOPBACK.includes(s3.hostname));
    if (sameHost && target.port === s3.port) {
      return `${S3_PREFIX}${target.pathname}${target.search}`;
    }
  } catch {
    // не адрес — возвращаем как есть
  }
  return url;
}

const isEmpty = (url: string | null | undefined): boolean => !url || url.trim() === '';

/** Изображение услуги или изображение по умолчанию, если поле пустое */
export const resolveImage = (url: string | null | undefined): string =>
  isEmpty(url) ? DEFAULT_IMAGE : toS3Proxy(url as string);

/** Видео услуги или видео по умолчанию, если поле пустое */
export const resolveVideo = (url: string | null | undefined): string =>
  isEmpty(url) ? DEFAULT_VIDEO : toS3Proxy(url as string);
