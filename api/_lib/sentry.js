// Sentry server init for Node-runtime API routes (api/ask.js, api/contact.js,
// api/cron/ping-sitemap.js). Idempotent: safe to call at module load in every
// handler; subsequent calls are no-ops.
//
// Edge-runtime routes (api/og.js) cannot use @sentry/node — they would need
// @sentry/vercel-edge. We intentionally skip Sentry on og.js since it's a
// stateless image generator with negligible failure surface.
//
// Gated entirely on SENTRY_DSN. With no DSN configured the module is a no-op.

import * as Sentry from "@sentry/node";

let initialized = false;

export function initSentryServer() {
  if (initialized) return Sentry;
  const dsn = process.env.SENTRY_DSN;
  if (!dsn) return Sentry;

  Sentry.init({
    dsn,
    environment: process.env.VERCEL_ENV || "development",
    release: process.env.VERCEL_GIT_COMMIT_SHA || undefined,
    tracesSampleRate: 0,
    // Match the client init — collect IP, request headers, body context.
    sendDefaultPii: true,
  });

  initialized = true;
  return Sentry;
}

// Capture-and-flush helper for serverless: Sentry.captureException is fire-and
// -forget, but Vercel functions can terminate before the event ships. flush()
// gives it up to 2s to send.
export async function reportException(err, context) {
  initSentryServer();
  Sentry.captureException(err, context);
  try {
    await Sentry.flush(2000);
  } catch {
    // never let Sentry's own failures bubble
  }
}
