#!/usr/bin/env node
/**
 * VetNextStep — Past-conference report
 * ====================================
 * Reads functions/data/conferences.js and reports which listings have finished,
 * so the /cpd page never shows an event that has already been held.
 *
 * Reports three groups:
 *   FINISHED   every date segment is in the past — move the entry to
 *              past-events.json and delete it from functions/data/conferences.js
 *   PART-PAST  a multi-year entry whose earliest edition has been held — trim
 *              that segment from `dates` (and from `location` / `country` where
 *              they are per-edition), keep the rest
 *   UNDATED    no parseable year (TBA / TBC) — left alone, verify by hand
 *
 * Nothing is written. Editing conferences.js is a deliberate, reviewed step.
 *
 * Usage:
 *   node tools/conference-archive/find-past.mjs
 *   node tools/conference-archive/find-past.mjs --on 2027-01-31   # as at a date
 *
 * Node 18+, no dependencies.
 */

import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require   = createRequire(import.meta.url);

const { conferences } = require(path.join(__dirname, "..", "..", "functions", "data", "conferences.js"));

// ── As-at date ────────────────────────────────────────────────────────────────
const onArg = process.argv.includes("--on")
  ? process.argv[process.argv.indexOf("--on") + 1]
  : null;
if (onArg && !/^\d{4}-\d{2}-\d{2}$/.test(onArg)) {
  console.error("--on expects YYYY-MM-DD");
  process.exit(1);
}
const today  = onArg ? new Date(onArg + "T00:00:00Z") : new Date();
const TODAY  = today.getUTCFullYear() * 10000 + (today.getUTCMonth() + 1) * 100 + today.getUTCDate();
const asDate = (k) => `${Math.floor(k / 10000)}-${String(Math.floor(k / 100) % 100).padStart(2, "0")}-${String(k % 100).padStart(2, "0")}`;

// ── Date parsing ──────────────────────────────────────────────────────────────
// An event is finished only once its LAST day has passed, so this reads the end
// of a range ("9–11 Jul 2026" → 11 Jul), not the start. Month-only segments
// ("September 2026") are treated as running to the 28th, and year-only segments
// ("2027 TBA") to 31 December — both err towards keeping a listing up.
const MONTHS = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12 };

function segmentEnd(segment) {
  const s    = segment.toLowerCase();
  const year = s.match(/\b(20\d{2})\b/)?.[1];
  if (!year) return null;                                    // no year at all — undated

  const months = [...s.matchAll(/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/g)];
  if (!months.length) return { key: +year * 10000 + 1231, precision: "year" };

  const last  = months[months.length - 1];
  const day   = s.slice(0, last.index).match(/(\d{1,2})\D*$/)?.[1];
  return {
    key: +year * 10000 + MONTHS[last[1]] * 100 + (day ? +day : 28),
    precision: day ? "day" : "month",
  };
}

const segmentsOf = (conf) => conf.dates.split(";").map((s) => s.trim()).filter(Boolean);

// ── Classify ──────────────────────────────────────────────────────────────────
const finished = [], partPast = [], undated = [];

for (const conf of conferences) {
  const segments = segmentsOf(conf);
  const ends     = segments.map(segmentEnd);

  if (ends.some((e) => e === null)) { undated.push(conf); continue; }

  const past = segments.filter((_, i) => ends[i].key < TODAY);
  if (past.length === segments.length) finished.push({ conf, ends });
  else if (past.length) partPast.push({ conf, past });
}

// ── Report ────────────────────────────────────────────────────────────────────
const rule = (label, n) => `\n${label} (${n})\n${"─".repeat(60)}`;

console.log(`Conferences as at ${asDate(TODAY)} — ${conferences.length} listed`);

console.log(rule("FINISHED — remove from conferences.js, add to past-events.json", finished.length));
for (const { conf, ends } of finished) {
  const vague = ends.some((e) => e.precision !== "day") ? "  [approximate end date]" : "";
  console.log(`  ${conf.title}\n    ${conf.dates}  ·  ${conf.location}${vague}`);
}
if (!finished.length) console.log("  none");

console.log(rule("PART-PAST — trim the finished segment, keep the entry", partPast.length));
for (const { conf, past } of partPast) {
  console.log(`  ${conf.title}\n    ${conf.dates}\n    drop: ${past.join(" | ")}`);
}
if (!partPast.length) console.log("  none");

console.log(rule("UNDATED — no year to check, confirm by hand", undated.length));
for (const conf of undated) console.log(`  ${conf.title}  ·  ${conf.dates}`);
if (!undated.length) console.log("  none");

console.log();
