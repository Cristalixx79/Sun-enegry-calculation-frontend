import type { ServiceListItem, ServiceOut } from '../api';
import { filterByKpd } from '../utils/filter';
import { PUBLISHED_SERVICES } from './services';

/**
 * Данные из mock-коллекции — запасной вариант для гостя, когда бэкенд недоступен.
 * Функции повторяют поведение методов веб-сервиса (фильтр по КПД, лента, «следующая»).
 */

export const toListItem = (s: ServiceOut): ServiceListItem => ({
  id: s.id,
  title: s.title,
  price: s.price,
  kpd: s.kpd,
  image_url: s.image_url,
  video_url: s.video_url,
  likes_count: s.likes_count,
  is_own: s.is_own,
});

export const mockListItems = (kpdMax: number): ServiceListItem[] =>
  filterByKpd(PUBLISHED_SERVICES, kpdMax).map(toListItem);

export function mockFeed(id?: number, next = false): ServiceOut {
  const list = PUBLISHED_SERVICES;
  const found = id === undefined ? -1 : list.findIndex((s) => s.id === id);
  const index = found === -1 ? 0 : found;
  return list[next ? (index + 1) % list.length : index];
}
