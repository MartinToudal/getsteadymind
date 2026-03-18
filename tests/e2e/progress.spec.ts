import { expect, test } from "@playwright/test";
import { signInThroughUi } from "./support/auth";
import { seedProgressData } from "./support/supabase-admin";

test.beforeEach(async () => {
  await seedProgressData();
});

test("progress page shows seeded summaries and charts", async ({ page }) => {
  await signInThroughUi(page);
  await page.goto("/progress");

  await expect(page.getByText("Sessions completed")).toBeVisible();
  await expect(page.getByText("2").first()).toBeVisible();
  await expect(page.getByText("Daily check-ins completed")).toBeVisible();
  await expect(page.getByText("Mood trend")).toBeVisible();
  await expect(page.getByText("Energy trend")).toBeVisible();
  await expect(page.getByText("Stress trend")).toBeVisible();
});
