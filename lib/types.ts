export type EnergyLevel = "Low" | "Medium" | "High";
export type StressLevel = "Low" | "Medium" | "High";

export type SessionDefinition = {
  id: string;
  programId: "foundation-30";
  title: string;
  description: string;
  question: string;
  phase: string;
  order: number;
  optionalActionLabel: string;
};

export type CheckIn = {
  id: string;
  mood: number;
  energy: EnergyLevel;
  stress: StressLevel;
  reflection_text: string | null;
  created_at: string;
};

export type SessionCompletion = {
  id: string;
  session_id: string;
  response_text: string | null;
  action_step: string | null;
  completed_at: string;
};

export type ProgressSummary = {
  sessionsCompleted: number;
  checkInsCompleted: number;
  moodTrend: Array<{ date: string; value: number }>;
  energyTrend: Array<{ date: string; value: number }>;
  stressTrend: Array<{ date: string; value: number }>;
  sessionCompletionDates: string[];
};

export type ReentryState = {
  isInactive: boolean;
  daysSinceLastActivity: number;
  latestActivityAt: string | null;
};

export type FormState = {
  success?: boolean;
  error?: string;
};
