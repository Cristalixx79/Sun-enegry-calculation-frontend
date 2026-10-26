import type { Service } from '../types';

export const MAX_KPD = 40;
export const DEFAULT_KPD = 25;

export const filterByKpd = (services: Service[], kpdMax: number): Service[] =>
  services.filter((s) => s.kpd !== null && s.kpd <= kpdMax);
