import React from "react";
import { Helmet } from "react-helmet-async";
import SharedHeader from "./SharedHeader";
import { CountryAxis } from "./PathwayRail";
import DisclaimerBanner from "./DisclaimerBanner";
import SharedFooter from "./SharedFooter";
import { GuideLayout, GuideSection, P, H3, Bullets, Callout, FactSheet, CompareTable, NextList, SourceList, ExtLink, fact } from "./Guide";

const USAPage = () => {
  const organisations = [
    { name: "ICVA — NAVLE Examination", url: "https://www.icva.net/navle/" },
    { name: "AVMA — American Veterinary Medical Association", url: "https://www.avma.org/" },
    { name: "AVMA — Guide for Foreign Veterinary Graduates", url: "https://www.avma.org/education/foreign/information-foreign-veterinary-graduates-working-veterinarian-us" },
    { name: "AVMA — ECFVG Certification", url: "https://www.avma.org/education/ecfvg" },
    { name: "AAVSB — PAVE Program", url: "https://www.aavsb.org/licensure/international-pathway-for-veterinarians/" },
    { name: "VIRMP — Veterinary Internship & Residency Matching", url: "https://www.virmp.org/" },
    { name: "AAVSB — State Licensing Boards Directory", url: "https://www.aavsb.org/" },
    { name: "U.S. Department of State — Visas", url: "https://travel.state.gov/content/travel/en/us-visas.html" },
  ];

  const programmes = [
    {
      title: "Internships and residencies (VIRMP)",
      description: "The Veterinary Internship and Residency Matching Program (VIRMP/MATCH) places graduates into internships and residencies across the USA.",
      to: "/internships-residencies",
    },
    {
      title: "Postgraduate certificates",
      description: "Advanced certificates and specialist qualifications available after gaining US licensure and clinical experience.",
      to: "/postgraduate-certificates",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Working as a Vet in the USA | VetNextStep</title>
        <meta name="description" content="Everything new vet graduates need to know about working in the USA — NAVLE, ECFVG, PAVE, state licensing, work visas, and the VIRMP MATCH programme." />
        <link rel="canonical" href="https://vetnextstep.com/usa" />
        <meta property="og:title" content="Working as a Vet in the USA | VetNextStep" />
        <meta property="og:description" content="NAVLE, ECFVG, PAVE, state licensing, work visas, and the VIRMP MATCH programme for vets in the USA." />
        <meta property="og:url" content="https://vetnextstep.com/usa" />
        <meta property="og:image" content="https://vetnextstep.com/og-image.png" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Working as a Vet in the USA | VetNextStep" />
        <meta name="twitter:description" content="NAVLE, ECFVG, PAVE, state licensing, work visas, and the VIRMP MATCH programme for vets in the USA." />
        <meta name="twitter:image" content="https://vetnextstep.com/og-image.png" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://vetnextstep.com/" },
            { "@type": "ListItem", "position": 2, "name": "Working as a Vet in the USA", "item": "https://vetnextstep.com/usa" }
          ]
        })}</script>
      </Helmet>

      <SharedHeader />
      <CountryAxis here="/usa" />

      <GuideLayout
        crumbs={[{ label: "Home", to: "/" }, { label: "Countries & licensing", to: "/countries" }, { label: "United States" }]}
        title="Working as a vet in the USA"
        lede="How ECFVG and PAVE equivalency work for graduates of schools the AVMA does not accredit, what the NAVLE involves, where state boards add their own requirements, and which work visas employers use."
        toc={[
          { id: "facts", label: "Key facts" },
          { id: "equivalency", label: "ECFVG or PAVE" },
          { id: "licensing", label: "NAVLE and state licensing" },
          { id: "visa", label: "Work visas" },
          { id: "next", label: "Training and development" },
          { id: "links", label: "Official links" },
        ]}
      >
        <DisclaimerBanner
          officialBody={{ name: "AVMA, AAVSB, and the U.S. Department of State", url: "https://www.avma.org/education/foreign/information-foreign-veterinary-graduates-working-veterinarian-us" }}
        />

        <GuideSection id="facts" title="Key facts">
          <FactSheet
            rows={[
              {
                label: "Regulator",
                value: "The veterinary board of each state, with its own additional requirements. Contact the board of the state where you plan to practise.",
              },
              {
                label: "Exam",
                value: "NAVLE, required in all 50 states and Canada. Graduates of schools the AVMA does not accredit must first hold ECFVG or PAVE certification.",
              },
              {
                label: "ECFVG exam fee",
                value: <>{fact("us_bcse_fee").value} for the Basic and Clinical Sciences Examination, from January 2026.</>,
                facts: ["us_bcse_fee"],
              },
              {
                label: "Visa",
                value: "Your employer arranges it. H-1B is common for professional roles; TN (Canadian and Mexican citizens), E-3 (Australian citizens) and J-1 are also used. The AVMA does not influence visa issuance.",
              },
            ]}
          />
        </GuideSection>

        <GuideSection id="equivalency" title="ECFVG or PAVE: equivalency for foreign graduates">
          <P>
            Graduates, and final-year students, of schools the AVMA does not accredit must obtain equivalency certification before sitting the NAVLE. To be eligible for either route you must have graduated from, or be in your final year at, an AVMA ECFVG-listed school.
          </P>
          <CompareTable
            caption="ECFVG compared with PAVE"
            columns={["ECFVG", "PAVE"]}
            rows={[
              ["Run by", "AVMA (Educational Commission for Foreign Veterinary Graduates)", "AAVSB (Program for the Assessment of Veterinary Education Equivalence)"],
              ["Accepted by", "All U.S. state veterinary regulatory boards and the federal government", "Not every state. Verify your jurisdiction first."],
              [
                "Steps",
                <ol className="list-decimal pl-4 space-y-1.5">
                  <li>Enrolment and credential verification. Graduates provide proof of degree; final-year students provide transcripts and a letter from their college confirming graduation within the year.</li>
                  <li>English language assessment: TOEFL iBT, IELTS Academic (minimum 6.5 overall) or CAEL.</li>
                  <li>Basic and Clinical Sciences Examination (BCSE).</li>
                  <li>Clinical Proficiency Examination (CPE), a hands-on practical at Viticus Group (Las Vegas) or Mississippi State University.</li>
                </ol>,
                <ol className="list-decimal pl-4 space-y-1.5">
                  <li>Application and English proficiency documentation.</li>
                  <li>Qualifying Science Examination (QSE).</li>
                  <li>Evaluated Clinical Experience (ECE), a hands-on placement at an AVMA-accredited school.</li>
                  <li>PAVE Certificate issued.</li>
                </ol>,
              ],
              [
                "Watch for",
                "Steps 3 and 4 must be completed within 7 years of passing Step 2. ECFVG certification is not a licence: you still need the NAVLE and any state-specific exams.",
                "Demand is high, so waits for an ECE placement are significant. Passing the QSE and paying the fees does not guarantee a place.",
              ],
              [
                "Official information",
                <ExtLink href="https://www.avma.org/education/ecfvg">AVMA: ECFVG</ExtLink>,
                <ExtLink href="https://www.aavsb.org/licensure/international-pathway-for-veterinarians/">AAVSB: PAVE</ExtLink>,
              ],
            ]}
          />
        </GuideSection>

        <GuideSection id="licensing" title="NAVLE and state licensing">
          <P>
            Licensing runs in two stages. The NAVLE comes first, administered by ICVA at Prometric centres during set testing windows. Each state board then applies its own requirements on top.
          </P>
          <H3>The NAVLE</H3>
          <Bullets>
            <li>360 multiple-choice questions, 60 of them unscored pre-test items, covering all veterinary disciplines</li>
            <li>From October 2026 the exam runs as 12 blocks of 30 questions, previously 6 blocks of 60</li>
            <li>From March 2026 every candidate receives 5 attempts, and attempts made before December 2025 do not count towards that limit</li>
          </Bullets>
          <P>
            <ExtLink href="https://www.icva.net/navle/">NAVLE information from ICVA</ExtLink>
          </P>
          <H3>State requirements</H3>
          <P>
            Each state sets its own extras: some require a state jurisprudence exam, and fees and documentation vary. Contact the board in your target state before you start.
          </P>
          <Callout>
            State requirements vary significantly. Verify current requirements with the specific state board where you plan to practise.
          </Callout>
        </GuideSection>

        <GuideSection id="visa" title="Work visas">
          <P>
            Non-U.S. citizens need an appropriate work visa before practising. The U.S. Department of State lists the categories available, and H-1B is the common one for professional roles. Visa sponsorship varies by employer, so confirm support with any prospective employer before accepting a position, and secure employment independently of the licensing process.
          </P>
        </GuideSection>

        <GuideSection id="next" title="Training and development in the USA">
          <NextList items={programmes} />
        </GuideSection>

        <GuideSection id="links" title="Official links">
          <SourceList items={organisations} />
        </GuideSection>
      </GuideLayout>

      <SharedFooter />
    </div>
  );
};

export default USAPage;
