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
      title: "CVS Veterinary Group Graduate Programme",
      organisation: "CVS Group",
      description: "Comprehensive graduate development programme with mentorship and structured learning across CVS's nationwide network of practices.",
      url: "https://careers.cvsvets.com/Graduates"
    },
    {
      title: "IVC Evidensia Graduate Academy",
      organisation: "IVC Evidensia",
      description: "Graduate academy offering structured learning, mentoring, and career development opportunities across IVC Evidensia's European and UK practices.",
      url: "https://ivcevidensia.co.uk/graduate-academy"
    },
    {
      title: "Linnaeus Veterinary Graduate Development Programme",
      organisation: "Linnaeus Group",
      description: "18-month structured programme with clinical rotations, mentoring, and professional development across Linnaeus's specialist and primary care hospitals.",
      url: "https://www.linnaeusgroup.co.uk/careers/graduates-students-and-apprenticeships/veterinary-graduate-development-programme-at-linnaeus"
    },
    {
      title: "Medivet Early Careers Programme",
      organisation: "Medivet",
      description: "Comprehensive early career development with mentoring and structured learning pathways, supporting new graduates through their first years in practice.",
      url: "https://careers.medivet.co.uk/early-careers"
    },
    {
      title: "Vets4Pets Graduate Programme",
      organisation: "Vets4Pets",
      description: "Graduate programme focusing on primary care development with ongoing clinical support, mentoring, and structured learning opportunities.",
      url: "https://www.vets4petscareers.com/our-graduate-programme/"
    },
    {
      title: "VetPartners Graduate Programme",
      organisation: "VetPartners",
      description: "Structured graduate programme with dedicated clinical mentoring and professional development opportunities across VetPartners's diverse practice network.",
      url: "https://www.vetpartners.co.uk/your-career/graduates/"
    }
  ],
  usa: [
    {
      title: "VIRMP Rotating Internship",
      organisation: "Veterinary Internship & Residency Matching Program",
      description: "One-year rotating internships at AVMA-accredited teaching hospitals and private practices across the USA, providing broad clinical experience before specialist training.",
      url: "https://www.virmp.org/"
    },
    {
      title: "Banfield New Graduate Program",
      organisation: "Banfield Pet Hospital",
      description: "Structured onboarding and mentorship programme for new veterinary graduates, with dedicated mentor support, continuing education credits, and clinical development resources.",
      url: "https://www.banfield.com/en/careers/veterinarians"
    },
    {
      title: "VCA New Graduate Support",
      organisation: "VCA Animal Hospitals",
      description: "Comprehensive new graduate support programme with mentorship, structured CE resources, and clinical development pathways across VCA's nationwide hospital network.",
      url: "https://vcacareers.com/veterinarians"
    },
    {
      title: "National Veterinary Associates New Graduate Programme",
      organisation: "National Veterinary Associates (NVA)",
      description: "Mentored onboarding and ongoing clinical support for new graduates entering NVA practices, with professional development resources and a network of experienced colleagues.",
      url: "https://www.nva.com/careers/"
    }
  ],
  canada: [
    {
      title: "VIRMP Rotating Internship (Canada)",
      organisation: "Veterinary Internship & Residency Matching Program",
      description: "One-year rotating internships at Canadian veterinary teaching hospitals, including Ontario Veterinary College (OVC) and Western College of Veterinary Medicine (WCVM).",
      url: "https://www.virmp.org/"
    },
    {
      title: "Banfield Canada New Graduate Program",
      organisation: "Banfield Pet Hospital Canada",
      description: "Mentored new graduate programme with structured learning pathways, clinical support, and continuing education resources across Banfield's Canadian locations.",
      url: "https://www.banfield.com/en/careers/veterinarians"
    },
    {
      title: "VCA Canada New Graduate Support",
      organisation: "VCA Canada Animal Hospitals",
      description: "New graduate mentorship and structured professional development for veterinarians joining VCA Canada, with access to a broad network of experienced practitioners.",
      url: "https://vcacareers.com/veterinarians"
    }
  ],
  australia: [
    {
      title: "Greencross Vets Graduate Vet Program",
      organisation: "Greencross Vets",
      description: "Structured graduate programme with dedicated mentorship, ongoing clinical education, and professional development for new veterinary graduates across Australia.",
      url: "https://www.greencrossvets.com.au/careers/"
    },
    {
      title: "Apiam Animal Health Graduate Program",
      organisation: "Apiam Animal Health",
      description: "Graduate development programme focused on rural, regional, and production animal practice, offering mentored placements and career support across regional Australia.",
      url: "https://www.apiam.com.au/careers/"
    },
    {
      title: "AVA Mentoring Program",
      organisation: "Australian Veterinary Association",
      description: "The AVA connects new graduate veterinarians with experienced mentors for professional guidance, clinical support, and career development across all veterinary disciplines.",
      url: "https://www.ava.com.au/membership/member-benefits/mentoring/"
    }
  ]
};

const TrainingPrograms = () => {
  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Post-graduate Training Programmes | VetNextStep</title>
        <meta name="description" content="Find structured post-graduate training programmes for new veterinary graduates in the UK, USA, Canada, and Australia — including CVS, IVC Evidensia, Linnaeus, Medivet, Banfield, and more." />
        <link rel="canonical" href="https://vetnextstep.com/training-programs" />
        <meta property="og:title" content="Post-graduate Training Programmes | VetNextStep" />
        <meta property="og:description" content="Structured graduate development programmes with mentorship and clinical training for new veterinary graduates across the UK, USA, Canada, and Australia." />
        <meta property="og:url" content="https://vetnextstep.com/training-programs" />
        <meta property="og:type" content="website" />
      </Helmet>
      <SharedHeader />

      <main className="py-8 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Page title */}
          <div className="text-center mb-12">
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">Training Programmes</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Graduate development programmes with structured mentorship and clinical support — from the major corporate groups in the UK to hospital-based programmes in North America and Australia.
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
                    <span className="text-sm text-gray-500">{programs[country.id].length} programme{programs[country.id].length !== 1 ? "s" : ""}</span>
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
          {countryConfig.map((country) => (
            <section key={country.id} id={country.id} className="mb-16 scroll-mt-28">
              {/* Section header */}
              <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-200">
                <span className="text-3xl">{country.flag}</span>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{country.name}</h2>
              </div>

              {/* Licensing cross-reference */}
              {country.id === "uk" && (
                <p className="text-sm text-gray-500 mb-6">
                  Coming from overseas? You'll also need RCVS registration and a Skilled Worker Visa.{" "}
                  <Link to="/uk" className="text-blue-600 hover:text-blue-800 font-medium">See the UK licensing guide →</Link>
                </p>
              )}
              {country.id === "usa" && (
                <p className="text-sm text-gray-500 mb-6">
                  Practising in the USA requires NAVLE and state licensing before joining any programme.{" "}
                  <Link to="/usa" className="text-blue-600 hover:text-blue-800 font-medium">See the USA licensing guide →</Link>
                </p>
              )}
              {country.id === "canada" && (
                <p className="text-sm text-gray-500 mb-6">
                  Canadian licensing is managed province by province and requires the NAVLE.{" "}
                  <Link to="/canada" className="text-blue-600 hover:text-blue-800 font-medium">See the Canada licensing guide →</Link>
                </p>
              )}
              {country.id === "australia" && (
                <p className="text-sm text-gray-500 mb-6">
                  Working in Australia requires AVA registration and state-level board approval.{" "}
                  <Link to="/australia" className="text-blue-600 hover:text-blue-800 font-medium">See the Australia licensing guide →</Link>
                </p>
              )}

              {/* Programme cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {programs[country.id].map((program, index) => (
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
          ))}

        </div>
      </main>
    </div>
  );
};

export default TrainingPrograms;
