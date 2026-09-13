// The career track that drives the homepage graphic, the slim rail on inner
// pages, and the "Training & Qualifications" menu. One list, so renaming a
// stage changes every appearance of it at once.
//
// Registration is deliberately NOT on this track: it runs on its own timetable
// rather than at a career stage. It gets its own axis (see COUNTRY_AXIS below).
import { counts } from "./counts";

export const PATHWAY = [
  {
    id: "new-graduate",
    label: "New graduate",
    colour: "#1e40af",
    blurb: "Structured support, mentorship, and a supervised first year.",
    links: [
      { label: "Graduate development programmes", to: "/training-programs", count: counts.training },
      { label: "RCVS VetGDP", href: "https://www.rcvs.org.uk/lifelong-learning/veterinary-graduate-development-programme-vetgdp/" },
    ],
  },
  {
    id: "in-practice",
    label: "In practice",
    colour: "#2f56c4",
    blurb: "Keeping hours up, and choosing where to spend them.",
    links: [
      { label: "CPD providers & courses", to: "/cpd/providers", count: counts.providers },
      { label: "Conferences & congresses", to: "/cpd", count: counts.conferences },
    ],
  },
  {
    id: "postgraduate-certificate",
    label: "Postgraduate certificate",
    colour: "#4a72d8",
    blurb: "Formal qualifications taken without leaving the job.",
    links: [
      { label: "All certificates", to: "/postgraduate-certificates", count: counts.certificates },
      { label: "RCVS CertAVP", href: "https://www.rcvs.org.uk/lifelong-learning/postgraduate-qualifications/certificate-in-advanced-veterinary-practice-certavp/" },
    ],
  },
  {
    id: "internships-residencies",
    label: "Internships and residencies",
    colour: "#6b8ee4",
    blurb: "Rotating internships and residency posts at teaching hospitals and referral centres.",
    links: [
      { label: "All posts", to: "/internships-residencies", count: counts.internships },
      { label: "VIRMP — the MATCH", href: "https://www.virmp.org/" },
    ],
  },
  {
    id: "board-certification",
    label: "Board certification",
    colour: "#c3ccdb",
    blurb: "Awarded by the colleges, not covered here. Residency listings note which college a post prepares you for.",
    links: [],
  },
];

// The second axis. Same visual weight as the track, separated from it by a
// navy rule, because registration is not a career stage.
export const COUNTRY_AXIS = [
  { label: "United Kingdom", to: "/uk",        body: "RCVS · 3–6 months"        },
  { label: "United States",  to: "/usa",       body: "NAVLE · ECFVG or PAVE"    },
  { label: "Canada",         to: "/canada",    body: "NAVLE · provincial"       },
  { label: "Australia",      to: "/australia", body: "AVBC · state board"       },
];

export const stopIndex = (id) => PATHWAY.findIndex((s) => s.id === id);
