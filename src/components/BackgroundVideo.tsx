import { useEffect, useRef } from 'react';

interface BackgroundVideoProps {
  src: string;
  poster?: string;
}


export default function BackgroundVideo({ src, poster }: BackgroundVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

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
