// Listing data (conferences, providers, internships, certificates, training)
// lives in static JSON under /data/ rather than in the JS bundle, so react-snap
// can prerender those pages with real content instead of a loading state.
//
// That created a hydration problem. react-snap snapshots the page after the
// fetch has resolved, so the prerendered HTML contains the full listing — but in
// a real browser the component mounts with empty state and renders "Loading
// conferences…" first. React sees markup that doesn't match, discards the entire
// prerendered tree and re-renders from scratch, which showed as a visible flash
// of the loading state on every listing page.
//
// The data is therefore carried in the prerendered HTML itself. react-snap's own
// snapSaveState hook cannot be used for this: it emits an executable inline
// <script>, and the site's CSP allows no 'unsafe-inline', so the browser blocks
// it and the data never arrives. Instead the crawl writes a
// <script type="application/json"> block, which is inert data rather than code —
// CSP's script-src does not apply to it — and the browser parses it back on load.

const SCRIPT_ID = "vns-preloaded-data";

let cache = null;

// Read lazily rather than at module load, so the element is certainly parsed.
const getCache = () => {
  if (!cache) {
    let preloaded = {};
    if (typeof document !== "undefined") {
      const el = document.getElementById(SCRIPT_ID);
      if (el) {
        try { preloaded = JSON.parse(el.textContent) || {}; }
        catch { preloaded = {}; }   // malformed: fall back to fetching
      }
    }
    cache = { ...preloaded };
  }
  return cache;
};

/** Data already available synchronously, or null. */
export const getCached = (name) => getCache()[name] || null;

/** Fetch a data file, resolving immediately when it is already in hand. */
export const loadData = (name) => {
  const store = getCache();
  if (store[name]) return Promise.resolve(store[name]);
  return fetch(`/data/${name}.json`)
    .then((res) => {
      if (!res.ok) throw new Error(`Failed to load ${name}`);
      return res.json();
    })
    .then((data) => {
      store[name] = data;
      return data;
    });
};

// During the crawl, keep a JSON block in <head> up to date with whatever has been
// fetched. react-snap serialises the whole document, so the block lands in the
// prerendered HTML. It sits outside #root so React never tries to hydrate it.
export const publishSnapshot = () => {
  if (typeof document === "undefined") return;
  let el = document.getElementById(SCRIPT_ID);
  if (!el) {
    el = document.createElement("script");
    el.type = "application/json";
    el.id = SCRIPT_ID;
    document.head.appendChild(el);
  }
  // Escaping "<" keeps a value containing "</script>" from ending the element.
  el.textContent = JSON.stringify(getCache()).replace(/</g, "\\u003c");
};

const isPrerendering =
  typeof navigator !== "undefined" && navigator.userAgent === "ReactSnap";

if (isPrerendering) {
  // loadData resolves after this module is evaluated, so refresh on a timer for
  // the duration of the crawl.
  setInterval(publishSnapshot, 100);
}
