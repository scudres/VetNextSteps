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
  // USA
  "VCA Academy Mentorship Program": "https://www.vcacareers.com/global/en/new-grads",
  "Banfield Veterinary Emerging Leader Program": "https://www.banfield.com/careers",
  "BluePearl EmERge Training Program": "https://careers.bluepearlvet.com/us/en/emerge-program",
  "VEG NERD Program (New ER Doctor)": "https://www.veterinaryemergencygroup.com/meet-our-teams/early-career",
  "ER Immerse Program": "https://www.ethosvet.com/er-immerse/",
  "NVA General Practice Mentorship Program": "https://gp.nva.com/why-join-nva/growth/mentorship",
  "Vetcor New Graduate Support Program": "https://www.vetcor.com/careers/mentorship",
  "Harbor GO Career Journey": "https://harbor.vet/",
  "MVP MBark Graduate Mentorship Program": "https://missionvetpartners.com/",
  "SVP Doctor Mentorship Program": "https://amazingtogether.svp.vet/dvm-benefits-and-programs/",
  "RISE DVM / VMD Mentorship Program": "https://www.petvetcarecenters.com/site/new-dvm-graduate-veterinary-careers",
  "Thrive Doctor Mentorship Program": "https://careers.thrivepetcare.com/pages/doctor-mentorship-program",
  "Emergency Clinician Mentorship Program (ECMP)": "https://www.medvet.com/careers/",
  "ACCESS Accelerated Training (AAT)": "https://accessanimalhospital.com/",
  "AmeriVet Doctor Mentorship Program": "https://www.amerivet.com/",
  "Heartland New Graduate Onboarding & Mentorship": "https://www.heartlandvetpartners.com/",
  "Rarebreed Early Career Mentorship": "https://www.rarebreedvet.com/",
  "Alliance Academy Mentors Program": "https://www.allianceanimal.com/",
  "Affinity Veterinary Academy Graduate Transition Program": "https://www.cityvet.com/",
  "CVP Doctor Mentorship Framework": "https://www.communityvetpartners.com/",
  "Innovetive University One-Year Mentor Program": "https://www.innovetivepetcare.com/",
  "Destination Pet New Graduate Mentorship Framework": "https://destinationpet.com/",
  "VPP New Graduate Mentorship Framework": "https://www.vetpartners.com/",
  "Ready, Vet, Go Mentorship Integration Program": "https://readyvetgo.co/",
  "United Veterinary Care New Graduate Mentorship": "https://unitedveterinarycare.com/new-graduate-veterinarian-mentorship/",
  "Vetco Total Care PACKS Early Career Mentorship": "https://careers.petco.com/vtc-packs-early-career",
  "Mentoring@AVMA": "https://www.avma.org/education/veterinary-careers/mentoring-early-career-veterinarians",
  "MentorVet Leap": "https://www.mentorvet.net/",
  // Canada
  "VetStrategy New Grad Mentorship Program": "https://www.vetstrategy.com/careers/dvm-mentorship-program/",
  "P3 Veterinary Partners Mentorship Program": "https://www.p3vetpartners.ca/the-p3-connection/mentorship-program",
  "VIRMP Rotating Internship (Canada)": "https://www.virmp.org/",
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
  { title: "CVS Veterinary Group Graduate Programme", subtitle: "CVS Group", section: "Graduate Development Programmes", navPath: "/training-programs", tags: ["CVS", "graduate", "UK"] },
  { title: "IVC Evidensia Graduate Academy", subtitle: "IVC Evidensia", section: "Graduate Development Programmes", navPath: "/training-programs", tags: ["IVC", "graduate", "UK", "Europe"] },
  { title: "Linnaeus Veterinary Graduate Development Programme", subtitle: "Linnaeus Group", section: "Graduate Development Programmes", navPath: "/training-programs", tags: ["Linnaeus", "graduate", "UK"] },
  { title: "Medivet Early Careers Programme", subtitle: "Medivet", section: "Graduate Development Programmes", navPath: "/training-programs", tags: ["Medivet", "graduate", "UK"] },
  { title: "Vets4Pets Graduate Programme", subtitle: "Vets4Pets", section: "Graduate Development Programmes", navPath: "/training-programs", tags: ["Vets4Pets", "graduate", "UK"] },
  { title: "VetPartners Graduate Programme", subtitle: "VetPartners", section: "Graduate Development Programmes", navPath: "/training-programs", tags: ["VetPartners", "graduate", "UK"] },
  // USA
  { title: "VCA Academy Mentorship Program", subtitle: "VCA Animal Hospitals (Mars Veterinary Health)", section: "Graduate Development Programmes", navPath: "/training-programs", tags: ["VCA", "Mars", "graduate", "USA", "Canada", "mentorship", "GP", "surgery", "dentistry", "ECC"] },
  { title: "Banfield Veterinary Emerging Leader Program", subtitle: "Banfield Pet Hospital (Mars Veterinary Health)", section: "Graduate Development Programmes", navPath: "/training-programs", tags: ["Banfield", "Mars", "graduate", "USA", "mentorship", "GP", "leadership"] },
  { title: "BluePearl EmERge Training Program", subtitle: "BluePearl Specialty + Emergency (Mars Veterinary Health)", section: "Graduate Development Programmes", navPath: "/training-programs", tags: ["BluePearl", "Mars", "ECC", "emergency", "USA", "graduate", "bootcamp", "critical care"] },
  { title: "VEG NERD Program (New ER Doctor)", subtitle: "Veterinary Emergency Group (VEG)", section: "Graduate Development Programmes", navPath: "/training-programs", tags: ["VEG", "NERD", "emergency", "ECC", "USA", "graduate", "wet lab"] },
  { title: "ER Immerse Program", subtitle: "Ethos Veterinary Health", section: "Graduate Development Programmes", navPath: "/training-programs", tags: ["Ethos", "emergency", "ECC", "USA", "graduate", "VetBloom"] },
  { title: "NVA General Practice Mentorship Program", subtitle: "National Veterinary Associates (NVA)", section: "Graduate Development Programmes", navPath: "/training-programs", tags: ["NVA", "National Veterinary Associates", "graduate", "USA", "Canada", "GP", "mentorship"] },
  { title: "Vetcor New Graduate Support Program", subtitle: "Vetcor", section: "Graduate Development Programmes", navPath: "/training-programs", tags: ["Vetcor", "graduate", "USA", "Canada", "mentorship", "GP"] },
  { title: "Harbor GO Career Journey", subtitle: "Suveto / Harbor.vet Network", section: "Graduate Development Programmes", navPath: "/training-programs", tags: ["Suveto", "Harbor", "graduate", "USA", "mentorship"] },
  { title: "MVP MBark Graduate Mentorship Program", subtitle: "Mission Pet Health (formerly Mission Veterinary Partners)", section: "Graduate Development Programmes", navPath: "/training-programs", tags: ["MVP", "Mission", "MBark", "graduate", "USA", "mentorship", "GP", "dentistry"] },
  { title: "SVP Doctor Mentorship Program", subtitle: "Mission Pet Health (formerly Southern Veterinary Partners)", section: "Graduate Development Programmes", navPath: "/training-programs", tags: ["SVP", "Mission", "graduate", "USA", "mentorship", "GP"] },
  { title: "RISE DVM / VMD Mentorship Program", subtitle: "PetVet Care Centers", section: "Graduate Development Programmes", navPath: "/training-programs", tags: ["PetVet", "RISE", "graduate", "USA", "mentorship", "ECC"] },
  { title: "Thrive Doctor Mentorship Program", subtitle: "Thrive Pet Healthcare", section: "Graduate Development Programmes", navPath: "/training-programs", tags: ["Thrive", "graduate", "USA", "mentorship", "GP", "urgent care", "specialty"] },
  { title: "Emergency Clinician Mentorship Program (ECMP)", subtitle: "MedVet", section: "Graduate Development Programmes", navPath: "/training-programs", tags: ["MedVet", "ECMP", "emergency", "ECC", "USA", "graduate"] },
  { title: "ACCESS Accelerated Training (AAT)", subtitle: "ACCESS Specialty Animal Hospitals (Thrive Network)", section: "Graduate Development Programmes", navPath: "/training-programs", tags: ["ACCESS", "AAT", "emergency", "ECC", "USA", "graduate", "Thrive"] },
  { title: "AmeriVet Doctor Mentorship Program", subtitle: "AmeriVet Veterinary Partners", section: "Graduate Development Programmes", navPath: "/training-programs", tags: ["AmeriVet", "graduate", "USA", "mentorship", "GP"] },
  { title: "Heartland New Graduate Onboarding & Mentorship", subtitle: "Heartland Veterinary Partners", section: "Graduate Development Programmes", navPath: "/training-programs", tags: ["Heartland", "graduate", "USA", "mentorship", "GP"] },
  { title: "Rarebreed Early Career Mentorship", subtitle: "Rarebreed Veterinary Partners", section: "Graduate Development Programmes", navPath: "/training-programs", tags: ["Rarebreed", "graduate", "USA", "mentorship", "GP", "urgent care"] },
  { title: "Alliance Academy Mentors Program", subtitle: "Alliance Animal Health", section: "Graduate Development Programmes", navPath: "/training-programs", tags: ["Alliance", "graduate", "USA", "mentorship", "GP", "dentistry", "surgery"] },
  { title: "Affinity Veterinary Academy Graduate Transition Program", subtitle: "CityVet", section: "Graduate Development Programmes", navPath: "/training-programs", tags: ["Affinity", "CityVet", "graduate", "USA", "mentorship", "GP"] },
  { title: "CVP Doctor Mentorship Framework", subtitle: "Community Veterinary Partners (CVP)", section: "Graduate Development Programmes", navPath: "/training-programs", tags: ["CVP", "Community Veterinary Partners", "graduate", "USA", "mentorship", "exotics", "equine"] },
  { title: "Innovetive University One-Year Mentor Program", subtitle: "Innovetive Petcare", section: "Graduate Development Programmes", navPath: "/training-programs", tags: ["Innovetive", "graduate", "USA", "mentorship", "ultrasound", "FAST", "dentistry"] },
  { title: "Destination Pet New Graduate Mentorship Framework", subtitle: "Destination Pet", section: "Graduate Development Programmes", navPath: "/training-programs", tags: ["Destination Pet", "graduate", "USA", "mentorship", "GP"] },
  { title: "VPP New Graduate Mentorship Framework", subtitle: "Veterinary Practice Partners (VPP)", section: "Graduate Development Programmes", navPath: "/training-programs", tags: ["VPP", "Veterinary Practice Partners", "graduate", "USA", "mentorship", "GP"] },
  { title: "Ready, Vet, Go Mentorship Integration Program", subtitle: "Ready, Vet, Go", section: "Graduate Development Programmes", navPath: "/training-programs", tags: ["Ready Vet Go", "graduate", "USA", "Canada", "mentorship", "independent"] },
  { title: "United Veterinary Care New Graduate Mentorship", subtitle: "United Veterinary Care (UVC)", section: "Graduate Development Programmes", navPath: "/training-programs", tags: ["UVC", "United Veterinary Care", "graduate", "USA", "mentorship", "GP"] },
  { title: "Vetco Total Care PACKS Early Career Mentorship", subtitle: "Petco / Vetco Total Care", section: "Graduate Development Programmes", navPath: "/training-programs", tags: ["Vetco", "Petco", "PACKS", "graduate", "USA", "mentorship", "MentorVet"] },
  { title: "Mentoring@AVMA", subtitle: "American Veterinary Medical Association", section: "Graduate Development Programmes", navPath: "/training-programs", tags: ["AVMA", "mentoring", "USA", "graduate", "virtual"] },
  { title: "MentorVet Leap", subtitle: "MentorVet", section: "Graduate Development Programmes", navPath: "/training-programs", tags: ["MentorVet", "Leap", "graduate", "USA", "mentorship", "wellbeing"] },
  // Canada
  { title: "VetStrategy New Grad Mentorship Program", subtitle: "VetStrategy (IVC Evidensia family)", section: "Graduate Development Programmes", navPath: "/training-programs", tags: ["VetStrategy", "IVC", "graduate", "Canada", "mentorship", "GP"] },
  { title: "P3 Veterinary Partners Mentorship Program", subtitle: "P3 Veterinary Partners", section: "Graduate Development Programmes", navPath: "/training-programs", tags: ["P3", "graduate", "Canada", "mentorship", "GP"] },
  { title: "VIRMP Rotating Internship (Canada)", subtitle: "Veterinary Internship & Residency Matching Program", section: "Graduate Development Programmes", navPath: "/training-programs", tags: ["VIRMP", "internship", "Canada", "OVC", "WCVM", "rotating"] },
  { title: "Greencross Vets Graduate Vet Program", subtitle: "Greencross Vets", section: "Graduate Development Programmes", navPath: "/training-programs", tags: ["Greencross", "graduate", "Australia"] },
  { title: "Apiam Animal Health Graduate Program", subtitle: "Apiam Animal Health", section: "Graduate Development Programmes", navPath: "/training-programs", tags: ["Apiam", "graduate", "Australia", "rural"] },
  { title: "AVA Mentoring Program", subtitle: "Australian Veterinary Association", section: "Graduate Development Programmes", navPath: "/training-programs", tags: ["AVA", "mentoring", "Australia"] },
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
