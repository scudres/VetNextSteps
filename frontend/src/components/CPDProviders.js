import React, { useState, useEffect, useMemo } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import SharedHeader from "./SharedHeader";
import SharedFooter from "./SharedFooter";
import FilterDropdown from "./FilterDropdown";
import { providerCountryConfig, providerSpecialtyOptions, cpdTypeOptions } from "../data/cpdProvidersData";
import { slugify } from "../utils";

// ——— Shared primitives ———
const BackChevron = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const ForwardChevron = () => (
  <svg className="ml-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg className="ml-2 w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

// ——— Provider card ———
const ProviderCard = ({ p }) => (
  <div
    id={slugify(p.provider)}
    className="bg-white rounded-xl border border-gray-100 p-6 hover:border-blue-200 hover:shadow-sm transition-colors flex flex-col scroll-mt-28"
  >
    {/* Type badges */}
    <div className="flex flex-wrap gap-1.5 mb-3">
      {p.types.map((t) => (
        <span key={t} className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">{t}</span>
      ))}
    </div>

    {/* Provider & programme */}
    <h4 className="text-base font-semibold text-gray-900 mb-1 leading-snug">{p.provider}</h4>
    <p className="text-sm text-blue-600 font-medium mb-3">{p.programme}</p>

    {/* Specialty tags */}
    {p.specialties && p.specialties.length > 0 && (
      <div className="flex flex-wrap gap-1 mb-3">
        {p.specialties.map((s) => (
          <span key={s} className="px-2 py-0.5 bg-green-50 text-green-700 rounded text-xs font-medium">{s}</span>
        ))}
      </div>
    )}

    {/* Location */}
    <div className="flex items-start gap-2 text-sm text-gray-600 mb-4">
      <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
      <span>{p.location}</span>
    </div>

    {/* Notes */}
    {p.notes && (
      <p className="text-xs text-gray-500 italic mb-4 leading-relaxed">{p.notes}</p>
    )}

    {/* Visit button */}
    <div className="mt-auto">
      <a
        href={p.website}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
      >
        Visit Website
        <ExternalLinkIcon />
      </a>
    </div>
  </div>
);

// ——— Hub page ———
const HubPage = ({ allProviders, loading, error }) => (
  <div className="min-h-screen bg-white">
    <Helmet>
      <title>Veterinary CPD Providers & Online Courses | VetNextStep</title>
      <meta name="description" content="Find CPD providers, online courses, certificates and training across the UK, USA, Australia, New Zealand and more. Filter by specialty or format." />
      <link rel="canonical" href="https://vetnextstep.com/cpd/providers" />
      <meta property="og:title" content="Veterinary CPD Providers &amp; Online Courses | VetNextStep" />
      <meta property="og:description" content="Find CPD providers, online courses and training for vets across the UK, USA, Australia, New Zealand, and more — filter by specialty or format." />
      <meta property="og:url" content="https://vetnextstep.com/cpd/providers" />
      <meta property="og:image" content="https://vetnextstep.com/og-image.png" />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Veterinary CPD Providers &amp; Online Courses | VetNextStep" />
      <meta name="twitter:description" content="CPD providers, online courses and training for vets — filter by specialty or format." />
      <meta name="twitter:image" content="https://vetnextstep.com/og-image.png" />
    </Helmet>
    <SharedHeader />
    <main className="py-8 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link to="/cpd" className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center gap-1">
            <BackChevron />
            CPD & Conferences
          </Link>
        </div>

        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">CPD Providers & Courses</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Vet schools, commercial platforms and industry-funded education — browse by country or region.
          </p>
        </div>

        {loading && <div className="text-center py-20 text-gray-400 text-sm">Loading providers…</div>}
        {error   && <div className="text-center py-20 text-red-500 text-sm">Could not load provider data. Please refresh the page.</div>}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {providerCountryConfig.map((c) => {
              const count = allProviders.filter((p) => p.country === c.id).length;
              return (
                <Link key={c.id} to={`/cpd/providers/${c.id}`} className="group block">
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-blue-300 hover:shadow-md transition-all">
                    <div className="h-32 relative overflow-hidden">
                      <img
                        src={c.image}
                        alt={c.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                      <div className="absolute bottom-3 left-3 text-white">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{c.flag}</span>
                          <h3 className="text-sm font-bold leading-tight">{c.name}</h3>
                        </div>
                      </div>
                    </div>
                    <div className="px-3 py-2 flex items-center justify-between bg-white">
                      <span className="text-xs text-gray-500">{count} provider{count !== 1 ? "s" : ""}</span>
                      <span className="text-blue-600 text-xs font-medium group-hover:translate-x-1 transition-transform inline-flex items-center">
                        View all <ForwardChevron />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
    <SharedFooter />
  </div>
);

// ——— Country sub-page ———
const splitParam = (v) => (v ? v.split(",").filter(Boolean) : []);

const CountrySubPage = ({ country, allProviders, loading, error }) => {
  const cfg = providerCountryConfig.find((c) => c.id === country);

  // Filter state lives in the URL so any filtered view is a shareable link,
  // e.g. /cpd/providers/uk?specialty=Cardiology&format=Webinar.
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedSpecialties = useMemo(() => splitParam(searchParams.get("specialty")), [searchParams]);
  const selectedTypes       = useMemo(() => splitParam(searchParams.get("format")),    [searchParams]);

  const setParam = (key, arr) => {
    const params = new URLSearchParams(searchParams);
    if (arr.length > 0) params.set(key, arr.join(","));
    else params.delete(key);
    setSearchParams(params, { replace: true });
  };
  const toggleSpecialty = (s) =>
    setParam("specialty", selectedSpecialties.includes(s)
      ? selectedSpecialties.filter((x) => x !== s) : [...selectedSpecialties, s]);
  const toggleType = (t) =>
    setParam("format", selectedTypes.includes(t)
      ? selectedTypes.filter((x) => x !== t) : [...selectedTypes, t]);
  const clearFilters = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("specialty");
    params.delete("format");
    setSearchParams(params, { replace: true });
  };
  const activeCount   = selectedSpecialties.length + selectedTypes.length;

  const countryProviders = useMemo(() => {
    if (!allProviders.length) return [];
    return allProviders.filter((p) => {
      if (p.country !== country) return false;
      if (selectedSpecialties.length > 0 && !p.specialties?.some((s) => selectedSpecialties.includes(s))) return false;
      if (selectedTypes.length       > 0 && !p.types.some((t) => selectedTypes.includes(t)))             return false;
      return true;
    });
  }, [allProviders, country, selectedSpecialties, selectedTypes]);

  if (!cfg) {
    return (
      <div className="min-h-screen bg-white">
        <SharedHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <p className="text-gray-500">Country not found.</p>
          <Link to="/cpd/providers" className="text-blue-600 hover:underline mt-4 inline-block">
            Back to CPD Providers
          </Link>
        </div>
        <SharedFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>{`${cfg.name} Veterinary CPD Providers | VetNextStep`}</title>
        <meta name="description" content={`CPD providers, online courses and education for vets in ${cfg.name}. Filter by specialty or format.`} />
        <link rel="canonical" href={`https://vetnextstep.com/cpd/providers/${country}`} />
        <meta property="og:title" content={`${cfg.name} Veterinary CPD Providers | VetNextStep`} />
        <meta property="og:description" content={`CPD providers, online courses and education for vets in ${cfg.name} — filter by specialty or format.`} />
        <meta property="og:url" content={`https://vetnextstep.com/cpd/providers/${country}`} />
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
            <Link to="/cpd/providers" className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center gap-1">
              <BackChevron />
              All CPD Providers
            </Link>
          </div>

          {/* Country header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-4xl">{cfg.flag}</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{cfg.name}</h2>
            </div>
            <p className="text-gray-500 text-lg">Veterinary CPD providers and online education</p>
          </div>

          {loading && <div className="text-center py-20 text-gray-400 text-sm">Loading providers…</div>}
          {error   && <div className="text-center py-20 text-red-500 text-sm">Could not load provider data. Please refresh the page.</div>}

          {!loading && !error && (
            <>
              {/* Filters */}
              <div className="flex flex-wrap gap-2 mb-4 items-center">
                <FilterDropdown
                  label="Speciality"
                  options={providerSpecialtyOptions}
                  selected={selectedSpecialties}
                  onToggle={toggleSpecialty}
                />
                <FilterDropdown
                  label="Format"
                  options={cpdTypeOptions}
                  selected={selectedTypes}
                  onToggle={toggleType}
                />
                {activeCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 underline underline-offset-2"
                  >
                    Clear all ({activeCount})
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-500 mb-8">
                {countryProviders.length} provider{countryProviders.length !== 1 ? "s" : ""} shown
              </p>

              {countryProviders.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-100 p-12 text-center text-gray-400 text-sm">
                  No providers match the current filters.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {countryProviders.map((p) => (
                    <ProviderCard key={p.provider} p={p} />
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
};

// ——— Root component ———
const CPDProviders = () => {
  const { country } = useParams();
  const [allProviders, setAllProviders] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);

  useEffect(() => {
    fetch("/data/providers.json")
      .then((res) => { if (!res.ok) throw new Error("Failed to load providers"); return res.json(); })
      .then((data) => { setAllProviders(data); setLoading(false); })
      .catch((err) => { setError(err.message); setLoading(false); });
  }, []);

  if (country) {
    return <CountrySubPage country={country} allProviders={allProviders} loading={loading} error={error} />;
  }
  return <HubPage allProviders={allProviders} loading={loading} error={error} />;
};

export default CPDProviders;
