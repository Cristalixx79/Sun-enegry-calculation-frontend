interface IconProps {
  path: string;
  className?: string;
}

export default function Icon({ path, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      <path d={path} />
    </svg>
  );
}
