import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import SharedHeader from "./SharedHeader";
import DisclaimerBanner from "./DisclaimerBanner";
import SharedFooter from "./SharedFooter";

const AustraliaPage = () => {
  const organisations = [
    { name: "AVBC — Australasian Veterinary Boards Council", url: "https://avbc.asn.au/" },
    { name: "AVBC — Qualifications Generally Recognised List", url: "https://avbc.asn.au/veterinary-education/avbc-qualifications-generally-recognised/" },
    { name: "AVBC — Australasian Veterinary Examination (AVE)", url: "https://avbc.asn.au/for-veterinarians/australasian-veterinary-examination/" },
    { name: "AVA — Australian Veterinary Association", url: "https://www.ava.com.au/" },
    { name: "Dept. of Home Affairs — Skills in Demand Visa (482)", url: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skills-in-demand-visa-subclass-482" },
    { name: "Dept. of Home Affairs — Skilled Independent Visa (189)", url: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-independent-189" },
    { name: "Dept. of Home Affairs — Skilled Nominated Visa (190)", url: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-nominated-190" },
    { name: "Dept. of Home Affairs — Skilled Regional Visa (491)", url: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-work-regional-provisional-491" },
    { name: "Dept. of Home Affairs — Employer Nomination Scheme (186)", url: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/employer-nomination-scheme-186" },
    { name: "Dept. of Home Affairs — Skilled Occupation List", url: "https://immi.homeaffairs.gov.au/visas/working-in-australia/skill-occupation-list" },
  ];

  const programmes = [
    {
      title: "Internships & Residencies",
      description: "University-based rotating internships and specialist residencies are available at Australian veterinary schools including Melbourne, Sydney, Queensland, and Murdoch.",
      route: "/internships-residencies",
      tag: "Internships & Residencies",
    },
    {
      title: "Postgraduate Certificates",
      description: "Advanced specialist qualifications available after obtaining state registration and gaining clinical experience in Australia.",
      route: "/postgraduate-certificates",
      tag: "Certificates",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Helmet>
        <title>Working as a Vet in Australia | VetNextStep</title>
        <meta name="description" content="Complete guide for veterinarians wanting to work in Australia — AVBC registration, AVE exam, Skills in Demand visa (482), and permanent residency pathways (189, 190, 491, 186)." />
        <link rel="canonical" href="https://vetnextstep.com/australia" />
        <meta property="og:title" content="Working as a Vet in Australia | VetNextStep" />
        <meta property="og:description" content="AVBC registration, AVE exam, Skills in Demand visa (482), and permanent residency pathways for vets in Australia." />
        <meta property="og:url" content="https://vetnextstep.com/australia" />
        <meta property="og:image" content="https://vetnextstep.com/og-image.png" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Working as a Vet in Australia | VetNextStep" />
        <meta name="twitter:description" content="AVBC registration, AVE exam, Skills in Demand visa (482), and permanent residency pathways for vets in Australia." />
        <meta name="twitter:image" content="https://vetnextstep.com/og-image.png" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://vetnextstep.com/" },
            { "@type": "ListItem", "position": 2, "name": "Working as a Vet in Australia", "item": "https://vetnextstep.com/australia" }
          ]
        })}</script>
      </Helmet>

      <SharedHeader />

      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-12 md:py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-5xl mb-4">🇦🇺</div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Working as a Vet in Australia</h2>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
            AVBC registration, AVE exam, temporary work visas, and permanent residency pathways for veterinarians in Australia.
          </p>
        </div>
      </section>

      <main className="py-8 md:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

          <DisclaimerBanner
            officialBody={{ name: "AVBC and the Australian Department of Home Affairs", url: "https://avbc.asn.au/for-veterinarians/" }}
          />

          {/* Registration */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Veterinary Registration</h2>

            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-6">
              <h3 className="text-xl font-bold text-blue-700 mb-4">AVBC — The Gateway to Registration</h3>
              <p className="text-gray-600 text-sm mb-5">
                The Australasian Veterinary Boards Council (AVBC) manages the recognition of overseas veterinary qualifications across all Australian states and territories. Registration is administered by each state/territory board, but they all use the AVBC framework.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-green-50 p-5 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-900 mb-2">Pathway 1 — Recognised Qualification</h4>
                  <p className="text-sm text-gray-600 mb-3">If your degree appears on the <strong>AVBC Qualifications Generally Recognised</strong> list (updated December 2025):</p>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Apply directly to the state/territory board where you intend to work</li>
                    <li>• Provide proof of registration/good standing from your home country</li>
                    <li>• English language proficiency may be required</li>
                    <li>• No AVE exam required</li>
                  </ul>
                  <a href="https://avbc.asn.au/veterinary-education/avbc-qualifications-generally-recognised/" target="_blank" rel="noopener noreferrer" className="inline-block mt-3 text-xs text-green-700 hover:text-green-900 font-medium">Check the recognised list →</a>
                </div>
                <div className="bg-yellow-50 p-5 rounded-lg border border-yellow-200">
                  <h4 className="font-semibold text-yellow-900 mb-2">Pathway 2 — AVE Exam Required</h4>
                  <p className="text-sm text-gray-600 mb-3">If your degree is <strong>not</strong> on the recognised list, you must sit the Australasian Veterinary Examination (AVE):</p>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Apply for AVE eligibility assessment via AVBC</li>
                    <li>• Step 1: Multiple Choice Questions (MCQ) exam</li>
                    <li>• Step 2: Clinical examination</li>
                    <li>• On passing, apply to state/territory board for registration</li>
                  </ul>
                  <a href="https://avbc.asn.au/for-veterinarians/australasian-veterinary-examination/" target="_blank" rel="noopener noreferrer" className="inline-block mt-3 text-xs text-yellow-700 hover:text-yellow-900 font-medium">AVE exam information →</a>
                </div>
              </div>
              <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
                <p className="text-sm text-red-800">
                  <strong>AVE places 2026:</strong> Eligibility applications for the 2026 MCQ examination are currently fully allocated. Monitor the AVBC website for future application windows.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
              <h3 className="text-xl font-bold text-blue-700 mb-4">AVE Eligibility Requirements</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Academic Requirements</h4>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li className="flex items-start"><span className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-3 flex-shrink-0"></span>Minimum 4-year primary veterinary qualification</li>
                    <li className="flex items-start"><span className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-3 flex-shrink-0"></span>Veterinary school must appear on the AVMA ECFVG-listed Colleges of the World or the World List of Universities</li>
                    <li className="flex items-start"><span className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-3 flex-shrink-0"></span>Registered or eligible to be recognised as a vet of good professional standing in your home country</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">English Language Standards</h4>
                  <p className="text-sm text-gray-600 mb-2">Required unless degree was taught and assessed entirely in English. Accepted tests (results within 3 years):</p>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li className="flex items-start"><span className="w-2 h-2 bg-green-500 rounded-full mt-1.5 mr-3 flex-shrink-0"></span><strong>OET:</strong> Grade B or higher in all sections</li>
                    <li className="flex items-start"><span className="w-2 h-2 bg-green-500 rounded-full mt-1.5 mr-3 flex-shrink-0"></span><strong>IELTS Academic:</strong> Band 7 in each section</li>
                    <li className="flex items-start"><span className="w-2 h-2 bg-green-500 rounded-full mt-1.5 mr-3 flex-shrink-0"></span><strong>TOEFL iBT:</strong> 24 listening, 24 reading, 27 writing, 23 speaking</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Temporary Visa */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Temporary Work Visa — Subclass 482</h2>

            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
              <h3 className="text-xl font-bold text-blue-700 mb-4">Skills in Demand Visa (Subclass 482)</h3>
              <p className="text-gray-600 text-sm mb-5">
                The Subclass 482 Skills in Demand (SID) visa replaced the former Temporary Skill Shortage (TSS) visa in December 2024. Veterinarians (ANZSCO 234711) are listed on the Core Skills Occupation List, making them eligible for employer-sponsored temporary work in Australia.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div className="bg-blue-50 p-5 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-3">Key Requirements</h4>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li className="flex items-start"><span className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-3 flex-shrink-0"></span>Job offer from an approved Australian sponsor employer</li>
                    <li className="flex items-start"><span className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-3 flex-shrink-0"></span>Minimum <strong>1 year</strong> of relevant work experience</li>
                    <li className="flex items-start"><span className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-3 flex-shrink-0"></span>Full veterinary registration with an Australian state/territory board</li>
                    <li className="flex items-start"><span className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-3 flex-shrink-0"></span>Competent English proficiency (IELTS, PTE, or TOEFL)</li>
                    <li className="flex items-start"><span className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-3 flex-shrink-0"></span>Health and character checks</li>
                  </ul>
                </div>
                <div className="bg-green-50 p-5 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-900 mb-3">Key Details</h4>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li className="flex items-start"><span className="w-2 h-2 bg-green-500 rounded-full mt-1.5 mr-3 flex-shrink-0"></span>Visa duration: up to <strong>4 years</strong></li>
                    <li className="flex items-start"><span className="w-2 h-2 bg-green-500 rounded-full mt-1.5 mr-3 flex-shrink-0"></span>Minimum salary: <strong>AUD 76,515/year</strong> (rising to AUD 79,499 from 1 July 2026)</li>
                    <li className="flex items-start"><span className="w-2 h-2 bg-green-500 rounded-full mt-1.5 mr-3 flex-shrink-0"></span>Spouse and dependent children can accompany on same visa</li>
                    <li className="flex items-start"><span className="w-2 h-2 bg-green-500 rounded-full mt-1.5 mr-3 flex-shrink-0"></span>Pathway to permanent residency after <strong>2 years</strong> via Subclass 186</li>
                    <li className="flex items-start"><span className="w-2 h-2 bg-green-500 rounded-full mt-1.5 mr-3 flex-shrink-0"></span>Employer must demonstrate they could not fill the role locally</li>
                  </ul>
                </div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>Tip:</strong> Australia has a significant shortage of veterinarians, particularly in rural and regional areas. Many practices actively support visa sponsorship — ask prospective employers directly.
                </p>
              </div>
            </div>
          </section>

          {/* Permanent Residency */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Permanent Residency Pathways</h2>

            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-6">
              <h3 className="text-xl font-bold text-blue-700 mb-2">Pathway A — Via Employer Sponsorship (482 → 186)</h3>
              <p className="text-sm text-gray-500 mb-5">Best for those already working in Australia on a 482 visa</p>
              <div className="bg-gray-50 p-5 rounded-lg">
                <ol className="space-y-3 text-gray-700 text-sm">
                  {[
                    { n: 1, title: "Obtain 482 visa", detail: "Secure employer sponsorship and arrive in Australia on the Skills in Demand (Subclass 482) visa" },
                    { n: 2, title: "Work for 2 years", detail: "Complete at least 2 years with an approved sponsor. Time across multiple sponsors counts — it's now portable" },
                    { n: 3, title: "Apply for Subclass 186", detail: "Your employer nominates you under the Temporary Residence Transition stream of the Employer Nomination Scheme (ENS)" },
                    { n: 4, title: "Permanent residency granted", detail: "Subclass 186 is a permanent visa — you can live and work in Australia indefinitely" },
                  ].map(step => (
                    <li key={step.n} className="flex items-start">
                      <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5 flex-shrink-0">{step.n}</span>
                      <span><strong>{step.title}:</strong> {step.detail}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-6">
              <h3 className="text-xl font-bold text-blue-700 mb-2">Pathway B — Points-Based Skilled Migration (189 / 190 / 491)</h3>
              <p className="text-sm text-gray-500 mb-5">Best for those wanting PR without relying on a single employer — veterinarian (ANZSCO 234711) is on the Medium and Long-term Strategic Skills List (MLTSSL)</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-1">Subclass 189</h4>
                  <p className="text-xs text-blue-700 font-medium mb-2">Skilled Independent</p>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• No employer or state sponsor needed</li>
                    <li>• Requires invitation via SkillSelect</li>
                    <li>• Points test: typically 85–90+ points needed</li>
                    <li>• Grants permanent residency directly</li>
                  </ul>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-900 mb-1">Subclass 190</h4>
                  <p className="text-xs text-green-700 font-medium mb-2">Skilled Nominated</p>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Nominated by a state or territory</li>
                    <li>• +5 points for state nomination</li>
                    <li>• Must commit to living/working in that state</li>
                    <li>• Grants permanent residency directly</li>
                  </ul>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <h4 className="font-semibold text-yellow-900 mb-1">Subclass 491</h4>
                  <p className="text-xs text-yellow-700 font-medium mb-2">Skilled Regional (Provisional)</p>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• State/territory or family nomination</li>
                    <li>• +15 points for regional nomination</li>
                    <li>• Must live and work in a regional area</li>
                    <li>• After 3 years → apply for Subclass 191 (PR)</li>
                  </ul>
                </div>
              </div>

              <div className="bg-gray-50 p-5 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">How the Points Test Works</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
                  {[
                    { factor: "Age 25–32", points: "30 pts" },
                    { factor: "Age 33–39", points: "25 pts" },
                    { factor: "Superior English (IELTS 8+ each)", points: "+20 pts" },
                    { factor: "Proficient English (IELTS 7 each)", points: "+10 pts" },
                    { factor: "Overseas work experience (8–10 yrs)", points: "+15 pts" },
                    { factor: "Australian work experience (8–10 yrs)", points: "+20 pts" },
                    { factor: "Australian degree/qualification", points: "+10–20 pts" },
                    { factor: "Partner with competent English", points: "+5 pts" },
                  ].map((row, i) => (
                    <div key={i} className="flex justify-between p-2 bg-white rounded border border-gray-200">
                      <span>{row.factor}</span>
                      <span className="font-semibold text-blue-700">{row.points}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-3">Points test is illustrative — always verify current scores with the Department of Home Affairs. Most 189 invitations in 2026 require 85–90+ points.</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
              <h3 className="text-xl font-bold text-blue-700 mb-5">Skills Assessment for Points-Based Visas</h3>
              <p className="text-gray-600 text-sm mb-4">
                A positive skills assessment from AVBC is required before you can submit an Expression of Interest (EOI) for a 189, 190, or 491 visa. You must hold full registration with an Australian state/territory veterinary board before applying for this assessment.
              </p>
              <div className="bg-green-50 p-5 rounded-lg border border-green-200">
                <ol className="space-y-3 text-gray-700 text-sm">
                  {[
                    { n: 1, title: "Get registered", detail: "Obtain full registration with a state/territory veterinary board (via AVBC recognised qualification or AVE exam)" },
                    { n: 2, title: "Skills assessment", detail: "Apply to AVBC for a positive skills assessment for migration purposes" },
                    { n: 3, title: "Submit EOI", detail: "Lodge an Expression of Interest via SkillSelect with your points score" },
                    { n: 4, title: "Receive invitation", detail: "Department of Home Affairs issues invitations to highest-scoring candidates in each round" },
                    { n: 5, title: "Apply for visa", detail: "Submit your 189/190/491 visa application within 60 days of invitation" },
                  ].map(step => (
                    <li key={step.n} className="flex items-start">
                      <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5 flex-shrink-0">{step.n}</span>
                      <span><strong>{step.title}:</strong> {step.detail}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </section>

          {/* Programmes */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Australia Programmes & Opportunities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {programmes.map((prog, i) => (
                <div key={i} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium mb-4">{prog.tag}</span>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{prog.title}</h3>
                  <p className="text-gray-600 text-sm mb-5">{prog.description}</p>
                  <Link
                    to={prog.route}
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm"
                  >
                    View all
                    <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              ))}
            </div>
          </section>

          {/* Key Organisations */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Key Organisations & Links</h2>
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {organisations.map((org, i) => (
                  <a
                    key={i}
                    href={org.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-colors group"
                  >
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></span>
                    <span className="text-sm text-gray-700 group-hover:text-blue-700">{org.name}</span>
                    <svg className="ml-auto w-4 h-4 text-gray-400 group-hover:text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </section>

        </div>
      </main>
      <SharedFooter />
    </div>
  );
};

export default AustraliaPage;
