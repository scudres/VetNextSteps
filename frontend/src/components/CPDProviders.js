import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { cpdProviderCategoryConfig, cpdTypeOptions } from "../data/cpdProvidersData";
const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const CPDProviders = () => {
  const location = useLocation();
  const [selectedType, setSelectedType] = useState("All Types");
  const [providers, setProviders]       = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);

  // Scroll to anchor after providers finish loading
  useEffect(() => {
    if (loading || !location.hash) return;
    const el = document.querySelector(location.hash);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [loading, location.hash]);

  useEffect(() => {
    fetch("/.netlify/functions/providers")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load providers");
        return res.json();
      })
      .then((data) => {
        setProviders(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const getProvidersForCategory = (categoryId) =>
    providers.filter(
      (p) =>
        p.category === categoryId &&
        (selectedType === "All Types" || p.types.includes(selectedType))
    );

  const totalVisible = cpdProviderCategoryConfig.reduce(
    (acc, c) => acc + getProvidersForCategory(c.id).length,
    0
  );

  return (
    <div>
      {/* Page intro */}
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">CPD Providers & Courses</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          58 providers listed across four categories — UK and international vet schools, commercial platforms, and industry-funded education. Includes Australia and New Zealand. Filter by type to find what suits you.
        </p>
      </div>

      {/* Loading / error states */}
      {loading && (
        <div className="text-center py-20 text-gray-400 text-sm">Loading providers…</div>
      )}
      {error && (
        <div className="text-center py-20 text-red-500 text-sm">
          Could not load provider data. Please refresh the page.
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Category nav cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
            {cpdProviderCategoryConfig.map((cat) => {
              const count = getProvidersForCategory(cat.id).length;
              return (
                <a key={cat.id} href={`#cpd-${cat.id}`} className="group block">
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-blue-300 hover:shadow-sm transition-colors">
                    <div className="h-32 relative overflow-hidden">
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                      <div className="absolute bottom-3 left-3 text-white">
                        <h3 className="text-sm font-bold leading-tight">{cat.name}</h3>
                      </div>
                    </div>
                    <div className="px-3 py-2 flex items-center justify-between">
                      <span className="text-xs text-gray-500">{count} provider{count !== 1 ? "s" : ""}</span>
                      <span className="text-blue-600 text-xs font-medium group-hover:translate-x-1 transition-transform inline-flex items-center">
                        View
                        <svg className="ml-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>

          {/* Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8 items-start sm:items-center">
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Filter by type:</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 bg-white focus:border-blue-400 focus:ring-1 focus:ring-blue-400 focus:outline-none"
              >
                {cpdTypeOptions.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <span className="text-sm text-gray-500">
              {totalVisible} provider{totalVisible !== 1 ? "s" : ""} shown
              {selectedType !== "All Types" && (
                <>
                  {" "}for <span className="font-medium text-blue-700">{selectedType}</span>
                  <button
                    onClick={() => setSelectedType("All Types")}
                    className="ml-2 text-xs text-gray-400 hover:text-gray-600 underline"
                  >
                    Clear
                  </button>
                </>
              )}
            </span>
          </div>

          {/* Provider sections by category */}
          {cpdProviderCategoryConfig.map((cat) => {
            const catProviders = getProvidersForCategory(cat.id);
            return (
              <section key={cat.id} id={`cpd-${cat.id}`} className="mb-16 scroll-mt-28">
                <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-200">
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900">{cat.name}</h3>
                  <span className="ml-auto text-sm text-gray-400">
                    {catProviders.length} provider{catProviders.length !== 1 ? "s" : ""}
                  </span>
                </div>

                {catProviders.length === 0 ? (
                  <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-gray-400 text-sm">
                    No providers found for <span className="font-medium">{selectedType}</span> in this category.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {catProviders.map((p, idx) => (
                      <div key={idx} id={slugify(p.provider)} className="bg-white rounded-xl border border-gray-100 p-6 hover:border-blue-200 hover:shadow-sm transition-colors flex flex-col scroll-mt-28">
                        {/* Type badges */}
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {p.types.map((t) => (
                            <span key={t} className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">{t}</span>
                          ))}
                        </div>

                        {/* Provider & programme */}
                        <h4 className="text-base font-semibold text-gray-900 mb-1 leading-snug">{p.provider}</h4>
                        <p className="text-sm text-blue-600 font-medium mb-3">{p.programme}</p>

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
                            <svg className="ml-2 w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        </>
      )}
    </div>
  );
};

export default CPDProviders;
