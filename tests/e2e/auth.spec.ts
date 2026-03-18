import { expect, test } from "@playwright/test";
import { signInThroughUi } from "./support/auth";
import { resetTestUserData } from "./support/supabase-admin";

test.beforeEach(async () => {
  await resetTestUserData();
});

test("user can sign in and reach home", async ({ page }) => {
  await signInThroughUi(page);

  await expect(page.getByRole("heading", { name: /Build clarity and momentum one honest reflection at a time/i })).toBeVisible();
  await expect(page.getByRole("link", { name: "Start Check-in" })).toBeVisible();
});
