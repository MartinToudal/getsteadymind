import { ButtonLink } from "@/components/button";
import { Card } from "@/components/card";
import { getDashboardData, requireUser } from "@/lib/server-data";
import { getGreeting } from "@/lib/utils";

export default async function HomePage() {
  const user = await requireUser();
  const { completions, checkIns, nextSession } = await getDashboardData(user.id);
  const hasActivity = completions.length > 0 || checkIns.length > 0;

  return (
    <div className="grid gap-4 lg:grid-cols-[1.25fr_0.9fr]">
      <Card className="space-y-8">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-muted">{getGreeting()}</p>
          <h2 className="mt-2 max-w-xl text-4xl font-semibold leading-tight">
            Build clarity and momentum one honest reflection at a time.
          </h2>
          {!hasActivity ? (
            <p className="mt-4 max-w-xl text-sm leading-7 text-muted">
              Start with one check-in or one guided session today. A few honest lines are enough.
            </p>
          ) : null}
        </div>

        <section className="space-y-4 rounded-[28px] border border-border bg-panelAlt p-6">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-muted">Daily Pulse</p>
            <h3 className="mt-2 text-2xl font-medium">Two minutes to notice where you are.</h3>
            {checkIns.length === 0 ? (
              <p className="mt-2 text-sm leading-6 text-muted">
                Your first check-in creates the baseline for mood, energy, and stress trends.
              </p>
            ) : null}
          </div>
          <ButtonLink href="/today/check-in" className="w-full sm:w-auto">
            {checkIns.length === 0 ? "Start Check-in" : "Check In Again"}
          </ButtonLink>
        </section>

        <section className="space-y-4 rounded-[28px] border border-border bg-panelAlt p-6">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-muted">Next Session</p>
            <h3 className="mt-2 text-2xl font-medium">Foundation 30</h3>
            <p className="mt-2 text-lg text-text">
              Session {nextSession.order}: {nextSession.title}
            </p>
            {completions.length === 0 ? (
              <p className="mt-2 text-sm leading-6 text-muted">
                Recommended pace: one session per day. You can keep going if it still feels helpful.
              </p>
            ) : null}
          </div>
          <ButtonLink href={`/today/session/${nextSession.order}`} className="w-full sm:w-auto">
            {completions.length === 0 ? "Start Foundation 30" : "Continue"}
          </ButtonLink>
        </section>
      </Card>

      <Card className="space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-muted">Progress Summary</p>
          <h3 className="mt-2 text-2xl font-medium">Your consistency so far.</h3>
        </div>
        <div className="grid gap-4">
          <div className="rounded-[28px] border border-border bg-panelAlt p-5">
            <p className="text-sm text-muted">Sessions completed</p>
            <p className="mt-3 text-4xl font-semibold">{completions.length}</p>
          </div>
          <div className="rounded-[28px] border border-border bg-panelAlt p-5">
            <p className="text-sm text-muted">Daily check-ins completed</p>
            <p className="mt-3 text-4xl font-semibold">{checkIns.length}</p>
          </div>
          {!hasActivity ? (
            <div className="rounded-[28px] border border-dashed border-border bg-panelAlt p-5 text-sm leading-7 text-muted">
              Progress appears here after your first check-in or guided session.
            </div>
          ) : null}
          <ButtonLink href="/progress" variant="secondary">
            View Progress
          </ButtonLink>
        </div>
      </Card>
    </div>
  );
}
