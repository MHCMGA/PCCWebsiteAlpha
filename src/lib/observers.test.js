import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

vi.mock("@microsoft/clarity", () => ({
  default: { init: vi.fn() },
}));

import Clarity from "@microsoft/clarity";
import { initClarity, initLinkedInInsightTag, initRb2b } from "./observers";

function injectedScripts(srcMatch) {
  return Array.from(document.head.querySelectorAll("script")).filter((s) =>
    s.src.includes(srcMatch),
  );
}

describe("observers (Clarity + LinkedIn Insight Tag)", () => {
  beforeEach(() => {
    Clarity.init.mockClear();
    delete window._linkedin_partner_id;
    delete window._linkedin_data_partner_ids;
    document.head
      .querySelectorAll(
        'script[src*="licdn"], script[src*="b2bjsstore"], script[data-rb2b]',
      )
      .forEach((s) => {
        s.remove();
      });
  });

  afterEach(() => {
    delete window._linkedin_partner_id;
    delete window._linkedin_data_partner_ids;
  });

  it("initClarity is a no-op without a project id", () => {
    initClarity();
    initClarity("");
    expect(Clarity.init).not.toHaveBeenCalled();
  });

  it("initClarity calls Clarity.init with the project id", () => {
    initClarity("wmnzkdq7pj");
    expect(Clarity.init).toHaveBeenCalledWith("wmnzkdq7pj");
    expect(Clarity.init).toHaveBeenCalledTimes(1);
  });

  it("initLinkedInInsightTag is a no-op without a partner id", () => {
    initLinkedInInsightTag();
    initLinkedInInsightTag("");
    expect(window._linkedin_partner_id).toBeUndefined();
    expect(injectedScripts("licdn")).toHaveLength(0);
  });

  it("initLinkedInInsightTag registers partner id and injects the tag", () => {
    initLinkedInInsightTag("123456");
    expect(window._linkedin_partner_id).toBe("123456");
    expect(window._linkedin_data_partner_ids).toContain("123456");
    expect(injectedScripts("snap.licdn.com")).toHaveLength(1);
  });

  it("initLinkedInInsightTag is idempotent for the same partner id", () => {
    initLinkedInInsightTag("123456");
    initLinkedInInsightTag("123456");
    expect(
      window._linkedin_data_partner_ids.filter((id) => id === "123456"),
    ).toHaveLength(1);
    expect(injectedScripts("snap.licdn.com")).toHaveLength(1);
  });

  it("initRb2b is a no-op without a team id", () => {
    initRb2b();
    initRb2b("");
    expect(injectedScripts("b2bjsstore")).toHaveLength(0);
  });

  it("initRb2b injects the team-specific bundle script", () => {
    initRb2b("TEAM_ABC");
    const tags = injectedScripts("b2bjsstore.s3.us-west-2.amazonaws.com");
    expect(tags).toHaveLength(1);
    expect(tags[0].src).toContain("/b/TEAM_ABC/TEAM_ABC.js.gz");
    expect(tags[0].dataset.rb2b).toBe("TEAM_ABC");
    expect(tags[0].async).toBe(true);
  });

  it("initRb2b is idempotent for the same team id", () => {
    initRb2b("TEAM_ABC");
    initRb2b("TEAM_ABC");
    expect(injectedScripts("b2bjsstore")).toHaveLength(1);
  });
});
