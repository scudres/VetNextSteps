import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import SharedHeader from "./SharedHeader";
import SharedFooter from "./SharedFooter";
import visaFacts from "../data/visaFacts.json";

const lastVerified = new Date(visaFacts.lastVerified + "T00:00:00Z")
  .toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

const About = () => (
  <div className="min-h-screen bg-white">
    <Helmet>
      <title>About VetNextStep</title>
      <meta name="description" content="What VetNextStep is, how its licensing and visa figures are sourced and verified, and where to check current requirements directly." />
      <link rel="canonical" href="https://vetnextstep.com/about" />
      <meta property="og:title" content="About VetNextStep" />
      <meta property="og:description" content="What VetNextStep is, how its licensing and visa figures are sourced and verified, and where to check current requirements directly." />
      <meta property="og:url" content="https://vetnextstep.com/about" />
      <meta property="og:image" content="https://vetnextstep.com/og-image.png" />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content="https://vetnextstep.com/og-image.png" />
    </Helmet>
    <SharedHeader />
    <main className="py-8 md:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-8">About VetNextStep</h1>

        <div className="prose-content space-y-6 text-gray-700 leading-relaxed">
          <p>
            VetNextStep is a reference site for veterinary career progression: licensing and registration
            routes, visa options, postgraduate certificates, graduate development programmes, internships
            and residencies, and CPD conferences and providers, covering the UK, USA, Canada, Australia, and
            New Zealand.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 pt-2">How the content is put together</h2>
          <p>
            The listings are compiled from the public websites of regulators, universities, corporate
            veterinary groups, and CPD providers — RCVS, AVMA, AAVSB, AVBC, and equivalent bodies in each
            country, along with the organisations running each programme. Licensing and visa figures that
            change over time — exam fees, salary thresholds, application windows — are held as individually
            sourced facts, each with a link to the originating page and the date it was last checked, rather
            than written into page copy where they'd be easy to leave stale. That verification date is shown
            wherever those figures appear.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 pt-2">What it isn't</h2>
          <p>
            VetNextStep is not a substitute for advice from a qualified immigration professional or from the
            relevant regulatory body, and it doesn't hold real-time data — a regulator can change a fee,
            threshold, or deadline faster than any third-party site can track it. Before making a decision
            that depends on a specific figure or date, verify it directly with the source linked on that
            page.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 pt-2">Errors and corrections</h2>
          <p>
            If something on the site is out of date or wrong, the fastest way to get it corrected is to{" "}
            <Link to="/contact" className="text-blue-600 hover:underline font-medium">get in touch</Link>{" "}
            with the specific page and detail.
          </p>

          <p className="text-sm text-gray-400 pt-4 border-t border-gray-100">
            Licensing and visa fact sources on this site were last verified {lastVerified}.
          </p>
        </div>
      </div>
    </main>
    <SharedFooter />
  </div>
);

export default About;
