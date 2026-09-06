export const slugify = (s) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

// ─── Dates ───────────────────────────────────────────────────────────────────
// Formatted by hand rather than through Intl. Month names vary with the
// browser's ICU version — en-GB "short" yields "Sept" on newer builds and "Sep"
// on older ones — so the prerender and the visitor's browser could disagree,
// which breaks hydration and shows the reader a different date format depending
// on their browser. Fixing the names here also pins the site's own convention:
// 16 Sep 2026, three-letter month, no leading zero.
const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTHS_LONG  = ["January", "February", "March", "April", "May", "June",
                      "July", "August", "September", "October", "November", "December"];

// "2026-09-03" -> [2026, 9, 3]; parsed as plain numbers so no timezone applies.
const parts = (iso) => String(iso).split("-").map(Number);

/** 3 Sep 2026 */
export const formatShortDate = (iso) => {
  const [y, m, d] = parts(iso);
  return `${d} ${MONTHS_SHORT[m - 1]} ${y}`;
};

/** 3 September 2026 */
export const formatLongDate = (iso) => {
  const [y, m, d] = parts(iso);
  return `${d} ${MONTHS_LONG[m - 1]} ${y}`;
};

/** September 2026 */
export const formatMonthYear = (iso) => {
  const [y, m] = parts(iso);
  return `${MONTHS_LONG[m - 1]} ${y}`;
};
