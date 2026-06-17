"use strict";

const { conferences } = require("./data/conferences");
const { cpdProviders } = require("./data/providers");

const ALLOWED_ORIGINS = new Set([
  "https://vetnextstep.com",
  "https://www.vetnextstep.com",
  "http://localhost:3000",
  "http://localhost:3001",
]);

function corsHeaders(origin) {
  const allowed = ALLOWED_ORIGINS.has(origin) ? origin : "https://vetnextstep.com";
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Cache-Control": "no-store",
  };
}

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

// ——— Static index items ———

const trainingItems = [
  { title: "CVS Veterinary Group Graduate Programme", subtitle: "CVS Group", description: "Graduate development programme with mentorship and structured learning across CVS's nationwide network of practices.", section: "Training Programmes", navPath: "/training-programs", tags: ["CVS", "graduate", "UK", "mentorship", "primary care"] },
  { title: "IVC Evidensia Graduate Academy", subtitle: "IVC Evidensia", description: "Graduate academy offering structured learning, mentoring, and career development opportunities across IVC Evidensia's European and UK practices.", section: "Training Programmes", navPath: "/training-programs", tags: ["IVC", "IVC Evidensia", "Evidensia", "graduate", "UK", "Europe", "academy", "mentoring"] },
  { title: "Linnaeus Veterinary Graduate Development Programme", subtitle: "Linnaeus Group", description: "18-month structured programme with clinical rotations, mentoring, and professional development across Linnaeus's specialist and primary care hospitals.", section: "Training Programmes", navPath: "/training-programs", tags: ["Linnaeus", "graduate", "UK", "rotations", "mentoring", "18 month"] },
  { title: "Medivet Early Careers Programme", subtitle: "Medivet", description: "Early career development with mentoring and structured learning pathways, supporting new graduates through their first years in practice.", section: "Training Programmes", navPath: "/training-programs", tags: ["Medivet", "graduate", "UK", "early career", "mentoring"] },
  { title: "Vets4Pets Graduate Programme", subtitle: "Vets4Pets", description: "Graduate programme focusing on primary care development with ongoing clinical support, mentoring, and structured learning opportunities.", section: "Training Programmes", navPath: "/training-programs", tags: ["Vets4Pets", "graduate", "UK", "primary care", "Companion Care"] },
  { title: "VetPartners Graduate Programme", subtitle: "VetPartners", description: "Structured graduate programme with dedicated clinical mentoring and professional development opportunities across VetPartners's diverse practice network.", section: "Training Programmes", navPath: "/training-programs", tags: ["VetPartners", "graduate", "UK", "mentoring"] },
  { title: "VIRMP Rotating Internship", subtitle: "Veterinary Internship & Residency Matching Program", description: "One-year rotating internships at AVMA-accredited teaching hospitals and private practices across the USA.", section: "Training Programmes", navPath: "/training-programs", tags: ["VIRMP", "internship", "USA", "AVMA", "matching", "rotating"] },
  { title: "Banfield New Graduate Program", subtitle: "Banfield Pet Hospital", description: "Structured onboarding and mentorship programme for new veterinary graduates with dedicated mentor support and continuing education credits.", section: "Training Programmes", navPath: "/training-programs", tags: ["Banfield", "graduate", "USA", "mentor", "CE"] },
  { title: "VCA New Graduate Support", subtitle: "VCA Animal Hospitals", description: "New graduate support programme with mentorship, structured CE resources, and clinical development pathways.", section: "Training Programmes", navPath: "/training-programs", tags: ["VCA", "graduate", "USA", "mentorship"] },
  { title: "National Veterinary Associates New Graduate Programme", subtitle: "National Veterinary Associates (NVA)", description: "Mentored onboarding and ongoing clinical support for new graduates entering NVA practices.", section: "Training Programmes", navPath: "/training-programs", tags: ["NVA", "National Veterinary Associates", "graduate", "USA", "mentoring"] },
  { title: "VIRMP Rotating Internship (Canada)", subtitle: "Veterinary Internship & Residency Matching Program", description: "One-year rotating internships at Canadian veterinary teaching hospitals including OVC and WCVM.", section: "Training Programmes", navPath: "/training-programs", tags: ["VIRMP", "internship", "Canada", "OVC", "WCVM", "rotating"] },
  { title: "Banfield Canada New Graduate Program", subtitle: "Banfield Pet Hospital Canada", description: "Mentored new graduate programme with structured learning pathways and continuing education resources across Banfield's Canadian locations.", section: "Training Programmes", navPath: "/training-programs", tags: ["Banfield", "graduate", "Canada", "mentor"] },
  { title: "VCA Canada New Graduate Support", subtitle: "VCA Canada Animal Hospitals", description: "New graduate mentorship and structured professional development for veterinarians joining VCA Canada.", section: "Training Programmes", navPath: "/training-programs", tags: ["VCA", "VCA Canada", "graduate", "Canada", "mentorship"] },
  { title: "Greencross Vets Graduate Vet Program", subtitle: "Greencross Vets", description: "Structured graduate programme with dedicated mentorship, ongoing clinical education, and professional development across Australia.", section: "Training Programmes", navPath: "/training-programs", tags: ["Greencross", "graduate", "Australia", "mentor"] },
  { title: "Apiam Animal Health Graduate Program", subtitle: "Apiam Animal Health", description: "Graduate development programme focused on rural, regional, and production animal practice across regional Australia.", section: "Training Programmes", navPath: "/training-programs", tags: ["Apiam", "graduate", "Australia", "rural", "farm animal", "production"] },
  { title: "AVA Mentoring Program", subtitle: "Australian Veterinary Association", description: "The AVA connects new graduate veterinarians with experienced mentors for professional guidance and career development.", section: "Training Programmes", navPath: "/training-programs", tags: ["AVA", "mentoring", "Australia", "graduate"] },
].map((i) => ({ ...i, navPath: i.navPath + "#" + slugify(i.title) }));

const internshipItems = [
  { title: "VIRMP \u2014 Veterinary Internship and Residency Matching Program", subtitle: "VIRMP", description: "Central matching service for veterinary internships and residencies in North America.", section: "Internships & Residencies", navPath: "/internships-residencies", tags: ["VIRMP", "internship", "residency", "North America", "matching", "USA", "Canada"] },
  { title: "Royal Veterinary College Rotating Internship Programme", subtitle: "Royal Veterinary College", description: "Rotating small animal internship at the RVC referral hospital, expanding clinical knowledge and skills under supervision.", section: "Internships & Residencies", navPath: "/internships-residencies", tags: ["RVC", "Royal Veterinary College", "internship", "UK", "small animal", "referral"] },
  { title: "Royal Veterinary College Small Animal Residency Programmes", subtitle: "Royal Veterinary College", description: "Specialist residency training in small animal disciplines; all residents also registered for a Master's degree.", section: "Internships & Residencies", navPath: "/internships-residencies", tags: ["RVC", "Royal Veterinary College", "residency", "UK", "specialist", "MSc"] },
  { title: "University of Liverpool Rotating Internship Programme", subtitle: "University of Liverpool", description: "Rotating internship at the Small Animal Teaching Hospital (SATH) at Leahurst, multi-disciplinary referral setting.", section: "Internships & Residencies", navPath: "/internships-residencies", tags: ["Liverpool", "SATH", "internship", "UK", "small animal", "Leahurst"] },
  { title: "University of Liverpool Anaesthesia Internship Programme", subtitle: "University of Liverpool", description: "Discipline-specific internship in anaesthesia at the Liverpool Small Animal Teaching Hospital.", section: "Internships & Residencies", navPath: "/internships-residencies", tags: ["Liverpool", "internship", "UK", "anaesthesia", "discipline specific"] },
  { title: "University of Liverpool Small Animal Residency Programme", subtitle: "University of Liverpool", description: "Specialist residency programmes in multiple disciplines at SATH, Leahurst.", section: "Internships & Residencies", navPath: "/internships-residencies", tags: ["Liverpool", "SATH", "residency", "UK", "specialist"] },
  { title: "University of Cambridge Rotating Internship Programme", subtitle: "University of Cambridge", description: "High-quality postgraduate training across small animal disciplines at the Cambridge Queen's Veterinary School Hospital.", section: "Internships & Residencies", navPath: "/internships-residencies", tags: ["Cambridge", "internship", "UK", "small animal"] },
  { title: "University of Cambridge Senior Clinical Training Scholarship / Residency Programme", subtitle: "University of Cambridge", description: "Advanced clinical training programme preparing candidates for specialist residency entry.", section: "Internships & Residencies", navPath: "/internships-residencies", tags: ["Cambridge", "residency", "UK", "clinical training scholarship", "specialist"] },
  { title: "University of Edinburgh Rotating Internship Programme", subtitle: "University of Edinburgh", description: "53-week rotating internship in small animal disciplines at Easter Bush Campus.", section: "Internships & Residencies", navPath: "/internships-residencies", tags: ["Edinburgh", "internship", "UK", "rotating", "small animal", "53 week"] },
  { title: "University of Edinburgh Residency / Clinical Scholarship Programme", subtitle: "University of Edinburgh", description: "Professional Doctorate providing advanced clinical training in a chosen specialty at Easter Bush.", section: "Internships & Residencies", navPath: "/internships-residencies", tags: ["Edinburgh", "residency", "UK", "specialist", "doctorate"] },
  { title: "University of Glasgow Small Animal Internship Programme", subtitle: "University of Glasgow", description: "Structured postgraduate clinical internship at the Glasgow Small Animal Hospital.", section: "Internships & Residencies", navPath: "/internships-residencies", tags: ["Glasgow", "internship", "UK", "small animal"] },
  { title: "University of Glasgow Small Animal Residency Programme", subtitle: "University of Glasgow", description: "Specialist residency training at the Glasgow Small Animal Hospital.", section: "Internships & Residencies", navPath: "/internships-residencies", tags: ["Glasgow", "residency", "UK", "specialist"] },
  { title: "IVC Evidensia Rotating and Discipline-Specific Internships", subtitle: "IVC Evidensia", description: "Internship programmes across IVC Evidensia's network providing training across a range of small animal disciplines.", section: "Internships & Residencies", navPath: "/internships-residencies", tags: ["IVC", "IVC Evidensia", "Evidensia", "internship", "UK", "small animal", "rotating", "discipline specific"] },
  { title: "IVC Evidensia Small Animal Residency Programmes", subtitle: "IVC Evidensia", description: "Residency programmes across IVC Evidensia's network, training towards diploma specialist status.", section: "Internships & Residencies", navPath: "/internships-residencies", tags: ["IVC", "IVC Evidensia", "Evidensia", "residency", "UK", "specialist", "diploma"] },
  { title: "Linnaeus Small Animal Rotating and Discipline-Specific Internships", subtitle: "Linnaeus Group", description: "Rotating and discipline-specific internships across Linnaeus's UK hospital network.", section: "Internships & Residencies", navPath: "/internships-residencies", tags: ["Linnaeus", "internship", "UK", "small animal", "rotating"] },
  { title: "Linnaeus Small Animal Residency Programmes", subtitle: "Linnaeus Group", description: "Residency programmes across Linnaeus UK hospitals, training towards diplomatic specialist status.", section: "Internships & Residencies", navPath: "/internships-residencies", tags: ["Linnaeus", "residency", "UK", "specialist", "diplomat"] },
  { title: "CVS Small Animal Rotating and Discipline-Specific Internship Programmes", subtitle: "CVS Group", description: "Internships exposing vets to referral practice and specialist disciplines at CVS referral hospitals.", section: "Internships & Residencies", navPath: "/internships-residencies", tags: ["CVS", "internship", "UK", "small animal", "referral", "rotating"] },
  { title: "CVS Small Animal Residency Programmes", subtitle: "CVS Group", description: "Specialist residency programmes across CVS referral hospitals.", section: "Internships & Residencies", navPath: "/internships-residencies", tags: ["CVS", "residency", "UK", "specialist"] },
  { title: "The Ralph Veterinary Internship Programmes", subtitle: "The Ralph", description: "Rotating and discipline-specific internship programmes at The Ralph referral hospital.", section: "Internships & Residencies", navPath: "/internships-residencies", tags: ["Ralph", "The Ralph", "internship", "UK", "referral"] },
  { title: "The Ralph Veterinary Residency Programme", subtitle: "The Ralph", description: "Residency programmes in collaboration with European specialist colleges at The Ralph.", section: "Internships & Residencies", navPath: "/internships-residencies", tags: ["Ralph", "The Ralph", "residency", "UK", "specialist", "European college"] },
  { title: "BEVA Recognised Equine Internship", subtitle: "British Equine Veterinary Association", description: "BEVA-recognised equine internships with agreed core standards for training and fair treatment of interns.", section: "Internships & Residencies", navPath: "/internships-residencies", tags: ["BEVA", "equine", "internship", "horse", "UK", "worldwide"] },
  { title: "ECVS Residency Training", subtitle: "European College of Veterinary Surgeons", description: "Advanced surgical training programmes leading to board certification in veterinary surgery.", section: "Internships & Residencies", navPath: "/internships-residencies", tags: ["ECVS", "surgery", "residency", "Europe", "specialist", "board certified"] },
  { title: "ECVP Residency Programme", subtitle: "European College of Veterinary Pathologists", description: "Specialised training in veterinary pathology leading to board certification.", section: "Internships & Residencies", navPath: "/internships-residencies", tags: ["ECVP", "pathology", "residency", "Europe"] },
  { title: "ECVIM-CA Residency Programmes", subtitle: "European College of Veterinary Internal Medicine", description: "Residency training in internal medicine at institutes across Europe.", section: "Internships & Residencies", navPath: "/internships-residencies", tags: ["ECVIM", "internal medicine", "residency", "Europe", "cardiology", "oncology"] },
  { title: "ECVM Residency Programmes", subtitle: "European College of Veterinary Microbiology", description: "Residency training in microbiology at European veterinary institutes.", section: "Internships & Residencies", navPath: "/internships-residencies", tags: ["ECVM", "microbiology", "residency", "Europe"] },
  { title: "ECVAA Residency Programmes", subtitle: "European College of Veterinary Anaesthesia and Analgesia", description: "Residency training in anaesthesia and analgesia across Europe.", section: "Internships & Residencies", navPath: "/internships-residencies", tags: ["ECVAA", "anaesthesia", "analgesia", "residency", "Europe"] },
  { title: "ECVCN Residency Programmes", subtitle: "European College of Veterinary and Comparative Nutrition", description: "Residency training in veterinary nutrition across European institutes.", section: "Internships & Residencies", navPath: "/internships-residencies", tags: ["ECVCN", "nutrition", "residency", "Europe"] },
  { title: "ECVCP Residency Programmes", subtitle: "European College of Veterinary Clinical Pathology", description: "Residency training in clinical pathology at European veterinary institutes.", section: "Internships & Residencies", navPath: "/internships-residencies", tags: ["ECVCP", "clinical pathology", "residency", "Europe"] },
  { title: "ECVD Residency Programmes", subtitle: "European College of Veterinary Dermatology", description: "Residency training in veterinary dermatology across Europe.", section: "Internships & Residencies", navPath: "/internships-residencies", tags: ["ECVD", "dermatology", "residency", "Europe", "skin"] },
  { title: "ECVDI Residency Programmes", subtitle: "European College of Veterinary Diagnostic Imaging", description: "Residency training in veterinary diagnostic imaging across Europe.", section: "Internships & Residencies", navPath: "/internships-residencies", tags: ["ECVDI", "imaging", "radiology", "residency", "Europe"] },
  { title: "ECVECC Residency Programmes", subtitle: "European College of Veterinary Emergency and Critical Care", description: "Residency training in emergency and critical care at institutes across Europe and New Zealand.", section: "Internships & Residencies", navPath: "/internships-residencies", tags: ["ECVECC", "emergency", "critical care", "ECC", "residency", "Europe"] },
  { title: "ECVN Residency Programmes", subtitle: "European College of Veterinary Neurology", description: "Residency training in veterinary neurology at European institutes.", section: "Internships & Residencies", navPath: "/internships-residencies", tags: ["ECVN", "neurology", "residency", "Europe", "brain"] },
  { title: "ECVO Internship & Residency Programmes", subtitle: "European College of Veterinary Ophthalmologists", description: "Internship and residency training in veterinary ophthalmology at European institutes.", section: "Internships & Residencies", navPath: "/internships-residencies", tags: ["ECVO", "ophthalmology", "eyes", "internship", "residency", "Europe"] },
].map((i) => ({ ...i, navPath: i.navPath + "#" + slugify(i.title) }));

const certItems = [
  { title: "Improve International Postgraduate Programmes", subtitle: "Improve International", description: "Range of postgraduate veterinary courses and certificates including GPCert.", section: "Postgraduate Certificates", navPath: "/postgraduate-certificates", tags: ["Improve", "GPCert", "postgraduate", "certificate", "UK"] },
  { title: "BSAVA Postgraduate Certificates", subtitle: "British Small Animal Veterinary Association", description: "Professional certificates in small animal medicine and surgery.", section: "Postgraduate Certificates", navPath: "/postgraduate-certificates", tags: ["BSAVA", "certificate", "postgraduate", "small animal", "UK"] },
  { title: "Royal Veterinary College CertAVP", subtitle: "Royal Veterinary College", description: "RCVS-accredited Certificate in Advanced Veterinary Practice.", section: "Postgraduate Certificates", navPath: "/postgraduate-certificates", tags: ["RVC", "CertAVP", "RCVS", "certificate", "UK", "advanced"] },
  { title: "University of Edinburgh CertAVP", subtitle: "University of Edinburgh", description: "RCVS Certificate in Advanced Veterinary Practice with flexible self-study options.", section: "Postgraduate Certificates", navPath: "/postgraduate-certificates", tags: ["Edinburgh", "CertAVP", "RCVS", "certificate", "UK"] },
  { title: "University of Liverpool CertAVP", subtitle: "University of Liverpool", description: "Certificate in Advanced Veterinary Practice with online and face-to-face learning.", section: "Postgraduate Certificates", navPath: "/postgraduate-certificates", tags: ["Liverpool", "CertAVP", "RCVS", "certificate", "UK"] },
  { title: "University of Nottingham CertAVP", subtitle: "University of Nottingham", description: "RCVS Certificate in Advanced Veterinary Practice with modular structure.", section: "Postgraduate Certificates", navPath: "/postgraduate-certificates", tags: ["Nottingham", "CertAVP", "RCVS", "certificate", "UK"] },
  { title: "University of Surrey Veterinary General Practice PGCert", subtitle: "University of Surrey", description: "Modular PGCert delivered through online learning followed by a 2-week placement at the University.", section: "Postgraduate Certificates", navPath: "/postgraduate-certificates", tags: ["Surrey", "PGCert", "certificate", "UK", "general practice"] },
].map((i) => ({ ...i, navPath: i.navPath + "#" + slugify(i.title) }));

// Build search index at cold-start (cached across warm invocations)
const conferenceItems = conferences.map((c) => ({
  title: c.title,
  subtitle: c.organiser,
  description: `${c.dates} \u00b7 ${c.location}${c.notes ? " \u2014 " + c.notes : ""}`,
  section: "Conferences",
  navPath: "/?tab=cpd#" + slugify(c.title),
  tags: [...c.specialties, ...c.regions, c.category || ""],
}));

const cpdItems = cpdProviders.map((p) => ({
  title: p.provider,
  subtitle: p.programme,
  description: `${p.location}${p.notes ? " \u2014 " + p.notes : ""}`,
  section: "CPD Providers",
  navPath: "/?tab=cpd&section=providers#" + slugify(p.provider),
  tags: p.types,
}));

const searchIndex = [
  ...trainingItems,
  ...internshipItems,
  ...certItems,
  ...conferenceItems,
  ...cpdItems,
];

function searchItems(query) {
  if (!query || query.trim().length < 2) return [];
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);

  const matched = searchIndex.filter((item) => {
    const haystack = [item.title, item.subtitle, item.description, ...(item.tags || [])]
      .join(" ")
      .toLowerCase();
    return terms.every((t) => haystack.includes(t));
  });

  matched.sort((a, b) => {
    const q = query.toLowerCase();
    const aTop = a.title.toLowerCase().includes(q) || a.subtitle.toLowerCase().includes(q) ? 0 : 1;
    const bTop = b.title.toLowerCase().includes(q) || b.subtitle.toLowerCase().includes(q) ? 0 : 1;
    return aTop - bTop;
  });

  return matched.slice(0, 10);
}

exports.handler = async (event) => {
  const origin = event.headers.origin || event.headers.Origin || "";
  const headers = corsHeaders(origin);

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  if (event.httpMethod !== "GET") {
    return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  const q = (event.queryStringParameters && event.queryStringParameters.q) || "";

  if (!q || q.trim().length < 2) {
    return {
      statusCode: 200,
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify([]),
    };
  }

  try {
    const results = searchItems(q.trim());
    return {
      statusCode: 200,
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify(results),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};
