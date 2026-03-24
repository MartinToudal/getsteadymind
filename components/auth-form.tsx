"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { FormState } from "@/lib/types";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Working..." : label}
    </Button>
  );
}

export function AuthForm({
  title,
  description,
  action,
  actionLabel,
  alternateLabel,
  alternateHref,
}: Readonly<{
  title: string;
  description: string;
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  actionLabel: string;
  alternateLabel: string;
  alternateHref: string;
}>) {
  const [state, formAction, pending] = useActionState(action, {});
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/home";

  return (
    <Card className="mx-auto mt-16 w-full max-w-md p-8">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.24em] text-muted">SteadyMind</p>
        <h1 className="text-3xl font-semibold">{title}</h1>
        <p className="text-sm leading-6 text-muted">{description}</p>
        <p className="text-sm leading-6 text-muted">
          This is not about writing something profound. It is about building a steady practice.
        </p>
      </div>
      <form action={formAction} className="mt-8 space-y-5">
        <input type="hidden" name="next" value={next} />
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm text-muted">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            disabled={pending}
            className="h-12 w-full rounded-2xl border border-border bg-panelAlt px-4 text-text outline-none ring-0 transition focus:border-accent"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm text-muted">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            minLength={6}
            required
            disabled={pending}
            className="h-12 w-full rounded-2xl border border-border bg-panelAlt px-4 text-text outline-none ring-0 transition focus:border-accent"
          />
        </div>
        {state.error ? <p className="text-sm text-warning">{state.error}</p> : null}
        <SubmitButton label={actionLabel} />
      </form>
      <p className="mt-5 text-sm text-muted">
        <Link
          href={alternateHref}
          aria-disabled={pending}
          className="text-text transition hover:text-accent aria-disabled:pointer-events-none aria-disabled:opacity-60"
        >
          {alternateLabel}
        </Link>
      </p>
    </Card>
  );
}
