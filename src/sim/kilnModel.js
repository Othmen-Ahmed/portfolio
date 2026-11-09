// Simplified dynamic model of a dry-process kiln line
// (5-stage preheater + precalciner, rotary kiln, grate cooler).
// It is a training model: trends and cause/effect are realistic,
// absolute numbers are indicative only.

export const DT = 10; // plant seconds per integration step

// Operator handles (manipulated variables)
export const MVS = [
  { key: "feed", label: "Kiln feed", unit: "t/h", min: 0, max: 400, step: 5, nominal: 330, rate: 10 },
  { key: "fuelMain", label: "Main burner coal", unit: "t/h", min: 0, max: 14, step: 0.1, nominal: 9.0, rate: 0.5 },
  { key: "fuelCalc", label: "Calciner coal", unit: "t/h", min: 0, max: 20, step: 0.1, nominal: 14.0, rate: 0.6 },
  { key: "fan", label: "ID fan speed", unit: "%", min: 40, max: 100, step: 0.5, nominal: 85, rate: 3 },
  { key: "speed", label: "Kiln speed", unit: "rpm", min: 1, max: 4.5, step: 0.05, nominal: 3.8, rate: 0.3 },
  { key: "grate", label: "Cooler grate speed", unit: "str/min", min: 5, max: 22, step: 0.5, nominal: 12, rate: 2 },
];
// "rate" = max actuator movement per plant minute

// Process values shown to the operator, with their good operating band
export const PVS = {
  bzt: { label: "Burning zone temp.", unit: "°C", lo: 1420, hi: 1480, dec: 0 },
  nox: { label: "Kiln inlet NOx", unit: "ppm", lo: 450, hi: 1000, dec: 0 },
  o2: { label: "Kiln inlet O₂", unit: "%", lo: 1.5, hi: 3.5, dec: 1 },
  co: { label: "Kiln inlet CO", unit: "ppm", lo: 0, hi: 1000, dec: 0 },
  calcT: { label: "Calciner outlet temp.", unit: "°C", lo: 860, hi: 900, dec: 0 },
  calcDeg: { label: "Degree of calcination", unit: "%", lo: 90, hi: 96, dec: 0 },
  torque: { label: "Kiln drive torque", unit: "%", lo: 50, hi: 80, dec: 0 },
  freeLime: { label: "Free lime (lab)", unit: "%", lo: 0.8, hi: 2.0, dec: 2 },
  sat: { label: "Secondary air temp.", unit: "°C", lo: 950, hi: 1150, dec: 0 },
  ugp: { label: "Cooler undergrate pressure", unit: "mbar", lo: 40, hi: 70, dec: 0 },
  cyc1T: { label: "Cyclone 1 outlet temp.", unit: "°C", lo: 300, hi: 360, dec: 0 },
  kilnInT: { label: "Kiln inlet temp.", unit: "°C", lo: 1050, hi: 1180, dec: 0 },
  clinker: { label: "Clinker production", unit: "t/h", lo: 190, hi: 240, dec: 0 },
  heat: { label: "Specific heat", unit: "kcal/kg", lo: 0, hi: 760, dec: 0 },
};

// Variables used for the stability score (time inside band)
export const SCORED = ["bzt", "o2", "co", "calcT", "freeLimeTrue"];

export const SCENARIOS = [
  {
    id: "steady",
    name: "Steady shift",
    brief:
      "Normal operation with small variations in raw meal and coal quality. Keep every value in its band and hold production.",
    events: [],
    noise: 2,
  },
  {
    id: "hardmeal",
    name: "Hard-burning raw meal",
    brief:
      "After about 10 minutes the raw mill sends meal with a higher LSF. It needs more heat to burn. Watch NOx and torque, then free lime.",
    events: [{ at: 600, type: "burn", value: 1.1, msg: "Lab: raw meal LSF rising (harder to burn)" }],
    noise: 0.6,
  },
  {
    id: "coal",
    name: "Coal quality drop",
    brief:
      "A new coal stockpile with a lower calorific value arrives after about 8 minutes. The same t/h of coal now brings less heat.",
    events: [{ at: 480, type: "cv", value: 0.9, msg: "Coal mill: new stockpile, calorific value about 10 % lower" }],
    noise: 0.6,
  },
  {
    id: "coating",
    name: "Coating collapse",
    brief:
      "At about 15 minutes a large piece of coating falls into the burning zone. The kiln cools suddenly and the cooler gets a surge.",
    events: [{ at: 900, type: "coating", value: 0.22, msg: "Kiln shell scanner: coating fall in burning zone" }],
    noise: 0.6,
  },
  {
    id: "push",
    name: "Production push",
    brief:
      "The plant manager wants 230 t/h of clinker (kiln feed about 357 t/h). Raise production without losing the kiln.",
    events: [],
    noise: 0.6,
    target: 230,
  },
];

const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
const lag = (x, target, tau) => x + (target - x) * Math.min(1, DT / tau);

// Simple seeded random so runs are repeatable per scenario
function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function nominalSteadyState(m) {
  return computeTargets(m, { burn: 1, cv: 1, coating: 0 }, { calcDeg: 0.93, bzt: 1450, sat: 1050, clinker: 330 / 1.55 });
}

// Steady-state targets for the current inputs and disturbances
function computeTargets(m, d, x) {
  const cvF = d.cv;
  const feedF = m.feed / 330;
  const lamK = (1.13 * (m.fan / 85) * 9) / Math.max(0.3, m.fuelMain * cvF);
  const heatTot = (m.fuelMain + m.fuelCalc) * cvF;
  const lamT = (1.1 * (m.fan / 85) * 23) / Math.max(0.5, heatTot);

  const etaK = lamK >= 1.02 ? 1 : clamp(1 - (1.02 - lamK) * 3, 0.6, 1);
  const etaC = lamT >= 1.01 ? 1 : clamp(1 - (1.01 - lamT) * 3, 0.6, 1);

  const o2 = clamp(21 * (1 - 1 / lamK), 0.05, 12);
  const co = 120 + (lamK < 1.05 ? 2.0e6 * (1.05 - lamK) ** 2 : 0) + (lamT < 1.02 ? 6e5 * (1.02 - lamT) ** 2 : 0);

  // Calciner
  const rc = m.feed > 1 ? ((m.fuelCalc * cvF * etaC) / m.feed) / (14 / 330) : 2;
  const calcT = m.feed > 1 ? clamp(880 + 110 * (rc - 1), 650, 1050) : clamp(500 + 30 * m.fuelCalc * cvF, 300, 1050);
  const calcDeg = m.feed > 1 ? clamp(0.93 + 0.3 * (rc - 1), 0.5, 0.97) : 0.97;

  // Cooler: bed thickness ~ clinker rate / grate speed
  const bed = (x.clinker / 213) / (m.grate / 12);
  const sat = clamp(1050 + 180 * (bed - 1) - (x.clinker < 20 ? 500 : 0), 500, 1200);
  const ugp = clamp(55 * bed, 5, 110);

  // Kiln heat balance (relative units, 1 = nominal)
  const supply = (m.fuelMain * cvF * etaK) / 9 + 0.0008 * (x.sat - 1050);
  const demand = Math.max(0.05, feedF * d.burn * (1 + 1.6 * (0.93 - x.calcDeg)) + d.coating);
  let bzt = 1450 + 700 * (supply / demand - 1) - 120 * (m.speed / 3.8 - 1);
  if (m.feed < 1) bzt = 900 + 60 * m.fuelMain * cvF;
  bzt = clamp(bzt, 700, 1700);

  const fill = m.speed > 0.1 ? feedF / (m.speed / 3.8) : 3;
  const torque = clamp(62 + 0.12 * (x.bzt - 1450) + 25 * (fill - 1) + 120 * d.coating, 5, 115) * (m.speed > 0.1 ? 1 : 0.3);
  const freeLime = clamp(1.3 * Math.exp(-(x.bzt - 1450) / 40) * d.burn ** 3 * (1 + 0.8 * (m.speed / 3.8 - 1)), 0.2, 9);
  const nox = clamp(700 * Math.exp((bzt - 1450) / 70) * (0.6 + (0.4 * Math.min(o2, 4)) / 2.4), 30, 3000);

  const cyc1T = clamp(330 + 2.5 * (m.fan - 85) + 25 * (rc - 1) - 30 * (feedF - 1), 150, 450);
  const kilnInT = clamp(1120 + 0.5 * (x.bzt - 1450) + 4 * (m.fan - 85), 600, 1300);
  const clinker = m.feed / 1.55;

  return { o2, co, calcT, calcDeg, sat, ugp, bzt, torque, freeLime, nox, cyc1T, kilnInT, clinker };
}

export function createState(scenarioId = "steady", seed = Date.now()) {
  const sc = SCENARIOS.find((s) => s.id === scenarioId) || SCENARIOS[0];
  const mv = Object.fromEntries(MVS.map((m) => [m.key, m.nominal]));
  const ss = nominalSteadyState(mv);
  const pipe = (v, n) => Array(n).fill(v);
  return {
    t: 0,
    scenario: sc,
    rand: rng(seed),
    sp: { ...mv },
    mv: { ...mv },
    dist: { burn: 1, cv: 1, coating: 0, burnNoise: 0, cvNoise: 0 },
    x: {
      ...ss,
      freeLimeTrue: ss.freeLime,
      freeLimeLab: ss.freeLime,
      heat: ((23 * 6500) / ss.clinker),
    },
    // dead-time buffers
    bztDelay: pipe(ss.bzt, Math.round(120 / DT)),
    flDelay: pipe(ss.freeLime, Math.round(1500 / DT)),
    clDelay: pipe(ss.clinker, Math.round(1200 / DT)),
    tripTimer: 0,
    lowBztTimer: 0,
    hotTimer: 0,
    nextLab: 1800,
    stats: { steps: 0, inBand: Object.fromEntries(SCORED.map((k) => [k, 0])), clinkerT: 0, offSpecT: 0, heatSum: 0, heatN: 0, trips: 0, flushes: 0, overheats: 0 },
    events: [{ t: 0, level: "info", msg: `Scenario started: ${sc.name}` }],
    firedEvents: new Set(),
    history: [],
  };
}

function log(s, level, msg) {
  s.events.unshift({ t: s.t, level, msg });
  if (s.events.length > 60) s.events.pop();
}

export function step(s) {
  const { sp, mv, dist, x } = s;
  s.t += DT;

  // Scenario events
  s.scenario.events.forEach((ev, i) => {
    if (!s.firedEvents.has(i) && s.t >= ev.at) {
      s.firedEvents.add(i);
      log(s, "warn", ev.msg);
      if (ev.type === "burn") dist.burnTarget = ev.value;
      if (ev.type === "cv") dist.cvTarget = ev.value;
      if (ev.type === "coating") dist.coating = ev.value;
    }
  });
  if (dist.burnTarget) dist.burn = lag(dist.burn, dist.burnTarget, 600);
  if (dist.cvTarget) dist.cv = lag(dist.cv, dist.cvTarget, 300);
  dist.coating = lag(dist.coating, 0, 900); // coating heat sink fades out

  // Random quality noise (slow random walk)
  const n = s.scenario.noise;
  dist.burnNoise = clamp(dist.burnNoise * 0.997 + (s.rand() - 0.5) * 0.006 * n, -0.06, 0.06);
  dist.cvNoise = clamp(dist.cvNoise * 0.997 + (s.rand() - 0.5) * 0.004 * n, -0.04, 0.04);
  const d = { burn: dist.burn + dist.burnNoise, cv: dist.cv + dist.cvNoise, coating: dist.coating };

  // Actuators move toward setpoints with rate limits
  for (const m of MVS) {
    const maxMove = (m.rate * DT) / 60;
    mv[m.key] = mv[m.key] + clamp(sp[m.key] - mv[m.key], -maxMove, maxMove);
  }

  // Process response
  const tg = computeTargets(mv, d, x);
  s.bztDelay.push(tg.bzt);
  const bztDelayed = s.bztDelay.shift();
  x.bzt = lag(x.bzt, bztDelayed, 600);
  x.nox = lag(x.nox, tg.nox, 240);
  x.o2 = lag(x.o2, tg.o2, 60);
  x.co = lag(x.co, tg.co, 40);
  x.calcT = lag(x.calcT, tg.calcT, 120);
  x.calcDeg = lag(x.calcDeg, tg.calcDeg, 180);
  x.sat = lag(x.sat, tg.sat, 300);
  x.ugp = lag(x.ugp, tg.ugp, 60);
  x.torque = lag(x.torque, tg.torque, 200);
  x.cyc1T = lag(x.cyc1T, tg.cyc1T, 120);
  x.kilnInT = lag(x.kilnInT, tg.kilnInT, 180);

  s.clDelay.push(tg.clinker);
  x.clinker = lag(x.clinker, s.clDelay.shift(), 300);

  x.freeLimeTrue = lag(x.freeLimeTrue, tg.freeLime, 300);
  s.flDelay.push(x.freeLimeTrue);
  const flAtCooler = s.flDelay.shift();
  if (s.t >= s.nextLab) {
    s.nextLab += 1800;
    x.freeLimeLab = flAtCooler * (1 + (s.rand() - 0.5) * 0.06);
    const lvl = x.freeLimeLab > 2.5 || x.freeLimeLab < 0.5 ? "alarm" : x.freeLimeLab > 2 || x.freeLimeLab < 0.8 ? "warn" : "info";
    log(s, lvl, `Lab result: free lime ${x.freeLimeLab.toFixed(2)} %`);
  }

  const fuelHeat = (mv.fuelMain + mv.fuelCalc) * 6500 * d.cv;
  x.heat = x.clinker > 20 ? fuelHeat / x.clinker : 0;

  // Interlocks and abnormal events
  if (x.co > 5000 && s.tripTimer <= 0) {
    s.tripTimer = 1;
    s.stats.trips++;
    sp.feed = mv.feed = 0;
    sp.fuelCalc = mv.fuelCalc = 0;
    sp.fuelMain = mv.fuelMain = Math.min(mv.fuelMain, 3);
    log(s, "alarm", "CO TRIP: kiln inlet CO above 5000 ppm. Feed and calciner fuel stopped, main burner to 3 t/h.");
  }
  if (s.tripTimer > 0 && x.co < 2000) s.tripTimer = 0;

  if (x.bzt < 1300 && mv.feed > 50) {
    s.lowBztTimer += DT;
    if (s.lowBztTimer === 120) {
      s.stats.flushes++;
      log(s, "alarm", "Kiln flush risk: burning zone below 1300 °C, unburnt meal reaching the cooler");
    }
  } else s.lowBztTimer = 0;

  if (x.bzt > 1550) {
    s.hotTimer += DT;
    if (s.hotTimer === 300) {
      s.stats.overheats++;
      log(s, "alarm", "Burning zone above 1550 °C for 5 min: coating loss and refractory damage risk");
    }
  } else s.hotTimer = 0;

  if (x.ugp > 75 && s.t % 300 === 0) log(s, "warn", "Cooler overload: undergrate pressure high, increase grate speed");

  // Statistics
  const st = s.stats;
  st.steps++;
  for (const k of SCORED) {
    const def = k === "freeLimeTrue" ? PVS.freeLime : PVS[k];
    const v = x[k];
    if (v >= def.lo && v <= def.hi) st.inBand[k]++;
  }
  const cl = (x.clinker * DT) / 3600;
  st.clinkerT += cl;
  if (flAtCooler > 2.5) st.offSpecT += cl;
  if (x.clinker > 20) {
    st.heatSum += x.heat;
    st.heatN++;
  }

  // History for trends (one point per minute)
  if (s.t % 60 === 0) {
    s.history.push({
      t: s.t,
      bzt: x.bzt, nox: x.nox, o2: x.o2, co: x.co, calcT: x.calcT, torque: x.torque,
      freeLime: x.freeLimeLab, clinker: x.clinker, sat: x.sat,
    });
  }
}

export function score(s) {
  const st = s.stats;
  const n = Math.max(1, st.steps);
  const bands = Object.fromEntries(SCORED.map((k) => [k, (100 * st.inBand[k]) / n]));
  let stability = SCORED.reduce((a, k) => a + bands[k], 0) / SCORED.length;
  const hours = Math.max(1 / 60, s.t / 3600);
  const target = s.scenario.target || 213;
  const prodPct = (100 * st.clinkerT) / (target * hours);
  const offSpecPct = st.clinkerT > 0 ? (100 * st.offSpecT) / st.clinkerT : 0;
  const heat = st.heatN ? st.heatSum / st.heatN : 0;
  const prodScore = clamp(100 - 10 * (100 - prodPct), 0, 100);
  let total = stability * 0.6 + prodScore * 0.3 + Math.max(0, 100 - 4 * offSpecPct) * 0.1;
  total -= st.trips * 10 + st.flushes * 15 + st.overheats * 8;
  total = clamp(total, 0, 100);
  const grade = total >= 90 ? "A" : total >= 80 ? "B" : total >= 70 ? "C" : total >= 55 ? "D" : "F";
  return { bands, stability, prodPct, offSpecPct, heat, total, grade, clinkerT: st.clinkerT };
}
