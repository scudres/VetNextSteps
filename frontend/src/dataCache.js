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
// react-snap's snapSaveState hook serialises a value into the prerendered HTML.
// Handing it whatever was fetched during the crawl means the browser has the
// data synchronously on the very first render, so hydration matches and the
// loading state never appears on a prerendered page.

let cache = null;

// Read lazily rather than at module load: react-snap injects its state script
// into the HTML, and we should not depend on it having run before this module
// is evaluated.
const getCache = () => {
  if (!cache) {
    const preloaded = (typeof window !== "undefined" && window.__VNS_DATA__) || {};
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

if (typeof navigator !== "undefined" && navigator.userAgent === "ReactSnap") {
  window.snapSaveState = () => ({ __VNS_DATA__: getCache() });
}
