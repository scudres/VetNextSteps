// iCalendar (.ics) generation for conference dates and deadlines.
//
// Only entries whose date strings parse to a real calendar day are exportable —
// "September 2026 — check site" and "TBA" entries must never become a concrete
// calendar event, so parseDateRange returns null for them and callers hide the
// export control.

const MONTH_MAP = {
  jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
  jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12,
};
const MONTHS_RE = "jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec";
const DASH = "[\\u2013\\u2014-]"; // en-dash, em-dash, hyphen

// Parses display date strings from conferences data into an inclusive
// {start: [y,m,d], end: [y,m,d]} range, or null when no exact day is stated.
// Handles: "16 Sep 2026" · "9–12 Sep 2026" · "27 Feb – 3 Mar 2027" ·
// "30 Dec 2026 – 2 Jan 2027". Multi-run entries ("Jun 2026; Jun 2027") use the
// first segment only, matching the sort behaviour in conferencesData.
export const parseDateRange = (dateStr) => {
  if (!dateStr) return null;
  const seg = dateStr.split(/[;,]/)[0].trim();

  // "27 Feb – 3 Mar 2027" (year optional after the first month)
  let m = seg.match(new RegExp(
    `^(\\d{1,2})\\s*(${MONTHS_RE})[a-z]*\\s*(20\\d{2})?\\s*${DASH}\\s*(\\d{1,2})\\s*(${MONTHS_RE})[a-z]*\\s*(20\\d{2})$`, "i"));
  if (m) {
    const endYear   = parseInt(m[6], 10);
    const startYear = m[3] ? parseInt(m[3], 10) : endYear;
    return {
      start: [startYear, MONTH_MAP[m[2].toLowerCase()], parseInt(m[1], 10)],
      end:   [endYear,   MONTH_MAP[m[5].toLowerCase()], parseInt(m[4], 10)],
    };
  }

  // "9–12 Sep 2026"
  m = seg.match(new RegExp(
    `^(\\d{1,2})\\s*${DASH}\\s*(\\d{1,2})\\s*(${MONTHS_RE})[a-z]*\\s*(20\\d{2})$`, "i"));
  if (m) {
    const y = parseInt(m[4], 10);
    const mo = MONTH_MAP[m[3].toLowerCase()];
    return { start: [y, mo, parseInt(m[1], 10)], end: [y, mo, parseInt(m[2], 10)] };
  }

  // "16 Sep 2026"
  m = seg.match(new RegExp(`^(\\d{1,2})\\s*(${MONTHS_RE})[a-z]*\\s*(20\\d{2})$`, "i"));
  if (m) {
    const d = [parseInt(m[3], 10), MONTH_MAP[m[2].toLowerCase()], parseInt(m[1], 10)];
    return { start: d, end: d };
  }

  return null;
};

const pad = (n) => String(n).padStart(2, "0");
const fmtDate = ([y, m, d]) => `${y}${pad(m)}${pad(d)}`;

// DTEND for all-day events is exclusive: last day + 1.
const nextDay = ([y, m, d]) => {
  const dt = new Date(Date.UTC(y, m - 1, d + 1));
  return [dt.getUTCFullYear(), dt.getUTCMonth() + 1, dt.getUTCDate()];
};

// RFC 5545 text escaping.
const esc = (s) =>
  String(s || "").replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");

// Fold lines longer than 75 octets (approximated as characters; all-ASCII-safe
// enough for this data, and calendar apps accept slight overruns on UTF-8).
const fold = (line) => {
  if (line.length <= 75) return line;
  const parts = [];
  let rest = line;
  while (rest.length > 75) {
    parts.push(rest.slice(0, 75));
    rest = " " + rest.slice(75);
  }
  parts.push(rest);
  return parts.join("\r\n");
};

// events: [{ uid, summary, start: [y,m,d], end: [y,m,d] (inclusive),
//            location?, url?, description? }]
export const buildICS = (events) => {
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//VetNextStep//vetnextstep.com//EN",
    "CALSCALE:GREGORIAN",
  ];
  for (const ev of events) {
    lines.push(
      "BEGIN:VEVENT",
      `UID:${esc(ev.uid)}@vetnextstep.com`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${fmtDate(ev.start)}`,
      `DTEND;VALUE=DATE:${fmtDate(nextDay(ev.end))}`,
      `SUMMARY:${esc(ev.summary)}`
    );
    if (ev.location)    lines.push(`LOCATION:${esc(ev.location)}`);
    if (ev.url)         lines.push(`URL:${esc(ev.url)}`);
    if (ev.description) lines.push(`DESCRIPTION:${esc(ev.description)}`);
    lines.push("END:VEVENT");
  }
  lines.push("END:VCALENDAR");
  return lines.map(fold).join("\r\n") + "\r\n";
};

export const downloadICS = (filename, icsString) => {
  const blob = new Blob([icsString], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
