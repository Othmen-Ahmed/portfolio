// Dynamic training model of a generic 5,000 t/d dry-process line:
// 5-stage preheater + calciner (tertiary air duct), rotary kiln Ø4.8 x 74 m,
// reciprocating grate cooler. Values and dynamics are taken from published
// sources (see src/sim/SOURCES.md); the structure is a normalized heat
// balance, so trends and interactions are realistic but numbers are indicative.

export const DT = 5; // plant seconds per integration step

// CO trip at the preheater exit, protecting the electrostatic precipitator (1 % = 10,000 ppm)
export const CO_TRIP_PPM = 10000;

const NOM = {
  feed: 335, // t/h kiln feed (raw meal : clinker = 1.6)
  fuelKiln: 10.0, // t/h coal to main burner (40 %)
  fuelCalc: 15.2, // t/h coal to calciner (60 %)
  fan: 82, // % ID fan speed
  kiln: 3.8, // rpm
  grate: 10, // strokes/min
  ncv: 6000, // kcal/kg coal
  rmf: 1.6, // raw meal factor
};
NOM.clinker = NOM.feed / NOM.rmf;
export { NOM };

// Drives shown on the HMI. "rate" = actuator ramp per plant minute.
export const DRIVES = [
  { key: "fan", tag: "471-FN1", name: "Preheater ID fan", unit: "%", min: 40, max: 100, step: 0.5, rate: 3, ratedA: 420, apc: true,
    autoText: "Setpoint from APC" },
  { key: "feed", tag: "361-WF1", name: "Kiln feed (bin + flow gate)", unit: "t/h", min: 0, max: 400, step: 1, rate: 8, ratedA: 95, apc: true,
    autoText: "Setpoint from APC" },
  { key: "kiln", tag: "411-KD1", name: "Kiln main drive", unit: "rpm", min: 0.5, max: 4.5, step: 0.05, rate: 0.3, ratedA: 780, apc: false,
    autoText: "Ratio to kiln feed (3.8 rpm at 335 t/h)" },
  { key: "fuelKiln", tag: "481-WF1", name: "Main burner coal feeder", unit: "t/h", min: 0, max: 16, step: 0.1, rate: 0.6, ratedA: 30, apc: true,
    autoText: "Setpoint from APC" },
  { key: "fuelCalc", tag: "451-WF1", name: "Calciner coal feeder", unit: "t/h", min: 0, max: 24, step: 0.1, rate: 0.8, ratedA: 30, apc: true,
    autoText: "Setpoint from APC" },
  { key: "grate", tag: "431-GD1", name: "Cooler grate drive", unit: "str/min", min: 4, max: 20, step: 0.2, rate: 2, ratedA: 160, apc: false,
    autoText: "PID on chamber 2 pressure" },
];

// Process values with alarm limits (LL, L, H, HH); null = no limit
export const PVS = {
  bzt: { label: "Burning zone temp.", unit: "°C", dec: 0, ll: 1350, l: 1420, h: 1490, hh: 1550 },
  nox: { label: "Kiln inlet NOx", unit: "ppm", dec: 0, ll: null, l: 300, h: 1600, hh: null },
  o2: { label: "Kiln inlet O₂", unit: "%", dec: 2, ll: 0.8, l: 1.5, h: 3.5, hh: null },
  o2Ph: { label: "Preheater exit O₂", unit: "%", dec: 2, ll: 1.0, l: 1.8, h: 5, hh: null },
  co: { label: "Preheater exit CO", unit: "ppm", dec: 0, ll: null, l: null, h: 2000, hh: 5000 },
  calcT: { label: "Calciner outlet temp.", unit: "°C", dec: 0, ll: null, l: 860, h: 900, hh: 950 },
  calcDeg: { label: "Degree of calcination", unit: "%", dec: 1, ll: null, l: 88, h: null, hh: null },
  cyc1T: { label: "Cyclone 1 outlet temp.", unit: "°C", dec: 0, ll: null, l: null, h: 360, hh: 380 },
  kilnInT: { label: "Kiln inlet temp.", unit: "°C", dec: 0, ll: null, l: null, h: 1180, hh: null },
  torque: { label: "Kiln drive torque", unit: "%", dec: 0, ll: null, l: 45, h: 90, hh: 105 },
  sat: { label: "Secondary air temp.", unit: "°C", dec: 0, ll: null, l: 900, h: 1200, hh: null },
  ugp: { label: "Cooler chamber 2 pressure", unit: "mbar", dec: 0, ll: null, l: 40, h: 70, hh: 73 },
  freeLimeLab: { label: "Free lime (lab)", unit: "%", dec: 2, ll: null, l: 0.8, h: 1.5, hh: 2.5 },
  clinker: { label: "Clinker production", unit: "t/h", dec: 0, ll: null, l: null, h: null, hh: null },
  heat: { label: "Specific heat", unit: "kcal/kg", dec: 0, ll: null, l: null, h: 780, hh: null },
};

export const SCENARIOS = [
  { id: "steady", name: "Steady shift", noise: 2, events: [],
    brief: "Normal operation with small swings in raw meal burnability and coal quality. Keep the kiln stable at full production." },
  { id: "hardmeal", name: "Hard-burning raw meal", noise: 1, events: [{ at: 600, type: "burn", value: 1.08, msg: "Lab: raw meal LSF rising, meal harder to burn" }],
    brief: "After about 10 minutes the raw mill sends meal with a higher LSF that needs more heat. Watch NOx and torque before free lime." },
  { id: "coal", name: "Coal quality drop", noise: 1, events: [{ at: 480, type: "cv", value: 0.9, msg: "Coal mill: new stockpile, NCV about 10 % lower" }],
    brief: "After about 8 minutes a coal with 10 % lower calorific value reaches both burners. Same t/h, less heat, less air demand." },
  { id: "coating", name: "Coating collapse", noise: 1, events: [{ at: 900, type: "coating", value: 0.18, msg: "Shell scanner: coating fall in the burning zone" }],
    brief: "At about 15 minutes a large ring of coating falls into the burning zone. The kiln cools fast and the cooler gets a surge." },
  { id: "push", name: "Production push", noise: 1, events: [], target: 220,
    brief: "Management wants 220 t/h of clinker (kiln feed about 352 t/h) without losing the kiln." },
];

const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
const lag = (x, target, tau) => x + (target - x) * Math.min(1, DT / tau);

function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

class Delay {
  constructor(seconds, value) {
    this.buf = Array(Math.max(1, Math.round(seconds / DT))).fill(value);
  }
  push(v) {
    this.buf.push(v);
    return this.buf.shift();
  }
}

// Steady-state process targets for the current actuator values
function targets(a, d, x, feedBz, calcBz) {
  const cv = d.cv;
  const fan = a.fan;
  const lamK = (1.117 * (fan / NOM.fan) * NOM.fuelKiln) / Math.max(0.3, a.fuelKiln * cv);
  const lamT = (1.15 * (fan / NOM.fan) * (NOM.fuelKiln + NOM.fuelCalc)) / Math.max(0.5, (a.fuelKiln + a.fuelCalc) * cv);
  const etaK = lamK >= 1.02 ? 1 : clamp(1 - 3 * (1.02 - lamK), 0.5, 1);
  const etaC = lamT >= 1.01 ? 1 : clamp(1 - 3 * (1.01 - lamT), 0.5, 1);
  const o2 = fan < 5 ? 20.9 : clamp(21 * (1 - 1 / lamK), 0.05, 20.9);
  const o2Ph = fan < 5 ? 20.9 : clamp(21 * (1 - 1 / lamT), 0.05, 20.9);
  const co = fan < 5 ? 0 : 80 + (lamK < 1.05 ? 2.0e6 * (1.05 - lamK) ** 2 : 0) + (lamT < 1.02 ? 6e5 * (1.02 - lamT) ** 2 : 0);

  // Calciner: fuel-to-meal ratio sets temperature and calcination
  const rc = a.feed > 5 ? (a.fuelCalc * cv * etaC / a.feed) / (NOM.fuelCalc / NOM.feed) : 0;
  const calcT = a.feed > 5 ? clamp(880 + 200 * (rc - 1), 650, 1100) : clamp(550 + 25 * a.fuelCalc * cv, 300, 1100);
  const calcDeg = a.feed > 5 ? clamp(0.93 + 0.3 * (rc - 1), 0.5, 0.97) : 0.97;

  // Cooler: bed depth ~ clinker flow / grate speed
  const bed = a.grate > 0.5 ? (x.clinker / NOM.clinker) / (a.grate / NOM.grate) : 3;
  const ugp = clamp(58 * bed, 5, 120);
  const sat = clamp(1050 + 200 * (bed - 1) - (x.clinker < 20 ? 400 : 0), 500, 1250);

  // Kiln heat balance (relative units, 1 = nominal)
  const supply = (a.fuelKiln * cv * etaK) / NOM.fuelKiln + 0.0008 * (x.sat - 1050) - 0.5 * (fan / NOM.fan - 1);
  const demand = Math.max(0.15, (feedBz / NOM.feed) * d.burn * (1 + 1.6 * (0.93 - calcBz)) + d.coating);
  const kilnF = a.kiln / NOM.kiln;
  let bzt = 1450 + 300 * (supply / demand - 1) - 80 * (kilnF - 1);
  bzt = clamp(bzt, 800, 1720);

  const fill = a.kiln > 0.1 ? (a.feed / NOM.feed) / kilnF : 0;
  const torque = a.kiln > 0.1 ? clamp(62 + 0.15 * (x.bzt - 1450) + 25 * (fill - 1) + 100 * d.coating, 5, 120) : 0;
  const nox = fan < 5 ? 0 : clamp(650 * Math.exp((bzt - 1450) / 60) * (0.6 + (0.4 * Math.min(o2, 4)) / 2.2), 20, 3000);
  const resid = fill > 0.05 ? 1 / fill : 1;
  const freeLime = clamp(1.0 * Math.exp(-(x.bzt - 1450) / 35) * d.burn ** 3 * (1 + 0.6 * (resid - 1)), 0.2, 9);
  const cyc1T = clamp(320 + 2.5 * (fan - NOM.fan) + 25 * (rc - 1) - 30 * (a.feed / NOM.feed - 1), 100, 500);
  const kilnInT = clamp(1100 + 0.4 * (x.bzt - 1450) + 4 * (fan - NOM.fan), 300, 1300);
  return { o2, o2Ph, co, calcT, calcDeg, ugp, sat, bzt, torque, nox, freeLime, cyc1T, kilnInT };
}

export function createPlant(scenarioId = "steady", seed = Date.now(), opts = {}) {
  const sc = SCENARIOS.find((s) => s.id === scenarioId) || SCENARIOS[0];
  const drives = {};
  for (const dr of DRIVES) {
    const v = NOM[dr.key];
    drives[dr.key] = {
      running: true, tripped: false, tripReason: "", mode: dr.key === "grate" || dr.key === "kiln" ? "AUTO" : "MAN", sp: v, pv: v,
    };
  }
  const a0 = Object.fromEntries(DRIVES.map((d) => [d.key, NOM[d.key]]));
  const x0 = { bzt: 1450, sat: 1050, clinker: NOM.clinker, calcDeg: 0.93 };
  const t0 = targets(a0, { burn: 1, cv: 1, coating: 0 }, x0, NOM.feed, 0.93);
  const x = {
    ...t0, bzt: 1450, bztFast: 1450, bztSlow: 1450, clinker: NOM.clinker,
    freeLimeTrue: t0.freeLime, freeLimeLab: t0.freeLime, heat: ((NOM.fuelKiln + NOM.fuelCalc) * NOM.ncv) / NOM.clinker,
  };
  return {
    t: 0, scenario: sc, rand: rng(seed), noiseOn: opts.noise !== false, eventsOn: opts.events !== false,
    drives, x, ugpSp: 58, pid: { i: NOM.grate },
    dist: { burn: 1, cv: 1, coating: 0, burnNoise: 0, cvNoise: 0 },
    dl: {
      bzt: new Delay(160, 1450), feed: new Delay(900, NOM.feed), calc: new Delay(900, 0.93),
      fl: new Delay(1500, t0.freeLime), clinker: new Delay(1500, NOM.clinker), o2: new Delay(30, t0.o2), o2Ph: new Delay(30, t0.o2Ph), co: new Delay(30, t0.co),
    },
    lab: { next: 3600, pending: null },
    coTripLatched: false, timers: {}, apcOn: false,
    alarms: {}, // key -> {level, active, acked, since}
    events: [{ t: 0, level: "info", msg: `Scenario started: ${sc.name}` }],
    fired: new Set(),
    history: [],
    stats: { MAN: newStats(), APC: newStats() },
  };
}

function newStats() {
  return { n: 0, bzt: [0, 0], o2: [0, 0], heat: [0, 0], feed: [0, 0], inHalfPct: 0, inBand: 0, clinkerT: 0, offSpecT: 0 };
}

export function log(p, level, msg) {
  p.events.unshift({ t: p.t, level, msg });
  if (p.events.length > 80) p.events.pop();
}

// ---------- interlocks ----------
export function permissives(p, key) {
  const d = p.drives;
  const ok = (k) => d[k].running && !d[k].tripped;
  const list = {
    fan: [{ label: "No trip active on the fan", ok: !d.fan.tripped }],
    feed: [
      { label: "ID fan running", ok: ok("fan") },
      { label: "Kiln main drive running", ok: ok("kiln") },
    ],
    kiln: [{ label: "Kiln drive not tripped (torque below 105 %)", ok: !d.kiln.tripped }],
    fuelKiln: [
      { label: "ID fan running", ok: ok("fan") },
      { label: "CO trip reset (preheater CO below 1000 ppm)", ok: !p.coTripLatched },
    ],
    fuelCalc: [
      { label: "ID fan running", ok: ok("fan") },
      { label: "Kiln feed running (meal in the calciner)", ok: ok("feed") },
      { label: "CO trip reset (preheater CO below 1000 ppm)", ok: !p.coTripLatched },
    ],
    grate: [{ label: "Grate drive not tripped", ok: !d.grate.tripped }],
  };
  return list[key] || [];
}

export const TRIP_TEXT = {
  fan: "Operator stop trips feed and both coal feeders",
  feed: "Trips if ID fan or kiln drive stops",
  kiln: "Trips on torque above 105 % for 30 s; stopping it trips the kiln feed",
  fuelKiln: "Trips if ID fan stops or preheater exit CO exceeds 1 % (ESP protection)",
  fuelCalc: "Trips if ID fan or kiln feed stops, preheater exit CO exceeds 1 %, or calciner exceeds 980 °C for 60 s",
  grate: "No automatic trip",
};

export function canStart(p, key) {
  return permissives(p, key).every((c) => c.ok);
}

export function startDrive(p, key) {
  const dr = p.drives[key];
  if (!canStart(p, key)) return false;
  dr.running = true;
  dr.tripped = false;
  dr.tripReason = "";
  log(p, "info", `${tagOf(key)} started`);
  return true;
}

export function stopDrive(p, key, reason = "") {
  const dr = p.drives[key];
  if (!dr.running) return;
  dr.running = false;
  if (reason) {
    dr.tripped = true;
    dr.tripReason = reason;
    log(p, "alarm", `${tagOf(key)} TRIPPED: ${reason}`);
  } else log(p, "info", `${tagOf(key)} stopped by operator`);
}

export function resetTrip(p, key) {
  const dr = p.drives[key];
  if (key === "fuelKiln" || key === "fuelCalc") {
    if (p.coTripLatched && p.x.co < 1000) {
      p.coTripLatched = false;
      log(p, "info", "CO trip reset");
    }
  }
  if (dr.tripped && !(p.coTripLatched && (key === "fuelKiln" || key === "fuelCalc"))) {
    dr.tripped = false;
    dr.tripReason = "";
  }
}

export const tagOf = (key) => {
  const d = DRIVES.find((x) => x.key === key);
  return d ? `${d.tag} ${d.name}` : key;
};

function interlocks(p) {
  const d = p.drives;
  const run = (k) => d[k].running;
  if (!run("fan")) {
    ["feed", "fuelKiln", "fuelCalc"].forEach((k) => run(k) && stopDrive(p, k, "ID fan stopped"));
  }
  if (!run("kiln") && run("feed")) stopDrive(p, "feed", "Kiln drive stopped");
  if (!run("feed") && run("fuelCalc")) stopDrive(p, "fuelCalc", "Kiln feed stopped");
  if (p.x.co > CO_TRIP_PPM && !p.coTripLatched) {
    p.coTripLatched = true;
    log(p, "alarm", "CO TRIP: preheater exit CO above 1 % (ESP protection)");
    ["fuelKiln", "fuelCalc"].forEach((k) => run(k) && stopDrive(p, k, "CO above 1 % at the ESP inlet"));
  }
  p.timers.torque = p.x.torque > 105 ? (p.timers.torque || 0) + DT : 0;
  if (p.timers.torque >= 30 && run("kiln")) stopDrive(p, "kiln", "Torque above 105 % for 30 s");
  p.timers.calc = p.x.calcT > 980 ? (p.timers.calc || 0) + DT : 0;
  if (p.timers.calc >= 60 && run("fuelCalc")) stopDrive(p, "fuelCalc", "Calciner above 980 °C for 60 s");
}

// ---------- alarms ----------
function alarmLevel(def, v) {
  if (def.hh != null && v >= def.hh) return { lvl: "HH", prio: 1 };
  if (def.ll != null && v <= def.ll) return { lvl: "LL", prio: 1 };
  if (def.h != null && v >= def.h) return { lvl: "H", prio: 2 };
  if (def.l != null && v <= def.l) return { lvl: "L", prio: 2 };
  return null;
}

function updateAlarms(p) {
  for (const [key, def] of Object.entries(PVS)) {
    const v = p.x[key === "calcDeg" ? "calcDeg" : key] * (key === "calcDeg" ? 100 : 1);
    const a = alarmLevel(def, v);
    const cur = p.alarms[key];
    if (a && (!cur || !cur.active || cur.lvl !== a.lvl)) {
      p.alarms[key] = { key, lvl: a.lvl, prio: a.prio, active: true, acked: false, since: p.t, label: def.label };
      log(p, a.prio === 1 ? "alarm" : "warn", `${a.lvl} alarm: ${def.label} ${v.toFixed(def.dec)} ${def.unit}`);
    } else if (!a && cur && cur.active) {
      cur.active = false;
      if (cur.acked) delete p.alarms[key];
    }
  }
}

export function ackAlarms(p) {
  for (const [k, a] of Object.entries(p.alarms)) {
    a.acked = true;
    if (!a.active) delete p.alarms[k];
  }
}

// ---------- main step ----------
export function step(p) {
  p.t += DT;
  const d = p.dist;

  if (p.eventsOn) {
    p.scenario.events.forEach((ev, i) => {
      if (!p.fired.has(i) && p.t >= ev.at) {
        p.fired.add(i);
        log(p, "warn", ev.msg);
        if (ev.type === "burn") d.burnTarget = ev.value;
        if (ev.type === "cv") d.cvTarget = ev.value;
        if (ev.type === "coating") d.coating = ev.value;
      }
    });
  }
  if (d.burnTarget) d.burn = lag(d.burn, d.burnTarget, 600);
  if (d.cvTarget) d.cv = lag(d.cv, d.cvTarget, 300);
  d.coating = lag(d.coating, 0, 900);
  if (p.noiseOn) {
    const n = p.scenario.noise;
    d.burnNoise = clamp(d.burnNoise * 0.999 + (p.rand() - 0.5) * 0.007 * n, -0.08, 0.08);
    d.cvNoise = clamp(d.cvNoise * 0.999 + (p.rand() - 0.5) * 0.004 * n, -0.05, 0.05);
    d.feedNoise = clamp((d.feedNoise || 0) * 0.995 + (p.rand() - 0.5) * 0.004 * n, -0.03, 0.03);
  }
  const dist = { burn: d.burn + d.burnNoise, cv: d.cv + d.cvNoise, coating: d.coating };

  interlocks(p);

  // Local loops: kiln speed ratio to feed, grate PID on chamber 2 pressure
  const dk = p.drives.kiln;
  if (dk.mode === "AUTO") dk.sp = clamp((NOM.kiln * Math.max(p.drives.feed.sp, 120)) / NOM.feed, 0.5, 4.5);
  const dg = p.drives.grate;
  if (dg.mode === "AUTO" && dg.running) {
    const e = p.x.ugp - p.ugpSp; // too thick bed -> speed up the grate
    p.pid.i = clamp(p.pid.i + (0.08 * e * DT) / 60, 4, 20);
    dg.sp = clamp(p.pid.i + 0.05 * e, 4, 20);
  }

  // Actuators: ramp toward setpoint, zero when stopped
  const a = {};
  for (const dr of DRIVES) {
    const s = p.drives[dr.key];
    const target = s.running ? s.sp : 0;
    const maxMove = (dr.rate * (s.running ? 1 : 6) * DT) / 60;
    s.pv = s.pv + clamp(target - s.pv, -maxMove, maxMove);
    a[dr.key] = Math.max(0, s.pv);
  }
  a.feed *= 1 + (d.feedNoise || 0); // flow gate / bin level variation

  const x = p.x;
  const feedBz = p.dl.feed.push(a.feed);
  const calcBz = p.dl.calc.push(x.calcDeg);
  const tg = targets(a, dist, x, feedBz, calcBz);

  // Burning zone: dead time 160 s, fast mode tau 36 min (70 %), slow refractory mode tau 5.3 h (30 %)
  const bztD = p.dl.bzt.push(tg.bzt);
  x.bztFast = lag(x.bztFast, bztD, 2150);
  x.bztSlow = lag(x.bztSlow, bztD, 19000);
  x.bzt = 0.7 * x.bztFast + 0.3 * x.bztSlow;

  x.nox = lag(x.nox, tg.nox, 240);
  x.o2 = lag(x.o2, p.dl.o2.push(tg.o2), 45);
  x.o2Ph = lag(x.o2Ph, p.dl.o2Ph.push(tg.o2Ph), 60);
  x.co = lag(x.co, p.dl.co.push(tg.co), 30);
  x.calcT = lag(x.calcT, tg.calcT, 90);
  x.calcDeg = lag(x.calcDeg, tg.calcDeg, 120);
  x.ugp = lag(x.ugp, tg.ugp, 240);
  x.sat = lag(x.sat, tg.sat, 600);
  x.torque = lag(x.torque, tg.torque, 300);
  x.cyc1T = lag(x.cyc1T, tg.cyc1T, 180);
  x.kilnInT = lag(x.kilnInT, tg.kilnInT, 180);
  x.clinker = lag(x.clinker, p.dl.clinker.push(a.feed / NOM.rmf), 300);
  x.freeLimeTrue = lag(x.freeLimeTrue, tg.freeLime, 300);
  const flAtCooler = p.dl.fl.push(x.freeLimeTrue);
  x.flAtCooler = flAtCooler;

  // Lab: hourly clinker sample, result 15 min later
  if (p.t >= p.lab.next) {
    p.lab.next += 3600;
    p.lab.pending = { at: p.t + 900, v: flAtCooler * (1 + (p.rand() - 0.5) * 0.06) };
  }
  if (p.lab.pending && p.t >= p.lab.pending.at) {
    x.freeLimeLab = p.lab.pending.v;
    p.lab.pending = null;
    log(p, x.freeLimeLab > 1.5 || x.freeLimeLab < 0.8 ? "warn" : "info", `Lab: free lime ${x.freeLimeLab.toFixed(2)} % (sample taken 15 min ago)`);
  }

  x.heat = x.clinker > 20 ? ((a.fuelKiln + a.fuelCalc) * NOM.ncv * dist.cv) / x.clinker : 0;
  x.ncv = NOM.ncv * dist.cv;

  updateAlarms(p);

  // Statistics per operating mode, one sample per minute
  if (p.t % 60 === 0) {
    const st = p.stats[p.apcOn ? "APC" : "MAN"];
    st.n++;
    const acc = (arr, v) => { arr[0] += v; arr[1] += v * v; };
    acc(st.bzt, x.bzt); acc(st.o2, x.o2); acc(st.heat, x.heat); acc(st.feed, a.feed);
    if (Math.abs(x.bzt - 1450) <= 7.25) st.inHalfPct++;
    if (x.bzt >= 1420 && x.bzt <= 1490 && x.o2 >= 1.5 && x.o2 <= 3.5 && x.co < 1000 && x.o2Ph >= 1.8 && x.calcT >= 860 && x.calcT <= 900) st.inBand++;
    st.clinkerT += x.clinker / 60;
    if (flAtCooler > 2.5) st.offSpecT += x.clinker / 60;

    p.history.push({
      t: p.t, apc: p.apcOn, bzt: x.bzt, nox: x.nox, o2: x.o2, o2Ph: x.o2Ph, co: x.co, calcT: x.calcT, sat: x.sat, torque: x.torque,
      freeLime: x.freeLimeLab, clinker: x.clinker, heat: x.heat, feed: a.feed, fuelKiln: a.fuelKiln, fuelCalc: a.fuelCalc, fan: a.fan,
    });
    if (p.history.length > 1000) p.history.shift();
  }
}

export function summarize(st) {
  const n = Math.max(1, st.n);
  const ms = ([s, s2]) => {
    const m = s / n;
    return { mean: m, sd: Math.sqrt(Math.max(0, s2 / n - m * m)) };
  };
  return {
    minutes: st.n, bzt: ms(st.bzt), o2: ms(st.o2), heat: ms(st.heat), feed: ms(st.feed),
    inHalfPct: (100 * st.inHalfPct) / n, inBand: (100 * st.inBand) / n,
    clinkerT: st.clinkerT, offSpecPct: st.clinkerT > 0 ? (100 * st.offSpecT) / st.clinkerT : 0,
  };
}

// Literature benchmark, Stadler, Poland & Gallestey, Control Eng. Practice 19 (2011), Table 1
export const LITERATURE = {
  source: "Stadler, Poland & Gallestey (2011), ABB Expert Optimizer at Holcim Siggenthal, 10-day periods",
  manual: { bztSd: 6.38, o2Sd: 0.93, feedSd: 11.88, heatSdKJ: 439.9, inHalfPct: 86.7 },
  mpc: { bztSd: 2.94, o2Sd: 0.39, feedSd: 0.36, heatSdKJ: 76.1, inHalfPct: 97.7 },
};
