import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import SharedHeader from "./SharedHeader";
import { CountryAxis } from "./PathwayRail";
import DisclaimerBanner from "./DisclaimerBanner";
import SharedFooter from "./SharedFooter";
import { GuideLayout, GuideSection, P, Bullets, Callout, Route, linkClass } from "./Guide";

// Promoted from the old homepage "?tab=countries" query-param view to its own
// indexable URL — the comparison table and per-country summaries had no URL
// of their own to rank for searches like "vet licensing UK vs Australia".

const comparisonData = {
  UK: {
    label: "United Kingdom",
    body: "RCVS (Royal College of Veterinary Surgeons)",
    exam: "None for RCVS-recognised degrees, including AVMA, AVBC and (until Jan 2029) EAEVE schools; RCVS Statutory Exam for all others",
    mainVisa: "Skilled Worker Visa; Youth Mobility if from Australia, Canada or New Zealand",
    sponsor: "Yes for Skilled Worker (licensed UK sponsor); no for Youth Mobility; Irish citizens need no visa",
    english: "IELTS 7.0 overall (6.5 in one component) or OET Grade B (C+ in one); not required if degree taught and assessed entirely in English",
    timeline: "3–6 months",
    demand: "High — small animal GP especially",
  },
  USA: {
    label: "United States",
    body: "State veterinary board (each state has its own)",
    exam: "NAVLE (all grads) + ECFVG or PAVE (non-AVMA grads only)",
    mainVisa: "H-1B, TN (Canadian and Mexican citizens), E-3 (Australian citizens) or J-1 (employer arranges)",
    sponsor: "Yes — employer must arrange",
    english: "Yes",
    timeline: "6–18 months",
    demand: "High nationally",
  },
  Canada: {
    label: "Canada",
    body: "Provincial regulatory body (varies by province)",
    exam: "NAVLE only for AVMA/CVMA-accredited degrees; otherwise an NEB Certificate of Qualification (BCSE, NAVLE, CPE) or the NEB + PAVE route",
    mainVisa: "Express Entry or Provincial Nominee Program (PNP)",
    sponsor: "Not always required",
    english: "English or French",
    timeline: "12–24 months",
    demand: "High — especially rural and northern regions",
  },
  Australia: {
    label: "Australia",
    body: "State/territory board (AVBC sets national standards)",
    exam: "None for AVBC-recognised degrees (including UK schools via the RCVS agreement); AVE for all others",
    mainVisa: "482 Skills in Demand (employer sponsor), 189/190/491 skilled migration, or 417/462 Working Holiday",
    sponsor: "Yes for 482 visa; no for skilled migration or Working Holiday",
    english: "IELTS or OET required unless degree taught and assessed entirely in English",
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

const countries = [
  {
    name: "Australia",
    code: "Australia",
    path: "/australia",
    steps: ["AVBC recognition", "State board", "Visa application", "Start work"],
    highlights: [
      "Your degree needs to be AVBC-recognised — if not, you'll sit the AVE exam",
      "Skills in Demand visa (482) with employer sponsorship is the most common route",
      "Vets are on the skilled occupation list — PR pathways (189/190/491) are open",
    ],
  },
  {
    name: "Canada",
    code: "Canada",
    path: "/canada",
    steps: ["Credential assessment", "BCSE exam", "NAVLE exam", "Provincial licence", "Immigration"],
    highlights: [
      "Licence through your province's own regulatory body",
      "CVMA manages credential assessment for overseas graduates",
      "Strong demand in rural and northern communities — useful for PR applications",
    ],
  },
  {
    name: "United Kingdom",
    code: "UK",
    path: "/uk",
    steps: ["Secure job offer", "Skilled Worker visa", "RCVS registration", "Health checks"],
    highlights: [
      "Register with RCVS before you start practising",
      "CertAVP is the main postgrad certificate route — multiple universities offer it",
      "Strong referral sector with structured graduate programmes at the major corporate groups",
    ],
  },
  {
    name: "United States",
    code: "USA",
    path: "/usa",
    steps: ["Work visa", "ECFVG or PAVE", "NAVLE exam", "State licence"],
    highlights: [
      "Sit the NAVLE in your target state — required in all 50",
      "Apply through VIRMP if you want a rotating internship before specialist training",
      "Each state board sets its own additional licensing requirements",
    ],
  },
];

// Same order as the registration strip under the menu.
const GUIDE_ORDER = ["UK", "USA", "Canada", "Australia"];
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
      <CountryAxis />
      <GuideLayout
        crumbs={[{ label: "Home", to: "/" }, { label: "Countries & licensing" }]}
        title="Countries & Licensing"
        lede="Registration body, exams, visa route and typical timeline for the UK, USA, Canada and Australia, side by side, with the steps for each country in order."
      >
        <DisclaimerBanner officialBody={null} />

        <Callout title="Know where you qualified and where you want to work?">
          The <Link to="/licensing-route" className={linkClass}>licensing route finder</Link> lists the registration, exam and visa steps for that route, in order.
        </Callout>

        <GuideSection id="compare" title="Compare countries side by side">
          {/* The selection is URL-encoded so the table is shareable */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {compareList.map((code, index) => (
              <div key={code} className="flex items-center gap-1">
                <select
                  value={code}
                  onChange={(e) => changeCompareCountry(index, e.target.value)}
                  aria-label={`Country ${index + 1}`}
                  className="px-2.5 py-1.5 text-sm border border-gray-300 bg-white text-gray-900 focus:border-blue-800 focus:outline-none"
                >
                  {COUNTRY_CODES.map((k) => (
                    <option key={k} value={k}>{comparisonData[k].label}</option>
                  ))}
                </select>
                {compareList.length > 2 && (
                  <button
                    onClick={() => removeCompareCountry(index)}
                    aria-label={`Remove ${comparisonData[code].label} from comparison`}
                    className="text-gray-500 hover:text-gray-900 px-1.5 text-sm"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            {compareList.length < 4 && (
              <button
                onClick={addCompareCountry}
                className="px-2.5 py-1.5 text-sm border border-gray-300 bg-white text-blue-800 hover:border-blue-800"
              >
                Add a country
              </button>
            )}
            <button
              onClick={copyCompareLink}
              className="sm:ml-auto px-2.5 py-1.5 text-sm border border-gray-300 bg-white text-blue-800 hover:border-blue-800"
            >
              {linkCopied ? "Link copied" : "Copy link to this comparison"}
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[40rem] text-sm border-t border-gray-300">
              <caption className="sr-only">Registration, exams, visas and timelines for the selected countries</caption>
              <thead>
                <tr>
                  <td className="border-b border-gray-300 w-36" />
                  {compareList.map((code) => (
                    <th key={code} scope="col" className="text-left align-bottom font-bold text-gray-900 py-2 pr-5 border-b border-gray-300">
                      {comparisonData[code].label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row) => (
                  <tr key={row.key}>
                    <th scope="row" className="text-left align-top font-semibold text-gray-900 py-2.5 pr-5 border-b border-gray-200">{row.label}</th>
                    {compareList.map((code) => (
                      <td key={code} className="align-top leading-relaxed text-gray-700 py-2.5 pr-5 border-b border-gray-200">{comparisonData[code][row.key]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GuideSection>

        {GUIDE_ORDER.map((code) => countries.find((c) => c.code === code)).map((country) => (
          <GuideSection key={country.code} id={`country-${country.code.toLowerCase()}`} title={`${country.name}: the route in order`}>
            <Route steps={country.steps.map((title) => ({ title }))} />
            <Bullets>
              {country.highlights.map((h) => <li key={h}>{h}</li>)}
            </Bullets>
            <P>
              <Link to={country.path} className={linkClass}>Read the full {country.name} guide</Link>
            </P>
          </GuideSection>
        ))}
      </GuideLayout>
      <SharedFooter />
    </div>
  );
};

export default Countries;
