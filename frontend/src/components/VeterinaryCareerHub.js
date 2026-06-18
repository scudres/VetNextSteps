import React, { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import SharedHeader from "./SharedHeader";
import AcronymTooltip from "./AcronymTooltip";
import DisclaimerBanner from "./DisclaimerBanner";
import SharedFooter from "./SharedFooter";

const comparisonData = {
  UK: {
    label: "United Kingdom \uD83C\uDDEC\uD83C\uDDE7",
    body: "RCVS (Royal College of Veterinary Surgeons)",
    exam: "None for RCVS-recognised degrees; assessment for all others",
    mainVisa: "Skilled Worker Visa",
    sponsor: "Yes — from a licensed UK sponsor",
    english: "Possible requirement",
    timeline: "3–6 months",
    demand: "High — small animal GP especially",
  },
  USA: {
    label: "United States \uD83C\uDDFA\uD83C\uDDF8",
    body: "State veterinary board (each state has its own)",
    exam: "NAVLE (all grads) + ECFVG or PAVE (non-AVMA grads only)",
    mainVisa: "H-1B or J-1 (employer arranges)",
    sponsor: "Yes — employer must arrange",
    english: "Yes",
    timeline: "6–18 months",
    demand: "High nationally",
  },
  Canada: {
    label: "Canada \uD83C\uDDE8\uD83C\uDDE6",
    body: "Provincial regulatory body (varies by province)",
    exam: "ECA credential assessment, then BCSE, then NAVLE (via NEB)",
    mainVisa: "Express Entry or Provincial Nominee Program (PNP)",
    sponsor: "Not always required",
    english: "English or French",
    timeline: "12–24 months",
    demand: "High — especially rural and northern regions",
  },
  Australia: {
    label: "Australia \uD83C\uDDE6\uD83C\uDDFA",
    body: "State/territory board (AVBC sets national standards)",
    exam: "AVE exam if degree is not AVBC-recognised",
    mainVisa: "482 Skills in Demand (employer sponsor) or 189/190/491 skilled migration",
    sponsor: "Yes for 482 visa; no for skilled migration",
    english: "IELTS or OET required",
    timeline: "6–18 months",
    demand: "High — especially regional and rural",
  },
};

const comparisonRows = [
  { key: "body",     label: "Registration body"  },
  { key: "exam",     label: "Key exam(s)"        },
  { key: "mainVisa", label: "Main visa route"    },
  { key: "sponsor",  label: "Sponsor required"   },
  { key: "english",  label: "English test"       },
  { key: "timeline", label: "Typical timeline"   },
  { key: "demand",   label: "Demand level"       },
];

const StepBar = ({ steps }) => (
  <div className="flex items-start mb-4">
    {steps.map((s, i) => (
      <div key={i} className="flex-1 flex flex-col items-center relative">
        {i < steps.length - 1 && (
          <div className="absolute top-3 left-1/2 w-full h-0.5 bg-blue-100"></div>
        )}
        <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center z-10 flex-shrink-0">
          {i + 1}
        </div>
        <p className="text-xs text-center text-gray-500 mt-1.5 leading-tight px-0.5">{s}</p>
      </div>
    ))}
  </div>
);

const VeterinaryCareerHub = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchParams] = useSearchParams();
  const [compareA, setCompareA] = useState("UK");
  const [compareB, setCompareB] = useState("Australia");
  const navigate = useNavigate();

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "cpd") {
      // CPD is now a standalone page — redirect old homepage tab URL
      navigate("/cpd", { replace: true });
    } else if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams, navigate]);

  const countries = [
    {
      name: "United Kingdom",
      code: "UK",
      image: "https://images.pexels.com/photos/30721230/pexels-photo-30721230.jpeg?auto=compress&cs=tinysrgb&w=600",
      highlights: [
        "Register with RCVS before you start practising",
        "CertAVP is the main postgrad certificate route — multiple universities offer it",
        "Strong referral sector with structured graduate programmes at the major corporate groups",
      ],
    },
    {
      name: "United States",
      code: "USA",
      image: "https://images.pexels.com/photos/16156721/pexels-photo-16156721.jpeg?auto=compress&cs=tinysrgb&w=600",
      highlights: [
        "Sit the NAVLE in your target state — required in all 50",
        "Apply through VIRMP if you want a rotating internship before specialist training",
        "Each state board sets its own additional licensing requirements",
      ],
    },
    {
      name: "Canada",
      code: "Canada",
      image: "https://images.pexels.com/photos/11862814/pexels-photo-11862814.jpeg?auto=compress&cs=tinysrgb&w=600",
      highlights: [
        "Licence through your province's own regulatory body",
        "CVMA manages credential assessment for overseas graduates",
        "Strong demand in rural and northern communities — useful for PR applications",
      ],
    },
    {
      name: "Australia",
      code: "Australia",
      image: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=600&q=80",
      highlights: [
        "Your degree needs to be AVBC-recognised — if not, you'll sit the AVE exam",
        "Skills in Demand visa (482) with employer sponsorship is the most common route",
        "Vets are on the skilled occupation list — PR pathways (189/190/491) are open",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>VetNextStep | Veterinary Career Progression Hub</title>
        <meta name="description" content="Licensing steps, visa options, and training resources for vets working in or moving to the UK, USA, Canada, or Australia. No fluff — just what you need to know." />
        <link rel="canonical" href="https://vetnextstep.com/" />
        <meta property="og:title" content="VetNextStep | Veterinary Career Progression Hub" />
        <meta property="og:description" content="Graduate programmes, internships, residencies, postgraduate certificates, and licensing guides for the UK, USA, Canada, and Australia." />
        <meta property="og:url" content="https://vetnextstep.com/" />
        <meta property="og:type" content="website" />
      </Helmet>
      <SharedHeader activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "overview" && (
        <>
          {/* Hero */}
          <section className="bg-white border-b border-gray-100 py-10 md:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-4">Veterinary career progression</p>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-5">
                  Know your next step.
                </h2>
                <p className="text-base md:text-lg text-gray-500 leading-relaxed mb-8">
                  Newly qualified or ten years in — there's always a next move. Find licensing guides for working abroad, postgraduate training and certificates, CPD providers, and upcoming conferences, all in one place.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setActiveTab("countries")}
                    className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
                  >
                    Working internationally
                  </button>
                  <Link
                    to="/cpd"
                    className="inline-flex items-center border border-gray-300 hover:border-blue-400 hover:text-blue-600 text-gray-700 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
                  >
                    CPD & Conferences
                  </Link>
                  <Link
                    to="/internships-residencies"
                    className="inline-flex items-center border border-gray-300 hover:border-blue-400 hover:text-blue-600 text-gray-700 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
                  >
                    Internships & Residencies
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Three career paths */}
          <div className="border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-6">What are you looking for?</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Path 1 — Working abroad */}
                <button
                  onClick={() => setActiveTab("countries")}
                  className="group text-left bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 mb-2">Working internationally</h3>
                  <p className="text-xs text-gray-500 leading-relaxed mb-3">Visa routes, registration steps, and licensing exams for the UK, USA, Canada, and Australia. Includes a side-by-side country comparison.</p>
                  <span className="text-xs font-medium text-blue-600 inline-flex items-center">
                    View licensing guides
                    <svg className="ml-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </button>

                {/* Path 2 — CPD & Conferences */}
                <Link
                  to="/cpd"
                  className="group text-left bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center mb-4">
                    <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 mb-2">CPD & Conferences</h3>
                  <p className="text-xs text-gray-500 leading-relaxed mb-3">70+ conferences across all specialties, 2026–2028, sortable by region. Plus 49 CPD providers — university units, commercial platforms, and industry education.</p>
                  <span className="text-xs font-medium text-blue-600 inline-flex items-center">
                    Browse CPD & events
                    <svg className="ml-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </Link>

                {/* Path 3 — Advanced training */}
                <div className="group bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:bg-blue-50 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 mb-2">Postgraduate training</h3>
                  <p className="text-xs text-gray-500 leading-relaxed mb-3">Graduate development programmes, rotating internships, specialist residencies, and RCVS-accredited postgraduate certificates. Wherever you are, there's a route forward.</p>
                  <div className="flex flex-wrap gap-2">
                    <Link to="/training-programs" className="text-xs font-medium text-blue-600 inline-flex items-center hover:underline">
                      Grad programmes
                      <svg className="ml-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                    <span className="text-gray-300">·</span>
                    <Link to="/internships-residencies" className="text-xs font-medium text-blue-600 inline-flex items-center hover:underline">
                      Internships & residencies
                      <svg className="ml-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                    <span className="text-gray-300">·</span>
                    <Link to="/postgraduate-certificates" className="text-xs font-medium text-blue-600 inline-flex items-center hover:underline">
                      Certificates
                      <svg className="ml-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Full section index */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-6">All sections</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { label: "Graduate Development Programmes",       desc: "Structured graduate and early-career development programmes with CVS, IVC Evidensia, Linnaeus, Medivet, Banfield, and more.",  meta: "UK · USA · Canada · Australia",          path: "/training-programs" },
                { label: "Internships & Residencies", desc: "Rotating internships and specialist residency posts at university teaching hospitals and private referral centres.",             meta: "UK · Europe · North America",            path: "/internships-residencies" },
                { label: "Postgraduate Certificates", desc: "RCVS CertAVP and university postgraduate certificates — flexible routes to build a clinical interest at any career stage.",    meta: "RCVS-accredited · Level 7",              path: "/postgraduate-certificates" },
                { label: "Countries & Licensing",     desc: "Registration bodies, key exams, visa routes, and typical timelines for working in the UK, USA, Canada, and Australia.",       meta: "Visa · Registration · Licensing",        tab: "countries" },
                { label: "Conferences & Congresses",  desc: "70+ conferences in date order, 2026–2028 — filter by specialty or jump to your region. General practice to subspecialties.",  meta: "UK · USA · Europe · Australia · Global", path: "/cpd" },
                { label: "CPD Providers & Courses",   desc: "University CPD units, commercial e-learning platforms, and industry-funded education. Online, on-site, and subscription.",    meta: "49 providers · 4 categories",            path: "/cpd" },
              ].map((item, i) =>
                item.path ? (
                  <Link key={i} to={item.path} className="group block border border-gray-200 rounded-lg p-5 hover:border-blue-300 hover:bg-blue-50 transition-colors">
                    <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 mb-2">{item.label}</p>
                    <p className="text-xs text-gray-500 leading-relaxed mb-3">{item.desc}</p>
                    <p className="text-xs font-medium text-blue-600">{item.meta}</p>
                  </Link>
                ) : (
                  <button key={i} onClick={() => setActiveTab(item.tab)} className="group text-left border border-gray-200 rounded-lg p-5 hover:border-blue-300 hover:bg-blue-50 transition-colors">
                    <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 mb-2">{item.label}</p>
                    <p className="text-xs text-gray-500 leading-relaxed mb-3">{item.desc}</p>
                    <p className="text-xs font-medium text-blue-600">{item.meta}</p>
                  </button>
                )
              )}
            </div>
          </div>
        </>
      )}

      {activeTab !== "overview" && (
        <main className="py-8 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Countries & Licensing Tab */}
            {activeTab === "countries" && (
              <div>
                <div className="text-center mb-12">
                  <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">Countries & Licensing</h2>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Pick your destination. Below you'll find the registration steps, visa routes, and key exams for each country.
                  </p>
                </div>

                <div className="mb-10">
                  <DisclaimerBanner officialBody={null} />
                </div>

                {/* Country nav cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
                  {countries.map((country) => (
                    <a key={country.code} href={`#country-${country.code.toLowerCase()}`} className="group block">
                      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-blue-300 hover:shadow-sm transition-colors">
                        <div className="h-40 relative overflow-hidden">
                          <img src={country.image} alt={country.name} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                          <div className="absolute bottom-3 left-4 text-white">
                            <h3 className="text-lg font-bold">{country.name}</h3>
                          </div>
                        </div>
                        <div className="px-4 py-3 flex items-center justify-between">
                          <span className="text-sm text-gray-500">Visa & licensing</span>
                          <span className="text-blue-600 text-sm font-medium group-hover:translate-x-1 transition-transform inline-flex items-center">
                            View
                            <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>

                {/* Country comparison tool */}
                <div className="mb-16 border border-gray-200 rounded-xl overflow-hidden">
                  <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex flex-wrap items-center gap-4">
                    <span className="text-sm font-semibold text-gray-700">Compare countries</span>
                    <div className="flex flex-wrap items-center gap-3">
                      <select
                        value={compareA}
                        onChange={(e) => setCompareA(e.target.value)}
                        className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-700 focus:border-blue-400 focus:outline-none"
                      >
                        {Object.keys(comparisonData).map((k) => (
                          <option key={k} value={k}>{comparisonData[k].label}</option>
                        ))}
                      </select>
                      <span className="text-gray-400 text-sm font-medium">vs</span>
                      <select
                        value={compareB}
                        onChange={(e) => setCompareB(e.target.value)}
                        className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-700 focus:border-blue-400 focus:outline-none"
                      >
                        {Object.keys(comparisonData).map((k) => (
                          <option key={k} value={k}>{comparisonData[k].label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide w-36"></th>
                          <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">{comparisonData[compareA].label}</th>
                          <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">{comparisonData[compareB].label}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {comparisonRows.map((row, i) => (
                          <tr key={row.key} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                            <td className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{row.label}</td>
                            <td className="px-6 py-3 text-gray-700">{comparisonData[compareA][row.key]}</td>
                            <td className="px-6 py-3 text-gray-700">{comparisonData[compareB][row.key]}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* UK */}
                <section id="country-uk" className="mb-16 scroll-mt-28">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-8 pb-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">\uD83C\uDDEC\uD83C\uDDE7</span>
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900">United Kingdom</h3>
                    </div>
                    <Link to="/uk" className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                      Full guide
                      <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl border border-gray-100 p-6">
                      <h4 className="text-base font-semibold text-gray-900 mb-4">What you need to know</h4>
                      <ul className="space-y-2.5">
                        {countries.find(c => c.code === "UK").highlights.map((h, i) => (
                          <li key={i} className="flex items-start text-gray-700 text-sm">
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 mt-1.5 flex-shrink-0"></span>
                            {h}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 p-6">
                      <h4 className="text-base font-semibold text-gray-900 mb-5">Visa & Licensing</h4>
                      <StepBar steps={["Secure job offer", "Skilled Worker Visa", "RCVS registration", "Health checks"]} />
                      <div className="space-y-3 mt-2">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h5 className="font-semibold text-gray-900 mb-2 text-sm"><AcronymTooltip term="RCVS">RCVS</AcronymTooltip> Registration</h5>
                          <ul className="text-sm text-gray-700 space-y-1">
                            <li>• Mandatory before practising in the UK</li>
                            <li>• EU qualifications may be recognised; non-EU degrees require assessment</li>
                            <li>• English proficiency and health compliance required</li>
                          </ul>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                          <h5 className="font-semibold text-blue-900 mb-2 text-sm">Post-Brexit Visa</h5>
                          <ul className="text-sm text-gray-700 space-y-1">
                            <li>• Skilled Worker Visa required for all non-UK nationals</li>
                            <li>• Job offer from a licensed UK sponsor needed before applying</li>
                            <li>• No automatic right to work for EU citizens post-Brexit</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* USA */}
                <section id="country-usa" className="mb-16 scroll-mt-28">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-8 pb-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">\uD83C\uDDFA\uD83C\uDDF8</span>
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900">United States</h3>
                    </div>
                    <Link to="/usa" className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                      Full guide
                      <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl border border-gray-100 p-6">
                      <h4 className="text-base font-semibold text-gray-900 mb-4">What you need to know</h4>
                      <ul className="space-y-2.5">
                        {countries.find(c => c.code === "USA").highlights.map((h, i) => (
                          <li key={i} className="flex items-start text-gray-700 text-sm">
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 mt-1.5 flex-shrink-0"></span>
                            {h}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 p-6">
                      <h4 className="text-base font-semibold text-gray-900 mb-5">Visa & Licensing</h4>
                      <StepBar steps={["Work visa", "ECFVG / PAVE", "NAVLE exam", "State licence"]} />
                      <div className="space-y-3 mt-2">
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                          <h5 className="font-semibold text-blue-900 mb-2 text-sm">Work Visa</h5>
                          <ul className="text-sm text-gray-700 space-y-1">
                            <li>• Non-U.S. citizens require an appropriate work visa (e.g. H-1B or J-1)</li>
                            <li>• <AcronymTooltip term="AVMA">AVMA</AcronymTooltip> does not issue visas — your employer arranges this via USCIS</li>
                          </ul>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h5 className="font-semibold text-gray-900 mb-2 text-sm">Credential Verification (non-AVMA grads)</h5>
                          <ul className="text-sm text-gray-700 space-y-1">
                            <li>• <AcronymTooltip term="ECFVG">ECFVG</AcronymTooltip> (AVMA): credential check, English test, BCSE, clinical exam</li>
                            <li>• <AcronymTooltip term="PAVE">PAVE</AcronymTooltip> (<AcronymTooltip term="AAVSB">AAVSB</AcronymTooltip>): alternative route — check your state accepts it first</li>
                          </ul>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h5 className="font-semibold text-gray-900 mb-2 text-sm">State Licensing</h5>
                          <ul className="text-sm text-gray-700 space-y-1">
                            <li>• <AcronymTooltip term="NAVLE">NAVLE</AcronymTooltip> required in all 50 states (360 questions)</li>
                            <li>• Each state has additional requirements — contact your state board directly</li>
                          </ul>
                        </div>
                        <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                          <p className="text-xs text-red-800"><strong>Important:</strong> State requirements vary significantly — always verify with the specific state board before you start.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Canada */}
                <section id="country-canada" className="mb-16 scroll-mt-28">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-8 pb-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">\uD83C\uDDE8\uD83C\uDDE6</span>
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900">Canada</h3>
                    </div>
                    <Link to="/canada" className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                      Full guide
                      <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl border border-gray-100 p-6">
                      <h4 className="text-base font-semibold text-gray-900 mb-4">What you need to know</h4>
                      <ul className="space-y-2.5">
                        {countries.find(c => c.code === "Canada").highlights.map((h, i) => (
                          <li key={i} className="flex items-start text-gray-700 text-sm">
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 mt-1.5 flex-shrink-0"></span>
                            {h}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 p-6">
                      <h4 className="text-base font-semibold text-gray-900 mb-5">Visa & Licensing</h4>
                      <StepBar steps={["ECA assessment", "BCSE exam", "NAVLE exam", "Provincial licence", "Immigration"]} />
                      <div className="space-y-3 mt-2">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                            <h5 className="font-semibold text-red-900 mb-1 text-xs">Federal Skilled Worker</h5>
                            <p className="text-xs text-gray-700">Points-based Express Entry system with language and credential requirements</p>
                          </div>
                          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                            <h5 className="font-semibold text-blue-900 mb-1 text-xs">Provincial Nominee (<AcronymTooltip term="PNP">PNP</AcronymTooltip>)</h5>
                            <p className="text-xs text-gray-700">Province-specific; job offer may be required; faster PR possible</p>
                          </div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h5 className="font-semibold text-gray-900 mb-2 text-sm">Licensing Steps</h5>
                          <ol className="text-sm text-gray-700 space-y-1">
                            <li><span className="font-semibold text-blue-700">1.</span> <AcronymTooltip term="ECA">ECA</AcronymTooltip> — credential assessment via <AcronymTooltip term="CVMA">CVMA</AcronymTooltip></li>
                            <li><span className="font-semibold text-blue-700">2.</span> <AcronymTooltip term="NEB">NEB</AcronymTooltip> exams — <AcronymTooltip term="BCSE">BCSE</AcronymTooltip> then <AcronymTooltip term="NAVLE">NAVLE</AcronymTooltip></li>
                            <li><span className="font-semibold text-blue-700">3.</span> Provincial licence — requirements vary by province</li>
                            <li><span className="font-semibold text-blue-700">4.</span> Immigration — work permit or PR pathway</li>
                          </ol>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                          <p className="text-xs text-green-800"><strong>Tip:</strong> Contact both CVMA and your target province's regulatory body — requirements differ significantly between provinces.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Australia */}
                <section id="country-australia" className="mb-16 scroll-mt-28">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-8 pb-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">\uD83C\uDDE6\uD83C\uDDFA</span>
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900">Australia</h3>
                    </div>
                    <Link to="/australia" className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                      Full guide
                      <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl border border-gray-100 p-6">
                      <h4 className="text-base font-semibold text-gray-900 mb-4">What you need to know</h4>
                      <ul className="space-y-2.5">
                        {countries.find(c => c.code === "Australia").highlights.map((h, i) => (
                          <li key={i} className="flex items-start text-gray-700 text-sm">
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 mt-1.5 flex-shrink-0"></span>
                            {h}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 p-6">
                      <h4 className="text-base font-semibold text-gray-900 mb-5">Visa & Licensing</h4>
                      <StepBar steps={["AVBC recognition", "State board", "Visa application", "Start work"]} />
                      <div className="space-y-3 mt-2">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                            <h5 className="font-semibold text-yellow-900 mb-1 text-xs">Skills in Demand (482)</h5>
                            <p className="text-xs text-gray-700">Employer-sponsored temporary visa — most common route for overseas vets</p>
                          </div>
                          <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                            <h5 className="font-semibold text-green-900 mb-1 text-xs">Skilled Migration (189/190/491)</h5>
                            <p className="text-xs text-gray-700">Points-based permanent residency — vets are on the skilled occupation list</p>
                          </div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h5 className="font-semibold text-gray-900 mb-2 text-sm">Registration Requirements</h5>
                          <ul className="text-sm text-gray-700 space-y-1">
                            <li>• Degree must be <AcronymTooltip term="AVBC">AVBC</AcronymTooltip>-recognised, or you'll need to sit the <AcronymTooltip term="AVE">AVE</AcronymTooltip> exam</li>
                            <li>• State/territory veterinary board registration required</li>
                            <li>• English proficiency (IELTS or OET) required</li>
                          </ul>
                        </div>
                        <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                          <p className="text-xs text-yellow-800"><strong>Note:</strong> Vets are in demand across regional and rural Australia, which strengthens PR visa applications.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )}

          </div>
        </main>
      )}

      <SharedFooter />
    </div>
  );
};

export default VeterinaryCareerHub;
