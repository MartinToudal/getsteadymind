import { createClient } from "@supabase/supabase-js";
import { E2E_TEST_EMAIL, E2E_TEST_PASSWORD, loadLocalEnv } from "./env";

loadLocalEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  throw new Error("Missing Supabase admin environment for Playwright tests.");
}

const adminClient = createClient(supabaseUrl, serviceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export async function ensureTestUser() {
  const { data, error } = await adminClient.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });

  if (error) {
    throw error;
  }

  const existing = data.users.find((user) => user.email === E2E_TEST_EMAIL);

  if (existing) {
    const { error: updateError } = await adminClient.auth.admin.updateUserById(existing.id, {
      password: E2E_TEST_PASSWORD,
      email_confirm: true,
    });

    if (updateError) {
      throw updateError;
    }

    return existing.id;
  }

  const { data: created, error: createError } = await adminClient.auth.admin.createUser({
    email: E2E_TEST_EMAIL,
    password: E2E_TEST_PASSWORD,
    email_confirm: true,
  });

  if (createError || !created.user) {
    throw createError ?? new Error("Failed to create E2E test user.");
  }

  return created.user.id;
}

export async function resetTestUserData() {
  const userId = await ensureTestUser();

  const { error: completionsError } = await adminClient.from("session_completions").delete().eq("user_id", userId);

  if (completionsError) {
    throw completionsError;
  }

  const { error: checkInsError } = await adminClient.from("checkins").delete().eq("user_id", userId);

  if (checkInsError) {
    throw checkInsError;
  }

  return userId;
}

export async function seedProgressData() {
  const userId = await resetTestUserData();

  const { data: sessions, error: sessionsError } = await adminClient
    .from("sessions")
    .select("id")
    .eq("program_id", "foundation-30")
    .order("order", { ascending: true })
    .limit(2);

  if (sessionsError || !sessions || sessions.length < 2) {
    throw sessionsError ?? new Error("Could not load seeded sessions for progress data.");
  }

  const { error: checkInError } = await adminClient.from("checkins").insert([
    {
      user_id: userId,
      mood: 3,
      energy: "Medium",
      stress: "Low",
      reflection_text: "A steady start to the day.",
    },
    {
      user_id: userId,
      mood: 4,
      energy: "High",
      stress: "Medium",
      reflection_text: "More energy after a clear morning plan.",
    },
  ]);

  if (checkInError) {
    throw checkInError;
  }

  const { error: completionError } = await adminClient.from("session_completions").insert([
    {
      user_id: userId,
      session_id: sessions[0].id,
      response_text: "I feel stretched but hopeful.",
      action_step: "Notice my pace tomorrow morning.",
    },
    {
      user_id: userId,
      session_id: sessions[1].id,
      response_text: "My mind has been full, but writing helps.",
      action_step: "Pause once before lunch.",
    },
  ]);

  if (completionError) {
    throw completionError;
  }

  return userId;
}

export async function seedInactiveUserData() {
  const userId = await resetTestUserData();
  const sixDaysAgo = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString();

  const { data: sessions, error: sessionsError } = await adminClient
    .from("sessions")
    .select("id")
    .eq("program_id", "foundation-30")
    .order("order", { ascending: true })
    .limit(1);

  if (sessionsError || !sessions || sessions.length === 0) {
    throw sessionsError ?? new Error("Could not load a session for inactive user seed.");
  }

  const { error: checkInError } = await adminClient.from("checkins").insert({
    user_id: userId,
    mood: 2,
    energy: "Low",
    stress: "High",
    reflection_text: "This was my last reflection before going inactive.",
    created_at: sixDaysAgo,
  });

  if (checkInError) {
    throw checkInError;
  }

  const { error: completionError } = await adminClient.from("session_completions").insert({
    user_id: userId,
    session_id: sessions[0].id,
    response_text: "Earlier reflection state.",
    action_step: "Return gently.",
    completed_at: sixDaysAgo,
  });

  if (completionError) {
    throw completionError;
  }

  return userId;
}
