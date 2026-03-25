import { Card } from "@/components/card";
import { formatDate } from "@/lib/utils";

type DataPoint = { date: string; value: number };

function toDayKey(date: string) {
  return new Date(date).toISOString().slice(0, 10);
}

function getRecentCalendarDayKeys(days: number) {
  const keys: string[] = [];
  const today = new Date();

  for (let index = 0; index < days; index += 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - index);
    keys.push(toDayKey(date.toISOString()));
  }

  return keys;
}

function getDayStreak(daySet: Set<string>) {
  let streak = 0;
  const today = new Date();

  while (true) {
    const date = new Date(today);
    date.setDate(today.getDate() - streak);
    const key = toDayKey(date.toISOString());

    if (!daySet.has(key)) {
      break;
    }

    streak += 1;
  }

  return streak;
}

function Sparkline({ data, maxValue }: { data: DataPoint[]; maxValue: number }) {
  if (data.length === 0) {
    return <div className="rounded-3xl border border-dashed border-border p-6 text-sm text-muted">No data yet.</div>;
  }

  const width = 300;
  const height = 100;
  const points = data
    .map((point, index) => {
      const x = data.length === 1 ? width / 2 : (index / (data.length - 1)) * width;
      const y = height - (point.value / maxValue) * (height - 10) - 5;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="space-y-3">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full overflow-visible">
        <polyline fill="none" stroke="#8ccfb0" strokeWidth="3" points={points} />
      </svg>
      <div className="flex items-center justify-between text-xs text-muted">
        <span>{formatDate(data[0].date)}</span>
        <span>{formatDate(data[data.length - 1].date)}</span>
      </div>
    </div>
  );
}

function getDirectionLabel(data: DataPoint[]) {
  if (data.length < 2) {
    return "steady";
  }

  const latestValue = data[data.length - 1].value;
  const previousValue = data[data.length - 2].value;

  if (latestValue > previousValue) return "rising";
  if (latestValue < previousValue) return "falling";
  return "steady";
}

function getDirectionPhrase(data: DataPoint[]) {
  const direction = getDirectionLabel(data);

  if (direction === "rising") return "trending up";
  if (direction === "falling") return "trending down";
  return "holding steady";
}

function getMoodLabel(value: number) {
  if (value === 1) return "very low";
  if (value === 2) return "low";
  if (value === 3) return "neutral";
  if (value === 4) return "good";
  return "great";
}

function getThreeLevelLabel(value: number) {
  if (value === 1) return "low";
  if (value === 2) return "medium";
  return "high";
}

function buildSummary(data: DataPoint[], getLabel: (value: number) => string, subject: string) {
  if (data.length === 0) {
    return null;
  }

  const latest = data[data.length - 1];
  const latestLabel = getLabel(latest.value);
  const direction = getDirectionPhrase(data);

  return `${subject} is ${latestLabel} right now and ${direction} compared with your last entry.`;
}

function buildProgressSnapshot({
  moodTrend,
  energyTrend,
  stressTrend,
}: {
  moodTrend: DataPoint[];
  energyTrend: DataPoint[];
  stressTrend: DataPoint[];
}) {
  if (moodTrend.length === 0 && energyTrend.length === 0 && stressTrend.length === 0) {
    return null;
  }

  const parts: string[] = [];

  if (moodTrend.length > 0) {
    const latestMood = getMoodLabel(moodTrend[moodTrend.length - 1].value);
    parts.push(`Mood feels ${latestMood}`);
  }

  if (energyTrend.length > 0) {
    const latestEnergy = getThreeLevelLabel(energyTrend[energyTrend.length - 1].value);
    parts.push(`energy is ${latestEnergy}`);
  }

  if (stressTrend.length > 0) {
    const latestStress = getThreeLevelLabel(stressTrend[stressTrend.length - 1].value);
    parts.push(`stress is ${latestStress}`);
  }

  if (parts.length === 0) {
    return null;
  }

  return `${parts.join(", ")}.`;
}

function average(values: number[]) {
  if (values.length === 0) {
    return 0;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function buildKeyInsights({
  moodTrend,
  energyTrend,
  stressTrend,
}: {
  moodTrend: DataPoint[];
  energyTrend: DataPoint[];
  stressTrend: DataPoint[];
}) {
  const insights: string[] = [];

  const recentMood = moodTrend.slice(-3).map((point) => point.value);
  const recentEnergy = energyTrend.slice(-3).map((point) => point.value);
  const recentStress = stressTrend.slice(-3).map((point) => point.value);

  if (recentStress.length >= 3 && recentStress.every((value) => value >= 2)) {
    insights.push("Stress has stayed elevated across your last three check-ins.");
  } else if (recentStress.length >= 3 && recentStress.every((value) => value === 1)) {
    insights.push("Stress has stayed low across your last three check-ins.");
  }

  if (recentEnergy.length >= 3 && recentEnergy.every((value) => value === 1)) {
    insights.push("Energy has been low for three check-ins in a row.");
  } else if (recentEnergy.length >= 3 && recentEnergy.every((value) => value >= 2)) {
    insights.push("Energy has stayed fairly available across your recent check-ins.");
  }

  if (moodTrend.length >= 4) {
    const earlierMood = moodTrend.slice(-6, -3).map((point) => point.value);
    const recentMoodAverage = average(recentMood);
    const earlierMoodAverage = average(earlierMood);

    if (earlierMood.length >= 2 && recentMoodAverage >= earlierMoodAverage + 0.5) {
      insights.push("Your mood looks better in the most recent check-ins than it did a few entries ago.");
    } else if (earlierMood.length >= 2 && recentMoodAverage <= earlierMoodAverage - 0.5) {
      insights.push("Your mood has dipped compared with a few check-ins ago.");
    }
  }

  if (recentMood.length >= 3 && recentStress.length >= 3) {
    const moodDirection = getDirectionLabel(moodTrend);
    const stressDirection = getDirectionLabel(stressTrend);

    if (moodDirection === "rising" && stressDirection === "falling") {
      insights.push("Mood is rising while stress is easing, which looks like a healthy shift.");
    } else if (moodDirection === "falling" && stressDirection === "rising") {
      insights.push("Mood is slipping while stress is rising, which may be worth paying attention to.");
    }
  }

  return insights.slice(0, 3);
}

function buildPracticePatterns({
  moodTrend,
  energyTrend,
  stressTrend,
  sessionCompletionDates,
}: {
  moodTrend: DataPoint[];
  energyTrend: DataPoint[];
  stressTrend: DataPoint[];
  sessionCompletionDates: string[];
}) {
  const patterns: string[] = [];
  const sessionDays = new Set(sessionCompletionDates.map(toDayKey));
  const checkInDays = new Set(moodTrend.map((point) => toDayKey(point.date)));
  const recentCalendarDays = getRecentCalendarDayKeys(7);
  const recentCheckInCount = recentCalendarDays.filter((day) => checkInDays.has(day)).length;
  const checkInStreak = getDayStreak(checkInDays);

  if (checkInStreak >= 2) {
    patterns.push(`You have checked in for ${checkInStreak} days in a row. That kind of consistency makes the patterns easier to trust.`);
  } else if (recentCheckInCount >= 4) {
    patterns.push(`You checked in on ${recentCheckInCount} of the last 7 days, which suggests a fairly steady rhythm.`);
  } else if (recentCheckInCount >= 2) {
    patterns.push(`You checked in on ${recentCheckInCount} of the last 7 days. A little more consistency may make patterns easier to spot.`);
  }

  const recentSessionCount = recentCalendarDays.filter((day) => sessionDays.has(day)).length;
  const sessionStreak = getDayStreak(sessionDays);
  if (sessionStreak >= 2) {
    patterns.push(`You have completed guided sessions for ${sessionStreak} days in a row. That is a strong practice rhythm.`);
  } else if (recentSessionCount >= 2) {
    patterns.push(`You completed guided sessions on ${recentSessionCount} of the last 7 days. That is enough to start turning reflection into practice.`);
  }

  if (moodTrend.length >= 4 && sessionDays.size > 0) {
    const sessionDayMood = moodTrend
      .filter((point) => sessionDays.has(toDayKey(point.date)))
      .map((point) => point.value);
    const nonSessionDayMood = moodTrend
      .filter((point) => !sessionDays.has(toDayKey(point.date)))
      .map((point) => point.value);

    if (sessionDayMood.length >= 2 && nonSessionDayMood.length >= 2) {
      const moodDifference = average(sessionDayMood) - average(nonSessionDayMood);

      if (moodDifference >= 0.5) {
        patterns.push("Days that include a guided session also tend to come with better mood. That may be a pattern worth protecting.");
      } else if (moodDifference <= -0.5) {
        patterns.push("Guided sessions seem to happen more on heavier days, which may mean you are already using them as support when needed.");
      }
    }
  }

  if (stressTrend.length >= 4 && sessionDays.size > 0) {
    const sessionDayStress = stressTrend
      .filter((point) => sessionDays.has(toDayKey(point.date)))
      .map((point) => point.value);
    const nonSessionDayStress = stressTrend
      .filter((point) => !sessionDays.has(toDayKey(point.date)))
      .map((point) => point.value);

    if (sessionDayStress.length >= 2 && nonSessionDayStress.length >= 2) {
      const stressDifference = average(sessionDayStress) - average(nonSessionDayStress);

      if (stressDifference <= -0.4) {
        patterns.push("Stress tends to be lower on days when you complete a guided session. That may be one of the ways the practice is helping.");
      }
    }
  }

  if (patterns.length === 0 && energyTrend.length >= 3) {
    patterns.push("Keep adding a few more check-ins and sessions. The clearest patterns usually emerge once the rhythm has had a little more time.");
  }

  return patterns.slice(0, 3);
}

export function ProgressCharts({
  moodTrend,
  energyTrend,
  stressTrend,
  sessionCompletionDates,
}: {
  moodTrend: DataPoint[];
  energyTrend: DataPoint[];
  stressTrend: DataPoint[];
  sessionCompletionDates: string[];
}) {
  const snapshot = buildProgressSnapshot({ moodTrend, energyTrend, stressTrend });
  const insights = buildKeyInsights({ moodTrend, energyTrend, stressTrend });
  const practicePatterns = buildPracticePatterns({ moodTrend, energyTrend, stressTrend, sessionCompletionDates });

  return (
    <div className="space-y-4 sm:space-y-5">
      {snapshot ? (
        <Card className="space-y-3">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-muted">At a glance</p>
            <h2 className="mt-2 text-xl font-medium">Your current pattern.</h2>
          </div>
          <p className="text-sm leading-7 text-muted">{snapshot}</p>
        </Card>
      ) : null}
      {insights.length > 0 ? (
        <Card className="space-y-3">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-muted">Key insights</p>
            <h2 className="mt-2 text-xl font-medium">What stands out right now.</h2>
          </div>
          <div className="space-y-3">
            {insights.map((insight) => (
              <p key={insight} className="text-sm leading-7 text-muted">
                {insight}
              </p>
            ))}
          </div>
        </Card>
      ) : null}
      {practicePatterns.length > 0 ? (
        <Card className="space-y-3">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-muted">Practice patterns</p>
            <h2 className="mt-2 text-xl font-medium">What may be helping.</h2>
          </div>
          <div className="space-y-3">
            {practicePatterns.map((pattern) => (
              <p key={pattern} className="text-sm leading-7 text-muted">
                {pattern}
              </p>
            ))}
          </div>
        </Card>
      ) : null}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="space-y-4">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-muted">Mood trend</p>
            <h2 className="mt-2 text-xl font-medium">Emotional baseline</h2>
          </div>
          <Sparkline data={moodTrend} maxValue={5} />
          {moodTrend.length > 0 ? (
            <p className="text-sm leading-6 text-muted">{buildSummary(moodTrend, getMoodLabel, "Mood")}</p>
          ) : null}
        </Card>
        <Card className="space-y-4">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-muted">Energy trend</p>
            <h2 className="mt-2 text-xl font-medium">Available capacity</h2>
          </div>
          <Sparkline data={energyTrend} maxValue={3} />
          {energyTrend.length > 0 ? (
            <p className="text-sm leading-6 text-muted">{buildSummary(energyTrend, getThreeLevelLabel, "Energy")}</p>
          ) : null}
        </Card>
        <Card className="space-y-4">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-muted">Stress trend</p>
            <h2 className="mt-2 text-xl font-medium">Current pressure</h2>
          </div>
          <Sparkline data={stressTrend} maxValue={3} />
          {stressTrend.length > 0 ? (
            <p className="text-sm leading-6 text-muted">{buildSummary(stressTrend, getThreeLevelLabel, "Stress")}</p>
          ) : null}
        </Card>
      </div>
    </div>
  );
}
