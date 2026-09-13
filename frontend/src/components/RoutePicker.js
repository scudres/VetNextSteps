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

const RoutePicker = ({ heading = "Licensing route finder", blurb = "Your registration, exam, and visa steps in order." }) => {
  const [from, setFrom] = useState("uk");
  const [to, setTo]     = useState("usa");
  const navigate        = useNavigate();

  const go = () => navigate(`/licensing-route?from=${from}&to=${to}`);

  const select = "w-full px-2.5 py-2 border border-gray-400 bg-white text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-800 focus:border-blue-800";

  return (
    <div className="bg-blue-50 border border-gray-200 border-t-[3px] border-t-blue-800 p-4">
      <h2 className="text-sm font-bold text-gray-900">{heading}</h2>
      <p className="text-xs text-gray-600 mb-3">{blurb}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor="route-from" className="block text-xs text-gray-600 mb-1">I qualified in</label>
          <select id="route-from" value={from} onChange={(e) => setFrom(e.target.value)} className={select}>
            {ORIGINS.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="route-to" className="block text-xs text-gray-600 mb-1">I want to work in</label>
          <select id="route-to" value={to} onChange={(e) => setTo(e.target.value)} className={select}>
            {DESTINATIONS.map((d) => <option key={d.id} value={d.id}>{d.label}</option>)}
          </select>
        </div>
      </div>
      <button
        type="button"
        onClick={go}
        className="mt-3 w-full bg-navy text-white py-2.5 text-sm font-semibold hover:bg-[#0f3a63] focus:outline-none focus:ring-2 focus:ring-blue-800 focus:ring-offset-1"
      >
        Show my steps
      </button>
    </div>
  );
};

export default RoutePicker;
