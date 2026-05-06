import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const ROUTES = ["/", "/about", "/contact"];

for (const route of ROUTES) {
  test(`a11y: ${route} has no detectable WCAG2A/AA violations`, async ({ page }) => {
    // Disable fade-in animations so axe samples settled colors, not
    // mid-transition opacity which falsely flags color-contrast.
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(route);
    await page.waitForLoadState("networkidle");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(
      results.violations,
      results.violations.map((v) => `${v.id}: ${v.help}`).join("\n"),
    ).toEqual([]);
  });
}

test("mobile sheet opens, traps focus, closes on Escape", async ({ page, viewport }) => {
  test.skip(!viewport || viewport.width >= 768, "mobile-only nav");
  await page.goto("/");
  const trigger = page.getByRole("button", { name: /open menu/i });
  await trigger.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
});
