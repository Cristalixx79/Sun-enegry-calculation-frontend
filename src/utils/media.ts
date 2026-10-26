import defaultImage from '../assets/default-panel.jpg';
import defaultVideo from '../assets/default-video.mp4';

const isEmpty = (url: string | null | undefined): boolean => !url || url.trim() === '';

/** Изображение услуги или изображение по умолчанию, если поле пустое */
export const resolveImage = (url: string | null | undefined): string =>
  isEmpty(url) ? defaultImage : (url as string);

/** Видео услуги или видео по умолчанию, если поле пустое */
export const resolveVideo = (url: string | null | undefined): string =>
  isEmpty(url) ? defaultVideo : (url as string);
