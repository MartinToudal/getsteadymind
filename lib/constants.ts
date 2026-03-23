import { EnergyLevel, StressLevel } from "@/lib/types";

export const NAV_ITEMS = [
  { href: "/home", label: "Home" },
  { href: "/today", label: "Today" },
  { href: "/program", label: "Program" },
  { href: "/progress", label: "Progress" },
];

export const DAILY_PULSE_PROMPTS = [
  "What has been on your mind today?",
  "How has your day felt so far?",
  "What gave you energy today?",
  "What drained your energy today?",
  "What are you grateful for today?",
  "What challenged you today?",
  "What helped you today?",
  "What do you need right now?",
  "What made today better?",
  "What made today harder?",
  "What are you thinking about most?",
  "What are you looking forward to?",
  "What did you learn today?",
  "What is one thing you want to improve tomorrow?",
  "What matters most today?",
];

const DAILY_PULSE_PROMPT_GROUPS = {
  recovery: [
    "What do you need right now?",
    "What has been on your mind today?",
    "What challenged you today?",
    "What helped you today?",
  ],
  pressure: [
    "What challenged you today?",
    "What made today harder?",
    "What has been on your mind today?",
    "What do you need right now?",
  ],
  lowEnergy: [
    "What drained your energy today?",
    "What helped you today?",
    "How has your day felt so far?",
    "What do you need right now?",
  ],
  steady: [
    "How has your day felt so far?",
    "What has been on your mind today?",
    "What matters most today?",
    "What are you thinking about most?",
  ],
  positive: [
    "What gave you energy today?",
    "What made today better?",
    "What are you grateful for today?",
    "What are you looking forward to?",
  ],
} as const;

type DailyPulseReflection = {
  prompt: string;
  guidance: string;
  focus: string;
};

function pickPrompt(prompts: readonly string[], mood: number, energy: EnergyLevel, stress: StressLevel) {
  const seed = `${mood}-${energy}-${stress}`;
  const index = Array.from(seed).reduce((total, char) => total + char.charCodeAt(0), 0) % prompts.length;
  return prompts[index];
}

export function getContextualDailyPulsePrompt(mood: number, energy: EnergyLevel, stress: StressLevel) {
  if (mood <= 2) {
    return pickPrompt(DAILY_PULSE_PROMPT_GROUPS.recovery, mood, energy, stress);
  }

  if (stress === "High") {
    return pickPrompt(DAILY_PULSE_PROMPT_GROUPS.pressure, mood, energy, stress);
  }

  if (energy === "Low") {
    return pickPrompt(DAILY_PULSE_PROMPT_GROUPS.lowEnergy, mood, energy, stress);
  }

  if (mood >= 4) {
    return pickPrompt(DAILY_PULSE_PROMPT_GROUPS.positive, mood, energy, stress);
  }

  return pickPrompt(DAILY_PULSE_PROMPT_GROUPS.steady, mood, energy, stress);
}

export function getContextualDailyPulseReflection(
  mood: number,
  energy: EnergyLevel,
  stress: StressLevel,
): DailyPulseReflection {
  const prompt = getContextualDailyPulsePrompt(mood, energy, stress);

  if (mood <= 2) {
    return {
      prompt,
      guidance: "Keep it simple. Name what feels most important, and what would help most right now.",
      focus: "Go gently today. Reduce pressure and choose one supportive next step.",
    };
  }

  if (stress === "High") {
    return {
      prompt,
      guidance: "Notice what is creating the most pressure, and what might give you a little more space or calm.",
      focus: "Protect your attention. Lower unnecessary pressure where you can.",
    };
  }

  if (energy === "Low") {
    return {
      prompt,
      guidance: "You do not need to solve everything. Write down what is draining you, and what might make today lighter.",
      focus: "Work with your energy. Keep today small, clear, and realistic.",
    };
  }

  if (mood >= 4 && stress === "Low") {
    return {
      prompt,
      guidance: "Put words to what is working. That makes it easier to protect and repeat.",
      focus: "Build on what is working. Keep your momentum intentional.",
    };
  }

  if (mood >= 4) {
    return {
      prompt,
      guidance: "You seem relatively steady. Take a moment to notice what is helping you move well today.",
      focus: "Use today's steadiness well. Put attention where it matters most.",
    };
  }

  return {
    prompt,
    guidance: "Write briefly and honestly. The goal is simply to understand your direction a little better right now.",
    focus: "Stay oriented. Notice what matters and choose one clear focus for today.",
  };
}

export const MOOD_OPTIONS = [
  { value: 1, label: "Very low" },
  { value: 2, label: "Low" },
  { value: 3, label: "Neutral" },
  { value: 4, label: "Good" },
  { value: 5, label: "Great" },
];

export const ENERGY_OPTIONS: EnergyLevel[] = ["Low", "Medium", "High"];
export const STRESS_OPTIONS: StressLevel[] = ["Low", "Medium", "High"];
