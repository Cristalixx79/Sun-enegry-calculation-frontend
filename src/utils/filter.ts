import type { Filters, Service } from '../types';

export const MAX_KPD = 40;

export const DEFAULT_FILTERS: Filters = {
  title: '',
  kpdMax: MAX_KPD,
  priceMax: '',
  dateFrom: '',
};

/** Количество заполненных (отличающихся от значений по умолчанию) полей фильтра */
export const countActiveFilters = (f: Filters): number =>
  (f.title.trim() !== '' ? 1 : 0) +
  (f.kpdMax < MAX_KPD ? 1 : 0) +
  (f.priceMax.trim() !== '' ? 1 : 0) +
  (f.dateFrom !== '' ? 1 : 0);

/** Фильтрация коллекции услуг по названию, КПД, цене и дате публикации */
export function filterServices(services: Service[], f: Filters): Service[] {
  const query = f.title.trim().toLowerCase();
  const priceLimit = f.priceMax.trim() === '' ? null : Number(f.priceMax);
  const dateFrom = f.dateFrom === '' ? null : new Date(f.dateFrom).getTime();

  return services.filter((s) => {
    if (query !== '' && !s.title.toLowerCase().includes(query)) return false;
    if (s.kpd !== null && s.kpd > f.kpdMax) return false;
    if (priceLimit !== null && !Number.isNaN(priceLimit) && s.price !== null && s.price > priceLimit) return false;
    if (dateFrom !== null && new Date(s.created_at).getTime() < dateFrom) return false;
    return true;
  });
}
