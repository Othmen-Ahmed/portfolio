import React, { useEffect, useRef, useState } from "react";
import { DRIVES, PVS, NOM, permissives, canStart, startDrive, stopDrive, resetTrip, TRIP_TEXT } from "../../sim/plant";

// Which process alarms belong to which drive's faceplate
const RELATED = {
  fan: ["o2", "o2Ph", "co", "cyc1T"],
  feed: ["calcDeg", "freeLimeLab"],
  kiln: ["torque", "bzt"],
  fuelKiln: ["bzt", "nox", "o2", "co"],
  fuelCalc: ["calcT", "o2Ph", "co"],
  grate: ["ugp", "sat"],
};

const Spark = ({ data, color = "#0f3561" }) => {
  if (data.length < 2) return <div className="fp-spark-empty">Trend starts after the first minute</div>;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const pts = data.map((v, i) => `${((i / (data.length - 1)) * 300).toFixed(1)},${(40 - ((v - min) / span) * 36 - 2).toFixed(1)}`).join(" ");
  return (
    <svg className="fp-spark" viewBox="0 0 300 40" preserveAspectRatio="none" aria-hidden="true">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" />
    </svg>
  );
};

const Faceplate = ({ p, k, onClose, onChange }) => {
  const def = DRIVES.find((d) => d.key === k);
  const d = p.drives[k];
  const panelRef = useRef(null);
  const isApcDrive = def.apc;
  const apcControlled = isApcDrive && d.mode === "AUTO" && p.apcOn;
  const localAuto = !isApcDrive && d.mode === "AUTO";
  const editsUgp = k === "grate" && localAuto;
  const spValue = editsUgp ? p.ugpSp : d.sp;
  const dec = editsUgp ? 0 : def.step < 1 ? (def.step < 0.1 ? 2 : 1) : 0;
  const [text, setText] = useState(spValue.toFixed(dec));
  const readOnly = apcControlled || (k === "kiln" && localAuto);

  useEffect(() => setText(spValue.toFixed(dec)), [spValue, dec]);
  useEffect(() => {
    panelRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [k, onClose]);

  const commit = (v) => {
    const n = parseFloat(String(v).replace(",", "."));
    if (!Number.isFinite(n)) return setText(spValue.toFixed(dec));
    if (editsUgp) p.ugpSp = Math.min(72, Math.max(40, n));
    else d.sp = Math.min(def.max, Math.max(def.min, n));
    onChange();
  };
  const nudge = (dir, e) => commit(spValue + dir * (editsUgp ? 1 : def.step) * (e.shiftKey ? 5 : 1));

  const setMode = (m) => {
    if (m === d.mode) return;
    if (m === "AUTO" && isApcDrive && !p.apcOn) return;
    d.mode = m;
    if (m === "MAN" && k === "grate") d.sp = d.pv;
    onChange();
  };

  const perms = permissives(p, k);
  const startOk = canStart(p, k);
  const status = d.tripped ? "Tripped" : d.running ? "Running" : "Stopped";
  const nominal = NOM[k];
  const load = d.running ? (k === "fan" ? 0.12 + 0.88 * (d.pv / nominal) ** 3 : k === "kiln" ? Math.max(0.1, p.x.torque / 100) * (d.pv / nominal) : 0.3 + 0.6 * (d.pv / nominal)) : 0;
  const amps = def.ratedA * Math.min(1.3, 0.75 * load);
  const alarms = (RELATED[k] || []).map((key) => p.alarms[key]).filter((a) => a && a.active);
  const spark = p.history.slice(-60).map((h) => (k === "grate" || k === "kiln" ? null : h[k])).filter((v) => v != null);
  const pct = ((d.pv - def.min) / (def.max - def.min)) * 100;
  const spPct = ((d.sp - def.min) / (def.max - def.min)) * 100;

  return (
    <div className="fp" role="dialog" aria-modal="false" aria-labelledby={`fp-${k}`} ref={panelRef} tabIndex={-1}>
      <header className="fp-head">
        <div>
          <span className="fp-tag">{def.tag}</span>
          <h2 id={`fp-${k}`}>{def.name}</h2>
        </div>
        <button type="button" className="fp-close" onClick={onClose} aria-label="Close faceplate">×</button>
      </header>

      <div className={`fp-status fp-st-${status.toLowerCase()}`}>
        <span className="fp-lamp" aria-hidden="true" />
        <b>{status}</b>
        {d.tripReason && <span> · {d.tripReason}</span>}
      </div>

      <div className="fp-row fp-cmds">
        <button type="button" className="fp-start" disabled={d.running || !startOk} onClick={() => { startDrive(p, k); onChange(); }}>Start</button>
        <button type="button" className="fp-stop" disabled={!d.running} onClick={() => { stopDrive(p, k); onChange(); }}>Stop</button>
        <button type="button" disabled={!d.tripped && !(p.coTripLatched && (k === "fuelKiln" || k === "fuelCalc"))} onClick={() => { resetTrip(p, k); onChange(); }}>Reset trip</button>
      </div>

      <fieldset className="fp-mode">
        <legend>Mode</legend>
        <label><input type="radio" name={`mode-${k}`} checked={d.mode === "MAN"} onChange={() => setMode("MAN")} /> Manual</label>
        <label className={isApcDrive && !p.apcOn ? "fp-dis" : ""}>
          <input type="radio" name={`mode-${k}`} checked={d.mode === "AUTO"} disabled={isApcDrive && !p.apcOn} onChange={() => setMode("AUTO")} /> Auto
        </label>
        <p className="fp-note">
          {isApcDrive && !p.apcOn ? "Auto becomes available when the APC is engaged." : `Auto: ${def.autoText}.`}
        </p>
      </fieldset>

      <div className="fp-sp">
        <label htmlFor={`fp-sp-${k}`}>{editsUgp ? "Chamber 2 pressure setpoint" : "Setpoint"}</label>
        <div className="fp-row">
          <button type="button" disabled={readOnly} onClick={(e) => nudge(-1, e)} aria-label="Lower setpoint">−</button>
          <input
            id={`fp-sp-${k}`}
            inputMode="decimal"
            value={readOnly ? spValue.toFixed(dec) : text}
            readOnly={readOnly}
            onChange={(e) => setText(e.target.value)}
            onBlur={(e) => !readOnly && commit(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !readOnly && commit(e.currentTarget.value)}
          />
          <button type="button" disabled={readOnly} onClick={(e) => nudge(1, e)} aria-label="Raise setpoint">+</button>
          <span className="fp-unit">{editsUgp ? "mbar" : def.unit}</span>
        </div>
        {readOnly && <p className="fp-note">{apcControlled ? "Setpoint written by the APC every minute. Switch to Manual to take over." : "Setpoint follows the kiln feed ratio."}</p>}
      </div>

      <div className="fp-bar" aria-hidden="true">
        <span className="fp-fill" style={{ width: `${Math.max(0, Math.min(100, pct))}%` }} />
        <span className="fp-spmark" style={{ left: `${Math.max(0, Math.min(100, spPct))}%` }} />
      </div>
      <dl className="fp-vals">
        <div><dt>Actual</dt><dd>{d.pv.toFixed(def.step < 1 ? 2 : 0)} {def.unit}</dd></div>
        <div><dt>Motor current</dt><dd>{amps.toFixed(0)} A</dd></div>
        {k === "grate" && <div><dt>Chamber 2</dt><dd>{p.x.ugp.toFixed(1)} mbar</dd></div>}
        {k === "kiln" && <div><dt>Torque</dt><dd>{p.x.torque.toFixed(0)} %</dd></div>}
      </dl>
      {spark.length > 0 && (
        <div className="fp-trend">
          <span>Last {spark.length} min</span>
          <Spark data={spark} />
        </div>
      )}

      <section className="fp-sec">
        <h3>Start permissives</h3>
        <ul className="fp-ilk">
          {perms.map((c) => (
            <li key={c.label} className={c.ok ? "ok" : "bad"}>
              <span aria-hidden="true">{c.ok ? "✓" : "✕"}</span> {c.label}
              <span className="sr-only">{c.ok ? " (satisfied)" : " (not satisfied)"}</span>
            </li>
          ))}
        </ul>
        <h3>Trip interlocks</h3>
        <p className="fp-note">{TRIP_TEXT[k]}</p>
      </section>

      <section className="fp-sec">
        <h3>Active alarms</h3>
        {alarms.length === 0 ? (
          <p className="fp-note">No active alarms on related measurements.</p>
        ) : (
          <ul className="fp-alarms">
            {alarms.map((a) => (
              <li key={a.key} className={`fp-a${a.prio}`}>
                <b>{a.lvl}</b> {a.label}: {(p.x[a.key] * (a.key === "calcDeg" ? 100 : 1)).toFixed(PVS[a.key].dec)} {PVS[a.key].unit}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default Faceplate;
