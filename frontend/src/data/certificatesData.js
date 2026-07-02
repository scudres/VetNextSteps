// ─── Country hub configuration ────────────────────────────────────────────────

export const countryConfig = [
  {
    id: "australia",
    name: "Australia",
    flag: "🇦🇺",
    image: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=600&q=80",
  },
  {
    id: "canada",
    name: "Canada",
    flag: "🇨🇦",
    image: "https://images.pexels.com/photos/11862814/pexels-photo-11862814.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: "new-zealand",
    name: "New Zealand",
    flag: "🇳🇿",
    image: "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=600&q=80",
  },
  {
    id: "uk",
    name: "United Kingdom",
    flag: "🇬🇧",
    image: "https://images.pexels.com/photos/30721230/pexels-photo-30721230.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: "usa",
    name: "United States",
    flag: "🇺🇸",
    image: "https://images.pexels.com/photos/16156721/pexels-photo-16156721.jpeg?auto=compress&cs=tinysrgb&w=600",
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
