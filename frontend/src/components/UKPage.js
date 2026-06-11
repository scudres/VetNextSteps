import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const UKPage = () => {
  const organisations = [
    { name: "RCVS — Register as a Vet Surgeon", url: "https://www.rcvs.org.uk/registration/" },
    { name: "RCVS Veterinary Graduate Development Programme (VetGDP)", url: "https://www.rcvs.org.uk/lifelong-learning/veterinary-graduate-development-programme-vetgdp/" },
    { name: "RCVS CertAVP — Advanced Veterinary Practice", url: "https://www.rcvs.org.uk/lifelong-learning/postgraduate-qualifications/certificate-in-advanced-veterinary-practice-certavp/" },
    { name: "BVA — British Veterinary Association", url: "https://www.bva.co.uk/" },
    { name: "BSAVA — British Small Animal Veterinary Association", url: "https://www.bsava.com/" },
    { name: "BEVA — British Equine Veterinary Association", url: "https://www.beva.org.uk/" },
    { name: "UK Skilled Worker Visa", url: "https://www.gov.uk/skilled-worker-visa" },
    { name: "UK Visas & Immigration", url: "https://www.gov.uk/government/organisations/uk-visas-and-immigration" },
  ];

  const programmes = [
    {
      title: "Post-graduate Training Programs",
      description: "Structured graduate development programmes with CVS, IVC Evidensia, Linnaeus, Medivet, Vets4Pets, and VetPartners.",
      route: "/training-programs",
      tag: "Graduate Programmes",
    },
    {
      title: "Internships & Residencies",
      description: "UK university rotating internships, BEVA equine internships, and European College residency programmes.",
      route: "/internships-residencies",
      tag: "Internships",
    },
    {
      title: "Postgraduate Certificates (CertAVP)",
      description: "RCVS-accredited CertAVP programmes from RVC, Edinburgh, Liverpool, Nottingham, and Surrey.",
      route: "/postgraduate-certificates",
      tag: "Certificates",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Helmet>
        <title>Working as a Vet in the UK | VetNextStep</title>
        <meta name="description" content="Everything new vet graduates need to know about working in the UK — RCVS registration, Skilled Worker Visa, graduate programmes, internships, and CertAVP certificates." />
        <link rel="canonical" href="https://vetnextstep.com/uk" />
        <meta property="og:title" content="Working as a Vet in the UK | VetNextStep" />
        <meta property="og:description" content="RCVS registration, visa requirements, graduate programmes, internships, and CertAVP certificates for vets in the UK." />
        <meta property="og:url" content="https://vetnextstep.com/uk" />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center space-x-3">
              <img src="/favicon.svg" alt="VetNextStep logo" className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0" />
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">VetNextStep</h1>
                <p className="hidden sm:block text-sm text-gray-600">Your Veterinary Career Progression</p>
              </div>
            </Link>
            <Link
              to="/"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 md:px-6 rounded-lg transition-colors duration-200 flex items-center text-sm md:text-base"
            >
              <svg className="w-4 h-4 mr-1 md:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="hidden sm:inline">Back to Home</span>
              <span className="sm:hidden">Home</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-12 md:py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-5xl mb-4">🇬🇧</div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Working as a Vet in the UK</h2>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
            RCVS registration, visa requirements, graduate programmes, and career development opportunities in the United Kingdom.
          </p>
        </div>
      </section>

      <main className="py-8 md:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

          {/* Visa & Licensing */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Visa & Licensing Requirements</h2>

            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-6">
              <h3 className="text-xl font-bold text-blue-700 mb-5">Post-Brexit Visa Requirements</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">EU Citizens</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Skilled Worker Visa required (post-Brexit)</li>
                    <li>• Job offer from a UK-licensed sponsor needed</li>
                    <li>• Employer must hold a valid sponsor licence</li>
                    <li>• No longer automatic right to work in UK</li>
                  </ul>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-900 mb-2">Non-EU Citizens</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Skilled Worker Visa required</li>
                    <li>• Job offer from licensed UK sponsor</li>
                    <li>• English language assessment may be required</li>
                    <li>• Immigration skills charge applies to employer</li>
                  </ul>
                </div>
              </div>
              <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-sm text-yellow-800">
                  <strong>💷 Salary threshold (2026):</strong> Veterinary surgeons must be paid at least <strong>£48,100/year</strong> to qualify for Skilled Worker visa sponsorship. A reduced <strong>new entrant rate of £33,390</strong> may apply for those within 3 years of graduating or under 26.
                </p>
              </div>
              <div className="mt-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>✅ Process:</strong> Secure job offer → Employer applies for visa sponsorship → You apply for Skilled Worker Visa → Complete RCVS registration → Undergo health checks if required
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
              <h3 className="text-xl font-bold text-blue-700 mb-5">RCVS Registration</h3>
              <p className="text-gray-600 mb-5">
                Registration with the Royal College of Veterinary Surgeons (RCVS) is mandatory before you can practise as a veterinary surgeon in the UK.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Requirements</h4>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li className="flex items-start"><span className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-3 flex-shrink-0"></span>Registration with RCVS is mandatory to practise</li>
                    <li className="flex items-start"><span className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-3 flex-shrink-0"></span>EAEVE-accredited EU degrees currently recognised — <strong>deadline January 2029</strong>, after which only RCVS-accredited degrees accepted</li>
                    <li className="flex items-start"><span className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-3 flex-shrink-0"></span>Non-RCVS/non-EAEVE degrees require statutory membership exam</li>
                    <li className="flex items-start"><span className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-3 flex-shrink-0"></span>English language proficiency required unless degree was taught entirely in English</li>
                    <li className="flex items-start"><span className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-3 flex-shrink-0"></span>Health and character declarations required</li>
                    <li className="flex items-start"><span className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-3 flex-shrink-0"></span>Letter of good standing from current licensing authority</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Graduate Development (VetGDP)</h4>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li className="flex items-start"><span className="w-2 h-2 bg-green-500 rounded-full mt-1.5 mr-3 flex-shrink-0"></span><strong>VetGDP mandatory</strong> for all new UK graduates — replaces the former PDP</li>
                    <li className="flex items-start"><span className="w-2 h-2 bg-green-500 rounded-full mt-1.5 mr-3 flex-shrink-0"></span>Completed over 12–18 months in your first role, earning 52.5 hours CPD</li>
                    <li className="flex items-start"><span className="w-2 h-2 bg-green-500 rounded-full mt-1.5 mr-3 flex-shrink-0"></span>Structured around Entrustable Professional Activities (EPAs) with a VetGDP Adviser</li>
                    <li className="flex items-start"><span className="w-2 h-2 bg-green-500 rounded-full mt-1.5 mr-3 flex-shrink-0"></span>Annual CPD requirements to maintain registration thereafter</li>
                    <li className="flex items-start"><span className="w-2 h-2 bg-green-500 rounded-full mt-1.5 mr-3 flex-shrink-0"></span>CertAVP available after gaining clinical experience</li>
                  </ul>
                </div>
              </div>
              <div className="mt-5">
                <a
                  href="https://www.rcvs.org.uk/registration/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors text-sm"
                >
                  RCVS Registration Information
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </section>

          {/* Programmes */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">UK Programmes & Opportunities</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
    </div>
  );
};

export default UKPage;
