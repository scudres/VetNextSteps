import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import SharedHeader from "./SharedHeader";
import SharedFooter from "./SharedFooter";
import FilterDropdown from "./FilterDropdown";
import { slugify } from "../utils";
import {
  countryConfig,
  OCEANIA_TYPE_OPTIONS,
  TYPE_LABELS,
} from "../data/certificatesData";

// ─── Shared UI primitives ─────────────────────────────────────────────────────

const ExternalLinkIcon = () => (
  <svg className="ml-2 w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

const ChevronRight = () => (
  <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const VisitButton = ({ url }) => (
  <a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
  >
    Visit Programme
    <ExternalLinkIcon />
  </a>
);

const BackLink = () => (
  <div className="mb-8">
    <Link
      to="/postgraduate-certificates"
      className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center gap-1"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      All Postgraduate Certificates
    </Link>
  </div>
);

const InfoBox = ({ children }) => (
  <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-8">
    {children}
  </div>
);

const Spinner = () => (
  <div className="flex justify-center py-16">
    <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
  </div>
);

// ─── Card components ──────────────────────────────────────────────────────────

/** USA-style card — shows credential badge, country, format and notes. */
const ProgramCard = ({ id, credential, title, organisation, country, format, notes, url }) => (
  <div id={id} className="bg-white rounded-xl border border-gray-100 p-6 hover:border-blue-200 hover:shadow-sm transition-colors flex flex-col scroll-mt-28">
    <div className="mb-3">
      <span className="inline-block px-2.5 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold tracking-wide">
        {credential}
      </span>
    </div>
    <h3 className="text-base font-semibold text-gray-900 mb-1 leading-snug">{title}</h3>
    <p className="text-sm text-blue-600 font-medium mb-1">{organisation}</p>
    <p className="text-xs text-gray-400 mb-3">{country}</p>
    <p className="text-xs text-gray-600 leading-relaxed mb-2">{format}</p>
    {notes && <p className="text-xs text-gray-500 italic leading-relaxed mb-4">{notes}</p>}
    <div className="mt-auto pt-2">
      <VisitButton url={url} />
    </div>
  </div>
);

/** UK/AU/NZ-style card — simple layout with type badge. */
const SimpleCard = ({ program }) => (
  <div className="bg-white rounded-xl border border-gray-100 p-6 hover:border-blue-200 hover:shadow-sm transition-colors flex flex-col">
    {program.type && (
      <div className="mb-3">
        <span className="inline-block px-2.5 py-0.5 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">
          {TYPE_LABELS[program.type] || program.type}
        </span>
      </div>
    )}
    <h3 className="text-base font-semibold text-gray-900 mb-1 leading-snug">{program.title}</h3>
    <p className="text-sm text-blue-600 font-medium mb-3">{program.organisation}</p>
    <p className="text-sm text-gray-600 leading-relaxed mb-5 flex-1">{program.description}</p>
    <div className="mt-auto">
      <VisitButton url={program.url} />
    </div>
  </div>
);

// ─── Filter bar ───────────────────────────────────────────────────────────────

const FilterBar = ({ options, selected, onToggle, onClear }) => (
  <div className="flex flex-wrap items-center gap-2 mb-8 pb-4 border-b border-gray-100">
    <span className="text-sm font-medium text-gray-500 mr-1">Filter:</span>
    <FilterDropdown
      label="Type"
      options={options}
      selected={selected}
      onToggle={onToggle}
      valueKey="value"
      labelKey="label"
      menuClassName="min-w-[280px]"
    />
    {selected.length > 0 && (
      <button onClick={onClear} className="text-xs text-gray-400 hover:text-gray-600 ml-2">
        Clear filters
      </button>
    )}
  </div>
);

// ─── Shared layout for Oceania (AU / NZ) pages ───────────────────────────────

const OceaniaPageLayout = ({ programs, loading, helmet, flag, countryName, infoBox, careerGuideLink }) => {
  const [selectedTypes, setSelectedTypes] = useState([]);

  const toggle = (val) =>
    setSelectedTypes((prev) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
    );

  const visible = selectedTypes.length === 0
    ? programs
    : programs.filter((p) => selectedTypes.includes(p.type));

  return (
    <div className="min-h-screen bg-white">
      {helmet}
      <SharedHeader />
      <main className="py-8 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BackLink />

          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
            <span className="text-3xl">{flag}</span>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{countryName}</h1>
            {!loading && (
              <span className="ml-auto text-sm text-gray-400">
                {visible.length === programs.length
                  ? `${programs.length} programmes`
                  : `${visible.length} of ${programs.length} programmes`}
              </span>
            )}
          </div>

          {infoBox}

          {loading ? <Spinner /> : (
            <>
              <FilterBar
                options={OCEANIA_TYPE_OPTIONS}
                selected={selectedTypes}
                onToggle={toggle}
                onClear={() => setSelectedTypes([])}
              />

              {visible.length === 0 ? (
                <p className="text-gray-500 text-sm">No programmes match the selected filters.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {visible.map((program) => (
                    <SimpleCard key={program.title} program={program} />
                  ))}
                </div>
              )}
            </>
          )}

          <div className="mt-10 pt-6 border-t border-gray-100">
            {careerGuideLink}
          </div>
        </div>
      </main>
      <SharedFooter />
    </div>
  );
};

// ─── Country sub-pages ────────────────────────────────────────────────────────

const UKSubPage = ({ programs, loading }) => (
  <div className="min-h-screen bg-white">
    <Helmet>
      <title>UK Postgraduate Certificates for Vets | VetNextStep</title>
      <meta name="description" content="RCVS CertAVP programmes in the UK from RVC, Edinburgh, Liverpool, Nottingham, Surrey, and BSAVA." />
      <link rel="canonical" href="https://vetnextstep.com/postgraduate-certificates/uk" />
      <meta property="og:title" content="UK Postgraduate Certificates for Vets | VetNextStep" />
      <meta property="og:description" content="RCVS CertAVP programmes in the UK — from RVC, Edinburgh, Liverpool, Nottingham, Surrey, and BSAVA." />
      <meta property="og:url" content="https://vetnextstep.com/postgraduate-certificates/uk" />
      <meta property="og:image" content="https://vetnextstep.com/og-image.png" />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content="https://vetnextstep.com/og-image.png" />
    </Helmet>
    <SharedHeader />
    <main className="py-8 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackLink />

        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
          <span className="text-3xl">🇬🇧</span>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">United Kingdom</h1>
          {!loading && <span className="ml-auto text-sm text-gray-400">{programs.length} programmes</span>}
        </div>

        <InfoBox>
          <h3 className="text-base font-semibold text-blue-900 mb-1">About the RCVS CertAVP</h3>
          <p className="text-sm text-blue-800 mb-3">
            The Certificate in Advanced Veterinary Practice (CertAVP) is an RCVS-accredited qualification allowing
            veterinarians to demonstrate advanced knowledge and skills in a chosen subject area. It is offered by
            multiple UK universities and is a recognised pathway to fellowship. RCVS registration is a prerequisite
            — <Link to="/uk" className="text-blue-700 hover:underline font-medium">see the UK licensing guide</Link> if
            you're working towards registration.
          </p>
          <a
            href="https://www.rcvs.org.uk/lifelong-learning/postgraduate-qualifications/certificate-in-advanced-veterinary-practice-certavp/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-blue-700 hover:text-blue-900 text-sm font-medium"
          >
            Learn more at RCVS
            <ExternalLinkIcon />
          </a>
        </InfoBox>

        {loading ? <Spinner /> : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {programs.map((program) => (
              <div
                key={program.title}
                id={slugify(program.title)}
                className="bg-white rounded-xl border border-gray-100 p-6 hover:border-blue-200 hover:shadow-sm transition-colors flex flex-col scroll-mt-28"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{program.title}</h3>
                <p className="text-sm text-blue-600 font-medium mb-3">{program.organisation}</p>
                <p className="text-gray-600 text-sm leading-relaxed mb-5 flex-1">{program.description}</p>
                <div className="mt-auto">
                  <VisitButton url={program.url} />
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

const USASubPage = ({ categories, loading }) => {
  const [selectedTypes, setSelectedTypes] = useState([]);

  const toggle = (val) =>
    setSelectedTypes((prev) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
    );

  const USA_TYPE_OPTIONS = categories.map((c) => ({ value: c.id, label: c.name }));
  const usaTotalCount = categories.reduce((acc, c) => acc + c.programs.length, 0);

  const visibleCategories = selectedTypes.length === 0
    ? categories
    : categories.filter((c) => selectedTypes.includes(c.id));

  const visibleCount = visibleCategories.reduce((acc, c) => acc + c.programs.length, 0);

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>USA Postgraduate Certificates for Vets | VetNextStep</title>
        <meta name="description" content="North American middle-tier veterinary credentials — ISVPS GPCert, rehabilitation (CCRP/CCRT), acupuncture (CVA), pain management (CVPP), and university graduate certificates." />
        <link rel="canonical" href="https://vetnextstep.com/postgraduate-certificates/usa" />
        <meta property="og:title" content="USA Postgraduate Certificates for Vets | VetNextStep" />
        <meta property="og:description" content="ISVPS GPCert, rehabilitation (CCRP/CCRT), acupuncture (CVA), pain management (CVPP), and university graduate certificates for vets in the USA." />
        <meta property="og:url" content="https://vetnextstep.com/postgraduate-certificates/usa" />
        <meta property="og:image" content="https://vetnextstep.com/og-image.png" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://vetnextstep.com/og-image.png" />
      </Helmet>
      <SharedHeader />
      <main className="py-8 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BackLink />

          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
            <span className="text-3xl">🇺🇸</span>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">United States</h1>
            {!loading && (
              <span className="ml-auto text-sm text-gray-400">
                {visibleCount === usaTotalCount
                  ? `${usaTotalCount} programmes`
                  : `${visibleCount} of ${usaTotalCount} programmes`}
              </span>
            )}
          </div>

          <p className="text-sm text-gray-500 mb-6">
            Most programmes below require you to hold a valid US (or provincial Canadian) veterinary licence before
            enrolling.{" "}
            <Link to="/usa" className="text-blue-600 hover:text-blue-800 font-medium">
              See the USA licensing guide →
            </Link>
          </p>

          {loading ? <Spinner /> : (
            <>
              <FilterBar
                options={USA_TYPE_OPTIONS}
                selected={selectedTypes}
                onToggle={toggle}
                onClear={() => setSelectedTypes([])}
              />

              {visibleCategories.length === 0 ? (
                <p className="text-gray-500 text-sm">No programmes match the selected filters.</p>
              ) : (
                visibleCategories.map((category) => (
                  <div key={category.id} className="mb-12">
                    <div className="mb-4">
                      <h2 className="text-xl font-bold text-gray-900 mb-1">{category.name}</h2>
                      <p className="text-sm text-gray-500 leading-relaxed">{category.description}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {category.programs.map((program, idx) => (
                        <ProgramCard
                          key={`${category.id}-${idx}`}
                          id={slugify(`${program.title}-${idx}`)}
                          {...program}
                        />
                      ))}
                    </div>
                  </div>
                ))
              )}
            </>
          )}
        </div>
      </main>
      <SharedFooter />
    </div>
  );
};

const CanadaSubPage = () => (
  <div className="min-h-screen bg-white">
    <Helmet>
      <title>Canada Postgraduate Certificates for Vets | VetNextStep</title>
      <meta name="description" content="Postgraduate certificate options for vets in Canada — including ISVPS GPCert, CCRP rehabilitation, CVPP pain management, and IVAS acupuncture credentials open to Canadian graduates." />
      <link rel="canonical" href="https://vetnextstep.com/postgraduate-certificates/canada" />
      <meta property="og:title" content="Canada Postgraduate Certificates for Vets | VetNextStep" />
      <meta property="og:description" content="Postgraduate certificate options for vets in Canada — ISVPS GPCert, CCRP, CVPP, IVAS CVA, and more." />
      <meta property="og:url" content="https://vetnextstep.com/postgraduate-certificates/canada" />
      <meta property="og:image" content="https://vetnextstep.com/og-image.png" />
      <meta property="og:type" content="website" />
    </Helmet>
    <SharedHeader />
    <main className="py-8 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackLink />

        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
          <span className="text-3xl">🇨🇦</span>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Canada</h1>
        </div>

        <InfoBox>
          <h3 className="text-base font-semibold text-blue-900 mb-2">Most USA credentials are open to Canadian vets</h3>
          <p className="text-sm text-blue-800 leading-relaxed mb-3">
            The majority of the North American middle-tier credentials — including ISVPS GPCert/PgC, CCRP, CCRT, CVPP
            (IVAPM), and IVAS CVA — are available to Canadian veterinarians. See the USA page for the full list; the
            "Country" field on each card indicates availability.
          </p>
          <p className="text-sm text-blue-800 leading-relaxed">
            Canada-specific postgraduate certificate programmes (through provincial veterinary colleges and CVMA) will
            be added to this section when confirmed.
          </p>
        </InfoBox>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/postgraduate-certificates/usa"
            className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            View USA programmes
            <ChevronRight />
          </Link>
          <Link
            to="/canada"
            className="inline-flex items-center justify-center border border-blue-600 text-blue-600 hover:bg-blue-50 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            View Canada career guide
            <ChevronRight />
          </Link>
        </div>
      </div>
    </main>
    <SharedFooter />
  </div>
);

const AustraliaSubPage = ({ programs, loading }) => (
  <OceaniaPageLayout
    programs={programs}
    loading={loading}
    flag="🇦🇺"
    countryName="Australia"
    helmet={
      <Helmet>
        <title>Australia Postgraduate Certificates for Vets | VetNextStep</title>
        <meta name="description" content="ANZCVS Membership, ISVPS GPCert, and university graduate certificates for vets in Australia — including programmes from Melbourne, UQ, CSU, and JCU." />
        <link rel="canonical" href="https://vetnextstep.com/postgraduate-certificates/australia" />
        <meta property="og:title" content="Australia Postgraduate Certificates for Vets | VetNextStep" />
        <meta property="og:description" content="ANZCVS Membership, ISVPS GPCert, and university graduate certificates for vets in Australia — Melbourne, UQ, CSU, and JCU." />
        <meta property="og:url" content="https://vetnextstep.com/postgraduate-certificates/australia" />
        <meta property="og:image" content="https://vetnextstep.com/og-image.png" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://vetnextstep.com/og-image.png" />
      </Helmet>
    }
    infoBox={
      <InfoBox>
        <h3 className="text-base font-semibold text-blue-900 mb-1">About Australian postgraduate certificates</h3>
        <p className="text-sm text-blue-800 leading-relaxed">
          The ANZCVS Membership (MANZCVS) is the principal trans-Tasman middle-tier qualification. The ISVPS GPCert
          is the closest equivalent to the UK GPCert in structure. Australian universities also offer AQF Level 8
          Graduate Certificates and coursework Masters across a range of specialties.{" "}
          <Link to="/australia" className="text-blue-700 hover:underline font-medium">
            See the Australia career guide
          </Link>{" "}
          for licensing and registration information.
        </p>
      </InfoBox>
    }
    careerGuideLink={
      <Link to="/australia" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm">
        View full Australia career guide
        <ChevronRight />
      </Link>
    }
  />
);

const NewZealandSubPage = ({ programs, loading }) => (
  <OceaniaPageLayout
    programs={programs}
    loading={loading}
    flag="🇳🇿"
    countryName="New Zealand"
    helmet={
      <Helmet>
        <title>New Zealand Postgraduate Certificates for Vets | VetNextStep</title>
        <meta name="description" content="ANZCVS Membership, ISVPS GPCert, and Massey University postgraduate qualifications for vets in New Zealand — including the MVM, PGDipVSc, and NZVA-Massey CPD Pathway." />
        <link rel="canonical" href="https://vetnextstep.com/postgraduate-certificates/new-zealand" />
        <meta property="og:title" content="New Zealand Postgraduate Certificates for Vets | VetNextStep" />
        <meta property="og:description" content="ANZCVS Membership, ISVPS GPCert, and Massey University qualifications for vets in New Zealand — MVM, PGDipVSc, and NZVA-Massey CPD Pathway." />
        <meta property="og:url" content="https://vetnextstep.com/postgraduate-certificates/new-zealand" />
        <meta property="og:image" content="https://vetnextstep.com/og-image.png" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://vetnextstep.com/og-image.png" />
      </Helmet>
    }
    infoBox={
      <InfoBox>
        <h3 className="text-base font-semibold text-blue-900 mb-1">About New Zealand postgraduate qualifications</h3>
        <p className="text-sm text-blue-800 leading-relaxed">
          Massey University is New Zealand's primary provider of veterinary postgraduate qualifications. The ANZCVS
          Membership (MANZCVS) and ISVPS GPCert are both open to New Zealand-registered vets. The NZVA–Massey CPD
          Pathway offers a structured route from CPD courses to formal qualifications with NZVA Accreditation.
        </p>
      </InfoBox>
    }
    careerGuideLink={
      <a
        href="https://www.vetcouncil.org.nz/"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm"
      >
        Veterinary Council of New Zealand — registration information
        <ChevronRight />
      </a>
    }
  />
);

// ─── Hub page ─────────────────────────────────────────────────────────────────

const HubPage = ({ certData, loading }) => {
  const getCount = (id) => {
    if (id === "uk")          return certData.uk.length;
    if (id === "usa")         return certData.usa.reduce((acc, cat) => acc + cat.programs.length, 0);
    if (id === "australia")   return certData.australia.length;
    if (id === "new-zealand") return certData.newZealand.length;
    return null;
  };

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Postgraduate Certificates for Vets: CertAVP &amp; GPCert | VetNextStep</title>
        <meta name="description" content="Compare RCVS CertAVP routes in the UK, ISVPS GPCert in North America, and rehabilitation and acupuncture awards. Find which certificate fits your career." />
        <link rel="canonical" href="https://vetnextstep.com/postgraduate-certificates" />
        <meta property="og:title" content="Postgraduate Certificates for Vets: CertAVP &amp; GPCert | VetNextStep" />
        <meta property="og:description" content="Compare RCVS CertAVP routes in the UK, ISVPS GPCert in North America, and rehabilitation and acupuncture awards. Find which certificate fits your career." />
        <meta property="og:url" content="https://vetnextstep.com/postgraduate-certificates" />
        <meta property="og:image" content="https://vetnextstep.com/og-image.png" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Veterinary Postgraduate Certificates: CertAVP &amp; GPCert | VetNextStep" />
        <meta name="twitter:description" content="Compare RCVS CertAVP routes in the UK, ISVPS GPCert in North America, and rehabilitation and acupuncture awards." />
        <meta name="twitter:image" content="https://vetnextstep.com/og-image.png" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://vetnextstep.com/" },
            { "@type": "ListItem", "position": 2, "name": "Postgraduate Certificates", "item": "https://vetnextstep.com/postgraduate-certificates" }
          ]
        })}</script>
      </Helmet>
      <SharedHeader />
      <main className="py-8 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">Postgraduate Certificates</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Certificate-tier qualifications for vets looking to develop a clinical interest — below specialist
              Diplomate level, above standard CPD. UK, North America, Australia, and New Zealand covered.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {countryConfig.map((c) => {
              const count = loading ? null : getCount(c.id);
              return (
                <Link key={c.id} to={`/postgraduate-certificates/${c.id}`} className="group block">
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-blue-300 hover:shadow-md transition-all">
                    <div className="h-48 relative overflow-hidden">
                      <img
                        src={c.image}
                        alt={c.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                      <div className="absolute bottom-3 left-4 text-white">
                        <div className="text-2xl mb-1">{c.flag}</div>
                        <h2 className="text-lg font-bold leading-tight">{c.name}</h2>
                      </div>
                    </div>
                    <div className="px-4 py-3 flex items-center justify-between bg-white">
                      <span className="text-sm text-gray-500">
                        {loading
                          ? "Loading…"
                          : count !== null
                          ? `${count} programme${count !== 1 ? "s" : ""}`
                          : "Coming soon"}
                      </span>
                      <span className="text-blue-600 text-sm font-medium group-hover:translate-x-1 transition-transform inline-flex items-center">
                        View all
                        <ChevronRight />
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

// ─── Root component — fetches data once and routes to the correct sub-page ────

const PostgraduateCertificates = () => {
  const { country } = useParams();
  const [certData, setCertData] = useState({ uk: [], usa: [], australia: [], newZealand: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/.netlify/functions/certificates")
      .then((r) => { if (!r.ok) throw new Error("Failed to load certificates"); return r.json(); })
      .then((data) => { setCertData(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (country === "uk")          return <UKSubPage programs={certData.uk} loading={loading} />;
  if (country === "usa")         return <USASubPage categories={certData.usa} loading={loading} />;
  if (country === "canada")      return <CanadaSubPage />;
  if (country === "australia")   return <AustraliaSubPage programs={certData.australia} loading={loading} />;
  if (country === "new-zealand") return <NewZealandSubPage programs={certData.newZealand} loading={loading} />;

  if (country) {
    return (
      <div className="min-h-screen bg-white">
        <SharedHeader />
        <main className="py-16 text-center">
          <p className="text-gray-500 mb-4">Country not found.</p>
          <Link to="/postgraduate-certificates" className="text-blue-600 hover:text-blue-800 font-medium">
            ← Back to all programmes
          </Link>
        </main>
        <SharedFooter />
      </div>
    );
  }

  return <HubPage certData={certData} loading={loading} />;
};

export default PostgraduateCertificates;
