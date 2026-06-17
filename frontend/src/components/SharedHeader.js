import React, { useState, useRef, useEffect, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { sectionColor } from "../data/searchIndex";

const tabs = [
  { id: "overview",  label: "Overview" },
  { id: "countries", label: "Countries & Licensing" },
  { id: "cpd",       label: "CPD & Conferences" },
];

const navLinks = [
  { path: "/training-programs",         label: "Training Programmes" },
  { path: "/internships-residencies",   label: "Internships & Residencies" },
  { path: "/postgraduate-certificates", label: "Postgraduate Certificates" },
];

// activeTab / onTabChange are only passed in from VeterinaryCareerHub.
// On all other pages they are undefined, so tab clicks navigate home.
const SharedHeader = ({ activeTab, onTabChange }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm]         = useState("");
  const [showResults, setShowResults]       = useState(false);
  const [results, setResults]               = useState([]);
  const debounceRef = useRef(null);
  const searchRef   = useRef(null);
  const navigate    = useNavigate();
  const { pathname, hash } = useLocation();

  // Scroll to hash anchor after navigation (handles static pages immediately,
  // dynamic pages handle their own scroll after data loads)
  useEffect(() => {
    if (!hash) return;
    const timer = setTimeout(() => {
      const el = document.querySelector(hash);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 80);
    return () => clearTimeout(timer);
  }, [pathname, hash]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const fetchResults = useCallback((q) => {
    if (!q || q.trim().length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }
    fetch(`/.netlify/functions/search?q=${encodeURIComponent(q.trim())}`)
      .then((res) => res.ok ? res.json() : [])
      .then((data) => {
        setResults(data);
        setShowResults(true);
      })
      .catch(() => {
        setResults([]);
      });
  }, []);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    clearTimeout(debounceRef.current);
    if (val.trim().length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }
    debounceRef.current = setTimeout(() => fetchResults(val), 250);
  };

  const handleTabClick = (id) => {
    setMobileMenuOpen(false);
    if (onTabChange) {
      onTabChange(id);
    } else {
      navigate(`/?tab=${id}`);
    }
  };

  const handleResultClick = (result) => {
    setShowResults(false);
    setSearchTerm("");
    setResults([]);
    navigate(result.navPath);
  };

  const isActiveTab  = (id)   => !!onTabChange && activeTab === id;
  const isActiveLink = (path) => pathname === path;

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      {/* Top row — logo + search + hamburger */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 py-3">

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 flex-shrink-0">
            <img src="/favicon.svg" alt="VetNextStep logo" className="w-9 h-9 flex-shrink-0" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">VetNextStep</h1>
              <p className="hidden sm:block text-xs text-gray-500">Your Veterinary Career Progression</p>
            </div>
          </Link>

          {/* Search bar */}
          <div className="flex-1 max-w-xl relative" ref={searchRef}>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search programmes, providers, conferences…"
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={() => searchTerm.trim().length >= 2 && setShowResults(true)}
                className="w-full pl-9 pr-3 py-2 text-sm text-gray-900 placeholder-gray-400 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-400 focus:ring-1 focus:ring-blue-400 focus:outline-none transition-colors"
              />
              {searchTerm && (
                <button
                  onClick={() => { setSearchTerm(""); setResults([]); setShowResults(false); }}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Results dropdown */}
            {showResults && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 max-h-96 overflow-y-auto">
                {results.length === 0 ? (
                  <div className="px-4 py-6 text-center text-sm text-gray-400">
                    No results found for <span className="font-medium text-gray-600">"{searchTerm}"</span>
                  </div>
                ) : (
                  <>
                    <div className="px-3 pt-2 pb-1 text-xs text-gray-400 font-medium border-b border-gray-50">
                      {results.length} result{results.length !== 1 ? "s" : ""}
                    </div>
                    {results.map((result, i) => (
                      <button
                        key={i}
                        onClick={() => handleResultClick(result)}
                        className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors border-b border-gray-50 last:border-0"
                      >
                        <div className="flex items-start gap-2">
                          <span className={`mt-0.5 flex-shrink-0 px-1.5 py-0.5 rounded text-xs font-medium ${sectionColor[result.section] || "bg-gray-100 text-gray-600"}`}>
                            {result.section}
                          </span>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900 leading-snug truncate">{result.title}</p>
                            <p className="text-xs text-blue-600 truncate">{result.subtitle}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Hamburger — mobile only */}
          <button
            className="md:hidden flex-shrink-0 p-2 rounded-lg text-gray-700 hover:bg-gray-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Bottom row — nav */}
      <div className="border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="hidden md:flex">
            {tabs.map((tab, i) => (
              <React.Fragment key={tab.id}>
                {i > 0 && <div className="w-px bg-gray-200 my-2" />}
                <button
                  onClick={() => handleTabClick(tab.id)}
                  className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    isActiveTab(tab.id)
                      ? "border-blue-700 text-blue-700"
                      : "border-transparent text-gray-600 hover:text-blue-700 hover:border-blue-300"
                  }`}
                >
                  {tab.label}
                </button>
              </React.Fragment>
            ))}
            <div className="w-px bg-gray-200 my-2" />
            {navLinks.map((link, i) => (
              <React.Fragment key={link.path}>
                {i > 0 && <div className="w-px bg-gray-200 my-2" />}
                <Link
                  to={link.path}
                  className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    isActiveLink(link.path)
                      ? "border-blue-700 text-blue-700"
                      : "border-transparent text-gray-600 hover:text-blue-700 hover:border-blue-300"
                  }`}
                >
                  {link.label}
                </Link>
              </React.Fragment>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <nav className="md:hidden border-t border-gray-100 py-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors border-l-2 ${
                isActiveTab(tab.id)
                  ? "border-blue-700 text-blue-700 bg-blue-50"
                  : "border-transparent text-gray-700 hover:bg-gray-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
          <div className="border-t border-gray-100 my-1" />
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-3 text-sm font-medium border-l-2 transition-colors ${
                isActiveLink(link.path)
                  ? "border-blue-700 text-blue-700 bg-blue-50"
                  : "border-transparent text-gray-700 hover:bg-gray-50"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
};

export default SharedHeader;
