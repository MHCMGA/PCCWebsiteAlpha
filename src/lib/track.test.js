import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@vercel/analytics", () => ({ track: vi.fn() }));

import { track } from "@vercel/analytics";
import { trackEvent, trackContactSubmit } from "./track";

describe("trackEvent forwards to Vercel Web Analytics", () => {
  beforeEach(() => {
    track.mockClear();
  });

  it("fires the event name + properties through", async () => {
    trackEvent("phone_click", { location: "footer" });
    await vi.waitFor(() => {
      expect(track).toHaveBeenCalledWith("phone_click", { location: "footer" });
    });
  });

  it("includes outcome on trackContactSubmit", async () => {
    trackContactSubmit("success");
    await vi.waitFor(() => {
      expect(track).toHaveBeenCalledWith(
        "contact_form_submitted",
        expect.objectContaining({ outcome: "success" }),
      );
    });
  });

  it("skips dispatch during prerender (navigator.webdriver)", () => {
    const original = Object.getOwnPropertyDescriptor(navigator, "webdriver");
    Object.defineProperty(navigator, "webdriver", {
      configurable: true,
      get: () => true,
    });
    trackEvent("phone_click", { location: "footer" });
    if (original) {
      Object.defineProperty(navigator, "webdriver", original);
    } else {
      Object.defineProperty(navigator, "webdriver", {
        configurable: true,
        get: () => false,
      });
    }
    expect(track).not.toHaveBeenCalled();
  });
});
