/**
 * Create React App dev-server proxy.
 * Intercepts /.netlify/functions/* requests so the app works with `npm start`
 * without needing the Netlify CLI. Uses the same CommonJS data modules that
 * the real Netlify Functions use — no data is duplicated.
 */

const { conferences } = require("../../functions/data/conferences");
const { cpdProviders } = require("../../functions/data/providers");

// ——— helpers (mirrors functions/conferences.js) ———

function expandMultiYearConferences(arr) {
  const expanded = [];
  for (const conf of arr) {
    const segments = conf.dates.split(";").map((s) => s.trim()).filter(Boolean);
    if (segments.length <= 1) { expanded.push(conf); continue; }
    const years = segments.map((s) => { const m = s.match(/\b(20\d{2})\b/); return m ? m[1] : null; });
    const uniqueYears = [...new Set(years.filter(Boolean))];
    if (uniqueYears.length <= 1) { expanded.push(conf); continue; }
    for (const segment of segments) {
      const locMatch = segment.match(/\(([^)]+)\)\s*$/);
      expanded.push({ ...conf, dates: segment, location: locMatch ? locMatch[1] : conf.location });
    }
  }
  return expanded;
}

const urlMap = {
  "CVS Veterinary Group Graduate Programme": "https://careers.cvsvets.com/Graduates",
  "IVC Evidensia Graduate Academy": "https://ivcevidensia.co.uk/graduate-academy",
  "Linnaeus Veterinary Graduate Development Programme": "https://www.linnaeusgroup.co.uk/careers/graduates-students-and-apprenticeships/veterinary-graduate-development-programme-at-linnaeus",
  "Medivet Early Careers Programme": "https://careers.medivet.co.uk/early-careers",
  "Vets4Pets Graduate Programme": "https://www.vets4petscareers.com/our-graduate-programme/",
  "VetPartners Graduate Programme": "https://www.vetpartners.co.uk/your-career/graduates/",
  "VIRMP Rotating Internship": "https://www.virmp.org/",
  "Banfield New Graduate Program": "https://www.banfield.com/en/careers/veterinarians",
  "VCA New Graduate Support": "https://vcacareers.com/veterinarians",
  "National Veterinary Associates New Graduate Programme": "https://www.nva.com/careers/",
  "VIRMP Rotating Internship (Canada)": "https://www.virmp.org/",
  "Banfield Canada New Graduate Program": "https://www.banfield.com/en/careers/veterinarians",
  "VCA Canada New Graduate Support": "https://vcacareers.com/veterinarians",
  "Greencross Vets Graduate Vet Program": "https://www.greencrossvets.com.au/careers/",
  "Apiam Animal Health Graduate Program": "https://www.apiam.com.au/careers/",
  "AVA Mentoring Program": "https://www.ava.com.au/membership/member-benefits/mentoring/",
  "VIRMP \u2014 Veterinary Internship and Residency Matching Program": "https://www.virmp.org/",
  "Royal Veterinary College Rotating Internship Programme": "https://www.rvc.ac.uk/study/postgraduate/internships/small-animal",
  "Royal Veterinary College Small Animal Residency Programmes": "https://www.rvc.ac.uk/study/postgraduate/residencies/small-animal",
  "University of Liverpool Rotating Internship Programme": "https://www.liverpool.ac.uk/sath/teaching/postgraduates/internships/",
  "University of Edinburgh Rotating Internship Programme": "https://vet.ed.ac.uk/clinical/vacancies/rotating-interns",
  "University of Glasgow Small Animal Internship Programme": "https://www.gla.ac.uk/explore/jobs/appointments/sahvacancies/",
  "IVC Evidensia Rotating and Discipline-Specific Internships": "https://ivcevidensia.co.uk/careers?roles=8",
  "Linnaeus Small Animal Rotating Internships": "https://www.linnaeusgroup.co.uk/careers/internships",
  "CVS Small Animal Internship Programmes": "https://cvs-referrals.com/careers/internship/",
  "ECVS Residency Training": "https://www.ecvs.org/ecvs-for/residents.php",
  "ECVIM-CA Residency Programmes": "https://ecvim-ca.college/residency-vacancies/",
  "ECVN Residency Programmes": "https://www.ecvn.org/general-information/open-residency-position",
  "ECVD Residency Programmes": "https://www.ecvd.org/programmes/start-your-residency/",
  "ECVECC Residency Programmes": "https://www.ecvecc.org/resident-training-facilities",
  "BEVA Recognised Equine Internship": "https://www.beva.org.uk/New-Vet-Grads/Recognised-Internships",
  "Improve International Postgraduate Programmes": "https://improveinternational.com/uk/postgraduate-programmes/",
  "BSAVA Postgraduate Certificates": "https://www.bsava.com/education/postgraduate-certificates/",
  "Royal Veterinary College CertAVP": "https://www.rvc.ac.uk/study/postgraduate/certavp",
  "University of Edinburgh CertAVP": "https://vet.ed.ac.uk/education/postgraduate/taught/rcvs-certavp",
  "University of Liverpool CertAVP": "https://www.liverpool.ac.uk/vets/cpd/certavp/",
  "University of Nottingham CertAVP": "https://www.nottingham.ac.uk/vet/study-with-us/cpd/rcvs-certificate-in-advanced-veterinary-practice-certavp.aspx",
  "University of Surrey Veterinary General Practice PGCert": "https://www.surrey.ac.uk/postgraduate/veterinary-general-practice-pgcert",
};

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

// ——— search index (mirrors functions/search.js) ———

const trainingItems = [
  { title: "CVS Veterinary Group Graduate Programme", subtitle: "CVS Group", section: "Training Programmes", navPath: "/training-programs", tags: ["CVS", "graduate", "UK"] },
  { title: "IVC Evidensia Graduate Academy", subtitle: "IVC Evidensia", section: "Training Programmes", navPath: "/training-programs", tags: ["IVC", "graduate", "UK", "Europe"] },
  { title: "Linnaeus Veterinary Graduate Development Programme", subtitle: "Linnaeus Group", section: "Training Programmes", navPath: "/training-programs", tags: ["Linnaeus", "graduate", "UK"] },
  { title: "Medivet Early Careers Programme", subtitle: "Medivet", section: "Training Programmes", navPath: "/training-programs", tags: ["Medivet", "graduate", "UK"] },
  { title: "Vets4Pets Graduate Programme", subtitle: "Vets4Pets", section: "Training Programmes", navPath: "/training-programs", tags: ["Vets4Pets", "graduate", "UK"] },
  { title: "VetPartners Graduate Programme", subtitle: "VetPartners", section: "Training Programmes", navPath: "/training-programs", tags: ["VetPartners", "graduate", "UK"] },
  { title: "VIRMP Rotating Internship", subtitle: "Veterinary Internship & Residency Matching Program", section: "Training Programmes", navPath: "/training-programs", tags: ["VIRMP", "internship", "USA"] },
  { title: "Banfield New Graduate Program", subtitle: "Banfield Pet Hospital", section: "Training Programmes", navPath: "/training-programs", tags: ["Banfield", "graduate", "USA"] },
  { title: "VCA New Graduate Support", subtitle: "VCA Animal Hospitals", section: "Training Programmes", navPath: "/training-programs", tags: ["VCA", "graduate", "USA"] },
  { title: "National Veterinary Associates New Graduate Programme", subtitle: "NVA", section: "Training Programmes", navPath: "/training-programs", tags: ["NVA", "graduate", "USA"] },
  { title: "VIRMP Rotating Internship (Canada)", subtitle: "Veterinary Internship & Residency Matching Program", section: "Training Programmes", navPath: "/training-programs", tags: ["VIRMP", "internship", "Canada"] },
  { title: "Banfield Canada New Graduate Program", subtitle: "Banfield Pet Hospital Canada", section: "Training Programmes", navPath: "/training-programs", tags: ["Banfield", "graduate", "Canada"] },
  { title: "VCA Canada New Graduate Support", subtitle: "VCA Canada", section: "Training Programmes", navPath: "/training-programs", tags: ["VCA", "graduate", "Canada"] },
  { title: "Greencross Vets Graduate Vet Program", subtitle: "Greencross Vets", section: "Training Programmes", navPath: "/training-programs", tags: ["Greencross", "graduate", "Australia"] },
  { title: "Apiam Animal Health Graduate Program", subtitle: "Apiam Animal Health", section: "Training Programmes", navPath: "/training-programs", tags: ["Apiam", "graduate", "Australia", "rural"] },
  { title: "AVA Mentoring Program", subtitle: "Australian Veterinary Association", section: "Training Programmes", navPath: "/training-programs", tags: ["AVA", "mentoring", "Australia"] },
].map((i) => ({ ...i, url: urlMap[i.title] || null, navPath: i.navPath + "#" + slugify(i.title) }));

const internshipItems = [
  { title: "VIRMP \u2014 Veterinary Internship and Residency Matching Program", subtitle: "VIRMP", section: "Internships & Residencies", navPath: "/internships-residencies", tags: ["VIRMP", "internship", "residency", "USA", "Canada"] },
  { title: "Royal Veterinary College Rotating Internship Programme", subtitle: "Royal Veterinary College", section: "Internships & Residencies", navPath: "/internships-residencies", tags: ["RVC", "internship", "UK"] },
  { title: "Royal Veterinary College Small Animal Residency Programmes", subtitle: "Royal Veterinary College", section: "Internships & Residencies", navPath: "/internships-residencies", tags: ["RVC", "residency", "UK"] },
  { title: "University of Liverpool Rotating Internship Programme", subtitle: "University of Liverpool", section: "Internships & Residencies", navPath: "/internships-residencies", tags: ["Liverpool", "internship", "UK"] },
  { title: "University of Edinburgh Rotating Internship Programme", subtitle: "University of Edinburgh", section: "Internships & Residencies", navPath: "/internships-residencies", tags: ["Edinburgh", "internship", "UK"] },
  { title: "University of Glasgow Small Animal Internship Programme", subtitle: "University of Glasgow", section: "Internships & Residencies", navPath: "/internships-residencies", tags: ["Glasgow", "internship", "UK"] },
  { title: "IVC Evidensia Rotating and Discipline-Specific Internships", subtitle: "IVC Evidensia", section: "Internships & Residencies", navPath: "/internships-residencies", tags: ["IVC", "internship", "UK"] },
  { title: "Linnaeus Small Animal Rotating Internships", subtitle: "Linnaeus Group", section: "Internships & Residencies", navPath: "/internships-residencies", tags: ["Linnaeus", "internship", "UK"] },
  { title: "CVS Small Animal Internship Programmes", subtitle: "CVS Group", section: "Internships & Residencies", navPath: "/internships-residencies", tags: ["CVS", "internship", "UK"] },
  { title: "ECVS Residency Training", subtitle: "European College of Veterinary Surgeons", section: "Internships & Residencies", navPath: "/internships-residencies", tags: ["ECVS", "surgery", "residency", "Europe"] },
  { title: "ECVIM-CA Residency Programmes", subtitle: "European College of Veterinary Internal Medicine", section: "Internships & Residencies", navPath: "/internships-residencies", tags: ["ECVIM", "internal medicine", "residency", "Europe"] },
  { title: "ECVN Residency Programmes", subtitle: "European College of Veterinary Neurology", section: "Internships & Residencies", navPath: "/internships-residencies", tags: ["ECVN", "neurology", "residency", "Europe"] },
  { title: "ECVD Residency Programmes", subtitle: "European College of Veterinary Dermatology", section: "Internships & Residencies", navPath: "/internships-residencies", tags: ["ECVD", "dermatology", "residency", "Europe"] },
  { title: "ECVECC Residency Programmes", subtitle: "European College of Veterinary Emergency and Critical Care", section: "Internships & Residencies", navPath: "/internships-residencies", tags: ["ECVECC", "emergency", "residency", "Europe"] },
  { title: "BEVA Recognised Equine Internship", subtitle: "British Equine Veterinary Association", section: "Internships & Residencies", navPath: "/internships-residencies", tags: ["BEVA", "equine", "internship", "UK"] },
].map((i) => ({ ...i, url: urlMap[i.title] || null, navPath: i.navPath + "#" + slugify(i.title) }));

const certItems = [
  { title: "Improve International Postgraduate Programmes", subtitle: "Improve International", section: "Postgraduate Certificates", navPath: "/postgraduate-certificates", tags: ["Improve", "GPCert", "UK"] },
  { title: "BSAVA Postgraduate Certificates", subtitle: "BSAVA", section: "Postgraduate Certificates", navPath: "/postgraduate-certificates", tags: ["BSAVA", "certificate", "UK"] },
  { title: "Royal Veterinary College CertAVP", subtitle: "Royal Veterinary College", section: "Postgraduate Certificates", navPath: "/postgraduate-certificates", tags: ["RVC", "CertAVP", "RCVS", "UK"] },
  { title: "University of Edinburgh CertAVP", subtitle: "University of Edinburgh", section: "Postgraduate Certificates", navPath: "/postgraduate-certificates", tags: ["Edinburgh", "CertAVP", "RCVS", "UK"] },
  { title: "University of Liverpool CertAVP", subtitle: "University of Liverpool", section: "Postgraduate Certificates", navPath: "/postgraduate-certificates", tags: ["Liverpool", "CertAVP", "RCVS", "UK"] },
  { title: "University of Nottingham CertAVP", subtitle: "University of Nottingham", section: "Postgraduate Certificates", navPath: "/postgraduate-certificates", tags: ["Nottingham", "CertAVP", "RCVS", "UK"] },
  { title: "University of Surrey Veterinary General Practice PGCert", subtitle: "University of Surrey", section: "Postgraduate Certificates", navPath: "/postgraduate-certificates", tags: ["Surrey", "PGCert", "UK"] },
].map((i) => ({ ...i, url: urlMap[i.title] || null, navPath: i.navPath + "#" + slugify(i.title) }));

function buildIndex() {
  const confItems = conferences.map((c) => ({
    title: c.title, subtitle: c.organiser,
    description: `${c.dates} \u00b7 ${c.location}${c.notes ? " \u2014 " + c.notes : ""}`,
    section: "Conferences", url: c.website || null, navPath: "/?tab=cpd#" + slugify(c.title),
    tags: [...c.specialties, ...c.regions, c.category || ""],
  }));
  const cpdItems = cpdProviders.map((p) => ({
    title: p.provider, subtitle: p.programme,
    description: `${p.location}${p.notes ? " \u2014 " + p.notes : ""}`,
    section: "CPD Providers", url: p.website || null, navPath: "/?tab=cpd&section=providers#" + slugify(p.provider),
    tags: p.types,
  }));
  return [...trainingItems, ...internshipItems, ...certItems, ...confItems, ...cpdItems];
}

const searchIndex = buildIndex();

function searchItems(query) {
  if (!query || query.trim().length < 2) return [];
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  const matched = searchIndex.filter((item) => {
    const haystack = [item.title, item.subtitle, item.description || "", ...(item.tags || [])].join(" ").toLowerCase();
    return terms.every((t) => haystack.includes(t));
  });
  matched.sort((a, b) => {
    const q = query.toLowerCase();
    const aTop = a.title.toLowerCase().includes(q) || (a.subtitle || "").toLowerCase().includes(q) ? 0 : 1;
    const bTop = b.title.toLowerCase().includes(q) || (b.subtitle || "").toLowerCase().includes(q) ? 0 : 1;
    return aTop - bTop;
  });
  return matched.slice(0, 10);
}

// ——— proxy middleware ———

module.exports = function (app) {
  app.get("/.netlify/functions/conferences", (_req, res) => {
    res.json(expandMultiYearConferences(conferences));
  });

  app.get("/.netlify/functions/providers", (_req, res) => {
    res.json(cpdProviders);
  });

  app.get("/.netlify/functions/search", (req, res) => {
    res.json(searchItems(req.query.q || ""));
  });
};
