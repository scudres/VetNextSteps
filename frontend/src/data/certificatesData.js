// ─── Country hub configuration ────────────────────────────────────────────────

export const countryConfig = [
  {
    id: "australia",
    name: "Australia",
    flag: "🇦🇺",
  },
  {
    id: "canada",
    name: "Canada",
    flag: "🇨🇦",
  },
  {
    id: "new-zealand",
    name: "New Zealand",
    flag: "🇳🇿",
  },
  {
    id: "uk",
    name: "United Kingdom",
    flag: "🇬🇧",
  },
  {
    id: "usa",
    name: "United States",
    flag: "🇺🇸",
  },
];

// ─── Filter options & labels for AU/NZ pages ─────────────────────────────────

export const OCEANIA_TYPE_OPTIONS = [
  { value: "college-membership",              label: "College Membership Exam" },
  { value: "commercial-certificate",          label: "Commercial Certificate" },
  { value: "university-graduate-certificate", label: "University Graduate Certificate / Diploma" },
  { value: "university-masters",              label: "University Masters" },
  { value: "structured-cpd",                 label: "Structured CPD" },
];

export const TYPE_LABELS = {
  "college-membership":              "College Membership",
  "commercial-certificate":          "Commercial Certificate",
  "university-graduate-certificate": "University Graduate Certificate",
  "university-masters":              "University Masters",
  "structured-cpd":                  "Structured CPD",
};

// Type options for a country page, derived from the programmes actually listed
// so an option never renders with nothing behind it. The vocabulary is shared:
// OCEANIA_TYPE_OPTIONS is its full list, not an Oceania-only one.
export const certTypeOptionsFor = (programs = []) =>
  OCEANIA_TYPE_OPTIONS.filter((o) => programs.some((p) => p.type === o.value));
