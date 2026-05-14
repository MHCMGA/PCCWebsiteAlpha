// Tiny helper around the `pcc-consent` localStorage key written by
// CookieConsent. Lets the analytics loader in main.jsx decide which
// third-party scripts to inject on hydrate, and re-fire when the user
// later clicks Accept.
//
// Values: "accepted" | "declined" | "unset"

const KEY = "pcc-consent";

export function readConsent() {
  if (typeof window === "undefined") return "unset";
  try {
    const v = window.localStorage.getItem(KEY);
    if (v === "accepted" || v === "declined") return v;
    return "unset";
  } catch {
    return "unset";
  }
}

// Treat anything that isn't an explicit Accept as no-consent. This is the
// stricter (GDPR-aligned) interpretation — better for B2B trust even
// though US law would let us treat "unset" as implicit consent.
export function hasAccepted() {
  return readConsent() === "accepted";
}

// Fire `fn` if consent is already granted, otherwise wait for the
// `pcc:consent` event from CookieConsent and fire then. Returns a
// cleanup function for cases where the caller wants to detach early.
export function whenAccepted(fn) {
  if (typeof window === "undefined") return () => {};
  if (hasAccepted()) {
    fn();
    return () => {};
  }
  const handler = (e) => {
    if (e.detail === "accepted") {
      window.removeEventListener("pcc:consent", handler);
      fn();
    }
  };
  window.addEventListener("pcc:consent", handler);
  return () => window.removeEventListener("pcc:consent", handler);
}
