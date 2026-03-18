"use client";

import { useActionState, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import { submitCheckIn } from "@/lib/actions";
import { ENERGY_OPTIONS, getContextualDailyPulsePrompt, MOOD_OPTIONS, STRESS_OPTIONS } from "@/lib/constants";
import { Button, ButtonLink } from "@/components/button";
import { Card } from "@/components/card";
import { EnergyLevel, FormState, StressLevel } from "@/lib/types";
import { cn } from "@/lib/utils";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving..." : "Complete check-in"}
    </Button>
  );
}

export function CheckInForm({ prompt }: { prompt: string }) {
  const [step, setStep] = useState(1);
  const [mood, setMood] = useState<number | null>(null);
  const [energy, setEnergy] = useState<EnergyLevel | "">("");
  const [stress, setStress] = useState<StressLevel | "">("");
  const [reflectionText, setReflectionText] = useState("");
  const [state, formAction, pending] = useActionState<FormState, FormData>(submitCheckIn, {});

  const canProceed = useMemo(() => {
    if (step === 1) return mood !== null;
    if (step === 2) return Boolean(energy);
    if (step === 3) return Boolean(stress);
    if (step === 4) return reflectionText.trim().length > 0;
    return true;
  }, [energy, mood, reflectionText, step, stress]);

  const reflectionPrompt = useMemo(() => {
    if (mood === null || !energy || !stress) {
      return prompt;
    }

    return getContextualDailyPulsePrompt(mood, energy, stress);
  }, [energy, mood, prompt, stress]);

  if (state.success) {
    return (
      <Card className="mx-auto max-w-2xl p-8">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.24em] text-muted">Daily Pulse</p>
          <h1 className="text-3xl font-semibold">Nice work. You took a moment to check in.</h1>
          <ButtonLink href="/home" className="mt-4">
            Return to Home
          </ButtonLink>
        </div>
      </Card>
    );
  }

  return (
    <Card className="mx-auto max-w-2xl p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-muted">Daily Pulse</p>
          <h1 className="mt-2 text-3xl font-semibold">Quick check-in</h1>
        </div>
        <span className="text-sm text-muted">Step {step} of 5</span>
      </div>

      {step === 1 ? (
        <div className="space-y-5">
          <div>
            <h2 className="text-2xl font-medium">Mood</h2>
            <p className="mt-2 text-sm leading-6 text-muted">How are you feeling right now?</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {MOOD_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setMood(option.value)}
                disabled={pending}
                className={cn(
                  "rounded-3xl border border-border bg-panelAlt p-4 text-left transition hover:border-accent disabled:cursor-not-allowed disabled:opacity-60",
                  mood === option.value && "border-accent bg-accentSoft text-accent",
                )}
              >
                <div className="text-sm text-muted">{option.value}</div>
                <div className="mt-1 text-lg">{option.label}</div>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="space-y-5">
          <div>
            <h2 className="text-2xl font-medium">Energy</h2>
            <p className="mt-2 text-sm leading-6 text-muted">How much energy do you have today?</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {ENERGY_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setEnergy(option)}
                disabled={pending}
                className={cn(
                  "rounded-3xl border border-border bg-panelAlt p-5 text-lg transition hover:border-accent disabled:cursor-not-allowed disabled:opacity-60",
                  energy === option && "border-accent bg-accentSoft text-accent",
                )}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {step === 3 ? (
        <div className="space-y-5">
          <div>
            <h2 className="text-2xl font-medium">Stress</h2>
            <p className="mt-2 text-sm leading-6 text-muted">What is your stress level right now?</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {STRESS_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setStress(option)}
                disabled={pending}
                className={cn(
                  "rounded-3xl border border-border bg-panelAlt p-5 text-lg transition hover:border-accent disabled:cursor-not-allowed disabled:opacity-60",
                  stress === option && "border-accent bg-accentSoft text-accent",
                )}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {step === 4 ? (
        <div className="space-y-5">
          <div>
            <h2 className="text-2xl font-medium">Reflection</h2>
            <p className="mt-2 text-sm leading-6 text-muted">{reflectionPrompt}</p>
          </div>
          <textarea
            value={reflectionText}
            onChange={(event) => setReflectionText(event.target.value)}
            rows={7}
            disabled={pending}
            className="w-full rounded-[28px] border border-border bg-panelAlt px-4 py-4 text-base outline-none transition focus:border-accent"
            placeholder="Write a few sentences."
          />
        </div>
      ) : null}

      {step === 5 ? (
        <form
          action={formAction}
          className="space-y-5"
        >
          <div>
            <h2 className="text-2xl font-medium">Ready to complete?</h2>
            <p className="mt-2 text-sm leading-6 text-muted">You can submit your Daily Pulse now.</p>
          </div>
          <input type="hidden" name="mood" value={mood ?? ""} />
          <input type="hidden" name="energy" value={energy} />
          <input type="hidden" name="stress" value={stress} />
          <input type="hidden" name="reflectionText" value={reflectionText} />
          <div className="rounded-3xl border border-border bg-panelAlt p-5 text-sm leading-7 text-muted">
            <p>Mood: {mood}</p>
            <p>Energy: {energy}</p>
            <p>Stress: {stress}</p>
          </div>
          {state.error ? <p className="text-sm text-warning">{state.error}</p> : null}
          <SubmitButton />
        </form>
      ) : null}

      {!state.success ? (
        <div className="mt-8 flex flex-wrap items-center gap-3">
          {step > 1 && step < 5 ? (
            <Button type="button" variant="secondary" onClick={() => setStep((current) => current - 1)}>
              Back
            </Button>
          ) : null}
          {step < 5 ? (
            <Button type="button" onClick={() => setStep((current) => current + 1)} disabled={!canProceed || pending}>
              Continue
            </Button>
          ) : null}
        </div>
      ) : null}
    </Card>
  );
}
