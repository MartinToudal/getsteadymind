import { ButtonLink } from "@/components/button";
import { Card } from "@/components/card";
import { PHASE_DETAILS, PHASE_ORDER, type FoundationPhase } from "@/lib/program";
import { getProgramData, requireUser } from "@/lib/server-data";

export default async function ProgramPage() {
  const user = await requireUser();
  const sessions = await getProgramData(user.id);
  const completedCount = sessions.filter((session) => session.completedAt).length;
  const nextSession = sessions.find((session) => !session.completedAt) ?? sessions[sessions.length - 1];
  const latestCompletedAt = sessions
    .filter((session) => session.completedAt)
    .map((session) => session.completedAt as string)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0];
  const completedSessionToday = latestCompletedAt
    ? new Date(latestCompletedAt).toDateString() === new Date().toDateString()
    : false;

  return (
    <div className="space-y-6">
      <Card className="space-y-4">
        <p className="text-sm uppercase tracking-[0.24em] text-muted">Program</p>
        <h1 className="text-[2rem] font-semibold leading-tight sm:text-4xl">Foundation 30</h1>
        <p className="max-w-2xl text-sm leading-7 text-muted">
          A 30-session mental fitness program designed to help you notice what is true, build clarity, and turn reflection into direction.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-[24px] border border-border bg-panelAlt p-5">
            <p className="text-sm uppercase tracking-[0.18em] text-muted">The Method</p>
            <p className="mt-3 text-sm leading-7 text-muted">
              Foundation 30 moves through four stages: land in what is true, clear what is noisy, aim toward what matters, then move with intention.
            </p>
          </div>
          <div className="rounded-[24px] border border-border bg-panelAlt p-5">
            <p className="text-sm uppercase tracking-[0.18em] text-muted">Recommended Pace</p>
            <p className="mt-3 text-sm leading-7 text-muted">
              One session per day is still the best rhythm. The value comes from steady repetition, not speed.
            </p>
          </div>
        </div>
        {completedCount === 0 ? (
          <div className="rounded-[28px] border border-dashed border-border bg-panelAlt p-5 text-sm leading-7 text-muted">
            Start with Session 1 and treat the program as a daily rhythm. One session per day is the recommended pace, but you can continue if it still feels useful.
          </div>
        ) : null}
        {completedCount > 0 ? (
          <div className="rounded-[28px] border border-border bg-panelAlt p-5">
            <p className="text-sm uppercase tracking-[0.18em] text-muted">
              {completedSessionToday ? "Today" : "Recommended Today"}
            </p>
            <h2 className="mt-3 text-xl font-medium">
              {completedSessionToday ? "You have already completed one session today." : `Session ${nextSession.order} is your next recommended step.`}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-muted">
              {completedSessionToday
                ? "That is enough for today. Let it settle and come back tomorrow, unless it genuinely feels useful to keep going."
                : "The best rhythm is still one session per day. You can continue now, but there is no need to rush the program."}
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <ButtonLink href={`/today/session/${nextSession.order}`} className="w-full sm:w-auto">
                {completedSessionToday ? "Continue anyway" : "Start next session"}
              </ButtonLink>
              <ButtonLink href="/home" variant="secondary" className="w-full sm:w-auto">
                Back to Home
              </ButtonLink>
            </div>
          </div>
        ) : null}
      </Card>

      {PHASE_ORDER.map((phase) => (
        <Card key={phase} className="space-y-4">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-muted">{phase}</p>
            <h2 className="mt-2 text-2xl font-medium">
              {phase} phase
              <span className="ml-2 text-base font-normal text-muted">{PHASE_DETAILS[phase as FoundationPhase].label}</span>
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-muted">{PHASE_DETAILS[phase as FoundationPhase].purpose}</p>
            <p className="mt-2 text-sm text-text">{PHASE_DETAILS[phase as FoundationPhase].practice}</p>
          </div>
          <div className="grid gap-3">
            {sessions
              .filter((session) => session.phase === phase)
              .map((session) => (
                <div
                  key={session.id}
                  className="flex flex-col gap-4 rounded-[28px] border border-border bg-panelAlt p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="text-sm text-muted">Session {session.order}</p>
                    <h3 className="mt-1 text-lg">{session.title}</h3>
                    <p className="mt-2 text-sm text-muted">
                      {session.completedAt ? `Completed ${new Date(session.completedAt).toLocaleDateString("en-US")}` : "Not completed yet"}
                    </p>
                    {!session.completedAt && session.id === nextSession.id ? (
                      <p className="mt-2 text-sm text-text">Recommended next session.</p>
                    ) : null}
                  </div>
                  <ButtonLink
                    href={`/today/session/${session.order}`}
                    variant={session.completedAt ? "secondary" : "primary"}
                    className="w-full sm:w-auto"
                  >
                    {session.completedAt ? "Revisit" : "Start"}
                  </ButtonLink>
                </div>
              ))}
          </div>
        </Card>
      ))}
    </div>
  );
}
