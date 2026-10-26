import React from "react";
import { Link } from "react-router-dom";
import visaFacts from "../data/visaFacts.json";
import { formatMonthYear } from "../utils";

// Derive the default "last reviewed" label from the visa facts file so it can
// never silently go stale — the automated verifier bumps lastVerified on each run.
const defaultReviewed = formatMonthYear(visaFacts.lastVerified);

/**
 * Visible disclaimer banner for pages containing licensing/visa/immigration information.
 *
 * Props:
 *   officialBody  — { name: string, url: string } — the primary regulatory body to verify with
 *   lastReviewed  — string — e.g. "July 2026" (defaults to visaFacts.lastVerified)
 */
const DisclaimerBanner = ({ officialBody, lastReviewed = defaultReviewed }) => (
  <aside
    className="mb-8 border-l-4 bg-slate-50 px-4 py-3 text-sm leading-relaxed text-gray-700 max-w-[68ch]"
    style={{ borderLeftColor: "#0c2b4b" }}
  >
    <p className="font-bold text-gray-900 mb-1">For information only, not professional or immigration advice</p>
    <p>
      This guide summarises the general process from publicly available information and does not replace advice from
      an immigration professional or the regulator.
      {officialBody && (
        <>
          {" "}Check current requirements with{" "}
          <a
            href={officialBody.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-800 underline underline-offset-2 decoration-blue-200 hover:decoration-blue-800"
          >
            {officialBody.name}
          </a>
          .
        </>
      )}
      {" "}Requirements change; last reviewed {lastReviewed}.{" "}
      <Link
        to="/legal?tab=terms"
        className="text-blue-800 underline underline-offset-2 decoration-blue-200 hover:decoration-blue-800"
      >
        Full disclaimer
      </Link>
      .
    </p>
  </aside>
);

export default DisclaimerBanner;
