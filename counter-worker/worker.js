// Cloudflare Worker: visitor log for the portfolio dashboard.
// Every page view is stored with its time, place, device and source.
// The raw IP is never stored, only a salted SHA-256 hash, so the database
// cannot be turned back into IPs.
//
// Bindings (set in the Cloudflare dashboard, Worker > Settings):
//   DB             D1 database (variable name: DB)
//   SALT           secret, any long random text
//   ADMIN_KEY      secret, the password for your private stats page
//   ALLOWED_ORIGIN variable, https://othmen-ahmed.github.io

const PAGE_RE = /^[a-z0-9][a-z0-9:_-]{0,79}$/;
const BOT_RE = /bot|crawl|spider|slurp|headless|lighthouse|preview|monitor|curl|wget|python|scrapy/i;
const SESSION_MIN = 30; // a reload of the same page inside this window is the same view
const MAX_SECONDS = 4 * 3600;
const RANGES = new Set([1, 7, 30, 90, 365]);

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS hits (
     id TEXT PRIMARY KEY, visitor TEXT NOT NULL, page TEXT NOT NULL, ts TEXT NOT NULL,
     duration INTEGER NOT NULL DEFAULT 0, country TEXT, region TEXT, city TEXT,
     lat REAL, lon REAL, tz TEXT, network TEXT, source TEXT, device TEXT,
     browser TEXT, os TEXT, lang TEXT, screen TEXT)`,
  "CREATE INDEX IF NOT EXISTS hits_ts ON hits (ts)",
  "CREATE INDEX IF NOT EXISTS hits_visitor ON hits (visitor, ts)",
];
// Copies the old counter (table "visits") into the new log, once.
const MIGRATE =
  "INSERT OR IGNORE INTO hits (id, visitor, page, ts, country) " +
  "SELECT ip_hash || ':' || page, ip_hash, page, first_seen, country FROM visits";

let schemaReady = false;
async function ensureSchema(db) {
  if (schemaReady) return;
  await db.batch(SCHEMA.map((sql) => db.prepare(sql)));
  try {
    await db.prepare(MIGRATE).run();
  } catch (_) { /* no old table to copy */ }
  schemaReady = true;
}

async function sha256(text) {
  const data = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(hash)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function json(body, status, cors) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...cors },
  });
}

const clip = (value, max) => (typeof value === "string" ? value.trim().slice(0, max) : "");

function readAgent(ua) {
  let device = "Desktop";
  if (/iPad|Tablet|Android(?!.*Mobile)/i.test(ua)) device = "Tablet";
  else if (/Mobi|iPhone|iPod|Android/i.test(ua)) device = "Mobile";

  let browser = "Other";
  if (/Edg(e|A|iOS)?\//.test(ua)) browser = "Edge";
  else if (/OPR\/|Opera/.test(ua)) browser = "Opera";
  else if (/SamsungBrowser/.test(ua)) browser = "Samsung Internet";
  else if (/Firefox\/|FxiOS/.test(ua)) browser = "Firefox";
  else if (/Chrome\/|CriOS/.test(ua)) browser = "Chrome";
  else if (/Safari\//.test(ua)) browser = "Safari";

  let os = "Other";
  if (/Windows NT/.test(ua)) os = "Windows";
  else if (/Android/.test(ua)) os = "Android";
  else if (/iPhone|iPad|iPod/.test(ua)) os = "iOS";
  else if (/Mac OS X/.test(ua)) os = "macOS";
  else if (/CrOS/.test(ua)) os = "ChromeOS";
  else if (/Linux/.test(ua)) os = "Linux";

  return { device, browser, os };
}

// Keeps only the site name of a referrer, and drops visits coming from the portfolio itself
function readSource(ref, tag, ownOrigin) {
  if (tag) return clip(tag, 60).toLowerCase();
  try {
    const host = new URL(ref).hostname.replace(/^www\./, "");
    if (ownOrigin && host === new URL(ownOrigin).hostname) return "";
    return host.slice(0, 60);
  } catch (_) {
    return "";
  }
}

const num = (value) => {
  const n = parseFloat(value);
  return Number.isFinite(n) ? n : null;
};

async function recordHit(request, env, origin) {
  let body = {};
  try { body = await request.json(); } catch (_) { /* empty body */ }
  const page = PAGE_RE.test(body.page || "") ? body.page : "home";
  const ua = request.headers.get("User-Agent") || "";
  if (BOT_RE.test(ua)) return { ok: true, id: null };

  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  const visitor = await sha256(`${env.SALT}|${ip}`);
  const now = new Date();

  // Same visitor, same page, a few minutes apart: keep counting on the same view
  const since = new Date(now.getTime() - SESSION_MIN * 60000).toISOString();
  const open = await env.DB.prepare(
    "SELECT id, duration FROM hits WHERE visitor = ? AND page = ? AND ts >= ? ORDER BY ts DESC LIMIT 1"
  ).bind(visitor, page, since).first();
  if (open) return { ok: true, id: open.id, base: open.duration };

  const cf = request.cf || {};
  const agent = readAgent(ua);
  const id = crypto.randomUUID();
  await env.DB.prepare(
    "INSERT INTO hits (id, visitor, page, ts, country, region, city, lat, lon, tz, network, source, " +
    "device, browser, os, lang, screen) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
  ).bind(
    id, visitor, page, now.toISOString(),
    clip(cf.country, 2), clip(cf.region, 80), clip(cf.city, 80), num(cf.latitude), num(cf.longitude),
    clip(cf.timezone, 60), clip(cf.asOrganization, 80), readSource(body.ref, body.tag, origin),
    agent.device, agent.browser, agent.os, clip(body.lang, 12), clip(body.screen, 12)
  ).run();
  return { ok: true, id, base: 0 };
}

async function recordTime(request, env) {
  let body = {};
  try { body = await request.json(); } catch (_) { /* empty body */ }
  const seconds = Math.min(MAX_SECONDS, Math.max(0, Math.round(Number(body.seconds) || 0)));
  if (!body.id || !seconds) return { ok: true };
  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  const visitor = await sha256(`${env.SALT}|${ip}`);
  await env.DB.prepare(
    "UPDATE hits SET duration = MAX(duration, ?) WHERE id = ? AND visitor = ?"
  ).bind(seconds, String(body.id), visitor).run();
  return { ok: true };
}

// Everything the dashboard shows, for one period.
//   range  1 (last 24 hours), 7, 30, 90 or 365 days
//   tz     minutes ahead of UTC of the person looking at the dashboard, so that
//          days and hours are cut on their clock and not on UTC
//   page   optional, keeps one page only
async function readStats(env, url) {
  const db = env.DB;
  const asked = parseInt(url.searchParams.get("range"), 10);
  const range = RANGES.has(asked) ? asked : 30;
  const tz = Math.max(-840, Math.min(840, parseInt(url.searchParams.get("tz"), 10) || 0));
  const page = PAGE_RE.test(url.searchParams.get("page") || "") ? url.searchParams.get("page") : "";

  const DAY = 86400000;
  const now = Date.now();
  const localMidnight = Math.floor((now + tz * 60000) / DAY) * DAY - tz * 60000;
  const startMs = range === 1 ? Math.floor(now / 3600000) * 3600000 - 23 * 3600000 : localMidnight - (range - 1) * DAY;
  const start = new Date(startMs).toISOString();
  const prevStart = new Date(startMs - (now - startMs)).toISOString();
  const today = new Date(localMidnight).toISOString();
  const liveSince = new Date(now - 30 * 60000).toISOString();
  const shift = `${tz >= 0 ? "+" : ""}${tz} minutes`;
  const bucket = range === 1 ? "%Y-%m-%d %H" : "%Y-%m-%d";

  const pageSql = page ? " AND page = ?" : "";
  const run = (sql, ...args) => db.prepare(sql).bind(...args, ...(page ? [page] : [])).all().then((r) => r.results);
  const one = (sql, ...args) => db.prepare(sql).bind(...args, ...(page ? [page] : [])).first();
  const sums = "COUNT(*) AS views, COUNT(DISTINCT visitor) AS visitors, " +
    "ROUND(AVG(CASE WHEN duration > 0 THEN duration END)) AS seconds";
  const split = (column, limit = 12) => run(
    `SELECT COALESCE(NULLIF(${column}, ''), 'Unknown') AS name, COUNT(DISTINCT visitor) AS visitors, COUNT(*) AS views ` +
    `FROM hits WHERE ts >= ?${pageSql} GROUP BY name ORDER BY visitors DESC, views DESC LIMIT ${limit}`,
    start
  );

  const [
    totals, previous, todayRow, live, allTime, fresh, series, heat, pages, pageList,
    countries, cities, sources, devices, browsers, systems, languages, zones, networks, screens, recent,
  ] = await Promise.all([
    one(`SELECT ${sums} FROM hits WHERE ts >= ?${pageSql}`, start),
    one(`SELECT ${sums} FROM hits WHERE ts >= ? AND ts < ?${pageSql}`, prevStart, start),
    one(`SELECT ${sums} FROM hits WHERE ts >= ?${pageSql}`, today),
    one(`SELECT COUNT(DISTINCT visitor) AS visitors FROM hits WHERE ts >= ?${pageSql}`, liveSince),
    db.prepare("SELECT COUNT(*) AS views, COUNT(DISTINCT visitor) AS visitors, MIN(ts) AS since FROM hits").first(),
    // Visitors of the period who had never come before it
    db.prepare(
      `SELECT COUNT(*) AS n FROM (SELECT DISTINCT visitor FROM hits WHERE ts >= ?${pageSql}) v ` +
      "WHERE NOT EXISTS (SELECT 1 FROM hits o WHERE o.visitor = v.visitor AND o.ts < ?)"
    ).bind(...(page ? [start, page, start] : [start, start])).first(),
    run(
      `SELECT strftime('${bucket}', ts, ?) AS t, COUNT(*) AS views, COUNT(DISTINCT visitor) AS visitors ` +
      `FROM hits WHERE ts >= ?${pageSql} GROUP BY t ORDER BY t`,
      shift, start
    ),
    run(
      "SELECT CAST(strftime('%w', ts, ?) AS INTEGER) AS dow, CAST(strftime('%H', ts, ?) AS INTEGER) AS hour, " +
      `COUNT(*) AS views FROM hits WHERE ts >= ?${pageSql} GROUP BY dow, hour`,
      shift, shift, start
    ),
    run(`SELECT page, ${sums} FROM hits WHERE ts >= ?${pageSql} GROUP BY page ORDER BY views DESC LIMIT 30`, start),
    db.prepare("SELECT page, COUNT(*) AS views FROM hits GROUP BY page ORDER BY views DESC LIMIT 60").all().then((r) => r.results),
    split("country", 40),
    run(
      "SELECT COALESCE(NULLIF(city, ''), 'Unknown') AS city, region, country, AVG(lat) AS lat, AVG(lon) AS lon, " +
      `COUNT(DISTINCT visitor) AS visitors, COUNT(*) AS views FROM hits WHERE ts >= ?${pageSql} ` +
      "GROUP BY city, region, country ORDER BY visitors DESC, views DESC LIMIT 150",
      start
    ),
    run(
      "SELECT COALESCE(NULLIF(source, ''), 'Direct or unknown') AS name, COUNT(DISTINCT visitor) AS visitors, COUNT(*) AS views " +
      `FROM hits WHERE ts >= ?${pageSql} GROUP BY name ORDER BY visitors DESC, views DESC LIMIT 12`,
      start
    ),
    split("device"), split("browser"), split("os"), split("lang"), split("tz"), split("network", 15), split("screen", 8),
    run(
      "SELECT ts, page, duration, country, region, city, network, source, device, browser, os, lang, " +
      "substr(visitor, 1, 6) AS visitor, " +
      // Returning: the same visitor already came on an earlier day
      "EXISTS (SELECT 1 FROM hits o WHERE o.visitor = hits.visitor AND o.ts < substr(hits.ts, 1, 10)) AS back " +
      `FROM hits WHERE ts >= ?${pageSql} ORDER BY ts DESC LIMIT 200`,
      start
    ),
  ]);

  return {
    range, tz, page, start, bucket: range === 1 ? "hour" : "day", generatedAt: new Date(now).toISOString(),
    totals, previous, today: todayRow, live: live.visitors, allTime,
    newVisitors: fresh.n,
    series, heat, pages, pageList, countries, cities, sources, devices, browsers, systems,
    languages, zones, networks, screens, recent,
  };
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin") || "";
    const allowed = [env.ALLOWED_ORIGIN, "http://localhost:5173"];
    const cors = {
      "Access-Control-Allow-Origin": allowed.includes(origin) ? origin : env.ALLOWED_ORIGIN,
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      Vary: "Origin",
    };
    if (request.method === "OPTIONS") return new Response(null, { headers: cors });

    try {
      await ensureSchema(env.DB);

      // Record a page view: POST /hit {"page":"home","ref":"...","tag":"...","lang":"...","screen":"..."}
      if (url.pathname === "/hit" && request.method === "POST") {
        if (!allowed.includes(origin)) return json({ ok: false }, 403, cors);
        return json(await recordHit(request, env, env.ALLOWED_ORIGIN), 200, cors);
      }

      // Report how long a page stayed open: POST /time {"id":"...","seconds":42}
      if (url.pathname === "/time" && request.method === "POST") {
        if (!allowed.includes(origin)) return json({ ok: false }, 403, cors);
        return json(await recordTime(request, env), 200, cors);
      }

      // Private dashboard data: GET /stats with header Authorization: Bearer <ADMIN_KEY>
      if (url.pathname === "/stats" && request.method === "GET") {
        const auth = request.headers.get("Authorization") || "";
        if (!env.ADMIN_KEY || auth !== `Bearer ${env.ADMIN_KEY}`) {
          return json({ error: "Wrong key" }, 401, cors);
        }
        return json(await readStats(env, url), 200, cors);
      }
    } catch (e) {
      return json({ error: String((e && e.message) || e) }, 500, cors);
    }

    return json({ error: "Not found" }, 404, cors);
  },
};
