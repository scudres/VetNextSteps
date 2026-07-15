import React from "react";
import { Helmet } from "react-helmet-async";
import SharedHeader from "./SharedHeader";
import SharedFooter from "./SharedFooter";

const RESOURCE_SECTIONS = [
  {
    country: "United Kingdom",
    flag: "🇬🇧",
    resources: [
      {
        name: "RCVS — Royal College of Veterinary Surgeons",
        description: "The statutory regulator for veterinary surgeons and veterinary nurses in the UK. Essential for registration, CPD requirements, and professional standards.",
        url: "https://www.rcvs.org.uk/",
      },
      {
        name: "RCVS VetGDP",
        description: "The Veterinary Graduate Development Programme — a structured one-year support framework for all new UK graduate vets entering general practice.",
        url: "https://www.rcvs.org.uk/lifelong-learning/veterinary-graduate-development-programme-vetgdp/",
      },
      {
        name: "BVA — British Veterinary Association",
        description: "The national representative body for the veterinary profession in the UK. Offers guidance on pay, wellbeing, policy, and career development.",
        url: "https://www.bva.co.uk/",
      },
      {
        name: "BSAVA — British Small Animal Veterinary Association",
        description: "The leading organisation for small animal vets in the UK. Resources include CPD, congress, and clinical guidance.",
        url: "https://www.bsava.com/",
      },
    ],
  },
  {
    country: "United States",
    flag: "🇺🇸",
    resources: [
      {
        name: "AVMA — American Veterinary Medical Association",
        description: "The national professional organisation for veterinarians in the USA. Covers licensing, accreditation, career resources, and policy.",
        url: "https://www.avma.org/",
      },
      {
        name: "AVMA — Guide for Foreign Veterinary Graduates",
        description: "Official AVMA guidance for international graduates seeking to practise in the USA, including ECFVG and PAVE pathways.",
        url: "https://www.avma.org/education/foreign/information-foreign-veterinary-graduates-working-veterinarian-us",
      },
      {
        name: "NAVLE — North American Veterinary Licensing Examination",
        description: "The licensing exam required to practise veterinary medicine in the USA and Canada. Administered by ICVA.",
        url: "https://www.icva.net/navle/",
      },
      {
        name: "VIRMP — Veterinary Internship & Residency Matching Program",
        description: "The MATCH programme for veterinary internships and residencies in the USA and Canada. Apply, rank, and match into postgraduate positions.",
        url: "https://www.virmp.org/",
      },
    ],
  },
  {
    country: "Canada",
    flag: "🇨🇦",
    resources: [
      {
        name: "CVBC — Canadian Veterinary Medical Association (CVMA)",
        description: "The national voice for the veterinary profession in Canada. Offers career guidance, advocacy, and professional development resources.",
        url: "https://www.canadianveterinarians.net/",
      },
      {
        name: "NCEÉ / NAVLE",
        description: "Canadian graduates and internationally trained vets must pass the NAVLE. Provincial regulatory bodies set additional requirements.",
        url: "https://www.icva.net/navle/",
      },
      {
        name: "CVBC — College of Veterinarians of BC",
        description: "Regulatory body for veterinary practice in British Columbia. A useful example of a provincial licensing authority.",
        url: "https://www.cvbc.ca/",
      },
    ],
  },
  {
    country: "Australia",
    flag: "🇦🇺",
    resources: [
      {
        name: "AVBC — Australasian Veterinary Boards Council",
        description: "The peak body for veterinary regulation in Australia and New Zealand. Oversees registration and the Australian Veterinary Skills Assessment (VSA) for overseas graduates.",
        url: "https://www.avbc.asn.au/",
      },
      {
        name: "AVA — Australian Veterinary Association",
        description: "The professional body representing veterinarians in Australia. Provides CPD, events, clinical guidelines, and career support.",
        url: "https://www.ava.com.au/",
      },
      {
        name: "VetEd — Australian Veterinary Education",
        description: "Resources and guidance for veterinary education and continuing professional development in Australia.",
        url: "https://www.ava.com.au/training-events/",
      },
    ],
  },
  {
    country: "International & General",
    flag: "🌍",
    resources: [
      {
        name: "WSAVA — World Small Animal Veterinary Association",
        description: "Global guidelines on nutrition, pain management, vaccination, antimicrobial stewardship, and more. Free to download.",
        url: "https://wsava.org/global-guidelines/",
      },
      {
        name: "VIN — Veterinary Information Network",
        description: "The world's largest online veterinary community. Case consultations, specialists forums, drug resources, and continuing education.",
        url: "https://www.vin.com/",
      },
      {
        name: "IVIS — International Veterinary Information Service",
        description: "Free access to thousands of veterinary textbook chapters, conference proceedings, and reference resources.",
        url: "https://www.ivis.org/",
      },
    ],
  },
];

const ExternalLinkIcon = () => (
  <svg className="w-4 h-4 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

const UsefulResources = () => (
  <div className="min-h-screen bg-gray-50">
    <Helmet>
      <title>Useful Resources | VetNextStep</title>
      <meta name="description" content="Curated veterinary resources by country — regulatory bodies, licensing authorities, professional associations, and career tools for vets in the UK, USA, Canada, and Australia." />
      <link rel="canonical" href="https://vetnextstep.com/resources" />
      <meta property="og:title" content="Useful Veterinary Resources | VetNextStep" />
      <meta property="og:description" content="Regulatory bodies, licensing authorities, professional associations, and career tools for vets in the UK, USA, Canada, and Australia." />
      <meta property="og:url" content="https://vetnextstep.com/resources" />
      <meta property="og:image" content="https://vetnextstep.com/og-image.png" />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Useful Veterinary Resources | VetNextStep" />
      <meta name="twitter:description" content="Regulatory bodies, licensing authorities, and career tools for vets worldwide." />
      <meta name="twitter:image" content="https://vetnextstep.com/og-image.png" />
    </Helmet>
    <SharedHeader />

    <main>
      {/* Hero */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-3">Useful Resources</p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Veterinary Resources by Country</h1>
          <p className="text-lg text-gray-500 max-w-2xl leading-relaxed">
            Curated links to regulatory bodies, licensing authorities, professional associations, and career tools — organised by country.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-12">
        {/* VetLit — pinned above country sections */}
        <section>
          <a
            href="https://vetlit.org"
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-300 hover:shadow-md transition-all flex flex-col gap-2"
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 transition-colors leading-snug">
                VetLit
              </h3>
              <ExternalLinkIcon />
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              A free, searchable veterinary literature database. Find clinical research, case reports, and review articles across all species and disciplines.
            </p>
          </a>
        </section>

        {RESOURCE_SECTIONS.map((section) => (
          <section key={section.country}>
            <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
              <span>{section.flag}</span>
              <span>{section.country}</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {section.resources.map((resource) => (
                <a
                  key={resource.name}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-300 hover:shadow-md transition-all flex flex-col gap-2"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 transition-colors leading-snug">
                      {resource.name}
                    </h3>
                    <ExternalLinkIcon />
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed">{resource.description}</p>
                </a>
              ))}
            </div>
          </section>
        ))}

      </div>
    </main>

    <SharedFooter />
  </div>
);

export default UsefulResources;
