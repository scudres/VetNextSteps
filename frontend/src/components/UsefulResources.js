import React from "react";
import { Helmet } from "react-helmet-async";
import SharedHeader from "./SharedHeader";
import SharedFooter from "./SharedFooter";
import { GuideLayout, GuideSection, ExtLink, linkClass } from "./Guide";

const RESOURCE_SECTIONS = [
  {
    country: "United Kingdom",
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

const UsefulResources = () => (
  <div className="min-h-screen bg-white">
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

    <GuideLayout
      crumbs={[{ label: "Home", to: "/" }, { label: "Useful resources" }]}
      title="Veterinary resources by country"
      lede="Links to regulatory bodies, licensing authorities, professional associations and career tools, grouped by country."
    >
      <ul className="border-t border-gray-300 mb-10">
        <li className="py-3 border-b border-gray-200">
          <ExtLink href="https://vetlit.org" className={`${linkClass} font-bold`}>VetLit</ExtLink>
          <p className="mt-0.5 text-sm text-gray-600 max-w-[68ch]">
            A free, searchable veterinary literature database. Find clinical research, case reports, and review articles across all species and disciplines.
          </p>
        </li>
      </ul>

      {RESOURCE_SECTIONS.map((section) => (
        <GuideSection key={section.country} id={section.country.toLowerCase().replace(/\s+/g, "-")} title={section.country}>
          <ul className="grid grid-cols-1 md:grid-cols-2 md:gap-x-10 border-t border-gray-300">
            {section.resources.map((resource) => (
              <li key={resource.name} className="py-3 border-b border-gray-200">
                <ExtLink href={resource.url} className={`${linkClass} font-bold`}>{resource.name}</ExtLink>
                <p className="mt-0.5 text-sm text-gray-600">{resource.description}</p>
              </li>
            ))}
          </ul>
        </GuideSection>
      ))}
    </GuideLayout>

    <SharedFooter />
  </div>
);

export default UsefulResources;
