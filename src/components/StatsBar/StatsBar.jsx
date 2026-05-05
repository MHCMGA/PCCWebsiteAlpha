import { useEffect, useRef, useState } from "react";

const stats = [
  { value: 50, suffix: "+", label: "Years of Industry Experience" },
  { value: 3, suffix: "", label: "Expert Consultants" },
  { value: 20, suffix: "+", label: "Years in the Captive Market" },
];

function StatItem({ value, suffix, label }) {
  const ref = useRef(null);
  // Render the final value on first paint to match the prerendered HTML and
  // avoid a hydration mismatch. Once the section scrolls into view we replay
  // a quick count-up for visual flair (purely cosmetic, runs once).
  const [n, setN] = useState(value);

  useEffect(() => {
    const el = ref.current;
    const prefersReducedMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (
      !el ||
      prefersReducedMotion ||
      typeof IntersectionObserver === "undefined"
    )
      return;
    let raf;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        // Brief count-up: snap to 0 then ease to value over ~900ms.
        setN(0);
        const start = performance.now();
        const dur = 900;
        const tick = (t) => {
          const p = Math.min(1, (t - start) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          setN(Math.round(value * eased));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [value]);

  return (
    <div ref={ref} className="flex flex-col items-center text-center">
      <span
        className="text-5xl md:text-6xl font-extrabold tracking-tight text-[var(--color-cyan)] tabular-nums"
        aria-live="polite"
        suppressHydrationWarning
      >
        {`${n}${suffix}`}
      </span>
      <span className="mt-2 text-xs md:text-sm font-bold uppercase tracking-[0.14em] text-white/85">
        {label}
      </span>
    </div>
  );
}

export default function StatsBar() {
  return (
    <section
      aria-label="Key statistics"
      className="bg-[var(--color-navy)] py-14 text-white"
    >
      <div className="container-x grid gap-10 md:grid-cols-3 md:gap-6">
        {stats.map((s) => (
          <StatItem key={s.label} {...s} />
        ))}
      </div>
    </section>
  );
}
