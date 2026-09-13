import React, { useState, useRef, useEffect, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { sectionColor, labelFor } from "../data/searchIndex";
import { counts } from "../data/counts";

// The mega-menu is the only place the full inventory of the site is listed.
// Nothing else — homepage, footer, section pages — repeats it.
const MENU = [
  {
    label: "Countries & Licensing",
    columns: [
      {
        heading: "Choose a country",
        items: [
          { label: "United Kingdom", to: "/uk",        note: "RCVS · 3–6 months"     },
          { label: "United States",  to: "/usa",       note: "NAVLE · ECFVG or PAVE" },
          { label: "Canada",         to: "/canada",    note: "NAVLE · provincial licensing" },
          { label: "Australia",      to: "/australia", note: "AVBC · state registration"    },
        ],
      },
      {
        heading: "Work out your route",
        items: [
          { label: "Licensing route finder", to: "/licensing-route", note: "6 origins · 4 destinations" },
          { label: "Compare countries side by side", to: "/countries" },
          { label: "First role in the UK", to: "/uk/first-role" },
        ],
      },
      {
        heading: "Official bodies",
        items: [
          { label: "RCVS registration", href: "https://www.rcvs.org.uk/registration/" },
          { label: "ICVA — NAVLE",      href: "https://www.icva.net/navle/" },
          { label: "AVMA guidance for foreign graduates", href: "https://www.avma.org/education/foreign/information-foreign-veterinary-graduates-working-veterinarian-us" },
          { label: "Useful resources by country", to: "/resources" },
        ],
      },
    ],
  },
  {
    label: "CPD & Conferences",
    columns: [
      {
        heading: "Conferences",
        items: [
          { label: "All conferences in date order", to: "/cpd", note: `${counts.conferences} events, ${counts.conferenceYearFrom}–${counts.conferenceYearTo}` },
          { label: "United Kingdom", to: "/cpd/uk" },
          { label: "United States",  to: "/cpd/usa" },
          { label: "Europe",         to: "/cpd/europe" },
        ],
      },
      {
        heading: "CPD providers",
        items: [
          { label: "All providers", to: "/cpd/providers", note: `${counts.providers} providers · ${counts.providerRegions} regions` },
          { label: "United Kingdom", to: "/cpd/providers/uk" },
          { label: "United States",  to: "/cpd/providers/usa" },
          { label: "Australia",      to: "/cpd/providers/australia" },
        ],
      },
      {
        heading: "Closing soon",
        items: [
          { label: "Deadlines on the homepage", to: "/" },
        ],
      },
    ],
  },
  {
    label: "Training & Qualifications",
    columns: [
      {
        heading: "New graduate",
        items: [
          { label: "Graduate development programmes", to: "/training-programs", note: `${counts.training} listed` },
          { label: "RCVS VetGDP", href: "https://www.rcvs.org.uk/lifelong-learning/veterinary-graduate-development-programme-vetgdp/" },
        ],
      },
      {
        heading: "Internships and residencies",
        items: [
          { label: "All posts", to: "/internships-residencies", note: `${counts.internships} listed` },
          { label: "United Kingdom", to: "/internships-residencies/uk" },
          { label: "North America",  to: "/internships-residencies/north-america" },
          { label: "VIRMP — the MATCH", href: "https://www.virmp.org/" },
        ],
      },
      {
        heading: "Postgraduate certificate",
        items: [
          { label: "All certificates", to: "/postgraduate-certificates", note: `${counts.certificates} listed · Level 7` },
          { label: "United Kingdom", to: "/postgraduate-certificates/uk" },
        ],
      },
    ],
  },
  {
    label: "Jobs & Resources",
    columns: [
      { heading: "Jobs",      items: [{ label: "Job opportunities", to: "/jobs" }] },
      { heading: "Resources", items: [{ label: "Useful resources by country", to: "/resources" }] },
      { heading: "About",     items: [{ label: "About VetNextStep", to: "/about" }, { label: "Contact", to: "/contact" }] },
    ],
  },
];

const Caret = () => (
  <svg width="9" height="6" viewBox="0 0 9 6" aria-hidden="true" className="opacity-50">
    <path d="M1 1l3.5 3.5L8 1" stroke="currentColor" strokeWidth="1.5" fill="none" />
  </svg>
);

const MenuItem = ({ item }) => {
  const cls = "block text-sm text-blue-800 underline underline-offset-2 decoration-blue-200 hover:decoration-blue-800";
  return (
    <li className="pb-1.5">
      {item.to
        ? <Link to={item.to} className={cls}>{item.label}</Link>
        : <a href={item.href} target="_blank" rel="noopener noreferrer" className={cls}>{item.label}</a>}
      {item.note && <span className="block text-xs text-gray-500">{item.note}</span>}
    </li>
  );
};

const SharedHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openMenu, setOpenMenu]             = useState(null);
  const [searchTerm, setSearchTerm]         = useState("");
  const [showResults, setShowResults]       = useState(false);
  const [results, setResults]               = useState([]);
  const debounceRef = useRef(null);
  const searchRef   = useRef(null);
  const menuRef     = useRef(null);
  const navigate    = useNavigate();
  const { pathname, hash } = useLocation();

  // Scroll to hash anchor after navigation (static pages handle it here;
  // data-backed pages scroll themselves once their data has loaded).
  useEffect(() => {
    if (!hash) return;
    const timer = setTimeout(() => {
      const el = document.querySelector(hash);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 80);
    return () => clearTimeout(timer);
  }, [pathname, hash]);

  // Close the mega-menu and the search dropdown on an outside click.
  useEffect(() => {
    const handleClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowResults(false);
      if (menuRef.current   && !menuRef.current.contains(e.target))   setOpenMenu(null);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Escape closes whatever is open.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      setOpenMenu(null);
      setShowResults(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Changing page closes the menu.
  useEffect(() => { setOpenMenu(null); setMobileMenuOpen(false); }, [pathname]);

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

  const goToSearchPage = (q) => {
    setShowResults(false);
    setSearchTerm("");
    setResults([]);
    navigate(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  const handleResultClick = () => goToSearchPage(searchTerm);

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter" && searchTerm.trim().length >= 2) goToSearchPage(searchTerm);
  };

  return (
    <header className="bg-white">
      {/* Utility bar — the caveat belongs where it is read, not in the footer */}
      <div className="bg-navy text-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex flex-wrap justify-between gap-x-5 gap-y-1 text-xs">
          <span>Information is not real-time — verify with the relevant regulatory body before you act on it.</span>
          <span className="space-x-3">
            <Link to="/about"   className="underline underline-offset-2 hover:text-white">About</Link>
            <Link to="/contact" className="underline underline-offset-2 hover:text-white">Contact</Link>
          </span>
        </div>
      </div>

      {/* Mark and search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 py-3">
          <Link to="/" className="flex items-center gap-3 flex-shrink-0">
            <img src="/favicon.svg" alt="" className="w-10 h-10 flex-shrink-0" />
            <span>
              <span className="block text-xl font-bold text-gray-900 leading-tight tracking-tight">VetNextStep</span>
              <span className="hidden sm:block text-xs text-gray-500">Veterinary career progression</span>
            </span>
          </Link>

          <div className="flex-1 max-w-md ml-auto relative" ref={searchRef}>
            <div className="flex border-[1.5px] border-navy">
              <input
                type="text"
                placeholder="Search programmes, providers, conferences…"
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyDown={handleSearchKeyDown}
                onFocus={() => searchTerm.trim().length >= 2 && setShowResults(true)}
                aria-label="Search the site"
                className="flex-1 min-w-0 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-inset focus:ring-blue-800"
              />
              <button
                type="button"
                onClick={() => searchTerm.trim().length >= 2 && goToSearchPage(searchTerm)}
                className="bg-navy text-white px-4 text-sm font-medium hover:bg-[#0f3a63]"
              >
                Search
              </button>
            </div>

            {showResults && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white shadow-2xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
                {results.length === 0 ? (
                  <div className="px-4 py-6 text-center text-sm text-gray-500">
                    No results found for <span className="font-medium text-gray-900">"{searchTerm}"</span>
                  </div>
                ) : (
                  <>
                    <div className="px-3 pt-2 pb-1 text-xs text-gray-500 font-medium border-b border-gray-100">
                      {results.length} result{results.length !== 1 ? "s" : ""}
                    </div>
                    {results.map((result, i) => (
                      <button
                        key={i}
                        onClick={handleResultClick}
                        className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-0"
                      >
                        <div className="flex items-start gap-2">
                          <span className={`mt-0.5 flex-shrink-0 px-1.5 py-0.5 text-xs font-medium ${sectionColor[result.section] || "bg-gray-100 text-gray-600"}`}>
                            {labelFor(result.section)}
                          </span>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900 leading-snug truncate">{result.title}</p>
                            <p className="text-xs text-gray-500 truncate">{result.subtitle}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>

          <button
            className="md:hidden flex-shrink-0 p-2 text-gray-700 hover:bg-gray-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </div>

      {/* Mega-menu */}
      <div ref={menuRef} className="relative">
        <div className="bg-blue-50 border-t border-b border-gray-200 hidden md:block">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ul className="flex overflow-x-auto">
              {MENU.map((m, i) => (
                <li key={m.label} className="flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => setOpenMenu(openMenu === i ? null : i)}
                    aria-expanded={openMenu === i}
                    className={`flex items-center gap-2 px-4 py-3 text-sm whitespace-nowrap border-b-[3px] ${
                      openMenu === i
                        ? "bg-white border-blue-800 font-semibold text-gray-900"
                        : "border-transparent text-gray-800 hover:bg-blue-100"
                    }`}
                  >
                    {m.label} <Caret />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Every panel stays in the DOM and is toggled with a class. Rendering
            them conditionally would leave the site with no internal links for
            crawlers or the react-snap prerender to follow. */}
        {MENU.map((m, i) => (
          <div
            key={m.label}
            className={`absolute left-0 right-0 bg-white border-b border-gray-200 shadow-xl z-40 ${
              openMenu === i ? "hidden md:block" : "hidden"
            }`}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 grid grid-cols-3 gap-8">
              {m.columns.map((col) => (
                <div key={col.heading}>
                  <h3 className="text-xs font-semibold text-gray-500 pb-2 mb-2 border-b border-gray-200">{col.heading}</h3>
                  <ul>
                    {col.items.map((item) => <MenuItem key={item.label} item={item} />)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Mobile: the same inventory, stacked */}
      {mobileMenuOpen && (
        <nav className="md:hidden border-t border-gray-200 bg-white">
          {MENU.map((m) => (
            <div key={m.label} className="border-b border-gray-100 px-4 py-3">
              <p className="text-sm font-bold text-gray-900 mb-2">{m.label}</p>
              {m.columns.map((col) => (
                <ul key={col.heading} className="mb-2">
                  {col.items.map((item) => <MenuItem key={item.label} item={item} />)}
                </ul>
              ))}
            </div>
          ))}
        </nav>
      )}
    </header>
  );
};

export default SharedHeader;
