import React, { useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import SharedHeader from "./SharedHeader";
import SharedFooter from "./SharedFooter";
import DeadlinesWidget from "./DeadlinesWidget";
import RoutePicker from "./RoutePicker";
import { PathwayFull, RegistrationByCountry } from "./PathwayRail";
import visaFacts from "../data/visaFacts.json";
import { formatLongDate } from "../utils";

const lastVerified = formatLongDate(visaFacts.lastVerified);

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
        <meta property="og:description" content="Graduate programmes, internships and residencies, postgraduate certificates, and licensing guides for the UK, USA, Canada, and Australia." />
        <meta property="og:url" content="https://vetnextstep.com/" />
        <meta property="og:image" content="https://vetnextstep.com/og-image.png" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Veterinary Career Progression Hub | VetNextStep" />
        <meta name="twitter:description" content="Graduate programmes, internships and residencies, postgraduate certificates, and licensing guides for the UK, USA, Canada, and Australia." />
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

      {/* Heading and lede on the left; the route finder, the page's one tool, in a
          card on the right. The deadlines box sits under it and collapses when
          nothing is close. */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,480px)] gap-8 items-start">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">Know your next step</h1>
          <p className="mt-2 max-w-2xl text-base text-gray-700">
            Training programmes, internships and residencies, postgraduate certificates, CPD and
            conferences, and licensing and visa guides for the UK, USA, Canada and Australia.
          </p>
          <p className="mt-1 text-xs text-gray-500">Licensing and visa figures last verified {lastVerified}.</p>
        </div>
        <div className="min-w-0 space-y-4">
          <div className="bg-blue-50 border border-blue-200 p-5">
            <RoutePicker />
          </div>
          <div className="empty:hidden">
            <DeadlinesWidget />
          </div>
        </div>
      </div>

      {/* Options, not a sequence: a vet can take any of them at any stage, so
          they sit side by side with no line joining them. */}
      <section className="pt-10" aria-labelledby="planning-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="planning-heading" className="text-lg font-bold tracking-tight text-gray-900">Career planning</h2>
        </div>
        <PathwayFull />
      </section>

      {/* Registration is not a career stage, so it sits apart from the options above. */}
      <section className="mt-10 bg-slate-50 border-y border-gray-200 py-8" aria-labelledby="registration-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] gap-6 lg:gap-10 items-start">
          <div>
            <h2 id="registration-heading" className="text-lg font-bold tracking-tight text-gray-900">Registration by country</h2>
            <p className="mt-1 text-sm text-gray-600 max-w-[48ch]">Registration runs on its own timetable, separate from career planning. Start it alongside training, not after.</p>
          </div>
          <RegistrationByCountry />
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-sm text-gray-700">
          Regulators, exam bodies and country guides are listed on the{" "}
          <Link to="/resources" className="text-blue-800 underline underline-offset-2 decoration-blue-200 hover:decoration-blue-800">Resources page</Link>.
        </p>
      </div>

      <SharedFooter />
    </div>
  );
};

export default VeterinaryCareerHub;
