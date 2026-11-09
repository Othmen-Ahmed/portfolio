// Plant step tests: bump each MV from steady state on a noise-free copy of
// the plant and fit a FOPDT model (K, dead time, time constant) to each CV,
// the way an APC engineer does during commissioning.
import { createPlant, step, DT } from "./plant.js";
import { APC_MVS, APC_CVS, cloneModel } from "./apc.js";

const STEPS = { feed: 10, fuelKiln: 0.5, fuelCalc: 0.5, fan: 2 };
const TEST_S = 4 * 3600; // 4-hour test per MV

function fit(series, base, delta) {
  const end = series[series.length - 1] - base;
  const K = end / delta;
  if (Math.abs(end) < 1e-6) return { K: 0, theta: 0, tau: 60 };
  let theta = 0;
  for (let i = 0; i < series.length; i++) {
    if (Math.abs(series[i] - base) > 0.02 * Math.abs(end)) { theta = Math.max(0, (i - 1) * DT); break; }
  }
  let t63 = TEST_S;
  for (let i = 0; i < series.length; i++) {
    if (Math.abs(series[i] - base) >= 0.632 * Math.abs(end)) { t63 = i * DT; break; }
  }
  return { K: +K.toPrecision(3), theta: Math.round(theta), tau: Math.max(10, Math.round(t63 - theta)) };
}

export function identifyPlant(baseModel) {
  const model = cloneModel(baseModel);
  for (const mv of APC_MVS) {
    const p = createPlant("steady", 1, { noise: false, events: false });
    for (let i = 0; i < 120; i++) step(p); // settle 10 min
    const base = Object.fromEntries(APC_CVS.map((c) => [c.key, p.x[c.key]]));
    p.drives[mv.key].sp += STEPS[mv.key];
    if (mv.key === "feed") p.drives.kiln.mode = "MAN"; // hold kiln speed during the feed test
    const rec = Object.fromEntries(APC_CVS.map((c) => [c.key, []]));
    for (let t = 0; t < TEST_S; t += DT) {
      step(p);
      APC_CVS.forEach((c) => rec[c.key].push(p.x[c.key]));
    }
    APC_CVS.forEach((c) => {
      model[c.key][mv.key] = fit(rec[c.key], base[c.key], STEPS[mv.key]);
    });
  }
  return model;
}
