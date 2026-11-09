import React from "react";

// Two-pen trend with the good operating band of the first pen shaded.
// pens: [{ key, label, unit, min, max, lo, hi, color, dec }]
const W = 600;
const H = 150;

const Trend = ({ title, history, pens, windowMin = 120, now }) => {
  const tEnd = Math.max(now, windowMin * 60);
  const tStart = tEnd - windowMin * 60;
  const pts = history.filter((h) => h.t >= tStart);
  const xOf = (t) => ((t - tStart) / (tEnd - tStart)) * W;
  const yOf = (v, p) => H - ((Math.min(p.max, Math.max(p.min, v)) - p.min) / (p.max - p.min)) * H;
  const main = pens[0];

  return (
    <figure className="ks-trend">
      <figcaption>
        <span className="ks-trend-title">{title}</span>
        <span className="ks-trend-legend">
          {pens.map((p) => {
            const last = pts.length ? pts[pts.length - 1][p.key] : null;
            return (
              <span key={p.key} className="ks-pen">
                <i style={{ background: p.color }} />
                {p.label} <b>{last == null ? "–" : last.toFixed(p.dec ?? 0)}</b> {p.unit}
              </span>
            );
          })}
        </span>
      </figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" role="img" aria-label={title}>
        <rect
          x="0"
          width={W}
          y={yOf(main.hi, main)}
          height={Math.max(0, yOf(main.lo, main) - yOf(main.hi, main))}
          className="ks-band"
        />
        {[0.25, 0.5, 0.75].map((f) => (
          <line key={f} x1={W * f} x2={W * f} y1="0" y2={H} className="ks-grid" />
        ))}
        {pens.map((p) =>
          pts.length > 1 ? (
            <polyline
              key={p.key}
              fill="none"
              stroke={p.color}
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
              strokeLinejoin="round"
              points={pts.map((h) => `${xOf(h.t).toFixed(1)},${yOf(h[p.key], p).toFixed(1)}`).join(" ")}
            />
          ) : null
        )}
      </svg>
      <div className="ks-trend-axis">
        <span>
          {main.min}–{main.max} {main.unit}
        </span>
        <span>last {windowMin} min</span>
      </div>
    </figure>
  );
};

export default Trend;
