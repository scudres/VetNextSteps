import React, { useState } from "react";
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

// Specialties relevant to internships & residencies
const SPECIALTY_OPTIONS = [
  "Anaesthesia",
  "Cardiology",
  "Dermatology",
  "Emergency & Critical Care",
  "Endocrinology",
  "Equine",
  "Imaging",
  "Internal Medicine",
  "Microbiology",
  "Neurology",
  "Nutrition",
  "Oncology",
  "Ophthalmology",
  "Pathology",
  "Surgery",
];

const programs = [
  {
    title: "VIRMP - Veterinary Internship and Residency Matching Program",
    organisation: "Veterinary Internship & Residency Matching Program",
    description: "Central matching service for veterinary internships and residencies in North America.",
    url: "https://www.virmp.org/",
    region: "north-america",
    type: "internship",
    species: "small animal, equine, farm animal",
    internshipType: "both",
    specialties: [],
  },
  {
    title: "Royal Veterinary College Rotating Internship Programme",
    organisation: "Royal Veterinary College",
    description: "Designed for highly motivated recent veterinary graduates who wish to expand their clinical knowledge, skills and experience in all aspects of small animal practice, working under supervision in a multidisciplinary referral hospital.",
    url: "https://www.rvc.ac.uk/study/postgraduate/internships/small-animal",
    region: "uk",
    type: "internship",
    species: "small animal",
    internshipType: "rotating",
    specialties: [],
  },
  {
    title: "Royal Veterinary College Small Animal Residency Programmes",
    organisation: "Royal Veterinary College",
    description: "Designed for qualified veterinary graduates who wish to specialise in specific disciplines related to small animal practice. All residents are also registered for a Master's degree in Veterinary Medicine.",
    url: "https://www.rvc.ac.uk/study/postgraduate/residencies/small-animal",
    region: "uk",
    type: "residency",
    species: "small animal",
    specialties: ["Surgery","Internal Medicine","Neurology","Dermatology","Ophthalmology","Emergency & Critical Care","Cardiology","Oncology","Anaesthesia","Imaging"],
  },
  {
    title: "University of Liverpool Rotating Internship Programme",
    organisation: "University of Liverpool",
    description: "Rotating internships designed for highly motivated veterinary professionals who wish to develop their skills, experience and knowledge by working under supervision in a multi-disciplinary referral hospital.",
    url: "https://www.liverpool.ac.uk/sath/teaching/postgraduates/internships/",
    region: "uk",
    type: "internship",
    species: "small animal",
    internshipType: "rotating",
    specialties: [],
  },
  {
    title: "University of Liverpool Anaesthesia Internship Programme",
    organisation: "University of Liverpool",
    description: "A discipline-specific internship in anaesthesia for highly motivated veterinary professionals who wish to develop their skills, experience and knowledge under supervision in a multi-disciplinary referral hospital.",
    url: "https://www.liverpool.ac.uk/sath/teaching/postgraduates/internships/",
    region: "uk",
    type: "internship",
    species: "small animal",
    internshipType: "discipline-specific",
    specialties: ["Anaesthesia"],
  },
  {
    title: "University of Liverpool Small Animal Residency Programme",
    organisation: "University of Liverpool",
    description: "The Small Animal Teaching Hospital (SATH) offers several residency programmes for veterinarians who wish to specialise in specific disciplines, providing first class, world-renowned training for veterinary specialisation.",
    url: "https://www.liverpool.ac.uk/sath/teaching/postgraduates/residencies/",
    region: "uk",
    type: "residency",
    species: "small animal",
    specialties: ["Surgery","Internal Medicine","Neurology","Dermatology","Ophthalmology","Emergency & Critical Care","Cardiology","Oncology","Anaesthesia","Imaging"],
  },
  {
    title: "University of Cambridge Rotating Internship Programme",
    organisation: "University of Cambridge",
    description: "Provides an opportunity for qualified veterinarians to obtain high-quality postgraduate training across a large range of small animal disciplines, enhancing clinical, diagnostic, problem-solving, communication, and technical skills.",
    url: "https://www.vet.cam.ac.uk/study/cts/jcts1/smallanimal",
    region: "uk",
    type: "internship",
    species: "small animal",
    internshipType: "rotating",
    specialties: [],
  },
  {
    title: "University of Cambridge Senior Clinical Training Scholarship / Residency Programme",
    organisation: "University of Cambridge",
    description: "Advanced clinical training programme for veterinarians preparing to undertake specialist training. Prepares candidates for entry to a residency or specialism.",
    url: "https://www.vet.cam.ac.uk/study/cts/jcts1/smallanimal",
    region: "uk",
    type: "residency",
    species: "small animal",
    specialties: ["Surgery","Internal Medicine","Neurology","Dermatology","Cardiology"],
  },
  {
    title: "University of Edinburgh Rotating Internship Programme",
    organisation: "University of Edinburgh",
    description: "53-week rotating internship providing an opportunity for new graduates or recently-qualified veterinarians to receive high-quality postgraduate training in small animal disciplines under experienced clinicians.",
    url: "https://vet.ed.ac.uk/clinical/vacancies/rotating-interns",
    region: "uk",
    type: "internship",
    species: "small animal",
    internshipType: "rotating",
    specialties: [],
  },
  {
    title: "University of Edinburgh Residency / Clinical Scholarship Programme",
    organisation: "University of Edinburgh",
    description: "The Professional Doctorate in Veterinary Medicine provides an opportunity for qualified veterinary surgeons to undertake a period of advanced clinical training in a chosen specialty under RCVS and European/American veterinary specialist guidance.",
    url: "https://vet.ed.ac.uk/clinical/vacancies/clinicalscholarships",
    region: "uk",
    type: "residency",
    species: "small animal",
    specialties: ["Surgery","Internal Medicine","Neurology","Dermatology","Emergency & Critical Care"],
  },
  {
    title: "University of Glasgow Small Animal Internship Programme",
    organisation: "University of Glasgow",
    description: "Internship opportunities within the Small Animal Hospital at the University of Glasgow, providing structured postgraduate clinical training.",
    url: "https://www.gla.ac.uk/explore/jobs/appointments/sahvacancies/",
    region: "uk",
    type: "internship",
    species: "small animal",
    internshipType: "rotating",
    specialties: [],
  },
  {
    title: "University of Glasgow Small Animal Residency Programme",
    organisation: "University of Glasgow",
    description: "Residency opportunities within the Small Animal Hospital at the University of Glasgow, providing structured postgraduate specialist training.",
    url: "https://www.gla.ac.uk/explore/jobs/appointments/sahvacancies/",
    region: "uk",
    type: "residency",
    species: "small animal",
    specialties: ["Surgery","Internal Medicine","Neurology","Dermatology","Ophthalmology","Emergency & Critical Care"],
  },
  {
    title: "IVC Evidensia Rotating and Discipline-Specific Internships",
    organisation: "IVC Evidensia, various locations",
    description: "Internship programmes providing an opportunity for qualified veterinarians to obtain training across a large range of small animal disciplines.",
    url: "https://ivcevidensia.co.uk/careers?roles=8",
    region: "uk",
    type: "internship",
    species: "small animal",
    internshipType: "both",
    specialties: [],
  },
  {
    title: "IVC Evidensia Small Animal Residency Programmes",
    organisation: "IVC Evidensia, various locations",
    description: "Residency programmes providing an opportunity for qualified veterinarians to obtain specialised training working towards diplomat status in their chosen discipline.",
    url: "https://ivcevidensia.co.uk/careers?roles=9",
    region: "uk",
    type: "residency",
    species: "small animal",
    specialties: ["Surgery","Internal Medicine","Neurology","Dermatology","Oncology","Emergency & Critical Care"],
  },
  {
    title: "Linnaeus Small Animal Rotating and Discipline-Specific Internships",
    organisation: "Linnaeus Group, various locations",
    description: "Rotating and discipline-specific internships providing an opportunity for qualified veterinarians to obtain training in a large range of small animal disciplines.",
    url: "https://www.linnaeusgroup.co.uk/careers/internships",
    region: "uk",
    type: "internship",
    species: "small animal",
    internshipType: "both",
    specialties: [],
  },
  {
    title: "Linnaeus Small Animal Residency Programmes",
    organisation: "Linnaeus Group, various locations",
    description: "Residency programmes providing an opportunity for qualified veterinarians to obtain specialised training working towards diplomat status in their chosen discipline.",
    url: "https://www.linnaeusgroup.co.uk/careers/vacancies?role=6",
    region: "uk",
    type: "residency",
    species: "small animal",
    specialties: ["Surgery","Internal Medicine","Neurology","Dermatology","Oncology","Cardiology"],
  },
  {
    title: "CVS Small Animal Rotating and Discipline-Specific Internship Programmes",
    organisation: "CVS Group, various locations",
    description: "Give exposure to referral practice and a broad range of specialist disciplines, working alongside world-class nurses, vets and specialists.",
    url: "https://cvs-referrals.com/careers/internship/",
    region: "uk",
    type: "internship",
    species: "small animal",
    internshipType: "both",
    specialties: [],
  },
  {
    title: "CVS Small Animal Residency Programmes",
    organisation: "CVS Group, various locations",
    description: "Residency programmes providing an opportunity for qualified veterinarians to obtain specialised training working towards diplomat status in their chosen discipline.",
    url: "https://cvs-referrals.com/careers/residencies/",
    region: "uk",
    type: "residency",
    species: "small animal",
    specialties: ["Surgery","Internal Medicine","Neurology","Dermatology","Oncology","Emergency & Critical Care"],
  },
  {
    title: "The Ralph Veterinary Internship Programmes",
    organisation: "The Ralph",
    description: "Various rotating and discipline-specific internship programmes at The Ralph referral hospital.",
    url: "https://theralph.vet/join-team-ralph/",
    region: "uk",
    type: "internship",
    species: "small animal",
    internshipType: "both",
    specialties: [],
  },
  {
    title: "The Ralph Veterinary Residency Programme",
    organisation: "The Ralph",
    description: "Various residency programmes in collaboration with European specialist colleges, at The Ralph referral hospital.",
    url: "https://theralph.vet/join-team-ralph/",
    region: "uk",
    type: "residency",
    species: "small animal",
    specialties: ["Surgery","Internal Medicine","Neurology","Ophthalmology","Emergency & Critical Care"],
  },
  {
    title: "BEVA Recognised Equine Internship",
    organisation: "British Equine Veterinary Association",
    description: "All BEVA recognised internships have agreed to a set of core standards that ensure interns receive the right training and are treated fairly.",
    url: "https://www.beva.org.uk/New-Vet-Grads/Recognised-Internships",
    region: "worldwide",
    type: "internship",
    species: "equine",
    internshipType: "discipline-specific",
    specialties: ["Equine"],
  },
  {
    title: "ECVS Residency Training",
    organisation: "European College of Veterinary Surgeons",
    description: "Advanced surgical training programmes leading to board certification in veterinary surgery.",
    url: "https://www.ecvs.org/ecvs-for/residents.php",
    region: "europe",
    type: "residency",
    species: "small animal",
    specialties: ["Surgery"],
  },
  {
    title: "ECVP Residency Programme",
    organisation: "European College of Veterinary Pathologists",
    description: "Specialised training in veterinary pathology leading to board certification.",
    url: "https://www.ecvpath.org/resident-registration",
    region: "europe",
    type: "residency",
    species: "mixed",
    specialties: ["Pathology"],
  },
  {
    title: "ECVIM-CA Residency Programmes",
    organisation: "European College of Veterinary Internal Medicine",
    description: "Specialised residency training programmes in internal medicine at various veterinary institutes across Europe.",
    url: "https://ecvim-ca.college/residency-vacancies/",
    region: "europe",
    type: "residency",
    species: "small animal",
    specialties: ["Internal Medicine","Cardiology","Oncology","Endocrinology"],
  },
  {
    title: "ECVM Residency Programmes",
    organisation: "European College of Veterinary Microbiology",
    description: "Specialised residency training programmes in microbiology at various veterinary institutes across Europe.",
    url: "https://ecvmicro.org/training-centers/",
    region: "europe",
    type: "residency",
    species: "mixed",
    specialties: ["Microbiology"],
  },
  {
    title: "ECVAA Residency Programmes",
    organisation: "European College of Veterinary Anaesthesia and Analgesia",
    description: "Specialised residency training programmes in anaesthesia and analgesia at various veterinary institutes across Europe.",
    url: "https://www.ecvaa.org/ecvaa/training-centers-list",
    region: "europe",
    type: "residency",
    species: "small animal",
    specialties: ["Anaesthesia"],
  },
  {
    title: "ECVCN Residency Programmes",
    organisation: "European College of Veterinary and Comparative Nutrition",
    description: "Specialised residency training programmes in veterinary nutrition at various institutes across Europe.",
    url: "https://www.ecvcn.org/why-become-resident-why-become-supervisor",
    region: "europe",
    type: "residency",
    species: "small animal",
    specialties: ["Nutrition"],
  },
  {
    title: "ECVCP Residency Programmes",
    organisation: "European College of Veterinary Clinical Pathology",
    description: "Specialised residency training programmes in clinical pathology at various veterinary institutes across Europe.",
    url: "https://www.esvcp.org/open-positions.html",
    region: "europe",
    type: "residency",
    species: "mixed",
    specialties: ["Pathology"],
  },
  {
    title: "ECVD Residency Programmes",
    organisation: "European College of Veterinary Dermatology",
    description: "Specialised residency training programmes in veterinary dermatology at various institutes across Europe.",
    url: "https://www.ecvd.org/programmes/start-your-residency/",
    region: "europe",
    type: "residency",
    species: "small animal",
    specialties: ["Dermatology"],
  },
  {
    title: "ECVDI Residency Programmes",
    organisation: "European College of Veterinary Diagnostic Imaging",
    description: "Specialised residency training programmes in veterinary diagnostic imaging at various institutes across Europe.",
    url: "https://www.ecvdi.org/training-centers-list",
    region: "europe",
    type: "residency",
    species: "small animal",
    specialties: ["Imaging"],
  },
  {
    title: "ECVECC Residency Programmes",
    organisation: "European College of Veterinary Emergency and Critical Care",
    description: "Specialised residency training programmes in veterinary emergency and critical care at institutes across Europe and New Zealand.",
    url: "https://www.ecvecc.org/resident-training-facilities",
    region: "europe",
    type: "residency",
    species: "small animal",
    specialties: ["Emergency & Critical Care"],
  },
  {
    title: "ECVN Residency Programmes",
    organisation: "European College of Veterinary Neurology",
    description: "Specialised residency training programmes in veterinary neurology at various institutes across Europe.",
    url: "https://www.ecvn.org/general-information/open-residency-position",
    region: "europe",
    type: "residency",
    species: "small animal",
    specialties: ["Neurology"],
  },
  {
    title: "ECVO Internship & Residency Programmes",
    organisation: "European College of Veterinary Ophthalmologists",
    description: "Specialised internship and residency training programmes in veterinary ophthalmology at various institutes across Europe.",
    url: "https://www.ecvo.eu/residents/training-job-opportunities-for-interns-residents.html",
    region: "europe",
    type: "internship & residency",
    species: "small animal",
    internshipType: "discipline-specific",
    specialties: ["Ophthalmology"],
  },
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

const InternshipsResidencies = () => {
  const { region } = useParams();
  const [typeFilters,      setTypeFilters]      = useState([]);
  const [specialtyFilters, setSpecialtyFilters] = useState([]);

  const toggleType      = (v) => setTypeFilters((p)      => p.includes(v) ? p.filter((x) => x !== v) : [...p, v]);
  const toggleSpecialty = (v) => setSpecialtyFilters((p) => p.includes(v) ? p.filter((x) => x !== v) : [...p, v]);
  const clearFilters    = ()  => { setTypeFilters([]); setSpecialtyFilters([]); };
  const activeCount     = typeFilters.length + specialtyFilters.length;

  // ——— Sub-page: single region ———
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
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-white">
        <Helmet>
          <title>{cfg.name} Internships & Residencies | VetNextStep</title>
          <meta name="description" content={`Veterinary internships and residencies in ${cfg.name}.`} />
          <link rel="canonical" href={`https://vetnextstep.com/internships-residencies/${region}`} />
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
              <span className="ml-auto text-sm text-gray-400">
                {regionPrograms.length} programme{regionPrograms.length !== 1 ? "s" : ""}
              </span>
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

            {regionPrograms.length === 0 ? (
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
        <meta property="og:type" content="website" />
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
                      <img src={r.image} alt={r.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>
                      <div className="absolute bottom-3 left-4 text-white">
                        <div className="text-2xl mb-1">{r.flag}</div>
                        <h2 className="text-lg font-bold leading-tight">{r.name}</h2>
                      </div>
                    </div>
                    <div className="px-4 py-3 flex items-center justify-between bg-white">
                      <span className="text-sm text-gray-500">{count} programme{count !== 1 ? "s" : ""}</span>
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
