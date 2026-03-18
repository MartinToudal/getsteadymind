"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { startQuickReflectionFromReentry, submitReentryReflection } from "@/lib/actions";
import { FormState } from "@/lib/types";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-12 items-center justify-center rounded-full bg-accent px-5 text-sm font-medium text-slate-950 transition hover:bg-[#9cdec0] disabled:opacity-60"
    >
      {pending ? "Saving..." : "Continue program"}
    </button>
  );
}

export function ReentryForm() {
  const [state, formAction, pending] = useActionState<FormState, FormData>(submitReentryReflection, {});

  return (
    <form action={formAction} className="mt-8 space-y-5">
      <div className="space-y-2">
        <label htmlFor="reflectionText" className="text-sm text-muted">
          How have you been lately?
        </label>
        <textarea
          id="reflectionText"
          name="reflectionText"
          rows={6}
          required
          disabled={pending}
          className="w-full rounded-[28px] border border-border bg-panelAlt px-4 py-4 text-base outline-none transition focus:border-accent"
        />
      </div>
      {state.error ? <p className="text-sm text-warning">{state.error}</p> : null}
      <div className="flex flex-wrap gap-3">
        <SubmitButton />
        <button
          type="submit"
          formAction={startQuickReflectionFromReentry}
          formNoValidate
          disabled={pending}
          className="inline-flex h-12 items-center justify-center rounded-full bg-panelAlt px-5 text-sm font-medium text-text transition hover:bg-[#202734]"
        >
          Start quick reflection
        </button>
      </div>
      <p className="text-sm leading-7 text-muted">
        Continue program if you want to reset and return to your normal flow. Choose quick reflection if you want a
        lighter re-entry first.
      </p>
    </form>
  );
}
