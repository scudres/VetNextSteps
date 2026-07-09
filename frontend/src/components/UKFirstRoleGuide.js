import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import SharedHeader from "./SharedHeader";
import DisclaimerBanner from "./DisclaimerBanner";
import SharedFooter from "./SharedFooter";
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
      { title: `Salary threshold: ${facts.uk_going_rate.value}/year`, body: `The going rate for veterinary surgeons (rate effective 22 July 2025). A reduced new entrant rate of ${facts.uk_new_entrant_rate.value} may apply if you are under 26, recently graduated, or working towards professional registration. Verify against the official going-rates table — figures change most years.`, href: facts.uk_going_rate.source, external: true },
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
  <li className="flex items-start gap-3">
    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0">
      {index + 1}
    </span>
    <div>
      <p className="text-sm font-semibold text-gray-900 mb-0.5">{step.title}</p>
      <p className="text-sm text-gray-600 leading-relaxed">{step.body}</p>
      {step.href && (
        <a href={step.href} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline">
          Official information →
        </a>
      )}
      {step.to && (
        <Link to={step.to} className="text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline">
          View on VetNextStep →
        </Link>
      )}
    </div>
  </li>
);

const QuestionBlock = ({ number, title, options, selected, onSelect }) => (
  <section className="bg-white rounded-xl shadow-lg p-6 md:p-8">
    <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-5">
      <span className="text-blue-600 mr-2">{number}.</span>{title}
    </h2>
    <div className="flex flex-wrap gap-2 mb-5">
      {options.map((opt) => (
        <button
          key={opt.id}
          onClick={() => onSelect(opt.id)}
          className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${
            selected === opt.id
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:text-blue-700"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
    {selected && (
      <ol className="space-y-4 bg-blue-50 border border-blue-100 rounded-lg p-5">
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
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

      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-12 md:py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-5xl mb-4">🧭</div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Your First UK Role, Step by Step</h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
            Answer three questions and get the registration, visa, and first-job steps that apply to you.
          </p>
        </div>
      </section>

      <main className="py-8 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

          <DisclaimerBanner
            officialBody={{ name: "RCVS and UK Visas & Immigration (UKVI)", url: "https://www.rcvs.org.uk/registration/" }}
          />

          <QuestionBlock
            number={1}
            title="Where did you qualify (or where will you)?"
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

          <section className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-5">
              <span className="text-blue-600 mr-2">3.</span>Finding the right first role
            </h2>
            <ol className="space-y-4 bg-green-50 border border-green-100 rounded-lg p-5">
              {ROLE_STEPS.map((step, i) => (
                <StepCard key={i} step={step} index={i} />
              ))}
            </ol>
          </section>

          <div className="text-center pt-2">
            <Link to="/uk" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm">
              ← Full UK licensing &amp; visa guide
            </Link>
          </div>

        </div>
      </main>

      <SharedFooter />
    </div>
  );
};

export default UKFirstRoleGuide;
