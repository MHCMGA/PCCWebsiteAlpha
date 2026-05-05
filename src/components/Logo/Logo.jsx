import iconSrc from '@/assets/pcc-icon.png';

export default function Logo({ size = 48, variant = 'default' }) {
  const isLight = variant === 'light';
  return (
    <span
      className="inline-flex items-center"
      style={{ gap: size * 0.32 }}
      aria-label="Palmetto Consulting of Columbia"
    >
      <img
        src={iconSrc}
        alt=""
        aria-hidden="true"
        width={size}
        height={size}
        style={{ height: size, width: size }}
      />
      <span
        className="font-extrabold leading-tight tracking-tight"
        style={{
          fontSize: size * 0.34,
          color: isLight ? '#ffffff' : 'var(--color-navy)',
          letterSpacing: '-0.01em',
          maxWidth: size * 5.5,
        }}
      >
        Palmetto Consulting of Columbia
      </span>
    </span>
  );
}
