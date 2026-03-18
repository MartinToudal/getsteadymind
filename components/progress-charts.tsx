import { Card } from "@/components/card";
import { formatDate } from "@/lib/utils";

type DataPoint = { date: string; value: number };

function Sparkline({
  data,
  maxValue,
  levels,
}: {
  data: DataPoint[];
  maxValue: number;
  levels: string[];
}) {
  if (data.length === 0) {
    return <div className="rounded-3xl border border-dashed border-border p-6 text-sm text-muted">No data yet.</div>;
  }

  const width = 300;
  const height = 100;
  const latestPoint = data[data.length - 1];
  const points = data
    .map((point, index) => {
      const x = data.length === 1 ? width / 2 : (index / (data.length - 1)) * width;
      const y = height - (point.value / maxValue) * (height - 10) - 5;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 text-xs text-muted">
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-border bg-panelAlt px-3 py-1 text-text">
            Latest: {levels[Math.max(0, latestPoint.value - 1)]}
          </span>
        </div>
        <div className="hidden items-center gap-2 sm:flex">
          {levels.map((level) => (
            <span key={level}>{level}</span>
          ))}
        </div>
      </div>
      <div className="flex gap-4">
        <div className="hidden min-h-[100px] flex-col justify-between text-[11px] uppercase tracking-[0.18em] text-muted sm:flex">
          {levels
            .slice()
            .reverse()
            .map((level) => (
              <span key={level}>{level}</span>
            ))}
        </div>
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full overflow-visible">
          <polyline fill="none" stroke="#8ccfb0" strokeWidth="3" points={points} />
        </svg>
      </div>
      <div className="flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.18em] text-muted sm:hidden">
        {levels.map((level) => (
          <span key={level}>{level}</span>
        ))}
      </div>
      <div className="flex items-center justify-between text-xs text-muted">
        <span>{formatDate(data[0].date)}</span>
        <span>{formatDate(data[data.length - 1].date)}</span>
      </div>
    </div>
  );
}

function getLatestMoodLabel(value: number) {
  if (value <= 2) return "Low";
  if (value === 3) return "Neutral";
  return "High";
}

export function ProgressCharts({
  moodTrend,
  energyTrend,
  stressTrend,
}: {
  moodTrend: DataPoint[];
  energyTrend: DataPoint[];
  stressTrend: DataPoint[];
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card className="space-y-4">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-muted">Mood trend</p>
          <h2 className="mt-2 text-xl font-medium">Emotional baseline</h2>
        </div>
        <Sparkline
          data={moodTrend}
          maxValue={5}
          levels={[
            "Very low",
            "Low",
            "Neutral",
            "Good",
            "Great",
          ]}
        />
        {moodTrend.length > 0 ? (
          <p className="text-sm text-muted">Mood right now reads as {getLatestMoodLabel(moodTrend[moodTrend.length - 1].value)}.</p>
        ) : null}
      </Card>
      <Card className="space-y-4">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-muted">Energy trend</p>
          <h2 className="mt-2 text-xl font-medium">Available capacity</h2>
        </div>
        <Sparkline data={energyTrend} maxValue={3} levels={["Low", "Medium", "High"]} />
      </Card>
      <Card className="space-y-4">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-muted">Stress trend</p>
          <h2 className="mt-2 text-xl font-medium">Current pressure</h2>
        </div>
        <Sparkline data={stressTrend} maxValue={3} levels={["Low", "Medium", "High"]} />
      </Card>
    </div>
  );
}
