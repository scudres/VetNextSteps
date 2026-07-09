#!/usr/bin/env node
/**
 * VetNextStep — Visa Facts Verifier
 * ==================================
 * Re-verifies every fact in frontend/src/data/visaFacts.json against its
 * official source URL using claude-sonnet-5 with web search.
 *
 *   confirmed    — value still matches the source → bump verified date
 *   changed      — source shows a different value → update value + note
 *   unverifiable — could not confirm either way → flag for manual check
 *
 * The site renders these values directly (country pages import the JSON),
 * so a merged change here updates the live figures on the next deploy.
 *
 * Appends a markdown section to $RUNNER_TEMP/pr-body.md (created by
 * research-updates.mjs when both run in the same workflow) so the review PR
 * shows exactly what changed. Runs in .github/workflows/refresh-deadlines.yml.
 *
 * Usage:  ANTHROPIC_API_KEY=sk-... npm run visa:verify
 */

import fs   from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname  = path.dirname(fileURLToPath(import.meta.url));
const TODAY      = new Date().toISOString().slice(0, 10);
const FACTS_FILE = path.resolve(__dirname, '../../frontend/src/data/visaFacts.json');
const MODEL      = 'claude-sonnet-5';

const TMP_DIR      = process.env.RUNNER_TEMP || '/tmp';
const PR_BODY_FILE = path.join(TMP_DIR, 'pr-body.md');
const GITHUB_STEP_SUMMARY = process.env.GITHUB_STEP_SUMMARY || null;

function extractJSON(text) {
  const block = text.match(/```json\s*([\s\S]*?)```/);
  if (block) return JSON.parse(block[1]);
  const bare = text.match(/\[\s*\{[\s\S]*?\}\s*\]/);
  if (bare) return JSON.parse(bare[0]);
  return null;
}

async function verifyFacts(facts) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY environment variable is not set');

  const list = Object.entries(facts).map(([id, f]) => [
    `id:     ${id}`,
    `claim:  ${f.value} — ${f.detail}`,
    `source: ${f.source}`,
  ].join('\n')).join('\n\n');

  const prompt = `You are verifying immigration/licensing facts published on a veterinary careers website. Today is ${TODAY}.

For EACH fact below, check the official source URL (and the official body's site if the page moved) and decide:
- "confirmed"    — the claimed value is still what the source states
- "changed"      — the source now states a DIFFERENT value; supply the new value
- "unverifiable" — you cannot confirm either way from official sources

RULES:
1. Judge only against OFFICIAL sources (government or regulator pages). Blogs and law-firm summaries do not count.
2. If changed, "newValue" must use the same format as the claim (e.g. "£49,500", "AUD 79,499", "January 2029").
3. Never guess. When in doubt, use "unverifiable".
4. Respond with ONLY a JSON code block.

Output format:
\`\`\`json
[
  { "id": "fact-id", "status": "confirmed|changed|unverifiable", "newValue": "only when changed", "newDetail": "only when changed", "source": "url actually checked", "note": "one-line explanation" }
]
\`\`\`

Facts to verify:
${list}`;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method:  'POST',
    headers: {
      'x-api-key':         apiKey,
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
  return extractJSON(text) || [];
}

function buildMarkdown(results, facts) {
  const lines = ['', '---', '', `## 🛂 Visa facts verification — ${TODAY}`, ''];
  const icon = { confirmed: '✅', changed: '⚠️', unverifiable: '❓' };

  for (const r of results) {
    const fact = facts[r.id];
    if (!fact) continue;
    lines.push(`- ${icon[r.status] || '❓'} **${r.id}** — ${r.status}`);
    if (r.status === 'changed') {
      lines.push(`  - Was: \`${fact.value}\` → Now: \`${r.newValue}\``);
    }
    if (r.note)   lines.push(`  - ${r.note}`);
    if (r.source) lines.push(`  - Checked: ${r.source}`);
  }

  const unchecked = Object.keys(facts).filter(id => !results.some(r => r.id === id));
  for (const id of unchecked) {
    lines.push(`- ❓ **${id}** — no verdict returned; treat as unverifiable and check manually`);
  }

  lines.push('', '**Changed and unverifiable facts must be checked by a human before merging.**', '');
  return lines.join('\n');
}

async function main() {
  const doc = JSON.parse(fs.readFileSync(FACTS_FILE, 'utf8'));

  console.log(`\n🛂 VetNextStep Visa Facts Verifier — ${TODAY}`);
  console.log(`   Model : ${MODEL}`);
  console.log(`   Facts : ${Object.keys(doc.facts).length}\n`);

  const results = await verifyFacts(doc.facts);

  let confirmed = 0, changed = 0, unverifiable = 0;
  for (const r of results) {
    const fact = doc.facts[r.id];
    if (!fact) continue;

    if (r.status === 'confirmed') {
      fact.verified = TODAY;
      confirmed++;
    } else if (r.status === 'changed' && typeof r.newValue === 'string' && r.newValue.trim()) {
      fact.value    = r.newValue.trim();
      if (typeof r.newDetail === 'string' && r.newDetail.trim()) fact.detail = r.newDetail.trim();
      if (typeof r.source === 'string' && r.source.startsWith('http')) fact.source = r.source;
      fact.verified = TODAY;
      changed++;
      console.log(`   ⚠️  ${r.id}: value updated → ${fact.value}`);
    } else {
      unverifiable++;
      console.log(`   ❓ ${r.id}: ${r.status} — ${r.note || 'check manually'}`);
    }
  }

  // Only bump the site-wide "last reviewed" stamp when every fact was resolved.
  if (unverifiable === 0 && results.length >= Object.keys(doc.facts).length) {
    doc.lastVerified = TODAY;
  }

  fs.writeFileSync(FACTS_FILE, JSON.stringify(doc, null, 2) + '\n');

  const md = buildMarkdown(results, doc.facts);
  fs.appendFileSync(PR_BODY_FILE, md);
  if (GITHUB_STEP_SUMMARY) fs.appendFileSync(GITHUB_STEP_SUMMARY, md);

  console.log(`\n✅ ${confirmed} confirmed · ⚠️ ${changed} changed · ❓ ${unverifiable} unverifiable`);
  console.log(`   ${FACTS_FILE} updated.\n`);
}

main().catch(err => {
  console.error('\n❌', err.message);
  const md = `\n---\n\n## 🛂 Visa facts verification FAILED — ${TODAY}\n\n**Error:** ${err.message}\n\nFigures on the site keep their previous verified dates. Check manually.\n`;
  try { fs.appendFileSync(PR_BODY_FILE, md); } catch {}
  if (GITHUB_STEP_SUMMARY) { try { fs.appendFileSync(GITHUB_STEP_SUMMARY, md); } catch {} }
  process.exit(1);
});
