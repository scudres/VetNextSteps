import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import SharedHeader from "./SharedHeader";
import SharedFooter from "./SharedFooter";

// Rendered for any path that doesn't match a route. This is also what
// react-snap captures into build/404.html, and netlify.toml's trailing
// wildcard redirect now serves that file with a genuine 404 status —
// previously an unmatched URL rendered nothing (no catch-all route existed)
// and Netlify returned the homepage shell with a 200 status.
const NotFound = () => (
  <div className="min-h-screen bg-white">
    <Helmet>
      <title>Page not found | VetNextStep</title>
      <meta name="robots" content="noindex, follow" />
    </Helmet>
    <SharedHeader />
    <main className="py-20 md:py-32">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm font-semibold text-blue-600 uppercase tracking-widest mb-4">404</p>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Page not found</h1>
        <p className="text-gray-500 mb-10">
          The page you're looking for doesn't exist, or the link is out of date.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            Go to homepage
          </Link>
          <Link
            to="/licensing-route"
            className="inline-flex items-center border border-gray-300 hover:border-blue-400 hover:text-blue-600 text-gray-700 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            Licensing route finder
          </Link>
          <Link
            to="/cpd"
            className="inline-flex items-center border border-gray-300 hover:border-blue-400 hover:text-blue-600 text-gray-700 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            CPD & Conferences
          </Link>
        </div>
      </div>
    </main>
    <SharedFooter />
  </div>
);

export default NotFound;
