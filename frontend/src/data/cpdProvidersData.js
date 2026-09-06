export const providerCountryConfig = [
  {
    id: "australia",
    name: "Australia",
    flag: "\uD83C\uDDE6\uD83C\uDDFA",
    image: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=600&q=80",
  },
  {
    id: "canada",
    name: "Canada",
    flag: "\uD83C\uDDE8\uD83C\uDDE6",
    image: "https://images.pexels.com/photos/11862814/pexels-photo-11862814.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: "europe",
    name: "Europe",
    flag: "\uD83C\uDDEA\uD83C\uDDFA",
    image: "https://images.pexels.com/photos/9494908/pexels-photo-9494908.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: "new-zealand",
    name: "New Zealand",
    flag: "\uD83C\uDDF3\uD83C\uDDFF",
    image: "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=600&q=80",
  },
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
    id: "global",
    name: "Global & Industry",
    flag: "\uD83C\uDF10",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80",
  },
];

// ─── Region hierarchy ────────────────────────────────────────────────────────
// Shares the generated registry with conferences (src/data/countries.js), so a
// provider in a country the site has never covered is picked up by the filters
// on the next build with no config change. The provider data's own "europe" and
// "global" country values are handled there as the "region known, country not"
// buckets.
import { regionConfig, countryConfig } from "./countries";

export const providerRegionConfig = regionConfig;

export const providerCountryName = (id) => (countryConfig[id] || {}).name || id;

export const providerInRegion = (provider, regionId) =>
  Boolean(countryConfig[provider.country] && countryConfig[provider.country].region === regionId);

export const providerBrowseConfig = (slug) => {
  const region = regionConfig.find((r) => r.id === slug);
  if (region) return { ...region, kind: "region" };
  const country = countryConfig[slug];
  if (country) return { ...country, id: slug, kind: "country" };
  return null;
};

export const providerInScope = (provider, scope) =>
  scope.kind === "region" ? providerInRegion(provider, scope.id) : provider.country === scope.id;

// Country options for the sub-filter, derived from the providers actually present.
export const providerCountriesForRegion = (providers, regionId) => {
  const ids = new Set();
  for (const p of providers) {
    if (!p.country || !countryConfig[p.country]) continue;
    if (!regionId || providerInRegion(p, regionId)) ids.add(p.country);
  }
  return [...ids]
    .map((id) => ({ value: id, label: `${countryConfig[id].flag} ${countryConfig[id].name}`.trim() }))
    .sort((a, b) => countryConfig[a.value].name.localeCompare(countryConfig[b.value].name));
};

export const providerSpecialtyOptions = [
  "Anaesthesia",
  "Behaviour",
  "Cardiology",
  "Dentistry",
  "Dermatology",
  "Diagnostic Imaging",
  "Emergency & Critical Care",
  "Equine",
  "Exotic & Zoo",
  "Farm Animal",
  "Internal Medicine",
  "Neurology",
  "Nursing & Allied",
  "Nutrition",
  "Oncology",
  "Ophthalmology",
  "Orthopaedics",
  "Pharmacology",
  "Practice Management",
  "Rehabilitation",
  "Reproduction",
  "Surgery",
];

export const cpdTypeOptions = [
  "Online / E-learning",
  "Webinar",
  "Practical / Wet-lab",
  "Certificate",
  "Conference",
  "Subscription",
  "Masters / Postgrad",
  "Short Course",
];
