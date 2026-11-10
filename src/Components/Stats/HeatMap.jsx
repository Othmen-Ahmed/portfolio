import React from "react";
import { DAYS } from "./format";

// When people visit: one square per hour of the week, darker = more page views.
// cells: [{ dow (0 = Sunday), hour, views }], already on the viewer's clock
const ORDER = [1, 2, 3, 4, 5, 6, 0]; // Monday first

const HeatMap = ({ cells }) => {
  const grid = new Map(cells.map((c) => [`${c.dow}-${c.hour}`, c.views]));
  const max = Math.max(1, ...cells.map((c) => c.views));
  const peak = cells.reduce((best, c) => (!best || c.views > best.views ? c : best), null);
  const hours = Array.from({ length: 24 }, (_, h) => h);

  return (
    <section className="st-panel">
      <h2>When people visit</h2>
      <div className="st-heat" role="img" aria-label="Page views by weekday and hour">
        <span />
        {hours.map((h) => (
          <span key={h} className="st-heat-hour">{h % 6 === 0 ? String(h).padStart(2, "0") : ""}</span>
        ))}
        {ORDER.map((dow) => (
          <React.Fragment key={dow}>
            <span className="st-heat-day">{DAYS[dow].slice(0, 3)}</span>
            {hours.map((h) => {
              const v = grid.get(`${dow}-${h}`) || 0;
              return (
                <span
                  key={h}
                  className="st-heat-cell"
                  style={v ? { background: `rgba(15, 53, 97, ${0.15 + (0.85 * v) / max})` } : undefined}
                  title={`${DAYS[dow]} ${String(h).padStart(2, "0")}:00, ${v} page ${v === 1 ? "view" : "views"}`}
                />
              );
            })}
          </React.Fragment>
        ))}
      </div>
      <p className="ks-hint">
        {peak
          ? `Busiest hour: ${DAYS[peak.dow]} from ${String(peak.hour).padStart(2, "0")}:00, ${peak.views} page ${peak.views === 1 ? "view" : "views"}. `
          : "No visits in this period. "}
        Hours are on your own clock.
      </p>
    </section>
  );
};

export default HeatMap;
