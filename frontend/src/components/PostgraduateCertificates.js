import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import SharedHeader from "./SharedHeader";

const countryConfig = [
  {
    id: "uk",
    name: "United Kingdom",
    flag: "🇬🇧",
    image: "https://images.pexels.com/photos/30721230/pexels-photo-30721230.jpeg?auto=compress&cs=tinysrgb&w=600"
  },
  {
    id: "usa",
    name: "United States",
    flag: "🇺🇸",
    image: "https://images.pexels.com/photos/16156721/pexels-photo-16156721.jpeg?auto=compress&cs=tinysrgb&w=600"
  },
  {
    id: "canada",
    name: "Canada",
    flag: "🇨🇦",
    image: "https://images.pexels.com/photos/11862814/pexels-photo-11862814.jpeg?auto=compress&cs=tinysrgb&w=600"
  },
  {
    id: "australia",
    name: "Australia",
    flag: "🇦🇺",
    image: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=600&q=80"
  }
];

const programs = {
  uk: [
    {
      title: "Improve International Postgraduate Programmes",
      organisation: "Improve International",
      description: "Comprehensive range of postgraduate veterinary courses and certificates.",
      url: "https://improveinternational.com/uk/postgraduate-programmes/"
    },
    {
      title: "BSAVA Postgraduate Certificates",
      organisation: "British Small Animal Veterinary Association",
      description: "Professional certificates in small animal medicine and surgery.",
      url: "https://www.bsava.com/education/postgraduate-certificates/"
    },
    {
      title: "Royal Veterinary College CertAVP",
      organisation: "Royal Veterinary College",
      description: "RCVS-accredited certificate programme in advanced veterinary practice.",
      url: "https://www.rvc.ac.uk/study/postgraduate/certavp"
    },
    {
      title: "University of Edinburgh CertAVP",
      organisation: "University of Edinburgh",
      description: "RCVS Certificate in Advanced Veterinary Practice with flexible study options.",
      url: "https://vet.ed.ac.uk/education/postgraduate/taught/rcvs-certavp"
    },
    {
      title: "University of Liverpool CertAVP",
      organisation: "University of Liverpool",
      description: "Certificate in Advanced Veterinary Practice with online and face-to-face learning.",
      url: "https://www.liverpool.ac.uk/vets/cpd/certavp/"
    },
    {
      title: "University of Nottingham CertAVP",
      organisation: "University of Nottingham",
      description: "RCVS Certificate in Advanced Veterinary Practice with modular structure.",
      url: "https://www.nottingham.ac.uk/vet/study-with-us/cpd/rcvs-certificate-in-advanced-veterinary-practice-certavp.aspx"
    },
    {
      title: "University of Surrey Veterinary General Practice PGCert",
      organisation: "University of Surrey",
      description: "Modular structure delivered through online learning followed by a 2-week placement at the University.",
      url: "https://www.surrey.ac.uk/postgraduate/veterinary-general-practice-pgcert"
    }
  ],
  usa: [],
  canada: [],
  australia: []
};

const PostgraduateCertificates = () => {
  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Postgraduate Certificates for Vets | VetNextStep</title>
        <meta name="description" content="Explore RCVS CertAVP programmes and other postgraduate certificates for veterinary surgeons, including providers from RVC, Edinburgh, Liverpool, Nottingham, and Surrey." />
        <link rel="canonical" href="https://vetnextstep.com/postgraduate-certificates" />
        <meta property="og:title" content="Postgraduate Certificates for Vets | VetNextStep" />
        <meta property="og:description" content="Advance your veterinary career with RCVS-accredited postgraduate certificates including CertAVP from leading UK universities." />
        <meta property="og:url" content="https://vetnextstep.com/postgraduate-certificates" />
        <meta property="og:type" content="website" />
      </Helmet>
      <SharedHeader />

      <main className="py-8 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Page title */}
          <div className="text-center mb-12">
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">Postgraduate Certificates</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              RCVS-accredited certificates and other postgraduate pathways for vets looking to develop a clinical interest. Seven UK providers listed — USA, Canada, and Australia sections coming soon.
            </p>
          </div>

          {/* Country nav cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-16">
            {countryConfig.map((country) => (
              <a
                key={country.id}
                href={`#${country.id}`}
                className="group block"
              >
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-blue-300 hover:shadow-sm transition-colors">
                  <div className="h-40 relative overflow-hidden">
                    <img
                      src={country.image}
                      alt={country.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                    <div className="absolute bottom-3 left-4 text-white">
                      <h2 className="text-lg font-bold">{country.name}</h2>
                    </div>
                  </div>
                  <div className="px-4 py-3 flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {programs[country.id].length > 0
                        ? `${programs[country.id].length} programme${programs[country.id].length !== 1 ? "s" : ""}`
                        : "Coming soon"}
                    </span>
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

          {/* Programme sections by country */}

          {/* UK */}
          <section id="uk" className="mb-16 scroll-mt-28">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
              <span className="text-3xl">🇬🇧</span>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">United Kingdom</h2>
            </div>

            {/* CertAVP callout */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-8">
              <h3 className="text-base font-semibold text-blue-900 mb-1">About the RCVS CertAVP</h3>
              <p className="text-sm text-blue-800 mb-3">
                The Certificate in Advanced Veterinary Practice (CertAVP) is an RCVS-accredited qualification allowing veterinarians to demonstrate advanced knowledge and skills in a chosen subject area. It is offered by multiple UK universities and is a recognised pathway to fellowship.
              </p>
              <a
                href="https://www.rcvs.org.uk/lifelong-learning/postgraduate-qualifications/certificate-in-advanced-veterinary-practice-certavp/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-700 hover:text-blue-900 text-sm font-medium"
              >
                Learn more at RCVS
                <svg className="ml-1 w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {programs.uk.map((program, index) => (
                <div key={index} className="bg-white rounded-xl border border-gray-100 p-6 hover:border-blue-200 hover:shadow-sm transition-colors">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{program.title}</h3>
                  <p className="text-sm text-blue-600 font-medium mb-3">{program.organisation}</p>
                  <p className="text-gray-600 text-sm leading-relaxed mb-5">{program.description}</p>
                  <a
                    href={program.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                  >
                    Visit Programme
                    <svg className="ml-2 w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              ))}
            </div>
          </section>

          {/* USA */}
          <section id="usa" className="mb-16 scroll-mt-28">
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-200">
              <span className="text-3xl">🇺🇸</span>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">United States</h2>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
              <p className="text-gray-500 mb-4">Postgraduate certificate programmes for the USA will be added here soon.</p>
              <Link to="/usa" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm">
                View full USA career guide
                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </section>

          {/* Canada */}
          <section id="canada" className="mb-16 scroll-mt-28">
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-200">
              <span className="text-3xl">🇨🇦</span>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Canada</h2>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
              <p className="text-gray-500 mb-4">Postgraduate certificate programmes for Canada will be added here soon.</p>
              <Link to="/canada" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm">
                View full Canada career guide
                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </section>

          {/* Australia */}
          <section id="australia" className="mb-16 scroll-mt-28">
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-200">
              <span className="text-3xl">🇦🇺</span>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Australia</h2>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
              <p className="text-gray-500 mb-4">Postgraduate certificate programmes for Australia will be added here soon.</p>
              <Link to="/australia" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm">
                View full Australia career guide
                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
};

export default PostgraduateCertificates;
