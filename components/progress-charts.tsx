import { Card } from "@/components/card";
import { formatDate } from "@/lib/utils";

type DataPoint = { date: string; value: number };

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
  const direction = getDirectionLabel(data);

  return `${subject} is ${latestLabel} right now and ${direction} compared with your last entry.`;
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
        <Sparkline data={moodTrend} maxValue={5} />
        {moodTrend.length > 0 ? <p className="text-sm leading-6 text-muted">{buildSummary(moodTrend, getMoodLabel, "Mood")}</p> : null}
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
  );
}
