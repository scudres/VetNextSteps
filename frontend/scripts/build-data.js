"use strict";

// Writes the same data the Netlify functions serve to frontend/public/data/*.json,
// so it's a same-origin static file — reachable both by react-snap's headless
// crawl at build time and by the browser at runtime, with no serverless
// round-trip. This is what lets listing pages (conferences, providers,
// internships, certificates, training) prerender with real content and
// schema.org markup instead of a loading/error state.
//
// Runs as the "prebuild" step, before craco build and the react-snap postbuild.

const fs = require("fs");
const path = require("path");

const FUNCTIONS_DIR = path.join(__dirname, "..", "..", "functions");
const OUT_DIR = path.join(__dirname, "..", "public", "data");

const { conferences } = require(path.join(FUNCTIONS_DIR, "data", "conferences"));
const { cpdProviders } = require(path.join(FUNCTIONS_DIR, "data", "providers"));
const { internshipPrograms } = require(path.join(FUNCTIONS_DIR, "data", "internships"));
const { ukPrograms, usaCertCategories, australiaPrograms, newZealandPrograms } =
  require(path.join(FUNCTIONS_DIR, "data", "certificates"));
const { trainingPrograms } = require(path.join(FUNCTIONS_DIR, "data", "training"));
const { expandMultiYearConferences } = require(path.join(FUNCTIONS_DIR, "lib", "expand"));
const { resolveCountry, regionMeta, sortRegions, REGION_NAMES } =
  require(path.join(FUNCTIONS_DIR, "lib", "countries"));

fs.mkdirSync(OUT_DIR, { recursive: true });

const write = (name, data) =>
  fs.writeFileSync(path.join(OUT_DIR, name), JSON.stringify(data));

write("internships.json", internshipPrograms);
write("certificates.json", { uk: ukPrograms, usa: usaCertCategories, australia: australiaPrograms, newZealand: newZealandPrograms });
write("training.json", trainingPrograms);
// conferences.json and providers.json are written further down, once their
// country slugs have been normalised.

const expandedConferences = expandMultiYearConferences(conferences);

// ─── Country and region registries, derived from the data ────────────────────
// Adding an event in a country the site has never covered should need no config
// edit: every `country` slug present in the conference and provider data is
// resolved here (name, flag, continent) and written out, so the country filter
// picks it up on the next start or build. A region only appears once something
// in the data is actually in it — add a Tokyo conference and Asia shows up on
// its own.

const conferenceSlugs = expandedConferences.map((c) => c.country).filter(Boolean);
const providerSlugs   = cpdProviders.map((p) => p.country).filter(Boolean);
const countrySlugs    = [...new Set([...conferenceSlugs, ...providerSlugs])].sort();

const titleCase = (slug) =>
  slug.replace(/-/g, " ").replace(/\b\w/g, (ch) => ch.toUpperCase());

const countryConfig = {};
const canonicalSlug = {};   // slug as written in the data -> slug the site uses
const corrections   = [];
const ambiguous     = [];
const unresolved    = [];

for (const slug of countrySlugs) {
  const resolved = resolveCountry(slug);

  if (resolved && resolved.ambiguous) {
    // Two or more real countries are equally close. Guessing would file the
    // event under the wrong one silently, so it is reported instead.
    ambiguous.push({ slug, candidates: resolved.ambiguous });
    canonicalSlug[slug] = slug;
    countryConfig[slug] = { name: titleCase(slug), flag: "", region: null };
    continue;
  }

  if (!resolved) {
    unresolved.push(slug);
    canonicalSlug[slug] = slug;
    countryConfig[slug] = { name: titleCase(slug), flag: "", region: null };
    continue;
  }

  if (resolved.correctedFrom) corrections.push({ from: slug, to: resolved.id, name: resolved.name });
  canonicalSlug[slug] = resolved.id;
  countryConfig[resolved.id] = { name: resolved.name, flag: resolved.flag, region: resolved.region };
}

// Rewrite every country slug to its canonical form before the JSON is written,
// so a misspelling in the source data never reaches the filters, the counts, or
// the URLs. The source file keeps the typo until someone fixes it — the warning
// below says which.
const normalise = (rows) => rows.map((row) =>
  row.country && canonicalSlug[row.country] && canonicalSlug[row.country] !== row.country
    ? { ...row, country: canonicalSlug[row.country] }
    : row);

const normalisedConferences = normalise(expandedConferences);
const normalisedProviders   = normalise(cpdProviders);

write("conferences.json", normalisedConferences);
write("providers.json", normalisedProviders);

// Regions in play: every continent a country resolved to, plus any region tag
// carried directly on a conference (this is what keeps "global" alive — it is a
// tag, not a continent). Legacy country-shaped tags like "uk" are ignored here.
const regionIds = new Set();
for (const c of Object.values(countryConfig)) if (c.region) regionIds.add(c.region);
for (const conf of normalisedConferences) {
  for (const tag of conf.regions || []) if (REGION_NAMES[tag]) regionIds.add(tag);
}
const regionConfig = sortRegions([...regionIds]).map(regionMeta);

fs.writeFileSync(
  path.join(__dirname, "..", "src", "data", "countries.js"),
  "// GENERATED FILE \u2014 do not edit by hand.\n" +
  "// Written by scripts/build-data.js from the country slugs present in\n" +
  "// functions/data/conferences.js and functions/data/providers.js.\n" +
  "// To add a country, put its slug on an entry there \u2014 not here.\n\n" +
  "export const countryConfig = " + JSON.stringify(countryConfig, null, 2) + ";\n\n" +
  "export const regionConfig = " + JSON.stringify(regionConfig, null, 2) + ";\n"
);

for (const c of corrections) {
  console.warn(
    "build-data: corrected country \"" + c.from + "\" \u2192 \"" + c.to + "\" (" + c.name + "). " +
    "The site now shows it correctly; fix the slug in functions/data/ to clear this."
  );
}
for (const a of ambiguous) {
  console.warn(
    "build-data: WARNING \u2014 country \"" + a.slug + "\" is equally close to " +
    a.candidates.join(" and ") + ", so it has NOT been guessed. Set it explicitly " +
    "in functions/data/."
  );
}
if (unresolved.length > 0) {
  console.warn(
    "build-data: WARNING \u2014 unrecognised country slug(s): " + unresolved.join(", ") +
    "\n  These still appear in the filters but sit under no region. Check the " +
    "spelling, or add an alias in functions/lib/countries.js."
  );
}
console.log(
  "build-data: " + Object.keys(countryConfig).length + " countries across " +
  regionConfig.length + " regions \u2014 " + regionConfig.map((r) => r.id).join(", ")
);

// ─── Sitemap: the CPD section, generated from the data ───────────────────────
// Regions and country pages come and go as the conference and provider data
// changes, so hand-maintaining this list guarantees it drifts. Everything
// between the CPD:START / CPD:END markers in public/sitemap.xml is rewritten
// here on every build.
//
// What gets listed:
//   · the two hub pages, always;
//   · every region that actually has something in it;
//   · every country with at least MIN_EVENTS_FOR_SITEMAP entries, so a page
//     with a single event is not offered up as a destination of its own;
//   · plus any CPD URL already in the sitemap that still resolves — a published
//     URL is never dropped just because its event count fell below the bar.

const MIN_EVENTS_FOR_SITEMAP = 3;
const SITE = "https://vetnextstep.com";
const SITEMAP_PATH = path.join(__dirname, "..", "public", "sitemap.xml");
const today = new Date().toISOString().slice(0, 10);

const countBy = (rows, pick) => {
  const tally = new Map();
  for (const row of rows) {
    const key = pick(row);
    if (key) tally.set(key, (tally.get(key) || 0) + 1);
  }
  return tally;
};

const confByCountry     = countBy(normalisedConferences, (c) => c.country);
const provByCountry     = countBy(normalisedProviders,   (p) => p.country);
const confRegionCount   = new Map();
const provRegionCount   = new Map();
for (const region of regionConfig.map((r) => r.id)) {
  confRegionCount.set(region, normalisedConferences.filter((c) =>
    (c.regions || []).includes(region) ||
    (countryConfig[c.country] && countryConfig[c.country].region === region)).length);
  provRegionCount.set(region, normalisedProviders.filter((p) =>
    countryConfig[p.country] && countryConfig[p.country].region === region).length);
}

// URLs already published, so they can be preserved.
const existingSitemap = fs.readFileSync(SITEMAP_PATH, "utf8");
const alreadyListed = new Set(
  [...existingSitemap.matchAll(/<loc>([^<]*\/cpd[^<]*)<\/loc>/g)].map((m) => m[1])
);

const routes = [];
const addRoute = (loc, priority) => {
  if (!routes.some((r) => r.loc === loc)) routes.push({ loc, priority });
};

addRoute(SITE + "/cpd", "0.8");
for (const region of regionConfig) {
  if (confRegionCount.get(region.id) > 0) addRoute(`${SITE}/cpd/${region.id}`, "0.7");
}
for (const [slug, n] of [...confByCountry].sort()) {
  if (!countryConfig[slug] || !countryConfig[slug].region) continue;
  const loc = `${SITE}/cpd/${slug}`;
  if (n >= MIN_EVENTS_FOR_SITEMAP || alreadyListed.has(loc)) addRoute(loc, "0.6");
}

addRoute(SITE + "/cpd/providers", "0.8");
for (const region of regionConfig) {
  if (provRegionCount.get(region.id) > 0) addRoute(`${SITE}/cpd/providers/${region.id}`, "0.7");
}
for (const [slug, n] of [...provByCountry].sort()) {
  if (!countryConfig[slug]) continue;
  const loc = `${SITE}/cpd/providers/${slug}`;
  if (n >= MIN_EVENTS_FOR_SITEMAP || alreadyListed.has(loc)) addRoute(loc, "0.6");
}

const cpdXml = routes.map(({ loc, priority }) =>
  "  <url>\n" +
  "    <loc>" + loc + "</loc>\n" +
  "    <lastmod>" + today + "</lastmod>\n" +
  "    <changefreq>monthly</changefreq>\n" +
  "    <priority>" + priority + "</priority>\n" +
  "  </url>\n"
).join("");

const START_MARKER = existingSitemap.match(/^.*CPD:START.*$/m);
const END_MARKER   = "  <!-- CPD:END -->";
if (!START_MARKER || !existingSitemap.includes(END_MARKER)) {
  console.warn(
    "build-data: WARNING \u2014 sitemap.xml has no CPD:START/CPD:END markers, so the " +
    "CPD section was not regenerated. Restore the markers to re-enable it."
  );
} else {
  const startLine = START_MARKER[0] + "\n";
  const head = existingSitemap.slice(0, existingSitemap.indexOf(startLine) + startLine.length);
  const tail = existingSitemap.slice(existingSitemap.indexOf(END_MARKER));
  fs.writeFileSync(SITEMAP_PATH, head + cpdXml + tail);

  const dropped = [...alreadyListed].filter((loc) => !routes.some((r) => r.loc === loc));
  console.log("build-data: sitemap CPD section \u2014 " + routes.length + " URLs" +
    (dropped.length ? " (" + dropped.length + " no longer resolve: " + dropped.join(", ") + ")" : ""));

  // react-snap's prerender list lives in package.json and is not generated, so
  // flag anything the sitemap now offers that would not be prerendered.
  const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "package.json"), "utf8"));
  const prerendered = new Set((pkg.reactSnap && pkg.reactSnap.include) || []);
  const missing = routes.map((r) => r.loc.replace(SITE, "")).filter((r) => !prerendered.has(r));
  if (missing.length > 0) {
    console.warn(
      "build-data: WARNING \u2014 in sitemap but not prerendered by react-snap: " +
      missing.join(", ") + "\n  Add them to reactSnap.include in frontend/package.json."
    );
  }
}

// ─── Derived counts for homepage copy ────────────────────────────────────────
// The homepage states figures like "101 conferences" and "58 CPD providers" in
// prose. Typed by hand they drift silently the moment an entry is added — the
// page claimed "70+ conferences" against 100 for some time. Deriving them here
// costs nothing (the data is already in memory) and, unlike a runtime fetch,
// adds no request, no loading state, and no react-snap/hydration mismatch.


const conferenceYears = normalisedConferences
  .map((c) => {
    const m = String(c.dates || "").match(/\b(20\d{2})\b/);
    return m ? Number(m[1]) : null;
  })
  .filter(Boolean);

const counts = {
  conferences:     normalisedConferences.length,
  providers:       cpdProviders.length,
  providerRegions: new Set(cpdProviders.map((p) => p.country)).size,
  internships:     internshipPrograms.length,
  certificates:    ukPrograms.length + usaCertCategories.length +
                   australiaPrograms.length + newZealandPrograms.length,
  training:        trainingPrograms.length,
  conferenceYearFrom: Math.min(...conferenceYears),
  conferenceYearTo:   Math.max(...conferenceYears),
};

fs.writeFileSync(
  path.join(__dirname, "..", "src", "data", "counts.js"),
  "// GENERATED FILE \u2014 do not edit by hand.\n" +
  "// Written by scripts/build-data.js on every `npm start` and `npm run build`.\n" +
  "// Change the source data in functions/data/*.js instead.\n\n" +
  "export const counts = " + JSON.stringify(counts, null, 2) + ";\n"
);

console.log("build-data: wrote conferences, providers, internships, certificates, training JSON to public/data/");
console.log("build-data: wrote derived counts to src/data/counts.js \u2014", JSON.stringify(counts));
