import { ButtonLink } from "@/components/button";
import { Card } from "@/components/card";
import { getDashboardData, requireUser } from "@/lib/server-data";
import { getGreeting } from "@/lib/utils";

export default async function HomePage() {
  const user = await requireUser();
  const { completions, checkIns, nextSession } = await getDashboardData(user.id);
  const hasActivity = completions.length > 0 || checkIns.length > 0;
  const isStartingFresh = !hasActivity;

  return (
    <div className="grid gap-4 lg:grid-cols-[1.2fr_0.85fr]">
      <Card className="space-y-8">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-muted">{getGreeting()}</p>
          <h2 className="mt-2 max-w-xl text-3xl font-semibold leading-tight sm:text-4xl">
            {isStartingFresh ? "Start here today." : "Keep today simple."}
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-muted">
            {isStartingFresh
              ? "Begin with a quick check-in, then continue your first Foundation 30 session if you want a little more clarity."
              : "If you only do one thing today, do your Daily Pulse. If you want a little more depth, continue your next session after that."}
          </p>
        </div>

        <section className="space-y-5 rounded-[28px] border border-border bg-panelAlt p-5 sm:p-6">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-muted">Today&apos;s Plan</p>
            <h3 className="mt-2 text-xl font-medium sm:text-2xl">Two small steps are enough.</h3>
            <p className="mt-2 text-sm leading-6 text-muted">
              Start with awareness. Then decide whether today is a check-in day or a deeper reflection day.
            </p>
          </div>
          <div className="grid gap-4">
            <div className="rounded-[24px] border border-accent/20 bg-panel/70 p-4">
              <p className="text-sm uppercase tracking-[0.18em] text-muted">Start Here</p>
              <h4 className="mt-2 text-lg font-medium">Daily Pulse</h4>
              <p className="mt-2 text-sm leading-6 text-muted">
                {checkIns.length === 0
                  ? "Your first check-in creates the baseline for mood, energy, and stress."
                  : "A quick check-in helps you notice where you are before the day starts pulling at you."}
              </p>
              <p className="mt-3 text-sm leading-6 text-text">
                {checkIns.length === 0
                  ? "This is the easiest way to begin."
                  : "If you only do one thing today, do this first."}
              </p>
              <ButtonLink href="/today/check-in" className="mt-4 w-full sm:w-auto">
                {checkIns.length === 0 ? "Start Check-In" : "Check In Again"}
              </ButtonLink>
            </div>

            <div className="rounded-[24px] border border-border/80 bg-panel/70 p-4">
              <p className="text-sm uppercase tracking-[0.18em] text-muted">Then, If You Want More</p>
              <h4 className="mt-2 text-lg font-medium">Foundation 30</h4>
              <p className="mt-2 text-base text-text">Session {nextSession.order}: {nextSession.title}</p>
              <p className="mt-2 text-sm leading-6 text-muted">
                Recommended pace: one session per day. Continue when you want 5 to 10 minutes of deeper reflection.
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
          <p className="text-sm uppercase tracking-[0.24em] text-muted">At A Glance</p>
          <h3 className="mt-2 text-xl font-medium sm:text-2xl">What matters today.</h3>
        </div>
        <div className="grid gap-4">
          <div className="rounded-[28px] border border-border bg-panelAlt p-5">
            <p className="text-sm uppercase tracking-[0.18em] text-muted">Primary Move</p>
            <p className="mt-3 text-lg leading-7 text-text">Start with a Daily Pulse, then decide whether today also wants a guided session.</p>
          </div>
          <div className="rounded-[28px] border border-border bg-panelAlt p-5">
            <p className="text-sm uppercase tracking-[0.18em] text-muted">Next Session</p>
            <p className="mt-3 text-lg font-medium text-text">Foundation 30</p>
            <p className="mt-1 text-sm leading-6 text-muted">Session {nextSession.order}: {nextSession.title}</p>
          </div>
          {!hasActivity ? (
            <div className="rounded-[28px] border border-dashed border-border bg-panelAlt p-5 text-sm leading-7 text-muted">
              Your progress starts after the first check-in or guided session.
            </div>
          ) : (
            <div className="rounded-[28px] border border-border bg-panelAlt p-5">
              <p className="text-sm uppercase tracking-[0.18em] text-muted">Your Rhythm</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-muted">Daily check-ins completed</p>
                  <p className="mt-2 text-3xl font-semibold sm:text-4xl">{checkIns.length}</p>
                </div>
                <div>
                  <p className="text-sm text-muted">Sessions completed</p>
                  <p className="mt-2 text-3xl font-semibold sm:text-4xl">{completions.length}</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-7 text-muted">
                Small daily entries matter more than long bursts. Keep the pace steady.
              </p>
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
