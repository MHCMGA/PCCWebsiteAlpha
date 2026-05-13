// Sentry browser init. Lazy-imported by main.jsx's loadExtras after hydration
// + idle, mirroring how Analytics / SpeedInsights are loaded — keeps the SDK
// out of the initial bundle.
//
// Gated entirely on VITE_SENTRY_DSN. With no DSN configured the function is a
// no-op, which lets the codebase ship before Sentry is provisioned.
//
// Skips Sentry's own session-replay integration on purpose — PostHog covers
// session replays and bundling both is wasted bytes.

import * as Sentry from "@sentry/react";

let initialized = false;

export function initSentryClient() {
  if (initialized) return Sentry;
  if (typeof window === "undefined") return Sentry;
  if (typeof navigator !== "undefined" && navigator.webdriver) return Sentry;

  const dsn = import.meta.env.VITE_SENTRY_DSN;
  if (!dsn) return Sentry;

  Sentry.init({
    dsn,
    environment: import.meta.env.VITE_VERCEL_ENV || import.meta.env.MODE,
    release: import.meta.env.VITE_VERCEL_GIT_COMMIT_SHA || undefined,
    // Conservative defaults for a brochure site — flip these up if/when the
    // app grows. tracesSampleRate=0 means no perf transactions; replays are
    // intentionally omitted (PostHog handles that).
    tracesSampleRate: 0,
    // Per Sentry's onboarding recommendation: collect IP, cookies, headers,
    // and Sentry.setUser data for richer error context. Site is US-only B2B
    // and our privacy disclosure covers third-party error tooling.
    sendDefaultPii: true,
  });

  initialized = true;
  return Sentry;
}

export { Sentry };
