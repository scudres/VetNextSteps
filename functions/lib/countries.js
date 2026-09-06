"use strict";

/**
 * Resolves the `country` slug on a conference or provider into a display name,
 * flag, and the continent it belongs to.
 *
 * The point of this file is that adding an event in a country the site has
 * never covered needs no edit here. Write `country: "croatia"` on the entry and
 * the build resolves it to Croatia / 🇭🇷 / europe on its own, and the Europe
 * country filter gains a Croatia option. Only two things are hand-maintained:
 * the continent each ISO code sits in, and a handful of slug aliases.
 *
 * Names come from Intl.DisplayNames in en-GB, so they arrive already in UK
 * English ("Czechia", not "Czech Republic"). Flags are derived from the ISO
 * code's regional indicator symbols rather than typed out.
 */

// ISO 3166-1 alpha-2 grouped by the continent the site files it under.
// Transcontinental countries are placed where this site's audience expects
// them: Turkey and Russia under Europe (the conference data's Istanbul entry
// has always been tagged Europe), Cyprus likewise.
const CONTINENTS = {
  "europe":
    "AD AL AT AX BA BE BG BY CH CY CZ DE DK EE ES FI FO FR GB GG GI GR HR HU IE IM IS IT JE " +
    "LI LT LU LV MC MD ME MK MT NL NO PL PT RO RS RU SE SI SJ SK SM TR UA VA XK",
  "north-america":
    "AG AI AW BB BL BM BQ BS BZ CA CR CU CW DM DO GD GL GP GT HN HT JM KN KY LC MF MQ MS MX " +
    "NI PA PM PR SV SX TC TT US VC VG VI",
  "south-america":
    "AR BO BR CL CO EC FK GF GY PE PY SR UY VE",
  "asia":
    "AE AF AM AZ BD BH BN BT CN GE HK ID IL IN IQ IR JO JP KG KH KP KR KW KZ LA LB LK MM MN " +
    "MO MV MY NP OM PH PK PS QA SA SG SY TH TJ TL TM TW UZ VN YE",
  "africa":
    "AO BF BI BJ BW CD CF CG CI CM CV DJ DZ EG EH ER ET GA GH GM GN GQ GW KE KM LR LS LY MA " +
    "MG ML MR MU MW MZ NA NE NG RE RW SC SD SH SL SN SO SS ST SZ TD TG TN TZ UG YT ZA ZM ZW",
  "oceania":
    "AS AU CK FJ FM GU KI MH MP NC NF NR NU NZ PF PG PW SB TK TO TV VU WF WS",
  "antarctica":
    "AQ BV GS HM TF",
};

const REGION_OF_ISO = {};
for (const [region, codes] of Object.entries(CONTINENTS)) {
  for (const iso of codes.split(" ")) REGION_OF_ISO[iso] = region;
}

// Slugs this site has used since before country codes existed here. Everything
// else resolves by matching the slug against the country's own English name.
const SLUG_ALIASES = {
  "uk":  "GB",
  "usa": "US",

  // Names that differ from the country's current official display name, which
  // is what Intl returns. Turkey is the live case in this data — Intl gives
  // "Türkiye", so a "turkey" slug would otherwise fail to resolve. The rest are
  // here so a common older or colloquial name doesn't quietly go unrecognised.
  "turkey":         "TR",
  "britain":        "GB",
  "great-britain":  "GB",
  "united-states-of-america": "US",
  "czech-republic": "CZ",
  "holland":        "NL",
  "ivory-coast":    "CI",
  "uae":            "AE",
  "macedonia":      "MK",
  "swaziland":      "SZ",
  "burma":          "MM",
  "cape-verde":     "CV",
};

// Misspellings the fuzzy matcher will not guess on its own, pinned by hand.
// Unlike SLUG_ALIASES above — which are legitimate alternative names — these are
// mistakes, so they collapse onto the real country's slug and are reported by
// the build as corrections. Add a line here for any typo reported as ambiguous.
const TYPO_ALIASES = {
  "austrlia": "AU",   // one edit from both Australia and Austria; Australia is meant
};

// The slug the site uses for a country, where that differs from its name. Both
// the typo table and the fuzzy matcher canonicalise through this, so a corrected
// slug lands on the id already in use rather than creating a second one — a
// mistyped "unted-kingdom" becomes "uk", not "united-kingdom".
const PREFERRED_SLUG = {
  "GB": "uk",
  "US": "usa",
  "TR": "turkey",
};

// Not countries — the "we know the region but not the country" buckets that the
// provider data uses. They keep working as country options.
const PSEUDO_COUNTRIES = {
  "europe": { name: "Europe — other",   flag: "🇪🇺", region: "europe" },
  "global": { name: "Global & industry",     flag: "🌐",             region: "global" },
};

// Display-name overrides, keyed by ISO code. Intl returns each country's
// current official name; where the site has been using a different one, keep
// the site's. Delete a line here to fall back to the official name.
const NAME_OVERRIDES = {
  "TR": "Turkey",   // Intl gives "Türkiye"
};

const intlNames = new Intl.DisplayNames(["en-GB"], { type: "region" });
const displayNames = { of: (iso) => NAME_OVERRIDES[iso] || intlNames.of(iso) };

const slugify = (s) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
   .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

// slug -> ISO, built from each code's own display name, so "new-zealand",
// "south-africa" and "czechia" all resolve without being listed anywhere.
const ISO_BY_NAME_SLUG = {};
for (const iso of Object.keys(REGION_OF_ISO)) {
  let name;
  try { name = displayNames.of(iso); } catch { continue; }
  if (name && name !== iso) ISO_BY_NAME_SLUG[slugify(name)] = iso;
}

const flagForIso = (iso) =>
  String.fromCodePoint(...[...iso.toUpperCase()].map((ch) => 0x1f1e6 + ch.charCodeAt(0) - 65));

const SLUG_BY_ISO = {};
for (const [nameSlug, iso] of Object.entries(ISO_BY_NAME_SLUG)) SLUG_BY_ISO[iso] = nameSlug;

const canonicalSlugForIso = (iso) => PREFERRED_SLUG[iso] || SLUG_BY_ISO[iso] || null;

function isoForSlug(slug) {
  if (!slug) return null;
  const key = String(slug).toLowerCase();
  if (SLUG_ALIASES[key]) return SLUG_ALIASES[key];
  if (/^[a-z]{2}$/.test(key) && REGION_OF_ISO[key.toUpperCase()]) return key.toUpperCase();
  return ISO_BY_NAME_SLUG[key] || null;
}

// Damerau-Levenshtein (optimal string alignment): counts a transposition as one
// edit, so "germnay" sits distance 1 from "germany" rather than 2.
function editDistance(a, b) {
  const m = a.length, n = b.length;
  const d = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 0; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + cost);
      }
    }
  }
  return d[m][n];
}

/**
 * Find the country a misspelt slug most likely meant.
 *
 * Deliberately conservative, because a wrong guess here files an event under the
 * wrong country silently, which is worse than not guessing at all. Real country
 * names sit very close together — Iran/Iraq are one edit apart, Niger/Nigeria
 * two, Mali/Malta two — so a match is only accepted when exactly ONE candidate
 * sits at the minimum distance. "nigera" is one edit from both Niger and
 * Nigeria, so it is refused and reported rather than guessed at.
 *
 * The allowance scales with length: short names get one edit, longer ones two.
 */
function nearestCountrySlug(key) {
  const allowance = key.length <= 5 ? 1 : 2;
  let best = allowance + 1;
  let matches = [];
  for (const candidate of Object.keys(ISO_BY_NAME_SLUG)) {
    if (Math.abs(candidate.length - key.length) > allowance) continue;
    const dist = editDistance(key, candidate);
    if (dist > allowance) continue;
    if (dist < best) { best = dist; matches = [candidate]; }
    else if (dist === best && !matches.includes(candidate)) matches.push(candidate);
  }
  if (matches.length === 1) return { slug: matches[0], distance: best };
  if (matches.length > 1) return { ambiguous: matches.sort() };
  return null;
}

/**
 * Resolve one country slug.
 *
 * An exact match wins. Failing that, an unambiguous near-match is corrected and
 * flagged via `correctedFrom` so the build can report it — a typo shows up as
 * the country it meant, rather than as an event missing from every filter.
 * Returns null only when the slug is neither known nor confidently correctable;
 * the caller surfaces that rather than dropping the event.
 */
function resolveCountry(slug) {
  if (!slug) return null;
  const key = String(slug).toLowerCase();
  if (PSEUDO_COUNTRIES[key]) return { id: key, ...PSEUDO_COUNTRIES[key] };

  let iso = isoForSlug(key);
  let correctedFrom = null;
  let canonical = key;

  if (!iso && TYPO_ALIASES[key]) {
    iso = TYPO_ALIASES[key];
    canonical = canonicalSlugForIso(iso) || key;
    correctedFrom = key;
  }

  if (!iso) {
    const near = nearestCountrySlug(key);
    if (!near || near.ambiguous) {
      return near && near.ambiguous ? { ambiguous: near.ambiguous, id: key } : null;
    }
    canonical = canonicalSlugForIso(ISO_BY_NAME_SLUG[near.slug]) || near.slug;
    correctedFrom = key;
    iso = ISO_BY_NAME_SLUG[near.slug];
  }

  return {
    id: canonical,
    name: displayNames.of(iso),
    flag: flagForIso(iso),
    region: REGION_OF_ISO[iso] || null,
    ...(correctedFrom ? { correctedFrom } : {}),
  };
}

// Display names and ordering for the regions themselves. A region only appears
// on the site once the data actually contains an event in it, so this is a
// lookup rather than a list of what exists.
const REGION_NAMES = {
  "europe":        "Europe",
  "north-america": "North America",
  "south-america": "South America",
  "asia":          "Asia",
  "africa":        "Africa",
  "oceania":       "Oceania",
  "antarctica":    "Antarctica",
  "global":        "Global / International",
};

// Regions the site already has artwork for. A newly-appearing region renders a
// flag tile instead of a photo rather than a broken image.
const REGION_IMAGES = {
  "europe":        "https://images.pexels.com/photos/9494908/pexels-photo-9494908.jpeg?auto=compress&cs=tinysrgb&w=600",
  "north-america": "https://images.pexels.com/photos/16156721/pexels-photo-16156721.jpeg?auto=compress&cs=tinysrgb&w=600",
  "oceania":       "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=600&q=80",
  "global":        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80",
};

const REGION_FLAGS = {
  "europe":        "🇪🇺",
  "north-america": "🌎",
  "south-america": "🌎",
  "asia":          "🌏",
  "africa":        "🌍",
  "oceania":       "🌏",
  "antarctica":    "🌍",
  "global":        "🌍",
};

// Preferred running order; anything not listed sorts alphabetically after these
// and before Global, which always sits last.
const REGION_ORDER = ["europe", "north-america", "oceania", "asia", "africa", "south-america"];

function regionMeta(id) {
  return {
    id,
    name:  REGION_NAMES[id] || id.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    flag:  REGION_FLAGS[id] || "🌍",
    image: REGION_IMAGES[id] || null,
  };
}

function sortRegions(ids) {
  return [...ids].sort((a, b) => {
    if (a === "global") return 1;
    if (b === "global") return -1;
    const ia = REGION_ORDER.indexOf(a);
    const ib = REGION_ORDER.indexOf(b);
    if (ia !== -1 && ib !== -1) return ia - ib;
    if (ia !== -1) return -1;
    if (ib !== -1) return 1;
    return a.localeCompare(b);
  });
}

module.exports = { resolveCountry, regionMeta, sortRegions, REGION_NAMES };
