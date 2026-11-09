CREATE TABLE IF NOT EXISTS visits (
  ip_hash    TEXT NOT NULL,
  page       TEXT NOT NULL,
  country    TEXT,
  first_seen TEXT NOT NULL,
  PRIMARY KEY (ip_hash, page)
);
