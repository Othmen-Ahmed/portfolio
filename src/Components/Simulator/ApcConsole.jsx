import React, { useEffect, useMemo, useState } from "react";
import { APC_MVS, DEFAULT_MODEL, MODEL_PRESETS, presetModel, cloneModel, TS } from "../../sim/apc";
import { identifyPlant } from "../../sim/identify";
import { apcReady, engageApc, disengageApc } from "../../sim/runtime";
import { summarize, LITERATURE, tagOf } from "../../sim/plant";

const TABS = ["Overview", "Models", "Tuning", "Results"];

// Past (history) + future (APC prediction) for one CV
const PredChart = ({ cv, p, apc }) => {
  const W = 360;
  const H = 120;
  const past = p.history.slice(-60).map((h) => h[cv.key]);
  const pred = apc.pred && p.apcOn ? apc.pred : null;
  const fut = pred ? Array.from(pred.planned[cv.key]).slice(0, 121) : [];
  const free = pred ? Array.from(pred.free[cv.key]).slice(0, 121) : [];
  const all = [...past, ...fut, ...free, cv.lo, cv.hi].filter(Number.isFinite);
  const min = Math.min(...all);
  const max = Math.max(...all);
  const pad = (max - min) * 0.1 || 1;
  const lo = min - pad;
  const hi = max + pad;
  const xPast = (i) => (i / 60) * (W / 3);
  const xFut = (i) => W / 3 + (i / 120) * ((2 * W) / 3);
  const y = (v) => H - ((v - lo) / (hi - lo)) * H;
  const line = (arr, xf) => arr.map((v, i) => `${xf(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  return (
    <figure className="ac-pred">
      <figcaption>
        <b>{cv.label}</b>
        <span>{cv.type === "range" ? `range ${cv.lo}–${cv.hi}` : `setpoint ${cv.sp}`} {cv.unit}</span>
      </figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" role="img" aria-label={`${cv.label}: last hour and the APC prediction for the next two hours`}>
        <rect x="0" width={W} y={y(cv.hi)} height={Math.max(0, y(cv.lo) - y(cv.hi))} className="ac-band" />
        <line x1={W / 3} x2={W / 3} y1="0" y2={H} className="ac-now" />
        {past.length > 1 && <polyline points={line(past, (i) => xPast(i + (60 - past.length)))} className="ac-past" />}
        {free.length > 1 && <polyline points={line(free, xFut)} className="ac-free" />}
        {fut.length > 1 && <polyline points={line(fut, xFut)} className="ac-plan" />}
      </svg>
      <div className="ac-axis"><span>−60 min</span><span>now</span><span>+120 min</span></div>
    </figure>
  );
};

const MiniStep = ({ f }) => {
  const total = Math.max(600, (f.theta + 5 * f.tau) * 1.1);
  const pts = [];
  for (let i = 0; i <= 30; i++) {
    const t = (i / 30) * total;
    const v = t <= f.theta ? 0 : 1 - Math.exp(-(t - f.theta) / Math.max(1, f.tau));
    pts.push(`${i * 2},${(8 - Math.sign(f.K) * v * 6).toFixed(1)}`);
  }
  return (
    <svg className="ac-mini" viewBox="0 0 60 16" aria-hidden="true">
      <line x1="0" x2="60" y1="8" y2="8" className="ac-mini-axis" />
      {f.K !== 0 && <polyline points={pts.join(" ")} />}
    </svg>
  );
};

const num = (v, fallback) => {
  const n = parseFloat(String(v).replace(",", "."));
  return Number.isFinite(n) ? n : fallback;
};

const ApcConsole = ({ p, apc, onClose, onChange, identified, setIdentified }) => {
  const [tab, setTab] = useState("Overview");
  const [draft, setDraft] = useState(() => cloneModel(apc.model));
  const [preset, setPreset] = useState("custom");
  const [busy, setBusy] = useState(false);
  const ready = apcReady(p);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(apc.model), [draft, apc.model]);

  const runTests = () => {
    setBusy(true);
    setTimeout(() => {
      const m = identifyPlant(DEFAULT_MODEL);
      setIdentified(m);
      setDraft(cloneModel(m));
      setPreset("identified");
      setBusy(false);
    }, 30);
  };

  const applyPreset = (id) => {
    setPreset(id);
    if (id === "custom") return;
    if (id !== "default" && !identified) return;
    setDraft(presetModel(id, DEFAULT_MODEL, identified));
  };

  const setCell = (cv, mv, field, v) => {
    const next = cloneModel(draft);
    const f = next[cv][mv];
    if (field === "K") f.K = num(v, f.K);
    if (field === "theta") f.theta = Math.max(0, num(v, f.theta / 60) * 60);
    if (field === "tau") f.tau = Math.max(1, num(v, f.tau / 60) * 60);
    setDraft(next);
    setPreset("custom");
  };

  const statMan = summarize(p.stats.MAN);
  const statApc = summarize(p.stats.APC);

  return (
    <div className="ac-wrap" role="dialog" aria-modal="true" aria-labelledby="ac-title">
      <div className="ac">
        <header className="ac-head">
          <div>
            <h2 id="ac-title">Kiln APC: model predictive control</h2>
            <p className={`ac-status ${p.apcOn ? "on" : ""}`}>
              {p.apcOn ? `Running, executes every ${TS} s` : apc.status === "Off" ? "Off: operators control the kiln" : apc.status}
            </p>
          </div>
          <div className="ac-head-btns">
            {p.apcOn ? (
              <button type="button" onClick={() => { disengageApc(p, apc); onChange(); }}>Switch to manual</button>
            ) : (
              <button type="button" className="ac-primary" disabled={!ready.ok} onClick={() => { engageApc(p, apc); onChange(); }}>Engage APC</button>
            )}
            <button type="button" className="ac-close" onClick={onClose} aria-label="Close APC console">×</button>
          </div>
        </header>

        {!ready.ok && !p.apcOn && (
          <p className="ac-warn">The APC needs these drives running first: {ready.missing.map(tagOf).join(", ")}.</p>
        )}

        <nav className="ac-tabs" role="tablist">
          {TABS.map((t) => (
            <button key={t} role="tab" aria-selected={tab === t} className={tab === t ? "sel" : ""} onClick={() => setTab(t)} type="button">{t}</button>
          ))}
        </nav>

        {tab === "Overview" && (
          <div className="ac-body">
            <p className="ac-lead">
              Every minute the controller predicts each variable two hours ahead from the moves already made (dashed), then plans a sequence of small
              moves on all four handles at once so the prediction lands in its band (solid). Only the first move is applied; next minute it measures again and re-plans.
            </p>
            <div className="ac-preds">
              {apc.cvs.map((cv) => <PredChart key={cv.key} cv={cv} p={p} apc={apc} />)}
            </div>
            {!p.apcOn && <p className="ac-note">Predictions appear once the APC is engaged.</p>}
            <table className="ac-table">
              <thead><tr><th>Handle</th><th>Mode</th><th>Setpoint</th><th>Limits</th><th>Max move / min</th></tr></thead>
              <tbody>
                {apc.mvs.map((m) => {
                  const d = p.drives[m.key];
                  return (
                    <tr key={m.key}>
                      <td>{m.label}</td>
                      <td>{!d.running ? "Stopped" : d.mode === "AUTO" && p.apcOn ? "APC" : "Manual"}</td>
                      <td>{d.sp.toFixed(m.dec)} {m.unit}</td>
                      <td>{m.min}–{m.max}</td>
                      <td>{m.maxMove}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {tab === "Models" && (
          <div className="ac-body">
            <p className="ac-lead">
              Each cell is the controller's assumption of how one handle moves one variable: a first-order-plus-dead-time model with gain K
              (change in the variable per unit of the handle), dead time θ and time constant τ. Edit them, or run the step tests that an APC engineer does at commissioning.
            </p>
            <div className="ac-row">
              <label>
                Model
                <select value={preset} onChange={(e) => applyPreset(e.target.value)}>
                  <option value="custom">Current / custom</option>
                  {MODEL_PRESETS.map((m) => (
                    <option key={m.id} value={m.id} disabled={m.id !== "default" && !identified}>{m.name}{m.id !== "default" && !identified ? " (run step tests first)" : ""}</option>
                  ))}
                </select>
              </label>
              <button type="button" onClick={runTests} disabled={busy}>{busy ? "Testing…" : "Run plant step tests"}</button>
              <button type="button" className="ac-primary" disabled={!dirty} onClick={() => { apc.model = cloneModel(draft); onChange(); }}>Apply model to controller</button>
              <button type="button" disabled={!dirty} onClick={() => { setDraft(cloneModel(apc.model)); setPreset("custom"); }}>Discard changes</button>
            </div>
            {identified && <p className="ac-note">Step tests done: each handle stepped for 4 plant hours on a noise-free copy of the kiln. Plant values appear under each cell.</p>}
            <div className="ac-scroll">
              <table className="ac-matrix">
                <thead>
                  <tr><th>Variable \ handle</th>{APC_MVS.map((m) => <th key={m.key}>{m.label}<small> per {m.unit}</small></th>)}</tr>
                </thead>
                <tbody>
                  {apc.cvs.map((cv) => (
                    <tr key={cv.key}>
                      <th>{cv.label}<small>{cv.unit}</small></th>
                      {APC_MVS.map((mv) => {
                        const f = draft[cv.key][mv.key];
                        const idf = identified?.[cv.key]?.[mv.key];
                        return (
                          <td key={mv.key} className={f.K === 0 ? "ac-zero" : ""}>
                            <MiniStep f={f} />
                            <label>K <input value={f.K} onChange={(e) => setCell(cv.key, mv.key, "K", e.target.value)} inputMode="decimal" /></label>
                            <label>θ <input value={+(f.theta / 60).toFixed(1)} onChange={(e) => setCell(cv.key, mv.key, "theta", e.target.value)} inputMode="decimal" /> min</label>
                            <label>τ <input value={+(f.tau / 60).toFixed(1)} onChange={(e) => setCell(cv.key, mv.key, "tau", e.target.value)} inputMode="decimal" /> min</label>
                            {idf && <span className="ac-ident">plant: {idf.K}, {(idf.theta / 60).toFixed(1)}, {(idf.tau / 60).toFixed(1)}</span>}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="ac-note">
              Try an experiment: apply "Gains overestimated (×2)" or "Dead times ignored", run the coal quality scenario with the APC on, and compare the
              results tab with the identified model. The controller is only as good as its model.
            </p>
          </div>
        )}

        {tab === "Tuning" && (
          <div className="ac-body">
            <p className="ac-lead">
              Priority sets how much each variable matters; the equal concern error is the deviation you would accept before acting.
              Move suppression makes a handle move more gently. Changes apply at the next controller execution.
            </p>
            <div className="ac-scroll">
              <table className="ac-table ac-edit">
                <thead><tr><th>Controlled variable</th><th>Type</th><th>Setpoint</th><th>Low</th><th>High</th><th>Equal concern error</th><th>Priority (1–10)</th></tr></thead>
                <tbody>
                  {apc.cvs.map((cv) => (
                    <tr key={cv.key}>
                      <td>{cv.label} <small>{cv.unit}</small></td>
                      <td>
                        <select value={cv.type} onChange={(e) => { cv.type = e.target.value; onChange(); }}>
                          <option value="setpoint">Setpoint</option>
                          <option value="range">Range</option>
                        </select>
                      </td>
                      {["sp", "lo", "hi", "ece", "priority"].map((f) => (
                        <td key={f}>
                          <input
                            defaultValue={cv[f]}
                            inputMode="decimal"
                            disabled={f === "sp" && cv.type === "range"}
                            onBlur={(e) => { cv[f] = num(e.target.value, cv[f]); if (f === "priority") cv[f] = Math.min(10, Math.max(0, cv[f])); onChange(); }}
                            aria-label={`${cv.label} ${f}`}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <table className="ac-table ac-edit">
                <thead><tr><th>Manipulated variable</th><th>Min</th><th>Max</th><th>Max move per min</th><th>Move suppression</th></tr></thead>
                <tbody>
                  {apc.mvs.map((m) => (
                    <tr key={m.key}>
                      <td>{m.label} <small>{m.unit}</small></td>
                      {["min", "max", "maxMove", "supp"].map((f) => (
                        <td key={f}>
                          <input defaultValue={m[f]} inputMode="decimal" onBlur={(e) => { m[f] = Math.max(f === "supp" ? 0.05 : -1e9, num(e.target.value, m[f])); onChange(); }} aria-label={`${m.label} ${f}`} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="ac-row">
              <label>Feed target (t/h)<input defaultValue={apc.tuning.feedTarget} inputMode="decimal" onBlur={(e) => { apc.tuning.feedTarget = num(e.target.value, apc.tuning.feedTarget); onChange(); }} /></label>
              <label>Feed target priority<input defaultValue={apc.tuning.feedPriority} inputMode="decimal" onBlur={(e) => { apc.tuning.feedPriority = Math.min(10, Math.max(0, num(e.target.value, apc.tuning.feedPriority))); onChange(); }} /></label>
              <label className="ac-check"><input type="checkbox" checked={apc.tuning.maximizeFeed} onChange={(e) => { apc.tuning.maximizeFeed = e.target.checked; onChange(); }} /> Maximize production: push feed toward its maximum while all variables stay in band (uses the feed target when off)</label>
              <label className="ac-check"><input type="checkbox" checked={apc.tuning.coRule} onChange={(e) => { apc.tuning.coRule = e.target.checked; onChange(); }} /> Expert rule: raise O₂ limits when CO rises</label>
              <label>Prediction horizon (min)<input defaultValue={apc.tuning.hp} inputMode="numeric" onBlur={(e) => { apc.tuning.hp = Math.min(240, Math.max(30, Math.round(num(e.target.value, apc.tuning.hp)))); onChange(); }} /></label>
            </div>
          </div>
        )}

        {tab === "Results" && (
          <div className="ac-body">
            <p className="ac-lead">
              Statistics of this session, split by who was in control. One sample per plant minute. The last column is the published result of an
              MPC (ABB Expert Optimizer) on a real kiln, measured over 10 days in each mode.
            </p>
            <div className="ac-scroll">
              <table className="ac-table">
                <thead><tr><th>Indicator</th><th>Manual (you)</th><th>APC</th><th>Literature: manual → MPC</th></tr></thead>
                <tbody>
                  <tr><td>Minutes in this mode</td><td>{statMan.minutes}</td><td>{statApc.minutes}</td><td>10 days each</td></tr>
                  <tr><td>Burning zone, standard deviation</td><td>{statMan.minutes ? `${statMan.bzt.sd.toFixed(1)} °C` : "–"}</td><td>{statApc.minutes ? `${statApc.bzt.sd.toFixed(1)} °C` : "–"}</td><td>{LITERATURE.manual.bztSd} → {LITERATURE.mpc.bztSd} °C</td></tr>
                  <tr><td>Burning zone within ±0.5 % of 1450 °C</td><td>{statMan.minutes ? `${statMan.inHalfPct.toFixed(0)} %` : "–"}</td><td>{statApc.minutes ? `${statApc.inHalfPct.toFixed(0)} %` : "–"}</td><td>{LITERATURE.manual.inHalfPct} → {LITERATURE.mpc.inHalfPct} %</td></tr>
                  <tr><td>Kiln inlet O₂, standard deviation</td><td>{statMan.minutes ? `${statMan.o2.sd.toFixed(2)} %` : "–"}</td><td>{statApc.minutes ? `${statApc.o2.sd.toFixed(2)} %` : "–"}</td><td>{LITERATURE.manual.o2Sd} → {LITERATURE.mpc.o2Sd} % (preheater)</td></tr>
                  <tr><td>Specific heat, mean ± SD</td><td>{statMan.minutes ? `${statMan.heat.mean.toFixed(0)} ± ${statMan.heat.sd.toFixed(0)} kcal/kg` : "–"}</td><td>{statApc.minutes ? `${statApc.heat.mean.toFixed(0)} ± ${statApc.heat.sd.toFixed(0)} kcal/kg` : "–"}</td><td>SD {LITERATURE.manual.heatSdKJ} → {LITERATURE.mpc.heatSdKJ} kJ/kg</td></tr>
                  <tr><td>Kiln feed, mean ± SD</td><td>{statMan.minutes ? `${statMan.feed.mean.toFixed(0)} ± ${statMan.feed.sd.toFixed(1)} t/h` : "–"}</td><td>{statApc.minutes ? `${statApc.feed.mean.toFixed(0)} ± ${statApc.feed.sd.toFixed(1)} t/h` : "–"}</td><td>SD {LITERATURE.manual.feedSd} → {LITERATURE.mpc.feedSd} % of max</td></tr>
                  <tr><td>All key values in their bands</td><td>{statMan.minutes ? `${statMan.inBand.toFixed(0)} %` : "–"}</td><td>{statApc.minutes ? `${statApc.inBand.toFixed(0)} %` : "–"}</td><td>–</td></tr>
                </tbody>
              </table>
            </div>
            <p className="ac-note">Source: {LITERATURE.source}, Control Engineering Practice 19 (2011) 1–9, Table 1.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApcConsole;
