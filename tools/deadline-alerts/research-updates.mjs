#!/usr/bin/env node
/**
 * VetNextStep — Automated Deadline Research
 * ==========================================
 * Uses claude-sonnet-5 with web search to find and update deadline data in
 * conferences.json and other-deadlines.json.  Only entries with no future
 * deadlines are researched; entries with current data are skipped.
 *
 * Writes a PR body markdown file (for the GitHub Actions workflow to attach
 * to the pull request) and a step summary (visible in the Actions UI).
 *
 * Usage:
 *   ANTHROPIC_API_KEY=sk-... node tools/deadline-alerts/research-updates.mjs
 *   npm run alerts:research
 *
 * No extra npm packages — Node 18+ native fetch only.
 */

import fs   from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TODAY     = new Date().toISOString().slice(0, 10);

// ── Config ────────────────────────────────────────────────────────────────────
const CONFERENCES_FILE = path.join(__dirname, 'conferences.json');
const OTHER_FILE       = path.join(__dirname, 'other-deadlines.json');
const MODEL            = 'claude-sonnet-5';
const RESEARCH_WINDOW  = 365;   // only research conferences starting within 1 year
const BATCH_SIZE       = 8;     // conferences per API call
const BATCH_PAUSE_MS   = 2000;

// Output paths (RUNNER_TEMP is set automatically in GitHub Actions)
const TMP_DIR      = process.env.RUNNER_TEMP || '/tmp';
const PR_BODY_FILE = path.join(TMP_DIR, 'pr-body.md');

// GitHub Actions context (populated automatically in CI, absent locally)
const GITHUB_STEP_SUMMARY = process.env.GITHUB_STEP_SUMMARY || null;
const RUN_URL = (
  process.env.GITHUB_SERVER_URL &&
  process.env.GITHUB_REPOSITORY &&
  process.env.GITHUB_RUN_ID
) ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
  : null;

// ── Load data ─────────────────────────────────────────────────────────────────
const conferences = JSON.parse(fs.readFileSync(CONFERENCES_FILE, 'utf8'));
const otherItems  = JSON.parse(fs.readFileSync(OTHER_FILE,       'utf8'));

// ── Helpers ───────────────────────────────────────────────────────────────────
const asDate = s => new Date(s + 'T00:00:00Z');

function hasFutureDeadline(entry) {
  if (!Array.isArray(entry.deadlines) || entry.deadlines.length === 0) return false;
  return entry.deadlines.some(dl => asDate(dl.date) > asDate(TODAY));
}

function withinWindow(entry) {
  if (!entry.startDate) return true;
  const days = (asDate(entry.startDate) - asDate(TODAY)) / 86_400_000;
  return days >= 0 && days <= RESEARCH_WINDOW;
}

function chunk(arr, n) {
  const out = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
}

function extractJSON(text) {
  const block = text.match(/```json\s*([\s\S]*?)```/);
  if (block) return JSON.parse(block[1]);
  const bare  = text.match(/\[\s*\{[\s\S]*?\}\s*\]/);
  if (bare)  return JSON.parse(bare[0]);
  return null;
}

// ── Anthropic API with web search ─────────────────────────────────────────────
async function callClaude(entries, contextHint) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY environment variable is not set');

  const list = entries.map(e => [
    `id:   ${e.id}`,
    `name: ${e.name}`,
    `url:  ${e.url}`,
    e.startDate ? `starts: ${e.startDate}` : null,
  ].filter(Boolean).join('\n')).join('\n\n');

  const prompt = `You are a veterinary CPD researcher. Today is ${TODAY}. ${contextHint}

Visit the official website of each entry and find upcoming deadlines: registration open/close, early-bird end dates, abstract submission deadlines, exam application windows, etc.

RULES — follow exactly:
1. Only include dates you found on an official page. Do NOT estimate, extrapolate, or guess.
2. Only include dates after ${TODAY}. Ignore past deadlines.
3. If you find no confirmed future deadline for an entry, OMIT that entry entirely.
4. Every entry you return MUST include a _source field: the exact page URL plus today's date.
5. Respond with ONLY a JSON code block — no prose, no headings, nothing else.

Output format:
\`\`\`json
[
  {
    "id": "exactly-as-given-below",
    "deadlines": [
      {
        "type": "registration|early-bird|abstract|hotel|scholarship|other",
        "date": "YYYY-MM-DD",
        "label": "Short human-readable description",
        "note": "Optional extra detail or caveat"
      }
    ],
    "_source": "https://exact-page-url — verified ${TODAY}"
  }
]
\`\`\`

Entries to research:
${list}`;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method:  'POST',
    headers: {
      'x-api-key':         process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type':      'application/json',
    },
    body: JSON.stringify({
      model:       MODEL,
      max_tokens:  4096,
      tools:       [{ type: 'web_search_20250305', name: 'web_search' }],
      tool_choice: { type: 'auto' },
      messages:    [{ role: 'user', content: prompt }],
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Anthropic API ${res.status}: ${body.slice(0, 400)}`);
  }

  const data = await res.json();
  const text = data.content.filter(b => b.type === 'text').map(b => b.text).join('');
  return extractJSON(text);
}

// ── Merge updates — only adds, never overwrites confirmed dates ───────────────
// Model output is validated at the code level too: dates must be real ISO
// dates in the future, labels must be strings, unknown types map to "other".
const ISO_DATE    = /^\d{4}-\d{2}-\d{2}$/;
const VALID_TYPES = new Set(['registration', 'early-bird', 'abstract', 'hotel', 'scholarship', 'other']);

function isValidDeadline(d) {
  if (!d || typeof d !== 'object') return false;
  if (typeof d.date !== 'string' || !ISO_DATE.test(d.date)) return false;
  const parsed = new Date(d.date + 'T00:00:00Z');
  if (isNaN(parsed) || parsed <= asDate(TODAY)) return false;
  if (typeof d.label !== 'string' || d.label.length === 0) return false;
  return true;
}

function applyUpdates(original, updates) {
  if (!Array.isArray(updates) || updates.length === 0) {
    return { data: original, count: 0, changes: [] };
  }

  const byId    = Object.fromEntries(updates.map(u => [u.id, u]));
  const changes = [];
  let count = 0;

  const data = original.map(entry => {
    const upd = byId[entry.id];
    if (!upd) return entry;

    const existing = new Set((entry.deadlines || []).map(d => `${d.type}:${d.date}`));
    const fresh    = (upd.deadlines || [])
      .filter(isValidDeadline)
      .map(d => ({ ...d, type: VALID_TYPES.has(d.type) ? d.type : 'other' }))
      .filter(d => !existing.has(`${d.type}:${d.date}`));

    if (fresh.length === 0 && !upd._source) return entry;

    count++;
    changes.push({
      id:     entry.id,
      name:   entry.name,
      url:    entry.url || '',
      source: upd._source || '',
      added:  fresh,
    });

    return {
      ...entry,
      deadlines: [...(entry.deadlines || []), ...fresh],
      ...(upd._source ? { _source: upd._source } : {}),
    };
  });

  return { data, count, changes };
}

// ── PR body builder ───────────────────────────────────────────────────────────
const ICONS = {
  'abstract':     '📝',
  'early-bird':   '💷',
  'registration': '🎟️',
  'hotel':        '🏨',
  'scholarship':  '🎓',
  'other':        '📌',
};

function buildPrBody(allChanges, stats) {
  const runLink = RUN_URL ? ` · [Run log](${RUN_URL})` : '';
  const footer  = `_${stats.confsResearched} conferences + ${stats.otherResearched} other items researched · ${allChanges.length} entry/entries updated${runLink}_`;

  if (allChanges.length === 0) {
    return [
      `## 🗓 Deadline research — ${TODAY}`,
      '',
      '### Nothing new found',
      '',
      'All entries either already have upcoming deadline data, or no confirmed deadlines were found on official websites this run.',
      '',
      'This PR contains only the regenerated alert output files. You can close it without merging if no data files changed.',
      '',
      '---',
      footer,
    ].join('\n');
  }

  const lines = [
    `## 🗓 Deadline research — ${TODAY}`,
    '',
    `### What changed (${allChanges.length} ${allChanges.length === 1 ? 'entry' : 'entries'} updated)`,
    '',
  ];

  for (const c of allChanges) {
    const nameLink = c.url ? `[${c.name}](${c.url})` : c.name;
    lines.push(`**${nameLink}**`);
    for (const dl of c.added) {
      const icon = ICONS[dl.type] || '📌';
      let line = `- ${icon} ${dl.label} — **${dl.date}**`;
      if (dl.note) line += `  \n  _${dl.note}_`;
      lines.push(line);
    }
    if (c.source) {
      // Extract just the URL part before " — verified"
      const srcUrl = c.source.split(' —')[0].trim();
      lines.push(`- 🔗 Verify: [${srcUrl}](${srcUrl})`);
    }
    lines.push('');
  }

  lines.push(
    '---',
    '',
    '### Before merging',
    '',
    'Check each source link above — confirm the date is still showing on the official page.',
    '',
    '- [ ] All source URLs open and show the dates claimed',
    '- [ ] Any `TBC` notes have been given exact dates, or are clearly marked unconfirmed',
    '- [ ] Run `npm run alerts:wide` locally if you want to preview the newsletter outputs',
    '',
    'Merging triggers a Netlify deploy automatically.',
    '',
    '---',
    footer,
  );

  return lines.join('\n');
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  const confCandidates  = conferences.filter(e => !hasFutureDeadline(e) && withinWindow(e));
  const otherCandidates = otherItems.filter(e  => !hasFutureDeadline(e));

  const stats = {
    confsResearched: confCandidates.length,
    otherResearched: otherCandidates.length,
  };

  console.log(`\n📡 VetNextStep Deadline Research — ${TODAY}`);
  console.log(`   Model : ${MODEL}`);
  console.log(`   Conferences to research : ${confCandidates.length}  (of ${conferences.length})`);
  console.log(`   Other items to research : ${otherCandidates.length}  (of ${otherItems.length})\n`);

  const allChanges       = [];
  let updatedConferences = [...conferences];
  let updatedOther       = [...otherItems];

  // ── Conferences in batches ───────────────────────────────────────────────
  if (confCandidates.length > 0) {
    const batches = chunk(confCandidates, BATCH_SIZE);
    for (let i = 0; i < batches.length; i++) {
      process.stdout.write(`   Batch ${i + 1}/${batches.length} (${batches[i].length} conferences)… `);
      try {
        const updates = await callClaude(batches[i], 'These are veterinary conferences.');
        const { data, count, changes } = applyUpdates(updatedConferences, updates);
        updatedConferences = data;
        allChanges.push(...changes);
        console.log(`${count} updated`);
      } catch (err) {
        console.log(`FAILED — ${err.message}`);
      }
      if (i < batches.length - 1) await new Promise(r => setTimeout(r, BATCH_PAUSE_MS));
    }
  }

  // ── Other items (single batch) ───────────────────────────────────────────
  if (otherCandidates.length > 0) {
    process.stdout.write(`\n   Other items (${otherCandidates.length})… `);
    try {
      const updates = await callClaude(
        otherCandidates,
        'These are veterinary exam registration windows, professional qualification application deadlines, and postgraduate programme intakes — not conferences.',
      );
      const { data, count, changes } = applyUpdates(updatedOther, updates);
      updatedOther = data;
      allChanges.push(...changes);
      console.log(`${count} updated`);
    } catch (err) {
      console.log(`FAILED — ${err.message}`);
    }
  }

  // ── Save updated files ───────────────────────────────────────────────────
  const totalUpdated = allChanges.length;

  if (totalUpdated > 0) {
    fs.writeFileSync(CONFERENCES_FILE, JSON.stringify(updatedConferences, null, 2) + '\n');
    fs.writeFileSync(OTHER_FILE,       JSON.stringify(updatedOther,       null, 2) + '\n');
    console.log(`\n✅  ${totalUpdated} entries updated — files saved.`);
  } else {
    console.log('\nℹ️   No new confirmed deadline data found this run.');
  }

  // ── Write PR body ────────────────────────────────────────────────────────
  const prBody = buildPrBody(allChanges, stats);
  fs.writeFileSync(PR_BODY_FILE, prBody);
  console.log(`   PR body written to ${PR_BODY_FILE}`);

  // ── Write GitHub Actions step summary (visible in Actions UI) ────────────
  if (GITHUB_STEP_SUMMARY) {
    fs.appendFileSync(GITHUB_STEP_SUMMARY, prBody + '\n');
  }

  console.log('   Run npm run alerts:wide to regenerate output files.\n');
}

main().catch(err => {
  console.error('\n❌', err.message);

  // Write a minimal PR body so the workflow doesn't break on missing file
  const errorBody = [
    `## ❌ Research script failed — ${TODAY}`,
    '',
    `**Error:** ${err.message}`,
    '',
    'Check the run logs for the full stack trace.',
    RUN_URL ? `[Open run logs](${RUN_URL})` : '',
  ].filter(l => l !== null).join('\n');

  fs.writeFileSync(PR_BODY_FILE, errorBody);
  if (GITHUB_STEP_SUMMARY) fs.appendFileSync(GITHUB_STEP_SUMMARY, errorBody + '\n');

  process.exit(1);
});
