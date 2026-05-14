const stats = [
  { value: 50, suffix: "+", label: "Years of Industry Experience" },
  { value: 3, suffix: "", label: "Expert Consultants" },
  { value: 20, suffix: "+", label: "Years in the Captive Market" },
];

function StatItem({ value, suffix, label }) {
  return (
    <div className="flex flex-col items-center text-center">
      <span className="text-5xl md:text-6xl font-extrabold tracking-tight text-[var(--color-cyan)] tabular-nums">
        {`${value}${suffix}`}
      </span>
      <span className="mt-2 text-xs md:text-sm font-bold uppercase tracking-[0.14em] text-white/85">
        {label}
      </span>
    </div>
  );
}

export default function StatsBar() {
  return (
    <section aria-label="Key statistics" className="bg-[var(--color-navy)] py-14 text-white">
      <div className="container-x grid gap-10 md:grid-cols-3 md:gap-6">
        {stats.map((s) => (
          <StatItem key={s.label} {...s} />
        ))}
      </div>
    </section>
  );
}
