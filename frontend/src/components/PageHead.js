import React from "react";
import { Link } from "react-router-dom";

/**
 * Left-aligned page heading for listing and guide pages.
 *
 * Replaces the centred hero the listings used to open with: a centred block
 * pushes the first result below the fold and gives the eye a different starting
 * edge from the content underneath it. Everything here starts where the rail,
 * the filters and the results start.
 *
 *   trail  – [{ label, to }] breadcrumb, current page last without a `to`
 *   count  – short factual line under the title (entry count, last checked)
 *   lede   – one sentence on what the page holds; omit rather than pad
 */
const PageHead = ({ trail = [], title, count, lede, children }) => (
  <div className="border-b border-gray-200">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {trail.length > 0 && (
        <nav aria-label="Breadcrumb" className="pt-3 text-xs text-gray-500">
          {trail.map((step, i) => (
            <React.Fragment key={step.label}>
              {i > 0 && <span className="px-1.5 text-gray-400" aria-hidden="true">›</span>}
              {step.to
                ? <Link to={step.to} className="text-blue-800 underline underline-offset-2">{step.label}</Link>
                : <span aria-current="page">{step.label}</span>}
            </React.Fragment>
          ))}
        </nav>
      )}
      <div className="pt-3 pb-5">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">{title}</h1>
        {count && <p className="mt-1.5 text-sm text-gray-600 tabular-nums">{count}</p>}
        {lede && (
          <p className="mt-2.5 font-serif text-[17px] leading-relaxed text-gray-700 max-w-[58ch]">{lede}</p>
        )}
        {children}
      </div>
    </div>
  </div>
);

export default PageHead;
