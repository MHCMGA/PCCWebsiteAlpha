import { expect, test } from "@playwright/test";

const ROUTES = ["/", "/about", "/contact"];

async function measureCLS(page, route) {
  await page.goto(route);

  await page.evaluate(() => {
    window.__cls = { value: 0, shifts: [] };
    const po = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.hadRecentInput) continue;
        window.__cls.value += entry.value;
        const sources = (entry.sources || []).map((s) => ({
          tag: s.node?.nodeName,
          id: s.node?.id || null,
          cls: s.node?.className || null,
          text: (s.node?.innerText || "").slice(0, 60),
          prev: s.previousRect && { ...s.previousRect.toJSON?.() },
          curr: s.currentRect && { ...s.currentRect.toJSON?.() },
        }));
        window.__cls.shifts.push({ value: entry.value, sources });
      }
    });
    po.observe({ type: "layout-shift", buffered: true });
  });

  await page.waitForLoadState("networkidle");
  await page.evaluate(() => new Promise((r) => setTimeout(r, 600)));
  await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "instant" }));
  await page.evaluate(() => new Promise((r) => setTimeout(r, 1500)));
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.evaluate(() => new Promise((r) => setTimeout(r, 600)));

  return page.evaluate(() => window.__cls);
}

test.describe.configure({ mode: "serial" });

for (const route of ROUTES) {
  test(`CLS budget: ${route} ≤ 0.02`, async ({ page }) => {
    const result = await measureCLS(page, route);
    const top = [...result.shifts].sort((a, b) => b.value - a.value).slice(0, 5);
    console.log(
      `[CLS] ${route} = ${result.value.toFixed(4)} from ${result.shifts.length} shifts`,
    );
    for (const s of top) {
      console.log(`  +${s.value.toFixed(4)}`, JSON.stringify(s.sources, null, 2));
    }
    // 0.02 leaves headroom over the observed 0.00 without false-flagging
    // sub-pixel rounding. CLS "good" threshold is 0.10.
    expect(result.value, `CLS=${result.value} on ${route}`).toBeLessThanOrEqual(0.02);
  });
}
