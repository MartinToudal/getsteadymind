import { ButtonLink } from "@/components/button";
import { Card } from "@/components/card";
import { getDashboardData, requireUser } from "@/lib/server-data";
import { getGreeting } from "@/lib/utils";

export default async function HomePage() {
  const user = await requireUser();
  const { completions, checkIns, nextSession } = await getDashboardData(user.id);
  const hasActivity = completions.length > 0 || checkIns.length > 0;

  return (
    <div className="grid gap-4 lg:grid-cols-[1.2fr_0.85fr]">
      <Card className="space-y-8">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-muted">{getGreeting()}</p>
          <h2 className="mt-2 max-w-xl text-3xl font-semibold leading-tight sm:text-4xl">
            Start here today.
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-muted">
            Begin with a quick check-in, then continue your next session if you want a little more clarity.
          </p>
        </div>

        <section className="space-y-5 rounded-[28px] border border-border bg-panelAlt p-5 sm:p-6">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-muted">Today&apos;s Focus</p>
            <h3 className="mt-2 text-xl font-medium sm:text-2xl">Two small steps are enough.</h3>
            <p className="mt-2 text-sm leading-6 text-muted">
              You do not need a perfect answer or a long session. Just notice where you are, then take the next step.
            </p>
          </div>
          <div className="grid gap-4">
            <div className="rounded-[24px] border border-border/80 bg-panel/70 p-4">
              <p className="text-sm uppercase tracking-[0.18em] text-muted">Step 1</p>
              <h4 className="mt-2 text-lg font-medium">Daily Pulse</h4>
              <p className="mt-2 text-sm leading-6 text-muted">
                {checkIns.length === 0
                  ? "Your first check-in creates the baseline for mood, energy, and stress."
                  : "A quick check-in helps you notice what is different today."}
              </p>
              <ButtonLink href="/today/check-in" className="mt-4 w-full sm:w-auto">
                {checkIns.length === 0 ? "Start Check-In" : "Check In Again"}
              </ButtonLink>
            </div>

            <div className="rounded-[24px] border border-border/80 bg-panel/70 p-4">
              <p className="text-sm uppercase tracking-[0.18em] text-muted">Step 2</p>
              <h4 className="mt-2 text-lg font-medium">Foundation 30</h4>
              <p className="mt-2 text-base text-text">Session {nextSession.order}: {nextSession.title}</p>
              <p className="mt-2 text-sm leading-6 text-muted">
                Recommended pace: one session per day. Continue now if you want a few more minutes of reflection.
              </p>
              <ButtonLink href={`/today/session/${nextSession.order}`} className="mt-4 w-full sm:w-auto">
                {completions.length === 0 ? "Start Foundation 30" : "Continue Session"}
              </ButtonLink>
            </div>
          </div>
        </section>
      </Card>

      <Card className="space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-muted">Progress Summary</p>
          <h3 className="mt-2 text-xl font-medium sm:text-2xl">Your rhythm so far.</h3>
        </div>
        <div className="grid gap-4">
          <div className="rounded-[28px] border border-border bg-panelAlt p-5">
            <p className="text-sm text-muted">Sessions completed</p>
            <p className="mt-3 text-3xl font-semibold sm:text-4xl">{completions.length}</p>
          </div>
          <div className="rounded-[28px] border border-border bg-panelAlt p-5">
            <p className="text-sm text-muted">Daily check-ins completed</p>
            <p className="mt-3 text-3xl font-semibold sm:text-4xl">{checkIns.length}</p>
          </div>
          {!hasActivity ? (
            <div className="rounded-[28px] border border-dashed border-border bg-panelAlt p-5 text-sm leading-7 text-muted">
              Progress appears here after your first check-in or guided session.
            </div>
          ) : (
            <div className="rounded-[28px] border border-border bg-panelAlt p-5 text-sm leading-7 text-muted">
              Small daily entries matter more than long bursts. Keep the pace steady.
            </div>
          )}
          <ButtonLink href="/progress" variant="secondary">
            View Progress
          </ButtonLink>
        </div>
      </Card>
    </div>
  );
}
