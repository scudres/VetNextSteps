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
import { segmentEnd, segmentsOf, todayKey } from "../../frontend/src/data/conferenceDates.js";
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
const TODAY  = todayKey(today);
const asDate = (k) => `${Math.floor(k / 10000)}-${String(Math.floor(k / 100) % 100).padStart(2, "0")}-${String(k % 100).padStart(2, "0")}`;

// ── Date parsing ──────────────────────────────────────────────────────────────
// segmentEnd and segmentsOf come from frontend/src/data/conferenceDates.js, the
// same module the /cpd page filters with, so this report and the live listing
// can never disagree about what counts as past.

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
