import React, { useState, useEffect, useMemo } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import SharedHeader from "./SharedHeader";
import SharedFooter from "./SharedFooter";
import FilterDropdown from "./FilterDropdown";
import { specialtyOptions, regionConfig, parseSortDate } from "../data/conferencesData";
import { slugify } from "../utils";

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

// ——— Conference card ———
const ConferenceCard = ({ conf }) => (
  <div
    id={slugify(conf.title)}
    className="bg-white rounded-xl border border-gray-100 p-6 hover:border-blue-200 hover:shadow-sm transition-colors flex flex-col scroll-mt-28"
  >
    <div className="flex flex-wrap gap-1.5 mb-3">
      {conf.specialties.map((s) => (
        <span key={s} className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">{s}</span>
      ))}
      {conf.format && conf.format !== "in-person" && (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
          conf.format === "online" ? "bg-green-100 text-green-700" : "bg-purple-100 text-purple-700"
        }`}>
          {conf.format === "online" ? "Online" : "Hybrid"}
        </span>
      )}
    </div>
    <h4 className="text-base font-semibold text-gray-900 mb-1 leading-snug">{conf.title}</h4>
    <p className="text-sm text-blue-600 font-medium mb-3">{conf.organiser}</p>
    <div className="space-y-1.5 mb-4">
      <div className="flex items-start gap-2 text-sm text-gray-600">
        <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span>{conf.dates}</span>
      </div>
      <div className="flex items-start gap-2 text-sm text-gray-600">
        <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span>{conf.location}</span>
      </div>
    </div>
    {conf.notes && (
      <p className="text-xs text-gray-500 italic mb-4 leading-relaxed">{conf.notes}</p>
    )}
    <div className="mt-auto">
      <a
        href={conf.website}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
      >
        Visit Website
        <svg className="ml-2 w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </a>
    </div>
  </div>
);

// ——— Filter row used in both hub and sub-page views ———
const FilterRow = ({ filters, onToggle, onClear, availableYears, availableMonths, showRegions = true }) => {
  const activeCount = Object.values(filters).reduce((n, arr) => n + arr.length, 0);
  return (
    <div className="flex flex-wrap gap-2 mb-6 items-center">
      <FilterDropdown
        label="Specialty"
        options={specialtyOptions.slice(1)}
        selected={filters.specialties}
        onToggle={(v) => onToggle("specialties", v)}
      />
      {showRegions && (
        <FilterDropdown
          label="Region"
          options={regionConfig.map((r) => ({ value: r.id, label: `${r.flag} ${r.name}` }))}
          selected={filters.regions}
          onToggle={(v) => onToggle("regions", v)}
          valueKey="value"
          labelKey="label"
        />
      )}
      <FilterDropdown
        label="Year"
        options={availableYears}
        selected={filters.years}
        onToggle={(v) => onToggle("years", v)}
      />
      <FilterDropdown
        label="Month"
        options={availableMonths.map((m) => ({ value: m, label: MONTH_ABBR[m - 1] }))}
        selected={filters.months}
        onToggle={(v) => onToggle("months", v)}
        valueKey="value"
        labelKey="label"
      />
      <FilterDropdown
        label="Format"
        options={FORMAT_OPTIONS}
        selected={filters.formats}
        onToggle={(v) => onToggle("formats", v)}
        valueKey="value"
        labelKey="label"
      />
      {activeCount > 0 && (
        <button
          onClick={onClear}
          className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 underline underline-offset-2"
        >
          Clear all ({activeCount})
        </button>
      )}
    </div>
  );
};

const EMPTY_FILTERS = { specialties: [], regions: [], years: [], months: [], formats: [] };

// ——— Main component ———
const CPDPage = () => {
  const { region } = useParams();
  const location   = useLocation();

  const [filters, setFilters]           = useState(EMPTY_FILTERS);
  const [allConferences, setAllConferences] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);

  useEffect(() => {
    fetch("/.netlify/functions/conferences")
      .then((res) => { if (!res.ok) throw new Error("Failed to load conferences"); return res.json(); })
      .then((data) => { setAllConferences(data); setLoading(false); })
      .catch((err) => { setError(err.message); setLoading(false); });
  }, []);

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
    setFilters((prev) => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter((v) => v !== value)
        : [...prev[category], value],
    }));

  const clearFilters = () => setFilters(EMPTY_FILTERS);

  // checkRegions = true on the hub page (user can filter by region dropdown);
  // false on sub-pages where region is already implicit in the URL.
  const matchesFilters = (conf, checkRegions = false) => {
    if (filters.specialties.length > 0 && !conf.specialties.some((s) => filters.specialties.includes(s))) return false;
    if (checkRegions && filters.regions.length > 0 && !conf.regions.some((r) => filters.regions.includes(r))) return false;
    if (filters.years.length   > 0 && !filters.years.includes(getYear(conf.dates)))   return false;
    if (filters.months.length  > 0 && !filters.months.includes(getMonth(conf.dates))) return false;
    if (filters.formats.length > 0 && !filters.formats.includes(conf.format))         return false;
    return true;
  };

  const getConferencesForRegion = (regionId) =>
    allConferences
      .filter((c) => c.regions.includes(regionId) && matchesFilters(c, true))
      .sort((a, b) => parseSortDate(a.dates) - parseSortDate(b.dates));

  // ——— SUB-PAGE VIEW ———
  if (region) {
    const cfg = regionConfig.find((r) => r.id === region);
    if (!cfg) {
      return (
        <div className="min-h-screen bg-white">
          <SharedHeader />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            <p className="text-gray-500">Region not found.</p>
            <Link to="/cpd" className="text-blue-600 hover:underline mt-4 inline-block">Back to CPD & Conferences</Link>
          </div>
          <SharedFooter />
        </div>
      );
    }

    const regionConferences = allConferences
      .filter((c) => c.regions.includes(region) && matchesFilters(c))
      .sort((a, b) => parseSortDate(a.dates) - parseSortDate(b.dates));

    const subPageActiveCount = ["specialties","years","months","formats"]
      .reduce((n, k) => n + filters[k].length, 0);

    return (
      <div className="min-h-screen bg-white">
        <Helmet>
          <title>{cfg.name} Veterinary Conferences | VetNextStep</title>
          <meta name="description" content={`Veterinary conferences and CPD events in ${cfg.name}. Filter by specialty and find upcoming events.`} />
          <link rel="canonical" href={`https://vetnextstep.com/cpd/${region}`} />
          <meta property="og:title" content={`${cfg.name} Veterinary Conferences | VetNextStep`} />
          <meta property="og:description" content={`Upcoming vet conferences and CPD events in ${cfg.name} — filter by specialty, month, or format.`} />
          <meta property="og:url" content={`https://vetnextstep.com/cpd/${region}`} />
          <meta property="og:image" content="https://vetnextstep.com/og-image.png" />
          <meta property="og:type" content="website" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:image" content="https://vetnextstep.com/og-image.png" />
        </Helmet>
        <SharedHeader />
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
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{cfg.name}</h1>
              </div>
              <p className="text-gray-500 text-lg">Upcoming veterinary conferences and congresses</p>
            </div>

            {loading && <div className="text-center py-20 text-gray-400 text-sm">Loading conferences…</div>}
            {error   && <div className="text-center py-20 text-red-500 text-sm">Could not load conference data. Please refresh the page.</div>}

            {!loading && !error && (
              <>
                {/* Filters */}
                <div className="mb-2">
                  <div className="flex flex-wrap gap-2 mb-3 items-center">
                    <FilterDropdown
                      label="Specialty"
                      options={specialtyOptions.slice(1)}
                      selected={filters.specialties}
                      onToggle={(v) => toggleFilter("specialties", v)}
                    />
                    <FilterDropdown
                      label="Year"
                      options={availableYears}
                      selected={filters.years}
                      onToggle={(v) => toggleFilter("years", v)}
                    />
                    <FilterDropdown
                      label="Month"
                      options={availableMonths.map((m) => ({ value: m, label: MONTH_ABBR[m - 1] }))}
                      selected={filters.months}
                      onToggle={(v) => toggleFilter("months", v)}
                      valueKey="value"
                      labelKey="label"
                    />
                    <FilterDropdown
                      label="Format"
                      options={FORMAT_OPTIONS}
                      selected={filters.formats}
                      onToggle={(v) => toggleFilter("formats", v)}
                      valueKey="value"
                      labelKey="label"
                    />
                    {subPageActiveCount > 0 && (
                      <button onClick={clearFilters} className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 underline underline-offset-2">
                        Clear all ({subPageActiveCount})
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mb-6">
                    {regionConferences.length} event{regionConferences.length !== 1 ? "s" : ""} shown
                  </p>
                </div>

                {regionConferences.length === 0 ? (
                  <div className="bg-white rounded-xl border border-gray-100 p-12 text-center text-gray-400 text-sm">
                    No conferences match the current filters for this region.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {regionConferences.map((conf, i) => (
                      <ConferenceCard key={`${conf.title}|${conf.dates}`} conf={conf} />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </main>
        <SharedFooter />
      </div>
    );
  }

  // ——— HUB VIEW ———
  const totalVisible = regionConfig.reduce((acc, r) => acc + getConferencesForRegion(r.id).length, 0);

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Veterinary Conferences &amp; CPD Events | VetNextStep</title>
        <meta name="description" content="Upcoming veterinary conferences in the UK, USA, Australia, New Zealand and Europe. Filter by specialty or browse CPD providers and online courses." />
        <link rel="canonical" href="https://vetnextstep.com/cpd" />
        <meta property="og:title" content="Veterinary Conferences &amp; CPD Events | VetNextStep" />
        <meta property="og:description" content="Upcoming veterinary conferences in the UK, USA, Australia, New Zealand and Europe — filter by specialty, month, or format." />
        <meta property="og:url" content="https://vetnextstep.com/cpd" />
        <meta property="og:image" content="https://vetnextstep.com/og-image.png" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Veterinary Conferences &amp; CPD Events | VetNextStep" />
        <meta name="twitter:description" content="Upcoming veterinary conferences — filter by specialty, month, or format." />
        <meta name="twitter:image" content="https://vetnextstep.com/og-image.png" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://vetnextstep.com/" },
            { "@type": "ListItem", "position": 2, "name": "CPD & Conferences", "item": "https://vetnextstep.com/cpd" }
          ]
        })}</script>
      </Helmet>
      <SharedHeader />
      <main className="py-8 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page title */}
          <div className="text-center mb-10">
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">CPD & Conferences</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Conferences sorted by date — filter by specialty, region, year, month or format. CPD providers and online courses are listed under the second tab.
            </p>
          </div>

          {/* Section tabs */}
          <div className="flex border-b border-gray-200 mb-10 -mt-2">
            <button className="px-5 py-3 text-sm font-medium border-b-2 border-blue-600 text-blue-600 -mb-px transition-colors">
              Conferences &amp; Congresses
            </button>
            <Link
              to="/cpd/providers"
              className="px-5 py-3 text-sm font-medium border-b-2 border-transparent text-gray-500 hover:text-gray-700 -mb-px transition-colors"
            >
              CPD Providers &amp; Courses
            </Link>
          </div>

          {/* ——— CONFERENCES SECTION ——— */}
          <div>
              {loading && <div className="text-center py-20 text-gray-400 text-sm">Loading conferences…</div>}
              {error   && <div className="text-center py-20 text-red-500 text-sm">Could not load conference data. Please refresh the page.</div>}

              {!loading && !error && (
                <>
                  {/* Region nav cards */}
                  <h2 className="text-lg font-semibold text-gray-700 mb-5">International Vet CE &amp; CPD — Browse by Region</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-10">
                    {regionConfig.map((r) => {
                      const count = getConferencesForRegion(r.id).length;
                      return (
                        <Link key={r.id} to={`/cpd/${r.id}`} className="group block">
                          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-blue-300 hover:shadow-md transition-all">
                            <div className="h-32 relative overflow-hidden">
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
                              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                              <div className="absolute bottom-3 left-3 text-white">
                                <h3 className="text-sm font-bold leading-tight">{r.name}</h3>
                              </div>
                            </div>
                            <div className="px-3 py-2 flex items-center justify-between bg-white">
                              <span className="text-xs text-gray-500">{count} event{count !== 1 ? "s" : ""}</span>
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
                  <h2 className="text-lg font-semibold text-gray-700 mb-5">Clinical &amp; Professional Development Conferences</h2>
                  <FilterRow
                    filters={filters}
                    onToggle={toggleFilter}
                    onClear={clearFilters}
                    availableYears={availableYears}
                    availableMonths={availableMonths}
                    showRegions={true}
                  />
                  <p className="text-sm text-gray-500 mb-8">
                    {totalVisible} conference{totalVisible !== 1 ? "s" : ""} shown
                  </p>

                  {regionConfig.map((r) => {
                    const conferences = getConferencesForRegion(r.id);
                    return (
                      <section key={r.id} id={`conf-${r.id}`} className="mb-16 scroll-mt-28">
                        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-200">
                          <span className="text-3xl">{r.flag}</span>
                          <h3 className="text-2xl md:text-3xl font-bold text-gray-900">{r.name}</h3>
                          <Link to={`/cpd/${r.id}`} className="ml-auto text-sm text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1">
                            View region page
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                        </div>
                        {conferences.length === 0 ? (
                          <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-gray-400 text-sm">
                            No conferences match the current filters in this region.
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {conferences.map((conf, i) => (
                              <ConferenceCard key={`${conf.title}|${conf.dates}`} conf={conf} />
                            ))}
                          </div>
                        )}
                      </section>
                    );
                  })}
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
