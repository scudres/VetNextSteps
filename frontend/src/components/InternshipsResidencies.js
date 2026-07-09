import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import SharedHeader from "./SharedHeader";
import SharedFooter from "./SharedFooter";
import FilterDropdown from "./FilterDropdown";
import { slugify } from "../utils";

const regionConfig = [
  {
    id: "europe",
    name: "Europe",
    flag: "🇪🇺",
    image: "https://images.pexels.com/photos/9494908/pexels-photo-9494908.jpeg?auto=compress&cs=tinysrgb&w=600"
  },
  {
    id: "north-america",
    name: "North America",
    flag: "🌎",
    image: "https://images.pexels.com/photos/16156721/pexels-photo-16156721.jpeg?auto=compress&cs=tinysrgb&w=600"
  },
  {
    id: "uk",
    name: "United Kingdom",
    flag: "🇬🇧",
    image: "https://images.pexels.com/photos/30721230/pexels-photo-30721230.jpeg?auto=compress&cs=tinysrgb&w=600"
  },
  {
    id: "worldwide",
    name: "Worldwide",
    flag: "🌍",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80"
  },
];

// Intermediate three-tile configuration for regions that split into sub-categories.
// All images from Pexels — free for commercial use, no attribution required.
// Selected to reflect the diversity of the veterinary profession (majority female; varied backgrounds).
const subCategoryConfig = {
  europe: [
    {
      id: "college",
      name: "EBVS Specialist Colleges",
      description: "Residency programmes administered by European Board of Veterinary Specialisation (EBVS) member colleges — the recognised route to European diplomate status.",
      emoji: "🎓",
      // Pexels #33674900 — professional portrait of Black woman in scrubs (Enson)
      image: "https://images.pexels.com/photos/33674900/pexels-photo-33674900.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      id: "university",
      name: "University Teaching Hospitals",
      description: "Rotating internships and residency positions at European veterinary faculties and their accredited teaching hospitals.",
      emoji: "🏫",
      // Pexels #7469274 — diverse clinical team (two women + vet) caring for a dog (Mikhail Nilov)
      image: "https://images.pexels.com/photos/7469274/pexels-photo-7469274.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      id: "corporate",
      name: "Corporate Groups & Employers",
      description: "Internships, residencies, and graduate programmes at pan-European corporate veterinary groups and specialist employers.",
      emoji: "🏥",
      // Pexels #6234610 — Black female clinical assistant + vet performing ultrasound on dog (Tima Miroshnichenko)
      image: "https://images.pexels.com/photos/6234610/pexels-photo-6234610.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
  ],
  uk: [
    {
      id: "college",
      name: "EBVS Specialist Colleges",
      description: "Residency programmes at UK training centres affiliated with European Board of Veterinary Specialisation (EBVS) colleges — the recognised route to European diplomate status.",
      emoji: "🎓",
      // Pexels #33674900 — professional portrait of Black woman in scrubs (Enson)
      image: "https://images.pexels.com/photos/33674900/pexels-photo-33674900.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      id: "university",
      name: "University Teaching Hospitals",
      description: "Rotating internships and specialist residency programmes at UK veterinary schools and their accredited teaching hospitals.",
      emoji: "🏫",
      // Pexels #7469274 — diverse clinical team (two women + vet) caring for a dog (Mikhail Nilov)
      image: "https://images.pexels.com/photos/7469274/pexels-photo-7469274.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      id: "corporate",
      name: "Corporate Groups & Referral Centres",
      description: "Internships and residency programmes at the UK's leading corporate veterinary groups and private specialist referral hospitals.",
      emoji: "🏥",
      // Pexels #6234610 — Black female clinical assistant + vet performing ultrasound on dog (Tima Miroshnichenko)
      image: "https://images.pexels.com/photos/6234610/pexels-photo-6234610.jpeg?auto=compress&cs=tinysrgb&w=600",
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
  <div id={slugify(program.title)} className="bg-white rounded-xl border border-gray-100 p-6 hover:border-blue-200 hover:shadow-sm transition-colors scroll-mt-28">
    <div className="flex flex-wrap gap-2 mb-3">
      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium capitalize">
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
      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs capitalize">{program.species}</span>
      {program.specialties && program.specialties.length > 0 && program.specialties.map((s) => (
        <span key={s} className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full text-xs">{s}</span>
      ))}
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-1">{program.title}</h3>
    <p className="text-sm text-blue-600 font-medium mb-3">{program.organisation}</p>
    <p className="text-gray-600 text-sm leading-relaxed mb-5">{program.description}</p>
    <a
      href={program.url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
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

const InternshipsResidencies = () => {
  const { region, subCategory } = useParams();
  const [programs,        setPrograms]        = useState([]);
  const [loading,         setLoading]         = useState(true);
  const [typeFilters,      setTypeFilters]      = useState([]);
  const [specialtyFilters, setSpecialtyFilters] = useState([]);

  useEffect(() => {
    fetch("/.netlify/functions/internships")
      .then((r) => { if (!r.ok) throw new Error("Failed to load programmes"); return r.json(); })
      .then((data) => { setPrograms(data); setLoading(false); })
      .catch(() => { setPrograms([]); setLoading(false); });
  }, []);

  const toggleType      = (v) => setTypeFilters((p)      => p.includes(v) ? p.filter((x) => x !== v) : [...p, v]);
  const toggleSpecialty = (v) => setSpecialtyFilters((p) => p.includes(v) ? p.filter((x) => x !== v) : [...p, v]);
  const clearFilters    = ()  => { setTypeFilters([]); setSpecialtyFilters([]); };
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
          <title>{subCatCfg.name} — {cfg.name} Internships & Residencies | VetNextStep</title>
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

        <main className="py-8 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Breadcrumb */}
            <nav className="mb-8 flex flex-wrap items-center gap-1.5 text-sm">
              <Link to="/internships-residencies" className="text-blue-600 hover:text-blue-800 font-medium">
                All Internships & Residencies
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
              <span className="text-3xl">{subCatCfg.emoji}</span>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{subCatCfg.name}</h1>
                <p className="text-sm text-gray-500 mt-0.5">{cfg.flag} {cfg.name}</p>
              </div>
              {!loading && (
                <span className="ml-auto text-sm text-gray-400">
                  {regionPrograms.length} programme{regionPrograms.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>

            {licensingNote[region]}

            {/* Filters */}
            <div className="flex flex-wrap gap-2 mb-4 items-center">
              <FilterDropdown
                label="Type"
                options={PROGRAM_TYPE_OPTIONS}
                selected={typeFilters}
                onToggle={toggleType}
                valueKey="value"
                labelKey="label"
              />
              <FilterDropdown
                label="Specialty"
                options={SPECIALTY_OPTIONS}
                selected={specialtyFilters}
                onToggle={toggleSpecialty}
              />
              {activeCount > 0 && (
                <button onClick={clearFilters} className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 underline underline-offset-2">
                  Clear all ({activeCount})
                </button>
              )}
            </div>
            {activeCount > 0 && (
              <p className="text-xs text-gray-400 mb-6">
                Umbrella programmes covering multiple disciplines appear for all specialty filters.
              </p>
            )}

            {loading ? <Spinner /> : regionPrograms.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-100 p-12 text-center text-gray-400 text-sm">
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
          <title>{cfg.name} Internships & Residencies | VetNextStep</title>
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

        <main className="py-8 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Breadcrumb */}
            <div className="mb-8">
              <Link to="/internships-residencies" className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                All Internships & Residencies
              </Link>
            </div>

            {/* Region header */}
            <div className="flex items-center gap-3 mb-10">
              <span className="text-4xl">{cfg.flag}</span>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{cfg.name}</h1>
            </div>

            {/* Sub-category tiles */}
            <div className={`grid grid-cols-1 gap-6 ${subCats.length >= 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
              {subCats.map((sub) => {
                // EBVS colleges are pan-European — count from europe list for uk/college tile
                const countRegion = (region === "uk" && sub.id === "college") ? "europe" : region;
                const count = programs.filter(
                  (p) => p.region === countRegion && getSubCategory(p) === sub.id
                ).length;
                return (
                  <Link key={sub.id} to={`/internships-residencies/${region}/${sub.id}`} className="group block">
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-blue-300 hover:shadow-md transition-all">
                      <div className="h-48 relative overflow-hidden">
                        <img
                          src={sub.image}
                          alt={sub.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        <div className="absolute bottom-3 left-4 text-white">
                          <div className="text-2xl mb-1">{sub.emoji}</div>
                          <h2 className="text-lg font-bold leading-tight">{sub.name}</h2>
                        </div>
                      </div>
                      <div className="px-4 py-4 bg-white">
                        <p className="text-sm text-gray-600 leading-relaxed mb-3">{sub.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">
                            {loading ? "Loading…" : `${count} programme${count !== 1 ? "s" : ""}`}
                          </span>
                          <span className="text-blue-600 text-sm font-medium group-hover:translate-x-1 transition-transform inline-flex items-center">
                            Browse
                            <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

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
          <title>{cfg.name} Internships & Residencies | VetNextStep</title>
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

        <main className="py-8 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Breadcrumb */}
            <div className="mb-8">
              <Link to="/internships-residencies" className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                All Internships & Residencies
              </Link>
            </div>

            {/* Section header */}
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
              <span className="text-3xl">{cfg.flag}</span>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{cfg.name}</h1>
              {!loading && (
                <span className="ml-auto text-sm text-gray-400">
                  {regionPrograms.length} programme{regionPrograms.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>

            {licensingNote[region]}

            {/* Filters */}
            <div className="flex flex-wrap gap-2 mb-4 items-center">
              <FilterDropdown
                label="Type"
                options={PROGRAM_TYPE_OPTIONS}
                selected={typeFilters}
                onToggle={toggleType}
                valueKey="value"
                labelKey="label"
              />
              <FilterDropdown
                label="Specialty"
                options={SPECIALTY_OPTIONS}
                selected={specialtyFilters}
                onToggle={toggleSpecialty}
              />
              {activeCount > 0 && (
                <button onClick={clearFilters} className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 underline underline-offset-2">
                  Clear all ({activeCount})
                </button>
              )}
            </div>
            {activeCount > 0 && (
              <p className="text-xs text-gray-400 mb-6">
                Umbrella programmes covering multiple disciplines appear for all specialty filters.
              </p>
            )}

            {loading ? <Spinner /> : regionPrograms.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-100 p-12 text-center text-gray-400 text-sm">
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
        <meta name="description" content="Browse veterinary internships and residencies in the UK, Europe, and North America. Find rotating internships, specialist residencies, and VIRMP programs for new vet graduates." />
        <link rel="canonical" href="https://vetnextstep.com/internships-residencies" />
        <meta property="og:title" content="Veterinary Internships & Residencies | VetNextStep" />
        <meta property="og:description" content="Find rotating internships, specialist residencies, and VIRMP programs for veterinary graduates across the UK, Europe, and North America." />
        <meta property="og:url" content="https://vetnextstep.com/internships-residencies" />
        <meta property="og:image" content="https://vetnextstep.com/og-image.png" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Veterinary Internships & Residencies | VetNextStep" />
        <meta name="twitter:description" content="Find rotating internships, specialist residencies, and VIRMP programs for veterinary graduates across the UK, Europe, and North America." />
        <meta name="twitter:image" content="https://vetnextstep.com/og-image.png" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://vetnextstep.com/" },
            { "@type": "ListItem", "position": 2, "name": "Internships & Residencies", "item": "https://vetnextstep.com/internships-residencies" }
          ]
        })}</script>
      </Helmet>
      <SharedHeader />

      <main className="py-8 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-12">
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">Internships & Residencies</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Rotating internships and specialist residency positions across the UK, North America, Europe, and worldwide. Select a region to browse programmes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {regionConfig.map((r) => {
              const count = programs.filter((p) => p.region === r.id).length;
              return (
                <Link key={r.id} to={`/internships-residencies/${r.id}`} className="group block">
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-blue-300 hover:shadow-md transition-all">
                    <div className="h-48 relative overflow-hidden">
                      <img
                        src={r.image}
                        srcSet={`${r.image.replace('w=600', 'w=400')} 400w, ${r.image} 600w, ${r.image.replace('w=600', 'w=900')} 900w`}
                        sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
                        alt={r.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        width="600"
                        height="400"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>
                      <div className="absolute bottom-3 left-4 text-white">
                        <div className="text-2xl mb-1">{r.flag}</div>
                        <h2 className="text-lg font-bold leading-tight">{r.name}</h2>
                      </div>
                    </div>
                    <div className="px-4 py-3 flex items-center justify-between bg-white">
                      <span className="text-sm text-gray-500">
                        {loading ? "Loading…" : `${count} programme${count !== 1 ? "s" : ""}`}
                      </span>
                      <span className="text-blue-600 text-sm font-medium group-hover:translate-x-1 transition-transform inline-flex items-center">
                        View all
                        <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

        </div>
      </main>
      <SharedFooter />
    </div>
  );
};

export default InternshipsResidencies;
