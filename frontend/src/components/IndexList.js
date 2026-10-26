import React from "react";
import { Link } from "react-router-dom";

/**
 * A ruled list of places to go: a name, an optional line saying what is behind
 * it, and how many entries it holds. Used wherever a hub page used to show
 * photo tiles, so the count is the first thing a reader can compare.
 *
 *   items – [{ to, name, note?, count }]
 */
const IndexList = ({ items }) => (
  <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 md:gap-x-10 border-t border-gray-300">
    {items.map((it) => (
      <li key={it.to} className="border-b border-gray-200">
        <Link to={it.to} className="group flex items-baseline justify-between gap-4 py-3.5">
          <span className="min-w-0">
            <span className="block text-base font-bold text-gray-900 group-hover:text-blue-800 group-hover:underline underline-offset-2 decoration-blue-200">
              {it.name}
            </span>
            {it.note && <span className="block mt-0.5 text-sm leading-snug text-gray-600">{it.note}</span>}
          </span>
          <span className="text-sm text-gray-500 tabular-nums whitespace-nowrap">{it.count}</span>
        </Link>
      </li>
    ))}
  </ul>
);

export default IndexList;
