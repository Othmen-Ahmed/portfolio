// Cloudflare Worker: unique-visitor counter for the portfolio.
// Each IP is counted once per page. The raw IP is never stored, only a
// salted SHA-256 hash, so the database cannot be turned back into IPs.
//
// Bindings (set in the Cloudflare dashboard, Worker > Settings):
//   DB             D1 database (variable name: DB)
//   SALT           secret, any long random text
//   ADMIN_KEY      secret, the password for your private stats page
//   ALLOWED_ORIGIN variable, https://othmen-ahmed.github.io

const PAGES = new Set(["home", "simulator", "projects"]);

async function sha256(text) {
  const data = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(hash)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function parseUserAgent(ua) {
  const u = ua || "";
  const device = /Mobi/.test(u) ? "Mobile" : /iPad|Tablet/.test(u) ? "Tablet" : "Desktop";
  const os = /Windows/.test(u) ? "Windows"
    : /Android/.test(u) ? "Android"
    : /iPhone|iPad|iPod/.test(u) ? "iOS"
    : /Mac OS X/.test(u) ? "macOS"
    : /Linux/.test(u) ? "Linux"
    : "Other";
  const browser = /Edg\//.test(u) ? "Edge"
    : /OPR\//.test(u) ? "Opera"
    : /Chrome\//.test(u) ? "Chrome"
    : /Safari\//.test(u) ? "Safari"
    : /Firefox\//.test(u) ? "Firefox"
    : "Other";
  return { device, os, browser };
}

function referrerHost(referrer) {
  if (!referrer) return "";
  try {
    return new URL(referrer).host || "";
  } catch (_) {
    return "";
  }
}

function localHour(timezone) {
  if (!timezone) return null;
  try {
    const hour = new Date().toLocaleString("en-GB", {
      timeZone: timezone,
      hour: "numeric",
      hour12: false,
    });
    const n = parseInt(hour, 10);
    return Number.isNaN(n) ? null : n;
  } catch (_) {
    return null;
  }
}

function json(body, status, cors) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...cors },
  });
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

    // Record a visit: POST /hit {"page":"home"}
    if (url.pathname === "/hit" && request.method === "POST") {
      if (!allowed.includes(origin)) return json({ ok: false }, 403, cors);
      let page = "home";
      try {
        const body = await request.json();
        if (PAGES.has(body.page)) page = body.page;
      } catch (_) { /* default page */ }
      const ip = request.headers.get("CF-Connecting-IP") || "unknown";
      const ipHash = await sha256(`${env.SALT}|${ip}`);
      const cf = request.cf || {};
      const { device, os, browser } = parseUserAgent(request.headers.get("User-Agent"));
      // The PRIMARY KEY (ip_hash, page) makes repeat visits from the same IP a no-op
      await env.DB.prepare(
        "INSERT OR IGNORE INTO visits (ip_hash, page, country, first_seen, city, region, timezone, referrer, device, os, browser, local_hour) " +
        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
      ).bind(
        ipHash,
        page,
        cf.country || "",
        new Date().toISOString(),
        cf.city || "",
        cf.region || "",
        cf.timezone || "",
        referrerHost(request.headers.get("Referer")),
        device,
        os,
        browser,
        localHour(cf.timezone)
      ).run();
      return json({ ok: true }, 200, cors);
    }

    // Private statistics: GET /stats with header Authorization: Bearer <ADMIN_KEY>
    if (url.pathname === "/stats" && request.method === "GET") {
      const auth = request.headers.get("Authorization") || "";
      if (!env.ADMIN_KEY || auth !== `Bearer ${env.ADMIN_KEY}`) {
        return json({ error: "Wrong key" }, 401, cors);
      }
      const db = env.DB;
      const [
        total, byPage, byCountry, byDay, byCity, byTimezone,
        byReferrer, byDevice, byOs, byBrowser, byHour, recent,
      ] = await Promise.all([
        db.prepare("SELECT COUNT(DISTINCT ip_hash) AS n FROM visits").first(),
        db.prepare("SELECT page, COUNT(*) AS n FROM visits GROUP BY page").all(),
        db.prepare(
          "SELECT country, COUNT(DISTINCT ip_hash) AS n FROM visits GROUP BY country ORDER BY n DESC LIMIT 15"
        ).all(),
        db.prepare(
          "SELECT substr(first_seen, 1, 10) AS day, COUNT(DISTINCT ip_hash) AS n FROM visits " +
          "WHERE first_seen >= date('now', '-30 day') GROUP BY day ORDER BY day"
        ).all(),
        db.prepare(
          "SELECT city, country, COUNT(DISTINCT ip_hash) AS n FROM visits " +
          "WHERE city != '' GROUP BY city, country ORDER BY n DESC LIMIT 15"
        ).all(),
        db.prepare(
          "SELECT timezone, COUNT(DISTINCT ip_hash) AS n FROM visits " +
          "WHERE timezone != '' GROUP BY timezone ORDER BY n DESC LIMIT 10"
        ).all(),
        db.prepare(
          "SELECT referrer, COUNT(DISTINCT ip_hash) AS n FROM visits " +
          "WHERE referrer != '' GROUP BY referrer ORDER BY n DESC LIMIT 10"
        ).all(),
        db.prepare(
          "SELECT device, COUNT(DISTINCT ip_hash) AS n FROM visits " +
          "WHERE device != '' GROUP BY device ORDER BY n DESC"
        ).all(),
        db.prepare(
          "SELECT os, COUNT(DISTINCT ip_hash) AS n FROM visits " +
          "WHERE os != '' GROUP BY os ORDER BY n DESC LIMIT 10"
        ).all(),
        db.prepare(
          "SELECT browser, COUNT(DISTINCT ip_hash) AS n FROM visits " +
          "WHERE browser != '' GROUP BY browser ORDER BY n DESC LIMIT 10"
        ).all(),
        db.prepare(
          "SELECT local_hour AS hour, COUNT(DISTINCT ip_hash) AS n FROM visits " +
          "WHERE local_hour IS NOT NULL GROUP BY local_hour ORDER BY local_hour"
        ).all(),
        db.prepare(
          "SELECT page, country, city, device, os, browser, referrer, first_seen FROM visits " +
          "ORDER BY first_seen DESC LIMIT 20"
        ).all(),
      ]);
      return json(
        {
          total: total.n,
          byPage: byPage.results,
          byCountry: byCountry.results,
          byDay: byDay.results,
          byCity: byCity.results,
          byTimezone: byTimezone.results,
          byReferrer: byReferrer.results,
          byDevice: byDevice.results,
          byOs: byOs.results,
          byBrowser: byBrowser.results,
          byHour: byHour.results,
          recent: recent.results,
        },
        200,
        cors
      );
    }

    return json({ error: "Not found" }, 404, cors);
  },
};
