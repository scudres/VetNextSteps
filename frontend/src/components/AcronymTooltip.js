import React, { useState } from "react";

const glossary = {
  RCVS:   { full: "Royal College of Veterinary Surgeons",          note: "The UK regulatory body. You must register with RCVS before you can practise in Great Britain." },
  CertAVP:{ full: "Certificate in Advanced Veterinary Practice",   note: "RCVS-accredited postgraduate qualification offered by several UK vet schools as a pathway to Fellowship." },
  NAVLE:  { full: "North American Veterinary Licensing Examination", note: "360-question licensing exam required in all 50 US states and all Canadian provinces." },
  VIRMP:  { full: "Veterinary Internship & Residency Matching Program", note: "Runs the annual matching process for North American internships and specialist residencies." },
  MATCH:  { full: "VIRMP Matching Program",                         note: "The centralised matching process for veterinary internships and residencies in North America." },
  AVBC:   { full: "Australasian Veterinary Boards Council",         note: "Sets national registration standards across Australia and New Zealand." },
  AVE:    { full: "Australasian Veterinary Examination",            note: "Assessment exam for overseas graduates whose degree is not AVBC-recognised." },
  ECFVG:  { full: "Educational Commission for Foreign Veterinary Graduates", note: "AVMA programme that validates qualifications for non-AVMA-accredited graduates entering the US." },
  PAVE:   { full: "Program for the Assessment of Veterinary Education Equivalence", note: "Alternative US credential verification pathway run by the AAVSB. Check state acceptance before starting." },
  VetGDP: { full: "Veterinary Graduate Development Programme",      note: "RCVS-supported framework for structured new graduate development in UK practice." },
  NEB:    { full: "National Examining Board (Canada)",              note: "Administers the BCSE and NAVLE examinations for Canadian veterinary licensing." },
  BCSE:   { full: "Basic and Clinical Sciences Examination",        note: "Canadian prerequisite exam — you sit this before the NAVLE." },
  ECA:    { full: "Educational Credential Assessment",              note: "Formal verification of overseas veterinary qualifications required for Canadian immigration and licensing." },
  CVMA:   { full: "Canadian Veterinary Medical Association",        note: "National professional body — manages the credential assessment process for overseas graduates." },
  AAVSB:  { full: "American Association of Veterinary State Boards", note: "Coordinates licensing exams and state board services across the US. Runs the PAVE programme." },
  AVMA:   { full: "American Veterinary Medical Association",        note: "National professional body in the US. Runs the ECFVG certification programme for overseas graduates." },
  PNP:    { full: "Provincial Nominee Program",                     note: "Canada's province-specific immigration route. Many provinces prioritise healthcare workers including vets." },
};

const AcronymTooltip = ({ term, children }) => {
  const [visible, setVisible] = useState(false);
  const entry = glossary[term];
  if (!entry) return <>{children || term}</>;

  return (
    <span className="relative inline-block">
      <span
        className="border-b border-dotted border-blue-400 cursor-help"
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
        tabIndex={0}
        aria-describedby={`tooltip-${term}`}
      >
        {children || term}
      </span>
      {visible && (
        <div
          id={`tooltip-${term}`}
          role="tooltip"
          className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-60 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-xl pointer-events-none"
        >
          <p className="font-semibold text-blue-300 mb-1">{entry.full}</p>
          <p className="text-gray-300 leading-snug">{entry.note}</p>
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </span>
  );
};

export default AcronymTooltip;
