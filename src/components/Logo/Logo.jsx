import iconSrc from '../../assets/pcc-icon.png';
import textSrc from '../../assets/pcc-text.png';

export default function Logo({ size = 48, variant = 'default' }) {
  const textFilter = variant === 'light' ? 'brightness(0) invert(1)' : 'none';
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: size * 0.08 }}>
      <img
        src={iconSrc}
        alt=""
        aria-hidden="true"
        style={{ display: 'block', height: size * 0.9, width: 'auto' }}
      />
      <img
        src={textSrc}
        alt="PCC — Palmetto Consulting of Columbia"
        style={{ display: 'block', height: size, width: 'auto', filter: textFilter }}
      />
    </span>
  );
}
