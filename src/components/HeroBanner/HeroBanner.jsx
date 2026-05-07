// HeroBanner: full-bleed image hero with navy overlay, eyebrow and heading.
// Inline `style` uses `backgroundImage` longhand and rgba whitespace matched
// to Chrome CSSOM normalized form to avoid React #418 hydration mismatches
// on the prerendered route. See checkpoint 017.
export default function HeroBanner({
  image,
  eyebrow,
  heading,
  minHeight = "42vh",
}) {
  const overlay =
    "linear-gradient(rgba(0, 48, 87, 0.55), rgba(0, 48, 87, 0.78))";
  return (
    <section
      className="relative isolate flex items-center text-white"
      style={{
        minHeight,
        backgroundImage: `${overlay}, url('${image}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="container-x relative z-10 text-center">
        {eyebrow ? (
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-cyan)]">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          {heading}
        </h1>
      </div>
    </section>
  );
}
