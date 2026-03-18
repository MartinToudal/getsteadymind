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
      </Card>
      <Card className="space-y-4">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-muted">Energy trend</p>
          <h2 className="mt-2 text-xl font-medium">Available capacity</h2>
        </div>
        <Sparkline data={energyTrend} maxValue={3} />
      </Card>
      <Card className="space-y-4">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-muted">Stress trend</p>
          <h2 className="mt-2 text-xl font-medium">Current pressure</h2>
        </div>
        <Sparkline data={stressTrend} maxValue={3} />
      </Card>
    </div>
  );
}
