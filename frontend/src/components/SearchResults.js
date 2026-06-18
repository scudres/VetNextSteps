import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import SharedHeader from "./SharedHeader";
import { sectionColor } from "../data/searchIndex";

const sectionIcon = {
  "Graduate Development Programmes":       "M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z",
  "Internships & Residencies": "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 00-1-1h-2a1 1 0 00-1 1v5m4 0H9",
  "Postgraduate Certificates": "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z",
  "Conferences":               "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  "CPD Providers":             "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
};

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") || "";
  const [results, setResults]   = useState([]);
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    if (q.trim().length < 2) { setResults([]); return; }
    setLoading(true);
    fetch(`/.netlify/functions/search?q=${encodeURIComponent(q.trim())}`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => { setResults(data); setLoading(false); })
      .catch(() => { setResults([]); setLoading(false); });
  }, [q]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>{q ? `"${q}" — Search | VetNextStep` : "Search | VetNextStep"}</title>
      </Helmet>
      <SharedHeader />

      <main className="py-10 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
              {q ? <>Results for <span className="text-blue-700">"{q}"</span></> : "Search"}
            </h1>
            {!loading && results.length > 0 && (
              <p className="text-sm text-gray-500">{results.length} result{results.length !== 1 ? "s" : ""} found</p>
            )}
          </div>

          {/* Loading */}
          {loading && (
            <div className="text-center py-24 text-gray-400 text-sm">Searching…</div>
          )}

          {/* No results */}
          {!loading && q.trim().length >= 2 && results.length === 0 && (
            <div className="text-center py-24">
              <svg className="mx-auto h-12 w-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-gray-600 font-medium mb-1">No results for "{q}"</p>
              <p className="text-sm text-gray-400">Try an organisation name, country, discipline, or keyword.</p>
            </div>
          )}

          {/* Results */}
          {!loading && results.length > 0 && (
            <div className="space-y-3">
              {results.map((result, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 hover:border-blue-200 hover:shadow-sm transition-colors flex flex-col">
                  {/* Section badge */}
                  <span className={`inline-block self-start px-2 py-0.5 rounded text-xs font-medium mb-2 ${sectionColor[result.section] || "bg-gray-100 text-gray-600"}`}>
                    {result.section}
                  </span>

                  {/* Title & subtitle */}
                  <h2 className="text-base font-semibold text-gray-900 leading-snug mb-0.5">{result.title}</h2>
                  <p className="text-sm text-blue-600 font-medium mb-2">{result.subtitle}</p>

                  {/* Description */}
                  {result.description && (
                    <p className="text-xs text-gray-500 leading-relaxed mb-4">{result.description}</p>
                  )}

                  {/* Visit button */}
                  <div className="mt-auto pt-2">
                    {result.url ? (
                      <a
                        href={result.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        Visit website
                        <svg className="ml-2 w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    ) : (
                      <Link
                        to={result.navPath}
                        className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        View on VetNextStep
                        <svg className="ml-2 w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default SearchResults;
