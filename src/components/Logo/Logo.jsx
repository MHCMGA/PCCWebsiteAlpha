import iconSrc from '@/assets/pcc-icon.png';

// Use round-pixel values; the `gap` shorthand is normalized by Chrome's
// CSSOM into `row-gap`/`column-gap` longhand when the prerender HTML is
// serialized, which trips React 19's hydration check. So we always emit
// rowGap + columnGap explicitly. Pre-computed for size=36 and size=44.
const SIZE_MAP = {
  36: { gap: 12, font: 12, max: 198 },
  44: { gap: 14, font: 15, max: 242 },
};

export default function Logo({ size = 48, variant = 'default' }) {
  const isLight = variant === 'light';
  const m = SIZE_MAP[size] || { gap: Math.round(size * 0.32), font: Math.round(size * 0.34), max: Math.round(size * 5.5) };
  return (
    <span
      className="inline-flex items-center"
      style={{ rowGap: `${m.gap}px`, columnGap: `${m.gap}px` }}
      aria-label="Palmetto Consulting of Columbia"
    >
      <img
        src={iconSrc}
        alt=""
        aria-hidden="true"
        width={size}
        height={size}
        style={{ height: `${size}px`, width: `${size}px` }}
      />
      <span
        className="font-extrabold leading-tight tracking-tight"
        style={{
          fontSize: `${m.font}px`,
          color: isLight ? '#ffffff' : 'var(--color-navy)',
          letterSpacing: '-0.01em',
          maxWidth: `${m.max}px`,
        }}
      >
        Palmetto Consulting of Columbia
      </span>
    </span>
  );
}
