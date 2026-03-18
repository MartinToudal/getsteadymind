"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-screen max-w-3xl items-center px-4 py-10 sm:px-6">
      <div className="w-full rounded-[28px] border border-border bg-panel p-8 shadow-calm">
        <p className="text-sm uppercase tracking-[0.24em] text-muted">SteadyMind</p>
        <h1 className="mt-3 text-3xl font-semibold">Noget gik galt.</h1>
        <p className="mt-4 text-sm leading-7 text-muted">
          Siden kunne ikke indlæses korrekt. Prøv igen. Hvis fejlen fortsætter, så er det sandsynligvis en
          serverfejl, som vi skal rette i koden.
        </p>
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-12 items-center justify-center rounded-full bg-accent px-5 text-sm font-medium text-slate-950 transition hover:bg-[#9cdec0]"
          >
            Prøv igen
          </button>
        </div>
      </div>
    </div>
  );
}
