import defaultImage from '../assets/default-panel.jpg';
import defaultVideo from '../assets/default-video.mp4';

export const DEFAULT_IMAGE: string = defaultImage;
export const DEFAULT_VIDEO: string = defaultVideo;

const isEmpty = (url: string | null | undefined): boolean => !url || url.trim() === '';

export const resolveImage = (url: string | null | undefined): string =>
  isEmpty(url) ? DEFAULT_IMAGE : (url as string);

export const resolveVideo = (url: string | null | undefined): string =>
  isEmpty(url) ? DEFAULT_VIDEO : (url as string);
