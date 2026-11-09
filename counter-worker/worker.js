// Cloudflare Worker: unique-visitor counter for the portfolio.
// Each IP is counted once per page. The raw IP is never stored, only a
// salted SHA-256 hash, so the database cannot be turned back into IPs.
//
// Bindings (set in the Cloudflare dashboard, Worker > Settings):
//   DB             D1 database (variable name: DB)
//   SALT           secret, any long random text
//   ADMIN_KEY      secret, the password for your private stats page
//   ALLOWED_ORIGIN variable, https://othmen-ahmed.github.io

const PAGES = new Set(["home", "simulator"]);

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
      const country = (request.cf && request.cf.country) || "";
      // The PRIMARY KEY (ip_hash, page) makes repeat visits from the same IP a no-op
      await env.DB.prepare(
        "INSERT OR IGNORE INTO visits (ip_hash, page, country, first_seen) VALUES (?, ?, ?, ?)"
      ).bind(ipHash, page, country, new Date().toISOString()).run();
      return json({ ok: true }, 200, cors);
    }

    // Private statistics: GET /stats with header Authorization: Bearer <ADMIN_KEY>
    if (url.pathname === "/stats" && request.method === "GET") {
      const auth = request.headers.get("Authorization") || "";
      if (!env.ADMIN_KEY || auth !== `Bearer ${env.ADMIN_KEY}`) {
        return json({ error: "Wrong key" }, 401, cors);
      }
      const db = env.DB;
      const [total, byPage, byCountry, byDay] = await Promise.all([
        db.prepare("SELECT COUNT(DISTINCT ip_hash) AS n FROM visits").first(),
        db.prepare("SELECT page, COUNT(*) AS n FROM visits GROUP BY page").all(),
        db.prepare(
          "SELECT country, COUNT(DISTINCT ip_hash) AS n FROM visits GROUP BY country ORDER BY n DESC LIMIT 15"
        ).all(),
        db.prepare(
          "SELECT substr(first_seen, 1, 10) AS day, COUNT(DISTINCT ip_hash) AS n FROM visits " +
          "WHERE first_seen >= date('now', '-30 day') GROUP BY day ORDER BY day"
        ).all(),
      ]);
      return json(
        { total: total.n, byPage: byPage.results, byCountry: byCountry.results, byDay: byDay.results },
        200,
        cors
      );
    }

    return json({ error: "Not found" }, 404, cors);
  },
};
