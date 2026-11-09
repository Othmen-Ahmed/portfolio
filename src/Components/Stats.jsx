import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { COUNTER_URL } from "../config";
import { isCountingSkipped, setCountingSkipped } from "../analytics";
import "./Simulator/Simulator.css";

const KEY_STORE = "ao-stats-key";

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
      setData(await res.json());
      try { localStorage.setItem(KEY_STORE, k); } catch { /* ignore */ }
    } catch (e) {
      setError(`Could not reach the counter: ${e.message}`);
    }
  };

  useEffect(() => {
    if (key) load(key);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const max = data ? Math.max(1, ...data.byDay.map((d) => d.n)) : 1;

  return (
    <div className="ks-root">
      <header className="ks-top">
        <div className="ks-brand">
          <Link to="/" className="ks-back">Portfolio</Link>
          <h1>Visitors</h1>
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
                  <span>{p.page === "home" ? "Portfolio page" : "Kiln simulator"}</span>
                  <span />
                  <b>{p.n}</b>
                </li>
              ))}
            </ul>
          </section>

          <section className="ks-score">
            <h2>New visitors, last 30 days</h2>
            {data.byDay.length === 0 && <p className="ks-hint">No visits in the last 30 days.</p>}
            <ul className="ks-bands">
              {data.byDay.map((d) => (
                <li key={d.day}>
                  <span>{d.day}</span>
                  <span className="ks-meter"><span style={{ width: `${(100 * d.n) / max}%` }} /></span>
                  <b>{d.n}</b>
                </li>
              ))}
            </ul>
          </section>

          <section className="ks-score">
            <h2>Countries</h2>
            <ul className="ks-bands">
              {data.byCountry.map((c) => (
                <li key={c.country || "unknown"}>
                  <span>{c.country || "Unknown"}</span>
                  <span />
                  <b>{c.n}</b>
                </li>
              ))}
            </ul>
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
