// Search is now handled server-side via /.netlify/functions/search?q=...
// This file retains the section badge colour map and the display labels.

// Keys are the section values the search function returns. Do not rename them
// — they are data. Change sectionLabel below to alter what a user sees.
export const sectionColor = {
  "Graduate Development Programmes": "bg-blue-100 text-blue-800",
  "Internships & Residencies":       "bg-blue-100 text-blue-800",
  "Postgraduate Certificates":       "bg-blue-100 text-blue-800",
  "Conferences":                     "bg-blue-100 text-blue-800",
  "CPD Providers":                   "bg-blue-100 text-blue-800",
};

// Display labels. The search function still returns the old section names, so
// this maps them to the wording used across the site.
export const sectionLabel = {
  "Graduate Development Programmes": "Graduate programmes",
  "Internships & Residencies":       "Internships and residencies",
  "Postgraduate Certificates":       "Postgraduate certificate",
  "Conferences":                     "Conferences",
  "CPD Providers":                   "CPD providers",
};

export const labelFor = (section) => sectionLabel[section] || section;
