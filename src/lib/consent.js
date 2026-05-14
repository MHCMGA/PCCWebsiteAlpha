// Tiny helper around the `pcc-consent` localStorage key written by
// CookieConsent. Lets the analytics loader in main.jsx decide which
// third-party scripts to inject on hydrate, and re-fire when the user
// later clicks Accept.
//
// Values: "accepted" | "declined" | "unset"
//
// Storage strategy:
//   1. Try window.localStorage (durable across visits).
//   2. If that throws (Brave / Safari private browsing can refuse
//      access entirely, or throw QuotaExceeded), fall back to a
//      module-level in-memory variable. The user's choice still gates
//      trackers for the rest of the tab session, but the banner will
//      reappear on their next visit. That is the right behaviour: we
//      shouldn't silently lose the choice mid-session, AND we have no
//      durable place to remember it on next visit anyway.

const KEY = "pcc-consent";

// In-memory fallback when localStorage is unavailable. Plain string so
// it survives the same way across hot reloads / dynamic imports.
let memoryStore = null;

function safeGet() {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return memoryStore;
  }
}

function safeSet(value) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, value);
  } catch {
    memoryStore = value;
  }
}

export function readConsent() {
  const v = safeGet();
  if (v === "accepted" || v === "declined") return v;
  return "unset";
}

export function writeConsent(value) {
  if (value !== "accepted" && value !== "declined") return;
  safeSet(value);
  // Broadcast to other tabs and the analytics loader. dispatchEvent
  // can in theory throw in extremely locked-down environments, so
  // isolate it from the storage write above.
  try {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("pcc:consent", { detail: value }));
    }
  } catch {
    /* nothing to do — analytics will simply not hot-load */
  }
}

// Treat anything that isn't an explicit Accept as no-consent. This is
// the stricter (GDPR-aligned) interpretation, better for B2B trust
// even though US law would let us treat "unset" as implicit consent.
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
