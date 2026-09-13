import React from "react";
import { Link } from "react-router-dom";
import { PATHWAY, COUNTRY_AXIS } from "../data/pathway";

/**
 * The career track, in three forms:
 *
 *   <PathwayFull />            the homepage graphic
 *   <PathwayRail current={1}/> the slim rail under the menu on inner pages
 *   <CountryAxis here="/uk" /> the second axis, for licensing pages
 *
 * All three read from data/pathway.js, so a stage renamed there is renamed
 * everywhere. Stage segment colours are data rather than Tailwind classes:
 * a dynamic class name would be purged from the build.
 */

const StopLinks = ({ links }) => (
  <ul className="space-y-1">
    {links.map((l) => (
      <li key={l.label}>
        {l.to ? (
          <Link to={l.to} className="text-sm text-blue-800 underline underline-offset-2 decoration-blue-200 hover:decoration-blue-800">
            {l.label}
          </Link>
        ) : (
          <a href={l.href} target="_blank" rel="noopener noreferrer"
             className="text-sm text-blue-800 underline underline-offset-2 decoration-blue-200 hover:decoration-blue-800">
            {l.label}
          </a>
        )}
        {typeof l.count === "number" && (
          <span className="ml-1.5 text-xs font-semibold text-gray-500 tabular-nums">{l.count}</span>
        )}
      </li>
    ))}
  </ul>
);

export const PathwayFull = () => (
  <div className="px-4 sm:px-6 lg:px-8 pt-6 pb-2 overflow-x-auto">
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-5 gap-0 min-w-[860px]">
        {PATHWAY.map((stop) => (
          <div key={stop.id} className="pr-5">
            <span className="block h-2" style={{ backgroundColor: stop.colour }} />
            <h2 className="pt-3 text-base font-bold tracking-tight text-gray-900">{stop.label}</h2>
            <p className="mt-1.5 mb-2.5 text-sm text-gray-600 max-w-[30ch]">{stop.blurb}</p>
            <StopLinks links={stop.links} />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const PathwayRail = ({ current }) => (
  <div className="bg-slate-50 border-b border-gray-200">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 overflow-x-auto">
      <div className="grid grid-cols-5 gap-0 min-w-[620px]">
        {PATHWAY.map((stop, i) => {
          const here = i === current;
          return (
            <div key={stop.id} className="pr-1">
              <span
                className="block h-1.5"
                style={{ backgroundColor: stop.colour, opacity: here ? 1 : 0.3 }}
              />
              <span
                className={`block pt-2 text-xs leading-tight ${here ? "font-bold text-gray-900" : "font-medium text-gray-500"}`}
                aria-current={here ? "step" : undefined}
              >
                {stop.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  </div>
);

export const CountryAxis = ({ here, note }) => (
  <div className="bg-slate-50 border-t-[3px] border-b border-t-[#0c2b4b] border-b-gray-200">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center gap-2">
      <span className="text-xs font-bold text-gray-900 mr-1">Registration:</span>
      {COUNTRY_AXIS.map((c) => (
        <Link
          key={c.to}
          to={c.to}
          className={`text-xs px-2.5 py-1 border ${
            here === c.to
              ? "bg-[#0c2b4b] border-[#0c2b4b] text-white"
              : "bg-white border-gray-200 text-blue-800 hover:border-blue-800"
          }`}
        >
          {c.label}
        </Link>
      ))}
      <span className="text-xs text-gray-500 sm:ml-auto">{note || "Separate from the career track."}</span>
    </div>
  </div>
);

export default PathwayRail;
