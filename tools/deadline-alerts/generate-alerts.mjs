#!/usr/bin/env node
/**
 * VetNextStep — Deadline Alert Generator
 * =======================================
 * Reads your conference data (JSON) and automatically produces:
 *
 *   1. closing-soon.md    — a ready-to-paste "Closing soon" newsletter section
 *   2. closing-soon.json  — a data feed you can render on the website
 *                           (e.g. a "Deadlines this month" box on the homepage)
 *   3. deadlines.ics      — a calendar file (import into Google/Outlook/Apple
 *                           Calendar so YOU get reminded to send alerts)
 *   4. data-gaps.md       — a report of conferences with missing/expired
 *                           deadline data, so you know what to research next
 *
 * Zero dependencies — plain Node.js (v18+).
 *
 * USAGE
 *   node generate-alerts.mjs                          # next 30 days, ./conferences.json
 *   node generate-alerts.mjs --days 60                # look 60 days ahead
 *   node generate-alerts.mjs --file src/data/conferences.json
 *   node generate-alerts.mjs --today 2026-09-01       # simulate a date (testing)
 *   node generate-alerts.mjs --out ./alerts           # output folder
 *
 * DATA FORMAT (see conferences.sample.json)
 *   Each conference object needs at minimum: id, name, startDate.
 *   Add a "deadlines" array of { type, date, label, note? } entries.
 *   Recognised types (any string works; these get nice icons/order):
 *     abstract | early-bird | registration | hotel | scholarship | other
 */

import fs from "node:fs";
import path from "node:path";

// ---------- CLI args ----------
const args = process.argv.slice(2);
function getArg(name, fallback) {
  const i = args.indexOf(`--${name}`);
  return i !== -1 && args[i + 1] ? args[i + 1] : fallback;
}
const DATA_FILE = getArg("file", "./conferences.json");
const OTHER_FILE = getArg("other-file", null);
const DAYS_AHEAD = parseInt(getArg("days", "30"), 10);
const OUT_DIR = getArg("out", "./alerts");
const TODAY = getArg("today", null) ? new Date(getArg("today") + "T00:00:00Z")
                                    : new Date(new Date().toISOString().slice(0, 10) + "T00:00:00Z");

// ---------- helpers ----------
const DAY_MS = 86400000;
const fmt = (d) =>
  d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
const daysUntil = (d) => Math.round((d - TODAY) / DAY_MS);

const TYPE_META = {
  "abstract":     { icon: "📝", order: 1, verb: "Abstract deadline" },
  "early-bird":   { icon: "💷", order: 2, verb: "Early-bird ends" },
  "registration": { icon: "🎟️", order: 3, verb: "Registration closes" },
  "hotel":        { icon: "🏨", order: 4, verb: "Hotel block closes" },
  "scholarship":  { icon: "🎓", order: 5, verb: "Scholarship deadline" },
  "other":        { icon: "📌", order: 6, verb: "Deadline" },
};
const meta = (t) => TYPE_META[t] || TYPE_META.other;

function parseDate(s, context) {
  const d = new Date(s + "T00:00:00Z");
  if (isNaN(d)) {
    console.warn(`⚠️  Invalid date "${s}" in ${context} — skipping that entry.`);
    return null;
  }
  return d;
}

// ---------- load data ----------
let conferences;
try {
  conferences = JSON.parse(fs.readFileSync(path.resolve(DATA_FILE), "utf8"));
} catch (e) {
  console.error(`\n❌ Could not read ${DATA_FILE}\n   ${e.message}\n`);
  console.error(`   Tip: point at your real data file with  --file path/to/conferences.json`);
  console.error(`   Or copy conferences.sample.json to conferences.json to try it out.\n`);
  process.exit(1);
}
if (!Array.isArray(conferences)) {
  console.error("❌ Expected the JSON file to contain an ARRAY of conference objects.");
  process.exit(1);
}

let otherItems = [];
if (OTHER_FILE) {
  try {
    otherItems = JSON.parse(fs.readFileSync(path.resolve(OTHER_FILE), "utf8"));
    if (!Array.isArray(otherItems)) {
      console.warn(`⚠️  ${OTHER_FILE} did not contain an array — skipping.`);
      otherItems = [];
    }
  } catch (e) {
    console.warn(`⚠️  Could not read ${OTHER_FILE} — skipping. (${e.message})`);
  }
}
const allItems = [...conferences, ...otherItems];

// ---------- collect events ----------
const upcoming = [];   // deadlines within the window
const horizon = [];    // deadlines beyond the window (for the .ics + planning)
const gaps = [];       // conferences with no future deadline data

for (const conf of allItems) {
  if (!conf.name) continue;
  const start = conf.startDate ? parseDate(conf.startDate, conf.name) : null;
  const deadlines = Array.isArray(conf.deadlines) ? conf.deadlines : [];

  let hasFutureDeadline = false;
  for (const dl of deadlines) {
    const date = parseDate(dl.date, `${conf.name} → ${dl.label || dl.type}`);
    if (!date) continue;
    const delta = daysUntil(date);
    if (delta < 0) continue; // expired — ignored automatically
    hasFutureDeadline = true;
    const event = {
      conference: conf.name,
      id: conf.id || conf.name,
      url: conf.url || "",
      region: conf.region || "",
      type: dl.type || "other",
      label: dl.label || meta(dl.type).verb,
      note: dl.note || "",
      date,
      daysLeft: delta,
    };
    (delta <= DAYS_AHEAD ? upcoming : horizon).push(event);
  }

  // Research gap: near-term conference with no deadline data, OR a dateless item (exam/cert/programme)
  if (!hasFutureDeadline && (!start || (daysUntil(start) >= 0 && daysUntil(start) <= 270))) {
    gaps.push({ name: conf.name, url: conf.url || "", startDate: conf.startDate || null, daysToStart: start ? daysUntil(start) : null });
  }
}

const byDate = (a, b) => a.date - b.date || meta(a.type).order - meta(b.type).order;
upcoming.sort(byDate);
horizon.sort(byDate);
gaps.sort((a, b) => {
  if (a.daysToStart === null && b.daysToStart === null) return 0;
  if (a.daysToStart === null) return 1;
  if (b.daysToStart === null) return -1;
  return a.daysToStart - b.daysToStart;
});

// ---------- output 1: newsletter markdown ----------
fs.mkdirSync(OUT_DIR, { recursive: true });

let md = `### ⏰ Closing soon (next ${DAYS_AHEAD} days)\n\n`;
md += `*Generated ${fmt(TODAY)} — verify each date against the organiser before sending.*\n\n`;
if (upcoming.length === 0) {
  md += `_No deadlines in the next ${DAYS_AHEAD} days. Consider widening the window with --days 60._\n`;
} else {
  for (const e of upcoming) {
    const urgency = e.daysLeft === 0 ? "**TODAY**" : e.daysLeft <= 7 ? `**${e.daysLeft} days left**` : `${e.daysLeft} days left`;
    const link = e.url ? `[${e.conference}](${e.url})` : e.conference;
    md += `- ${meta(e.type).icon} **${link}** — ${e.label}: **${fmt(e.date)}** (${urgency})`;
    if (e.note) md += ` — ${e.note}`;
    md += `\n`;
  }
}
if (horizon.length) {
  md += `\n<details><summary>On the horizon (${horizon.length} more)</summary>\n\n`;
  for (const e of horizon.slice(0, 15)) {
    md += `- ${meta(e.type).icon} ${e.conference} — ${e.label}: ${fmt(e.date)}\n`;
  }
  md += `\n</details>\n`;
}
fs.writeFileSync(path.join(OUT_DIR, "closing-soon.md"), md);

// ---------- output 2: JSON feed for the website ----------
fs.writeFileSync(
  path.join(OUT_DIR, "closing-soon.json"),
  JSON.stringify(
    {
      generated: TODAY.toISOString().slice(0, 10),
      windowDays: DAYS_AHEAD,
      deadlines: upcoming.map((e) => ({
        conference: e.conference, id: e.id, url: e.url, region: e.region,
        type: e.type, label: e.label, note: e.note,
        date: e.date.toISOString().slice(0, 10), daysLeft: e.daysLeft,
      })),
    },
    null, 2
  )
);

// ---------- output 3: ICS calendar (ALL future deadlines) ----------
const icsEscape = (s) => String(s).replace(/([,;\\])/g, "\\$1");
let ics = "BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//VetNextStep//DeadlineAlerts//EN\r\nCALSCALE:GREGORIAN\r\n";
for (const e of [...upcoming, ...horizon]) {
  const ymd = e.date.toISOString().slice(0, 10).replace(/-/g, "");
  ics += "BEGIN:VEVENT\r\n";
  ics += `UID:${e.id}-${e.type}-${ymd}@vetnextstep.com\r\n`;
  ics += `DTSTART;VALUE=DATE:${ymd}\r\n`;
  ics += `SUMMARY:${icsEscape(`${e.conference} — ${e.label}`)}\r\n`;
  if (e.url) ics += `URL:${e.url}\r\n`;
  if (e.note) ics += `DESCRIPTION:${icsEscape(e.note)}\r\n`;
  // Reminder 7 days before, so you can feature it in the newsletter in time
  ics += "BEGIN:VALARM\r\nACTION:DISPLAY\r\nDESCRIPTION:Deadline in 1 week — feature in newsletter\r\nTRIGGER:-P7D\r\nEND:VALARM\r\n";
  ics += "END:VEVENT\r\n";
}
ics += "END:VCALENDAR\r\n";
fs.writeFileSync(path.join(OUT_DIR, "deadlines.ics"), ics);

// ---------- output 4: data-gap report ----------
let gapMd = `# Data gaps — entries needing deadline research\n\n`;
gapMd += `Conferences start within the next 9 months but have no future deadline data.\n`;
gapMd += `Exams / certs / programmes have no fixed start date and are always tracked.\n`;
gapMd += `Research these first (closest first). For each, look for: early-bird end date, abstract deadline, registration close.\n\n`;
if (gaps.length === 0) gapMd += `✅ None — every tracked entry has at least one future deadline recorded.\n`;
for (const g of gaps) {
  const when = g.startDate
    ? `starts ${g.startDate} (${g.daysToStart} days away)`
    : `no fixed date — always tracked`;
  gapMd += `- [ ] **${g.name}** — ${when}${g.url ? ` — ${g.url}` : ""}\n`;
}
fs.writeFileSync(path.join(OUT_DIR, "data-gaps.md"), gapMd);

// ---------- console summary ----------
const otherLabel = OTHER_FILE ? ` + ${path.basename(OTHER_FILE)} (${otherItems.length})` : "";
console.log(`\n📅 VetNextStep Deadline Alerts — ${fmt(TODAY)}`);
console.log(`   Data: ${path.basename(DATA_FILE)} (${conferences.length})${otherLabel}  →  ${allItems.length} total entries`);
console.log(`   Window: next ${DAYS_AHEAD} days\n`);
console.log(`   ✅ ${upcoming.length} deadline(s) closing soon`);
console.log(`   🔭 ${horizon.length} further out (in calendar file)`);
console.log(`   🔍 ${gaps.length} entry/entries missing deadline data → alerts/data-gaps.md\n`);
for (const e of upcoming.slice(0, 10)) {
  console.log(`   ${String(e.daysLeft).padStart(3)}d  ${meta(e.type).icon}  ${e.conference} — ${e.label} (${e.date.toISOString().slice(0, 10)})`);
}
console.log(`\n   Files written to ${path.resolve(OUT_DIR)}/`);
console.log(`   → closing-soon.md   (paste into newsletter)`);
console.log(`   → closing-soon.json (feed for a website widget)`);
console.log(`   → deadlines.ics     (import into your calendar)`);
console.log(`   → data-gaps.md      (what to research next)\n`);
