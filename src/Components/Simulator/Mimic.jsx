import React from "react";
import { PVS } from "../../sim/kilnModel";

// Alarm state of a process value: "ok", "warn" (outside band) or "alarm" (critical)
export const pvState = (key, v) => {
  const crit = {
    bzt: v < 1350 || v > 1550,
    co: v > 3000,
    o2: v < 0.8,
    ugp: v > 80,
    calcT: v < 820 || v > 950,
    freeLime: v > 2.5,
  };
  if (crit[key]) return "alarm";
  const d = PVS[key];
  if (!d) return "ok";
  return v < d.lo || v > d.hi ? "warn" : "ok";
};

// Burning-zone colour: dull red when cold, orange at target, pale yellow when hot
const glow = (t) => {
  const stops = [
    [1150, [70, 22, 18]],
    [1350, [168, 42, 18]],
    [1450, [244, 126, 32]],
    [1560, [255, 214, 120]],
    [1650, [255, 246, 214]],
  ];
  if (t <= stops[0][0]) return `rgb(${stops[0][1].join(",")})`;
  for (let i = 1; i < stops.length; i++) {
    if (t <= stops[i][0]) {
      const [t0, c0] = stops[i - 1];
      const [t1, c1] = stops[i];
      const f = (t - t0) / (t1 - t0);
      return `rgb(${c0.map((c, j) => Math.round(c + (c1[j] - c) * f)).join(",")})`;
    }
  }
  return `rgb(${stops[stops.length - 1][1].join(",")})`;
};

const Tag = ({ x, y, label, value, unit, dec = 0, state = "ok", anchor = "start" }) => {
  const w = 118;
  const x0 = anchor === "end" ? x - w : anchor === "middle" ? x - w / 2 : x;
  return (
    <g className={`ks-tag ks-${state}`} transform={`translate(${x0},${y})`}>
      <rect width={w} height="34" rx="3" />
      {state !== "ok" && <rect className="ks-tag-flag" width="5" height="34" rx="1" />}
      <text x="10" y="13" className="ks-tag-label">{label}</text>
      <text x="10" y="29" className="ks-tag-value">
        {Number.isFinite(value) ? value.toFixed(dec) : "–"}
        <tspan className="ks-tag-unit"> {unit}</tspan>
      </text>
    </g>
  );
};

const Cyclone = ({ x, y }) => (
  <path
    className="ks-equip"
    d={`M${x - 22},${y} h44 v22 l-16,26 v10 h-12 v-10 l-16,-26 z`}
  />
);

const Mimic = ({ x, mv }) => {
  const bz = glow(x.bzt);
  const flameLen = Math.max(0, 30 + 9 * mv.fuelMain);
  const rotDur = mv.speed > 0.2 ? (6 / mv.speed).toFixed(2) : 0;
  const bed = Math.min(30, Math.max(3, (x.ugp / 110) * 30));

  return (
    <svg className="ks-mimic" viewBox="0 0 1000 352" role="img" aria-label="Kiln line overview: preheater, calciner, rotary kiln and cooler with live values">
      <defs>
        <linearGradient id="ksBz" x1="0" x2="1">
          <stop offset="0" stopColor="#8a8f94" stopOpacity="0" />
          <stop offset="0.45" stopColor={bz} stopOpacity="0.55" />
          <stop offset="1" stopColor={bz} />
        </linearGradient>
        <linearGradient id="ksFlame" x1="1" x2="0">
          <stop offset="0" stopColor="#fff7d6" />
          <stop offset="0.5" stopColor={bz} />
          <stop offset="1" stopColor={bz} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* ID fan and gas duct */}
      <circle className="ks-equip" cx="34" cy="62" r="16" />
      <path className="ks-equip-line" d="M34,50 l8,12 h-16 z" />
      <path className="ks-duct" d="M50,62 H66 V40 H105 V45" />

      {/* Preheater tower */}
      <Cyclone x={105} y={45} />
      <Cyclone x={175} y={98} />
      <Cyclone x={105} y={150} />
      <Cyclone x={175} y={202} />
      <path className="ks-duct" d="M105,103 V112 H175 V98" />
      <path className="ks-duct" d="M175,156 V166 H105 V150" />
      <path className="ks-duct" d="M105,208 V218 H175 V202" />
      <path className="ks-duct" d="M175,260 V272 H300 V246" />

      {/* Kiln feed */}
      <path className="ks-feed" d="M8,126 H140 V112" />
      <text x="8" y="140" className="ks-small">Kiln feed {mv.feed.toFixed(0)} t/h</text>

      {/* Calciner */}
      <rect className="ks-equip" x="232" y="70" width="38" height="150" rx="6" />
      <path className="ks-duct" d="M251,70 V58 H175 V98" />
      <path className="ks-duct" d="M251,220 V236 H300" />

      {/* Tertiary air duct from hood to calciner */}
      <path className="ks-duct ks-tad" d="M818,206 V24 H262 V70" />
      <text x="520" y="18" className="ks-small" textAnchor="middle">Tertiary air duct</text>

      {/* Smoke chamber */}
      <rect className="ks-equip" x="290" y="212" width="40" height="60" rx="3" />

      {/* Rotary kiln */}
      <g transform="rotate(3 560 234)">
        <rect className="ks-kiln" x="330" y="212" width="470" height="44" rx="4" />
        <rect x="560" y="214" width="238" height="40" fill="url(#ksBz)" />
        <line
          className="ks-kiln-rot"
          x1="334" x2="796" y1="234" y2="234"
          style={rotDur ? { animationDuration: `${rotDur}s` } : { animationPlayState: "paused" }}
        />
        <rect className="ks-tyre" x="410" y="208" width="10" height="52" />
        <rect className="ks-tyre" x="560" y="208" width="10" height="52" />
        <rect className="ks-tyre" x="710" y="208" width="10" height="52" />
        {mv.fuelMain > 0.2 && (
          <path d={`M800,234 L${800 - flameLen},229 Q${800 - flameLen - 10},234 ${800 - flameLen},239 Z`} fill="url(#ksFlame)" />
        )}
      </g>
      {/* Burner and hood */}
      <rect className="ks-equip" x="800" y="206" width="36" height="76" rx="3" />
      <path className="ks-equip-line" d="M836,250 H880" />
      <text x="884" y="254" className="ks-small">Burner {mv.fuelMain.toFixed(1)} t/h</text>

      {/* Cooler */}
      <rect className="ks-equip" x="800" y="282" width="180" height="44" rx="3" />
      <rect className="ks-bed" x="804" y={322 - bed} width="172" height={bed} />
      <text x="890" y="338" className="ks-small" textAnchor="middle">
        Grate cooler, grate {mv.grate.toFixed(1)} str/min
      </text>

      {/* Tags */}
      <Tag x={66} y={2} label="ID fan" value={mv.fan} unit="%" dec={1} />
      <Tag x={4} y={290} label="Cyclone 1 outlet" value={x.cyc1T} unit="°C" state={pvState("cyc1T", x.cyc1T)} />
      <Tag x={278} y={78} label="Calciner outlet" value={x.calcT} unit="°C" state={pvState("calcT", x.calcT)} />
      <Tag x={278} y={116} label="Calcination" value={x.calcDeg * 100} unit="%" state={pvState("calcDeg", x.calcDeg * 100)} />
      <Tag x={278} y={154} label="Calciner coal" value={mv.fuelCalc} unit="t/h" dec={1} />
      <Tag x={420} y={128} label="Kiln inlet O₂" value={x.o2} unit="%" dec={1} state={pvState("o2", x.o2)} />
      <Tag x={420} y={166} label="Kiln inlet CO" value={x.co} unit="ppm" state={pvState("co", x.co)} />
      <Tag x={544} y={128} label="Kiln inlet NOx" value={x.nox} unit="ppm" state={pvState("nox", x.nox)} />
      <Tag x={544} y={166} label="Kiln inlet temp." value={x.kilnInT} unit="°C" state={pvState("kilnInT", x.kilnInT)} />
      <Tag x={668} y={128} label="Burning zone" value={x.bzt} unit="°C" state={pvState("bzt", x.bzt)} />
      <Tag x={668} y={166} label="Secondary air" value={x.sat} unit="°C" state={pvState("sat", x.sat)} />
      <Tag x={420} y={278} label="Kiln torque" value={x.torque} unit="%" state={pvState("torque", x.torque)} />
      <Tag x={544} y={278} label="Kiln speed" value={mv.speed} unit="rpm" dec={2} />
      <Tag x={668} y={278} label="Undergrate press." value={x.ugp} unit="mbar" state={pvState("ugp", x.ugp)} />
      <Tag x={862} y={56} label="Clinker" value={x.clinker} unit="t/h" />
      <Tag x={862} y={94} label="Free lime (lab)" value={x.freeLimeLab} unit="%" dec={2} state={pvState("freeLime", x.freeLimeLab)} />
      <Tag x={862} y={132} label="Specific heat" value={x.heat} unit="kcal/kg" />
    </svg>
  );
};

export default Mimic;
