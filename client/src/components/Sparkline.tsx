interface SparklineProps {
  data: number[];
  positive: boolean;
}

export function Sparkline({ data, positive }: SparklineProps) {
  if (!data || data.length < 2) return null;

  const sampled = data.filter((_, i) => i % Math.ceil(data.length / 20) === 0);
  const min = Math.min(...sampled);
  const max = Math.max(...sampled);
  const range = max - min || 1;

  const width = 60;
  const height = 30;
  const padding = 2;

  const points = sampled
    .map((val, i) => {
      const x = padding + (i / (sampled.length - 1)) * (width - 2 * padding);
      const y = height - padding - ((val - min) / range) * (height - 2 * padding);
      return `${x},${y}`;
    })
    .join(' ');

  const color = positive ? '#26a69a' : '#ef5350';

  return (
    <svg className="sparkline" viewBox={`0 0 ${width} ${height}`}>
      <polyline fill="none" stroke={color} strokeWidth="1.5" points={points} />
    </svg>
  );
}
