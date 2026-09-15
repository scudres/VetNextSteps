import React, { useState } from "react";

/**
 * Left-hand filter column, shared by every listing page.
 *
 * It is presentation only: state stays on the page in the same
 * { category: [values] } shape FilterRow used, so pages keep their existing
 * toggle/clear handlers and URL syncing.
 *
 *   groups   – [{ key, heading, options, limit }]
 *              options are strings, or objects with { value, label }
 *   filters  – { [key]: [selected values] }
 *   onToggle – (key, value) => void
 *   onClear  – () => void
 *   summary  – node rendered above the groups (usually the result count)
 */
const valueOf = (opt) => (opt && typeof opt === "object" ? opt.value : opt);
const labelOf = (opt) => (opt && typeof opt === "object" ? opt.label : opt);

const FilterGroup = ({ group, selected, onToggle }) => {
  const [expanded, setExpanded] = useState(false);
  const { key, heading, options, limit, moreLabel } = group;
  const hasLimit = typeof limit === "number" && options.length > limit;
  // Anything already ticked stays visible even when it sits past the cut-off,
  // otherwise a filter from the URL would be active but invisible.
  const shown = expanded || !hasLimit
    ? options
    : options.filter((o, i) => i < limit || selected.includes(valueOf(o)));

  return (
    <fieldset className="mb-6 border-0 p-0 m-0">
      <legend className="w-full text-[13px] font-bold text-gray-600 pb-2 mb-2.5 border-b border-gray-300">
        {heading}
      </legend>
      <div className="space-y-1.5">
        {shown.map((opt) => {
          const value = valueOf(opt);
          const id = `f-${key}-${String(value).replace(/\W+/g, "-")}`;
          return (
            // input and label are siblings, not nested: a label with htmlFor
            // wrapped around its own input forwards a second activation and
            // the two toggles cancel out.
            <div key={id} className="flex items-start gap-2.5">
              <input
                id={id}
                type="checkbox"
                checked={selected.includes(value)}
                onChange={() => onToggle(key, value)}
                className="mt-0.5 w-4 h-4 flex-shrink-0 accent-blue-800 cursor-pointer"
              />
              <label htmlFor={id} className="text-[14px] leading-snug text-gray-800 cursor-pointer hover:text-gray-900">
                {labelOf(opt)}
              </label>
            </div>
          );
        })}
      </div>
      {hasLimit && (
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          className="mt-2 text-[13px] text-blue-800 underline underline-offset-2 hover:text-blue-900"
        >
          {expanded ? "Show fewer" : (moreLabel || `All ${options.length}`)}
        </button>
      )}
    </fieldset>
  );
};

const FilterSidebar = ({ groups, filters, onToggle, onClear, summary }) => {
  const active = groups.reduce((n, g) => n + (filters[g.key] || []).length, 0);

  return (
    <aside className="bg-slate-50 border-r border-gray-200 px-5 py-5 lg:min-h-full">
      {summary && <div className="mb-5">{summary}</div>}

      {active > 0 && (
        <button
          type="button"
          onClick={onClear}
          className="mb-5 text-[13px] text-blue-800 underline underline-offset-2 hover:text-blue-900"
        >
          Clear all filters ({active})
        </button>
      )}

      {groups
        .filter((g) => g.options && g.options.length > 0)
        .map((g) => (
          <FilterGroup
            key={g.key}
            group={g}
            selected={filters[g.key] || []}
            onToggle={onToggle}
          />
        ))}
    </aside>
  );
};

export default FilterSidebar;
