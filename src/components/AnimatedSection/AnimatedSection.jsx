import { cn } from "@/lib/utils";

// Reveal-on-scroll wrapper. Pure CSS — uses `animation-timeline: view()`
// (Chromium 115+; Firefox/Safari still working on it) gated by @supports
// in src/index.css. Browsers without scroll-driven animations skip the
// rule and render the children at full opacity. Reduced-motion users
// skip the animation via the `prefers-reduced-motion: no-preference`
// media query inside the same CSS block.
//
// `delay` is the animation-delay in ms. Pass it through a custom property
// so the cascaded rule can pick it up without inline `animation-delay`
// (which would otherwise clobber the `animation` shorthand on supporting
// browsers).
export default function AnimatedSection({ children, className = "", delay = 0 }) {
  return (
    <div
      className={cn("anim-fade-in-view", className)}
      style={delay ? { "--anim-delay": `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
