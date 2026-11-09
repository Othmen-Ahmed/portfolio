import React, { useEffect, useState } from "react";

// One operator handle: typed setpoint, step buttons, actual value bar.
const Faceplate = ({ mv, sp, pv, onChange }) => {
  const [text, setText] = useState(String(sp));
  const dec = mv.step < 1 ? (mv.step < 0.1 ? 2 : 1) : 0;

  useEffect(() => {
    setText(sp.toFixed(dec));
  }, [sp, dec]);

  const commit = (v) => {
    const n = parseFloat(String(v).replace(",", "."));
    if (Number.isFinite(n)) onChange(Math.min(mv.max, Math.max(mv.min, n)));
    else setText(sp.toFixed(dec));
  };
  const nudge = (dir, e) => commit(sp + dir * mv.step * (e.shiftKey ? 5 : 1));
  const pct = ((pv - mv.min) / (mv.max - mv.min)) * 100;
  const spPct = ((sp - mv.min) / (mv.max - mv.min)) * 100;
  const moving = Math.abs(sp - pv) > mv.step / 2;

  return (
    <div className="ks-face">
      <label className="ks-face-label" htmlFor={`sp-${mv.key}`}>
        {mv.label}
      </label>
      <div className="ks-face-row">
        <button type="button" onClick={(e) => nudge(-1, e)} aria-label={`Lower ${mv.label}`} title="Shift-click for ×5">
          −
        </button>
        <input
          id={`sp-${mv.key}`}
          inputMode="decimal"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={(e) => commit(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") commit(e.currentTarget.value);
            if (e.key === "ArrowUp") { e.preventDefault(); nudge(1, e); }
            if (e.key === "ArrowDown") { e.preventDefault(); nudge(-1, e); }
          }}
        />
        <button type="button" onClick={(e) => nudge(1, e)} aria-label={`Raise ${mv.label}`} title="Shift-click for ×5">
          +
        </button>
        <span className="ks-face-unit">{mv.unit}</span>
      </div>
      <div className="ks-face-bar" aria-hidden="true">
        <span className="ks-face-fill" style={{ width: `${pct}%` }} />
        <span className="ks-face-sp" style={{ left: `${spPct}%` }} />
      </div>
      <div className="ks-face-pv">
        Actual <b>{pv.toFixed(dec)}</b>
        {moving && <span className="ks-ramping"> ramping</span>}
      </div>
    </div>
  );
};

export default Faceplate;
