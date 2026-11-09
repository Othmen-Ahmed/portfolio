// Kiln APC: Dynamic Matrix Control (a step-response form of linear MPC),
// the same family as the controllers in ABB Expert Optimizer, Honeywell RMPCT
// or AspenTech DMC. Models are FOPDT (gain K, dead time θ, time constant τ),
// as used in industrial kiln APC (Zanoli et al., Sensors 2023).

export const TS = 60; // controller sample time, s (Zanoli et al. 2023 use 60 s for the kiln)
const N = 300; // model length, samples (5 h)

export const APC_MVS = [
  { key: "feed", label: "Kiln feed", unit: "t/h", min: 280, max: 365, maxMove: 2, typMove: 1.5, supp: 1, dec: 0 },
  { key: "fuelKiln", label: "Main burner coal", unit: "t/h", min: 6, max: 14, maxMove: 0.15, typMove: 0.2, supp: 1, dec: 2 },
  { key: "fuelCalc", label: "Calciner coal", unit: "t/h", min: 10, max: 22, maxMove: 0.25, typMove: 0.3, supp: 1, dec: 2 },
  { key: "fan", label: "ID fan speed", unit: "%", min: 60, max: 95, maxMove: 0.5, typMove: 0.6, supp: 1, dec: 1 },
];

export const APC_CVS = [
  { key: "bzt", label: "Burning zone temp.", unit: "°C", type: "setpoint", sp: 1450, lo: 1440, hi: 1460, ece: 4, priority: 10, dec: 0 },
  { key: "o2", label: "Kiln inlet O₂", unit: "%", type: "range", sp: 2.2, lo: 1.6, hi: 3.2, ece: 0.15, priority: 9, dec: 2 },
  { key: "o2Ph", label: "Preheater exit O₂", unit: "%", type: "range", sp: 2.8, lo: 2.0, hi: 4.0, ece: 0.2, priority: 8, dec: 2 },
  { key: "calcT", label: "Calciner outlet temp.", unit: "°C", type: "setpoint", sp: 880, lo: 870, hi: 890, ece: 4, priority: 6, dec: 0 },
];

// Engineering assumptions before step testing (from literature gains/dynamics, see SOURCES.md)
export const DEFAULT_MODEL = {
  bzt: {
    feed: { K: -0.9, theta: 900, tau: 2150 },
    fuelKiln: { K: 22, theta: 160, tau: 2150 },
    fuelCalc: { K: 7, theta: 900, tau: 2150 },
    fan: { K: -1.8, theta: 160, tau: 2150 },
  },
  o2: {
    feed: { K: 0, theta: 0, tau: 60 },
    fuelKiln: { K: -1.9, theta: 30, tau: 45 },
    fuelCalc: { K: 0, theta: 0, tau: 60 },
    fan: { K: 0.23, theta: 30, tau: 45 },
  },
  o2Ph: {
    feed: { K: 0, theta: 0, tau: 60 },
    fuelKiln: { K: -0.72, theta: 30, tau: 60 },
    fuelCalc: { K: -0.72, theta: 30, tau: 60 },
    fan: { K: 0.22, theta: 30, tau: 60 },
  },
  calcT: {
    feed: { K: -0.55, theta: 0, tau: 90 },
    fuelKiln: { K: 0, theta: 0, tau: 60 },
    fuelCalc: { K: 13, theta: 0, tau: 90 },
    fan: { K: 0, theta: 0, tau: 60 },
  },
};

export const DEFAULT_TUNING = {
  hp: 120, // prediction horizon, min
  blocks: [0, 2, 5, 10, 20, 40], // move blocking, min
  maximizeFeed: true, // production is the lowest-priority objective: feed rises until a constraint binds
  feedTarget: 335,
  feedPriority: 1,
  feedEce: 5, // t/h
  coRule: true, // expert rule: raise O2 low limit when CO rises
};

export const cloneModel = (m) => JSON.parse(JSON.stringify(m));

function stepResp(fopdt, n) {
  const t = n * TS;
  if (!fopdt || fopdt.K === 0 || t <= fopdt.theta) return 0;
  return fopdt.K * (1 - Math.exp(-(t - fopdt.theta) / Math.max(1, fopdt.tau)));
}

function solve(A, b) {
  const n = b.length;
  const M = A.map((row, i) => [...row, b[i]]);
  for (let c = 0; c < n; c++) {
    let p = c;
    for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
    [M[c], M[p]] = [M[p], M[c]];
    const piv = M[c][c] || 1e-12;
    for (let r = 0; r < n; r++) {
      if (r === c) continue;
      const f = M[r][c] / piv;
      if (f === 0) continue;
      for (let k = c; k <= n; k++) M[r][k] -= f * M[c][k];
    }
  }
  return M.map((row, i) => row[n] / (row[i] || 1e-12));
}

export function createApc(model = DEFAULT_MODEL) {
  return {
    model: cloneModel(model),
    cvs: APC_CVS.map((c) => ({ ...c })),
    mvs: APC_MVS.map((m) => ({ ...m })),
    tuning: { ...DEFAULT_TUNING, blocks: [...DEFAULT_TUNING.blocks] },
    hist: null, // past MV values, newest last
    pred: null,
    lastRun: -Infinity,
    status: "Off",
    o2LoBoost: 0,
  };
}

// Precompute step-response tables for the current model
function tables(apc) {
  const S = {};
  for (const cv of apc.cvs) {
    S[cv.key] = {};
    for (const mv of apc.mvs) {
      const f = apc.model[cv.key][mv.key];
      const arr = new Float64Array(N + 1);
      for (let n = 0; n <= N; n++) arr[n] = stepResp(f, n);
      S[cv.key][mv.key] = arr;
    }
  }
  return S;
}

// Record MV history every sample, whether APC is on or not, so that
// operator moves made in manual are part of the prediction (bumpless transfer).
export function recordHistory(apc, u) {
  if (!apc.hist) apc.hist = apc.mvs.map((m) => Array(N + 1).fill(u[m.key]));
  apc.mvs.forEach((m, j) => {
    apc.hist[j].push(u[m.key]);
    if (apc.hist[j].length > N + 1) apc.hist[j].shift();
  });
}

// One controller execution. y: current CV values; u: current MV values;
// active: which MVs are available (drive running, in AUTO).
export function computeMoves(apc, y, u, active, extra = {}) {
  const S = tables(apc);
  const hp = Math.min(apc.tuning.hp, N - 1);
  const blocks = apc.tuning.blocks.filter((b) => b < hp);
  const nb = blocks.length;
  const mvs = apc.mvs;
  const nMv = mvs.length;

  // CO expert rule (Expert Optimizer combines MPC with rule-based logic)
  if (apc.tuning.coRule && extra.co != null) {
    apc.o2LoBoost = extra.co > 600 ? Math.min(0.6, apc.o2LoBoost + 0.1) : Math.max(0, apc.o2LoBoost - 0.02);
  } else apc.o2LoBoost = 0;

  // Free response: what the CVs will do from past moves alone
  const free = {};
  for (const cv of apc.cvs) {
    const f = new Float64Array(hp + 1);
    for (let i = 0; i <= hp; i++) {
      let v = y[cv.key];
      mvs.forEach((mv, j) => {
        const h = apc.hist[j];
        const Sx = S[cv.key][mv.key];
        for (let l = 1; l < h.length; l++) {
          const du = h[h.length - l] - h[h.length - l - 1];
          if (du === 0) continue;
          const a = Math.min(N, i + l);
          const b2 = Math.min(N, l);
          v += (Sx[a] - Sx[b2]) * du;
        }
      });
      f[i] = v;
    }
    free[cv.key] = f;
  }

  // Build weighted least-squares problem: rows = CV errors + MV targets, cols = blocked moves
  const nCol = nMv * nb;
  const rows = [];
  const rhs = [];
  for (const cv of apc.cvs) {
    const w = (cv.priority / 10) / cv.ece;
    const lo = cv.key === "o2" || cv.key === "o2Ph" ? cv.lo + apc.o2LoBoost : cv.lo;
    for (let i = 1; i <= hp; i++) {
      const fi = free[cv.key][i];
      let target;
      if (cv.type === "range") target = fi < lo ? lo : fi > cv.hi ? cv.hi : fi;
      else target = cv.sp;
      const row = new Float64Array(nCol);
      mvs.forEach((mv, j) => {
        blocks.forEach((b, k) => {
          if (i > b) row[j * nb + k] = w * S[cv.key][mv.key][i - b];
        });
      });
      rows.push(row);
      rhs.push(w * (target - fi));
    }
  }
  // Production objective: pull feed toward its target
  const fi = mvs.findIndex((m) => m.key === "feed");
  if (fi >= 0 && active.feed) {
    const tgt = apc.tuning.maximizeFeed ? mvs[fi].max : apc.tuning.feedTarget;
    const w = ((apc.tuning.feedPriority / 10) * Math.sqrt(hp)) / apc.tuning.feedEce;
    const row = new Float64Array(nCol);
    for (let k = 0; k < nb; k++) row[fi * nb + k] = w;
    rows.push(row);
    rhs.push(w * (tgt - u.feed));
  }

  // Normal equations with move suppression
  const H = Array.from({ length: nCol }, () => new Float64Array(nCol));
  const g = new Float64Array(nCol);
  for (let r = 0; r < rows.length; r++) {
    const row = rows[r];
    for (let a = 0; a < nCol; a++) {
      if (row[a] === 0) continue;
      g[a] += row[a] * rhs[r];
      for (let b = 0; b < nCol; b++) if (row[b] !== 0) H[a][b] += row[a] * row[b];
    }
  }
  mvs.forEach((mv, j) => {
    const lam = active[mv.key] ? (mv.supp / mv.typMove) ** 2 : 1e9;
    for (let k = 0; k < nb; k++) H[j * nb + k][j * nb + k] += lam * (k === 0 ? 1 : 0.5);
  });
  const du = solve(H.map((r) => Array.from(r)), Array.from(g));

  // First move only (receding horizon), clipped to move and range limits
  const moves = {};
  mvs.forEach((mv, j) => {
    if (!active[mv.key]) return;
    let d = du[j * nb];
    d = Math.max(-mv.maxMove, Math.min(mv.maxMove, d));
    const nu = Math.max(mv.min, Math.min(mv.max, u[mv.key] + d));
    moves[mv.key] = nu;
  });

  // Predictions with the planned moves, for display
  const planned = {};
  for (const cv of apc.cvs) {
    const p = Float64Array.from(free[cv.key]);
    mvs.forEach((mv, j) => {
      blocks.forEach((b, k) => {
        const d = du[j * nb + k];
        if (!active[mv.key] || d === 0) return;
        for (let i = b + 1; i <= hp; i++) p[i] += S[cv.key][mv.key][i - b] * d;
      });
    });
    planned[cv.key] = p;
  }
  apc.pred = { free, planned, t: extra.t ?? 0 };
  return moves;
}

// Deliberately wrong models, to show why model quality matters
export const MODEL_PRESETS = [
  { id: "default", name: "Engineering estimate (before step tests)" },
  { id: "identified", name: "Identified from plant step tests" },
  { id: "gainsLow", name: "Gains underestimated (×0.5)" },
  { id: "gainsHigh", name: "Gains overestimated (×2)" },
  { id: "noDeadTime", name: "Dead times ignored" },
  { id: "noInteraction", name: "No interactions (diagonal model)" },
];

export function presetModel(kind, base, identified) {
  const src = cloneModel(kind === "default" ? base : identified || base);
  const each = (fn) => { for (const cv in src) for (const mv in src[cv]) fn(src[cv][mv], cv, mv); };
  if (kind === "gainsLow") each((f) => { f.K = +(f.K * 0.5).toPrecision(3); });
  if (kind === "gainsHigh") each((f) => { f.K = +(f.K * 2).toPrecision(3); });
  if (kind === "noDeadTime") each((f) => { f.theta = 0; });
  if (kind === "noInteraction") {
    const keep = { bzt: "fuelKiln", o2: "fan", o2Ph: "fan", calcT: "fuelCalc" };
    each((f, cv, mv) => { if (keep[cv] !== mv) f.K = 0; });
  }
  return src;
}
