import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import SharedHeader from "./SharedHeader";
import SharedFooter from "./SharedFooter";
import { sectionColor } from "../data/searchIndex";

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
                <div key={result.navPath ?? result.url ?? i} className="bg-white rounded-xl border border-gray-100 p-5 hover:border-blue-200 hover:shadow-sm transition-colors flex flex-col">
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
      <SharedFooter />
    </div>
  );
};

export default SearchResults;
