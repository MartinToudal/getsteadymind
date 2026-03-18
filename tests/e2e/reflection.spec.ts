import { expect, test } from "@playwright/test";
import { signInThroughUi } from "./support/auth";
import { resetTestUserData } from "./support/supabase-admin";

test.describe("reflection flows", () => {
  test.beforeEach(async () => {
    await resetTestUserData();
  });

  test("user can complete a Daily Pulse check-in", async ({ page }) => {
    await signInThroughUi(page);
    await page.goto("/today/check-in");

    await page.getByRole("button", { name: /Good/i }).click();
    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByRole("button", { name: "Medium" }).click();
    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByRole("button", { name: "Low" }).click();
    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByPlaceholder("Write a few sentences.").fill("Today felt more grounded after I slowed down.");
    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByRole("button", { name: "Complete check-in" }).click();

    await expect(page.getByRole("heading", { name: /Nice work/i })).toBeVisible();
  });

  test("user can complete the first guided session", async ({ page }) => {
    await signInThroughUi(page);
    await page.goto("/today/session/1");

    await page
      .getByLabel("Reflection")
      .fill("I feel hopeful, stretched, and clearer when I write things down honestly.");
    await page.getByLabel("Optional action step").fill("Pause for five minutes tomorrow morning.");
    await page.getByRole("button", { name: "Complete session" }).click();

    await expect(page.getByRole("heading", { name: "Session complete." })).toBeVisible();
    await page.getByRole("link", { name: "Back to Program" }).click();
    await expect(page.getByText(/Completed \d{1,2}\/\d{1,2}\/\d{4}/).first()).toBeVisible();
  });
});
