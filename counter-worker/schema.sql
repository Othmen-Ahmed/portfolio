CREATE TABLE IF NOT EXISTS visits (
  ip_hash    TEXT NOT NULL,
  page       TEXT NOT NULL,
  country    TEXT,
  first_seen TEXT NOT NULL,
  city       TEXT,
  region     TEXT,
  timezone   TEXT,
  referrer   TEXT,
  device     TEXT,
  os         TEXT,
  browser    TEXT,
  local_hour INTEGER,
  PRIMARY KEY (ip_hash, page)
);

-- If your database still has the old table, run these once in the
-- Cloudflare dashboard (Storage & Databases > D1 > your database > Console):
-- ALTER TABLE visits ADD COLUMN city TEXT;
-- ALTER TABLE visits ADD COLUMN region TEXT;
-- ALTER TABLE visits ADD COLUMN timezone TEXT;
-- ALTER TABLE visits ADD COLUMN referrer TEXT;
-- ALTER TABLE visits ADD COLUMN device TEXT;
-- ALTER TABLE visits ADD COLUMN os TEXT;
-- ALTER TABLE visits ADD COLUMN browser TEXT;
-- ALTER TABLE visits ADD COLUMN local_hour INTEGER;
