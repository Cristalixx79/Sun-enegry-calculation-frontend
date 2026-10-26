export const formatPrice = (price: number | null): string =>
  price === null ? '—' : `${price.toLocaleString('ru-RU')} ₽/м²`;

export const formatKpd = (kpd: number | null): string => (kpd === null ? '—' : `${kpd}%`);

export const formatDate = (iso: string): string => new Date(iso).toLocaleDateString('ru-RU');
