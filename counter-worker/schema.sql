-- Visitor log for the portfolio dashboard.
-- The Worker creates these tables by itself on its first request, so you only
-- need this file if you want to create them by hand in the D1 console.

CREATE TABLE IF NOT EXISTS hits (
  id       TEXT PRIMARY KEY,            -- random id of this page view
  visitor  TEXT NOT NULL,               -- salted SHA-256 of the IP, never the IP itself
  page     TEXT NOT NULL,               -- home, simulator, projects, project:<slug>
  ts       TEXT NOT NULL,               -- UTC time of the view, ISO 8601
  duration INTEGER NOT NULL DEFAULT 0,  -- seconds the page stayed visible
  country  TEXT,
  region   TEXT,
  city     TEXT,
  lat      REAL,
  lon      REAL,
  tz       TEXT,                        -- visitor time zone, e.g. Europe/Paris
  network  TEXT,                        -- internet provider or company network
  source   TEXT,                        -- referring site, or the ?ref= tag of the link
  device   TEXT,
  browser  TEXT,
  os       TEXT,
  lang     TEXT,
  screen   TEXT
);
CREATE INDEX IF NOT EXISTS hits_ts ON hits (ts);
CREATE INDEX IF NOT EXISTS hits_visitor ON hits (visitor, ts);

-- One-time copy of the old counter (table "visits") into the new log.
-- Safe to run again: rows already copied are skipped.
INSERT OR IGNORE INTO hits (id, visitor, page, ts, country)
  SELECT ip_hash || ':' || page, ip_hash, page, first_seen, country FROM visits;
