export default function Logo({ size = 48 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      aria-label="Palmetto Consulting of Columbia logo"
      role="img"
    >
      {/* Teal outer circle */}
      <circle cx="50" cy="50" r="50" fill="#008ed4" />
      {/* White inner circle offset to create crescent */}
      <circle cx="62" cy="44" r="36" fill="#ffffff" />
      {/* Small inner teal circle to restore depth */}
      <circle cx="38" cy="55" r="14" fill="#008ed4" />
    </svg>
  );
}
