import React, { useState } from "react";
import { STOP_MARKS, STOP_WINDOW } from "../../sim/plant";

const TEMP_SERIES = [
  { key: "bzt", label: "Burning zone", color: "#c2410c", dash: "" },
  { key: "kilnInT", label: "Kiln inlet gas", color: "#0f766e", dash: "9 3 2 3" },
  { key: "calcT", label: "Calciner outlet", color: "#7c3aed", dash: "6 4" },
  { key: "cyc1T", label: "Cyclone 1 outlet", color: "#4b5563", dash: "2 3" },
];
const O2_SERIES = [
  { key: "o2", label: "Kiln inlet O₂", color: "#1d4ed8", dash: "" },
  { key: "o2Ph", label: "Preheater exit O₂", color: "#6b7280", dash: "6 4" },
];

const ROWS = [
  ["bzt", "Burning zone", "°C", 0],
  ["calcT", "Calciner outlet", "°C", 0],
  ["cyc1T", "Cyclone 1 outlet", "°C", 0],
  ["kilnInT", "Kiln inlet gas", "°C", 0],
  ["sat", "Secondary air", "°C", 0],
  ["o2", "Kiln inlet O₂", "%", 1],
  ["o2Ph", "Preheater exit O₂", "%", 1],
  ["co", "Preheater exit CO", "ppm", 0],
  ["nox", "Kiln inlet NOx", "ppm", 0],
  ["ugp", "Chamber 2 pressure", "mbar", 0],
];

// What to expect, from a full-load start with nothing else touched
const EXPLAIN = {
  fan: {
    see: "Draught is lost, so both coal feeders and the kiln feed trip with the fan. Both O₂ analysers climb to about 21 % within minutes (stagnant air) and CO and NOx fall to zero. Temperatures fall slowly because the lining holds the heat: the burning zone loses about 150 °C in the first hour and then cools at roughly 15–25 °C/h, while cyclone 1 outlet falls about 100 °C in the first hour.",
    todo: "Reset the trip and restart the fan at low speed, and keep the lining cooling below 40 °C/h. Restart order: fan, burner coal (burning zone must be above 600 °C), kiln feed, calciner coal.",
  },
  feed: {
    see: "The meal stops absorbing heat. Cyclone 1 outlet jumps about 60 °C within five minutes and alarms, the calciner coal trips, and the calciner outlet falls. Preheater exit O₂ rises to about 14 % because the calciner no longer burns its air. About 15 minutes later the kiln is empty and, with the burner still firing, the burning zone climbs 150–200 °C within an hour and NOx runs away.",
    todo: "Cut the burner coal quickly or restore the feed. Do not wait for the overheating alarm. Restore feed gently.",
  },
  kiln: {
    see: "The kiln stops turning, so the feed and the calciner coal trip, but the burner keeps firing on a stationary bed. NOx jumps, the burning zone climbs and the shell starts to bow. Torque falls to zero, secondary air collapses as clinker stops leaving the kiln, and the calciner and cyclone 1 behave as in a feed stop.",
    todo: "Cut the burner coal, then turn the kiln with the auxiliary drive as soon as you can (button on the kiln faceplate) and about every 30 minutes after that, until the main drive is back.",
  },
  fuelKiln: {
    see: "Flame-out. Kiln inlet O₂ rises to about 20 % within minutes and NOx collapses first, a warning before the temperature moves. With feed still running, the burning zone falls about 40 °C in 5 minutes and 180 °C in 15 minutes, the kiln flushes after about 20 minutes, and the reading keeps falling toward 900 °C. Preheater exit O₂ rises to about 10 % while the calciner keeps burning.",
    todo: "Cut the kiln feed and reduce the fan to hold the heat, then restart the feeder. Coal only ignites with the burning zone above 600 °C.",
  },
  fuelCalc: {
    see: "The calciner outlet falls about 190 °C in five minutes and calcination drops from 93 to about 63 %. Preheater exit O₂ jumps to 13–14 % because the tertiary air is no longer burnt. The under-calcined meal reaches the kiln about 15 minutes later: NOx falls first, then the burning zone sags by about 60 °C in an hour and 90 °C in two hours.",
    todo: "Restart the feeder. If the burning zone keeps falling, raise the burner coal.",
  },
  grate: {
    see: "Clinker piles up on a stationary bed. Chamber 2 pressure alarms within about 7 minutes and is at its limit by 30 minutes. Secondary air first rises (a deeper bed recovers more heat), then collapses as air channels through the bed: below 950 °C at 30 minutes and about 550 °C at an hour. NOx rises and then falls, the burning zone sags and the kiln flushes at about two hours.",
    todo: "Restart the grate. If it will not restart, cut the kiln feed and the fuel before the secondary air is lost.",
  },
};

const pad = (n) => String(n).padStart(2, "0");
const hhmm = (t) => `${pad(Math.floor(t / 3600))}:${pad(Math.floor((t % 3600) / 60))}`;

const Chart = ({ title, unit, series, rec, now, yMin, yMax, band }) => {
  const W = 520;
  const H = 170;
  const tMin = -600;
  const tMax = Math.max(1800, Math.min(STOP_WINDOW, now - rec.t0));
  const clampV = (v) => Math.min(yMax, Math.max(yMin, v));
  const x = (t) => ((t - rec.t0 - tMin) / (tMax - tMin)) * W;
  const y = (v) => H - ((clampV(v) - yMin) / (yMax - yMin)) * H;
  const pts = rec.series.filter((s) => s.t - rec.t0 <= tMax);
  const ticks = [-10, 0, 15, 30, 60, 90, 120].filter((m) => m * 60 <= tMax);
  const last = pts[pts.length - 1];
  return (
    <figure className="si-chart">
      <figcaption>
        <b>{title}</b>
        <span>{yMin}–{yMax} {unit}</span>
      </figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" role="img" aria-label={`${title} from 10 minutes before the stop to ${Math.round(tMax / 60)} minutes after`}>
        {band && <rect x="0" width={W} y={y(band[1])} height={Math.max(0, y(band[0]) - y(band[1]))} className="si-band" />}
        {ticks.map((m) => <line key={m} x1={x(rec.t0 + m * 60)} x2={x(rec.t0 + m * 60)} y1="0" y2={H} className={m === 0 ? "si-stop" : "si-grid"} />)}
        {series.map((s) =>
          pts.length > 1 ? (
            <polyline
              key={s.key}
              fill="none"
              stroke={s.color}
              strokeWidth="2.5"
              strokeDasharray={s.dash}
              vectorEffect="non-scaling-stroke"
              points={pts.map((q) => `${x(q.t).toFixed(1)},${y(q[s.key]).toFixed(1)}`).join(" ")}
            />
          ) : null
        )}
      </svg>
      <div className="si-axis">
        {ticks.map((m) => <span key={m}>{m === 0 ? "stop" : `${m > 0 ? "+" : ""}${m} min`}</span>)}
      </div>
      <ul className="si-legend">
        {series.map((s) => (
          <li key={s.key}>
            <svg width="30" height="8" aria-hidden="true"><line x1="0" x2="30" y1="4" y2="4" stroke={s.color} strokeWidth="2.5" strokeDasharray={s.dash} /></svg>
            {s.label} <b>{last ? last[s.key].toFixed(unit === "%" ? 1 : 0) : "–"}</b> {unit}
          </li>
        ))}
      </ul>
    </figure>
  );
};

const cell = (val, base, dec) => {
  if (val === undefined) return <td className="si-pending">–</td>;
  const d = val - base;
  const sign = d > 0 ? "+" : d < 0 ? "−" : "";
  const small = Math.abs(d) < (dec ? 0.05 : 0.5);
  return (
    <td>
      <b>{val.toFixed(dec)}</b>
      <small>{small ? "no change" : `${sign}${Math.abs(d).toFixed(dec)}`}</small>
    </td>
  );
};

const StopImpact = ({ p }) => {
  const [selId, setSelId] = useState(null);
  const recs = p.stopRecs;
  if (recs.length === 0) {
    return (
      <section className="si" aria-label="Stop recorder">
        <h2>Stop recorder</h2>
        <p className="si-empty">
          Stop or trip any drive (open its faceplate and press Stop, or pick an equipment trip scenario). The response of the temperatures and the oxygen
          levels is recorded here for two plant hours, with a before-and-after table at +5, +15, +30 and +60 minutes.
        </p>
      </section>
    );
  }
  const rec = recs.find((r) => r.id === selId) || recs[recs.length - 1];
  const dt = p.t - rec.t0;
  const ex = EXPLAIN[rec.key];
  return (
    <section className="si" aria-label="Stop recorder">
      <div className="si-head">
        <h2>Stop recorder</h2>
        <label>
          Event
          <select value={rec.id} onChange={(e) => setSelId(e.target.value)}>
            {recs.map((r) => (
              <option key={r.id} value={r.id}>{hhmm(r.t0)} {r.name}</option>
            ))}
          </select>
        </label>
        <span className="si-prog">
          {dt >= STOP_WINDOW ? "Recording complete" : `Recording: ${Math.floor(dt / 60)} of ${STOP_WINDOW / 60} min`}
        </span>
      </div>
      <p className="si-title">
        <b>{rec.name}</b> stopped at {hhmm(rec.t0)}: {rec.reason}.
        {rec.cascade.length > 0 && (
          <span> Then: {rec.cascade.map((c) => `${c.name} (${c.reason.toLowerCase()})`).join(", ")}.</span>
        )}
      </p>

      <div className="si-charts">
        <Chart title="Temperatures" unit="°C" series={TEMP_SERIES} rec={rec} now={p.t} yMin={0} yMax={1700} />
        <Chart title="Oxygen" unit="%" series={O2_SERIES} rec={rec} now={p.t} yMin={0} yMax={22} band={[1.5, 3.5]} />
      </div>

      <div className="ks-scroll si-scroll">
        <table className="si-table">
          <thead>
            <tr>
              <th>Variable</th>
              <th>Before</th>
              {STOP_MARKS.map((m) => <th key={m}>+{m / 60} min</th>)}
            </tr>
          </thead>
          <tbody>
            {ROWS.map(([k, label, unit, dec]) => (
              <tr key={k}>
                <th>{label} <small>{unit}</small></th>
                <td><b>{rec.before[k].toFixed(dec)}</b></td>
                {STOP_MARKS.map((m) => <React.Fragment key={m}>{cell(rec.marks[m]?.[k], rec.before[k], dec)}</React.Fragment>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {ex && (
        <div className="si-explain">
          <h3>What happens and why</h3>
          <p>{ex.see}</p>
          <h3>What an operator does</h3>
          <p>{ex.todo}</p>
          <p className="si-note">Typical response from full load with nothing else touched. Your run will differ if other drives were already moved or the APC was running.</p>
        </div>
      )}
    </section>
  );
};

export default StopImpact;
