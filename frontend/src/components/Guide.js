import React from "react";
import { Link } from "react-router-dom";
import visaFacts from "../data/visaFacts.json";
import { formatShortDate } from "../utils";

/**
 * The building blocks of the licensing guides (/uk, /usa, /canada, /australia,
 * /countries, /uk/first-role, /licensing-route).
 *
 * They follow the listing pages: square corners, hairline rules, Source Serif
 * for the lede, navy for "this is a rule" and the amber `notice` colour only
 * for something with a date on it. A figure that comes from visaFacts.json
 * carries its source and verification date wherever it appears.
 */

const NAVY = "#0c2b4b";

export const linkClass =
  "text-blue-800 underline underline-offset-2 decoration-blue-200 hover:decoration-blue-800";

const ExternalIcon = () => (
  <svg className="inline-block ml-1 w-3 h-3 text-gray-400 align-baseline" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

/** A link to somebody else's site: new tab, with the icon and a screen-reader hint. */
export const ExtLink = ({ href, children, className = linkClass }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
    {children}
    <ExternalIcon />
    <span className="sr-only"> (opens in a new tab)</span>
  </a>
);

const hostOf = (url) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
};

/** "Source: gov.uk, verified 3 Sep 2026", read from visaFacts.json. */
export const Provenance = ({ factKey }) => {
  const f = visaFacts.facts[factKey];
  if (!f) return null;
  return (
    <span className="block mt-1 text-xs text-gray-500">
      Source: <ExtLink href={f.source}>{hostOf(f.source)}</ExtLink>, verified {formatShortDate(f.verified)}
    </span>
  );
};

/** The value of a visaFacts.json entry, for use inside running text. */
export const fact = (key) => visaFacts.facts[key];

// ─── Page frame ──────────────────────────────────────────────────────────────

const Breadcrumb = ({ crumbs }) => (
  <nav aria-label="Breadcrumb" className="mb-3 text-xs text-gray-500">
    {crumbs.map((c, i) => (
      <React.Fragment key={c.label}>
        {i > 0 && <span className="px-1.5 text-gray-400" aria-hidden="true">›</span>}
        {c.to ? (
          <Link to={c.to} className="text-blue-800 underline underline-offset-2">{c.label}</Link>
        ) : (
          <span aria-current="page">{c.label}</span>
        )}
      </React.Fragment>
    ))}
  </nav>
);

/**
 * Header, optional contents column, content. `toc` is [{ id, label }]; each id
 * must match a GuideSection. Without `toc` the content runs full width, which
 * is what the comparison table on /countries needs.
 */
export const GuideLayout = ({ crumbs, title, lede, toc, children }) => (
  <main className="py-8 md:py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8 pb-5 border-b border-gray-200">
        <Breadcrumb crumbs={crumbs} />
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">{title}</h1>
        <p className="mt-2.5 font-serif text-[17px] leading-relaxed text-gray-700 max-w-[58ch]">{lede}</p>
      </div>

      {toc ? (
        <div className="grid grid-cols-1 lg:grid-cols-[236px_minmax(0,1fr)] gap-0">
          <div className="lg:border-r lg:border-gray-200">
            <nav aria-label="On this page" className="bg-slate-50 px-5 py-5 mb-8 lg:mb-0 lg:bg-transparent lg:px-0 lg:pr-5 lg:sticky lg:top-4">
              <p className="text-[13px] font-bold text-gray-600 pb-2 mb-2.5 border-b border-gray-300">On this page</p>
              <ul className="space-y-1.5">
                {toc.map((t) => (
                  <li key={t.id}>
                    <a href={`#${t.id}`} className="text-[14px] leading-snug text-blue-800 underline underline-offset-2 decoration-blue-200 hover:decoration-blue-800">
                      {t.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <div className="min-w-0 lg:pl-10 max-w-4xl">{children}</div>
        </div>
      ) : (
        <div>{children}</div>
      )}
    </div>
  </main>
);

export const GuideSection = ({ id, title, children }) => (
  <section id={id} className="scroll-mt-6 mt-10 pt-8 border-t border-gray-200 first:mt-0 first:pt-0 first:border-t-0">
    <h2 className="text-xl font-bold tracking-tight text-gray-900 mb-4">{title}</h2>
    {children}
  </section>
);

// ─── Text ────────────────────────────────────────────────────────────────────

export const P = ({ children, className = "" }) => (
  <p className={`text-[15px] leading-relaxed text-gray-700 max-w-[68ch] mb-3 ${className}`}>{children}</p>
);

export const H3 = ({ children }) => (
  <h3 className="text-base font-bold text-gray-900 mt-6 mb-2">{children}</h3>
);

/** A set of parallel items. For a sequence use Route. */
export const Bullets = ({ children }) => (
  <ul className="list-disc pl-5 space-y-1.5 text-[15px] leading-relaxed text-gray-700 max-w-[68ch] mb-3 marker:text-gray-400">
    {children}
  </ul>
);

/**
 * tone "rule":   a fact or caution that holds all the time (navy edge).
 * tone "notice": something with a date on it, such as a deadline or a closed
 *                application window (amber edge). Nothing else gets amber.
 */
export const Callout = ({ tone = "rule", title, children }) => (
  <div
    className={`my-5 border-l-4 px-4 py-3 text-[15px] leading-relaxed max-w-[68ch] text-gray-800 ${
      tone === "notice" ? "border-l-notice bg-[#fdf7e7]" : "bg-slate-50"
    }`}
    style={tone === "notice" ? undefined : { borderLeftColor: NAVY }}
  >
    {title && <p className="font-bold text-gray-900 mb-1">{title}</p>}
    {children}
  </div>
);

// ─── Reference blocks ────────────────────────────────────────────────────────

/**
 * Label and value rows. `facts` lists visaFacts.json keys whose source and
 * verification date print under the value; `sources` is [{ label, url }] for a
 * source that is not in that file (no date is claimed for those).
 */
export const FactSheet = ({ rows }) => (
  <dl className="border-t border-gray-300">
    {rows.map((r) => (
      <div key={r.label} className="grid grid-cols-1 sm:grid-cols-[11rem_minmax(0,1fr)] gap-x-6 gap-y-1 py-3 border-b border-gray-200">
        <dt className="text-sm font-bold text-gray-900">{r.label}</dt>
        <dd className="text-[15px] leading-relaxed text-gray-700">
          {r.value}
          {/* Two figures from one source print that source once */}
          {(r.facts || [])
            .filter((k, i, all) => all.findIndex((o) => visaFacts.facts[o].source === visaFacts.facts[k].source && visaFacts.facts[o].verified === visaFacts.facts[k].verified) === i)
            .map((k) => <Provenance key={k} factKey={k} />)}
          {(r.sources || []).map((s) => (
            <span key={s.url} className="block mt-1 text-xs text-gray-500">
              Source: <ExtLink href={s.url}>{s.label}</ExtLink>
            </span>
          ))}
        </dd>
      </div>
    ))}
  </dl>
);

const ROUTE_COLOURS = ["#1e40af", "#2f56c4", "#4a72d8", "#6b8ee4", "#8aa5ea"];

/**
 * An ordered sequence. The coloured bar over each step is the same device as
 * the career track on the homepage, so a process reads the same way everywhere.
 */
export const Route = ({ steps }) => (
  <ol
    className="grid gap-x-4 gap-y-5 my-4"
    style={{ gridTemplateColumns: `repeat(auto-fit, minmax(${steps.length > 4 ? 9.5 : 11}rem, 1fr))` }}
  >
    {steps.map((s, i) => (
      <li key={s.title}>
        <span className="block h-1.5" style={{ backgroundColor: ROUTE_COLOURS[Math.min(i, ROUTE_COLOURS.length - 1)] }} />
        <p className="mt-2 text-sm font-bold text-gray-900">
          <span className="tabular-nums text-gray-500 mr-1.5">{i + 1}</span>
          {s.title}
        </p>
        {s.detail && <p className="mt-1 text-sm leading-relaxed text-gray-600">{s.detail}</p>}
      </li>
    ))}
  </ol>
);

/** Options compared on the same attributes: `rows` are [label, ...one cell per column]. */
export const CompareTable = ({ caption, columns, rows }) => (
  <div className="overflow-x-auto my-4">
    <table className="w-full min-w-[34rem] text-sm border-t border-gray-300">
      <caption className="sr-only">{caption}</caption>
      <thead>
        <tr>
          <td className="border-b border-gray-300" />
          {columns.map((c) => (
            <th key={c} scope="col" className="text-left align-bottom font-bold text-gray-900 py-2 pr-5 border-b border-gray-300">{c}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map(([label, ...cells]) => (
          <tr key={label}>
            <th scope="row" className="text-left align-top font-semibold text-gray-900 py-2.5 pr-5 border-b border-gray-200 w-36">{label}</th>
            {cells.map((cell, i) => (
              <td key={i} className="align-top leading-relaxed text-gray-700 py-2.5 pr-5 border-b border-gray-200">{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

/** Where to go next on this site: a ruled list of internal links with a line each. */
export const NextList = ({ items }) => (
  <ul className="border-t border-gray-300">
    {items.map((it) => (
      <li key={it.to} className="py-3 border-b border-gray-200">
        <Link to={it.to} className={`${linkClass} font-bold`}>{it.title}</Link>
        <p className="mt-0.5 text-sm text-gray-600 max-w-[68ch]">{it.description}</p>
      </li>
    ))}
  </ul>
);

/** Official bodies and portals, two columns on wide screens. */
export const SourceList = ({ items }) => (
  <ul className="grid grid-cols-1 md:grid-cols-2 md:gap-x-10 border-t border-gray-300">
    {items.map((o) => (
      <li key={o.url} className="py-2.5 border-b border-gray-200 text-sm">
        <ExtLink href={o.url}>{o.name}</ExtLink>
      </li>
    ))}
  </ul>
);
