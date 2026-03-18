import { Card } from "@/components/card";
import { ProgressCharts } from "@/components/progress-charts";
import { ButtonLink } from "@/components/button";
import { getProgressData, requireUser } from "@/lib/server-data";

export default async function ProgressPage() {
  const user = await requireUser();
  const progress = await getProgressData(user.id);
  const hasProgress = progress.sessionsCompleted > 0 || progress.checkInsCompleted > 0;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <p className="text-sm uppercase tracking-[0.24em] text-muted">Sessions completed</p>
          <p className="mt-4 text-5xl font-semibold">{progress.sessionsCompleted}</p>
        </Card>
        <Card>
          <p className="text-sm uppercase tracking-[0.24em] text-muted">Daily check-ins completed</p>
          <p className="mt-4 text-5xl font-semibold">{progress.checkInsCompleted}</p>
        </Card>
      </div>
      {hasProgress ? (
        <ProgressCharts
          moodTrend={progress.moodTrend}
          energyTrend={progress.energyTrend}
          stressTrend={progress.stressTrend}
        />
      ) : (
        <Card className="space-y-4">
          <p className="text-sm uppercase tracking-[0.24em] text-muted">No progress yet</p>
          <h2 className="text-2xl font-medium">Your trends appear after the first entries.</h2>
          <p className="max-w-2xl text-sm leading-7 text-muted">
            Complete one Daily Pulse and one guided session to start building a useful picture of how you feel over time.
          </p>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/today/check-in">Start Check-In</ButtonLink>
            <ButtonLink href="/today" variant="secondary">
              Open Today
            </ButtonLink>
          </div>
        </Card>
      )}
    </div>
  );
}
