import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import SharedHeader from "./SharedHeader";
import { CountryAxis } from "./PathwayRail";
import DisclaimerBanner from "./DisclaimerBanner";
import SharedFooter from "./SharedFooter";
import { GuideLayout, ExtLink, linkClass } from "./Guide";
import visaFacts from "../data/visaFacts.json";

const { facts } = visaFacts;

/**
 * Interactive decision-tree guide: getting your first veterinary role in the UK.
 * Three questions — degree origin, visa status, first-role priorities — each
 * answer reveals the concrete next steps for that path.
 */

const QUALIFICATION_OPTIONS = [
  {
    id: "uk",
    label: "A UK vet school",
    steps: [
      { title: "Register with the RCVS", body: "Your degree gives automatic entitlement to register. Apply up to six months before you want to join the Register.", href: "https://www.rcvs.org.uk/registration/", external: true },
      { title: "No exams or visa needed", body: "You can go straight to finding your first role — skip to question 3 unless you hold a non-UK passport without settled status." },
    ],
  },
  {
    id: "eaeve",
    label: "An EAEVE-accredited EU school",
    steps: [
      { title: `Register before ${facts.uk_eaeve_deadline.value}`, body: `The RCVS currently recognises EAEVE-accredited degrees, but this arrangement ends no later than ${facts.uk_eaeve_deadline.value} (reviewed annually). After that, only RCVS-accredited degrees are accepted — later registrations would need the statutory exam.`, href: facts.uk_eaeve_deadline.source, external: true },
      { title: "English language proficiency", body: "Required unless your degree was taught and assessed entirely in English." },
      { title: "Letter of good standing", body: "From the regulator where you are currently registered (if applicable)." },
    ],
  },
  {
    id: "rcvs-overseas",
    label: "An RCVS-accredited overseas school",
    steps: [
      { title: "Register directly with the RCVS", body: "Degrees from RCVS-accredited schools (including several in Australia, New Zealand, and North America) entitle you to register without further examination.", href: "https://www.rcvs.org.uk/registration/", external: true },
      { title: "English language proficiency", body: "Required unless your degree was taught and assessed entirely in English." },
    ],
  },
  {
    id: "other",
    label: "A school not accredited by RCVS or EAEVE",
    steps: [
      { title: "RCVS Statutory Membership Examination", body: "You must pass the statutory exam before you can register. Submit a declaration of intention to sit (valid to the end of September), then apply — the annual application deadline is 14 January, with written exams in March and the OSCE later in the year.", href: "https://www.rcvs.org.uk/registration/join-the-register-of-veterinary-surgeons/statutory-membership-exam", external: true },
      { title: "Plan around one exam cycle per year", body: "Places are limited and the exam runs annually — build this into your timeline before arranging employment or a visa." },
    ],
  },
];

const VISA_OPTIONS = [
  {
    id: "no-visa",
    label: "No — UK/Irish citizen or settled status",
    steps: [
      { title: "No visa needed", body: "You have the right to work in the UK — move on to question 3." },
    ],
  },
  {
    id: "visa",
    label: "Yes — I'll need a visa",
    steps: [
      { title: "Skilled Worker visa", body: "The standard route for vets. You need a job offer from a practice holding a valid sponsor licence — confirm sponsorship before accepting any role.", href: "https://www.gov.uk/skilled-worker-visa", external: true },
      { title: `Salary threshold: ${facts.uk_going_rate.value}/year`, body: `The going rate for veterinary surgeons, based on a 37.5-hour week (${facts.uk_going_rate.hourlyValue}). For longer contracted hours, gross salary must scale up pro rata to clear that hourly rate. A reduced new entrant rate of ${facts.uk_new_entrant_rate.value} may apply if you are under 26, your Student or Graduate visa expired within the last ${facts.uk_new_entrant_window.value}, or you're working towards professional registration. Verify against the official going-rates table — figures change most years.`, href: facts.uk_going_rate.source, external: true },
      { title: "Order matters", body: "Secure the job offer first; your employer then assigns a Certificate of Sponsorship, and you apply for the visa. RCVS registration completes the picture — most employers expect it to be in progress." },
    ],
  },
];

const ROLE_STEPS = [
  { title: "Look for a VetGDP-accredited practice", body: "The RCVS Veterinary Graduate Development Programme is mandatory for new graduates in their first role. Accredited practices provide a trained VetGDP Adviser and structured support over your first 12–18 months — look for the VetGDP logo on job adverts.", href: "https://www.rcvs.org.uk/lifelong-learning/veterinary-graduate-development-programme-vetgdp/", external: true },
  { title: "Compare graduate development programmes", body: "The major UK groups — CVS, IVC Evidensia, Linnaeus, Medivet, Vets4Pets, VetPartners — all run structured graduate schemes with mentoring and protected CPD.", to: "/training-programs/uk" },
  { title: "Considering referral practice later?", body: "Rotating internships at university teaching hospitals and referral centres are the usual first step towards specialisation.", to: "/internships-residencies/uk" },
  { title: "Keep an eye on CPD and conferences", body: "London Vet Show, BSAVA Alba, and BVA Live are the big UK dates — early-bird rates reward planning ahead.", to: "/cpd/uk" },
];

const StepCard = ({ step, index }) => (
  <li className="flex items-start gap-3 py-3 border-b border-gray-200 last:border-b-0">
    <span className="tabular-nums text-sm font-bold text-gray-500 w-4 flex-shrink-0 pt-px">{index + 1}</span>
    <div>
      <p className="text-sm font-bold text-gray-900 mb-0.5">{step.title}</p>
      <p className="text-sm text-gray-700 leading-relaxed max-w-[68ch]">{step.body}</p>
      {step.href && (
        <p className="mt-1 text-sm"><ExtLink href={step.href}>Official information</ExtLink></p>
      )}
      {step.to && (
        <p className="mt-1 text-sm"><Link to={step.to} className={linkClass}>View on VetNextStep</Link></p>
      )}
    </div>
  </li>
);

const QuestionBlock = ({ number, title, options, selected, onSelect }) => (
  <section className="mt-10 first:mt-0 pt-8 border-t border-gray-200 first:pt-0 first:border-t-0">
    <h2 className="text-xl font-bold tracking-tight text-gray-900 mb-4">
      <span className="tabular-nums text-gray-500 mr-2">{number}</span>{title}
    </h2>
    <div className="flex flex-wrap gap-2 mb-4" role="group" aria-label={title}>
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          aria-pressed={selected === opt.id}
          onClick={() => onSelect(opt.id)}
          className={`px-3.5 py-2 border text-sm text-left transition-colors ${
            selected === opt.id
              ? "bg-[#0c2b4b] text-white border-[#0c2b4b]"
              : "bg-white text-gray-900 border-gray-300 hover:border-blue-800"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
    {selected && (
      <ol className="border-t border-gray-300">
        {options.find((o) => o.id === selected).steps.map((step, i) => (
          <StepCard key={i} step={step} index={i} />
        ))}
      </ol>
    )}
  </section>
);

const UKFirstRoleGuide = () => {
  const [qualification, setQualification] = useState(null);
  const [visa, setVisa] = useState(null);

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Getting Your First Vet Job in the UK — Step-by-Step Guide | VetNextStep</title>
        <meta name="description" content="Interactive step-by-step guide to your first veterinary role in the UK: RCVS registration routes by degree, Skilled Worker visa requirements, and VetGDP — tailored to your situation." />
        <link rel="canonical" href="https://vetnextstep.com/uk/first-role" />
        <meta property="og:title" content="Getting Your First Vet Job in the UK — Step-by-Step | VetNextStep" />
        <meta property="og:description" content="Answer three questions and get the exact registration, visa, and first-role steps for your situation." />
        <meta property="og:url" content="https://vetnextstep.com/uk/first-role" />
        <meta property="og:image" content="https://vetnextstep.com/og-image.png" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Getting Your First Vet Job in the UK — Step-by-Step | VetNextStep" />
        <meta name="twitter:description" content="Answer three questions and get the exact registration, visa, and first-role steps for your situation." />
        <meta name="twitter:image" content="https://vetnextstep.com/og-image.png" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://vetnextstep.com/" },
            { "@type": "ListItem", "position": 2, "name": "Working as a Vet in the UK", "item": "https://vetnextstep.com/uk" },
            { "@type": "ListItem", "position": 3, "name": "Getting Your First UK Role", "item": "https://vetnextstep.com/uk/first-role" }
          ]
        })}</script>
      </Helmet>

      <SharedHeader />
      <CountryAxis here="/uk" />

      <GuideLayout
        crumbs={[
          { label: "Home", to: "/" },
          { label: "Countries & licensing", to: "/countries" },
          { label: "United Kingdom", to: "/uk" },
          { label: "Your first UK role" },
        ]}
        title="Your first UK role, step by step"
        lede="Three questions about your degree, your visa status and what you want from a first job. Each answer shows the registration, visa or job-search steps that apply."
      >
        <div className="max-w-3xl">
          <DisclaimerBanner
            officialBody={{ name: "RCVS and UK Visas & Immigration (UKVI)", url: "https://www.rcvs.org.uk/registration/" }}
          />

          <QuestionBlock
            number={1}
            title="Where did you qualify, or where will you?"
            options={QUALIFICATION_OPTIONS}
            selected={qualification}
            onSelect={setQualification}
          />

          <QuestionBlock
            number={2}
            title="Will you need a visa to work in the UK?"
            options={VISA_OPTIONS}
            selected={visa}
            onSelect={setVisa}
          />

          <section className="mt-10 pt-8 border-t border-gray-200">
            <h2 className="text-xl font-bold tracking-tight text-gray-900 mb-4">
              <span className="tabular-nums text-gray-500 mr-2">3</span>Finding the right first role
            </h2>
            <ol className="border-t border-gray-300">
              {ROLE_STEPS.map((step, i) => (
                <StepCard key={i} step={step} index={i} />
              ))}
            </ol>
          </section>

          <p className="mt-10 text-sm">
            <Link to="/uk" className={linkClass}>Read the full UK licensing and visa guide</Link>
          </p>
        </div>
      </GuideLayout>

      <SharedFooter />
    </div>
  );
};

export default UKFirstRoleGuide;
