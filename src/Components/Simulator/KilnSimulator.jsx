import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { createState, step, score, MVS, SCENARIOS, SCORED, DT } from "../../sim/kilnModel";
import Mimic from "./Mimic";
import Trend from "./Trend";
import Faceplate from "./Faceplate";
import "./Simulator.css";

const DURATIONS = [
  { label: "30 min", s: 1800 },
  { label: "1 hour", s: 3600 },
  { label: "2 hours", s: 7200 },
  { label: "4 hours", s: 14400 },
  { label: "8-hour shift", s: 28800 },
];
const SPEEDS = [10, 30, 60, 120];

const clock = (t) => {
  const h = Math.floor(t / 3600);
  const m = Math.floor((t % 3600) / 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

const TRENDS = [
  {
    title: "Burning zone",
    pens: [
      { key: "bzt", label: "Temp.", unit: "°C", min: 1250, max: 1600, lo: 1420, hi: 1480, color: "#c2410c" },
      { key: "nox", label: "NOx", unit: "ppm", min: 0, max: 2000, color: "#4b5563" },
    ],
  },
  {
    title: "Kiln inlet gas",
    pens: [
      { key: "o2", label: "O₂", unit: "%", min: 0, max: 6, lo: 1.5, hi: 3.5, color: "#1d4ed8", dec: 1 },
      { key: "co", label: "CO", unit: "ppm", min: 0, max: 6000, color: "#b91c1c" },
    ],
  },
  {
    title: "Calciner and cooler",
    pens: [
      { key: "calcT", label: "Calciner", unit: "°C", min: 780, max: 980, lo: 860, hi: 900, color: "#7c3aed" },
      { key: "sat", label: "Sec. air", unit: "°C", min: 700, max: 1250, color: "#4b5563" },
    ],
  },
  {
    title: "Quality and output",
    pens: [
      { key: "freeLime", label: "Free lime", unit: "%", min: 0, max: 5, lo: 0.8, hi: 2.0, color: "#047857", dec: 2 },
      { key: "clinker", label: "Clinker", unit: "t/h", min: 0, max: 260, color: "#4b5563" },
    ],
  },
];

const SCORE_LABELS = {
  bzt: "Burning zone 1420–1480 °C",
  o2: "Kiln inlet O₂ 1.5–3.5 %",
  co: "Kiln inlet CO below 1000 ppm",
  calcT: "Calciner outlet 860–900 °C",
  freeLimeTrue: "Free lime 0.8–2.0 %",
};

const KilnSimulator = () => {
  const [scenarioId, setScenarioId] = useState("steady");
  const [duration, setDuration] = useState(3600);
  const [speed, setSpeed] = useState(60);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const [, setFrame] = useState(0);
  const sim = useRef(createState("steady"));
  const acc = useRef(0);

  useEffect(() => window.scrollTo(0, 0), []);

  const reset = useCallback((id = scenarioId) => {
    sim.current = createState(id);
    acc.current = 0;
    setRunning(false);
    setFinished(false);
    setFrame((f) => f + 1);
  }, [scenarioId]);

  // Simulation clock
  useEffect(() => {
    if (!running) return undefined;
    const id = setInterval(() => {
      acc.current += speed * 0.1; // plant seconds per 100 ms of real time
      const s = sim.current;
      while (acc.current >= DT && s.t < duration) {
        step(s);
        acc.current -= DT;
      }
      if (s.t >= duration) {
        setRunning(false);
        setFinished(true);
      }
      setFrame((f) => f + 1);
    }, 100);
    return () => clearInterval(id);
  }, [running, speed, duration]);

  const s = sim.current;
  const sc = score(s);
  const scenario = SCENARIOS.find((x) => x.id === scenarioId);
  const started = s.t > 0;

  const setSp = (key, v) => {
    s.sp[key] = v;
    setFrame((f) => f + 1);
  };

  return (
    <div className="ks-root">
      <header className="ks-top">
        <div className="ks-brand">
          <Link to="/" className="ks-back">Portfolio</Link>
          <h1>Kiln operator simulator</h1>
        </div>

        <div className="ks-controls">
          <label>
            Scenario
            <select
              value={scenarioId}
              disabled={running}
              onChange={(e) => {
                setScenarioId(e.target.value);
                reset(e.target.value);
              }}
            >
              {SCENARIOS.map((x) => (
                <option key={x.id} value={x.id}>{x.name}</option>
              ))}
            </select>
          </label>
          <label>
            Run length
            <select value={duration} disabled={started} onChange={(e) => setDuration(Number(e.target.value))}>
              {DURATIONS.map((d) => (
                <option key={d.s} value={d.s}>{d.label}</option>
              ))}
            </select>
          </label>
          <label>
            Speed
            <select value={speed} onChange={(e) => setSpeed(Number(e.target.value))}>
              {SPEEDS.map((v) => (
                <option key={v} value={v}>{v}× real time</option>
              ))}
            </select>
          </label>
          <button
            type="button"
            className="ks-primary"
            disabled={finished}
            onClick={() => setRunning((r) => !r)}
          >
            {running ? "Pause" : started ? "Resume" : "Start shift"}
          </button>
          <button type="button" onClick={() => reset()}>Reset</button>
        </div>

        <div className="ks-clock" aria-live="off">
          <span className="ks-clock-time">{clock(s.t)}</span>
          <span className="ks-clock-of">of {clock(duration)}</span>
          <span className="ks-progress"><span style={{ width: `${(100 * s.t) / duration}%` }} /></span>
        </div>
      </header>

      <p className="ks-brief">
        <b>{scenario.name}.</b> {scenario.brief}
      </p>

      <section className="ks-plant" aria-label="Process overview">
        <Mimic x={s.x} mv={s.mv} />
      </section>

      <div className="ks-work">
        <section className="ks-faces" aria-label="Operator setpoints">
          <h2>Setpoints</h2>
          {MVS.map((m) => (
            <Faceplate key={m.key} mv={m} sp={s.sp[m.key]} pv={s.mv[m.key]} onChange={(v) => setSp(m.key, v)} />
          ))}
          <p className="ks-hint">Type a value and press Enter, or use − and +. Shift-click steps five times further. Actuators ramp at realistic rates.</p>
        </section>

        <section className="ks-trends" aria-label="Trends">
          {TRENDS.map((tr) => (
            <Trend key={tr.title} title={tr.title} pens={tr.pens} history={s.history} now={s.t} windowMin={Math.min(120, duration / 60)} />
          ))}
        </section>

        <aside className="ks-side">
          <section className="ks-score" aria-label="Shift performance">
            <h2>Shift performance</h2>
            <div className="ks-grade">
              <span className={`ks-grade-letter ks-g${sc.grade}`}>{started ? sc.grade : "–"}</span>
              <span>
                {started ? `${sc.total.toFixed(0)} / 100` : "Starts with the shift"}
                <small>Stability {started ? sc.stability.toFixed(0) : "–"} %, production {started ? sc.prodPct.toFixed(0) : "–"} %</small>
              </span>
            </div>
            <ul className="ks-bands">
              {SCORED.map((k) => (
                <li key={k}>
                  <span>{SCORE_LABELS[k]}</span>
                  <span className="ks-meter"><span style={{ width: `${started ? sc.bands[k] : 0}%` }} /></span>
                  <b>{started ? sc.bands[k].toFixed(0) : "–"} %</b>
                </li>
              ))}
            </ul>
          </section>

          <section className="ks-log" aria-label="Alarms and events">
            <h2>Alarms and events</h2>
            <ol>
              {s.events.slice(0, 14).map((e, i) => (
                <li key={`${e.t}-${i}`} className={`ks-ev-${e.level}`}>
                  <time>{clock(e.t)}</time> {e.msg}
                </li>
              ))}
            </ol>
          </section>

          <details className="ks-guide">
            <summary>Operator rules of thumb</summary>
            <ul>
              <li>NOx moves minutes before the burning zone temperature does. Use it as your early warning.</li>
              <li>Before adding main burner coal, check O₂. Below about 1 % O₂, CO climbs fast and above 5000 ppm the kiln trips.</li>
              <li>Raise ID fan speed to bring O₂ back, but more air also carries heat up the preheater.</li>
              <li>Keep the calciner at 860–900 °C. Low calcination sends extra work, and a cold load, into the kiln.</li>
              <li>Falling torque means a cooling or flushing kiln. Rising torque with high temperature means good burning or coating build-up.</li>
              <li>Free lime arrives from the lab every 30 minutes and describes clinker made about 25 minutes earlier. Don't chase it.</li>
              <li>Slow the cooler grate to raise secondary air temperature, but watch undergrate pressure.</li>
              <li>To raise production, move feed, fuels, fan and kiln speed together in small steps.</li>
            </ul>
          </details>
        </aside>
      </div>

      {finished && (
        <div className="ks-modal" role="dialog" aria-modal="true" aria-labelledby="ks-report-title">
          <div className="ks-report">
            <h2 id="ks-report-title">Shift report: {scenario.name}</h2>
            <div className="ks-grade ks-grade-big">
              <span className={`ks-grade-letter ks-g${sc.grade}`}>{sc.grade}</span>
              <span>{sc.total.toFixed(0)} / 100</span>
            </div>
            <table>
              <tbody>
                <tr><th>Time in band (average)</th><td>{sc.stability.toFixed(0)} %</td></tr>
                {SCORED.map((k) => (
                  <tr key={k}><th className="ks-sub">{SCORE_LABELS[k]}</th><td>{sc.bands[k].toFixed(0)} %</td></tr>
                ))}
                <tr><th>Clinker produced</th><td>{sc.clinkerT.toFixed(0)} t ({sc.prodPct.toFixed(0)} % of target)</td></tr>
                <tr><th>Off-spec clinker (free lime above 2.5 %)</th><td>{sc.offSpecPct.toFixed(1)} %</td></tr>
                <tr><th>Average specific heat</th><td>{sc.heat.toFixed(0)} kcal/kg clinker</td></tr>
                <tr><th>CO trips</th><td>{s.stats.trips}</td></tr>
                <tr><th>Kiln flush events</th><td>{s.stats.flushes}</td></tr>
                <tr><th>Overheating events</th><td>{s.stats.overheats}</td></tr>
              </tbody>
            </table>
            <div className="ks-report-actions">
              <button type="button" className="ks-primary" onClick={() => reset()}>Run this scenario again</button>
              <button type="button" onClick={() => setFinished(false)}>Close and review trends</button>
            </div>
          </div>
        </div>
      )}

      <footer className="ks-foot">
        Training model built by Ahmed Othman. Cause and effect follow real kiln behaviour, but values are indicative and not taken from any specific plant.
      </footer>
    </div>
  );
};

export default KilnSimulator;
