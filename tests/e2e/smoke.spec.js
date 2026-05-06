import { expect, test } from "@playwright/test";

test.describe("smoke", () => {
  test("home renders hero and primary CTAs", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Palmetto Consulting/);
    await expect(
      page.getByRole("heading", { level: 1, name: /Palmetto Consulting/i }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: /Let.s Work Together/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Meet the Team/i })).toBeVisible();
  });

  test("primary nav routes to about and contact", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "About Us", exact: true }).first().click();
    await expect(page).toHaveURL(/\/about$/);
    await expect(page.getByRole("heading", { level: 1, name: /About Us/i })).toBeVisible();

    await page.getByRole("link", { name: "Contact", exact: true }).first().click();
    await expect(page).toHaveURL(/\/contact$/);
    await expect(page.getByRole("heading", { level: 1, name: /Contact/i })).toBeVisible();
  });

  test("contact form validates required fields", async ({ page }) => {
    await page.goto("/contact");
    const form = page.locator("form").first();
    await form.getByRole("button", { name: /send|submit/i }).click();
    // Native HTML validation prevents submission; URL remains /contact
    await expect(page).toHaveURL(/\/contact$/);
  });

  test("footer shows contact details", async ({ page }) => {
    await page.goto("/");
    const footer = page.getByRole("contentinfo");
    await expect(footer).toContainText("803-904-8461");
    await expect(footer).toContainText("info@palmettoconsulting.us");
  });
});
