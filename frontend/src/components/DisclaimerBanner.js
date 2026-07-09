import React from "react";
import { Link } from "react-router-dom";
import visaFacts from "../data/visaFacts.json";

// Derive the default "last reviewed" label from the visa facts file so it can
// never silently go stale — the automated verifier bumps lastVerified on each run.
const defaultReviewed = new Date(visaFacts.lastVerified + "T00:00:00Z")
  .toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });

/**
 * Visible disclaimer banner for pages containing licensing/visa/immigration information.
 *
 * Props:
 *   officialBody  — { name: string, url: string } — the primary regulatory body to verify with
 *   lastReviewed  — string — e.g. "July 2026" (defaults to visaFacts.lastVerified)
 */
const DisclaimerBanner = ({ officialBody, lastReviewed = defaultReviewed }) => (
  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
    <div className="flex-shrink-0 mt-0.5">
      <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
    </div>
    <div className="text-sm text-amber-900 leading-relaxed">
      <p className="font-semibold mb-1">For information only — not professional or immigration advice</p>
      <p className="text-amber-800">
        This guide summarises the general process based on publicly available information. It is not a
        substitute for advice from a qualified immigration professional or the relevant regulatory body.
        {officialBody && (
          <>
            {" "}Always verify current requirements directly with{" "}
            <a
              href={officialBody.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline hover:text-amber-900 transition-colors"
            >
              {officialBody.name}
            </a>
            .
          </>
        )}
        {" "}Requirements change — <strong>last reviewed {lastReviewed}</strong>.{" "}
        <Link to="/legal?tab=terms" className="font-medium underline hover:text-amber-900 transition-colors">
          Full disclaimer
        </Link>
        .
      </p>
    </div>
  </div>
);

export default DisclaimerBanner;
