"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { FOUNDATION_30 } from "@/lib/program";
import { createServerSupabaseClient } from "@/lib/supabase";
import { FormState } from "@/lib/types";

const VALID_ENERGY = new Set(["Low", "Medium", "High"]);
const VALID_STRESS = new Set(["Low", "Medium", "High"]);
const REENTRY_BYPASS_COOKIE = "steadymind_reentry_bypass";

function normalizeEmail(value: FormDataEntryValue | null) {
  return String(value ?? "").trim().toLowerCase();
}

function normalizeText(value: FormDataEntryValue | null) {
  return String(value ?? "").trim();
}

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function friendlyAuthError(message: string) {
  if (message.toLowerCase().includes("email not confirmed")) {
    return "Din email er ikke bekræftet endnu. Bekræft den i din indbakke og prøv igen.";
  }

  if (message.toLowerCase().includes("invalid login credentials")) {
    return "Email eller password er forkert.";
  }

  return message;
}

async function clearReentryBypass() {
  const cookieStore = await cookies();
  cookieStore.delete(REENTRY_BYPASS_COOKIE);
}

function normalizeNextPath(value: FormDataEntryValue | null) {
  const path = String(value ?? "").trim();

  if (!path.startsWith("/") || path.startsWith("//")) {
    return "/home";
  }

  if (path.startsWith("/login") || path.startsWith("/signup")) {
    return "/home";
  }

  return path;
}

export async function signUp(_prevState: FormState, formData: FormData): Promise<FormState> {
  const supabase = await createServerSupabaseClient();
  const email = normalizeEmail(formData.get("email"));
  const password = String(formData.get("password") ?? "");
  const nextPath = normalizeNextPath(formData.get("next"));

  if (!validateEmail(email)) {
    return { error: "Indtast en gyldig email-adresse." };
  }

  if (password.length < 6) {
    return { error: "Password skal være mindst 6 tegn." };
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return { error: friendlyAuthError(error.message) };
  }

  redirect(nextPath);
}

export async function signIn(_prevState: FormState, formData: FormData): Promise<FormState> {
  const supabase = await createServerSupabaseClient();
  const email = normalizeEmail(formData.get("email"));
  const password = String(formData.get("password") ?? "");
  const nextPath = normalizeNextPath(formData.get("next"));

  if (!validateEmail(email)) {
    return { error: "Indtast en gyldig email-adresse." };
  }

  if (!password) {
    return { error: "Indtast dit password." };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: friendlyAuthError(error.message) };
  }

  redirect(nextPath);
}

export async function signOut() {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function submitCheckIn(_prevState: FormState, formData: FormData): Promise<FormState> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Du skal være logget ind for at gemme et check-in." };
  }

  const mood = Number(formData.get("mood"));
  const energy = normalizeText(formData.get("energy"));
  const stress = normalizeText(formData.get("stress"));
  const reflectionText = normalizeText(formData.get("reflectionText"));

  if (!Number.isInteger(mood) || mood < 1 || mood > 5) {
    return { error: "Vælg et gyldigt humør mellem 1 og 5." };
  }

  if (!VALID_ENERGY.has(energy)) {
    return { error: "Vælg et gyldigt energiniveau." };
  }

  if (!VALID_STRESS.has(stress)) {
    return { error: "Vælg et gyldigt stressniveau." };
  }

  if (reflectionText.length < 3) {
    return { error: "Skriv en kort refleksion på mindst 3 tegn." };
  }

  if (reflectionText.length > 2000) {
    return { error: "Refleksionen er for lang. Hold den under 2000 tegn." };
  }

  const { error } = await supabase.from("checkins").insert({
    user_id: user.id,
    mood,
    energy,
    stress,
    reflection_text: reflectionText,
  });

  if (error) {
    return { error: "Check-in kunne ikke gemmes. Prøv igen." };
  }

  await clearReentryBypass();
  revalidatePath("/home");
  revalidatePath("/progress");
  revalidatePath("/reentry");
  return { success: true };
}

export async function submitSessionCompletion(_prevState: FormState, formData: FormData): Promise<FormState> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Du skal være logget ind for at gemme en session." };
  }

  const sessionId = normalizeText(formData.get("sessionId"));
  const responseText = normalizeText(formData.get("responseText"));
  const actionStep = normalizeText(formData.get("actionStep"));

  const { data: sessionRow, error: sessionLookupError } = await supabase
    .from("sessions")
    .select("id")
    .eq("id", sessionId)
    .eq("program_id", "foundation-30")
    .maybeSingle();

  if (sessionLookupError) {
    return { error: "Kunne ikke validere den valgte session. Prøv igen." };
  }

  if (!sessionRow && !FOUNDATION_30.some((session) => session.id === sessionId)) {
    return { error: "Den valgte session findes ikke." };
  }

  if (responseText.length < 10) {
    return { error: "Skriv lidt mere i din refleksion, mindst 10 tegn." };
  }

  if (responseText.length > 4000) {
    return { error: "Refleksionen er for lang. Hold den under 4000 tegn." };
  }

  if (actionStep.length > 500) {
    return { error: "Action step er for lang. Hold den under 500 tegn." };
  }

  const { error } = await supabase.from("session_completions").insert({
    user_id: user.id,
    session_id: sessionId,
    response_text: responseText,
    action_step: actionStep,
  });

  if (error) {
    return { error: "Sessionen kunne ikke gemmes. Prøv igen." };
  }

  revalidatePath("/home");
  revalidatePath("/program");
  revalidatePath("/progress");
  return { success: true };
}

export async function submitReentryReflection(_prevState: FormState, formData: FormData): Promise<FormState> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Du skal være logget ind for at fortsætte." };
  }

  const reflectionText = normalizeText(formData.get("reflectionText"));

  if (reflectionText.length < 3) {
    return { error: "Skriv en kort status, før du fortsætter." };
  }

  const { error } = await supabase.from("checkins").insert({
    user_id: user.id,
    mood: 3,
    energy: "Medium",
    stress: "Medium",
    reflection_text: reflectionText,
  });

  if (error) {
    return { error: "Din status kunne ikke gemmes. Prøv igen." };
  }

  await clearReentryBypass();
  revalidatePath("/home");
  revalidatePath("/reentry");
  redirect("/today");
}

export async function startQuickReflectionFromReentry() {
  const cookieStore = await cookies();
  cookieStore.set(REENTRY_BYPASS_COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 30,
  });

  redirect("/today/check-in?from=reentry");
}
