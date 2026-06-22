// Parses a date string like "19–20 Nov 2026", "27 Feb – 3 Mar 2027", "September 2026",
// "2027 TBA", "TBA — check site" into a numeric sort key (YYYYMMDD).
// Multi-date entries (e.g. "Jun 2026; Jun 2027") use the first date only.
// TBA / check-site entries sort to the end of their year (or Infinity if no year found).
export const parseSortDate = (dateStr) => {
  if (!dateStr) return Infinity;

  const s = dateStr.toLowerCase();
  const months = {
    jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
    jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12,
  };

  // Use only the first date segment (before any semicolon or comma)
  const segment = s.split(/[;,]/)[0];

  const yearInSeg  = segment.match(/\b(20\d{2})\b/);
  const monthInSeg = segment.match(/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/);

  if (!monthInSeg) {
    // No month name — look for a bare year anywhere in the full string
    const anyYear = s.match(/\b(20\d{2})\b/);
    if (anyYear) return parseInt(anyYear[1]) * 10000 + 1299; // sort to end of that year
    return Infinity;
  }

  const month = months[monthInSeg[1]];
  const year  = yearInSeg
    ? parseInt(yearInSeg[1])
    : (s.match(/\b(20\d{2})\b/) ? parseInt(s.match(/\b(20\d{2})\b/)[1]) : null);

  if (!year) return Infinity;

  // Find the last day number that appears immediately before the month name
  const beforeMonth = segment.substring(0, monthInSeg.index);
  const dayMatch    = beforeMonth.match(/(\d{1,2})\D*$/);
  const day         = dayMatch ? parseInt(dayMatch[1]) : 1;

  return year * 10000 + month * 100 + day;
};

// Expands conferences that have multiple year dates (separated by ";") into
// one entry per year occurrence, each with its own sort-able date and location.
export const expandMultiYearConferences = (conferencesArray) => {
  const expanded = [];
  for (const conf of conferencesArray) {
    const segments = conf.dates.split(";").map((s) => s.trim()).filter(Boolean);
    if (segments.length <= 1) {
      expanded.push(conf);
      continue;
    }
    // Collect the years present across segments
    const years = segments.map((s) => {
      const m = s.match(/\b(20\d{2})\b/);
      return m ? m[1] : null;
    });
    const uniqueYears = [...new Set(years.filter(Boolean))];
    if (uniqueYears.length <= 1) {
      // All same year — keep as one entry
      expanded.push(conf);
      continue;
    }
    // Multiple distinct years — create one entry per segment
    for (const segment of segments) {
      // Extract trailing parenthetical as location override e.g. "10–12 Sep 2026 (Berlin)"
      const locMatch = segment.match(/\(([^)]+)\)\s*$/);
      const overrideLocation = locMatch ? locMatch[1] : null;
      expanded.push({
        ...conf,
        dates: segment,          // e.g. "10–12 Sep 2026 (Berlin)"
        location: overrideLocation || conf.location,
      });
    }
  }
  return expanded;
};

export const specialtyOptions = [
  "All Specialties",
  "General Practice",
  "Internal Medicine",
  "Surgery",
  "Neurology",
  "Dermatology",
  "Emergency & Critical Care",
  "Ophthalmology",
  "Cardiology",
  "Oncology",
  "Endocrinology",
  "Equine",
  "Farm Animal",
  "Anaesthesia",
  "Behaviour & Welfare",
  "Exotic & Zoo",
  "Feline",
  "Pathology",
  "Imaging",
  "Nutrition",
  "Theriogenology",
  "Gastroenterology",
  "Sports Medicine",
  "Dentistry",
  "Microbiology",
];

export const regionConfig = [
  {
    id: "uk",
    name: "United Kingdom",
    flag: "\uD83C\uDDEC\uD83C\uDDE7",
    image: "https://images.pexels.com/photos/30721230/pexels-photo-30721230.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: "usa",
    name: "United States",
    flag: "\uD83C\uDDFA\uD83C\uDDF8",
    image: "https://images.pexels.com/photos/16156721/pexels-photo-16156721.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: "europe",
    name: "Europe",
    flag: "\uD83C\uDDEA\uD83C\uDDFA",
    image: "https://images.pexels.com/photos/9494908/pexels-photo-9494908.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: "australia",
    name: "Australia",
    flag: "\uD83C\uDDE6\uD83C\uDDFA",
    image: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=600&q=80",
  },
  {
    id: "new-zealand",
    name: "New Zealand",
    flag: "\uD83C\uDDF3\uD83C\uDDFF",
    image: "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=600&q=80",
  },
  {
    id: "global",
    name: "Global / International",
    flag: "\uD83C\uDF0D",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80",
  },
];
