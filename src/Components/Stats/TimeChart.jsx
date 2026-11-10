import React, { useState } from "react";

// Visits over the period. For each day (or hour) the light bar is the page
// views and the dark bar inside it is the visitors who made them.
// points: [{ key, label, tip, views, visitors }]
const W = 1000;
const H = 200;

// Round the top of the scale up to a tidy number: 7 -> 8, 23 -> 25, 130 -> 150
const niceTop = (max) => {
  if (max <= 4) return 4;
  const unit = 10 ** Math.floor(Math.log10(max));
  const steps = [1, 1.5, 2, 2.5, 4, 5, 8, 10];
  return steps.map((s) => s * unit).find((v) => v >= max);
};

const TimeChart = ({ title, points }) => {
  const [hover, setHover] = useState(null);

  const top = niceTop(Math.max(1, ...points.map((p) => p.views)));
  const slot = W / points.length;
  const bar = Math.max(1, slot * 0.72);
  const yOf = (v) => H - (v / top) * H;
  const shown = hover != null ? points[hover] : null;
  const totalViews = points.reduce((sum, p) => sum + p.views, 0);

  // About six evenly spread labels under the chart
  const every = Math.max(1, Math.ceil(points.length / 6));
  const ticks = points.filter((_, i) => i % every === 0);

  const onMove = (e) => {
    const box = e.currentTarget.getBoundingClientRect();
    const i = Math.floor(((e.clientX - box.left) / box.width) * points.length);
    setHover(Math.max(0, Math.min(points.length - 1, i)));
  };

  return (
    <figure className="st-panel st-chart">
      <figcaption>
        <h2>{title}</h2>
        <span className="st-legend">
          <span><i className="st-key-views" /> Page views</span>
          <span><i className="st-key-visitors" /> Visitors</span>
        </span>
      </figcaption>

      <p className="st-readout" aria-live="polite">
        {shown ? (
          <>
            <b>{shown.tip}</b> {shown.views} page {shown.views === 1 ? "view" : "views"}, {shown.visitors}{" "}
            {shown.visitors === 1 ? "visitor" : "visitors"}
          </>
        ) : totalViews === 0 ? (
          "No visits in this period."
        ) : (
          "Point at a bar to read its numbers."
        )}
      </p>

      <div className="st-plot">
        <div className="st-yaxis" aria-hidden="true">
          <span>{top}</span>
          <span>{top / 2}</span>
          <span>0</span>
        </div>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
          role="img"
          aria-label={`${title}: ${totalViews} page views in total`}
          onMouseMove={onMove}
          onMouseLeave={() => setHover(null)}
        >
          {[0, 0.5].map((f) => (
            <line key={f} x1="0" x2={W} y1={H * f} y2={H * f} className="st-gridline" vectorEffect="non-scaling-stroke" />
          ))}
          {hover != null && <rect x={hover * slot} width={slot} y="0" height={H} className="st-hoverband" />}
          {points.map((p, i) => {
            const x = i * slot + (slot - bar) / 2;
            return (
              <g key={p.key}>
                {p.views > 0 && <rect x={x} width={bar} y={yOf(p.views)} height={H - yOf(p.views)} className="st-bar-views" />}
                {p.visitors > 0 && (
                  <rect x={x} width={bar} y={yOf(p.visitors)} height={H - yOf(p.visitors)} className="st-bar-visitors" />
                )}
              </g>
            );
          })}
          <line x1="0" x2={W} y1={H} y2={H} className="st-baseline" vectorEffect="non-scaling-stroke" />
        </svg>
      </div>
      <div className="st-xaxis" aria-hidden="true">
        {ticks.map((p) => (
          <span key={p.key}>{p.label}</span>
        ))}
      </div>
    </figure>
  );
};

export default TimeChart;
