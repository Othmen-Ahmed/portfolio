import React from "react";
import { PVS } from "../../sim/plant";

// ISA-101 style: grey equipment, colour only for abnormal states.
// Alarm indicators: priority 1 = red square, priority 2 = amber triangle.
const glow = (t) => {
  const stops = [[1150, [70, 22, 18]], [1350, [168, 42, 18]], [1450, [244, 126, 32]], [1560, [255, 214, 120]], [1650, [255, 246, 214]]];
  if (t <= stops[0][0]) return `rgb(${stops[0][1].join(",")})`;
  for (let i = 1; i < stops.length; i++) {
    if (t <= stops[i][0]) {
      const [t0, c0] = stops[i - 1];
      const [t1, c1] = stops[i];
      const f = (t - t0) / (t1 - t0);
      return `rgb(${c0.map((c, j) => Math.round(c + (c1[j] - c) * f)).join(",")})`;
    }
  }
  return "rgb(255,246,214)";
};

const AlarmMark = ({ x, y, alarm }) => {
  if (!alarm) return null;
  const cls = `hm-amark${alarm.acked ? "" : " hm-unacked"}`;
  return alarm.prio === 1 ? (
    <g className={cls} transform={`translate(${x},${y})`}>
      <rect x="-8" y="-8" width="16" height="16" className="hm-a1" />
      <text y="4" textAnchor="middle">1</text>
    </g>
  ) : (
    <g className={cls} transform={`translate(${x},${y})`}>
      <path d="M0,-9 L9,7 L-9,7 Z" className="hm-a2" />
      <text y="5" textAnchor="middle">2</text>
    </g>
  );
};

const Tag = ({ x, y, k, v, alarms, w = 112, label }) => {
  const def = PVS[k];
  const a = alarms[k];
  return (
    <g className="hm-tag" transform={`translate(${x},${y})`}>
      <rect width={w} height="32" rx="2" />
      <text x="7" y="12" className="hm-tag-l">{label || def.label}</text>
      <text x="7" y="27" className="hm-tag-v">
        {Number.isFinite(v) ? v.toFixed(def.dec) : "–"}
        <tspan className="hm-tag-u"> {def.unit}</tspan>
      </text>
      <AlarmMark x={w + 10} y={16} alarm={a && a.active ? a : null} />
    </g>
  );
};

// Drive symbol: filled = running, hollow = stopped, red = tripped
const Drive = ({ x, y, k, d, onOpen, label, apcOn }) => {
  const st = d.tripped ? "tripped" : d.running ? "running" : "stopped";
  const mode = d.mode === "AUTO" ? (apcOn && ["fan", "feed", "fuelKiln", "fuelCalc"].includes(k) ? "APC" : "A") : "M";
  const mw = mode === "APC" ? 30 : 16;
  return (
    <g
      className={`hm-drive hm-${st}`}
      transform={`translate(${x},${y})`}
      role="button"
      tabIndex={0}
      aria-label={`Open faceplate: ${label}`}
      onClick={() => onOpen(k)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen(k);
        }
      }}
    >
      <circle r="13" />
      <text y="5" textAnchor="middle" className="hm-m">M</text>
      <rect x="16" y="-8" width={mw} height="16" rx="2" className={`hm-mode hm-mode-${mode}`} />
      <text x={16 + mw / 2} y="4" textAnchor="middle" className="hm-mode-t">{mode}</text>
      <text y="29" textAnchor="middle" className="hm-drive-l">{label}</text>
    </g>
  );
};

const Cyclone = ({ x, y }) => <path className="hm-eq" d={`M${x - 22},${y} h44 v22 l-16,26 v10 h-12 v-10 l-16,-26 z`} />;

const Mimic = ({ p, onOpen }) => {
  const { x, drives: dv, alarms } = p;
  const bz = glow(x.bzt);
  const flame = dv.fuelKiln.pv > 0.2 ? 30 + 9 * dv.fuelKiln.pv : 0;
  const rot = dv.kiln.pv > 0.2 ? (6 / dv.kiln.pv).toFixed(2) : 0;
  const bed = Math.min(30, Math.max(3, (x.ugp / 110) * 30));

  return (
    <svg className="hm-mimic" viewBox="0 0 1000 410" role="group" aria-label="Kiln line overview. Select a motor to open its faceplate.">
      <defs>
        <linearGradient id="hmBz" x1="0" x2="1">
          <stop offset="0" stopColor="#8a8f94" stopOpacity="0" />
          <stop offset="0.45" stopColor={bz} stopOpacity="0.5" />
          <stop offset="1" stopColor={bz} />
        </linearGradient>
        <linearGradient id="hmFlame" x1="1" x2="0">
          <stop offset="0" stopColor="#fff7d6" />
          <stop offset="0.5" stopColor={bz} />
          <stop offset="1" stopColor={bz} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Gas path */}
      <path className="hm-duct" d="M132,52 V30 H60 V46" />
      <path className="hm-duct hm-tad" d="M826,232 V40 H290 V92" />
      <text x="560" y="34" className="hm-small" textAnchor="middle">Tertiary air duct</text>

      {/* Preheater tower */}
      <Cyclone x={132} y={52} />
      <Cyclone x={200} y={106} />
      <Cyclone x={132} y={160} />
      <Cyclone x={200} y={214} />
      <path className="hm-duct" d="M132,110 V120 H200 V106" />
      <path className="hm-duct" d="M200,164 V174 H132 V160" />
      <path className="hm-duct" d="M132,218 V228 H200 V214" />
      <path className="hm-duct" d="M200,272 V286 H320 V268" />

      {/* Calciner and riser */}
      <rect className="hm-eq" x="270" y="92" width="40" height="160" rx="6" />
      <path className="hm-duct" d="M290,92 V72 H200 V106" />
      <path className="hm-duct" d="M290,252 V262 H320" />
      <rect className="hm-eq" x="312" y="236" width="40" height="64" rx="3" />

      {/* Kiln */}
      <g transform="rotate(3 580 260)">
        <rect className="hm-kiln" x="352" y="238" width="456" height="44" rx="4" />
        <rect x="575" y="240" width="231" height="40" fill="url(#hmBz)" />
        <line className="hm-rot" x1="356" x2="804" y1="260" y2="260" style={rot ? { animationDuration: `${rot}s` } : { animationPlayState: "paused" }} />
        <rect className="hm-tyre" x="430" y="234" width="10" height="52" />
        <rect className="hm-tyre" x="580" y="234" width="10" height="52" />
        <rect className="hm-tyre" x="730" y="234" width="10" height="52" />
        {flame > 0 && <path d={`M808,260 L${808 - flame},255 Q${798 - flame},260 ${808 - flame},265 Z`} fill="url(#hmFlame)" />}
      </g>
      <rect className="hm-eq" x="808" y="232" width="36" height="78" rx="3" />
      <path className="hm-line" d="M844,276 H900" />

      {/* Cooler */}
      <rect className="hm-eq" x="808" y="310" width="182" height="46" rx="3" />
      <rect className="hm-bed" x="812" y={352 - bed} width="174" height={bed} />

      {/* ID fan housing */}
      <circle className="hm-eq" cx="60" cy="62" r="16" />
      <path className="hm-line" d="M60,50 l8,12 h-16 z" />

      {/* Feed */}
      <path className="hm-feed" d="M10,168 H112 V122" />

      {/* Clickable drives */}
      <Drive x={30} y={104} k="fan" d={dv.fan} onOpen={onOpen} label="ID fan" apcOn={p.apcOn} />
      <Drive x={34} y={212} k="feed" d={dv.feed} onOpen={onOpen} label="Kiln feed" apcOn={p.apcOn} />
      <Drive x={232} y={318} k="fuelCalc" d={dv.fuelCalc} onOpen={onOpen} label="Calciner coal" apcOn={p.apcOn} />
      <Drive x={560} y={328} k="kiln" d={dv.kiln} onOpen={onOpen} label="Kiln drive" apcOn={p.apcOn} />
      <Drive x={918} y={240} k="fuelKiln" d={dv.fuelKiln} onOpen={onOpen} label="Burner coal" apcOn={p.apcOn} />
      <Drive x={890} y={372} k="grate" d={dv.grate} onOpen={onOpen} label="Grate drive" apcOn={p.apcOn} />

      {/* Process values */}
      <Tag x={150} y={0} k="cyc1T" v={x.cyc1T} alarms={alarms} label="Cyclone 1 outlet" />
      <Tag x={318} y={50} k="o2Ph" v={x.o2Ph} alarms={alarms} label="Preheater exit O₂" />
      <Tag x={452} y={50} k="co" v={x.co} alarms={alarms} label="Preheater exit CO" />
      <Tag x={318} y={100} k="calcT" v={x.calcT} alarms={alarms} label="Calciner outlet" />
      <Tag x={318} y={138} k="calcDeg" v={x.calcDeg * 100} alarms={alarms} label="Calcination" />
      <Tag x={452} y={150} k="o2" v={x.o2} alarms={alarms} label="Kiln inlet O₂" />
      <Tag x={452} y={188} k="kilnInT" v={x.kilnInT} alarms={alarms} label="Kiln inlet temp." />
      <Tag x={586} y={150} k="nox" v={x.nox} alarms={alarms} label="Kiln inlet NOx" />
      <Tag x={586} y={188} k="torque" v={x.torque} alarms={alarms} label="Kiln torque" />
      <Tag x={708} y={112} k="bzt" v={x.bzt} alarms={alarms} label="Burning zone" />
      <Tag x={708} y={150} k="sat" v={x.sat} alarms={alarms} label="Secondary air" />
      <Tag x={862} y={52} k="clinker" v={x.clinker} alarms={alarms} label="Clinker" w={112} />
      <Tag x={862} y={90} k="freeLimeLab" v={x.freeLimeLab} alarms={alarms} label="Free lime (lab)" w={112} />
      <Tag x={862} y={128} k="heat" v={x.heat} alarms={alarms} label="Specific heat" w={112} />
      <Tag x={660} y={334} k="ugp" v={x.ugp} alarms={alarms} label="Chamber 2 press." w={112} />

      <text x="10" y="162" className="hm-small">{dv.feed.pv.toFixed(0)} t/h</text>
      <text x="80" y="66" className="hm-small">{dv.fan.pv.toFixed(1)} %</text>
      <text x="852" y="300" className="hm-small">{dv.fuelKiln.pv.toFixed(1)} t/h</text>
      <text x="270" y="338" className="hm-small">{dv.fuelCalc.pv.toFixed(1)} t/h</text>
      <text x="598" y="333" className="hm-small">{dv.kiln.pv.toFixed(2)} rpm</text>
      <text x="812" y="376" className="hm-small">{dv.grate.pv.toFixed(1)} str/min</text>
    </svg>
  );
};

export default Mimic;
