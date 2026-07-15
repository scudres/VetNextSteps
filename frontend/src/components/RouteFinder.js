import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import SharedHeader from "./SharedHeader";
import SharedFooter from "./SharedFooter";
import DisclaimerBanner from "./DisclaimerBanner";
import visaFacts from "../data/visaFacts.json";

// Licensing route finder: pick where you qualified and where you want to work,
// get the registration, exam, and visa steps in order.
//
// Every statement here restates what the country guides already assert; the
// figures come from visaFacts.json, which carries a source URL and a verified
// date for each. Do not add a fee, threshold, or date that isn't in that file.

const ORIGINS = [
  { id: "uk",     label: "United Kingdom" },
  { id: "eu",     label: "EU / EEA" },
  { id: "usa",    label: "United States" },
  { id: "canada", label: "Canada" },
  { id: "anz",    label: "Australia / New Zealand" },
  { id: "other",  label: "Elsewhere" },
];

const DESTINATIONS = {
  uk: {
    name: "United Kingdom",
    flag: "🇬🇧",
    body: "RCVS (Royal College of Veterinary Surgeons)",
    timeline: "3–6 months",
    guidePath: "/uk",
    officialBody: { name: "RCVS and UK Visas & Immigration (UKVI)", url: "https://www.rcvs.org.uk/registration/" },
    steps: [
      {
        title: "Check how the RCVS will register your degree",
        body: (origin) =>
          origin === "uk"
            ? "UK degrees are RCVS-recognised — you register directly with the RCVS."
            : origin === "eu"
            ? "EAEVE-accredited EU degrees are currently recognised by the RCVS; that recognition ends no later than January 2029, subject to annual review. Degrees without recognition go through the RCVS assessment route."
            : "RCVS-recognised degrees register directly; all other degrees go through the RCVS assessment route.",
        link: { label: "RCVS — Register as a Vet Surgeon", url: "https://www.rcvs.org.uk/registration/" },
      },
      {
        title: "Secure a job offer from a licensed UK sponsor",
        body: () => "Non-UK nationals need a job offer from a licensed sponsor before applying for the Skilled Worker Visa. There is no automatic right to work for EU citizens post-Brexit.",
      },
      {
        title: "Apply for the Skilled Worker Visa",
        body: () => "Required for all non-UK nationals. The salary must meet the going rate for veterinarians (SOC 2240).",
        facts: ["uk_going_rate", "uk_new_entrant_rate"],
        link: { label: "UK Skilled Worker Visa — gov.uk", url: "https://www.gov.uk/skilled-worker-visa" },
      },
      {
        title: "Complete RCVS registration before you start practising",
        body: () => "Registration is mandatory before practising in the UK. English proficiency and health compliance may be required.",
      },
    ],
  },
  usa: {
    name: "United States",
    flag: "🇺🇸",
    body: "State veterinary board (each state has its own)",
    timeline: "6–18 months",
    guidePath: "/usa",
    officialBody: { name: "the AVMA and your state veterinary board", url: "https://www.avma.org/education/ecfvg" },
    steps: [
      {
        title: "Credential verification — non-AVMA-accredited degrees only",
        body: (origin) =>
          origin === "usa"
            ? "US veterinary degrees are AVMA-accredited, so ECFVG and PAVE do not apply — go straight to the NAVLE."
            : "If your school is not AVMA-accredited (check the AVMA list — it includes a number of non-US schools), complete ECFVG (AVMA) or PAVE (AAVSB). ECFVG has four steps: enrolment and credential verification, English language assessment, the BCSE, and the CPE practical exam. Check that your target state accepts PAVE before choosing it.",
        facts: ["us_bcse_fee"],
        link: { label: "AVMA — ECFVG Certification", url: "https://www.avma.org/education/ecfvg" },
      },
      {
        title: "Pass the NAVLE",
        body: () => "Required in all 50 states (360 questions).",
        link: { label: "ICVA — NAVLE Examination", url: "https://www.icva.net/navle/" },
      },
      {
        title: "Apply for your state licence",
        body: () => "Each state board sets its own additional requirements — verify with the specific state board before you start.",
      },
      {
        title: "Arrange a work visa",
        body: () => "Non-US citizens need an appropriate work visa (e.g. H-1B or J-1). The AVMA does not issue visas — your employer arranges this via USCIS.",
        link: { label: "AVMA — Guide for Foreign Veterinary Graduates", url: "https://www.avma.org/education/foreign/information-foreign-veterinary-graduates-working-veterinarian-us" },
      },
    ],
  },
  canada: {
    name: "Canada",
    flag: "🇨🇦",
    body: "Provincial regulatory body (varies by province)",
    timeline: "12–24 months",
    guidePath: "/canada",
    officialBody: { name: "CVMA and Immigration, Refugees & Citizenship Canada (IRCC)", url: "https://www.canadianveterinarians.net/education-and-resources/accreditation/eca/" },
    steps: [
      {
        title: "ECA credential assessment via the CVMA",
        body: (origin) =>
          origin === "canada"
            ? "The ECA applies to overseas graduates — if you qualified in Canada, check NEB requirements for your situation with the CVMA."
            : "The CVMA manages credential assessment for overseas graduates.",
        link: { label: "CVMA — Educational Credential Assessment (ECA)", url: "https://www.canadianveterinarians.net/education-and-resources/accreditation/eca/" },
      },
      {
        title: "NEB examinations — BCSE, then NAVLE",
        body: () => "Both exams are taken through the National Examining Board.",
        link: { label: "ICVA — NAVLE Examination", url: "https://www.icva.net/navle/" },
      },
      {
        title: "Apply for your provincial licence",
        body: () => "Requirements differ significantly between provinces — contact both the CVMA and your target province's regulatory body.",
      },
      {
        title: "Immigration — work permit or PR pathway",
        body: () => "Express Entry (Federal Skilled Worker, points-based) or the Provincial Nominee Program (province-specific; a job offer may be required and faster PR is possible). Demand is high in rural and northern regions, which is useful for PR applications.",
        link: { label: "IRCC — Federal Skilled Worker Program", url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/federal-skilled-workers.html" },
      },
    ],
  },
  australia: {
    name: "Australia",
    flag: "🇦🇺",
    body: "State/territory board (AVBC sets national standards)",
    timeline: "6–18 months",
    guidePath: "/australia",
    officialBody: { name: "AVBC and the Australian Department of Home Affairs", url: "https://avbc.asn.au/for-veterinarians/" },
    steps: [
      {
        title: "Check AVBC recognition of your degree",
        body: () => "If your degree is not on the AVBC's generally recognised list, you'll sit the Australasian Veterinary Examination (AVE).",
        link: { label: "AVBC — Qualifications Generally Recognised List", url: "https://avbc.asn.au/veterinary-education/avbc-qualifications-generally-recognised/" },
      },
      {
        title: "English proficiency",
        body: () => "IELTS or OET required.",
      },
      {
        title: "Register with the state or territory veterinary board",
        body: () => "Each state and territory has its own board; the AVBC sets the national standards.",
      },
      {
        title: "Apply for a visa",
        body: () => "Skills in Demand (482) with employer sponsorship is the most common route — the salary must meet the Core Skills Income Threshold. Vets are on the skilled occupation list, so points-based skilled migration (189/190/491) is also open; regional and rural demand strengthens PR applications.",
        facts: ["au_csit"],
        link: { label: "Dept. of Home Affairs — Skills in Demand Visa (482)", url: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skills-in-demand-visa-subclass-482" },
      },
    ],
  },
};

const formatVerified = (iso) =>
  new Date(iso + "T00:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

// A figure from visaFacts.json: value, context, source link, verification date.
const FactLine = ({ factKey }) => {
  const f = visaFacts.facts[factKey];
  if (!f) return null;
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 mt-2 text-xs text-gray-600 leading-relaxed">
      <span className="font-semibold text-gray-900">{f.value}</span> — {f.detail}.{" "}
      <a href={f.source} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Source</a>
      {" · "}verified {formatVerified(f.verified)}
    </div>
  );
};

const RouteFinder = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const from = ORIGINS.some((o) => o.id === searchParams.get("from")) ? searchParams.get("from") : "uk";
  const to   = DESTINATIONS[searchParams.get("to")] ? searchParams.get("to") : "australia";
  const dest = DESTINATIONS[to];

  const setRoute = (key, value) => {
    const params = new URLSearchParams(searchParams);
    params.set("from", key === "from" ? value : from);
    params.set("to",   key === "to"   ? value : to);
    setSearchParams(params, { replace: true });
  };

  // "Qualified in the destination country" pairs where the international steps
  // mostly don't apply — flag it rather than walking a UK grad through UK visas.
  const sameCountry =
    (from === "uk" && to === "uk") ||
    (from === "usa" && to === "usa") ||
    (from === "canada" && to === "canada") ||
    (from === "anz" && to === "australia");

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Vet Licensing Route Finder | VetNextStep</title>
        <meta name="description" content="Registration, exam, and visa steps in order for vets moving to the UK, USA, Canada, or Australia — based on where you qualified." />
        <link rel="canonical" href="https://vetnextstep.com/licensing-route" />
        <meta property="og:title" content="Vet Licensing Route Finder | VetNextStep" />
        <meta property="og:description" content="Registration, exam, and visa steps in order for vets moving to the UK, USA, Canada, or Australia — based on where you qualified." />
        <meta property="og:url" content="https://vetnextstep.com/licensing-route" />
        <meta property="og:image" content="https://vetnextstep.com/og-image.png" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://vetnextstep.com/og-image.png" />
      </Helmet>
      <SharedHeader />
      <main className="py-8 md:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3">Licensing route finder</h1>
          <p className="text-gray-600 mb-8">
            Pick where you qualified and where you want to work — the registration, exam, and visa steps for that route, in order.
          </p>

          {/* Route selection — encoded in the URL so a chosen route is a shareable link */}
          <div className="flex flex-wrap items-end gap-4 mb-8 p-5 bg-gray-50 border border-gray-200 rounded-xl">
            <label className="block">
              <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">I qualified in</span>
              <select
                value={from}
                onChange={(e) => setRoute("from", e.target.value)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 focus:border-blue-400 focus:outline-none"
              >
                {ORIGINS.map((o) => (
                  <option key={o.id} value={o.id}>{o.label}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">I want to work in</span>
              <select
                value={to}
                onChange={(e) => setRoute("to", e.target.value)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 focus:border-blue-400 focus:outline-none"
              >
                {Object.entries(DESTINATIONS).map(([id, d]) => (
                  <option key={id} value={id}>{d.name}</option>
                ))}
              </select>
            </label>
          </div>

          {/* Route summary */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-8 text-sm text-gray-600">
            <span className="text-2xl">{dest.flag}</span>
            <span><span className="font-semibold text-gray-900">Registration body:</span> {dest.body}</span>
            <span><span className="font-semibold text-gray-900">Typical timeline:</span> {dest.timeline}</span>
          </div>

          {sameCountry && (
            <p className="text-sm text-gray-500 mb-8 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
              The steps below are for internationally qualified vets. If you qualified in {dest.name}, most won't apply —{" "}
              <Link to={dest.guidePath} className="text-blue-600 hover:underline font-medium">see the full {dest.name} guide</Link>{" "}
              for career development options instead.
            </p>
          )}

          {/* Steps — sequential, so numbered */}
          <ol className="space-y-6 mb-10">
            {dest.steps.map((step, i) => (
              <li key={step.title} className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </div>
                <div className="min-w-0">
                  <h2 className="text-base font-semibold text-gray-900 mb-1">{step.title}</h2>
                  <p className="text-sm text-gray-600 leading-relaxed">{step.body(from)}</p>
                  {step.facts && step.facts.map((k) => <FactLine key={k} factKey={k} />)}
                  {step.link && (
                    <a
                      href={step.link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center mt-2 text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                      {step.link.label}
                      <svg className="ml-1.5 w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ol>

          <div className="mb-10">
            <Link
              to={dest.guidePath}
              className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              Full {dest.name} guide
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <DisclaimerBanner officialBody={dest.officialBody} />
        </div>
      </main>
      <SharedFooter />
    </div>
  );
};

export default RouteFinder;
