/** Максимум шкалы ползунка, % */
export const MAX_KPD = 40;
/** Начальное положение ползунка, % (по умолчанию ограничения нет) */
export const DEFAULT_KPD = 40;

/** Фильтр по КПД для mock-данных (так же фильтрует бэкенд: kpd_below_than) */
export const filterByKpd = <T extends { kpd?: number | null }>(items: T[], kpdMax: number): T[] =>
  items.filter((s) => s.kpd !== null && s.kpd !== undefined && s.kpd <= kpdMax);
