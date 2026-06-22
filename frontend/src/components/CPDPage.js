import React, { useState, useEffect } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import SharedHeader from "./SharedHeader";
import CPDProviders from "./CPDProviders";
import SharedFooter from "./SharedFooter";
import { specialtyOptions, regionConfig, parseSortDate } from "../data/conferencesData";

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const ConferenceCard = ({ conf }) => (
  <div id={slugify(conf.title)} className="bg-white rounded-xl border border-gray-100 p-6 hover:border-blue-200 hover:shadow-sm transition-colors flex flex-col scroll-mt-28">
    <div className="flex flex-wrap gap-1.5 mb-3">
      {conf.specialties.map((s) => (
        <span key={s} className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">{s}</span>
      ))}
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

const CPDPage = () => {
  const { region } = useParams();
  const location = useLocation();
  const urlSection = new URLSearchParams(location.search).get("section");
  const [activeSection, setActiveSection] = useState(urlSection === "providers" ? "providers" : "conferences");

  // Keep in sync if URL changes while mounted
  useEffect(() => {
    const s = new URLSearchParams(location.search).get("section");
    if (s === "providers" || s === "conferences") setActiveSection(s);
  }, [location.search]);
  const [selectedSpecialty, setSelectedSpecialty] = useState("All Specialties");
  const [allConferences, setAllConferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/.netlify/functions/conferences")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load conferences");
        return res.json();
      })
      .then((data) => {
        setAllConferences(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Scroll to anchor after data loads
  useEffect(() => {
    if (loading || !location.hash) return;
    const el = document.querySelector(location.hash);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [loading, location.hash]);

  const getConferencesForRegion = (regionId) =>
    allConferences
      .filter(
        (c) =>
          c.regions.includes(regionId) &&
          (selectedSpecialty === "All Specialties" || c.specialties.includes(selectedSpecialty))
      )
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

    const regionConferences = getConferencesForRegion(region);

    return (
      <div className="min-h-screen bg-white">
        <Helmet>
          <title>{cfg.name} Veterinary Conferences | VetNextStep</title>
          <meta name="description" content={`Veterinary conferences and CPD events in ${cfg.name}. Filter by specialty and find upcoming events.`} />
          <link rel="canonical" href={`https://vetnextstep.com/cpd/${region}`} />
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
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl">{cfg.flag}</span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{cfg.name}</h2>
              </div>
              <p className="text-gray-500 text-lg">Upcoming veterinary conferences and congresses</p>
            </div>

            {/* Loading / error */}
            {loading && <div className="text-center py-20 text-gray-400 text-sm">Loading conferences…</div>}
            {error && <div className="text-center py-20 text-red-500 text-sm">Could not load conference data. Please refresh the page.</div>}

            {!loading && !error && (
              <>
                {/* Specialty filter */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8 items-start sm:items-center">
                  <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Filter by specialty:</label>
                    <select
                      value={selectedSpecialty}
                      onChange={(e) => setSelectedSpecialty(e.target.value)}
                      className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 bg-white focus:border-blue-400 focus:ring-1 focus:ring-blue-400 focus:outline-none"
                    >
                      {specialtyOptions.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <span className="text-sm text-gray-500">
                    {regionConferences.length} event{regionConferences.length !== 1 ? "s" : ""} shown
                    {selectedSpecialty !== "All Specialties" && (
                      <>
                        {" "}for <span className="font-medium text-blue-700">{selectedSpecialty}</span>
                        <button
                          onClick={() => setSelectedSpecialty("All Specialties")}
                          className="ml-2 text-xs text-gray-400 hover:text-gray-600 underline"
                        >
                          Clear
                        </button>
                      </>
                    )}
                  </span>
                </div>

                {regionConferences.length === 0 ? (
                  <div className="bg-white rounded-xl border border-gray-100 p-12 text-center text-gray-400 text-sm">
                    No conferences found{selectedSpecialty !== "All Specialties" ? ` for ${selectedSpecialty}` : ""} in this region.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {regionConferences.map((conf, i) => (
                      <ConferenceCard key={i} conf={conf} />
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
  const totalVisible = regionConfig.reduce(
    (acc, r) => acc + getConferencesForRegion(r.id).length,
    0
  );

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Vet Conferences &amp; CPD Events 2026 | By Region</title>
        <meta name="description" content="Upcoming veterinary conferences in the UK, USA, Australia, New Zealand and Europe. Filter by specialty or browse CPD providers and online courses." />
        <link rel="canonical" href="https://vetnextstep.com/cpd" />
      </Helmet>
      <SharedHeader />
      <main className="py-8 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page title */}
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">CPD & Conferences</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Conferences sorted by date — filter by specialty or browse by region. CPD providers and online courses are listed under the second tab.
            </p>
          </div>

          {/* Section tabs */}
          <div className="flex border-b border-gray-200 mb-10 -mt-2">
            {[
              { id: "conferences", label: "Conferences & Congresses" },
              { id: "providers",   label: "CPD Providers & Courses" },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
                  activeSection === s.id
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* ——— CONFERENCES SECTION ——— */}
          {activeSection === "conferences" && (
            <div>
              {loading && <div className="text-center py-20 text-gray-400 text-sm">Loading conferences…</div>}
              {error && <div className="text-center py-20 text-red-500 text-sm">Could not load conference data. Please refresh the page.</div>}

              {!loading && !error && (
                <>
                  {/* Region cards */}
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
                                alt={r.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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

                  {/* Filters */}
                  <h2 className="text-lg font-semibold text-gray-700 mb-5">Clinical &amp; Professional Development Conferences</h2>
                  <div className="flex flex-col sm:flex-row gap-4 mb-8 items-start sm:items-center">
                    <div className="flex items-center gap-3">
                      <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Filter by specialty:</label>
                      <select
                        value={selectedSpecialty}
                        onChange={(e) => setSelectedSpecialty(e.target.value)}
                        className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 bg-white focus:border-blue-400 focus:ring-1 focus:ring-blue-400 focus:outline-none"
                      >
                        {specialtyOptions.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                    <span className="text-sm text-gray-500">
                      {totalVisible} conference{totalVisible !== 1 ? "s" : ""} shown
                      {selectedSpecialty !== "All Specialties" && (
                        <>
                          {" "}for <span className="font-medium text-blue-700">{selectedSpecialty}</span>
                          <button
                            onClick={() => setSelectedSpecialty("All Specialties")}
                            className="ml-2 text-xs text-gray-400 hover:text-gray-600 underline"
                          >
                            Clear
                          </button>
                        </>
                      )}
                    </span>
                  </div>

                  {/* All regions listed below */}
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
                            No conferences found for <span className="font-medium">{selectedSpecialty}</span> in this region.
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {conferences.map((conf, i) => (
                              <ConferenceCard key={i} conf={conf} />
                            ))}
                          </div>
                        )}
                      </section>
                    );
                  })}
                </>
              )}
            </div>
          )}

          {/* ——— CPD PROVIDERS SECTION ——— */}
          {activeSection === "providers" && <CPDProviders />}
        </div>
      </main>
      <SharedFooter />
    </div>
  );
};

export default CPDPage;
