import React from "react";
import { Helmet } from "react-helmet-async";
import SharedHeader from "./SharedHeader";
import { CountryAxis } from "./PathwayRail";
import DisclaimerBanner from "./DisclaimerBanner";
import SharedFooter from "./SharedFooter";
import { GuideLayout, GuideSection, P, H3, Bullets, Callout, FactSheet, Route, CompareTable, NextList, SourceList, ExtLink, fact } from "./Guide";

const AustraliaPage = () => {
  const organisations = [
    { name: "AVBC — Australasian Veterinary Boards Council", url: "https://avbc.asn.au/" },
    { name: "AVBC — Qualifications Generally Recognised List", url: "https://avbc.asn.au/veterinary-education/avbc-qualifications-generally-recognised/" },
    { name: "AVBC — Australasian Veterinary Examination (AVE)", url: "https://avbc.asn.au/for-veterinarians/australasian-veterinary-examination/" },
    { name: "AVA — Australian Veterinary Association", url: "https://www.ava.com.au/" },
    { name: "Dept. of Home Affairs — Skills in Demand Visa (482)", url: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skills-in-demand-visa-subclass-482" },
    { name: "Dept. of Home Affairs — Skilled Independent Visa (189)", url: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-independent-189" },
    { name: "Dept. of Home Affairs — Skilled Nominated Visa (190)", url: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-nominated-190" },
    { name: "Dept. of Home Affairs — Skilled Regional Visa (491)", url: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-work-regional-provisional-491" },
    { name: "Dept. of Home Affairs — Employer Nomination Scheme (186)", url: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/employer-nomination-scheme-186" },
    { name: "Dept. of Home Affairs — Skilled Occupation List", url: "https://immi.homeaffairs.gov.au/visas/working-in-australia/skill-occupation-list" },
  ];

  const programmes = [
    {
      title: "Internships and residencies",
      description: "University-based rotating internships and specialist residencies are available at Australian veterinary schools including Melbourne, Sydney, Queensland, and Murdoch.",
      to: "/internships-residencies",
    },
    {
      title: "Postgraduate certificates",
      description: "Advanced specialist qualifications available after obtaining state registration and gaining clinical experience in Australia.",
      to: "/postgraduate-certificates",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Working as a Vet in Australia | VetNextStep</title>
        <meta name="description" content="Complete guide for veterinarians wanting to work in Australia — AVBC registration, AVE exam, Skills in Demand visa (482), and permanent residency pathways (189, 190, 491, 186)." />
        <link rel="canonical" href="https://vetnextstep.com/australia" />
        <meta property="og:title" content="Working as a Vet in Australia | VetNextStep" />
        <meta property="og:description" content="AVBC registration, AVE exam, Skills in Demand visa (482), and permanent residency pathways for vets in Australia." />
        <meta property="og:url" content="https://vetnextstep.com/australia" />
        <meta property="og:image" content="https://vetnextstep.com/og-image.png" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Working as a Vet in Australia | VetNextStep" />
        <meta name="twitter:description" content="AVBC registration, AVE exam, Skills in Demand visa (482), and permanent residency pathways for vets in Australia." />
        <meta name="twitter:image" content="https://vetnextstep.com/og-image.png" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://vetnextstep.com/" },
            { "@type": "ListItem", "position": 2, "name": "Working as a Vet in Australia", "item": "https://vetnextstep.com/australia" }
          ]
        })}</script>
      </Helmet>

      <SharedHeader />
      <CountryAxis here="/australia" />

      <GuideLayout
        crumbs={[{ label: "Home", to: "/" }, { label: "Countries & licensing", to: "/countries" }, { label: "Australia" }]}
        title="Working as a vet in Australia"
        lede="How AVBC recognition and the AVE exam lead to state registration, what the Skills in Demand (482) visa requires, and the permanent residence routes through subclasses 186, 189, 190 and 491."
        toc={[
          { id: "facts", label: "Key facts" },
          { id: "registration", label: "Registration" },
          { id: "ave", label: "AVE eligibility" },
          { id: "visa-482", label: "Skills in Demand visa (482)" },
          { id: "residence", label: "Permanent residence" },
          { id: "next", label: "Training and development" },
          { id: "links", label: "Official links" },
        ]}
      >
        <DisclaimerBanner
          officialBody={{ name: "AVBC and the Australian Department of Home Affairs", url: "https://avbc.asn.au/for-veterinarians/" }}
        />

        <GuideSection id="facts" title="Key facts">
          <FactSheet
            rows={[
              {
                label: "Regulator",
                value: "Each state and territory board registers vets. The AVBC sets the national framework for recognising overseas qualifications.",
              },
              {
                label: "Exam",
                value: "None for degrees on the AVBC Qualifications Generally Recognised list. The Australasian Veterinary Examination (AVE) for all others.",
              },
              {
                label: "Visa",
                value: <>Skills in Demand (482) with an employer sponsor, minimum salary {fact("au_csit").value} a year. Points-based skilled migration (189, 190, 491) and the Working Holiday visas (417, 462) are the alternatives.</>,
                facts: ["au_csit"],
              },
              {
                label: "English",
                value: "OET, IELTS Academic or TOEFL iBT, unless your degree was taught and assessed entirely in English.",
              },
            ]}
          />
        </GuideSection>

        <GuideSection id="registration" title="Registration through the AVBC">
          <P>
            The Australasian Veterinary Boards Council manages recognition of overseas veterinary qualifications across all Australian states and territories. Each state or territory board handles registration itself, but all use the AVBC framework.
          </P>
          <CompareTable
            caption="Recognised qualification compared with the AVE route"
            columns={["Your degree is on the recognised list", "Your degree is not on the recognised list"]}
            rows={[
              [
                "What applies",
                <>Your degree appears on the AVBC Qualifications Generally Recognised list (updated December 2025). No AVE exam is required.</>,
                "You must sit the Australasian Veterinary Examination (AVE).",
              ],
              [
                "Steps",
                <ol className="list-decimal pl-4 space-y-1.5">
                  <li>Apply directly to the state or territory board where you intend to work.</li>
                  <li>Provide proof of registration or good standing from your home country.</li>
                  <li>Show English language proficiency, where required.</li>
                </ol>,
                <ol className="list-decimal pl-4 space-y-1.5">
                  <li>Apply to the AVBC for an AVE eligibility assessment.</li>
                  <li>Pass the multiple choice questions (MCQ) exam.</li>
                  <li>Pass the clinical examination.</li>
                  <li>Apply to the state or territory board for registration.</li>
                </ol>,
              ],
              [
                "Official information",
                <ExtLink href="https://avbc.asn.au/veterinary-education/avbc-qualifications-generally-recognised/">Check the recognised list</ExtLink>,
                <ExtLink href="https://avbc.asn.au/for-veterinarians/australasian-veterinary-examination/">AVE exam information</ExtLink>,
              ],
            ]}
          />
          <Callout tone="notice" title="AVE places for 2026 are fully allocated">
            Eligibility applications for the 2026 MCQ examination are closed. Monitor the AVBC website for future application windows.
          </Callout>
        </GuideSection>

        <GuideSection id="ave" title="AVE eligibility requirements">
          <H3>Academic</H3>
          <Bullets>
            <li>A primary veterinary qualification of at least 4 years</li>
            <li>A veterinary school listed on the AVMA ECFVG-listed Colleges of the World or the World List of Universities</li>
            <li>Registration, or eligibility to be recognised, as a vet of good professional standing in your home country</li>
          </Bullets>
          <H3>English language</H3>
          <P>Required unless your degree was taught and assessed entirely in English. Results must be within 3 years.</P>
          <FactSheet
            rows={[
              { label: "OET", value: "Grade B or higher in all sections" },
              { label: "IELTS Academic", value: "Band 7 in each section" },
              { label: "TOEFL iBT", value: "24 listening, 24 reading, 27 writing, 23 speaking" },
            ]}
          />
        </GuideSection>

        <GuideSection id="visa-482" title="Skills in Demand visa (subclass 482)">
          <P>
            The Skills in Demand visa replaced the Temporary Skill Shortage visa in December 2024. Veterinarians (ANZSCO 234711) are on the Core Skills Occupation List, so employer-sponsored temporary work is open to you.
          </P>
          <FactSheet
            rows={[
              {
                label: "Requirements",
                value: "A job offer from an approved Australian sponsor; at least 1 year of relevant work experience; full registration with a state or territory board; competent English (IELTS, PTE or TOEFL); health and character checks.",
              },
              {
                label: "Duration",
                value: "Up to 4 years. Your spouse and dependent children can accompany you on the same visa.",
              },
              {
                label: "Minimum salary",
                value: <>{fact("au_csit").value} a year (Core Skills Income Threshold) for nominations lodged from 1 July 2026, indexed each July.</>,
                facts: ["au_csit"],
              },
              {
                label: "Permanent residence",
                value: "Available after 2 years through subclass 186. The employer must show it could not fill the role locally.",
              },
            ]}
          />
          <P className="mt-4">
            Australia has a significant shortage of veterinarians, particularly in rural and regional areas, and many practices support visa sponsorship. Ask prospective employers directly.
          </P>
        </GuideSection>

        <GuideSection id="residence" title="Routes to permanent residence">
          <H3>Through your employer: 482 to 186</H3>
          <P>Suits those already working in Australia on a 482 visa.</P>
          <Route
            steps={[
              { title: "Obtain the 482 visa", detail: "Secure employer sponsorship and arrive on the Skills in Demand visa." },
              { title: "Work for 2 years", detail: "Complete at least 2 years with an approved sponsor. Time across multiple sponsors counts." },
              { title: "Apply for subclass 186", detail: "Your employer nominates you under the Temporary Residence Transition stream of the Employer Nomination Scheme." },
              { title: "Permanent residence granted", detail: "Subclass 186 is a permanent visa." },
            ]}
          />

          <H3>Through points-based skilled migration: 189, 190 and 491</H3>
          <P>
            Suits those who want permanent residence without relying on a single employer. Veterinarian (ANZSCO 234711) is on the Medium and Long-term Strategic Skills List.
          </P>
          <CompareTable
            caption="Subclasses 189, 190 and 491 compared"
            columns={["189 Skilled Independent", "190 Skilled Nominated", "491 Skilled Regional (Provisional)"]}
            rows={[
              ["Sponsor", "No employer or state sponsor needed", "Nominated by a state or territory", "State or territory, or family, nomination"],
              ["Entry", "Invitation through SkillSelect", "Commit to living and working in that state", "Must live and work in a regional area"],
              ["Points", "Typically 85–90+ needed", "+5 points for state nomination", "+15 points for regional nomination"],
              ["Outcome", "Permanent residence directly", "Permanent residence directly", "After 3 years, apply for subclass 191 (permanent)"],
            ]}
          />

          <H3>How the points test works</H3>
          <FactSheet
            rows={[
              { label: "Age 25–32", value: "30 points" },
              { label: "Age 33–39", value: "25 points" },
              { label: "Superior English", value: "+20 points (IELTS 8+ in each)" },
              { label: "Proficient English", value: "+10 points (IELTS 7 in each)" },
              { label: "Overseas work experience", value: "+15 points (8–10 years)" },
              { label: "Australian work experience", value: "+20 points (8–10 years)" },
              { label: "Australian qualification", value: "+10–20 points" },
              { label: "Partner with competent English", value: "+5 points" },
            ]}
          />
          <P className="mt-3">The figures are illustrative. Verify current scores with the Department of Home Affairs; most 189 invitations in 2026 require 85–90+ points.</P>

          <H3>Skills assessment for the points-based visas</H3>
          <P>
            A positive skills assessment from the AVBC is required before you can submit an Expression of Interest for a 189, 190 or 491 visa, and you need full registration with an Australian state or territory board before you apply for it.
          </P>
          <Route
            steps={[
              { title: "Get registered", detail: "Full registration with a state or territory board, through an AVBC-recognised qualification or the AVE." },
              { title: "Skills assessment", detail: "Apply to the AVBC for a positive skills assessment for migration." },
              { title: "Submit an EOI", detail: "Lodge an Expression of Interest through SkillSelect with your points score." },
              { title: "Receive an invitation", detail: "The Department of Home Affairs invites the highest-scoring candidates in each round." },
              { title: "Apply for the visa", detail: "Submit your 189, 190 or 491 application within 60 days of the invitation." },
            ]}
          />
        </GuideSection>

        <GuideSection id="next" title="Training and development in Australia">
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

export default AustraliaPage;
