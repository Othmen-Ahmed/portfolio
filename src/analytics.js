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

const post = (path, body) =>
  fetch(`${COUNTER_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    keepalive: true,
  });

// The page view being timed: { id, base, ms, since }
// ms is the time the page was really on screen, since is when it last became visible.
let view = null;
let firstVisit = true;
let last = { page: "", at: 0 };

// Where the visitor came from. A link such as .../portfolio/?ref=cv tags the visit
// as "cv", which is the only way to tell apart links opened from a PDF or an email.
const readOrigin = () => {
  try {
    const query = new URLSearchParams(window.location.search);
    return {
      ref: document.referrer || "",
      tag: query.get("ref") || query.get("utm_source") || "",
    };
  } catch {
    return { ref: "", tag: "" };
  }
};

// Tell the counter how long the current page has been on screen
const reportTime = () => {
  if (!view || !view.id) return;
  if (view.since) {
    view.ms += Date.now() - view.since;
    view.since = document.hidden ? null : Date.now();
  }
  const seconds = view.base + Math.round(view.ms / 1000);
  if (seconds > 0) post("/time", { id: view.id, seconds }).catch(() => {});
};

if (typeof document !== "undefined") {
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) reportTime();
    else if (view) view.since = Date.now();
  });
  window.addEventListener("pagehide", reportTime);
}

// Report a page view. Reloading the same page within 30 minutes is not counted twice.
export const trackVisit = (page) => {
  if (!COUNTER_URL || isCountingSkipped()) return;
  if (page === last.page && Date.now() - last.at < 2000) return; // same view rendered twice
  last = { page, at: Date.now() };

  reportTime(); // close the page the visitor is leaving
  const mine = { id: null, base: 0, ms: 0, since: document.hidden ? null : Date.now() };
  view = mine;

  const origin = firstVisit ? readOrigin() : { ref: "", tag: "" };
  firstVisit = false;
  post("/hit", {
    page,
    ref: origin.ref,
    tag: origin.tag,
    lang: navigator.language || "",
    screen: `${window.screen.width}x${window.screen.height}`,
  })
    .then((res) => res.json())
    .then((data) => {
      mine.id = data.id || null;
      mine.base = data.base || 0;
    })
    .catch(() => {});
};
