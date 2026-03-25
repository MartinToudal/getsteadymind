import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { DAILY_PULSE_PROMPTS } from "@/lib/constants";
import { FOUNDATION_30 } from "@/lib/program";
import { createServerSupabaseClient } from "@/lib/supabase";
import { CheckIn, ProgressSummary, ReentryState, SessionCompletion, SessionDefinition } from "@/lib/types";
import { daysBetween } from "@/lib/utils";

type SessionRow = {
  id: string;
  program_id: string;
  title: string;
  description: string;
  question: string;
  phase: string;
  order: number;
};

function toSessionDefinition(row: SessionRow): SessionDefinition {
  const fallback = FOUNDATION_30.find((session) => session.id === row.id || session.order === row.order);

  return {
    id: row.id,
    programId: "foundation-30",
    title: row.title,
    description: row.description,
    question: row.question,
    phase: row.phase,
    order: row.order,
    optionalActionLabel: fallback?.optionalActionLabel ?? "One action to carry forward",
  };
}

async function getSessionDefinitions() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("sessions")
    .select("id, program_id, title, description, question, phase, order")
    .eq("program_id", "foundation-30")
    .order("order", { ascending: true });

  if (error || !data || data.length === 0) {
    return FOUNDATION_30;
  }

  return (data as SessionRow[]).map(toSessionDefinition);
}

export async function getCurrentUser() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function requireUser(redirectTo?: string) {
  const user = await getCurrentUser();

  if (!user) {
    const destination = redirectTo ? `/login?next=${encodeURIComponent(redirectTo)}` : "/login";
    redirect(destination);
  }

  return user;
}

export async function redirectIfAuthenticated(defaultPath = "/home") {
  const user = await getCurrentUser();
  const headerStore = await headers();
  const nextParam = headerStore.get("x-next-path");

  if (user) {
    redirect(nextParam || defaultPath);
  }
}

export async function getDashboardData(userId: string) {
  const supabase = await createServerSupabaseClient();
  const sessions = await getSessionDefinitions();

  const [{ data: checkIns }, { data: completions }] = await Promise.all([
    supabase
      .from("checkins")
      .select("id, mood, energy, stress, reflection_text, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(30),
    supabase
      .from("session_completions")
      .select("id, session_id, response_text, action_step, completed_at")
      .eq("user_id", userId)
      .order("completed_at", { ascending: false }),
  ]);

  const completedIds = new Set((completions as SessionCompletion[] | null)?.map((entry) => entry.session_id) ?? []);
  const nextSession = sessions.find((session) => !completedIds.has(session.id)) ?? sessions[sessions.length - 1];

  return {
    checkIns: (checkIns as CheckIn[] | null) ?? [],
    completions: (completions as SessionCompletion[] | null) ?? [],
    nextSession,
  };
}

export async function getProgramData(userId: string) {
  const supabase = await createServerSupabaseClient();
  const sessions = await getSessionDefinitions();
  const { data: completions } = await supabase
    .from("session_completions")
    .select("session_id, completed_at")
    .eq("user_id", userId);

  const completionMap = new Map(
    ((completions as Array<{ session_id: string; completed_at: string }> | null) ?? []).map((completion) => [
      completion.session_id,
      completion.completed_at,
    ]),
  );

  return sessions.map((session) => ({
    ...session,
    completedAt: completionMap.get(session.id) ?? null,
  }));
}

export async function getSessionByOrder(order: number): Promise<SessionDefinition | undefined> {
  const sessions = await getSessionDefinitions();
  return sessions.find((session) => session.order === order);
}

export async function getProgressData(userId: string): Promise<ProgressSummary> {
  const supabase = await createServerSupabaseClient();
  const [{ data: checkIns }, { data: completions }] = await Promise.all([
    supabase
      .from("checkins")
      .select("id, mood, energy, stress, reflection_text, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: true }),
    supabase
      .from("session_completions")
      .select("id, completed_at")
      .eq("user_id", userId),
  ]);

  const energyScore = { Low: 1, Medium: 2, High: 3 };
  const stressScore = { Low: 1, Medium: 2, High: 3 };
  const typedCheckIns = (checkIns as CheckIn[] | null) ?? [];

  return {
    sessionsCompleted: (completions?.length ?? 0),
    checkInsCompleted: typedCheckIns.length,
    moodTrend: typedCheckIns.map((entry) => ({ date: entry.created_at, value: entry.mood })),
    energyTrend: typedCheckIns.map((entry) => ({ date: entry.created_at, value: energyScore[entry.energy] })),
    stressTrend: typedCheckIns.map((entry) => ({ date: entry.created_at, value: stressScore[entry.stress] })),
    sessionCompletionDates:
      ((completions as Array<{ completed_at: string }> | null) ?? []).map((entry) => entry.completed_at),
  };
}

export async function getRandomPrompt() {
  return DAILY_PULSE_PROMPTS[Math.floor(Math.random() * DAILY_PULSE_PROMPTS.length)];
}

export async function getReentryState(userId: string): Promise<ReentryState> {
  const supabase = await createServerSupabaseClient();
  const [{ data: latestCheckIn }, { data: latestSession }] = await Promise.all([
    supabase
      .from("checkins")
      .select("created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("session_completions")
      .select("completed_at")
      .eq("user_id", userId)
      .order("completed_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  const latestActivity =
    latestCheckIn?.created_at && latestSession?.completed_at
      ? latestCheckIn.created_at > latestSession.completed_at
        ? latestCheckIn.created_at
        : latestSession.completed_at
      : latestCheckIn?.created_at ?? latestSession?.completed_at ?? null;

  if (!latestActivity) {
    return { isInactive: false, daysSinceLastActivity: 0, latestActivityAt: null };
  }

  const daysSinceLastActivity = daysBetween(latestActivity);

  return {
    isInactive: daysSinceLastActivity >= 5,
    daysSinceLastActivity,
    latestActivityAt: latestActivity,
  };
}

export async function getCurrentPathname() {
  const headerStore = await headers();
  return headerStore.get("x-pathname") ?? "";
}

export async function getRequestedNextPath() {
  const headerStore = await headers();
  return headerStore.get("x-next-path") ?? "";
}
