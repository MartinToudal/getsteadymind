"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { submitSessionCompletion } from "@/lib/actions";
import { Button, ButtonLink } from "@/components/button";
import { Card } from "@/components/card";
import { PHASE_DETAILS } from "@/lib/program";
import { FormState, SessionDefinition } from "@/lib/types";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving..." : "Complete session"}
    </Button>
  );
}

export function GuidedSessionForm({ session }: { session: SessionDefinition }) {
  const [responseText, setResponseText] = useState("");
  const [actionStep, setActionStep] = useState("");
  const [state, formAction, pending] = useActionState<FormState, FormData>(submitSessionCompletion, {});
  const phaseDetail = PHASE_DETAILS[session.phase as keyof typeof PHASE_DETAILS];

  if (state.success) {
    return (
      <Card className="mx-auto max-w-3xl p-8">
        <p className="text-sm uppercase tracking-[0.24em] text-muted">
          {session.phase} • Session {session.order}
        </p>
        <h1 className="mt-3 text-3xl font-semibold">Session complete.</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
          Reflection turns into momentum when you keep one useful next step visible.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <ButtonLink href="/home">Return to Home</ButtonLink>
          <ButtonLink href="/program" variant="secondary">
            Back to Program
          </ButtonLink>
        </div>
      </Card>
    );
  }

  return (
    <Card className="mx-auto max-w-3xl p-8">
      <p className="text-sm uppercase tracking-[0.24em] text-muted">
        Foundation 30 • {session.phase} • Session {session.order}
      </p>
      <h1 className="mt-3 text-3xl font-semibold">{session.title}</h1>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-muted">{session.description}</p>
      {phaseDetail ? (
        <div className="mt-5 rounded-[24px] border border-border bg-panelAlt p-5">
          <p className="text-sm uppercase tracking-[0.18em] text-muted">{session.phase} • {phaseDetail.label}</p>
          <p className="mt-3 text-sm leading-7 text-muted">{phaseDetail.purpose}</p>
          <p className="mt-3 text-sm text-text">{phaseDetail.practice}</p>
        </div>
      ) : null}
      <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
        Keep it simple. A few honest sentences are enough for this step. The goal is to practise the skill behind the question, not to write something perfect.
      </p>

      <form
        action={formAction}
        className="mt-8 space-y-6"
      >
        <input type="hidden" name="sessionId" value={session.id} />
        <div className="space-y-2">
          <label htmlFor="responseText" className="text-sm text-muted">
            Reflection
          </label>
          <textarea
            id="responseText"
            name="responseText"
            rows={8}
            required
            disabled={pending}
            value={responseText}
            onChange={(event) => setResponseText(event.target.value)}
            className="w-full rounded-[28px] border border-border bg-panelAlt px-4 py-4 text-base outline-none transition focus:border-accent"
            placeholder={session.question}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="actionStep" className="text-sm text-muted">
            Optional action step
          </label>
          <input
            id="actionStep"
            name="actionStep"
            disabled={pending}
            value={actionStep}
            onChange={(event) => setActionStep(event.target.value)}
            className="h-12 w-full rounded-2xl border border-border bg-panelAlt px-4 outline-none transition focus:border-accent"
            placeholder={session.optionalActionLabel}
          />
        </div>
        {state.error ? <p className="text-sm text-warning">{state.error}</p> : null}
        <SubmitButton />
      </form>
    </Card>
  );
}
