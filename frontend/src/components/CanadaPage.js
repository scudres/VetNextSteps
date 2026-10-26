import React from "react";
import { Helmet } from "react-helmet-async";
import SharedHeader from "./SharedHeader";
import { CountryAxis } from "./PathwayRail";
import DisclaimerBanner from "./DisclaimerBanner";
import SharedFooter from "./SharedFooter";
import { GuideLayout, GuideSection, P, Callout, FactSheet, Route, CompareTable, NextList, SourceList, ExtLink } from "./Guide";

const CanadaPage = () => {
  const organisations = [
    { name: "CVMA — Canadian Veterinary Medical Association", url: "https://www.canadianveterinarians.net/" },
    { name: "CVMA — Educational Credential Assessment (ECA)", url: "https://www.canadianveterinarians.net/education-and-resources/accreditation/eca/" },
    { name: "ICVA — NAVLE Examination", url: "https://www.icva.net/navle/" },
    { name: "AAVSB — NEB Examinations & PAVE Program", url: "https://www.aavsb.org/" },
    { name: "Ontario Veterinary College (OVC)", url: "https://www.ovc.uoguelph.ca/" },
    { name: "BCVMA — British Columbia Veterinary Medical Association", url: "https://www.bcvma.org/" },
    { name: "IRCC — Federal Skilled Worker Program", url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/federal-skilled-workers.html" },
    { name: "IRCC — Provincial Nominee Program", url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/provincial-nominees.html" },
    { name: "Canada Work Permit Information", url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/work-canada/permit.html" },
  ];

  const programmes = [
    {
      title: "Internships and residencies (VIRMP)",
      description: "The VIRMP MATCH programme includes Canadian positions. Rotating internships and specialist residencies available at Canadian veterinary schools.",
      to: "/internships-residencies",
    },
    {
      title: "Postgraduate certificates",
      description: "Advanced specialist qualifications available after obtaining provincial licensure and gaining clinical experience in Canada.",
      to: "/postgraduate-certificates",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Working as a Vet in Canada | VetNextStep</title>
        <meta name="description" content="Everything new vet graduates need to know about working in Canada — ECA, NEB exams, NAVLE, provincial licensing, immigration pathways, and VIRMP opportunities." />
        <link rel="canonical" href="https://vetnextstep.com/canada" />
        <meta property="og:title" content="Working as a Vet in Canada | VetNextStep" />
        <meta property="og:description" content="ECA, NEB exams, NAVLE, provincial licensing, Federal Skilled Worker visa, and VIRMP opportunities for vets in Canada." />
        <meta property="og:url" content="https://vetnextstep.com/canada" />
        <meta property="og:image" content="https://vetnextstep.com/og-image.png" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Working as a Vet in Canada | VetNextStep" />
        <meta name="twitter:description" content="ECA, NEB exams, NAVLE, provincial licensing, Federal Skilled Worker visa, and VIRMP opportunities for vets in Canada." />
        <meta name="twitter:image" content="https://vetnextstep.com/og-image.png" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://vetnextstep.com/" },
            { "@type": "ListItem", "position": 2, "name": "Working as a Vet in Canada", "item": "https://vetnextstep.com/canada" }
          ]
        })}</script>
      </Helmet>

      <SharedHeader />
      <CountryAxis here="/canada" />

      <GuideLayout
        crumbs={[{ label: "Home", to: "/" }, { label: "Countries & licensing", to: "/countries" }, { label: "Canada" }]}
        title="Working as a vet in Canada"
        lede="How credential assessment and the NEB exams work for graduates of schools the CVMA and AVMA do not accredit, how provincial licensing follows, and the Express Entry and provincial nominee routes to permanent residence."
        toc={[
          { id: "facts", label: "Key facts" },
          { id: "licensing", label: "Assessment, exams and licence" },
          { id: "immigration", label: "Immigration pathways" },
          { id: "next", label: "Training and development" },
          { id: "links", label: "Official links" },
        ]}
      >
        <DisclaimerBanner
          officialBody={{ name: "CVMA and Immigration, Refugees & Citizenship Canada (IRCC)", url: "https://www.canadianveterinarians.net/education-and-resources/accreditation/eca/" }}
        />

        <GuideSection id="facts" title="Key facts">
          <FactSheet
            rows={[
              {
                label: "Regulator",
                value: "The regulatory body of each province, with requirements that differ between provinces. The CVMA runs credential assessment for overseas graduates.",
              },
              {
                label: "Exam",
                value: "NAVLE only, for graduates of AVMA- or CVMA-accredited degrees. Otherwise an NEB Certificate of Qualification (BCSE, NAVLE and CPE), or the NEB route with PAVE.",
              },
              {
                label: "Language",
                value: "English or French. Your degree must have been taught entirely in English or French to go through the NEB assessment.",
              },
              {
                label: "Immigration",
                value: "Express Entry (Federal Skilled Worker Program) or a Provincial Nominee Program. A sponsor is not always required.",
              },
            ]}
          />
        </GuideSection>

        <GuideSection id="licensing" title="Assessment, exams and provincial licence">
          <P>
            Graduates of non-CVMA/AVMA accredited schools submit their documents to the CVMA National Examining Board (NEB) for credential evaluation. PAVE, run by the AAVSB, is now accepted in all Canadian provinces as an equivalent pathway. After the NEB exams, which are administered through AAVSB and ICVA, you apply for a licence in the province where you want to work. The NAVLE is shared with the USA.
          </P>
          <Route
            steps={[
              { title: "Credential assessment", detail: "Submit your degree to the CVMA for Educational Credential Assessment." },
              { title: "NEB exams", detail: "Pass the BCSE (Basic and Clinical Sciences Examination), which must come before the NAVLE, then the NAVLE and the CPE." },
              { title: "Provincial licence", detail: "Apply to the regulatory body in your target province." },
              { title: "Immigration", detail: "Apply for a work permit or permanent residence through Express Entry or a provincial nominee program." },
            ]}
          />
          <Callout>
            Contact both the CVMA and your target province's regulatory body. Their requirements can differ significantly between provinces.
          </Callout>
        </GuideSection>

        <GuideSection id="immigration" title="Immigration pathways">
          <CompareTable
            caption="Federal Skilled Worker Program compared with the Provincial Nominee Program"
            columns={["Federal Skilled Worker Program", "Provincial Nominee Program"]}
            rows={[
              ["Selection", "Points-based, through the Express Entry system.", "Province-specific requirements apply."],
              [
                "Requirements",
                "English or French language proficiency. Educational credentials must be assessed.",
                "A job offer from a provincial employer may be required. You must show intent to live in that province.",
              ],
              ["Also worth knowing", "Work experience is evaluated for points.", "Can result in faster permanent residence."],
              [
                "Official information",
                <ExtLink href="https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/federal-skilled-workers.html">IRCC: Federal Skilled Worker Program</ExtLink>,
                <ExtLink href="https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/provincial-nominees.html">IRCC: Provincial Nominee Program</ExtLink>,
              ],
            ]}
          />
        </GuideSection>

        <GuideSection id="next" title="Training and development in Canada">
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

export default CanadaPage;
