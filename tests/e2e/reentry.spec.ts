import { expect, test } from "@playwright/test";
import { E2E_TEST_EMAIL, E2E_TEST_PASSWORD } from "./support/env";
import { seedInactiveUserData } from "./support/supabase-admin";

test.beforeEach(async () => {
  await seedInactiveUserData();
});

test("inactive user is routed to re-entry and can choose quick reflection", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Email").fill(E2E_TEST_EMAIL);
  await page.getByLabel("Password").fill(E2E_TEST_PASSWORD);
  await page.getByRole("button", { name: "Sign in" }).click();

  await page.waitForURL("**/reentry");
  await expect(page.getByRole("heading", { name: /Let's take a quick moment to reset/i })).toBeVisible();
  await expect(page.getByText(/It has been 6 days since your last reflection./i)).toBeVisible();

  await page.getByRole("button", { name: "Start quick reflection" }).click();
  await page.waitForURL("**/today/check-in*");
  await expect(page.getByRole("heading", { name: "Quick check-in" })).toBeVisible();
});
