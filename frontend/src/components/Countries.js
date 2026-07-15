import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import SharedHeader from "./SharedHeader";
import AcronymTooltip from "./AcronymTooltip";
import DisclaimerBanner from "./DisclaimerBanner";
import SharedFooter from "./SharedFooter";

// Promoted from the old homepage "?tab=countries" query-param view to its own
// indexable URL — the comparison table and per-country summaries had no URL
// of their own to rank for searches like "vet licensing UK vs Australia".

const comparisonData = {
  UK: {
    label: "United Kingdom 🇬🇧",
    body: "RCVS (Royal College of Veterinary Surgeons)",
    exam: "None for RCVS-recognised degrees; assessment for all others",
    mainVisa: "Skilled Worker Visa",
    sponsor: "Yes — from a licensed UK sponsor",
    english: "Possible requirement",
    timeline: "3–6 months",
    demand: "High — small animal GP especially",
  },
  USA: {
    label: "United States 🇺🇸",
    body: "State veterinary board (each state has its own)",
    exam: "NAVLE (all grads) + ECFVG or PAVE (non-AVMA grads only)",
    mainVisa: "H-1B or J-1 (employer arranges)",
    sponsor: "Yes — employer must arrange",
    english: "Yes",
    timeline: "6–18 months",
    demand: "High nationally",
  },
  Canada: {
    label: "Canada 🇨🇦",
    body: "Provincial regulatory body (varies by province)",
    exam: "ECA credential assessment, then BCSE, then NAVLE (via NEB)",
    mainVisa: "Express Entry or Provincial Nominee Program (PNP)",
    sponsor: "Not always required",
    english: "English or French",
    timeline: "12–24 months",
    demand: "High — especially rural and northern regions",
  },
  Australia: {
    label: "Australia 🇦🇺",
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

const countries = [
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
];

const COUNTRY_CODES = Object.keys(comparisonData);
const DEFAULT_COMPARE = ["UK", "Australia"];

const Countries = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [linkCopied, setLinkCopied] = useState(false);

  // The comparison selection lives in the URL (?compare=UK,Australia,USA) so a
  // built-up comparison is a shareable link. 2–4 countries.
  const urlCompare = [...new Set(
    (searchParams.get("compare") || "").split(",").filter((c) => COUNTRY_CODES.includes(c))
  )];
  const compareList = urlCompare.length >= 2 ? urlCompare.slice(0, 4) : DEFAULT_COMPARE;

  const setCompareList = (list) => {
    const params = new URLSearchParams(searchParams);
    params.set("compare", list.join(","));
    setSearchParams(params, { replace: true });
  };

  const changeCompareCountry = (index, code) => {
    const next = [...compareList];
    const existing = next.indexOf(code);
    if (existing !== -1) next[existing] = next[index]; // swap to avoid duplicate columns
    next[index] = code;
    setCompareList(next);
  };

  const addCompareCountry = () => {
    const unused = COUNTRY_CODES.find((c) => !compareList.includes(c));
    if (unused) setCompareList([...compareList, unused]);
  };

  const removeCompareCountry = (index) =>
    setCompareList(compareList.filter((_, i) => i !== index));

  const copyCompareLink = () => {
    const url = `${window.location.origin}/countries?compare=${compareList.join(",")}`;
    navigator.clipboard.writeText(url).then(() => {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    }).catch(() => {});
  };

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Countries & Licensing for Vets | VetNextStep</title>
        <meta name="description" content="Registration bodies, key exams, visa routes, and typical timelines for vets working in the UK, USA, Canada, or Australia — with a side-by-side comparison tool." />
        <link rel="canonical" href="https://vetnextstep.com/countries" />
        <meta property="og:title" content="Countries & Licensing for Vets | VetNextStep" />
        <meta property="og:description" content="Registration bodies, key exams, visa routes, and typical timelines for vets working in the UK, USA, Canada, or Australia." />
        <meta property="og:url" content="https://vetnextstep.com/countries" />
        <meta property="og:image" content="https://vetnextstep.com/og-image.png" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Countries & Licensing for Vets | VetNextStep" />
        <meta name="twitter:description" content="Registration bodies, key exams, visa routes, and typical timelines for vets working in the UK, USA, Canada, or Australia." />
        <meta name="twitter:image" content="https://vetnextstep.com/og-image.png" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://vetnextstep.com/" },
            { "@type": "ListItem", "position": 2, "name": "Countries & Licensing", "item": "https://vetnextstep.com/countries" }
          ]
        })}</script>
      </Helmet>
      <SharedHeader />
      <main className="py-8 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">Countries & Licensing</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-5">
              Pick your destination. Below you'll find the registration steps, visa routes, and key exams for each country.
            </p>
            <Link
              to="/licensing-route"
              className="inline-flex items-center border border-blue-600 text-blue-600 hover:bg-blue-50 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              Find your route step by step
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
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
                    <img
                      src={country.image}
                      srcSet={`${country.image.replace('w=600', 'w=400')} 400w, ${country.image} 600w, ${country.image.replace('w=600', 'w=900')} 900w`}
                      sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
                      alt={country.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      width="600"
                      height="400"
                    />
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

          {/* Country comparison builder — selection is URL-encoded so the table is shareable */}
          <div className="mb-16 border border-gray-200 rounded-xl overflow-hidden">
            <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex flex-wrap items-center gap-3">
              <span className="text-sm font-semibold text-gray-700">Compare countries</span>
              {compareList.map((code, index) => (
                <div key={code} className="flex items-center gap-1">
                  <select
                    value={code}
                    onChange={(e) => changeCompareCountry(index, e.target.value)}
                    className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-700 focus:border-blue-400 focus:outline-none"
                  >
                    {COUNTRY_CODES.map((k) => (
                      <option key={k} value={k}>{comparisonData[k].label}</option>
                    ))}
                  </select>
                  {compareList.length > 2 && (
                    <button
                      onClick={() => removeCompareCountry(index)}
                      aria-label={`Remove ${comparisonData[code].label} from comparison`}
                      className="text-gray-400 hover:text-gray-600 px-1 text-sm"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              {compareList.length < 4 && (
                <button
                  onClick={addCompareCountry}
                  className="px-3 py-1.5 text-sm border border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors"
                >
                  + Add country
                </button>
              )}
              <button
                onClick={copyCompareLink}
                className="ml-auto px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-700 hover:border-blue-400 hover:text-blue-600 transition-colors"
              >
                {linkCopied ? "Link copied" : "Copy link"}
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide w-36"></th>
                    {compareList.map((code) => (
                      <th key={code} className="text-left px-6 py-3 text-sm font-semibold text-gray-900">{comparisonData[code].label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row, i) => (
                    <tr key={row.key} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{row.label}</td>
                      {compareList.map((code) => (
                        <td key={code} className="px-6 py-3 text-gray-700">{comparisonData[code][row.key]}</td>
                      ))}
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
                <span className="text-3xl">🇬🇧</span>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">United Kingdom</h2>
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
                <h3 className="text-base font-semibold text-gray-900 mb-4">What you need to know</h3>
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
                <h3 className="text-base font-semibold text-gray-900 mb-5">Visa & Licensing</h3>
                <StepBar steps={["Secure job offer", "Skilled Worker Visa", "RCVS registration", "Health checks"]} />
                <div className="space-y-3 mt-2">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2 text-sm"><AcronymTooltip term="RCVS">RCVS</AcronymTooltip> Registration</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Mandatory before practising in the UK</li>
                      <li>• EU qualifications may be recognised; non-EU degrees require assessment</li>
                      <li>• English proficiency and health compliance required</li>
                    </ul>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-2 text-sm">Post-Brexit Visa</h4>
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
                <span className="text-3xl">🇺🇸</span>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">United States</h2>
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
                <h3 className="text-base font-semibold text-gray-900 mb-4">What you need to know</h3>
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
                <h3 className="text-base font-semibold text-gray-900 mb-5">Visa & Licensing</h3>
                <StepBar steps={["Work visa", "ECFVG / PAVE", "NAVLE exam", "State licence"]} />
                <div className="space-y-3 mt-2">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-2 text-sm">Work Visa</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Non-U.S. citizens require an appropriate work visa (e.g. H-1B or J-1)</li>
                      <li>• <AcronymTooltip term="AVMA">AVMA</AcronymTooltip> does not issue visas — your employer arranges this via USCIS</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2 text-sm">Credential Verification (non-AVMA grads)</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• <AcronymTooltip term="ECFVG">ECFVG</AcronymTooltip> (AVMA): credential check, English test, BCSE, clinical exam</li>
                      <li>• <AcronymTooltip term="PAVE">PAVE</AcronymTooltip> (<AcronymTooltip term="AAVSB">AAVSB</AcronymTooltip>): alternative route — check your state accepts it first</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2 text-sm">State Licensing</h4>
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
                <span className="text-3xl">🇨🇦</span>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Canada</h2>
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
                <h3 className="text-base font-semibold text-gray-900 mb-4">What you need to know</h3>
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
                <h3 className="text-base font-semibold text-gray-900 mb-5">Visa & Licensing</h3>
                <StepBar steps={["ECA assessment", "BCSE exam", "NAVLE exam", "Provincial licence", "Immigration"]} />
                <div className="space-y-3 mt-2">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                      <h4 className="font-semibold text-red-900 mb-1 text-xs">Federal Skilled Worker</h4>
                      <p className="text-xs text-gray-700">Points-based Express Entry system with language and credential requirements</p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-900 mb-1 text-xs">Provincial Nominee (<AcronymTooltip term="PNP">PNP</AcronymTooltip>)</h4>
                      <p className="text-xs text-gray-700">Province-specific; job offer may be required; faster PR possible</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2 text-sm">Licensing Steps</h4>
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
                <span className="text-3xl">🇦🇺</span>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Australia</h2>
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
                <h3 className="text-base font-semibold text-gray-900 mb-4">What you need to know</h3>
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
                <h3 className="text-base font-semibold text-gray-900 mb-5">Visa & Licensing</h3>
                <StepBar steps={["AVBC recognition", "State board", "Visa application", "Start work"]} />
                <div className="space-y-3 mt-2">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                      <h4 className="font-semibold text-yellow-900 mb-1 text-xs">Skills in Demand (482)</h4>
                      <p className="text-xs text-gray-700">Employer-sponsored temporary visa — most common route for overseas vets</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                      <h4 className="font-semibold text-green-900 mb-1 text-xs">Skilled Migration (189/190/491)</h4>
                      <p className="text-xs text-gray-700">Points-based permanent residency — vets are on the skilled occupation list</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2 text-sm">Registration Requirements</h4>
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
      </main>
      <SharedFooter />
    </div>
  );
};

export default Countries;
