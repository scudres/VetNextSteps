import React, { useState, useEffect, useRef } from "react";

/**
 * Reusable multi-select dropdown filter.
 *
 * Props:
 *   label        – button label text
 *   options      – array of values (strings) OR objects when valueKey/labelKey are set
 *   selected     – array of currently selected values
 *   onToggle     – (value) => void  called when a checkbox is toggled
 *   valueKey     – object key to use as the value  (optional)
 *   labelKey     – object key to use as the display label (optional)
 *   menuClassName – extra Tailwind classes applied to the dropdown panel (optional)
 */
const FilterDropdown = ({
  label,
  options,
  selected,
  onToggle,
  valueKey = null,
  labelKey = null,
  menuClassName = "",
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const getValue = (opt) => (valueKey ? opt[valueKey] : opt);
  const getLabel = (opt) => (labelKey ? opt[labelKey] : opt);
  const count = selected.length;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-medium transition-colors ${
          count > 0
            ? "bg-blue-600 text-white border-blue-600"
            : "bg-white text-gray-700 border-gray-300 hover:border-gray-500"
        }`}
      >
        {label}
        {count > 0 && (
          <span className="bg-white/25 text-xs rounded-full px-1.5 min-w-[18px] text-center leading-5">
            {count}
          </span>
        )}
        <svg
          className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div
          className={`absolute top-full mt-2 left-0 bg-white border border-gray-200 rounded-xl shadow-lg z-50 py-2 min-w-[200px] max-h-72 overflow-y-auto ${menuClassName}`}
        >
          {options.map((opt) => {
            const val = getValue(opt);
            const lbl = getLabel(opt);
            const checked = selected.includes(val);
            return (
              <label
                key={String(val)}
                className="flex items-center gap-2.5 px-4 py-1.5 hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggle(val)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-400 cursor-pointer"
                />
                <span className={`text-sm ${checked ? "font-medium text-blue-700" : "text-gray-700"}`}>
                  {lbl}
                </span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;
