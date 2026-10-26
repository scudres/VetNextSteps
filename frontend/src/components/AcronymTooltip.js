import React, { useState } from "react";

const glossary = {
  RCVS:   { full: "Royal College of Veterinary Surgeons",          note: "The UK regulatory body. You must register with the RCVS before you can practise anywhere in the United Kingdom (Great Britain and Northern Ireland)." },
  CertAVP:{ full: "Certificate in Advanced Veterinary Practice",   note: "RCVS-accredited postgraduate qualification offered by several UK vet schools as a pathway to Advanced Practitioner status and Fellowship." },
  NAVLE:  { full: "North American Veterinary Licensing Examination", note: "360-question licensing exam required in all 50 US states and all Canadian provinces." },
  VIRMP:  { full: "Veterinary Internship & Residency Matching Program", note: "Runs the annual matching process for North American internships and specialist residencies." },
  MATCH:  { full: "VIRMP Matching Program",                         note: "The centralised matching process for veterinary internships and residencies in North America." },
  AVBC:   { full: "Australasian Veterinary Boards Council",         note: "Sets national registration standards and accredits degrees across Australia and New Zealand." },
  AVE:    { full: "Australasian Veterinary Examination",            note: "Two-part assessment (MCQ and clinical exam) for overseas graduates whose degree is not AVBC-recognised." },
  ECFVG:  { full: "Educational Commission for Foreign Veterinary Graduates", note: "AVMA programme that validates qualifications for non-AVMA-accredited graduates entering the US." },
  PAVE:   { full: "Program for the Assessment of Veterinary Education Equivalence", note: "Alternative credential verification pathway run by the AAVSB; also an NEB route in Canada. Check state acceptance before starting." },
  VetGDP: { full: "Veterinary Graduate Development Programme",      note: "RCVS programme that is mandatory for all new graduates, with a trained VetGDP Adviser in the first role." },
  NEB:    { full: "National Examining Board (Canada)",              note: "CVMA board that assesses non-accredited degrees and administers the BCSE, NAVLE, and CPE to issue a Certificate of Qualification." },
  BCSE:   { full: "Basic and Clinical Sciences Examination",        note: "Computer-based multiple-choice exam required for non-AVMA-accredited graduates under ECFVG (US) and NEB (Canada) before sitting the NAVLE." },
  CPE:    { full: "Clinical Proficiency Examination",               note: "Hands-on practical exam taken by non-accredited graduates under ECFVG (US) and the NEB (Canada)." },
  CQ:     { full: "Certificate of Qualification (Canada)",          note: "Issued by the CVMA National Examining Board after passing required exams; prerequisite for full provincial licensure." },
  ECA:    { full: "Educational Credential Assessment",              note: "Formal verification of overseas veterinary qualifications required for Canadian Express Entry immigration." },
  CVMA:   { full: "Canadian Veterinary Medical Association",        note: "National professional body that operates the National Examining Board (NEB) and ECA assessments." },
  AAVSB:  { full: "American Association of Veterinary State Boards", note: "Coordinates licensing exams and state board services across North America; administers the PAVE programme." },
  AVMA:   { full: "American Veterinary Medical Association",        note: "US national body whose Council on Education (COE) accredits veterinary schools in the US, Canada, and internationally." },
  EAEVE:  { full: "European Association of Establishments for Veterinary Education", note: "Evaluates and accredits European veterinary schools." },
  PNP:    { full: "Provincial Nominee Program",                     note: "Canada's province-specific permanent residency route, often used by vets with a provincial job offer." },
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
          className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-60 bg-gray-900 text-white text-xs p-3 pointer-events-none"
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
