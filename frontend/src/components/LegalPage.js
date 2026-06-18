import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import SharedHeader from "./SharedHeader";
import SharedFooter from "./SharedFooter";

const Section = ({ id, title, children }) => (
  <section id={id} className="mb-12 scroll-mt-28">
    <h2 className="text-xl font-bold text-gray-900 mb-4 pb-3 border-b border-gray-200">{title}</h2>
    <div className="space-y-4 text-sm text-gray-700 leading-relaxed">{children}</div>
  </section>
);

const tabs = [
  { id: "terms",   label: "Terms of Use"    },
  { id: "privacy", label: "Privacy Policy"  },
  { id: "cookies", label: "Cookies"         },
  { id: "ip",      label: "Copyright"       },
];

const LegalPage = () => {
  const [searchParams] = useSearchParams();
  const [active, setActive] = useState("terms");

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && tabs.find(t => t.id === tab)) setActive(tab);
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Legal | VetNextStep</title>
        <meta name="description" content="Terms of use, privacy policy, cookie policy, and copyright notice for VetNextStep." />
        <link rel="canonical" href="https://vetnextstep.com/legal" />
        <meta name="robots" content="noindex" />
      </Helmet>
      <SharedHeader />

      <main className="py-8 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Page title */}
          <div className="mb-10">
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2">Legal</h1>
            <p className="text-sm text-gray-500">Last updated: June 2026</p>
          </div>

          {/* Tab nav */}
          <div className="flex border-b border-gray-200 mb-10 -mt-2 overflow-x-auto">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActive(t.id)}
                className={`px-5 py-3 text-sm font-medium border-b-2 -mb-px whitespace-nowrap transition-colors ${
                  active === t.id
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* ——— TERMS OF USE ——— */}
          {active === "terms" && (
            <div>
              <Section id="terms-acceptance" title="1. Acceptance of Terms">
                <p>
                  By accessing or using VetNextStep at <strong>vetnextstep.com</strong> (the "Site"), you agree
                  to be bound by these Terms of Use. If you do not agree, please do not use the Site.
                </p>
                <p>
                  These terms are governed by the laws of England and Wales. By using the Site you submit to
                  the exclusive jurisdiction of the courts of England and Wales in respect of any dispute
                  arising from these terms or your use of the Site.
                </p>
              </Section>

              <Section id="terms-nature" title="2. Nature of the Service">
                <p>
                  VetNextStep is a free informational resource providing general guidance on veterinary career
                  progression, including training programmes, licensing pathways, internships, residencies,
                  postgraduate qualifications, and CPD opportunities across the United Kingdom, United States,
                  Canada, and Australia.
                </p>
                <p>
                  The Site does not provide legal, regulatory, immigration, or professional advice. Nothing on
                  this Site constitutes a solicitor–client relationship, a professional advisory relationship,
                  or any other formal relationship between you and the Site operator.
                </p>
              </Section>

              <Section id="terms-immigration" title="3. Immigration Information — Important Notice">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="font-semibold text-amber-900 mb-2">This Site does not provide regulated immigration advice.</p>
                  <p className="text-amber-800">
                    In the United Kingdom, providing immigration advice is a regulated activity under the{" "}
                    <strong>Immigration and Asylum Act 1999</strong>. Only persons registered with the{" "}
                    <strong>Office of the Immigration Services Commissioner (OISC)</strong> or who are
                    solicitors, barristers, or regulated legal professionals may lawfully provide immigration
                    advice. VetNextStep is not registered with the OISC and does not provide immigration advice.
                  </p>
                </div>
                <p>
                  The information on this Site regarding visa routes, work permits, and immigration pathways
                  is provided for general awareness and educational purposes only. It describes publicly
                  available processes based on information from official government and regulatory websites.
                  It does not constitute:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>immigration advice within the meaning of the Immigration and Asylum Act 1999;</li>
                  <li>legal advice from a solicitor or barrister;</li>
                  <li>advice from a regulated immigration consultant in any jurisdiction;</li>
                  <li>a representation that any particular visa or immigration route is available to you personally.</li>
                </ul>
                <p>
                  If you need personal immigration advice, you must consult an OISC-registered adviser,
                  a qualified solicitor, or the equivalent regulated professional in your jurisdiction
                  (e.g. a Registered Migration Agent in Australia, a Regulated Canadian Immigration
                  Consultant in Canada, or a licensed immigration attorney in the USA).
                </p>
              </Section>

              <Section id="terms-disclaimer" title="4. Disclaimer of Accuracy">
                <p>
                  While every effort is made to ensure the information on this Site is accurate and current,
                  veterinary licensing requirements, visa regulations, examination processes, and programme
                  details change frequently. The Site operator makes no representation or warranty, express
                  or implied, as to the accuracy, completeness, or fitness for purpose of any information
                  provided.
                </p>
                <p>
                  <strong>
                    You must verify all registration, licensing, visa, and examination requirements directly
                    with the relevant regulatory body, government authority, or institution before making
                    any professional or financial decisions.
                  </strong>
                </p>
                <p>
                  In particular, requirements differ between jurisdictions, between individual state or
                  provincial boards within countries, and change over time. Reliance solely on information
                  from this Site is at your own risk.
                </p>
              </Section>

              <Section id="terms-liability" title="5. Limitation of Liability">
                <p>
                  To the fullest extent permitted by applicable law — including the Unfair Contract Terms
                  Act 1977 and the Consumer Rights Act 2015 — the Site operator excludes all liability for:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>any loss or damage arising from reliance on information published on this Site;</li>
                  <li>any errors, omissions, or inaccuracies in the content;</li>
                  <li>any interruption, suspension, or unavailability of the Site;</li>
                  <li>any third-party websites linked to from this Site, over which the Site operator has no control.</li>
                </ul>
                <p>
                  Nothing in these terms excludes or limits liability for death or personal injury caused by
                  negligence, fraud, or any other liability that cannot be lawfully excluded.
                </p>
              </Section>

              <Section id="terms-links" title="6. External Links">
                <p>
                  The Site contains links to third-party websites including veterinary associations, universities,
                  regulatory bodies, and commercial organisations. These links are provided for convenience only.
                  The Site operator does not endorse, control, or accept responsibility for the content of any
                  linked website. Linking does not constitute endorsement of any product, service, or viewpoint.
                </p>
                <p>
                  External websites have their own terms of use, privacy policies, and practices. You access
                  them at your own risk.
                </p>
              </Section>

              <Section id="terms-use" title="7. Acceptable Use">
                <p>You agree not to:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>use the Site in any way that is unlawful or that causes damage or disruption;</li>
                  <li>copy, reproduce, republish, or redistribute any content from this Site without prior
                    written permission from the Site operator, save as permitted by law;</li>
                  <li>use automated tools, scrapers, bots, or crawlers to extract content from this Site for
                    commercial use, database creation, AI training, or bulk reproduction;</li>
                  <li>represent content from this Site as your own original work;</li>
                  <li>use the Site in a way that infringes the rights of any third party.</li>
                </ul>
              </Section>

              <Section id="terms-changes" title="8. Changes to These Terms">
                <p>
                  The Site operator reserves the right to update these Terms of Use at any time. Changes will
                  take effect when published on this page. Continued use of the Site after a change constitutes
                  acceptance of the updated terms. It is your responsibility to check this page periodically.
                </p>
              </Section>

              <Section id="terms-contact" title="9. Contact">
                <p>
                  For any queries about these terms, please contact:{" "}
                  <a href="mailto:hello@vetnextstep.com" className="text-blue-600 hover:underline">
                    hello@vetnextstep.com
                  </a>
                </p>
              </Section>
            </div>
          )}

          {/* ——— PRIVACY POLICY ——— */}
          {active === "privacy" && (
            <div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
                <p className="text-sm text-blue-900">
                  This Privacy Policy is provided in compliance with the <strong>UK General Data Protection
                  Regulation (UK GDPR)</strong> and the <strong>Data Protection Act 2018</strong>. It explains
                  how VetNextStep collects, uses, and protects personal data when you visit this Site.
                </p>
              </div>

              <Section id="privacy-controller" title="1. Data Controller">
                <p>
                  The data controller for personal data collected through this Site is the operator of
                  VetNextStep (<strong>vetnextstep.com</strong>). For data protection enquiries, contact:{" "}
                  <a href="mailto:hello@vetnextstep.com" className="text-blue-600 hover:underline">
                    hello@vetnextstep.com
                  </a>
                </p>
              </Section>

              <Section id="privacy-what" title="2. What Personal Data We Collect">
                <p>
                  This Site does not require you to create an account or submit personal information directly.
                  However, data is collected automatically when you visit the Site:
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left px-4 py-2 font-semibold text-gray-700 border-b border-gray-200">Data type</th>
                        <th className="text-left px-4 py-2 font-semibold text-gray-700 border-b border-gray-200">Source</th>
                        <th className="text-left px-4 py-2 font-semibold text-gray-700 border-b border-gray-200">Purpose</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["IP address (anonymised)", "Google Analytics", "Aggregate usage analytics"],
                        ["Browser type and version", "Google Analytics", "Technical compatibility analysis"],
                        ["Pages visited and time on page", "Google Analytics", "Understanding content engagement"],
                        ["Referring URL", "Google Analytics", "Understanding traffic sources"],
                        ["Device type and screen resolution", "Google Analytics", "Responsive design optimisation"],
                        ["Country/region (approximate)", "Google Analytics", "Regional content prioritisation"],
                      ].map(([d, s, p], i) => (
                        <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                          <td className="px-4 py-2 border-b border-gray-100">{d}</td>
                          <td className="px-4 py-2 border-b border-gray-100">{s}</td>
                          <td className="px-4 py-2 border-b border-gray-100">{p}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Google Analytics 4 (GA4) is configured with IP anonymisation enabled by default. Full IP
                  addresses are never stored.
                </p>
              </Section>

              <Section id="privacy-lawful" title="3. Lawful Basis for Processing">
                <p>
                  Under Article 6 of the UK GDPR, the lawful basis for processing analytics data is{" "}
                  <strong>Legitimate Interests</strong> (Article 6(1)(f)). The Site operator has a legitimate
                  interest in understanding how the Site is used in order to improve it for visitors. A
                  Legitimate Interests Assessment (LIA) has been conducted and concluded that this interest
                  is not overridden by your rights, given:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>the data collected is aggregate and anonymised;</li>
                  <li>no special category data is involved;</li>
                  <li>you can opt out at any time (see Section 6);</li>
                  <li>the processing is proportionate to the purpose.</li>
                </ul>
              </Section>

              <Section id="privacy-third-party" title="4. Third-Party Processors">
                <p>
                  Analytics data is processed by <strong>Google LLC</strong> via Google Analytics 4, acting
                  as a data processor on behalf of the Site operator. Google operates under standard
                  contractual clauses approved by the UK Information Commissioner's Office (ICO) for
                  international data transfers.
                </p>
                <p>
                  Google's privacy policy is available at:{" "}
                  <a
                    href="https://policies.google.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    policies.google.com/privacy
                  </a>
                </p>
                <p>
                  The Site is hosted by <strong>Netlify, Inc.</strong> Server logs (IP addresses, request
                  timestamps, URLs) may be retained for security and operational purposes in accordance with
                  Netlify's data processing agreement. Netlify's privacy policy is available at{" "}
                  <a
                    href="https://www.netlify.com/privacy/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    netlify.com/privacy
                  </a>
                  .
                </p>
              </Section>

              <Section id="privacy-retention" title="5. Data Retention">
                <p>
                  Google Analytics data is retained for <strong>14 months</strong> (the minimum configurable
                  period in GA4), after which it is automatically deleted. Netlify server logs are retained
                  in accordance with Netlify's own data retention policies.
                </p>
              </Section>

              <Section id="privacy-rights" title="6. Your Rights Under UK GDPR">
                <p>You have the following rights in relation to your personal data:</p>
                <div className="space-y-2">
                  {[
                    ["Right of access (Article 15)", "You may request a copy of the personal data held about you."],
                    ["Right to erasure (Article 17)", "You may request deletion of your personal data where there is no compelling reason for its continued processing."],
                    ["Right to object (Article 21)", "You may object to processing based on legitimate interests. We will stop unless we can demonstrate compelling legitimate grounds that override your interests."],
                    ["Right to restriction (Article 18)", "You may request that processing is restricted in certain circumstances."],
                    ["Right to data portability (Article 20)", "Where processing is based on consent or contract, you may request your data in a structured, machine-readable format."],
                  ].map(([right, desc], i) => (
                    <div key={i} className="border border-gray-100 rounded-lg p-3">
                      <p className="font-semibold text-gray-800 text-xs mb-1">{right}</p>
                      <p className="text-xs text-gray-600">{desc}</p>
                    </div>
                  ))}
                </div>
                <p>
                  To exercise any of these rights, contact:{" "}
                  <a href="mailto:hello@vetnextstep.com" className="text-blue-600 hover:underline">
                    hello@vetnextstep.com
                  </a>
                  . We will respond within <strong>one calendar month</strong> as required by UK GDPR
                  Article 12(3).
                </p>
                <p>
                  To opt out of Google Analytics tracking specifically, you can install the{" "}
                  <a
                    href="https://tools.google.com/dlpage/gaoptout"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Google Analytics opt-out browser add-on
                  </a>
                  .
                </p>
              </Section>

              <Section id="privacy-complaint" title="7. Right to Complain">
                <p>
                  If you believe your data has been processed unlawfully or your rights have not been respected,
                  you have the right to lodge a complaint with the{" "}
                  <strong>Information Commissioner's Office (ICO)</strong> — the UK supervisory authority
                  for data protection:
                </p>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm">
                  <p className="font-semibold text-gray-800 mb-1">Information Commissioner's Office</p>
                  <p>Wycliffe House, Water Lane, Wilmslow, Cheshire SK9 5AF</p>
                  <p>Helpline: 0303 123 1113</p>
                  <p>
                    Website:{" "}
                    <a
                      href="https://ico.org.uk"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      ico.org.uk
                    </a>
                  </p>
                </div>
                <p>
                  We would, however, appreciate the opportunity to address any concern before you approach
                  the ICO. Please contact us first at{" "}
                  <a href="mailto:hello@vetnextstep.com" className="text-blue-600 hover:underline">
                    hello@vetnextstep.com
                  </a>
                  .
                </p>
              </Section>
            </div>
          )}

          {/* ——— COOKIES ——— */}
          {active === "cookies" && (
            <div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8">
                <p className="text-sm text-amber-900">
                  This Cookie Policy is provided in compliance with the{" "}
                  <strong>Privacy and Electronic Communications Regulations 2003 (PECR)</strong> as amended,
                  which implement the EU ePrivacy Directive in UK law and apply alongside the UK GDPR.
                </p>
              </div>

              <Section id="cookies-what" title="1. What Are Cookies">
                <p>
                  Cookies are small text files stored on your device by websites you visit. They are widely
                  used to make websites work, to improve efficiency, and to provide reporting information
                  to website operators.
                </p>
              </Section>

              <Section id="cookies-used" title="2. Cookies Used on This Site">
                <p>
                  This Site uses cookies set by <strong>Google Analytics 4</strong>. No cookies are set
                  directly by VetNextStep. No third-party advertising, social media tracking, or profiling
                  cookies are used.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left px-4 py-2 font-semibold text-gray-700 border-b border-gray-200">Cookie name</th>
                        <th className="text-left px-4 py-2 font-semibold text-gray-700 border-b border-gray-200">Set by</th>
                        <th className="text-left px-4 py-2 font-semibold text-gray-700 border-b border-gray-200">Duration</th>
                        <th className="text-left px-4 py-2 font-semibold text-gray-700 border-b border-gray-200">Purpose</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["_ga", "Google Analytics", "2 years", "Distinguishes unique users by assigning a randomly generated client ID."],
                        ["_ga_G-YPE9MES8JY", "Google Analytics", "2 years", "Persists session state for this property's measurement ID."],
                        ["_gid", "Google Analytics", "24 hours", "Distinguishes users for the current day's analytics session."],
                      ].map(([name, setter, duration, purpose], i) => (
                        <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                          <td className="px-4 py-2 border-b border-gray-100 font-mono text-xs">{name}</td>
                          <td className="px-4 py-2 border-b border-gray-100">{setter}</td>
                          <td className="px-4 py-2 border-b border-gray-100 whitespace-nowrap">{duration}</td>
                          <td className="px-4 py-2 border-b border-gray-100">{purpose}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Section>

              <Section id="cookies-legal" title="3. Legal Basis Under PECR">
                <p>
                  The cookies listed above are analytics cookies and are therefore <strong>non-essential</strong>
                  under PECR. The lawful basis for their use is <strong>Legitimate Interests</strong> under
                  UK GDPR Article 6(1)(f), in conjunction with our obligations under PECR Regulation 6.
                </p>
                <p>
                  We have assessed that the processing is necessary for the purpose of understanding Site
                  usage, that it is proportionate, and that it does not unduly prejudice your privacy given
                  that IP addresses are anonymised and no special category data is involved.
                </p>
                <p>
                  You may object to this processing at any time (see Section 4 below).
                </p>
              </Section>

              <Section id="cookies-control" title="4. How to Control Cookies">
                <p>You can manage or disable cookies in several ways:</p>
                <div className="space-y-3">
                  <div className="border border-gray-100 rounded-lg p-4">
                    <p className="font-semibold text-gray-800 text-sm mb-1">Google Analytics opt-out</p>
                    <p>
                      Install the{" "}
                      <a
                        href="https://tools.google.com/dlpage/gaoptout"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Google Analytics opt-out browser add-on
                      </a>{" "}
                      to prevent your data from being used by Google Analytics across all websites.
                    </p>
                  </div>
                  <div className="border border-gray-100 rounded-lg p-4">
                    <p className="font-semibold text-gray-800 text-sm mb-1">Browser settings</p>
                    <p>
                      Most browsers allow you to block or delete cookies via their settings. Instructions
                      for major browsers:
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {[
                        ["Chrome",  "https://support.google.com/chrome/answer/95647"],
                        ["Firefox", "https://support.mozilla.org/en-US/kb/clear-cookies-and-site-data-firefox"],
                        ["Safari",  "https://support.apple.com/en-gb/guide/safari/sfri11471/mac"],
                        ["Edge",    "https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406"],
                      ].map(([name, url]) => (
                        <a
                          key={name}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 text-xs border border-gray-200 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                          {name}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  Note: disabling cookies may affect the functionality of some websites, though VetNextStep
                  remains fully functional without cookies.
                </p>
              </Section>
            </div>
          )}

          {/* ——— COPYRIGHT ——— */}
          {active === "ip" && (
            <div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-8">
                <p className="text-sm text-gray-800">
                  The content on this Site is protected under the{" "}
                  <strong>Copyright, Designs and Patents Act 1988</strong> and applicable international
                  copyright law.
                </p>
              </div>

              <Section id="ip-ownership" title="1. Ownership">
                <p>
                  All content on VetNextStep — including but not limited to text, descriptions, data
                  compilations, page layouts, navigation structures, and the selection and arrangement
                  of information — is the original intellectual property of the Site operator and is
                  protected by copyright.
                </p>
                <p>
                  &copy; 2025–2026 VetNextStep. All rights reserved.
                </p>
                <p>
                  The curated selection, presentation, and original descriptions of veterinary career
                  resources on this Site constitute original works of authorship under Section 1 of the
                  Copyright, Designs and Patents Act 1988. Database compilation rights are also asserted
                  under the Copyright and Rights in Databases Regulations 1997.
                </p>
              </Section>

              <Section id="ip-third-party" title="2. Third-Party Content">
                <p>
                  Names, logos, and trademarks of third-party organisations referenced on this Site
                  (including veterinary associations, universities, regulatory bodies, and commercial
                  providers) remain the property of their respective owners. Reference to these organisations
                  does not constitute endorsement.
                </p>
                <p>
                  Images used on this Site are sourced from Pexels and Unsplash under their respective
                  free-use licences. All image credits belong to their original photographers.
                </p>
              </Section>

              <Section id="ip-permitted" title="3. Permitted Use">
                <p>You may:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>view and use the Site for your own personal, non-commercial research;</li>
                  <li>share links to pages on this Site;</li>
                  <li>quote brief extracts for commentary, criticism, or news reporting, provided the
                    source (VetNextStep — vetnextstep.com) is clearly attributed.</li>
                </ul>
              </Section>

              <Section id="ip-restricted" title="4. Restricted Use">
                <p>You may <strong>not</strong>, without prior written permission:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>reproduce, republish, or redistribute any substantial part of the content on this
                    Site in any medium;</li>
                  <li>create a database, compilation, or directory that reproduces or is substantially
                    derived from this Site's content;</li>
                  <li>use automated tools to extract content from this Site (scraping) for any commercial
                    or AI training purpose;</li>
                  <li>use this Site's content to train, fine-tune, or evaluate artificial intelligence
                    or machine learning models;</li>
                  <li>mirror this Site or any substantial part of it on another domain.</li>
                </ul>
                <p>
                  These restrictions apply regardless of whether the tool or person complies with the
                  Site's <code className="bg-gray-100 px-1 rounded text-xs">robots.txt</code> directives.
                  The absence of technical protection does not constitute a licence to use the content.
                </p>
              </Section>

              <Section id="ip-infringement" title="5. Reporting Infringement">
                <p>
                  If you believe content on this Site infringes your copyright, or if you have identified
                  content from this Site being reproduced without permission, please contact:{" "}
                  <a href="mailto:hello@vetnextstep.com" className="text-blue-600 hover:underline">
                    hello@vetnextstep.com
                  </a>
                </p>
              </Section>

              <Section id="ip-database" title="6. Database Right">
                <p>
                  The compilation of veterinary career resources on this Site constitutes a protected
                  database under the <strong>Copyright and Rights in Databases Regulations 1997</strong>.
                  The Site operator asserts the database right to prevent extraction and/or re-utilisation
                  of all or a substantial part of the contents of that database.
                </p>
              </Section>
            </div>
          )}

        </div>
      </main>
      <SharedFooter />
    </div>
  );
};

export default LegalPage;
