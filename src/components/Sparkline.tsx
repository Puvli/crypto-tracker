export default function Sparkline({ data, positive }: { data: number[]; positive: boolean }) {
  const w = 120;
  const h = 40;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const step = w / (data.length - 1);

  const points = data.map((v, i) => `${i * step},${h - ((v - min) / range) * h}`).join(' ');

  return (
    <svg className="sparkline-mini" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <polyline
        fill="none"
        stroke={positive ? 'var(--green)' : 'var(--red)'}
        strokeWidth="1.5"
        points={points}
      />
    </svg>
  );
}
