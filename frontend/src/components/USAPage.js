import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import SharedHeader from "./SharedHeader";
import DisclaimerBanner from "./DisclaimerBanner";
import SharedFooter from "./SharedFooter";

const USAPage = () => {
  const organisations = [
    { name: "ICVA — NAVLE Examination", url: "https://www.icva.net/navle/" },
    { name: "AVMA — American Veterinary Medical Association", url: "https://www.avma.org/" },
    { name: "AVMA — Guide for Foreign Veterinary Graduates", url: "https://www.avma.org/education/foreign/information-foreign-veterinary-graduates-working-veterinarian-us" },
    { name: "AVMA — ECFVG Certification", url: "https://www.avma.org/education/ecfvg" },
    { name: "AAVSB — PAVE Program", url: "https://www.aavsb.org/student-services/preparing-for-licensure" },
    { name: "VIRMP — Veterinary Internship & Residency Matching", url: "https://www.virmp.org/" },
    { name: "AAVSB — State Licensing Boards Directory", url: "https://www.aavsb.org/" },
    { name: "U.S. Department of State — Visas", url: "https://travel.state.gov/content/travel/en/us-visas.html" },
  ];

  const programmes = [
    {
      title: "Internships & Residencies (VIRMP)",
      description: "The Veterinary Internship and Residency Matching Program (VIRMP/MATCH) places graduates into internships and residencies across the USA.",
      route: "/internships-residencies",
      tag: "Internships & Residencies",
    },
    {
      title: "Postgraduate Certificates",
      description: "Advanced certificates and specialist qualifications available after gaining US licensure and clinical experience.",
      route: "/postgraduate-certificates",
      tag: "Certificates",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Helmet>
        <title>Working as a Vet in the USA | VetNextStep</title>
        <meta name="description" content="Everything new vet graduates need to know about working in the USA — NAVLE, ECFVG, PAVE, state licensing, work visas, and the VIRMP MATCH program." />
        <link rel="canonical" href="https://vetnextstep.com/usa" />
        <meta property="og:title" content="Working as a Vet in the USA | VetNextStep" />
        <meta property="og:description" content="NAVLE, ECFVG, PAVE, state licensing, work visas, and the VIRMP MATCH program for vets in the USA." />
        <meta property="og:url" content="https://vetnextstep.com/usa" />
        <meta property="og:type" content="website" />
      </Helmet>

      <SharedHeader />

      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-12 md:py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-5xl mb-4">🇺🇸</div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Working as a Vet in the USA</h2>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
            NAVLE licensing, ECFVG certification, visa requirements, and residency opportunities in the United States.
          </p>
        </div>
      </section>

      <main className="py-8 md:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

          <DisclaimerBanner
            officialBody={{ name: "AVMA, AAVSB, and the U.S. Department of State", url: "https://www.avma.org/education/foreign/information-foreign-veterinary-graduates-working-veterinarian-us" }}
          />

          {/* Visa & Licensing */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Visa & Licensing Requirements</h2>

            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-6">
              <h3 className="text-xl font-bold text-blue-700 mb-5">Work Visa Requirements</h3>
              <div className="bg-blue-50 p-5 rounded-lg">
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li className="flex items-start"><span className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-3 flex-shrink-0"></span>Non-U.S. citizens need an appropriate work visa before practising</li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-3 flex-shrink-0"></span>Contact the U.S. Department of State for available visa categories (H-1B is common for professional roles)</li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-3 flex-shrink-0"></span>The AVMA does not influence visa issuance — this is handled separately</li>
                  <li className="flex items-start"><span className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-3 flex-shrink-0"></span>Secure employment independently of the licensing process</li>
                </ul>
              </div>
              <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-sm text-yellow-800">
                  <strong>⚠️ Note:</strong> Visa sponsorship requirements vary by employer. Confirm visa support with any prospective employer before accepting a position.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-6">
              <h3 className="text-xl font-bold text-blue-700 mb-5">Educational Equivalency for Foreign Graduates</h3>
              <p className="text-gray-600 mb-5 text-sm">
                Graduates from non-AVMA accredited schools must obtain equivalency certification before sitting the NAVLE. There are two pathways:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-green-50 p-5 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-900 mb-2">ECFVG Certification</h4>
                  <p className="text-sm text-gray-600 mb-3">Educational Commission for Foreign Veterinary Graduates — administered by AVMA. Four steps:</p>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• <strong>Step 1:</strong> Registration & credential verification</li>
                    <li>• <strong>Step 2:</strong> English language competency (TOEFL iBT or IELTS)</li>
                    <li>• <strong>Step 3:</strong> Basic and Clinical Sciences Examination (BCSE)</li>
                    <li>• <strong>Step 4:</strong> Clinical Proficiency Examination (CPE) — 3-day hands-on exam</li>
                  </ul>
                  <a href="https://www.avma.org/education/ecfvg" target="_blank" rel="noopener noreferrer" className="inline-block mt-3 text-xs text-green-700 hover:text-green-900 font-medium">Learn more →</a>
                </div>
                <div className="bg-yellow-50 p-5 rounded-lg border border-yellow-200">
                  <h4 className="font-semibold text-yellow-900 mb-2">PAVE Program</h4>
                  <p className="text-sm text-gray-600 mb-3">Program for the Assessment of Veterinary Education Equivalence — administered by AAVSB</p>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Alternative to ECFVG</li>
                    <li>• Not accepted in all states — verify first</li>
                    <li>• Check state board acceptance before applying</li>
                  </ul>
                  <a href="https://www.aavsb.org/student-services/preparing-for-licensure" target="_blank" rel="noopener noreferrer" className="inline-block mt-3 text-xs text-yellow-700 hover:text-yellow-900 font-medium">Learn more →</a>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
              <h3 className="text-xl font-bold text-blue-700 mb-5">State Licensing Process</h3>
              <div className="bg-gray-50 p-5 rounded-lg mb-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Step 1 — NAVLE Exam</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Required in all 50 states and Canada</li>
                      <li>• 360 multiple-choice questions (60 unscored pre-test items)</li>
                      <li>• Format from Oct 2026: 12 blocks of 30 questions</li>
                      <li>• Covers all veterinary medicine disciplines</li>
                      <li>• Offered during specific testing windows at Prometric centres</li>
                      <li>• Administered by ICVA</li>
                    </ul>
                    <a
                      href="https://www.icva.net/navle/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center mt-3 text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded font-medium transition-colors"
                    >
                      NAVLE Information (ICVA)
                    </a>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Step 2 — State Requirements</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Each state has unique additional requirements</li>
                      <li>• Some require a state jurisprudence exam</li>
                      <li>• Additional fees and documentation vary</li>
                      <li>• Contact your target state's veterinary board</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <p className="text-sm text-red-800">
                  <strong>⚠️ Important:</strong> State requirements vary significantly. Always verify current requirements with the specific state veterinary board where you plan to practise.
                </p>
              </div>
            </div>
          </section>

          {/* Programmes */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">USA Programmes & Opportunities</h2>
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

export default USAPage;
