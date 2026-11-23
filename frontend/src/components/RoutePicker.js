import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Origins and destinations mirror RouteFinder.js. Ids are the query parameters
// that page already reads, so this is a shortcut into it rather than a copy of it.
const ORIGINS = [
  { id: "uk",     label: "United Kingdom" },
  { id: "eu",     label: "EU / EEA" },
  { id: "usa",    label: "United States" },
  { id: "canada", label: "Canada" },
  { id: "anz",    label: "Australia / New Zealand" },
  { id: "other",  label: "Elsewhere" },
];

const DESTINATIONS = [
  { id: "usa",       label: "United States" },
  { id: "uk",        label: "United Kingdom" },
  { id: "canada",    label: "Canada" },
  { id: "australia", label: "Australia" },
];

// Native radios, so arrow keys and screen readers work as they would on a
// <select>; the visible button is the label, styled from the input's state.
const Choice = ({ name, legend, options, value, onChange }) => (
  <fieldset className="border-0 p-0 m-0">
    <legend className="text-xs text-gray-600 mb-1.5">{legend}</legend>
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <div key={o.id}>
          <input
            type="radio"
            id={`${name}-${o.id}`}
            name={name}
            value={o.id}
            checked={value === o.id}
            onChange={() => onChange(o.id)}
            className="sr-only peer"
          />
          <label
            htmlFor={`${name}-${o.id}`}
            className="block px-3 py-1.5 text-sm text-gray-800 bg-white border border-gray-300 cursor-pointer hover:border-navy peer-checked:bg-navy peer-checked:text-white peer-checked:border-navy peer-focus-visible:ring-2 peer-focus-visible:ring-blue-800 peer-focus-visible:ring-offset-1"
          >
            {o.label}
          </label>
        </div>
      ))}
    </div>
  </fieldset>
);

const RoutePicker = ({ heading = "Licensing route finder", blurb = "Your registration, exam, and visa steps in order." }) => {
  const [from, setFrom] = useState("uk");
  const [to, setTo]     = useState("usa");
  const navigate        = useNavigate();

  const go = () => navigate(`/licensing-route?from=${from}&to=${to}`);

  return (
    // No box: a bordered, padded panel indented its contents 17px past the
    // stage text above it. A rule on top with the content flush left matches
    // how the pathway stages are set, so both columns share one left edge.
    <div className="border-t-[3px] border-t-blue-800 pt-3">
      <h2 className="text-sm font-bold text-gray-900">{heading}</h2>
      <p className="text-xs text-gray-600 mb-3">{blurb}</p>
      <div className="space-y-4 max-w-3xl">
        <Choice name="route-from" legend="I qualified in" options={ORIGINS} value={from} onChange={setFrom} />
        <Choice name="route-to" legend="I want to work in" options={DESTINATIONS} value={to} onChange={setTo} />
      </div>
      <button
        type="button"
        onClick={go}
        className="mt-4 bg-navy text-white px-6 py-2.5 text-sm font-semibold hover:bg-[#0f3a63] focus:outline-none focus:ring-2 focus:ring-blue-800 focus:ring-offset-1"
      >
        Show my steps
      </button>
    </div>
  );
};

export default RoutePicker;
