import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { COUNTER_URL } from "../config";
import { isCountingSkipped, setCountingSkipped } from "../analytics";
import TimeChart from "./Stats/TimeChart";
import HeatMap from "./Stats/HeatMap";
import WorldMap from "./Stats/WorldMap";
import {
  buildSeries, change, countryName, duration, flag, languageName, localDate, localTime,
  pageLabel, placeLabel, share, toCsv,
} from "./Stats/format";
import "./Simulator/Simulator.css";
import "./Stats/Stats.css";

const KEY_STORE = "ao-stats-key";

const RANGES = [
  { value: 1, label: "Last 24 hours" },
  { value: 7, label: "Last 7 days" },
  { value: 30, label: "Last 30 days" },
  { value: 90, label: "Last 90 days" },
  { value: 365, label: "Last 12 months" },
];

// One number of the top row
const Tile = ({ label, value, note }) => (
  <div className="st-tile">
    <span className="st-tile-label">{label}</span>
    <span className="st-tile-value">{value}</span>
    <span className="st-tile-note">{note}</span>
  </div>
);

// A ranked list with a bar per line: countries, browsers, sources...
// rows: [{ name, visitors, views }]
const BarList = ({ title, rows, total, name = (row) => row.name, empty = "Nothing in this period." }) => {
  const max = Math.max(1, ...rows.map((row) => row.visitors));
  return (
    <section className="st-panel">
      <h2>{title}</h2>
      {rows.length === 0 && <p className="ks-hint">{empty}</p>}
      <ul className="st-bars">
        {rows.map((row) => (
          <li key={row.name + (row.region || "") + (row.country || "")}>
            <span className="st-bars-name" title={name(row)}>{name(row)}</span>
            <span className="ks-meter"><span style={{ width: `${(100 * row.visitors) / max}%` }} /></span>
            <b>{row.visitors}</b>
            <span className="st-bars-share">{share(row.visitors, total)}</span>
          </li>
        ))}
      </ul>
    </section>
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
  const [loading, setLoading] = useState(false);
  const [skip, setSkip] = useState(isCountingSkipped());
  const [range, setRange] = useState(30);
  const [page, setPage] = useState("");
  const [auto, setAuto] = useState(false);
  const [search, setSearch] = useState("");
  const [showAll, setShowAll] = useState(false);
  const signedIn = useRef(false);

  const load = async (k, r = range, p = page) => {
    setError("");
    if (!COUNTER_URL) {
      setError("The counter address is not set yet. Put your Worker URL in src/config.js.");
      return;
    }
    setLoading(true);
    try {
      const tz = -new Date().getTimezoneOffset();
      const query = `range=${r}&tz=${tz}${p ? `&page=${encodeURIComponent(p)}` : ""}`;
      const res = await fetch(`${COUNTER_URL}/stats?${query}`, { headers: { Authorization: `Bearer ${k}` } });
      if (res.status === 401) {
        signedIn.current = false;
        setData(null);
        setError("That key is wrong.");
        return;
      }
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || `Worker answered ${res.status}`);
      if (!body.totals) {
        setError("The counter in Cloudflare is still the old version. Paste the new counter-worker/worker.js there and deploy it.");
        return;
      }
      signedIn.current = true;
      setData(body);
      try { localStorage.setItem(KEY_STORE, k); } catch { /* ignore */ }
    } catch (e) {
      setError(`Could not reach the counter: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (key) load(key);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reload when the period or the page filter changes
  useEffect(() => {
    if (signedIn.current) load(key, range, page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range, page]);

  // Optional refresh every minute
  useEffect(() => {
    if (!auto) return undefined;
    const timer = setInterval(() => {
      if (signedIn.current && !document.hidden) load(key, range, page);
    }, 60000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auto, key, range, page]);

  const downloadCsv = () => {
    const blob = new Blob([toCsv(data.recent)], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `portfolio-visits-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const periodName = (RANGES.find((r) => r.value === range) || RANGES[2]).label.toLowerCase();
  const totals = data ? data.totals : null;
  const returning = data ? Math.max(0, totals.visitors - data.newVisitors) : 0;
  const needle = search.trim().toLowerCase();
  const visits = data
    ? data.recent.filter(
        (row) =>
          !needle ||
          [pageLabel(row.page), placeLabel(row), row.network, row.source, row.device, row.browser, row.os, row.visitor]
            .join(" ")
            .toLowerCase()
            .includes(needle)
      )
    : [];

  return (
    <div className="ks-root st-root">
      <header className="ks-top">
        <div className="ks-brand">
          <Link to="/" className="ks-back">Portfolio</Link>
          <h1>Visitors</h1>
        </div>

        {data && (
          <>
            <div className="ks-controls">
              <label>
                Period
                <select value={range} onChange={(e) => setRange(Number(e.target.value))}>
                  {RANGES.map((r) => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </label>
              <label>
                Page
                <select value={page} onChange={(e) => setPage(e.target.value)}>
                  <option value="">All pages</option>
                  {data.pageList.map((p) => (
                    <option key={p.page} value={p.page}>{pageLabel(p.page)}</option>
                  ))}
                </select>
              </label>
              <button type="button" onClick={() => load(key)} disabled={loading}>
                {loading ? "Loading" : "Refresh"}
              </button>
              <label className="st-auto">
                <input type="checkbox" checked={auto} onChange={(e) => setAuto(e.target.checked)} />
                Refresh every minute
              </label>
            </div>
            <div className="ks-clock">
              <span className="ks-clock-label">On the site in the last 30 minutes</span>
              <span className="ks-clock-time">{data.live}</span>
              <span className="ks-clock-of">updated {localTime(data.generatedAt)}</span>
            </div>
          </>
        )}
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
          <button type="submit" className="ks-primary" disabled={loading}>Show visitors</button>
          {error && <p className="ks-stats-error">{error}</p>}
        </form>
      )}

      {data && error && <p className="ks-stats-error st-error">{error}</p>}

      {data && (
        <div className="st-board">
          <div className="st-tiles">
            <Tile
              label="Visitors"
              value={totals.visitors}
              note={change(totals.visitors, data.previous.visitors)}
            />
            <Tile
              label="Page views"
              value={totals.views}
              note={change(totals.views, data.previous.views)}
            />
            <Tile
              label="Average time on a page"
              value={duration(totals.seconds)}
              note={data.previous.seconds ? `${duration(data.previous.seconds)} the period before` : "pages left open in a hidden tab are not timed"}
            />
            <Tile
              label="Returning visitors"
              value={returning}
              note={`${share(returning, totals.visitors)} of visitors had come before`}
            />
            <Tile
              label="Today"
              value={data.today.visitors}
              note={`${data.today.views} page ${data.today.views === 1 ? "view" : "views"} since midnight`}
            />
            <Tile
              label="Since the start"
              value={data.allTime.visitors}
              note={data.allTime.since ? `visitors since ${localDate(data.allTime.since)}` : "no visit yet"}
            />
          </div>

          <div className="st-row st-row-wide">
            <TimeChart
              title={data.bucket === "hour" ? "Visits per hour" : "Visits per day"}
              points={buildSeries(data)}
            />
            <HeatMap cells={data.heat} />
          </div>

          <div className="st-row st-row-wide">
            <WorldMap cities={data.cities} />
            <div className="st-stack">
              <BarList
                title="Countries"
                rows={data.countries}
                total={totals.visitors}
                name={(row) => `${flag(row.name)} ${countryName(row.name)}`.trim()}
              />
              <BarList
                title="Cities"
                rows={data.cities.slice(0, 12).map((c) => ({ ...c, name: c.city }))}
                total={totals.visitors}
                name={(row) => `${flag(row.country)} ${placeLabel(row)}`.trim()}
              />
            </div>
          </div>

          <div className="st-row st-row-wide">
            <section className="st-panel">
              <h2>Pages</h2>
              <div className="st-scroll">
                <table className="st-table">
                  <thead>
                    <tr>
                      <th>Page</th>
                      <th className="st-num">Views</th>
                      <th className="st-num">Visitors</th>
                      <th className="st-num">Average time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.pages.map((p) => (
                      <tr key={p.page}>
                        <td>{pageLabel(p.page)}</td>
                        <td className="st-num">{p.views}</td>
                        <td className="st-num">{p.visitors}</td>
                        <td className="st-num">{duration(p.seconds)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {data.pages.length === 0 && <p className="ks-hint">No page was opened in the {periodName}.</p>}
            </section>
            <BarList
              title="Where visits come from"
              rows={data.sources}
              total={totals.visitors}
              empty="Nothing in this period."
            />
          </div>

          <div className="st-row st-row-even">
            <BarList title="Networks and companies" rows={data.networks} total={totals.visitors} />
            <BarList title="Devices" rows={data.devices} total={totals.visitors} />
            <BarList title="Browsers" rows={data.browsers} total={totals.visitors} />
            <BarList title="Operating systems" rows={data.systems} total={totals.visitors} />
            <BarList
              title="Browser languages"
              rows={data.languages}
              total={totals.visitors}
              name={(row) => languageName(row.name)}
            />
            <BarList title="Visitor time zones" rows={data.zones} total={totals.visitors} />
            <BarList title="Screen sizes" rows={data.screens} total={totals.visitors} />
          </div>

          <section className="st-panel">
            <div className="st-panel-head">
              <h2>Latest visits</h2>
              <div className="st-panel-tools">
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Filter by place, page, network..."
                  aria-label="Filter the latest visits"
                />
                <button type="button" onClick={downloadCsv} disabled={data.recent.length === 0}>
                  Download as CSV
                </button>
              </div>
            </div>
            <div className="st-scroll">
              <table className="st-table">
                <thead>
                  <tr>
                    <th>When</th>
                    <th>Page</th>
                    <th>Place</th>
                    <th>Network</th>
                    <th>Came from</th>
                    <th>Device</th>
                    <th className="st-num">Time on page</th>
                    <th>Visitor</th>
                  </tr>
                </thead>
                <tbody>
                  {(showAll ? visits : visits.slice(0, 25)).map((row) => (
                    <tr key={`${row.ts}-${row.visitor}-${row.page}`}>
                      <td className="st-nowrap">{localTime(row.ts)}</td>
                      <td>{pageLabel(row.page)}</td>
                      <td>{`${flag(row.country)} ${placeLabel(row)}`.trim()}</td>
                      <td>{row.network || "–"}</td>
                      <td>{row.source || "Direct or unknown"}</td>
                      <td>{[row.device, row.browser, row.os].filter(Boolean).join(", ") || "–"}</td>
                      <td className="st-num">{duration(row.duration)}</td>
                      <td className="st-nowrap">
                        <code>{row.visitor}</code> {row.back ? "returning" : "new"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {visits.length === 0 && (
              <p className="ks-hint">{needle ? "No visit matches this filter." : `No visit in the ${periodName}.`}</p>
            )}
            {visits.length > 25 && (
              <button type="button" className="st-more" onClick={() => setShowAll(!showAll)}>
                {showAll ? "Show the 25 latest only" : `Show all ${visits.length} visits`}
              </button>
            )}
            <p className="ks-hint">
              The visitor code is the start of a one-way hash of the IP address: the same code is the same
              visitor, and the address itself is never stored. Up to 200 visits are listed.
            </p>
          </section>

          <section className="st-panel st-settings">
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
                signedIn.current = false;
                setData(null);
                setKey("");
              }}
            >
              Forget the key on this browser
            </button>
            <p className="ks-hint">
              To know which link brought a visitor, add a tag to the address you share,
              for example <code>/portfolio/?ref=cv</code> in your resume or <code>?ref=linkedin</code> in
              your profile. The tag shows under "Where visits come from".
            </p>
          </section>
        </div>
      )}
    </div>
  );
};

export default Stats;
