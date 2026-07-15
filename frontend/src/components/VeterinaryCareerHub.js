import React, { useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import SharedHeader from "./SharedHeader";
import SharedFooter from "./SharedFooter";
import DeadlinesWidget from "./DeadlinesWidget";

const VeterinaryCareerHub = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Legacy "?tab=X" homepage URLs — both tabs are now standalone routes.
  // Preserve the ?compare=... param when redirecting from the old countries tab.
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "cpd") {
      navigate("/cpd", { replace: true });
    } else if (tab === "countries") {
      const compare = searchParams.get("compare");
      navigate(compare ? `/countries?compare=${compare}` : "/countries", { replace: true });
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Veterinary Career Progression Hub | VetNextStep</title>
        <meta name="description" content="Licensing steps, visa options, and training resources for vets working in or moving to the UK, USA, Canada, or Australia." />
        <link rel="canonical" href="https://vetnextstep.com/" />
        <meta property="og:title" content="Veterinary Career Progression Hub | VetNextStep" />
        <meta property="og:description" content="Graduate programmes, internships, residencies, postgraduate certificates, and licensing guides for the UK, USA, Canada, and Australia." />
        <meta property="og:url" content="https://vetnextstep.com/" />
        <meta property="og:image" content="https://vetnextstep.com/og-image.png" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Veterinary Career Progression Hub | VetNextStep" />
        <meta name="twitter:description" content="Graduate programmes, internships, residencies, postgraduate certificates, and licensing guides for the UK, USA, Canada, and Australia." />
        <meta name="twitter:image" content="https://vetnextstep.com/og-image.png" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebSite",
              "@id": "https://vetnextstep.com/#website",
              "url": "https://vetnextstep.com/",
              "name": "VetNextStep",
              "description": "Veterinary career progression hub for vets in the UK, USA, Canada, and Australia.",
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": "https://vetnextstep.com/search?q={search_term_string}"
                },
                "query-input": "required name=search_term_string"
              }
            },
            {
              "@type": "Organization",
              "@id": "https://vetnextstep.com/#organization",
              "name": "VetNextStep",
              "url": "https://vetnextstep.com/",
              "logo": {
                "@type": "ImageObject",
                "url": "https://vetnextstep.com/og-image.png"
              },
              "sameAs": []
            }
          ]
        })}</script>
      </Helmet>
      <SharedHeader />

      {/* Hero */}
      <section className="bg-white border-b border-gray-100 py-10 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start gap-8">
            <img
              src="/favicon.svg"
              alt="VetNextStep"
              className="hidden sm:block flex-shrink-0 h-20 w-20"
            />
            <div className="max-w-2xl">
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-4">Veterinary career progression</p>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-5">
                Know your next step
              </h1>
              <p className="text-base md:text-lg text-gray-500 leading-relaxed mb-8">
                Licensing guides for working abroad, postgraduate training and certificates, CPD providers, and upcoming conferences, all in one place.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/countries"
                  className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
                >
                  Working internationally
                </Link>
                <Link
                  to="/cpd"
                  className="inline-flex items-center border border-gray-300 hover:border-blue-400 hover:text-blue-600 text-gray-700 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
                >
                  CPD & Conferences
                </Link>
                <Link
                  to="/internships-residencies"
                  className="inline-flex items-center border border-gray-300 hover:border-blue-400 hover:text-blue-600 text-gray-700 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
                >
                  Internships & Residencies
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Three career paths */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-6">What are you looking for?</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Path 1 — Working abroad */}
            <Link
              to="/countries"
              className="group text-left bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 mb-2">Working internationally</h3>
              <p className="text-xs text-gray-500 leading-relaxed mb-3">Visa routes, registration steps, and licensing exams for the UK, USA, Canada, and Australia. Includes a side-by-side country comparison.</p>
              <span className="text-xs font-medium text-blue-600 inline-flex items-center">
                View licensing guides
                <svg className="ml-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </Link>

            {/* Path 2 — CPD & Conferences */}
            <Link
              to="/cpd"
              className="group text-left bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 mb-2">CPD & Conferences</h3>
              <p className="text-xs text-gray-500 leading-relaxed mb-3">70+ conferences across all specialties, 2026–2028, sortable by region. Plus 49 CPD providers — university units, commercial platforms, and industry education.</p>
              <span className="text-xs font-medium text-blue-600 inline-flex items-center">
                Browse CPD & events
                <svg className="ml-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </Link>

            {/* Path 3 — Advanced training */}
            <div className="group bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:bg-blue-50 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 mb-2">Postgraduate training</h3>
              <p className="text-xs text-gray-500 leading-relaxed mb-3">Graduate development programmes, rotating internships, specialist residencies, and RCVS-accredited postgraduate certificates.</p>
              <div className="flex flex-wrap gap-2">
                <Link to="/training-programs" className="text-xs font-medium text-blue-600 inline-flex items-center hover:underline">
                  Grad programmes
                  <svg className="ml-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <span className="text-gray-300">·</span>
                <Link to="/internships-residencies" className="text-xs font-medium text-blue-600 inline-flex items-center hover:underline">
                  Internships & residencies
                  <svg className="ml-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <span className="text-gray-300">·</span>
                <Link to="/postgraduate-certificates" className="text-xs font-medium text-blue-600 inline-flex items-center hover:underline">
                  Certificates
                  <svg className="ml-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Closing-soon deadlines (from tools/deadline-alerts pipeline) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <DeadlinesWidget />
      </div>

      {/* Full section index */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-6">All sections</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { label: "Graduate Development Programmes",       desc: "Structured graduate and early-career development programmes with CVS, IVC Evidensia, Linnaeus, Medivet, Banfield, and more.",  meta: "UK · USA · Canada · Australia",          path: "/training-programs" },
            { label: "Internships & Residencies", desc: "Rotating internships and specialist residency posts at university teaching hospitals and private referral centres.",             meta: "UK · Europe · North America",            path: "/internships-residencies" },
            { label: "Postgraduate Certificates", desc: "RCVS CertAVP and university postgraduate certificates — flexible routes to build a clinical interest at any career stage.",    meta: "RCVS-accredited · Level 7",              path: "/postgraduate-certificates" },
            { label: "Countries & Licensing",     desc: "Registration bodies, key exams, visa routes, and typical timelines for working in the UK, USA, Canada, and Australia.",       meta: "Visa · Registration · Licensing",        path: "/countries" },
            { label: "Licensing Route Finder",    desc: "Pick where you qualified and where you want to work — the registration, exam, and visa steps for that route, in order.",     meta: "UK · USA · Canada · Australia",          path: "/licensing-route" },
            { label: "Conferences & Congresses",  desc: "70+ conferences in date order, 2026–2028 — filter by specialty or jump to your region. General practice to subspecialties.",  meta: "UK · USA · Europe · Australia · Global", path: "/cpd" },
            { label: "CPD Providers & Courses",   desc: "University CPD units, commercial e-learning platforms, and industry-funded education. Online, on-site, and subscription.",    meta: "49 providers · 4 categories",            path: "/cpd" },
          ].map((item, i) => (
            <Link key={i} to={item.path} className="group block border border-gray-200 rounded-lg p-5 hover:border-blue-300 hover:bg-blue-50 transition-colors">
              <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 mb-2">{item.label}</p>
              <p className="text-xs text-gray-500 leading-relaxed mb-3">{item.desc}</p>
              <p className="text-xs font-medium text-blue-600">{item.meta}</p>
            </Link>
          ))}
        </div>
      </div>

      <SharedFooter />
    </div>
  );
};

export default VeterinaryCareerHub;
