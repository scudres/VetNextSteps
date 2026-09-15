#!/usr/bin/env node
/**
 * VetNextStep — Archive finished conferences
 * ==========================================
 * Moves every listing whose editions have all been held out of
 * functions/data/conferences.js and into past-events.json, so the source data
 * stops accumulating events the site already hides.
 *
 * What it does NOT touch:
 *   PART-PAST  a multi-year entry whose first edition has been held. Trimming
 *              one segment means editing `dates`, `location` and `country` in
 *              step with each other, and getting that wrong corrupts a live
 *              listing. Reported for a human instead. The site already hides
 *              the finished edition, so nothing is shown that should not be.
 *   UNDATED    no readable year. Never archived.
 *
 * `cadence` is written as null. It records when an event repeats and is only
 * filled in once confirmed from the organiser — it is never guessed.
 *
 * Usage:
 *   node tools/conference-archive/archive-past.mjs            # apply
 *   node tools/conference-archive/archive-past.mjs --dry-run  # report only
 *   node tools/conference-archive/archive-past.mjs --on 2027-01-31
 *
 * Node 18+, no dependencies.
 */

import { createRequire } from "node:module";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { isFinished, segmentsOf, segmentEnd, todayKey } from "../../frontend/src/data/conferenceDates.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require   = createRequire(import.meta.url);

const SOURCE  = path.join(__dirname, "..", "..", "functions", "data", "conferences.js");
const ARCHIVE = path.join(__dirname, "past-events.json");

const argv   = process.argv.slice(2);
const dryRun = argv.includes("--dry-run");
const onArg  = argv.includes("--on") ? argv[argv.indexOf("--on") + 1] : null;
if (onArg && !/^\d{4}-\d{2}-\d{2}$/.test(onArg)) {
  console.error("--on expects YYYY-MM-DD");
  process.exit(1);
}
const now    = onArg ? new Date(onArg + "T00:00:00Z") : new Date();
const TODAY  = todayKey(now);
const asDate = (d) => d.toISOString().slice(0, 10);

const { conferences } = require(SOURCE);

// ── Classify ──────────────────────────────────────────────────────────────────
const finished = conferences.filter((c) => isFinished(c, TODAY));
const partPast = conferences.filter((c) => {
  if (isFinished(c, TODAY)) return false;
  const ends = segmentsOf(c).map(segmentEnd);
  return ends.some((e) => e && e.key < TODAY);
});

if (!finished.length) {
  console.log(`Nothing to archive as at ${asDate(now)} — ${conferences.length} listed.`);
  if (partPast.length) {
    console.log(`\n${partPast.length} multi-year entr${partPast.length === 1 ? "y has" : "ies have"} a finished edition, left for review:`);
    for (const c of partPast) console.log(`  ${c.title}\n    ${c.dates}`);
  }
  process.exit(0);
}

// ── Remove each finished entry from the source file ───────────────────────────
// The file is edited as text, not re-serialised, so comments, ordering and
// formatting of every surviving entry are preserved exactly.
const lines = readFileSync(SOURCE, "utf8").split("\n");

// An entry is a block that opens on a line of exactly "  {" and closes on the
// next line of exactly "  }," at the same indent.
const blocks = [];
for (let i = 0; i < lines.length; i++) {
  if (lines[i] !== "  {") continue;
  let end = i;
  while (end < lines.length && lines[end] !== "  }," && lines[end] !== "  }") end++;
  blocks.push({ start: i, end });
  i = end;
}

const titleOf = (block) => {
  const line = lines.slice(block.start, block.end + 1).find((l) => l.trimStart().startsWith("title:"));
  if (!line) return null;
  const raw = line.match(/title:\s*"((?:[^"\\]|\\.)*)"/)?.[1];
  if (raw === undefined) return null;
  try { return JSON.parse(`"${raw}"`); } catch { return raw; }
};

const wanted = new Set(finished.map((c) => c.title));
const doomed = blocks.filter((b) => wanted.has(titleOf(b)));

if (doomed.length !== finished.length) {
  console.error(
    `Refusing to write: matched ${doomed.length} block(s) in the source for ${finished.length} finished entr${finished.length === 1 ? "y" : "ies"}.\n` +
    `The file's formatting is not what this script expects. Archive by hand — see README.md.`
  );
  process.exit(1);
}

const drop = new Set();
for (const b of doomed) {
  for (let i = b.start; i <= b.end; i++) drop.add(i);
  // take one blank separator line after the entry, if there is one
  if (lines[b.end + 1] === "") drop.add(b.end + 1);
}

let kept = lines.filter((_, i) => !drop.has(i));

// A category header left with no entries under it would otherwise sit alone.
const isHeader = (l) => /^\s*\/\/ ——— .+ ———\s*$/.test(l);
kept = kept.filter((l, i) => {
  if (!isHeader(l)) return true;
  for (let j = i + 1; j < kept.length; j++) {
    if (kept[j].trim() === "") continue;
    if (isHeader(kept[j])) return false;       // next thing is another header
    return true;                                // an entry follows — keep it
  }
  return false;                                 // nothing follows at all
});

// ── Build the archive records ─────────────────────────────────────────────────
const archive = JSON.parse(readFileSync(ARCHIVE, "utf8"));
const already = new Set(archive.map((r) => `${r.title}|${r.lastHeld}`));
const added   = [];

for (const conf of finished) {
  const { dates, ...rest } = conf;
  const record = { ...rest, lastHeld: dates, archivedOn: asDate(now), cadence: null };
  if (already.has(`${record.title}|${record.lastHeld}`)) continue;
  archive.push(record);
  added.push(record);
}

// ── Report ────────────────────────────────────────────────────────────────────
console.log(`Conferences as at ${asDate(now)} — ${conferences.length} listed`);
console.log(`\nARCHIVED (${added.length})\n${"─".repeat(60)}`);
for (const r of added) console.log(`  ${r.title}\n    ${r.lastHeld}  ·  ${r.location}`);
if (partPast.length) {
  console.log(`\nLEFT FOR REVIEW — multi-year entry with a finished edition (${partPast.length})\n${"─".repeat(60)}`);
  for (const c of partPast) console.log(`  ${c.title}\n    ${c.dates}`);
  console.log(`\n  The site already hides the finished edition of these.`);
}

if (dryRun) {
  console.log("\n--dry-run: nothing written.");
  process.exit(0);
}

writeFileSync(SOURCE, kept.join("\n"));
writeFileSync(ARCHIVE, JSON.stringify(archive, null, 2) + "\n");
console.log(`\nWritten: ${conferences.length - finished.length} conferences remain, ${archive.length} archived.`);

// PR body for the scheduled workflow.
if (process.env.RUNNER_TEMP) {
  const body = [
    `Removes ${added.length} conference${added.length === 1 ? "" : "s"} that ${added.length === 1 ? "has" : "have"} now been held, as at ${asDate(now)}.`,
    ``,
    `Each is moved to \`tools/conference-archive/past-events.json\` with \`cadence: null\`, which is the research list for finding the organiser's next dates.`,
    ``,
    `### Archived`,
    ...added.map((r) => `- **${r.title}** — ${r.lastHeld} · ${r.location}`),
    ...(partPast.length
      ? [``, `### Left for review`,
         `Multi-year entries whose first edition has been held. Trimming a segment means editing \`dates\`, \`location\` and \`country\` together, so it is not automated. The site already hides the finished edition.`,
         ...partPast.map((c) => `- **${c.title}** — ${c.dates}`)]
      : []),
    ``,
    `The live listing does not depend on this: \`/cpd\` filters finished events against the visitor's clock. This keeps the source data from accumulating them.`,
  ].join("\n");
  writeFileSync(path.join(process.env.RUNNER_TEMP, "pr-body.md"), body);
}
