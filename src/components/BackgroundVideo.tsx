import { useEffect, useRef } from 'react';

interface BackgroundVideoProps {
  /** Адрес видеофайла (из услуги или видео по умолчанию) */
  src: string;
  /** Картинка, пока видео загружается */
  poster?: string;
}

/**
 * Зацикленное видео на заднем фоне ленты: запускается само, без звука,
 * повторяется по кругу (атрибуты autoPlay, loop, muted, playsInline).
 */
export default function BackgroundVideo({ src, poster }: BackgroundVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Браузеры разрешают автовоспроизведение только без звука — включаем muted
  // и запускаем воспроизведение вручную при каждой смене видео.
  useEffect(() => {
    const el = videoRef.current;
    if (el) {
      el.muted = true;
      el.play().catch(() => undefined);
    }
  }, [src]);

  return (
    <div className="video-container">
      <video
        ref={videoRef}
        key={src}
        src={src}
        poster={poster}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      />
    </div>
  );
}
