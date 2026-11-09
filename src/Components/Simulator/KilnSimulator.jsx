import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { createPlant, SCENARIOS, DT, DRIVES, ackAlarms, summarize, PVS } from "../../sim/plant";
import { createApc, DEFAULT_MODEL } from "../../sim/apc";
import { tick } from "../../sim/runtime";
import Mimic from "./Mimic";
import Trend from "./Trend";
import Faceplate from "./Faceplate";
import ApcConsole from "./ApcConsole";
import "./Simulator.css";

const DURATIONS = [
  { label: "1 hour", s: 3600 },
  { label: "2 hours", s: 7200 },
  { label: "4 hours", s: 14400 },
  { label: "8-hour shift", s: 28800 },
];
const SPEEDS = [10, 30, 60, 120, 240];

const pad = (n) => String(n).padStart(2, "0");
const clock = (t, sec = false) => {
  const h = Math.floor(t / 3600);
  const m = Math.floor((t % 3600) / 60);
  return sec ? `${pad(h)}:${pad(m)}:${pad(Math.floor(t % 60))}` : `${pad(h)}:${pad(m)}`;
};

const TRENDS = [
  { title: "Burning zone", pens: [
    { key: "bzt", label: "Temp.", unit: "°C", min: 1300, max: 1600, lo: 1420, hi: 1490, color: "#c2410c" },
    { key: "nox", label: "NOx", unit: "ppm", min: 0, max: 2000, color: "#4b5563" },
  ] },
  { title: "Combustion", pens: [
    { key: "o2", label: "Kiln inlet O₂", unit: "%", min: 0, max: 6, lo: 1.5, hi: 3.5, color: "#1d4ed8", dec: 2 },
    { key: "o2Ph", label: "Preheater O₂", unit: "%", min: 0, max: 6, color: "#6b7280", dec: 2 },
  ] },
  { title: "Calciner and coal", pens: [
    { key: "calcT", label: "Calciner", unit: "°C", min: 800, max: 960, lo: 860, hi: 900, color: "#7c3aed" },
    { key: "fuelKiln", label: "Burner coal", unit: "t/h", min: 0, max: 16, color: "#4b5563", dec: 1 },
  ] },
  { title: "Production and quality", pens: [
    { key: "clinker", label: "Clinker", unit: "t/h", min: 0, max: 260, lo: 200, hi: 240, color: "#047857" },
    { key: "freeLime", label: "Free lime", unit: "%", min: 0, max: 4, color: "#4b5563", dec: 2 },
  ] },
];

const grade = (s, target) => {
  const prod = Math.min(100, (100 * s.clinkerT) / Math.max(1, (target * s.minutes) / 60));
  const total = Math.max(0, Math.min(100, 0.6 * s.inBand + 0.3 * prod + 0.1 * Math.max(0, 100 - 4 * s.offSpecPct)));
  return { total, prod, letter: total >= 90 ? "A" : total >= 80 ? "B" : total >= 70 ? "C" : total >= 55 ? "D" : "F" };
};

const mergeStats = (a, b) => {
  const out = { ...a };
  for (const k of Object.keys(a)) {
    if (Array.isArray(a[k])) out[k] = [a[k][0] + b[k][0], a[k][1] + b[k][1]];
    else if (typeof a[k] === "number") out[k] = a[k] + b[k];
  }
  return out;
};

const KilnSimulator = () => {
  const [scenarioId, setScenarioId] = useState("steady");
  const [duration, setDuration] = useState(7200);
  const [speed, setSpeed] = useState(60);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const [open, setOpen] = useState(null); // drive key
  const [consoleOpen, setConsoleOpen] = useState(false);
  const [identified, setIdentified] = useState(null);
  const [, setFrame] = useState(0);
  const plant = useRef(createPlant("steady"));
  const apc = useRef(createApc(DEFAULT_MODEL));
  const acc = useRef(0);
  const last = useRef(0);
  const refresh = useCallback(() => setFrame((f) => f + 1), []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const reset = useCallback((id = scenarioId) => {
    const keepModel = apc.current.model;
    plant.current = createPlant(id);
    apc.current = createApc(keepModel);
    const sc = SCENARIOS.find((x) => x.id === id);
    if (sc?.target) apc.current.tuning.feedTarget = Math.round(sc.target * 1.6);
    acc.current = 0;
    setRunning(false);
    setFinished(false);
    setOpen(null);
    refresh();
  }, [scenarioId, refresh]);

  useEffect(() => {
    if (!running) return undefined;
    last.current = performance.now();
    const id = setInterval(() => {
      const now = performance.now();
      acc.current += speed * Math.min(2, (now - last.current) / 1000);
      last.current = now;
      const p = plant.current;
      let n = 0;
      while (acc.current >= DT && p.t < duration && n < 600) {
        tick(p, apc.current);
        acc.current -= DT;
        n++;
      }
      if (p.t >= duration) {
        setRunning(false);
        setFinished(true);
      }
      refresh();
    }, 100);
    return () => clearInterval(id);
  }, [running, speed, duration, refresh]);

  const p = plant.current;
  const scenario = SCENARIOS.find((s) => s.id === scenarioId);
  const started = p.t > 0;
  const alarmsList = Object.values(p.alarms).sort((a, b) => a.prio - b.prio || (a.acked === b.acked ? b.since - a.since : a.acked ? 1 : -1));
  const unacked = alarmsList.filter((a) => !a.acked);
  const top = unacked[0] || alarmsList.find((a) => a.active);
  const all = summarize(mergeStats(p.stats.MAN, p.stats.APC));
  const target = scenario.target || 209;
  const g = grade(all, target);
  const showTime = Math.min(duration, p.t + Math.min(acc.current, DT - 1));

  return (
    <div className="ks-root hm-root">
      <header className="ks-top">
        <div className="ks-brand">
          <Link to="/" className="ks-back">Portfolio</Link>
          <h1>Kiln operator simulator</h1>
        </div>
        <div className="ks-controls">
          <label>
            Scenario
            <select value={scenarioId} disabled={running} onChange={(e) => { setScenarioId(e.target.value); reset(e.target.value); }}>
              {SCENARIOS.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </label>
          <label>
            Run length
            <select value={duration} disabled={started} onChange={(e) => setDuration(Number(e.target.value))}>
              {DURATIONS.map((d) => <option key={d.s} value={d.s}>{d.label}</option>)}
            </select>
          </label>
          <label>
            Speed
            <select value={speed} onChange={(e) => setSpeed(Number(e.target.value))}>
              {SPEEDS.map((v) => <option key={v} value={v}>{v}× real time</option>)}
            </select>
          </label>
          <button type="button" className="ks-primary" disabled={finished} onClick={() => setRunning((r) => !r)}>
            {running ? "Pause" : started ? "Resume" : "Start shift"}
          </button>
          <button type="button" onClick={() => reset()}>Reset</button>
          <button type="button" className={`hm-apcbtn ${p.apcOn ? "on" : ""}`} onClick={() => setConsoleOpen(true)}>
            {p.apcOn ? "APC running" : "APC off"}
            <small>Open APC console</small>
          </button>
        </div>
        <div className="ks-clock">
          <span className="ks-clock-label">Plant time, {speed}× real time</span>
          <span className="ks-clock-time">{clock(showTime, true)}</span>
          <span className="ks-clock-of">of {clock(duration)}</span>
          <span className="ks-progress"><span style={{ width: `${(100 * p.t) / duration}%` }} /></span>
        </div>
      </header>

      <div className={`hm-banner ${top ? `hm-b${top.prio}` : ""} ${unacked.length ? "hm-b-unacked" : ""}`} role="status" aria-live="polite">
        {top ? (
          <>
            <span className="hm-b-txt">
              <b>{top.lvl}</b> {top.label}: {(p.x[top.key] * (top.key === "calcDeg" ? 100 : 1)).toFixed(PVS[top.key].dec)} {PVS[top.key].unit}
              {alarmsList.length > 1 && <span className="hm-b-more"> and {alarmsList.length - 1} more</span>}
            </span>
            <button type="button" disabled={!unacked.length} onClick={() => { ackAlarms(p); refresh(); }}>
              Acknowledge {unacked.length ? `(${unacked.length})` : ""}
            </button>
          </>
        ) : (
          <span className="hm-b-txt">No active alarms</span>
        )}
      </div>

      <p className="ks-brief">
        <b>{scenario.name}.</b> {scenario.brief} Select any motor symbol (M) to open its faceplate.
      </p>

      <section className="ks-plant" aria-label="Process overview">
        <Mimic p={p} onOpen={(k) => setOpen(k)} />
      </section>

      <div className="hm-work">
        <section className="ks-trends" aria-label="Trends">
          {TRENDS.map((tr) => (
            <Trend key={tr.title} title={tr.title} pens={tr.pens} history={p.history} now={p.t} windowMin={Math.min(120, duration / 60)} />
          ))}
        </section>

        <aside className="ks-side">
          <section className="ks-score" aria-label="Shift performance">
            <h2>Shift performance</h2>
            <div className="ks-grade">
              <span className={`ks-grade-letter ks-g${started && all.minutes ? g.letter : ""}`}>{started && all.minutes ? g.letter : "–"}</span>
              <span>
                {started && all.minutes ? `${g.total.toFixed(0)} / 100` : "Starts with the shift"}
                <small>
                  In band {all.minutes ? all.inBand.toFixed(0) : "–"} %, production {all.minutes ? g.prod.toFixed(0) : "–"} %, burning zone SD {all.minutes ? all.bzt.sd.toFixed(1) : "–"} °C
                </small>
              </span>
            </div>
            <table className="hm-drives">
              <thead><tr><th>Drive</th><th>Mode</th><th>SP</th><th>PV</th></tr></thead>
              <tbody>
                {DRIVES.map((d) => {
                  const s = p.drives[d.key];
                  const dec = d.step < 1 ? (d.step < 0.1 ? 2 : 1) : 0;
                  return (
                    <tr key={d.key} className={s.tripped ? "trip" : !s.running ? "stop" : ""}>
                      <td><button type="button" className="hm-link" onClick={() => setOpen(d.key)}>{d.name}</button></td>
                      <td>{!s.running ? (s.tripped ? "Trip" : "Stop") : s.mode === "AUTO" ? (d.apc && p.apcOn ? "APC" : "Auto") : "Man"}</td>
                      <td>{s.sp.toFixed(dec)}</td>
                      <td>{s.pv.toFixed(dec)} <small>{d.unit}</small></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>

          <section className="ks-log" aria-label="Alarms and events">
            <h2>Alarms and events</h2>
            <ol>
              {p.events.slice(0, 16).map((e, i) => (
                <li key={`${e.t}-${i}`} className={`ks-ev-${e.level}`}>
                  <time>{clock(e.t)}</time> {e.msg}
                </li>
              ))}
            </ol>
          </section>

          <details className="ks-guide">
            <summary>Operator rules of thumb</summary>
            <ul>
              <li>NOx moves minutes before the burning zone temperature. Use it as your early warning.</li>
              <li>Check O₂ before adding coal. Below about 1 % O₂ at the kiln inlet, CO rises fast; 1 % CO at the preheater exit trips the coal feeders to protect the ESP.</li>
              <li>More ID fan raises O₂ in both the kiln and the calciner, but carries heat up the tower.</li>
              <li>A coal change takes about 3 minutes to start acting on the burning zone and about 35 minutes to do most of its work.</li>
              <li>Under APC the feed climbs until something limits it, usually the ID fan. That is where the production gain comes from.</li>
              <li>Free lime is sampled hourly and reported 15 minutes later. Don't chase it.</li>
              <li>The kiln drive follows the feed in Auto. The grate keeps chamber 2 pressure at its setpoint in Auto.</li>
            </ul>
          </details>
        </aside>
      </div>

      {open && (
        <div className="fp-layer">
          <Faceplate p={p} k={open} onClose={() => setOpen(null)} onChange={refresh} />
        </div>
      )}

      {consoleOpen && (
        <ApcConsole
          p={p}
          apc={apc.current}
          onClose={() => setConsoleOpen(false)}
          onChange={refresh}
          identified={identified}
          setIdentified={setIdentified}
        />
      )}

      {finished && (
        <div className="ks-modal" role="dialog" aria-modal="true" aria-labelledby="ks-report-title">
          <div className="ks-report">
            <h2 id="ks-report-title">Shift report: {scenario.name}</h2>
            <div className="ks-grade ks-grade-big">
              <span className={`ks-grade-letter ks-g${g.letter}`}>{g.letter}</span>
              <span>{g.total.toFixed(0)} / 100</span>
            </div>
            <table>
              <tbody>
                <tr><th>Time with all key values in band</th><td>{all.inBand.toFixed(0)} %</td></tr>
                <tr><th>Burning zone, mean ± SD</th><td>{all.bzt.mean.toFixed(0)} ± {all.bzt.sd.toFixed(1)} °C</td></tr>
                <tr><th>Burning zone within ±0.5 % of 1450 °C</th><td>{all.inHalfPct.toFixed(0)} %</td></tr>
                <tr><th>Clinker produced</th><td>{all.clinkerT.toFixed(0)} t ({g.prod.toFixed(0)} % of target)</td></tr>
                <tr><th>Average specific heat</th><td>{all.heat.mean.toFixed(0)} kcal/kg</td></tr>
                <tr><th>Off-spec clinker (free lime above 2.5 %)</th><td>{all.offSpecPct.toFixed(1)} %</td></tr>
                <tr><th>Minutes under APC</th><td>{p.stats.APC.n} of {all.minutes}</td></tr>
              </tbody>
            </table>
            <p className="ac-note">Open the APC console, Results tab, to compare your manual minutes with the APC minutes and with published plant data.</p>
            <div className="ks-report-actions">
              <button type="button" className="ks-primary" onClick={() => reset()}>Run again</button>
              <button type="button" onClick={() => { setFinished(false); setConsoleOpen(true); }}>Compare with APC</button>
              <button type="button" onClick={() => setFinished(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      <footer className="ks-foot">
        Generic 5,000 t/d line. Plant values and dynamics follow published sources (Stadler et al. 2011; Zanoli et al. 2023; Svensen et al. 2026; plant
        operation handbooks). The model is a training simulator: cause and effect are realistic, numbers are indicative.
      </footer>
    </div>
  );
};

export default KilnSimulator;
