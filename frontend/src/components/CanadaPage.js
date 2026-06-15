import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import SharedHeader from "./SharedHeader";

const CanadaPage = () => {
  const organisations = [
    { name: "CVMA — Canadian Veterinary Medical Association", url: "https://www.canadianveterinarians.net/" },
    { name: "CVMA — Educational Credential Assessment (ECA)", url: "https://www.canadianveterinarians.net/education-and-resources/accreditation/eca/" },
    { name: "ICVA — NAVLE Examination", url: "https://www.icva.net/navle/" },
    { name: "AAVSB — NEB Examinations & PAVE Program", url: "https://www.aavsb.org/" },
    { name: "Ontario Veterinary College (OVC)", url: "https://www.ovc.uoguelph.ca/" },
    { name: "BCVMA — British Columbia Veterinary Medical Association", url: "https://www.bcvma.org/" },
    { name: "IRCC — Federal Skilled Worker Program", url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/federal-skilled-workers.html" },
    { name: "IRCC — Provincial Nominee Program", url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/provincial-nominees.html" },
    { name: "Canada Work Permit Information", url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/work-canada/permit.html" },
  ];

  const programmes = [
    {
      title: "Internships & Residencies (VIRMP)",
      description: "The VIRMP MATCH program includes Canadian positions. Rotating internships and specialist residencies available at Canadian veterinary schools.",
      route: "/internships-residencies",
      tag: "Internships & Residencies",
    },
    {
      title: "Postgraduate Certificates",
      description: "Advanced specialist qualifications available after obtaining provincial licensure and gaining clinical experience in Canada.",
      route: "/postgraduate-certificates",
      tag: "Certificates",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Helmet>
        <title>Working as a Vet in Canada | VetNextStep</title>
        <meta name="description" content="Everything new vet graduates need to know about working in Canada — ECA, NEB exams, NAVLE, provincial licensing, immigration pathways, and VIRMP opportunities." />
        <link rel="canonical" href="https://vetnextstep.com/canada" />
        <meta property="og:title" content="Working as a Vet in Canada | VetNextStep" />
        <meta property="og:description" content="ECA, NEB exams, NAVLE, provincial licensing, Federal Skilled Worker visa, and VIRMP opportunities for vets in Canada." />
        <meta property="og:url" content="https://vetnextstep.com/canada" />
        <meta property="og:type" content="website" />
      </Helmet>

      <SharedHeader />

      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-12 md:py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-5xl mb-4">🇨🇦</div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Working as a Vet in Canada</h2>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
            ECA assessment, NEB exams, provincial licensing, and immigration pathways for veterinary graduates in Canada.
          </p>
        </div>
      </section>

      <main className="py-8 md:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

          {/* Visa & Licensing */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Visa & Licensing Requirements</h2>

            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-6">
              <h3 className="text-xl font-bold text-blue-700 mb-5">Immigration Pathways</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-red-50 p-5 rounded-lg border border-red-200">
                  <h4 className="font-semibold text-red-900 mb-2">Federal Skilled Worker Program</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Points-based Express Entry system</li>
                    <li>• English or French language proficiency required</li>
                    <li>• Educational credentials must be assessed</li>
                    <li>• Work experience is evaluated for points</li>
                  </ul>
                  <a href="https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/federal-skilled-workers.html" target="_blank" rel="noopener noreferrer" className="inline-block mt-3 text-xs text-red-700 hover:text-red-900 font-medium">Learn more →</a>
                </div>
                <div className="bg-blue-50 p-5 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">Provincial Nominee Program (PNP)</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Province-specific requirements apply</li>
                    <li>• Job offer from a provincial employer may be required</li>
                    <li>• Can result in faster permanent residency</li>
                    <li>• Must demonstrate intent to live in that province</li>
                  </ul>
                  <a href="https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/provincial-nominees.html" target="_blank" rel="noopener noreferrer" className="inline-block mt-3 text-xs text-blue-700 hover:text-blue-900 font-medium">Learn more →</a>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-6">
              <h3 className="text-xl font-bold text-blue-700 mb-5">Education & Licensing Requirements</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Educational Assessment (NEB/CVMA)</h4>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li className="flex items-start"><span className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-3 flex-shrink-0"></span><span>Submit documents to the CVMA National Examining Board (NEB) for credential evaluation</span></li>
                    <li className="flex items-start"><span className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-3 flex-shrink-0"></span><span>Required for graduates of non-CVMA/AVMA accredited schools</span></li>
                    <li className="flex items-start"><span className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-3 flex-shrink-0"></span><span><strong>Language:</strong> Degree must have been taught entirely in English or French</span></li>
                    <li className="flex items-start"><span className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-3 flex-shrink-0"></span><span><strong>Alternative:</strong> PAVE (AAVSB) is now accepted in all Canadian provinces as an equivalent pathway</span></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">National Licensing Exams (NEB)</h4>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li className="flex items-start"><span className="w-2 h-2 bg-green-500 rounded-full mt-1.5 mr-3 flex-shrink-0"></span><span><strong>BCSE:</strong> Basic and Clinical Sciences Examination — must pass before NAVLE</span></li>
                    <li className="flex items-start"><span className="w-2 h-2 bg-green-500 rounded-full mt-1.5 mr-3 flex-shrink-0"></span><span><strong>NAVLE:</strong> North American Veterinary Licensing Examination (shared with USA)</span></li>
                    <li className="flex items-start"><span className="w-2 h-2 bg-green-500 rounded-full mt-1.5 mr-3 flex-shrink-0"></span><span>Both administered through AAVSB/ICVA</span></li>
                    <li className="flex items-start"><span className="w-2 h-2 bg-green-500 rounded-full mt-1.5 mr-3 flex-shrink-0"></span><span>Provincial licensing required after passing NEB exams</span></li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
              <h3 className="text-xl font-bold text-blue-700 mb-5">Step-by-Step Process</h3>
              <div className="bg-green-50 p-5 rounded-lg mb-5">
                <ol className="space-y-3 text-gray-700 text-sm">
                  {[
                    { n: 1, title: "ECA", detail: "Submit degree to CVMA for Educational Credential Assessment" },
                    { n: 2, title: "NEB Exams", detail: "Pass the BCSE (Basic and Clinical Sciences Exam) then the NAVLE" },
                    { n: 3, title: "Provincial Licence", detail: "Apply to the regulatory body in your target province" },
                    { n: 4, title: "Immigration", detail: "Apply for work permit or permanent residence through Express Entry or PNP" },
                  ].map(step => (
                    <li key={step.n} className="flex items-start">
                      <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5 flex-shrink-0">{step.n}</span>
                      <span><strong>{step.title}:</strong> {step.detail}</span>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-800">
                  <strong>💡 Tip:</strong> Contact both CVMA and your target province's regulatory body for the most current requirements — they can differ significantly between provinces.
                </p>
              </div>
            </div>
          </section>

          {/* Programmes */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Canada Programmes & Opportunities</h2>
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
    </div>
  );
};

export default CanadaPage;
