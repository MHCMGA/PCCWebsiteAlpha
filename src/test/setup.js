import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

class IO {
  constructor(cb) {
    this.cb = cb;
  }
  observe(el) {
    this.cb([{ isIntersecting: true, target: el }]);
  }
  unobserve() {}
  disconnect() {}
}
globalThis.IntersectionObserver = IO;

// @vercel/analytics is dynamically imported by src/lib/track.js. Stub it so
// tests don't pull the real SDK (which expects window.va to be installed by
// the <Analytics /> component, which we never mount in unit tests).
vi.mock("@vercel/analytics", () => ({ track: vi.fn() }));
