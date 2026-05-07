import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@vercel/analytics", () => ({ track: vi.fn() }));
vi.mock("@microsoft/clarity", () => ({
  default: { init: vi.fn(), event: vi.fn(), setTag: vi.fn() },
}));

import { track } from "@vercel/analytics";
import Clarity from "@microsoft/clarity";
import { trackEvent, trackContactSubmit } from "./track";

describe("trackEvent dual-fires to Vercel Analytics and Clarity", () => {
  beforeEach(() => {
    track.mockClear();
    Clarity.event.mockClear();
    Clarity.setTag.mockClear();
  });

  it("fires the same event name to both backends", async () => {
    trackEvent("phone_click", { location: "footer" });
    await vi.waitFor(() => {
      expect(track).toHaveBeenCalledWith("phone_click", { location: "footer" });
      expect(Clarity.event).toHaveBeenCalledWith("phone_click");
    });
  });

  it("mirrors each property into a Clarity tag", async () => {
    trackContactSubmit("success");
    await vi.waitFor(() => {
      expect(Clarity.event).toHaveBeenCalledWith("contact_form_submitted");
      expect(Clarity.setTag).toHaveBeenCalledWith("outcome", "success");
    });
  });

  it("skips both backends during prerender (navigator.webdriver)", () => {
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
    expect(Clarity.event).not.toHaveBeenCalled();
  });
});
