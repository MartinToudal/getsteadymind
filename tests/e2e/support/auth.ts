import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";
import { E2E_TEST_EMAIL, E2E_TEST_PASSWORD } from "./env";

export async function signInThroughUi(page: Page) {
  await page.goto("/login");
  await page.getByLabel("Email").fill(E2E_TEST_EMAIL);
  await page.getByLabel("Password").fill(E2E_TEST_PASSWORD);
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL("**/home");
  await expect(page.getByText("Daily Pulse")).toBeVisible();
}
