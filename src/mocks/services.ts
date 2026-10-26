import type { Service } from '../types';

import panelMono from '../assets/mock/panel-mono.jpg';
import panelPoly from '../assets/mock/panel-poly.jpg';
import panelHjt from '../assets/mock/panel-hjt.jpg';
import panelBifacial from '../assets/mock/panel-bifacial.jpg';
import videoSunrise from '../assets/mock/video-sunrise.mp4';
import videoGreen from '../assets/mock/video-green.mp4';

/**
 * Mock-коллекция услуг: в этой лабораторной данные берутся только отсюда,
 * без обращения к бэкенду. У части услуг image_url / video_url пустые —
 * для них показываются изображение и видео по умолчанию (см. utils/media.ts).
 */
export const MOCK_SERVICES: Service[] = [
  {
    id: 1,
    title: 'Монокристаллическая панель X1',
    description:
      'Монокристаллические элементы с высоким КПД для частного дома. Хорошо работают при слабом освещении, рассчитаны на 25 лет эксплуатации и подходят для установки на скатную крышу.',
    status: 'published',
    kpd: 21,
    price: 5400,
    image_url: panelMono,
    video_url: videoSunrise,
    creator_id: 1,
    is_own: 0,
    likes_count: 128,
    created_at: '2026-03-12T10:00:00Z',
    updated_at: '2026-03-12T10:00:00Z',
  },
  {
    id: 2,
    title: 'Поликристаллическая панель P250',
    description:
      'Доступное решение для больших площадей: умеренный КПД и низкая цена за квадратный метр. Подходит для наземных станций и хозяйственных построек.',
    status: 'published',
    kpd: 16,
    price: 3200,
    image_url: panelPoly,
    video_url: null,
    creator_id: 2,
    is_own: 0,
    likes_count: 54,
    created_at: '2026-02-03T09:30:00Z',
    updated_at: '2026-02-03T09:30:00Z',
  },
  {
    id: 3,
    title: 'Тонкоплёночная панель CIGS',
    description:
      'Лёгкая тонкоплёночная панель на основе CIGS. Меньше теряет в жару и при рассеянном свете, поэтому хорошо подходит для лёгких кровель, где важен вес конструкции.',
    status: 'published',
    kpd: 14,
    price: 2700,
    image_url: null,
    video_url: null,
    creator_id: 2,
    is_own: 0,
    likes_count: 21,
    created_at: '2026-04-18T14:15:00Z',
    updated_at: '2026-04-18T14:15:00Z',
  },
  {
    id: 4,
    title: 'Гетероструктурная панель HJT',
    description:
      'Гетероструктурные элементы с низкой деградацией и высоким КПД. Сохраняют хорошую выработку при нагреве, подойдут для проектов, где важна отдача с ограниченной площади.',
    status: 'published',
    kpd: 23,
    price: 6900,
    image_url: panelHjt,
    video_url: videoGreen,
    creator_id: 3,
    is_own: 0,
    likes_count: 96,
    created_at: '2026-05-27T11:45:00Z',
    updated_at: '2026-05-27T11:45:00Z',
  },
  {
    id: 5,
    title: 'Панель PERC Pro',
    description:
      'Панель с пассивированным тыльным слоем (PERC): хороший баланс цены и эффективности для коммерческих крыш и небольших солнечных электростанций.',
    status: 'published',
    kpd: 20,
    price: 4800,
    image_url: null,
    video_url: null,
    creator_id: 3,
    is_own: 0,
    likes_count: 67,
    created_at: '2026-01-15T08:00:00Z',
    updated_at: '2026-01-15T08:00:00Z',
  },
  {
    id: 6,
    title: 'Двусторонняя панель Bifacial',
    description:
      'Двусторонняя панель вырабатывает энергию обеими сторонами и использует свет, отражённый от поверхности. Лучше всего раскрывается на светлом основании или снегу.',
    status: 'published',
    kpd: 22,
    price: 6100,
    image_url: panelBifacial,
    video_url: null,
    creator_id: 1,
    is_own: 0,
    likes_count: 83,
    created_at: '2026-06-09T16:20:00Z',
    updated_at: '2026-06-09T16:20:00Z',
  },
  {
    id: 7,
    title: 'Гибкая панель Flex',
    description:
      'Гибкая панель, которую можно закрепить на изогнутой поверхности: крыше дома на колёсах, лодки или беседки. Лёгкая и тонкая, но с меньшим сроком службы.',
    status: 'published',
    kpd: 17,
    price: 4100,
    image_url: null,
    video_url: null,
    creator_id: 4,
    is_own: 0,
    likes_count: 39,
    created_at: '2026-07-21T12:10:00Z',
    updated_at: '2026-07-21T12:10:00Z',
  },
  {
    id: 8,
    title: 'Тандемная перовскитная панель (опытный образец)',
    description:
      'Опытный образец тандемной панели с перовскитным слоем. Самый высокий КПД в каталоге, но срок службы и стабильность ещё проверяются — предложение для тех, кто готов к экспериментам.',
    status: 'published',
    kpd: 25,
    price: 9800,
    image_url: null,
    video_url: null,
    creator_id: 4,
    is_own: 0,
    likes_count: 112,
    created_at: '2026-08-30T13:05:00Z',
    updated_at: '2026-08-30T13:05:00Z',
  },
];

/** Гость видит только опубликованные услуги */
export const PUBLISHED_SERVICES: Service[] = MOCK_SERVICES.filter((s) => s.status === 'published');
