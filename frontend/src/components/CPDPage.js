import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link, useParams, useLocation, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import SharedHeader from "./SharedHeader";
import { PathwayRail } from "./PathwayRail";
import SharedFooter from "./SharedFooter";
import FilterSidebar from "./FilterSidebar";
import PageHead from "./PageHead";
import DeadlinesWidget from "./DeadlinesWidget";
import { loadData, getCached } from "../dataCache";
import {
  specialtyOptions, regionConfig, parseSortDate,
  countryConfig, conferenceInRegion, browseConfig, conferenceInScope, countriesForRegions,
} from "../data/conferencesData";
import { slugify } from "../utils";
import { upcomingOnly } from "../data/conferenceDates";
import { parseDateRange, buildICS, downloadICS } from "../ics";

// Build schema.org Event objects for conferences whose dates parse to a real
// calendar day (TBA and month-only entries are excluded). Used for JSON-LD.
const buildEventSchema = (confs) => {
  const events = [];
  for (const conf of confs) {
    const key = parseSortDate(conf.dates);
    if (!isFinite(key)) continue;
    const y = Math.floor(key / 10000);
    const m = Math.floor(key / 100) % 100;
    const d = key % 100;
    if (m < 1 || m > 12 || d < 1 || d > 31) continue; // month-only sentinel (…1299)
    const pad = (n) => String(n).padStart(2, "0");
    events.push({
      "@context": "https://schema.org",
      "@type": "Event",
      "name": conf.title,
      "startDate": `${y}-${pad(m)}-${pad(d)}`,
      "eventAttendanceMode": conf.format === "online"
        ? "https://schema.org/OnlineEventAttendanceMode"
        : conf.format === "hybrid"
        ? "https://schema.org/MixedEventAttendanceMode"
        : "https://schema.org/OfflineEventAttendanceMode",
      "location": conf.format === "online"
        ? { "@type": "VirtualLocation", "url": conf.website }
        : { "@type": "Place", "name": conf.location, "address": conf.location },
      "organizer": { "@type": "Organization", "name": conf.organiser, "url": conf.website },
      "url": conf.website,
    });
  }
  return events;
};

// ——— Date helpers ———
const MONTH_ABBR = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const MONTH_MAP  = {jan:1,feb:2,mar:3,apr:4,may:5,jun:6,jul:7,aug:8,sep:9,oct:10,nov:11,dec:12};
const getYear  = (d) => d?.match(/\b(20\d{2})\b/)?.[1] ?? null;
const getMonth = (d) => {
  const m = d?.toLowerCase().match(/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/)?.[1];
  return m ? MONTH_MAP[m] : null;
};

const FORMAT_OPTIONS = [
  { value: "in-person", label: "In Person" },
  { value: "online",    label: "Online"    },
  { value: "hybrid",    label: "Hybrid"    },
];

// Download a single conference as an all-day .ics event. Only called when
// parseDateRange succeeds — TBA and month-only entries never get the button.
const exportConference = (conf) => {
  const range = parseDateRange(conf.dates);
  if (!range) return;
  downloadICS(
    `${slugify(conf.title)}.ics`,
    buildICS([{
      uid: `${slugify(conf.title)}-${range.start.join("")}`,
      summary: conf.title,
      start: range.start,
      end: range.end,
      location: conf.location,
      url: conf.website,
      description: conf.organiser,
    }])
  );
};

// ——— Conference card ———
const ConferenceCard = ({ conf }) => (
  // A row rather than a rounded card: the date is the column vets scan, so it
  // gets its own track on the left instead of sitting inside a box with an icon.
  <div
    id={slugify(conf.title)}
    className="grid grid-cols-1 sm:grid-cols-[132px_minmax(0,1fr)] gap-x-5 gap-y-1 py-4 border-b border-gray-200 scroll-mt-28"
  >
    <div className="text-sm text-gray-700 tabular-nums">{conf.dates}</div>

    <div>
      <h4 className="text-[15px] font-semibold leading-snug">
        <a
          href={conf.website}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-800 underline underline-offset-2 decoration-blue-200 hover:decoration-blue-800"
        >
          {conf.title}
        </a>
      </h4>
      <p className="text-sm text-gray-600">{conf.organiser}</p>
      <p className="text-sm text-gray-600">{conf.location}</p>

      {conf.notes && (
        <p className="mt-1.5 font-serif italic text-sm leading-relaxed text-gray-600 max-w-[62ch]">{conf.notes}</p>
      )}

      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        {conf.specialties.map((sp) => (
          <span key={sp} className="px-2 py-0.5 text-xs text-gray-700 bg-blue-50 border border-gray-200">{sp}</span>
        ))}
        {conf.format && conf.format !== "in-person" && (
          <span className="px-2 py-0.5 text-xs text-gray-700 bg-white border border-gray-400">
            {conf.format === "online" ? "Online" : "Hybrid"}
          </span>
        )}
        {parseDateRange(conf.dates) && (
          <button
            onClick={() => downloadICS(
              `${slugify(conf.title)}.ics`,
              buildICS([{
                uid:      slugify(conf.title),
                summary:  conf.title,
                start:    parseDateRange(conf.dates).start,
                end:      parseDateRange(conf.dates).end,
                url:      conf.website,
                location: conf.location,
              }]),
            )}
            className="ml-auto text-xs text-blue-800 underline underline-offset-2 hover:text-blue-900"
          >
            Add to calendar
          </button>
        )}
      </div>
    </div>
  </div>
);

// Group config for the left-hand FilterSidebar. Categories and option lists
// match the filter state the page already keeps in the URL.
const sidebarGroups = ({ availableYears, availableMonths, showRegions, countryOptions }) => [
  { key: "specialties", heading: "Speciality", options: specialtyOptions.slice(1), limit: 6,
    moreLabel: `All ${specialtyOptions.length - 1} specialities` },
  ...(showRegions
    ? [{ key: "regions", heading: "Region",
         options: regionConfig.map((r) => ({ value: r.id, label: r.name })) }]
    : []),
  ...(countryOptions.length > 1
    // No cap: the point of this group is to show the individual countries,
    // and every country is listed on the same footing.
    ? [{ key: "countries", heading: "Country", options: countryOptions }]
    : []),
  { key: "years",   heading: "Year",   options: availableYears },
  { key: "months",  heading: "Month",  options: availableMonths.map((m) => ({ value: m, label: MONTH_ABBR[m - 1] })), limit: 6 },
  { key: "formats", heading: "Format", options: FORMAT_OPTIONS },
];

const EMPTY_FILTERS = { specialties: [], regions: [], countries: [], years: [], months: [], formats: [] };

// URL query keys for each filter category — filter state lives in the URL so
// any filtered view is a shareable link (e.g. /cpd?specialty=Cardiology&region=uk).
const FILTER_PARAM_KEYS = { specialties: "specialty", regions: "region", countries: "country", years: "year", months: "month", formats: "format" };
const splitParam = (v) => (v ? v.split(",").filter(Boolean) : []);

// ——— Main component ———
const CPDPage = () => {
  const { region } = useParams();
  const location   = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(() => ({
    specialties: splitParam(searchParams.get("specialty")),
    regions:     splitParam(searchParams.get("region")),
    countries:   splitParam(searchParams.get("country")),
    years:       splitParam(searchParams.get("year")),
    months:      splitParam(searchParams.get("month")).map(Number),
    formats:     splitParam(searchParams.get("format")),
  }), [searchParams]);

  const setFilterParams = useCallback((next) => {
    const params = new URLSearchParams(searchParams);
    for (const [category, key] of Object.entries(FILTER_PARAM_KEYS)) {
      if (next[category].length > 0) params.set(key, next[category].join(","));
      else params.delete(key);
    }
    setSearchParams(params, { replace: true });
  }, [searchParams, setSearchParams]);

  const [loadedConferences, setAllConferences] = useState(() => getCached("conferences") || []);
  const [loading, setLoading]           = useState(() => !getCached("conferences"));
  const [error, setError]               = useState(null);

  useEffect(() => {
    loadData("conferences")
      .then((data) => { setAllConferences(data); setLoading(false); })
      .catch((err) => { setError(err.message); setLoading(false); });
  }, []);

  // Events drop off the day after they finish, judged against the visitor's own
  // clock rather than the date of the last deploy. The archive tool keeps the
  // source data tidy, but the page must not wait for it to be run.
  const allConferences = useMemo(() => upcomingOnly(loadedConferences), [loadedConferences]);

  useEffect(() => {
    if (loading || !location.hash) return;
    const el = document.querySelector(location.hash);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [loading, location.hash]);

  const availableYears = useMemo(
    () => [...new Set(allConferences.map((c) => getYear(c.dates)).filter(Boolean))].sort(),
    [allConferences]
  );
  const availableMonths = useMemo(
    () => [...new Set(allConferences.map((c) => getMonth(c.dates)).filter(Boolean))].sort((a, b) => a - b),
    [allConferences]
  );

  const toggleFilter = (category, value) =>
    setFilterParams({
      ...filters,
      [category]: filters[category].includes(value)
        ? filters[category].filter((v) => v !== value)
        : [...filters[category], value],
    });

  const clearFilters = () => setFilterParams(EMPTY_FILTERS);

  // checkRegions = true on the hub page (user can filter by region dropdown);
  // false on sub-pages where region is already implicit in the URL.
  const matchesFilters = (conf, checkRegions = false, checkCountries = true) => {
    if (filters.specialties.length > 0 && !conf.specialties.some((s) => filters.specialties.includes(s))) return false;
    if (checkRegions && filters.regions.length > 0 && !filters.regions.some((r) => conferenceInRegion(conf, r))) return false;
    if (checkCountries && filters.countries.length > 0 && !filters.countries.includes(conf.country)) return false;
    if (filters.years.length   > 0 && !filters.years.includes(getYear(conf.dates)))   return false;
    if (filters.months.length  > 0 && !filters.months.includes(getMonth(conf.dates))) return false;
    if (filters.formats.length > 0 && !filters.formats.includes(conf.format))         return false;
    return true;
  };

  const getConferencesForRegion = (regionId) =>
    allConferences
      .filter((c) => conferenceInRegion(c, regionId) && matchesFilters(c, true))
      .sort((a, b) => parseSortDate(a.dates) - parseSortDate(b.dates));

  // Card counts deliberately ignore the region and country filters: a card
  // reporting "0 events" only because you have already selected somewhere else
  // reads as broken data rather than as a filter that is doing its job.
  const countForRegionCard = (regionId) =>
    allConferences.filter((c) => conferenceInRegion(c, regionId) && matchesFilters(c, false, false)).length;

  // ——— SUB-PAGE VIEW ———
  if (region) {
    const cfg = browseConfig(region);
    if (!cfg) {
      return (
        <div className="min-h-screen bg-white">
          <SharedHeader />
          <PathwayRail current={1} />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            <p className="text-gray-500">No conferences section for that region or country.</p>
            <Link to="/cpd" className="text-blue-600 hover:underline mt-4 inline-block">Back to CPD & Conferences</Link>
          </div>
          <SharedFooter />
        </div>
      );
    }

    const regionConferences = allConferences
      .filter((c) => conferenceInScope(c, cfg) && matchesFilters(c))
      .sort((a, b) => parseSortDate(a.dates) - parseSortDate(b.dates));

    // Schema is built from the full region list, not the filtered view —
    // crawlers should see every event regardless of the visitor's filters.
    const eventSchema = buildEventSchema(allConferences.filter((c) => conferenceInScope(c, cfg)));

    // On a region page the sub-filter lists that region's countries; a country
    // page is already as narrow as it goes, so it gets none.
    const scopeCountryOptions = cfg.kind === "region"
      ? countriesForRegions(allConferences.filter((c) => conferenceInScope(c, cfg)), [])
      : [];

    return (
      <div className="min-h-screen bg-white">
        <Helmet>
          <title>{`${cfg.name} Veterinary Conferences | VetNextStep`}</title>
          <meta name="description" content={`Veterinary conferences and CPD events in ${cfg.name}. Filter by speciality and find upcoming events.`} />
          <link rel="canonical" href={`https://vetnextstep.com/cpd/${region}`} />
          <meta property="og:title" content={`${cfg.name} Veterinary Conferences | VetNextStep`} />
          <meta property="og:description" content={`Upcoming vet conferences and CPD events in ${cfg.name} — filter by speciality, month, or format.`} />
          <meta property="og:url" content={`https://vetnextstep.com/cpd/${region}`} />
          <meta property="og:image" content="https://vetnextstep.com/og-image.png" />
          <meta property="og:type" content="website" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:image" content="https://vetnextstep.com/og-image.png" />
          {eventSchema.length > 0 && (
            <script type="application/ld+json">{JSON.stringify(eventSchema)}</script>
          )}
        </Helmet>
        <SharedHeader />
        <PathwayRail current={1} />
        <main className="py-8 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <div className="mb-8">
              <Link to="/cpd" className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                All CPD & Conferences
              </Link>
            </div>

            {/* Region header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl">{cfg.flag}</span>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">{cfg.name}</h1>
              </div>
              <p className="text-gray-500 text-lg">
                Upcoming veterinary conferences and congresses
                {cfg.kind === "country" && cfg.region && (
                  <>
                    {" \u00b7 "}
                    <Link to={`/cpd/${cfg.region}`} className="text-blue-600 hover:underline">
                      All {regionConfig.find((r) => r.id === cfg.region)?.name} events
                    </Link>
                  </>
                )}
              </p>
            </div>

            {loading && <div className="text-center py-20 text-gray-400 text-sm">Loading conferences…</div>}
            {error   && <div className="text-center py-20 text-red-500 text-sm">Could not load conference data. Please refresh the page.</div>}

            {!loading && !error && (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-[236px_minmax(0,1fr)] gap-0 border-t border-gray-200">
                  <FilterSidebar
                    groups={sidebarGroups({
                      availableYears,
                      availableMonths,
                      showRegions: false,
                      countryOptions: scopeCountryOptions,
                    })}
                    filters={filters}
                    onToggle={toggleFilter}
                    onClear={clearFilters}
                    summary={
                      <p className="text-sm font-semibold text-gray-900 tabular-nums">
                        {regionConferences.length} event{regionConferences.length !== 1 ? "s" : ""} shown
                      </p>
                    }
                  />
                  <div className="lg:pl-8 pt-6">
                    {regionConferences.length === 0 ? (
                      <div className="border border-gray-200 p-12 text-center text-gray-500 text-sm">
                        No conferences match the current filters for this region.
                      </div>
                    ) : (
                      <div className="border-t border-gray-200">
                        {regionConferences.map((conf, i) => (
                          <ConferenceCard key={`${conf.title}|${conf.dates}`} conf={conf} />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
        <SharedFooter />
      </div>
    );
  }

  // ——— HUB VIEW ———
  const totalVisible = allConferences.filter((c) => matchesFilters(c, true)).length;
  const hubEventSchema = buildEventSchema(allConferences);

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Veterinary Conferences &amp; CPD Events | VetNextStep</title>
        <meta name="description" content="Upcoming veterinary conferences in the UK, USA, Australia, New Zealand and Europe. Filter by speciality or browse CPD providers and online courses." />
        <link rel="canonical" href="https://vetnextstep.com/cpd" />
        <meta property="og:title" content="Veterinary Conferences &amp; CPD Events | VetNextStep" />
        <meta property="og:description" content="Upcoming veterinary conferences in the UK, USA, Australia, New Zealand and Europe — filter by speciality, month, or format." />
        <meta property="og:url" content="https://vetnextstep.com/cpd" />
        <meta property="og:image" content="https://vetnextstep.com/og-image.png" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Veterinary Conferences &amp; CPD Events | VetNextStep" />
        <meta name="twitter:description" content="Upcoming veterinary conferences — filter by speciality, month, or format." />
        <meta name="twitter:image" content="https://vetnextstep.com/og-image.png" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://vetnextstep.com/" },
            { "@type": "ListItem", "position": 2, "name": "CPD & Conferences", "item": "https://vetnextstep.com/cpd" }
          ]
        })}</script>
        {hubEventSchema.length > 0 && (
          <script type="application/ld+json">{JSON.stringify(hubEventSchema)}</script>
        )}
      </Helmet>
      <SharedHeader />
      <PathwayRail current={1} />
      <PageHead
        trail={[{ label: "Home", to: "/" }, { label: "CPD & Conferences" }]}
        title="CPD & Conferences"
        lede="Conferences in date order, filterable by speciality, region, year, month or format. Events drop off the listing once they have been held."
      >
        <div className="flex gap-1 mt-5 -mb-5">
          <span className="px-4 py-2.5 text-sm font-semibold text-gray-900 border-b-[3px] border-blue-800">
            Conferences &amp; congresses
          </span>
          <Link
            to="/cpd/providers"
            className="px-4 py-2.5 text-sm text-gray-600 border-b-[3px] border-transparent hover:text-gray-900 hover:border-gray-300"
          >
            CPD providers &amp; courses
          </Link>
        </div>
      </PageHead>

      <main className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* ——— CONFERENCES SECTION ——— */}
          <div>
              {loading && <div className="text-center py-20 text-gray-400 text-sm">Loading conferences…</div>}
              {error   && <div className="text-center py-20 text-red-500 text-sm">Could not load conference data. Please refresh the page.</div>}

              {!loading && !error && (
                <>
                  {/* Closing-soon deadlines (from tools/deadline-alerts pipeline) */}
                  <div className="mb-10">
                    <DeadlinesWidget />
                  </div>

                  {/* Region nav cards */}
                  <h2 className="text-lg font-semibold text-gray-700 mb-5">International Vet CE &amp; CPD — Browse by Region</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-10">
                    {regionConfig.filter((r) => countForRegionCard(r.id) > 0).map((r) => {
                      const count = countForRegionCard(r.id);
                      return (
                        <Link key={r.id} to={`/cpd/${r.id}`} className="group block">
                          <div className="bg-white border border-gray-200 overflow-hidden hover:border-blue-800 transition-colors">
                            <div className="h-32 relative overflow-hidden">
                              {r.image ? (
                                <img
                                  src={r.image}
                                  srcSet={`${r.image.replace('w=600', 'w=400')} 400w, ${r.image} 600w, ${r.image.replace('w=600', 'w=900')} 900w`}
                                  sizes="(min-width: 1280px) 16vw, (min-width: 640px) 33vw, 100vw"
                                  alt={r.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  loading="lazy"
                                  width="600"
                                  height="400"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center">
                                  <span className="text-4xl" aria-hidden="true">{r.flag}</span>
                                </div>
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                              <div className="absolute bottom-3 left-3 text-white">
                                <h3 className="text-sm font-bold leading-tight">{r.name}</h3>
                              </div>
                            </div>
                            <div className="px-3 py-2 flex items-center justify-between bg-white">
                              <span className="text-xs text-gray-500">{count === 0 ? "No events" : `${count} event${count !== 1 ? "s" : ""}`}</span>
                              <span className="text-blue-600 text-xs font-medium group-hover:translate-x-1 transition-transform inline-flex items-center">
                                View all
                                <svg className="ml-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </span>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>

                  {/* Filters + listing */}
                  <div className="grid grid-cols-1 lg:grid-cols-[236px_minmax(0,1fr)] gap-0 border-t border-gray-200">
                    <FilterSidebar
                      groups={sidebarGroups({
                        availableYears,
                        availableMonths,
                        showRegions: true,
                        countryOptions: filters.regions.length > 0
                          ? countriesForRegions(allConferences, filters.regions)
                          : [],
                      })}
                      filters={filters}
                      onToggle={toggleFilter}
                      onClear={clearFilters}
                      summary={
                        <p className="text-sm font-semibold text-gray-900 tabular-nums">
                          {totalVisible} conference{totalVisible !== 1 ? "s" : ""} shown
                        </p>
                      }
                    />
                    <div className="lg:pl-8 pt-6">
                    <h2 className="text-lg font-semibold text-gray-700 mb-5">Clinical &amp; Professional Development Conferences</h2>

                  {regionConfig.map((r) => {
                    const conferences = getConferencesForRegion(r.id);
                    return (
                      <section key={r.id} id={`conf-${r.id}`} className="mb-10 scroll-mt-28">
                        <div className="flex items-baseline gap-3 mb-1 pb-2 border-b-2 border-navy">
                          <h3 className="text-lg font-bold tracking-tight text-gray-900">{r.name}</h3>
                          <Link to={`/cpd/${r.id}`} className="ml-auto text-sm text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1">
                            View region page
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                        </div>
                        {conferences.length === 0 ? (
                          <div className="border border-gray-200 p-8 text-center text-gray-600 text-sm">
                            No conferences match the current filters in this region.
                          </div>
                        ) : (
                          <div className="border-t border-gray-200">
                            {conferences.map((conf, i) => (
                              <ConferenceCard key={`${conf.title}|${conf.dates}`} conf={conf} />
                            ))}
                          </div>
                        )}
                      </section>
                    );
                  })}
                    </div>
                  </div>
                </>
              )}
          </div>
        </div>
      </main>
      <SharedFooter />
    </div>
  );
};

export default CPDPage;
