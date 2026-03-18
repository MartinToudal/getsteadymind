import type { FullConfig } from "@playwright/test";
import { ensureTestUser, resetTestUserData } from "./support/supabase-admin";

async function globalSetup(_config: FullConfig) {
  await ensureTestUser();
  await resetTestUserData();
}

export default globalSetup;
