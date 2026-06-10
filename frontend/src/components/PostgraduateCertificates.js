import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const PostgraduateCertificates = () => {
  const programs = [
    {
      title: "Improve International Postgraduate Programmes",
      organisation: "Improve International",
      description: "Comprehensive range of postgraduate veterinary courses and certificates.",
      url: "https://improveinternational.com/uk/postgraduate-programmes/",
      country: "UK"
    },
    {
      title: "BSAVA Postgraduate Certificates",
      organisation: "British Small Animal Veterinary Association",
      description: "Professional certificates in small animal medicine and surgery.",
      url: "https://www.bsava.com/education/postgraduate-certificates/",
      country: "UK"
    },
    {
      title: "Royal Veterinary College CertAVP",
      organisation: "Royal Veterinary College",
      description: "RCVS-accredited certificate programme in advanced veterinary practice.",
      url: "https://www.rvc.ac.uk/study/postgraduate/certavp",
      country: "UK"
    },
    {
      title: "University of Edinburgh CertAVP",
      organisation: "University of Edinburgh",
      description: "RCVS Certificate in Advanced Veterinary Practice with flexible study options.",
      url: "https://vet.ed.ac.uk/education/postgraduate/taught/rcvs-certavp",
      country: "UK"
    },
    {
      title: "University of Liverpool CertAVP",
      organisation: "University of Liverpool",
      description: "Certificate in Advanced Veterinary Practice with online and face-to-face learning.",
      url: "https://www.liverpool.ac.uk/vets/cpd/certavp/",
      country: "UK"
    },
    {
      title: "University of Nottingham CertAVP",
      organisation: "University of Nottingham",
      description: "RCVS Certificate in Advanced Veterinary Practice with modular structure.",
      url: "https://www.nottingham.ac.uk/vet/study-with-us/cpd/rcvs-certificate-in-advanced-veterinary-practice-certavp.aspx",
      country: "UK"
    },
    {
      title: "University of Surrey Veterinary General Practice-PGCert",
      organisation: "University of Surrey",
      description: "Modular structure delivered through online learning followed by a 2 week placement at the University.",
      url: "https://www.surrey.ac.uk/postgraduate/veterinary-general-practice-pgcert",
      country: "UK"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Helmet>
        <title>Postgraduate Certificates for Vets | VetNextStep</title>
        <meta name="description" content="Explore RCVS CertAVP programmes and other postgraduate certificates for veterinary surgeons, including providers from RVC, Edinburgh, Liverpool, Nottingham, and Surrey." />
        <link rel="canonical" href="https://www.vetnextstep.com/postgraduate-certificates" />
        <meta property="og:title" content="Postgraduate Certificates for Vets | VetNextStep" />
        <meta property="og:description" content="Advance your veterinary career with RCVS-accredited postgraduate certificates including CertAVP from leading UK universities." />
        <meta property="og:url" content="https://www.vetnextstep.com/postgraduate-certificates" />
        <meta property="og:type" content="website" />
      </Helmet>
      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-lg md:text-xl">V</span>
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">VetCareerHub</h1>
                <p className="hidden sm:block text-sm text-gray-600">Your Veterinary Career Compass</p>
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

      {/* Main Content */}
      <main className="py-8 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">Postgraduate Certificates</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Advanced certification programs for practicing veterinarians to develop specialized expertise.
            </p>
          </div>

          {/* RCVS Information Section */}
          <div className="bg-blue-50 rounded-xl p-8 mb-12 border border-blue-200">
            <h2 className="text-3xl font-bold text-blue-900 mb-4">
              About RCVS Certificate in Advanced Veterinary Practice (CertAVP)
            </h2>
            <p className="text-blue-800 mb-6 text-lg leading-relaxed">
              The CertAVP is an RCVS-accredited qualification that allows veterinarians to demonstrate advanced knowledge and skills in a chosen subject area.
            </p>
            <p className="text-blue-700 mb-6">
              <strong>Source:</strong> Royal College of Veterinary Surgeons
            </p>
            <a
              href="https://www.rcvs.org.uk/lifelong-learning/postgraduate-qualifications/certificate-in-advanced-veterinary-practice-certavp/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              Learn More About CertAVP
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {programs.map((program, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">{program.title}</h2>
                  <span className="self-start px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium whitespace-nowrap">
                    {program.country}
                  </span>
                </div>
                <p className="text-gray-700 mb-4">
                  <strong className="text-blue-600">Organisation:</strong> {program.organisation}
                </p>
                <p className="text-gray-600 mb-6 leading-relaxed">{program.description}</p>
                <a
                  href={program.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  Visit Programme
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PostgraduateCertificates;
