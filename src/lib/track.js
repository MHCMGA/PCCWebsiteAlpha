// Thin wrapper that fans every call out to two backends:
//   1. Vercel Web Analytics — custom events panel (numeric rollups by property)
//   2. Microsoft Clarity    — Clarity.event() tags the session recording so
//      you can filter replays to "users who clicked phone" or "submits that
//      failed validation", and Clarity.setTag() pivots heatmaps the same way.
//
// Both SDKs are lazy-imported so they don't land in the initial bundle, and
// the wrapper is a no-op during SSR / prerender so events never appear in the
// prerendered HTML payload (mirrors main.jsx's extras loader, which guards on
// navigator.webdriver).
//
// Event taxonomy (keep names + property keys stable — Web Analytics panels
// and Clarity tag filters group on these strings verbatim):
//   phone_click            { location: 'footer' | 'contact_card' }
//   email_click            { location: 'footer' | 'contact_card' }
//   contact_form_submitted { outcome:  'success' | 'error' | 'invalid' }
//
// Each event uses a single property to stay under the Vercel Pro-tier
// 2-property cap, leaving headroom if Web Analytics Plus gets enabled later.

let cachedTrack;
let cachedClarity;

async function getTrack() {
  if (cachedTrack) return cachedTrack;
  const mod = await import("@vercel/analytics");
  cachedTrack = mod.track;
  return cachedTrack;
}

async function getClarity() {
  if (cachedClarity) return cachedClarity;
  const mod = await import("@microsoft/clarity");
  cachedClarity = mod.default;
  return cachedClarity;
}

export function trackEvent(name, properties) {
  if (typeof window === "undefined") return;
  if (typeof navigator !== "undefined" && navigator.webdriver) return;

  getTrack()
    .then((fn) => fn(name, properties))
    .catch(() => {});

  getClarity()
    .then((Clarity) => {
      Clarity.event(name);
      if (properties) {
        for (const [key, value] of Object.entries(properties)) {
          if (value != null) Clarity.setTag(key, String(value));
        }
      }
    })
    .catch(() => {});
}

export function trackPhoneClick(location) {
  trackEvent("phone_click", { location });
}

export function trackEmailClick(location) {
  trackEvent("email_click", { location });
}

export function trackContactSubmit(outcome) {
  trackEvent("contact_form_submitted", { outcome });
}
