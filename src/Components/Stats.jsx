import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { COUNTER_URL } from "../config";
import { isCountingSkipped, setCountingSkipped } from "../analytics";
import "./Simulator/Simulator.css";

const KEY_STORE = "ao-stats-key";

// Defaults for every field so the page still works with an older worker
// that has not been redeployed with the new columns yet.
const EMPTY_DATA = {
  total: 0,
  byPage: [],
  byDay: [],
  byCountry: [],
  byCity: [],
  byTimezone: [],
  byReferrer: [],
  byDevice: [],
  byOs: [],
  byBrowser: [],
  byHour: [],
  recent: [],
};

const PAGE_LABELS = { home: "Portfolio page", simulator: "Kiln simulator", projects: "Projects" };
const pageLabel = (page) => PAGE_LABELS[page] || page;

const Bands = ({ items, empty, format }) => {
  const max = Math.max(1, ...items.map((i) => i.n));
  if (items.length === 0) return <p className="ks-hint">{empty}</p>;
  return (
    <ul className="ks-bands">
      {items.map((item, i) => (
        <li key={i}>
          <span>{format ? format(item) : item.label}</span>
          <span className="ks-meter"><span style={{ width: `${(100 * item.n) / max}%` }} /></span>
          <b>{item.n}</b>
        </li>
      ))}
    </ul>
  );
};

// Private page, not linked anywhere: #/stats
// The numbers only load with the ADMIN_KEY you set in Cloudflare.
const Stats = () => {
  const [key, setKey] = useState(() => {
    try { return localStorage.getItem(KEY_STORE) || ""; } catch { return ""; }
  });
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [skip, setSkip] = useState(isCountingSkipped());

  const load = async (k) => {
    setError("");
    if (!COUNTER_URL) {
      setError("The counter address is not set yet. Put your Worker URL in src/config.js.");
      return;
    }
    try {
      const res = await fetch(`${COUNTER_URL}/stats`, { headers: { Authorization: `Bearer ${k}` } });
      if (res.status === 401) {
        setError("That key is wrong.");
        return;
      }
      if (!res.ok) throw new Error(`Worker answered ${res.status}`);
      setData({ ...EMPTY_DATA, ...(await res.json()) });
      try { localStorage.setItem(KEY_STORE, k); } catch { /* ignore */ }
    } catch (e) {
      setError(`Could not reach the counter: ${e.message}`);
    }
  };

  useEffect(() => {
    if (key) load(key);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const byHour = data
    ? Array.from({ length: 24 }, (_, h) => {
        const found = data.byHour.find((d) => d.hour === h);
        return { hour: h, n: found ? found.n : 0 };
      })
    : [];
  const hourMax = Math.max(1, ...byHour.map((h) => h.n));
  const firstSeen = data && data.recent.length > 0 ? data.recent[data.recent.length - 1].first_seen : null;
  const lastSeen = data && data.recent.length > 0 ? data.recent[0].first_seen : null;

  return (
    <div className="ks-root">
      <header className="ks-top">
        <div className="ks-brand">
          <Link to="/" className="ks-back">Portfolio</Link>
          <h1>Visitors dashboard</h1>
        </div>
      </header>

      {!data && (
        <form
          className="ks-stats-login"
          onSubmit={(e) => {
            e.preventDefault();
            load(key);
          }}
        >
          <label htmlFor="stats-key">Admin key</label>
          <input id="stats-key" type="password" value={key} onChange={(e) => setKey(e.target.value)} autoComplete="current-password" />
          <button type="submit" className="ks-primary">Show visitors</button>
          {error && <p className="ks-stats-error">{error}</p>}
        </form>
      )}

      {data && (
        <div className="ks-stats">
          <section className="ks-score">
            <h2>Unique visitors</h2>
            <p className="ks-stats-big">{data.total}</p>
            <p className="ks-hint">Each IP address is counted once, however many times it visits.</p>
            <ul className="ks-bands">
              {data.byPage.map((p) => (
                <li key={p.page}>
                  <span>{pageLabel(p.page)}</span>
                  <span />
                  <b>{p.n}</b>
                </li>
              ))}
            </ul>
            {firstSeen && (
              <p className="ks-hint">
                First visit {new Date(firstSeen).toLocaleDateString()} &middot; latest{" "}
                {new Date(lastSeen).toLocaleString()}
              </p>
            )}
          </section>

          <section className="ks-score">
            <h2>New visitors, last 30 days</h2>
            <Bands items={data.byDay.map((d) => ({ label: d.day, n: d.n }))} empty="No visits in the last 30 days." />
          </section>

          <section className="ks-score">
            <h2>Visits by local hour</h2>
            <div className="ks-hours">
              {byHour.map((h) => (
                <div className="ks-hour" key={h.hour} title={`${h.hour}:00 — ${h.n} visitor(s)`}>
                  <span className="ks-hour-bar" style={{ height: `${Math.max(2, (100 * h.n) / hourMax)}%` }} />
                  <span className="ks-hour-label">{h.hour}</span>
                </div>
              ))}
            </div>
            <p className="ks-hint">Visitor's local time when they first arrived.</p>
          </section>

          <section className="ks-score">
            <h2>Countries</h2>
            <Bands items={data.byCountry.map((c) => ({ label: c.country || "Unknown", n: c.n }))} empty="No country data yet." />
          </section>

          <section className="ks-score">
            <h2>Cities</h2>
            <Bands
              items={data.byCity.map((c) => ({ label: `${c.city}${c.country ? `, ${c.country}` : ""}`, n: c.n }))}
              empty="No city data yet."
            />
          </section>

          <section className="ks-score">
            <h2>Timezones</h2>
            <Bands items={data.byTimezone.map((t) => ({ label: t.timezone, n: t.n }))} empty="No timezone data yet." />
          </section>

          <section className="ks-score">
            <h2>Where they came from</h2>
            <Bands items={data.byReferrer.map((r) => ({ label: r.referrer, n: r.n }))} empty="No referrers yet (direct visits only)." />
          </section>

          <section className="ks-score">
            <h2>Devices</h2>
            <Bands items={data.byDevice.map((d) => ({ label: d.device, n: d.n }))} empty="No device data yet." />
            <h2 className="ks-stats-subhead">Operating systems</h2>
            <Bands items={data.byOs.map((o) => ({ label: o.os, n: o.n }))} empty="No OS data yet." />
            <h2 className="ks-stats-subhead">Browsers</h2>
            <Bands items={data.byBrowser.map((b) => ({ label: b.browser, n: b.n }))} empty="No browser data yet." />
          </section>

          <section className="ks-score ks-stats-wide">
            <h2>Latest visitors</h2>
            {data.recent.length === 0 && <p className="ks-hint">No visits recorded yet.</p>}
            {data.recent.length > 0 && (
              <table className="ks-table">
                <thead>
                  <tr>
                    <th>When</th>
                    <th>Page</th>
                    <th>Location</th>
                    <th>Device</th>
                    <th>From</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recent.map((v, i) => (
                    <tr key={i}>
                      <td>{new Date(v.first_seen).toLocaleString()}</td>
                      <td>{pageLabel(v.page)}</td>
                      <td>{[v.city, v.country].filter(Boolean).join(", ") || "Unknown"}</td>
                      <td>{[v.device, v.os, v.browser].filter(Boolean).join(" · ")}</td>
                      <td>{v.referrer || "Direct"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>

          <section className="ks-score">
            <h2>This browser</h2>
            <label className="ks-stats-check">
              <input
                type="checkbox"
                checked={skip}
                onChange={(e) => {
                  setCountingSkipped(e.target.checked);
                  setSkip(e.target.checked);
                }}
              />
              Don't count my own visits from this browser
            </label>
            <button
              type="button"
              className="ks-stats-logout"
              onClick={() => {
                try { localStorage.removeItem(KEY_STORE); } catch { /* ignore */ }
                setData(null);
                setKey("");
              }}
            >
              Forget the key on this browser
            </button>
          </section>
        </div>
      )}
    </div>
  );
};

export default Stats;
