import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@sentry/react", () => ({
  init: vi.fn(),
  captureException: vi.fn(),
}));

import * as Sentry from "@sentry/react";

beforeEach(() => {
  vi.resetModules();
  Sentry.init.mockClear();
});

describe("initSentryClient", () => {
  it("is a no-op when VITE_SENTRY_DSN is unset", async () => {
    vi.stubEnv("VITE_SENTRY_DSN", "");
    const { initSentryClient } = await import("./sentry.client");
    initSentryClient();
    expect(Sentry.init).not.toHaveBeenCalled();
  });

  it("initializes Sentry when VITE_SENTRY_DSN is set", async () => {
    vi.stubEnv("VITE_SENTRY_DSN", "https://abc@o0.ingest.sentry.io/123");
    vi.stubEnv("VITE_VERCEL_ENV", "production");
    vi.stubEnv("VITE_VERCEL_GIT_COMMIT_SHA", "deadbeef");
    const { initSentryClient } = await import("./sentry.client");
    initSentryClient();
    expect(Sentry.init).toHaveBeenCalledTimes(1);
    expect(Sentry.init).toHaveBeenCalledWith(
      expect.objectContaining({
        dsn: "https://abc@o0.ingest.sentry.io/123",
        environment: "production",
        release: "deadbeef",
        tracesSampleRate: 0,
        sendDefaultPii: true,
      }),
    );
  });

  it("is idempotent within the module instance", async () => {
    vi.stubEnv("VITE_SENTRY_DSN", "https://abc@o0.ingest.sentry.io/123");
    const { initSentryClient } = await import("./sentry.client");
    initSentryClient();
    initSentryClient();
    expect(Sentry.init).toHaveBeenCalledTimes(1);
  });
});
