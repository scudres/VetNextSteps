import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import SharedHeader from "./SharedHeader";
import SharedFooter from "./SharedFooter";
import { slugify } from "../utils";

const countryConfig = [
  {
    id: "australia",
    name: "Australia",
    flag: "🇦🇺",
    image: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=600&q=80"
  },
  {
    id: "canada",
    name: "Canada",
    flag: "🇨🇦",
    image: "https://images.pexels.com/photos/11862814/pexels-photo-11862814.jpeg?auto=compress&cs=tinysrgb&w=600"
  },
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
  }
];

const licensingNote = {
  uk: (
    <>
      {/* VetGDP banner */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-6">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
          <div>
            <p className="text-sm font-semibold text-green-900 mb-1">Look for a VetGDP-accredited practice</p>
            <p className="text-sm text-green-800 leading-relaxed mb-2">
              The <strong>RCVS Veterinary Graduate Development Programme (VetGDP)</strong> is a structured framework that supports new graduates in their first year of practice. Participating practices commit to providing a dedicated VetGDP Adviser, regular review meetings, and a supportive environment for early-career development — making a real difference to how you settle into UK veterinary work.
            </p>
            <p className="text-sm text-green-800 leading-relaxed mb-3">
              When researching practices, look for the <strong>VetGDP logo</strong> or mentions of their VetGDP accreditation on their website and job listings — a strong signal of a practice that genuinely invests in its new graduates.
            </p>
            <a
              href="https://www.rcvs.org.uk/veterinary-professionals/learning-and-development/training-and-development-for-veterinary-surgeons/veterinary-graduate-development-programme-vetgdp/vetgdp-information-for-graduates"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm font-medium text-green-700 hover:text-green-900 underline underline-offset-2"
            >
              Learn more about VetGDP on RCVS.org.uk
              <svg className="ml-1 w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </div>
      <p className="text-sm text-gray-500 mb-6">
        Coming from overseas? You'll also need RCVS registration and a Skilled Worker Visa.{" "}
        <Link to="/uk" className="text-blue-600 hover:text-blue-800 font-medium">See the UK licensing guide →</Link>
      </p>
    </>
  ),
  usa: (
    <p className="text-sm text-gray-500 mb-6">
      Practising in the USA requires NAVLE and state licensing before joining any programme.{" "}
      <Link to="/usa" className="text-blue-600 hover:text-blue-800 font-medium">See the USA licensing guide →</Link>
    </p>
  ),
  canada: (
    <p className="text-sm text-gray-500 mb-6">
      Canadian licensing is managed province by province and requires the NAVLE.{" "}
      <Link to="/canada" className="text-blue-600 hover:text-blue-800 font-medium">See the Canada licensing guide →</Link>
    </p>
  ),
  australia: (
    <p className="text-sm text-gray-500 mb-6">
      Working in Australia requires AVA registration and state-level board approval.{" "}
      <Link to="/australia" className="text-blue-600 hover:text-blue-800 font-medium">See the Australia licensing guide →</Link>
    </p>
  ),
};

const Spinner = () => (
  <div className="flex justify-center py-16">
    <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
  </div>
);

const TrainingPrograms = () => {
  const { country } = useParams();
  const [programs, setPrograms] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/.netlify/functions/training")
      .then((r) => r.json())
      .then((data) => {
        const grouped = {};
        data.forEach((p) => {
          if (!grouped[p.country]) grouped[p.country] = [];
          grouped[p.country].push(p);
        });
        setPrograms(grouped);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // ——— Sub-page: single country ———
  if (country) {
    const cfg = countryConfig.find(c => c.id === country);
    const countryPrograms = programs[country] || [];

    if (!cfg) {
      return (
        <div className="min-h-screen bg-white">
          <SharedHeader />
          <main className="py-16 text-center">
            <p className="text-gray-500 mb-4">Country not found.</p>
            <Link to="/training-programs" className="text-blue-600 hover:text-blue-800 font-medium">← Back to all programmes</Link>
          </main>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-white">
        <Helmet>
          <title>{cfg.name} Graduate Development Programmes | VetNextStep</title>
          <meta name="description" content={`Graduate development programmes for new veterinary graduates in ${cfg.name}.`} />
          <link rel="canonical" href={`https://vetnextstep.com/training-programs/${country}`} />
          <meta property="og:title" content={`${cfg.name} Graduate Development Programmes | VetNextStep`} />
          <meta property="og:description" content={`Structured graduate development programmes with mentorship and clinical training for new veterinary graduates in ${cfg.name}.`} />
          <meta property="og:url" content={`https://vetnextstep.com/training-programs/${country}`} />
          <meta property="og:image" content="https://vetnextstep.com/og-image.png" />
          <meta property="og:type" content="website" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:image" content="https://vetnextstep.com/og-image.png" />
          <script type="application/ld+json">{JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://vetnextstep.com/" },
              { "@type": "ListItem", "position": 2, "name": "Graduate Development Programmes", "item": "https://vetnextstep.com/training-programs" },
              { "@type": "ListItem", "position": 3, "name": cfg.name, "item": `https://vetnextstep.com/training-programs/${country}` }
            ]
          })}</script>
        </Helmet>
        <SharedHeader />

        <main className="py-8 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Breadcrumb */}
            <div className="mb-8">
              <Link to="/training-programs" className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                All Graduate Development Programmes
              </Link>
            </div>

            {/* Section header */}
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
              <span className="text-3xl">{cfg.flag}</span>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{cfg.name}</h1>
              {!loading && (
                <span className="ml-auto text-sm text-gray-400">{countryPrograms.length} programme{countryPrograms.length !== 1 ? "s" : ""}</span>
              )}
            </div>

            {licensingNote[country]}

            {loading ? <Spinner /> : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {countryPrograms.map((program, index) => (
                  <div key={index} id={slugify(program.title)} className="bg-white rounded-xl border border-gray-100 p-6 hover:border-blue-200 hover:shadow-sm transition-colors scroll-mt-28">
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
            )}

          </div>
        </main>
      </div>
    );
  }

  // ——— Hub page ———
  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Graduate Development Programmes | VetNextStep</title>
        <meta name="description" content="Find structured graduate development programmes for new veterinary graduates in the UK, USA, Canada, and Australia — including CVS, IVC Evidensia, Linnaeus, Medivet, Banfield, and more." />
        <link rel="canonical" href="https://vetnextstep.com/training-programs" />
        <meta property="og:title" content="Graduate Development Programmes | VetNextStep" />
        <meta property="og:description" content="Structured graduate development programmes with mentorship and clinical training for new veterinary graduates across the UK, USA, Canada, and Australia." />
        <meta property="og:url" content="https://vetnextstep.com/training-programs" />
        <meta property="og:image" content="https://vetnextstep.com/og-image.png" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Graduate Development Programmes | VetNextStep" />
        <meta name="twitter:description" content="Structured graduate development programmes with mentorship and clinical training for new veterinary graduates across the UK, USA, Canada, and Australia." />
        <meta name="twitter:image" content="https://vetnextstep.com/og-image.png" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://vetnextstep.com/" },
            { "@type": "ListItem", "position": 2, "name": "Graduate Development Programmes", "item": "https://vetnextstep.com/training-programs" }
          ]
        })}</script>
      </Helmet>
      <SharedHeader />

      <main className="py-8 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-12">
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">Graduate Development Programmes</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Graduate development programmes with structured mentorship and clinical support — from the major corporate groups in the UK to hospital-based programmes in North America and Australia.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {countryConfig.map((c) => {
              const count = programs[c.id]?.length ?? 0;
              return (
                <Link key={c.id} to={`/training-programs/${c.id}`} className="group block">
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-blue-300 hover:shadow-md transition-all">
                    <div className="h-48 relative overflow-hidden">
                      <img
                        src={c.image}
                        srcSet={`${c.image.replace('w=600', 'w=400')} 400w, ${c.image} 600w, ${c.image.replace('w=600', 'w=900')} 900w`}
                        sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
                        alt={c.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        width="600"
                        height="400"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>
                      <div className="absolute bottom-3 left-4 text-white">
                        <div className="text-2xl mb-1">{c.flag}</div>
                        <h2 className="text-lg font-bold leading-tight">{c.name}</h2>
                      </div>
                    </div>
                    <div className="px-4 py-3 flex items-center justify-between bg-white">
                      <span className="text-sm text-gray-500">
                        {loading ? "Loading…" : `${count} programme${count !== 1 ? "s" : ""}`}
                      </span>
                      <span className="text-blue-600 text-sm font-medium group-hover:translate-x-1 transition-transform inline-flex items-center">
                        View all
                        <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

        </div>
      </main>
      <SharedFooter />
    </div>
  );
};

export default TrainingPrograms;
