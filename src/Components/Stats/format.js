import { findProject } from "../../data/projects";

// Small helpers that turn the raw numbers of the counter into readable text

let regionNames = null;
let languageNames = null;
try {
  regionNames = new Intl.DisplayNames(["en"], { type: "region" });
  languageNames = new Intl.DisplayNames(["en"], { type: "language" });
} catch {
  /* very old browser: codes are shown as they are */
}

export const countryName = (code) => {
  if (!code || code === "Unknown") return "Unknown";
  try {
    return (regionNames && regionNames.of(code)) || code;
  } catch {
    return code;
  }
};

// "FR" becomes the French flag
export const flag = (code) =>
  /^[A-Z]{2}$/.test(code || "")
    ? String.fromCodePoint(...[...code].map((c) => 127397 + c.charCodeAt(0)))
    : "";

export const languageName = (code) => {
  if (!code || code === "Unknown") return "Unknown";
  try {
    return (languageNames && languageNames.of(code)) || code;
  } catch {
    return code;
  }
};

export const pageLabel = (page) => {
  if (page === "home") return "Portfolio page";
  if (page === "simulator") return "Kiln simulator";
  if (page === "projects") return "Projects list";
  if (page && page.startsWith("project:")) {
    const project = findProject(page.slice(8));
    return project ? `Project: ${project.title}` : `Project: ${page.slice(8)}`;
  }
  return page || "Unknown";
};

export const placeLabel = (row) =>
  [row.city && row.city !== "Unknown" ? row.city : "", countryName(row.country)].filter(Boolean).join(", ");

// 75 becomes "1 min 15 s"
export const duration = (seconds) => {
  if (!seconds) return "–";
  const s = Math.round(seconds);
  if (s < 60) return `${s} s`;
  if (s < 3600) return `${Math.floor(s / 60)} min ${String(s % 60).padStart(2, "0")} s`;
  return `${Math.floor(s / 3600)} h ${String(Math.floor((s % 3600) / 60)).padStart(2, "0")} min`;
};

// Change against the period just before, as text: "+25%", "-10%", "same"
export const change = (now, before) => {
  if (!before) return now ? "nothing before to compare" : "";
  const pct = Math.round(((now - before) / before) * 100);
  if (pct === 0) return "same as the period before";
  return `${pct > 0 ? "+" : "−"}${Math.abs(pct)}% on the period before`;
};

export const share = (part, whole) => (whole ? `${Math.round((100 * part) / whole)}%` : "–");

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const two = (n) => String(n).padStart(2, "0");

// A time of the counter (UTC) on the clock of the person looking at the dashboard
export const localTime = (iso) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${two(d.getHours())}:${two(d.getMinutes())}`;
};

export const localDate = (iso) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
};

// The counter only returns the days (or hours) that had visits.
// This lays them on the full period so that empty days show as gaps.
export const buildSeries = (data) => {
  const hourly = data.bucket === "hour";
  const step = hourly ? 3600000 : 86400000;
  const count = hourly ? 24 : data.range;
  const first = Date.parse(data.start) + data.tz * 60000; // read with UTC getters = local clock
  const found = new Map(data.series.map((row) => [row.t, row]));

  return Array.from({ length: count }, (_, i) => {
    const d = new Date(first + i * step);
    const iso = d.toISOString();
    const key = hourly ? iso.slice(0, 13).replace("T", " ") : iso.slice(0, 10);
    const row = found.get(key);
    const day = `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`;
    return {
      key,
      label: hourly ? `${two(d.getUTCHours())}:00` : day,
      tip: hourly ? `${day}, ${two(d.getUTCHours())}:00` : `${DAYS[d.getUTCDay()]} ${day}`,
      views: row ? row.views : 0,
      visitors: row ? row.visitors : 0,
    };
  });
};

// Rows of the recent visits table as a CSV file
export const toCsv = (rows) => {
  const head = ["time_utc", "page", "seconds", "city", "region", "country", "network", "source", "device", "browser", "os", "language", "visitor", "returning"];
  const cell = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const lines = rows.map((r) =>
    [r.ts, r.page, r.duration, r.city, r.region, r.country, r.network, r.source, r.device, r.browser, r.os, r.lang, r.visitor, r.back ? "yes" : "no"]
      .map(cell)
      .join(",")
  );
  return [head.join(","), ...lines].join("\n");
};
