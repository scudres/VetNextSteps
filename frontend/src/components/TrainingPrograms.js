import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const TrainingPrograms = () => {
  const programs = [
    {
      title: "CVS Veterinary Group Graduate Programme",
      organisation: "CVS Group",
      description: "Comprehensive graduate development programme with mentorship and structured learning.",
      url: "https://careers.cvsvets.com/Graduates",
      country: "UK"
    },
    {
      title: "IVC Evidensia Graduate Academy",
      organisation: "IVC Evidensia",
      description: "Graduate academy offering structured learning, mentoring, and career development opportunities.",
      url: "https://ivcevidensia.co.uk/graduate-academy",
      country: "UK"
    },
    {
      title: "Linnaeus Veterinary Graduate Development Programme",
      organisation: "Linnaeus Group",
      description: "18-month structured programme with clinical rotations, mentoring, and professional development.",
      url: "https://www.linnaeusgroup.co.uk/careers/graduates-students-and-apprenticeships/veterinary-graduate-development-programme-at-linnaeus",
      country: "UK"
    },
    {
      title: "Medivet Early Careers Programme",
      organisation: "Medivet",
      description: "Comprehensive early career development with mentoring and structured learning pathways.",
      url: "https://careers.medivet.co.uk/early-careers",
      country: "UK"
    },
    {
      title: "Vets4Pets Graduate Programme",
      organisation: "Vets4Pets",
      description: "Graduate programme focusing on primary care development with ongoing support and training.",
      url: "https://www.vets4petscareers.com/our-graduate-programme/",
      country: "UK"
    },
    {
      title: "VetPartners Graduate Programme",
      organisation: "VetPartners",
      description: "Structured graduate programme with clinical mentoring and professional development opportunities.",
      url: "https://www.vetpartners.co.uk/your-career/graduates/",
      country: "UK"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Helmet>
        <title>Post-graduate Training Programs | VetNextStep</title>
        <meta name="description" content="Find structured post-graduate training programmes for new veterinary graduates in the UK, including CVS, IVC Evidensia, Linnaeus, Medivet, Vets4Pets, and VetPartners." />
        <link rel="canonical" href="https://www.vetnextstep.com/training-programs" />
        <meta property="og:title" content="Post-graduate Training Programs | VetNextStep" />
        <meta property="og:description" content="Structured graduate development programmes with mentorship and clinical training for new veterinary graduates." />
        <meta property="og:url" content="https://www.vetnextstep.com/training-programs" />
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
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">Post-graduate Training Programs</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive training programs designed for new veterinary graduates to develop clinical skills and experience in a structured environment.
            </p>
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

export default TrainingPrograms;
