import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import SharedHeader from "./SharedHeader";
import { CountryAxis } from "./PathwayRail";
import DisclaimerBanner from "./DisclaimerBanner";
import SharedFooter from "./SharedFooter";
import { GuideLayout, GuideSection, P, H3, Bullets, Callout, FactSheet, Route, NextList, SourceList, ExtLink, fact, linkClass } from "./Guide";

const UKPage = () => {
  const organisations = [
    { name: "RCVS — Register as a Vet Surgeon", url: "https://www.rcvs.org.uk/registration/" },
    { name: "RCVS Veterinary Graduate Development Programme (VetGDP)", url: "https://www.rcvs.org.uk/lifelong-learning/veterinary-graduate-development-programme-vetgdp/" },
    { name: "RCVS CertAVP — Advanced Veterinary Practice", url: "https://www.rcvs.org.uk/lifelong-learning/postgraduate-qualifications/certificate-in-advanced-veterinary-practice-certavp/" },
    { name: "BVA — British Veterinary Association", url: "https://www.bva.co.uk/" },
    { name: "BSAVA — British Small Animal Veterinary Association", url: "https://www.bsava.com/" },
    { name: "BEVA — British Equine Veterinary Association", url: "https://www.beva.org.uk/" },
    { name: "UK Skilled Worker Visa", url: "https://www.gov.uk/skilled-worker-visa" },
    { name: "UK Visas & Immigration", url: "https://www.gov.uk/government/organisations/uk-visas-and-immigration" },
  ];

  const programmes = [
    {
      title: "Post-graduate training programmes",
      description: "Structured graduate development programmes with CVS, IVC Evidensia, Linnaeus, Medivet, Vets4Pets, and VetPartners.",
      to: "/training-programs",
    },
    {
      title: "Internships and residencies",
      description: "UK university rotating internships, BEVA equine internships, and European College residency programmes.",
      to: "/internships-residencies",
    },
    {
      title: "Postgraduate certificates (CertAVP)",
      description: "RCVS-accredited CertAVP programmes from RVC, Edinburgh, Liverpool, Nottingham, and Surrey.",
      to: "/postgraduate-certificates",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Working as a Vet in the UK | VetNextStep</title>
        <meta name="description" content="Everything new vet graduates need to know about working in the UK — RCVS registration, Skilled Worker Visa, graduate programmes, internships, and CertAVP certificates." />
        <link rel="canonical" href="https://vetnextstep.com/uk" />
        <meta property="og:title" content="Working as a Vet in the UK | VetNextStep" />
        <meta property="og:description" content="RCVS registration, visa requirements, graduate programmes, internships, and CertAVP certificates for vets in the UK." />
        <meta property="og:url" content="https://vetnextstep.com/uk" />
        <meta property="og:image" content="https://vetnextstep.com/og-image.png" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Working as a Vet in the UK | VetNextStep" />
        <meta name="twitter:description" content="RCVS registration, visa requirements, graduate programmes, internships, and CertAVP certificates for vets in the UK." />
        <meta name="twitter:image" content="https://vetnextstep.com/og-image.png" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://vetnextstep.com/" },
            { "@type": "ListItem", "position": 2, "name": "Working as a Vet in the UK", "item": "https://vetnextstep.com/uk" }
          ]
        })}</script>
      </Helmet>

      <SharedHeader />
      <CountryAxis here="/uk" />

      <GuideLayout
        crumbs={[{ label: "Home", to: "/" }, { label: "Countries & licensing", to: "/countries" }, { label: "United Kingdom" }]}
        title="Working as a vet in the UK"
        lede="Which RCVS registration route applies to your degree, which visa you need and what a sponsor must pay a vet, and how the VetGDP framework works in your first role."
        toc={[
          { id: "facts", label: "Key facts" },
          { id: "registration", label: "RCVS registration" },
          { id: "visa", label: "Visa and salary threshold" },
          { id: "first-role", label: "Your first role: VetGDP" },
          { id: "next", label: "Training and development" },
          { id: "links", label: "Official links" },
        ]}
      >
        <DisclaimerBanner
          officialBody={{ name: "RCVS and UK Visas & Immigration (UKVI)", url: "https://www.rcvs.org.uk/registration/" }}
        />

        <Callout title="Not sure which route applies to you?">
          <Link to="/uk/first-role" className={linkClass}>Answer three questions</Link> about your degree, visa status and first-job priorities and get only the registration, visa and first-role steps that fit.
        </Callout>

        <GuideSection id="facts" title="Key facts">
          <FactSheet
            rows={[
              {
                label: "Regulator",
                value: <>Royal College of Veterinary Surgeons (<ExtLink href="https://www.rcvs.org.uk/registration/">RCVS</ExtLink>). Registration is mandatory before you can practise.</>,
              },
              {
                label: "Degrees accepted",
                value: <>RCVS-accredited degrees, including those accredited by the AVMA and AVBC, and EAEVE-accredited EU degrees until {fact("uk_eaeve_deadline").value} at the latest. Any other degree needs the RCVS statutory membership exam.</>,
                facts: ["uk_eaeve_deadline"],
              },
              {
                label: "English",
                value: "IELTS 7.0 overall (6.5 in one component) or OET Grade B (C+ in one), unless your degree was taught and assessed entirely in English.",
              },
              {
                label: "Visa",
                value: "Skilled Worker visa, which needs a job offer from a licensed sponsor. Irish citizens need no visa. Citizens of eligible countries, including Australia, Canada and New Zealand, can use the Youth Mobility Scheme.",
              },
              {
                label: "Salary threshold",
                value: <>{fact("uk_going_rate").value} a year for the standard rate ({fact("uk_going_rate").hourlyValue}, 37.5-hour week) or {fact("uk_new_entrant_rate").value} for new entrants.</>,
                facts: ["uk_going_rate", "uk_new_entrant_rate"],
              },
            ]}
          />
        </GuideSection>

        <GuideSection id="registration" title="Registering with the RCVS">
          <P>
            Graduates of RCVS-accredited schools register directly. EAEVE-accredited EU degrees are recognised for now, and the RCVS reviews that arrangement every year. Every other degree needs the statutory membership exam first.
          </P>
          <Callout tone="notice" title={`EAEVE recognition ends no later than ${fact("uk_eaeve_deadline").value}`}>
            After that date only RCVS-accredited degrees are accepted, so an EU graduate registering later would need the statutory exam.
          </Callout>
          <P>Whichever route applies, the RCVS also asks for:</P>
          <Bullets>
            <li>proof of English language proficiency, unless your degree was taught entirely in English</li>
            <li>health and character declarations</li>
            <li>a letter of good standing from your current licensing authority</li>
          </Bullets>
          <P>
            <ExtLink href="https://www.rcvs.org.uk/registration/">RCVS registration information</ExtLink>
          </P>
        </GuideSection>

        <GuideSection id="visa" title="Visa and salary threshold">
          <P>
            EU citizens no longer have an automatic right to work in the UK, so EU and non-EU graduates alike generally need a Skilled Worker visa. That needs a job offer from an employer holding a sponsor licence, and the employer pays the immigration skills charge. An English language assessment may be required.
          </P>
          <P>
            Veterinary surgeons (occupation code 2240) must be paid at least <strong>{fact("uk_going_rate").value} a year</strong> to qualify for sponsorship: a 37.5-hour week at {fact("uk_going_rate").hourlyValue}, effective 22 July 2025. For longer contracted hours, gross salary scales up pro rata to clear that hourly rate. A reduced new entrant rate of <strong>{fact("uk_new_entrant_rate").value}</strong> may apply, for example if you are under 26, your Student or Graduate visa expired within the last {fact("uk_new_entrant_window").value}, or you are working towards professional registration. Check the current{" "}
            <ExtLink href={fact("uk_going_rate").source}>official going-rates table</ExtLink> before relying on these figures.
          </P>
          <H3>The order of events</H3>
          <Route
            steps={[
              { title: "Secure a job offer" },
              { title: "Employer applies for sponsorship" },
              { title: "You apply for the visa" },
              { title: "Complete RCVS registration" },
              { title: "Health checks", detail: "If required." },
            ]}
          />
        </GuideSection>

        <GuideSection id="first-role" title="Your first role: VetGDP">
          <P>
            The Veterinary Graduate Development Programme is mandatory for all new UK graduates and replaces the former Professional Development Phase. You complete it over 12–18 months in your first role, with a VetGDP Adviser, working through Entrustable Professional Activities and earning 52.5 hours of CPD. Annual CPD requirements continue after that to maintain registration.
          </P>
          <P>
            The CertAVP is open once you have clinical experience: <Link to="/postgraduate-certificates" className={linkClass}>browse certificate programmes</Link>.
          </P>
        </GuideSection>

        <GuideSection id="next" title="Training and development in the UK">
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

export default UKPage;
