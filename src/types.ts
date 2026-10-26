/**
 * Услуга (солнечная панель). Поля повторяют ответ бэкенда (схема ServiceOut),
 * чтобы в следующих лабораторных mock-коллекцию можно было заменить
 * на данные из API без переделки компонентов.
 */
export type ServiceStatus = 'draft' | 'published' | 'deleted';

export interface Service {
  id: number;
  title: string;
  description: string;
  status: ServiceStatus;
  kpd: number | null;
  price: number | null;
  /** Пустое значение (null или '') — подставляется изображение по умолчанию */
  image_url: string | null;
  /** Пустое значение (null или '') — подставляется видео по умолчанию */
  video_url: string | null;
  creator_id: number;
  is_own: 0 | 1;
  likes_count: number;
  created_at: string;
  updated_at: string;
}

/** Значения полей фильтра на странице «Плитка» */
export interface Filters {
  title: string;
  kpdMax: number;
  priceMax: string;
  dateFrom: string;
}
