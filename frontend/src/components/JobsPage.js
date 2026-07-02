import React from "react";
import { Helmet } from "react-helmet-async";
import SharedHeader from "./SharedHeader";
import SharedFooter from "./SharedFooter";

const JobsPage = () => (
  <div className="min-h-screen bg-white">
    <Helmet>
      <title>Job Opportunities | VetNextStep</title>
      <meta name="description" content="Veterinary job opportunities — coming soon. Contact us to advertise your vacancy on VetNextStep." />
      <link rel="canonical" href="https://vetnextstep.com/jobs" />
      <meta name="robots" content="noindex, follow" />
      <meta property="og:title" content="Job Opportunities | VetNextStep" />
      <meta property="og:description" content="Veterinary job opportunities — coming soon. Contact us to advertise your vacancy." />
      <meta property="og:url" content="https://vetnextstep.com/jobs" />
      <meta property="og:image" content="https://vetnextstep.com/og-image.png" />
      <meta property="og:type" content="website" />
    </Helmet>
    <SharedHeader />

    <main className="py-16 md:py-24">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>

        <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-3">Coming soon</p>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Job Opportunities</h1>
        <p className="text-lg text-gray-500 leading-relaxed mb-10">
          We're building a dedicated job board for veterinary roles across the UK, USA, Canada, and Australia. Check back soon.
        </p>

        {/* Advertise CTA */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8 text-left">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Want to advertise a vacancy?</h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-5">
            If you're a practice, corporate group, university, or referral centre looking to reach new graduate and early-career vets, get in touch. We'd love to feature your roles when the board launches — and early enquiries will be given priority placement.
          </p>
          <a
            href="mailto:hello@vetnextstep.com?subject=Job%20Advertising%20Enquiry"
            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            hello@vetnextstep.com
          </a>
        </div>

      </div>
    </main>

    <SharedFooter />
  </div>
);

export default JobsPage;
