// Parses a date string like "19–20 Nov 2026", "27 Feb – 3 Mar 2027", "September 2026",
// "2027 TBA", "TBA — check site" into a numeric sort key (YYYYMMDD).
// Multi-date entries (e.g. "Jun 2026; Jun 2027") use the first date only.
// TBA / check-site entries sort to the end of their year (or Infinity if no year found).
export const parseSortDate = (dateStr) => {
  if (!dateStr) return Infinity;

  const s = dateStr.toLowerCase();
  const months = {
    jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
    jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12,
  };

  // Use only the first date segment (before any semicolon or comma)
  const segment = s.split(/[;,]/)[0];

  const yearInSeg  = segment.match(/\b(20\d{2})\b/);
  const monthInSeg = segment.match(/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/);

  if (!monthInSeg) {
    // No month name — look for a bare year anywhere in the full string
    const anyYear = s.match(/\b(20\d{2})\b/);
    if (anyYear) return parseInt(anyYear[1]) * 10000 + 1299; // sort to end of that year
    return Infinity;
  }

  const month = months[monthInSeg[1]];
  const year  = yearInSeg
    ? parseInt(yearInSeg[1])
    : (s.match(/\b(20\d{2})\b/) ? parseInt(s.match(/\b(20\d{2})\b/)[1]) : null);

  if (!year) return Infinity;

  // Find the last day number that appears immediately before the month name
  const beforeMonth = segment.substring(0, monthInSeg.index);
  const dayMatch    = beforeMonth.match(/(\d{1,2})\D*$/);
  const day         = dayMatch ? parseInt(dayMatch[1]) : 1;

  return year * 10000 + month * 100 + day;
};

export const specialtyOptions = [
  "All Specialties",
  "General Practice",
  "Internal Medicine",
  "Surgery",
  "Neurology",
  "Dermatology",
  "Emergency & Critical Care",
  "Ophthalmology",
  "Cardiology",
  "Oncology",
  "Endocrinology",
  "Equine",
  "Farm Animal",
  "Anaesthesia",
  "Behaviour & Welfare",
  "Exotic & Zoo",
  "Feline",
  "Pathology",
  "Imaging",
  "Nutrition",
  "Theriogenology",
  "Gastroenterology",
  "Sports Medicine",
  "Dentistry",
  "Microbiology",
];

// ─── Region hierarchy ────────────────────────────────────────────────────────
// regionConfig and countryConfig are GENERATED from the data by
// scripts/build-data.js — see src/data/countries.js. Put a `country` slug on a
// conference and its country (and, if it is the first one there, its continent)
// appears in the filters automatically. Nothing to edit here.
//
// Country slugs match the ids these places used when they were top-level
// regions (uk, usa, australia, new-zealand), so /cpd/uk and friends keep
// working as country pages. browseConfig below resolves a /cpd/:slug either way.
export { regionConfig, countryConfig } from "./countries";
import { regionConfig, countryConfig } from "./countries";

// Does this conference belong to a top-level region? Either it carries the tag
// explicitly (europe, global, and the legacy uk/usa/australia/new-zealand tags)
// or its country rolls up to that region.
export const conferenceInRegion = (conf, regionId) => {
  if (conf.regions && conf.regions.includes(regionId)) return true;
  const c = countryConfig[conf.country];
  return Boolean(c && c.region === regionId);
};

// A /cpd/:slug page is either a region or a country — resolve whichever it is,
// so the country URLs that used to be regions keep rendering.
export const browseConfig = (slug) => {
  const region = regionConfig.find((r) => r.id === slug);
  if (region) return { ...region, kind: "region" };
  const country = countryConfig[slug];
  if (country) return { ...country, id: slug, kind: "country" };
  return null;
};

export const conferenceInScope = (conf, scope) =>
  scope.kind === "region" ? conferenceInRegion(conf, scope.id) : conf.country === scope.id;

// Country options for the sub-filter, derived from the conferences actually
// present so an option never renders with nothing behind it. Sorted by name.
export const countriesForRegions = (conferences, regionIds) => {
  const ids = new Set();
  for (const conf of conferences) {
    if (!conf.country || !countryConfig[conf.country]) continue;
    if (regionIds.length === 0 || regionIds.some((r) => conferenceInRegion(conf, r))) ids.add(conf.country);
  }
  return [...ids]
    .map((id) => ({ value: id, label: `${countryConfig[id].flag} ${countryConfig[id].name}` }))
    .sort((a, b) => countryConfig[a.value].name.localeCompare(countryConfig[b.value].name));
};
