# Conference archive

Events that have already been held are removed from the live `/cpd` listing and
kept here. The archive is the research list: when checking what is worth adding
back, work through `past-events.json` and look for each organiser's next set of
dates.

Nothing in this directory is imported by the site or the Netlify functions. It
is maintenance data, like `tools/deadline-alerts/`.

## Files

| File | What it holds |
|---|---|
| `past-events.json` | Every listing removed from `/cpd` because it had been held, with the entry exactly as it appeared on the site |
| `find-past.mjs` | Reports which current listings have finished. Read-only — it never edits the data |

## Record shape

Each record is the original conference entry from `functions/data/conferences.js`
with three changes, so restoring one is a copy-and-paste with a new `dates` value:

- `dates` is renamed `lastHeld` — the dates the event actually ran
- `archivedOn` — the date it was taken off the site (`YYYY-MM-DD`)
- `cadence` — when the event repeats, e.g. `"annual, mid-July"`, once that is
  confirmed from the organiser. `null` until then; do not guess it

## The update, step by step

1. `npm run cpd:past` — lists finished, part-past, and undated entries.
2. **FINISHED** — move each entry to `past-events.json` (rename `dates` to
   `lastHeld`, add `archivedOn`, set `cadence` to `null`), then delete it from
   `functions/data/conferences.js`. Delete any category comment header left with
   no entries under it.
3. **PART-PAST** — a multi-year entry whose first edition has been held. Trim
   that segment from `dates`, and from `location`, `country`, and `regions`
   where those are per-edition. Keep the entry.
4. **UNDATED** — `TBA` / `TBC` entries the script cannot judge. Check the
   organiser's site by hand.
5. Research the archive: for each record, check the organiser's site for the
   next edition. If dates are published, copy the record back into
   `functions/data/conferences.js` with the new `dates`, and delete it from
   `past-events.json`. If the event has been discontinued, leave it archived and
   say so in `notes`.
6. `cd frontend && node scripts/build-data.js` regenerates `counts.js`,
   `countries.js`, `public/data/*.json`, and the CPD section of `sitemap.xml`.
   The production build runs this as its prebuild step, so it is only needed
   locally to see the change before committing.

## Rules

- Never invent a date, venue, or fee to fill a gap. An event whose next dates
  are not published is either left archived or listed with the site's own
  honest placeholder (`2027 dates TBA`, `September 2027 — check site`).
- An event is only finished once its **last** day has passed — the script reads
  the end of a range, not the start.
- Archive on the day you remove it. `archivedOn` is what makes it possible to
  tell a listing that lapsed last week from one that lapsed two years ago.
