import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import SharedHeader from "./SharedHeader";
import SharedFooter from "./SharedFooter";
import DeadlinesWidget from "./DeadlinesWidget";
import RoutePicker from "./RoutePicker";
import { PathwayFull, CountryAxis } from "./PathwayRail";

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-7">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">Know your next step</h1>
        <p className="mt-2 text-lg text-gray-700 max-w-2xl">
          Find where you are on the track, then open what sits under it.
        </p>
      </div>

      {/* The career track. Registration is not on it — see the axis below. */}
      <PathwayFull />

      <div className="mt-4">
        <CountryAxis note="Start it alongside training, not after." />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-6 items-start">
        <RoutePicker />
        <DeadlinesWidget />
      </div>

      <SharedFooter />
    </div>
  );
};

export default VeterinaryCareerHub;
