export const formatPrice = (price: number | null | undefined): string =>
  price === null || price === undefined ? '—' : `${price.toLocaleString('ru-RU')} ₽/м²`;

export const formatKpd = (kpd: number | null | undefined): string =>
  kpd === null || kpd === undefined ? '—' : `${kpd}%`;
