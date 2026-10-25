#!/usr/bin/env node
/**
 * Asks Gemini (with Google Search grounding) which veterinary CPD congresses
 * are missing from functions/data/conferences.js.
 *
 * Usage:
 *   export GEMINI_API_KEY="..."
 *   node tools/gemini-cpd-check.mjs                     # Europe, North America, Oceania and Asia
 *   node tools/gemini-cpd-check.mjs --asia              # Asia only
 *   node tools/gemini-cpd-check.mjs "UK, Ireland"       # any other scope, in plain words
 *
 * Optional: GEMINI_MODEL (default gemini-4-argon).
 * Only titles, dates, locations and websites are sent, never source files or env.
 * Treat the output as leads: confirm every date on the organiser's own site
 * before adding anything.
 */

import { createRequire } from "node:module";
import { expandMultiYearConferences } from "../functions/lib/expand.js";

const require = createRequire(import.meta.url);
const raw = require("../functions/data/conferences.js");
const conferences = expandMultiYearConferences(Array.isArray(raw) ? raw : raw.conferences);

const key = process.env.GEMINI_API_KEY;
if (!key) {
  console.error("Set GEMINI_API_KEY first.");
  process.exit(1);
}
const model = process.env.GEMINI_MODEL || "gemini-4-argon";
const ASIA =
  "Asia: Thailand, Philippines, Singapore, Malaysia, Indonesia, Vietnam, Taiwan, Hong Kong, " +
  "China, Japan, South Korea, India and the Gulf states, including FAVA, FASAVA and WSAVA " +
  "member-association congresses, university conferences and specialist college meetings";
const args = process.argv.slice(2);
const asiaOnly = args.includes("--asia");
const typed = args.filter((a) => a !== "--asia").join(" ").trim();
const scope = asiaOnly
  ? ASIA
  : typed || `anywhere in Europe, North America, Oceania or ${ASIA}`;
const today = new Date().toISOString().slice(0, 10);

const listed = conferences
  .map((c) => `- ${c.title} | ${c.dates} | ${c.location} | ${c.website || "no site"}`)
  .join("\n");

const prompt = `Today is ${today}. You are checking a directory of veterinary CPD congresses
and conferences for qualified vets (small animal, equine, farm animal, exotic and
specialist colleges). Use Google Search.

Find veterinary CPD conferences and congresses, held ${scope}, starting between ${today}
and the end of 2028, that are NOT already in the list below. A conference counts as
listed if the same event appears under a different name or edition.

Rules:
- Only report an event if you found its official organiser page or a dated announcement.
  Give the exact URL you used.
- Never guess or estimate dates, venues or fees. If a date is not published, write
  "not announced" and say what the organiser does publish.
- Skip webinars, single-evening meetings, vet nursing-only events and trade shows with
  no CPD programme.
- Also list any entry in the directory whose dates or venue on the organiser's site
  differ from what the directory shows, with both versions and the URL.

Output, in this order:
1. MISSING EVENTS: one block each with name, organiser, dates, venue and country,
   specialty, official URL, and how confident you are (confirmed on organiser page /
   third-party listing only).
2. DIRECTORY ENTRIES THAT LOOK WRONG.
3. Anything you searched for and could not verify.

Use UK English.

DIRECTORY (title | dates | location | website):
${listed}`;

const res = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": key },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      tools: [{ google_search: {} }],
    }),
  }
);
const json = await res.json();
if (!res.ok) {
  console.error(JSON.stringify(json.error ?? json, null, 2));
  process.exit(1);
}

const cand = json.candidates?.[0];
console.log(cand?.content?.parts?.map((p) => p.text ?? "").join("") || JSON.stringify(json, null, 2));

const sources = (cand?.groundingMetadata?.groundingChunks ?? [])
  .map((c) => c.web?.uri)
  .filter(Boolean);
if (sources.length) console.log("\nSearch sources:\n" + [...new Set(sources)].map((u) => `- ${u}`).join("\n"));
