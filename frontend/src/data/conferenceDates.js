// When a conference has finished.
//
// The /cpd listing must never show an event that has already been held, and it
// must stop showing it on the day it lapses rather than the next time someone
// runs the archive tool. Both the site and tools/conference-archive/find-past.mjs
// read this file, so the page and the report can never disagree about what
// counts as past.
//
// Every judgement here errs towards keeping a listing up: a date we cannot read
// is never treated as past, because silently dropping a real event is worse than
// briefly showing a stale one.

const MONTHS = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12 };

/** Today as a comparable YYYYMMDD integer, in UTC. */
export const todayKey = (date = new Date()) =>
  date.getUTCFullYear() * 10000 + (date.getUTCMonth() + 1) * 100 + date.getUTCDate();

/**
 * The last day of one date segment, as a YYYYMMDD integer.
 *
 * Reads the END of a range ("9–12 Sep 2026" → 12 Sep), because an event is only
 * finished once its last day has passed. A month with no day ("September 2026")
 * runs to the 28th and a year with no month ("2027 TBA") to 31 December — both
 * round late, keeping the listing up slightly longer rather than cutting it
 * short. Returns null when there is no year to read at all.
 */
export const segmentEnd = (segment) => {
  const s    = String(segment).toLowerCase();
  const year = s.match(/\b(20\d{2})\b/)?.[1];
  if (!year) return null;

  const months = [...s.matchAll(/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/g)];
  if (!months.length) return { key: +year * 10000 + 1231, precision: "year" };

  const last = months[months.length - 1];
  const day  = s.slice(0, last.index).match(/(\d{1,2})\D*$/)?.[1];
  return {
    key: +year * 10000 + MONTHS[last[1]] * 100 + (day ? +day : 28),
    precision: day ? "day" : "month",
  };
};

export const segmentsOf = (conf) =>
  String(conf.dates || "").split(";").map((s) => s.trim()).filter(Boolean);

/**
 * Has every edition of this conference been held?
 *
 * False whenever any segment is unreadable, so TBA and TBC entries stay on the
 * page until a human checks them.
 */
export const isFinished = (conf, today = todayKey()) => {
  const segments = segmentsOf(conf);
  if (!segments.length) return false;
  const ends = segments.map(segmentEnd);
  if (ends.some((e) => e === null)) return false;
  return ends.every((e) => e.key < today);
};

/** Drop conferences that have been held. */
export const upcomingOnly = (conferences, today = todayKey()) =>
  conferences.filter((c) => !isFinished(c, today));
