"use strict";

const { conferences }          = require("./data/conferences");
const { cpdProviders }         = require("./data/providers");
const { trainingPrograms }     = require("./data/training");
const { internshipPrograms }   = require("./data/internships");
const { ukPrograms: ukCerts }  = require("./data/certificates");
const { corsHeaders, preflight } = require("./lib/cors");
const { makeRateLimiter } = require("./lib/rateLimit");

const checkRate = makeRateLimiter(60, 60_000);
const { slugify }              = require("./lib/slugify");

// ——— Derive search items from canonical data ———

const trainingItems = trainingPrograms.map((p) => ({
  title:       p.title,
  subtitle:    p.organisation,
  description: p.description,
  url:         p.url,
  section:     "Graduate Development Programmes",
  navPath:     `/training-programs/${p.country}#${slugify(p.title)}`,
  tags:        p.tags,
}));

const internshipItems = internshipPrograms.map((p) => ({
  title:       p.title,
  subtitle:    p.organisation,
  description: p.description,
  url:         p.url,
  section:     "Internships & Residencies",
  navPath:     `/internships-residencies/${p.region}#${slugify(p.title)}`,
  tags:        [
    p.type,
    p.region,
    ...(p.specialties || []),
    ...(p.species ? p.species.split(/,\s*/) : []),
  ].filter(Boolean),
}));

const certItems = ukCerts.map((p) => ({
  title:       p.title,
  subtitle:    p.organisation,
  description: p.description,
  url:         p.url,
  section:     "Postgraduate Certificates",
  navPath:     `/postgraduate-certificates/uk#${slugify(p.title)}`,
  tags:        ["certificate", "postgraduate", "UK"],
}));

// Build search index at cold-start (cached across warm invocations).
// Each entry carries a precomputed lowercase haystack so searches are O(n) string scans.
const searchIndex = [
  ...trainingItems,
  ...internshipItems,
  ...certItems,
  ...conferences.map((c) => ({
    title:       c.title,
    subtitle:    c.organiser,
    description: `${c.dates} · ${c.location}${c.notes ? " — " + c.notes : ""}`,
    section:     "Conferences",
    url:         c.website || null,
    navPath:     "/cpd#" + slugify(c.title),
    tags:        [...c.specialties, ...c.regions, c.category || ""],
  })),
  ...cpdProviders.map((p) => ({
    title:       p.provider,
    subtitle:    p.programme,
    description: `${p.location}${p.notes ? " — " + p.notes : ""}`,
    section:     "CPD Providers",
    url:         p.website || null,
    navPath:     "/cpd?section=providers#" + slugify(p.provider),
    tags:        p.types,
  })),
].map((item) => ({
  ...item,
  _h: [item.title, item.subtitle || "", item.description || "", ...(item.tags || [])].join(" ").toLowerCase(),
}));

const MAX_QUERY_LENGTH = 200;

function searchItems(rawQuery) {
  if (!rawQuery || rawQuery.trim().length < 2) return [];
  const q     = rawQuery.trim().toLowerCase().slice(0, MAX_QUERY_LENGTH);
  const terms = q.split(/\s+/).filter(Boolean);

  const matched = searchIndex.filter((item) => terms.every((t) => item._h.includes(t)));

  matched.sort((a, b) => {
    const aTop = a.title.toLowerCase().includes(q) || (a.subtitle || "").toLowerCase().includes(q) ? 0 : 1;
    const bTop = b.title.toLowerCase().includes(q) || (b.subtitle || "").toLowerCase().includes(q) ? 0 : 1;
    return aTop - bTop;
  });

  // Strip internal haystack field before returning to client.
  return matched.slice(0, 10).map(({ _h, ...item }) => item);
}

exports.handler = async (event) => {
  const origin  = event.headers.origin || event.headers.Origin || "";
  const headers = { ...corsHeaders(origin), "Cache-Control": "no-store" };

  if (event.httpMethod === "OPTIONS") return preflight(origin);
  if (event.httpMethod !== "GET") {
    return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  const ip = event.headers["x-nf-client-connection-ip"]
    || (event.headers["x-forwarded-for"] || "").split(",")[0].trim()
    || "unknown";

  if (!checkRate(ip)) {
    return {
      statusCode: 429,
      headers: { ...headers, "Retry-After": "60" },
      body: JSON.stringify({ error: "Too many requests" }),
    };
  }

  const q = (event.queryStringParameters && event.queryStringParameters.q) || "";

  if (!q || q.trim().length < 2) {
    return {
      statusCode: 200,
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify([]),
    };
  }

  try {
    const results = searchItems(q);
    return {
      statusCode: 200,
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify(results),
    };
  } catch (err) {
    console.error("Search error:", err.message);
    return {
      statusCode: 500,
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};
