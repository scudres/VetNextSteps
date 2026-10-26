import React, { useState, useEffect, useMemo } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import SharedHeader from "./SharedHeader";
import { PathwayRail } from "./PathwayRail";
import SharedFooter from "./SharedFooter";
import { loadData, getCached } from "../dataCache";
import FilterDropdown from "./FilterDropdown";
import FilterSidebar from "./FilterSidebar";
import IndexList from "./IndexList";
import { slugify } from "../utils";

const regionConfig = [
  {
    id: "europe",
    name: "Europe",
  },
  {
    id: "north-america",
    name: "North America",
  },
  {
    id: "uk",
    name: "United Kingdom",
  },
  {
    id: "worldwide",
    name: "Worldwide",
  },
];

// One line on what sits behind each region, where the site already says so.
const REGION_NOTES = {
  europe: "EBVS colleges, university teaching hospitals and corporate groups",
  uk: "EBVS colleges, university teaching hospitals and corporate groups",
  "north-america": "VIRMP positions, which need the NAVLE and state or provincial licensure",
};

// Sub-categories for the regions that split into them.
const subCategoryConfig = {
  europe: [
    {
      id: "college",
      name: "EBVS Specialist Colleges",
      description: "Residency programmes administered by European Board of Veterinary Specialisation (EBVS) member colleges — the recognised route to European diplomate status.",
    },
    {
      id: "university",
      name: "University Teaching Hospitals",
      description: "Rotating internships and residency positions at European veterinary faculties and their accredited teaching hospitals.",
    },
    {
      id: "corporate",
      name: "Corporate Groups & Employers",
      description: "Internships, residencies, and graduate programmes at pan-European corporate veterinary groups and specialist employers.",
    },
  ],
  uk: [
    {
      id: "college",
      name: "EBVS Specialist Colleges",
      description: "Residency programmes at UK training centres affiliated with European Board of Veterinary Specialisation (EBVS) colleges — the recognised route to European diplomate status.",
    },
    {
      id: "university",
      name: "University Teaching Hospitals",
      description: "Rotating internships and specialist residency programmes at UK veterinary schools and their accredited teaching hospitals.",
    },
    {
      id: "corporate",
      name: "Corporate Groups & Referral Centres",
      description: "Internships and residency programmes at the UK's leading corporate veterinary groups and private specialist referral hospitals.",
    },
  ],
};

// Derive sub-category from programme metadata — avoids adding a field to every entry
const getSubCategory = (program) => {
  if (program.region === "europe") {
    if (
      program.organisation.startsWith("European College") ||
      program.organisation.startsWith("European Board") ||
      program.organisation.startsWith("European Veterinary")
    ) return "college";
    // Veterinary faculties and teaching hospitals
    if (
      program.organisation.includes("Universit") ||   // University / Università / Universidade / Universitario
      program.organisation.includes("Hochschule") ||  // TiHo Hannover
      program.organisation.includes("École") ||       // ENVA Alfort
      program.organisation.includes("Hospital Clín") || // UAB / UCM (Clínic / Clínico)
      program.organisation.includes("UCD") ||         // University College Dublin
      program.organisation.includes("Faculdade") ||   // Lisbon FMV
      program.organisation.includes("Ospedale")       // Bologna
    ) return "university";
    // Corporate groups and aggregators (AniCura, IVC Evidensia, European Commission/EURAXESS)
    return "corporate";
  }
  if (program.region === "uk") {
    if (
      program.organisation.startsWith("European College") ||
      program.organisation.startsWith("European Board") ||
      program.organisation.startsWith("European Veterinary")
    ) return "college";
    if (
      program.organisation.includes("University of") ||
      program.organisation.startsWith("Royal Veterinary College")
    ) return "university";
    return "corporate";
  }
  return null;
};

// Specialties relevant to internships & residencies
const SPECIALTY_OPTIONS = [
  "Anaesthesia",
  "Aquatic Medicine",
  "Behaviour & Welfare",
  "Cardiology",
  "Dentistry",
  "Dermatology",
  "Emergency & Critical Care",
  "Endocrinology",
  "Equine",
  "Farm Animal",
  "Imaging",
  "Internal Medicine",
  "Laboratory Animal Medicine",
  "Microbiology",
  "Neurology",
  "Nutrition",
  "Oncology",
  "Ophthalmology",
  "Parasitology",
  "Pathology",
  "Pharmacology & Toxicology",
  "Public Health",
  "Reproduction",
  "Sports Medicine & Rehabilitation",
  "Surgery",
  "Zoological Medicine",
];

const licensingNote = {
  uk: (
    <p className="text-sm text-gray-500 mb-6">
      UK internships and residencies require RCVS registration. Overseas vets will also need a Skilled Worker Visa.{" "}
      <Link to="/uk" className="text-blue-600 hover:text-blue-800 font-medium">See the UK licensing guide →</Link>
    </p>
  ),
  "north-america": (
    <p className="text-sm text-gray-500 mb-6">
      VIRMP positions require NAVLE and state or provincial licensure. See country guides for registration steps:{" "}
      <Link to="/usa" className="text-blue-600 hover:text-blue-800 font-medium">USA</Link>
      {" · "}
      <Link to="/canada" className="text-blue-600 hover:text-blue-800 font-medium">Canada →</Link>
    </p>
  ),
};

const PROGRAM_TYPE_OPTIONS = [
  { value: "rotating",            label: "Rotating Internship"            },
  { value: "discipline-specific", label: "Discipline-Specific Internship" },
  { value: "residency",           label: "Residency"                      },
];

const programMatchesFilters = (p, typeFilters, specialtyFilters) => {
  // Type filter
  if (typeFilters.length > 0) {
    const matchesType = typeFilters.some((ft) => {
      if (ft === "rotating") {
        return p.type === "internship" && (p.internshipType === "rotating" || p.internshipType === "both");
      }
      if (ft === "discipline-specific") {
        return (
          (p.type === "internship" || p.type === "internship & residency") &&
          (p.internshipType === "discipline-specific" || p.internshipType === "both")
        );
      }
      if (ft === "residency") {
        return p.type === "residency" || p.type === "internship & residency";
      }
      return false;
    });
    if (!matchesType) return false;
  }
  // Specialty filter — umbrella entries (empty specialties) always pass
  if (specialtyFilters.length > 0 && p.specialties && p.specialties.length > 0) {
    if (!p.specialties.some((s) => specialtyFilters.includes(s))) return false;
  }
  return true;
};

const ProgramCard = ({ program }) => (
  <div id={slugify(program.title)} className="bg-white border border-gray-100 p-6 hover:border-blue-200 transition-colors scroll-mt-28">
    <p className="text-xs text-gray-600 mb-3">
      <span className="font-bold text-navy capitalize">
        {program.type === "internship" && program.internshipType === "rotating"
          ? "Rotating Internship"
          : program.type === "internship" && program.internshipType === "discipline-specific"
          ? "Discipline-Specific Internship"
          : program.type === "internship" && program.internshipType === "both"
          ? "Rotating & Discipline-Specific Internship"
          : program.type === "internship & residency"
          ? "Internship & Residency"
          : program.type}
      </span>
      <span className="capitalize">, {program.species}</span>
      {program.specialties && program.specialties.length > 0 && <span>, {program.specialties.join(", ")}</span>}
    </p>
    <h3 className="text-lg font-semibold text-gray-900 mb-1">{program.title}</h3>
    <p className="text-sm text-blue-600 font-medium mb-3">{program.organisation}</p>
    <p className="text-gray-600 text-sm leading-relaxed mb-5">{program.description}</p>
    <a
      href={program.url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center border border-navy text-navy hover:bg-navy hover:text-white px-3.5 py-1.5 text-sm font-medium"
    >
      Visit Programme
      <svg className="ml-2 w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
    </a>
  </div>
);

const Spinner = () => (
  <div className="flex justify-center py-16">
    <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
  </div>
);

const splitParam = (v) => (v ? v.split(",").filter(Boolean) : []);

const InternshipsResidencies = () => {
  const { region, subCategory } = useParams();
  const [programs,        setPrograms]        = useState(() => getCached("internships") || []);
  const [loading,         setLoading]         = useState(() => !getCached("internships"));

  // Filter state lives in the URL so any filtered view is a shareable link,
  // e.g. /internships-residencies/uk/university?specialty=Cardiology.
  const [searchParams, setSearchParams] = useSearchParams();
  const typeFilters      = useMemo(() => splitParam(searchParams.get("type")),      [searchParams]);
  const specialtyFilters = useMemo(() => splitParam(searchParams.get("specialty")), [searchParams]);

  useEffect(() => {
    loadData("internships")
      .then((data) => { setPrograms(data); setLoading(false); })
      .catch(() => { setPrograms([]); setLoading(false); });
  }, []);

  const setParam = (key, arr) => {
    const params = new URLSearchParams(searchParams);
    if (arr.length > 0) params.set(key, arr.join(","));
    else params.delete(key);
    setSearchParams(params, { replace: true });
  };
  const toggleType      = (v) => setParam("type",      typeFilters.includes(v)      ? typeFilters.filter((x) => x !== v)      : [...typeFilters, v]);
  const toggleSpecialty = (v) => setParam("specialty", specialtyFilters.includes(v) ? specialtyFilters.filter((x) => x !== v) : [...specialtyFilters, v]);
  const clearFilters    = ()  => {
    const params = new URLSearchParams(searchParams);
    params.delete("type");
    params.delete("specialty");
    setSearchParams(params, { replace: true });
  };
  const activeCount     = typeFilters.length + specialtyFilters.length;

  // ——— Sub-category programme list (e.g. /europe/colleges, /uk/university) ———
  if (region && subCategory) {
    const cfg        = regionConfig.find((r) => r.id === region);
    const subCatCfg  = (subCategoryConfig[region] || []).find((s) => s.id === subCategory);
    // EBVS colleges are pan-European bodies — when viewing UK/college, source from the
    // comprehensive Europe college list rather than the smaller UK-tagged subset.
    const programRegion = (region === "uk" && subCategory === "college") ? "europe" : region;
    const regionPrograms = programs.filter(
      (p) => p.region === programRegion &&
             getSubCategory(p) === subCategory &&
             programMatchesFilters(p, typeFilters, specialtyFilters)
    );

    if (!cfg || !subCatCfg) {
      return (
        <div className="min-h-screen bg-white">
          <SharedHeader />
          <PathwayRail current={3} />
          <main className="py-16 text-center">
            <p className="text-gray-500 mb-4">Page not found.</p>
            <Link to="/internships-residencies" className="text-blue-600 hover:text-blue-800 font-medium">← Back to all programmes</Link>
          </main>
          <SharedFooter />
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-white">
        <Helmet>
          <title>{`${subCatCfg.name} — ${cfg.name} Internships & Residencies | VetNextStep`}</title>
          <meta name="description" content={`Veterinary ${subCatCfg.name.toLowerCase()} internships and residencies in ${cfg.name}.`} />
          <link rel="canonical" href={`https://vetnextstep.com/internships-residencies/${region}/${subCategory}`} />
          <meta property="og:title" content={`${subCatCfg.name} — ${cfg.name} Internships & Residencies | VetNextStep`} />
          <meta property="og:description" content={`Veterinary ${subCatCfg.name.toLowerCase()} internships and residencies in ${cfg.name}.`} />
          <meta property="og:url" content={`https://vetnextstep.com/internships-residencies/${region}/${subCategory}`} />
          <meta property="og:image" content="https://vetnextstep.com/og-image.png" />
          <meta property="og:type" content="website" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:image" content="https://vetnextstep.com/og-image.png" />
        </Helmet>
        <SharedHeader />
        <PathwayRail current={3} />

        <main className="py-8 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Breadcrumb */}
            <nav className="mb-8 flex flex-wrap items-center gap-1.5 text-sm">
              <Link to="/internships-residencies" className="text-blue-600 hover:text-blue-800 font-medium">
                All internships and residencies
              </Link>
              <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <Link to={`/internships-residencies/${region}`} className="text-blue-600 hover:text-blue-800 font-medium">
                {cfg.name}
              </Link>
              <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-gray-600">{subCatCfg.name}</span>
            </nav>

            {/* Section header */}
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{subCatCfg.name}</h1>
                <p className="text-sm text-gray-500 mt-0.5">{cfg.name}</p>
              </div>
              {!loading && (
                <span className="ml-auto text-sm text-gray-400">
                  {regionPrograms.length} programme{regionPrograms.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>

            {licensingNote[region]}

            <div className="grid grid-cols-1 lg:grid-cols-[236px_minmax(0,1fr)] gap-0 border-t border-gray-200">
              <FilterSidebar
                groups={[
                  { key: "type", heading: "Post type", options: PROGRAM_TYPE_OPTIONS },
                  { key: "specialty", heading: "Speciality", options: SPECIALTY_OPTIONS, limit: 6,
                    moreLabel: `All ${SPECIALTY_OPTIONS.length} specialities` },
                ]}
                filters={{ type: typeFilters, specialty: specialtyFilters }}
                onToggle={(key, v) => (key === "type" ? toggleType(v) : toggleSpecialty(v))}
                onClear={clearFilters}
                summary={
                  <p className="text-sm font-semibold text-gray-900 tabular-nums">
                    {loading ? "Loading…" : `${regionPrograms.length} post${regionPrograms.length !== 1 ? "s" : ""} shown`}
                  </p>
                }
              />
              <div className="lg:pl-8 pt-6">
                {activeCount > 0 && (
                  <p className="text-xs text-gray-500 mb-5">
                    Umbrella programmes covering multiple disciplines appear for all speciality filters.
                  </p>
                )}
                {loading ? <Spinner /> : regionPrograms.length === 0 ? (
                  <div className="border border-gray-200 p-12 text-center text-gray-500 text-sm">
                    No programmes match the current filters.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {regionPrograms.map((program, index) => (
                      <ProgramCard key={index} program={program} />
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>
        </main>
        <SharedFooter />
      </div>
    );
  }

  // ——— Sub-hub: regions with two-tile intermediate (europe, uk) ———
  if (region && subCategoryConfig[region]) {
    const cfg     = regionConfig.find((r) => r.id === region);
    const subCats = subCategoryConfig[region];

    if (!cfg) {
      return (
        <div className="min-h-screen bg-white">
          <SharedHeader />
          <PathwayRail current={3} />
          <main className="py-16 text-center">
            <p className="text-gray-500 mb-4">Region not found.</p>
            <Link to="/internships-residencies" className="text-blue-600 hover:text-blue-800 font-medium">← Back to all programmes</Link>
          </main>
          <SharedFooter />
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-white">
        <Helmet>
          <title>{`${cfg.name} Internships & Residencies | VetNextStep`}</title>
          <meta name="description" content={`Veterinary internships and residencies in ${cfg.name} — browse by programme type.`} />
          <link rel="canonical" href={`https://vetnextstep.com/internships-residencies/${region}`} />
          <meta property="og:title" content={`${cfg.name} Internships & Residencies | VetNextStep`} />
          <meta property="og:description" content={`Veterinary internships and residencies in ${cfg.name} — browse by programme type.`} />
          <meta property="og:url" content={`https://vetnextstep.com/internships-residencies/${region}`} />
          <meta property="og:image" content="https://vetnextstep.com/og-image.png" />
          <meta property="og:type" content="website" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:image" content="https://vetnextstep.com/og-image.png" />
        </Helmet>
        <SharedHeader />
        <PathwayRail current={3} />

        <main className="py-8 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Breadcrumb */}
            <div className="mb-8">
              <Link to="/internships-residencies" className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                All internships and residencies
              </Link>
            </div>

            {/* Region header */}
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{cfg.name}</h1>
            </div>

            {/* Sub-categories */}
            <IndexList
              items={subCats.map((sub) => {
                // EBVS colleges are pan-European — count from europe list for uk/college tile
                const countRegion = (region === "uk" && sub.id === "college") ? "europe" : region;
                const count = programs.filter(
                  (p) => p.region === countRegion && getSubCategory(p) === sub.id
                ).length;
                return {
                  to: `/internships-residencies/${region}/${sub.id}`,
                  name: sub.name,
                  note: sub.description,
                  count: loading ? "Loading…" : `${count} programme${count !== 1 ? "s" : ""}`,
                };
              })}
            />

          </div>
        </main>
        <SharedFooter />
      </div>
    );
  }

  // ——— Single region programme list (north-america, worldwide) ———
  if (region) {
    const cfg = regionConfig.find((r) => r.id === region);
    const regionPrograms = programs
      .filter((p) => p.region === region && programMatchesFilters(p, typeFilters, specialtyFilters));

    if (!cfg) {
      return (
        <div className="min-h-screen bg-white">
          <SharedHeader />
          <PathwayRail current={3} />
          <main className="py-16 text-center">
            <p className="text-gray-500 mb-4">Region not found.</p>
            <Link to="/internships-residencies" className="text-blue-600 hover:text-blue-800 font-medium">← Back to all programmes</Link>
          </main>
          <SharedFooter />
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-white">
        <Helmet>
          <title>{`${cfg.name} Internships & Residencies | VetNextStep`}</title>
          <meta name="description" content={`Veterinary internships and residencies in ${cfg.name}.`} />
          <link rel="canonical" href={`https://vetnextstep.com/internships-residencies/${region}`} />
          <meta property="og:title" content={`${cfg.name} Internships & Residencies | VetNextStep`} />
          <meta property="og:description" content={`Veterinary internships and residencies in ${cfg.name}.`} />
          <meta property="og:url" content={`https://vetnextstep.com/internships-residencies/${region}`} />
          <meta property="og:image" content="https://vetnextstep.com/og-image.png" />
          <meta property="og:type" content="website" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:image" content="https://vetnextstep.com/og-image.png" />
        </Helmet>
        <SharedHeader />
        <PathwayRail current={3} />

        <main className="py-8 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Breadcrumb */}
            <div className="mb-8">
              <Link to="/internships-residencies" className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                All internships and residencies
              </Link>
            </div>

            {/* Section header */}
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{cfg.name}</h1>
              {!loading && (
                <span className="ml-auto text-sm text-gray-400">
                  {regionPrograms.length} programme{regionPrograms.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>

            {licensingNote[region]}

            <div className="grid grid-cols-1 lg:grid-cols-[236px_minmax(0,1fr)] gap-0 border-t border-gray-200">
              <FilterSidebar
                groups={[
                  { key: "type", heading: "Post type", options: PROGRAM_TYPE_OPTIONS },
                  { key: "specialty", heading: "Speciality", options: SPECIALTY_OPTIONS, limit: 6,
                    moreLabel: `All ${SPECIALTY_OPTIONS.length} specialities` },
                ]}
                filters={{ type: typeFilters, specialty: specialtyFilters }}
                onToggle={(key, v) => (key === "type" ? toggleType(v) : toggleSpecialty(v))}
                onClear={clearFilters}
                summary={
                  <p className="text-sm font-semibold text-gray-900 tabular-nums">
                    {loading ? "Loading…" : `${regionPrograms.length} post${regionPrograms.length !== 1 ? "s" : ""} shown`}
                  </p>
                }
              />
              <div className="lg:pl-8 pt-6">
                {activeCount > 0 && (
                  <p className="text-xs text-gray-500 mb-5">
                    Umbrella programmes covering multiple disciplines appear for all speciality filters.
                  </p>
                )}
                {loading ? <Spinner /> : regionPrograms.length === 0 ? (
                  <div className="border border-gray-200 p-12 text-center text-gray-500 text-sm">
                    No programmes match the current filters in this region.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {regionPrograms.map((program, index) => (
                      <ProgramCard key={index} program={program} />
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>
        </main>
        <SharedFooter />
      </div>
    );
  }

  // ——— Hub page ———
  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Veterinary Internships & Residencies | VetNextStep</title>
        <meta name="description" content="Browse veterinary internships and residencies in the UK, Europe, and North America. Find rotating internships, specialist residencies, and VIRMP programmes for new vet graduates." />
        <link rel="canonical" href="https://vetnextstep.com/internships-residencies" />
        <meta property="og:title" content="Veterinary Internships & Residencies | VetNextStep" />
        <meta property="og:description" content="Find rotating internships, specialist residencies, and VIRMP programmes for veterinary graduates across the UK, Europe, and North America." />
        <meta property="og:url" content="https://vetnextstep.com/internships-residencies" />
        <meta property="og:image" content="https://vetnextstep.com/og-image.png" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Veterinary Internships & Residencies | VetNextStep" />
        <meta name="twitter:description" content="Find rotating internships, specialist residencies, and VIRMP programmes for veterinary graduates across the UK, Europe, and North America." />
        <meta name="twitter:image" content="https://vetnextstep.com/og-image.png" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://vetnextstep.com/" },
            { "@type": "ListItem", "position": 2, "name": "Internships and residencies", "item": "https://vetnextstep.com/internships-residencies" }
          ]
        })}</script>
      </Helmet>
      <SharedHeader />
      <PathwayRail current={3} />

      <main className="py-8 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="mb-8 pb-5 border-b border-gray-200">
            <nav aria-label="Breadcrumb" className="mb-3 text-xs text-gray-500">
              <Link to="/" className="text-blue-800 underline underline-offset-2">Home</Link>
              <span className="px-1.5 text-gray-400" aria-hidden="true">›</span>
              <span aria-current="page">Internships and residencies</span>
            </nav>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">Internships and residencies</h1>
            <p className="mt-2.5 font-serif text-[17px] leading-relaxed text-gray-700 max-w-[58ch]">
              Rotating internships and specialist residency positions across the UK, North America, Europe, and worldwide. Select a region to browse programmes.
            </p>
          </div>

          <IndexList
            items={regionConfig.map((r) => {
              const count = programs.filter((p) => p.region === r.id).length;
              return {
                to: `/internships-residencies/${r.id}`,
                name: r.name,
                note: REGION_NOTES[r.id],
                count: loading ? "Loading…" : `${count} programme${count !== 1 ? "s" : ""}`,
              };
            })}
          />

        </div>
      </main>
      <SharedFooter />
    </div>
  );
};

export default InternshipsResidencies;
