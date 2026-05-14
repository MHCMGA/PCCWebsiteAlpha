// Thin wrapper around Vercel Web Analytics' track().
//
// Lazy-imported so the @vercel/analytics chunk doesn't land in the initial
// bundle, and the wrapper is a no-op during SSR / prerender so events never
// appear in the prerendered HTML payload (mirrors main.jsx's extras loader,
// which guards on navigator.webdriver).
//
// Event taxonomy (keep names + property keys stable — Web Analytics panels
// group on these strings verbatim):
//   phone_click            { location: 'footer' | 'contact_card' }
//   email_click            { location: 'footer' | 'contact_card' }
//   contact_form_submitted { outcome, msg_len, from_path, hour_et,
//                            device, referrer }
//
// Web Analytics Plus has been enabled team-wide on `mhcis`, which raises
// the per-event property cap from 2 → 8. We send up to 6 here, leaving
// headroom for future additions.

let cachedTrack;

async function getTrack() {
  if (cachedTrack) return cachedTrack;
  const mod = await import("@vercel/analytics");
  cachedTrack = mod.track;
  return cachedTrack;
}

export function trackEvent(name, properties) {
  if (typeof window === "undefined") return;
  if (typeof navigator !== "undefined" && navigator.webdriver) return;

  getTrack()
    .then((fn) => fn(name, properties))
    .catch(() => {});
}

export function trackPhoneClick(location) {
  trackEvent("phone_click", { location });
}

export function trackEmailClick(location) {
  trackEvent("email_click", { location });
}

/** Bucket a message length into short / med / long. PII-safe. */
export function bucketMessageLength(len) {
  if (len < 100) return "short";
  if (len < 400) return "med";
  return "long";
}

/**
 * @param {"success"|"error"|"spam"|"rate_limited"|"invalid"} outcome
 * @param {{ msg_len?: "short"|"med"|"long", from_path?: string }} [detail]
 */
export function trackContactSubmit(outcome, detail = {}) {
  const props = { outcome };
  if (detail.msg_len) props.msg_len = detail.msg_len;
  if (detail.from_path) props.from_path = detail.from_path;

  if (typeof window !== "undefined") {
    // Hour of day in ET — bucket-quality, useful for "when do leads come in".
    const hourEt = new Date().toLocaleString("en-US", {
      timeZone: "America/New_York",
      hour: "numeric",
      hour12: false,
    });
    props.hour_et = Number.parseInt(hourEt, 10);
    // Coarse device class from viewport width.
    const w = window.innerWidth;
    props.device = w >= 1024 ? "desktop" : w >= 640 ? "tablet" : "mobile";
    // Referrer category — direct / search / social / internal / other.
    const ref = typeof document !== "undefined" ? document.referrer : "";
    let refCat = "direct";
    if (ref) {
      try {
        const host = new URL(ref).hostname;
        if (/google|bing|duckduckgo|yahoo|brave/.test(host)) refCat = "search";
        else if (/facebook|linkedin|twitter|x\.com|instagram|reddit/.test(host)) refCat = "social";
        else refCat = host === window.location.hostname ? "internal" : "other";
      } catch {
        refCat = "other";
      }
    }
    props.referrer = refCat;
  }

  trackEvent("contact_form_submitted", props);
}
