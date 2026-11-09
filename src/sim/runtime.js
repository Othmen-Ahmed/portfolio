// Glue between the plant and the APC: one call per plant integration step.
import { step, log, DT, tagOf } from "./plant.js";
import { TS, recordHistory, computeMoves, APC_MVS } from "./apc.js";

export const REQUIRED = ["fan", "feed", "fuelKiln", "fuelCalc"];

export function apcReady(p) {
  const missing = REQUIRED.filter((k) => !p.drives[k].running);
  return { ok: missing.length === 0, missing };
}

export function engageApc(p, apc) {
  const r = apcReady(p);
  if (!r.ok) return r;
  APC_MVS.forEach((m) => { p.drives[m.key].mode = "AUTO"; });
  p.apcOn = true;
  apc.status = "Running";
  log(p, "info", "APC engaged: feed, both coal feeders and ID fan in AUTO");
  return r;
}

export function disengageApc(p, apc, reason = "") {
  if (!p.apcOn) return;
  p.apcOn = false;
  APC_MVS.forEach((m) => { p.drives[m.key].mode = "MAN"; });
  apc.status = reason ? `Shed: ${reason}` : "Off";
  log(p, reason ? "warn" : "info", reason ? `APC shed to manual: ${reason}` : "APC switched off, drives in MANUAL");
}

export function tick(p, apc) {
  step(p);
  if (p.t % TS !== 0) return;
  const u = Object.fromEntries(APC_MVS.map((m) => [m.key, p.drives[m.key].sp]));
  recordHistory(apc, u);
  if (!p.apcOn) return;
  const r = apcReady(p);
  if (!r.ok) {
    disengageApc(p, apc, `${tagOf(r.missing[0])} not running`);
    return;
  }
  const active = Object.fromEntries(APC_MVS.map((m) => [m.key, p.drives[m.key].mode === "AUTO" && p.drives[m.key].running]));
  if (!Object.values(active).some(Boolean)) return;
  const y = { bzt: p.x.bzt, o2: p.x.o2, o2Ph: p.x.o2Ph, calcT: p.x.calcT };
  const moves = computeMoves(apc, y, u, active, { co: p.x.co, t: p.t });
  for (const [k, v] of Object.entries(moves)) p.drives[k].sp = v;
}
export { DT };
