import { COUNTER_URL } from "./config";

const SKIP_KEY = "ao-skip-count"; // set from the stats page to ignore your own browser

export const isCountingSkipped = () => {
  try {
    return localStorage.getItem(SKIP_KEY) === "1";
  } catch {
    return false;
  }
};

export const setCountingSkipped = (skip) => {
  try {
    if (skip) localStorage.setItem(SKIP_KEY, "1");
    else localStorage.removeItem(SKIP_KEY);
  } catch {
    /* storage unavailable */
  }
};

// Report a page view. The worker ignores repeat visits from the same IP.
export const trackVisit = (page) => {
  if (!COUNTER_URL || isCountingSkipped()) return;
  fetch(`${COUNTER_URL}/hit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ page }),
    keepalive: true,
  }).catch(() => {});
};
