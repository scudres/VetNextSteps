"use strict";

/**
 * Expands conferences that span multiple calendar years into one entry per year.
 * Entries with a single date segment, or multiple segments all within the same year,
 * are returned unchanged. The regions array is NOT propagated across split entries —
 * each segment must already carry the correct regions in the source data.
 */
function expandMultiYearConferences(arr) {
  const expanded = [];
  for (const conf of arr) {
    const segments = conf.dates.split(";").map((s) => s.trim()).filter(Boolean);
    if (segments.length <= 1) {
      expanded.push(conf);
      continue;
    }
    const years = segments.map((s) => {
      const m = s.match(/\b(20\d{2})\b/);
      return m ? m[1] : null;
    });
    const uniqueYears = [...new Set(years.filter(Boolean))];
    if (uniqueYears.length <= 1) {
      // All segments fall within the same year — keep as one entry.
      expanded.push(conf);
      continue;
    }
    for (const segment of segments) {
      // Extract trailing parenthetical as location override, e.g. "9–11 Jul 2026 (Liverpool)".
      const locMatch = segment.match(/\(([^)]+)\)\s*$/);
      expanded.push({
        ...conf,
        dates: segment,
        location: locMatch ? locMatch[1] : conf.location,
      });
    }
  }
  return expanded;
}

module.exports = { expandMultiYearConferences };
