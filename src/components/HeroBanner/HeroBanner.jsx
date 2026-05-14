// HeroBanner: full-bleed image hero with navy overlay, eyebrow and heading.
//
// `image` is the WebP path (e.g. `/hero-about.webp`). The component derives
// the matching AVIF path and emits a <picture> so AVIF-capable browsers
// pull the smaller file; older browsers fall back to the WebP.
//
// Overlay is a sibling div with `backgroundImage` longhand whose rgba
// whitespace matches Chrome's CSSOM normalized form, avoiding React #418
// hydration mismatches on prerendered routes. See checkpoint 017.
export default function HeroBanner({ image, eyebrow, heading, minHeight = "42vh" }) {
  const avif = image.replace(/\.webp$/, ".avif");
  return (
    <section
      className="relative isolate flex items-center overflow-hidden text-white"
      style={{ minHeight }}
    >
      <picture>
        <source type="image/avif" srcSet={avif} />
        <img
          src={image}
          alt=""
          aria-hidden="true"
          decoding="async"
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
      </picture>
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: "linear-gradient(rgba(0, 48, 87, 0.55), rgba(0, 48, 87, 0.78))",
        }}
      />
      <div className="container-x relative z-10 text-center">
        {eyebrow ? (
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-cyan)]">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">{heading}</h1>
      </div>
    </section>
  );
}
