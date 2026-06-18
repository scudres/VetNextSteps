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

// ——— External URL lookup for static items ———
const urlMap = {
  // Training
  "CVS Veterinary Group Graduate Programme":                      "https://careers.cvsvets.com/Graduates",
  "IVC Evidensia Graduate Academy":                               "https://ivcevidensia.co.uk/graduate-academy",
  "Linnaeus Veterinary Graduate Development Programme":            "https://www.linnaeusgroup.co.uk/careers/graduates-students-and-apprenticeships/veterinary-graduate-development-programme-at-linnaeus",
  "Medivet Early Careers Programme":                              "https://careers.medivet.co.uk/early-careers",
  "Vets4Pets Graduate Programme":                                 "https://www.vets4petscareers.com/our-graduate-programme/",
  "VetPartners Graduate Programme":                               "https://www.vetpartners.co.uk/your-career/graduates/",
  // USA
  "VCA Academy Mentorship Program":                               "https://www.vcacareers.com/global/en/new-grads",
  "Banfield Veterinary Emerging Leader Program":                  "https://www.banfield.com/careers",
  "BluePearl EmERge Training Program":                            "https://careers.bluepearlvet.com/us/en/emerge-program",
  "VEG NERD Program (New ER Doctor)":                             "https://www.veterinaryemergencygroup.com/meet-our-teams/early-career",
  "ER Immerse Program":                                           "https://www.ethosvet.com/er-immerse/",
  "NVA General Practice Mentorship Program":                      "https://gp.nva.com/why-join-nva/growth/mentorship",
  "Vetcor New Graduate Support Program":                          "https://www.vetcor.com/careers/mentorship",
  "Harbor GO Career Journey":                                     "https://harbor.vet/",
  "MVP MBark Graduate Mentorship Program":                        "https://missionvetpartners.com/",
  "SVP Doctor Mentorship Program":                                "https://amazingtogether.svp.vet/dvm-benefits-and-programs/",
  "RISE DVM / VMD Mentorship Program":                            "https://www.petvetcarecenters.com/site/new-dvm-graduate-veterinary-careers",
  "Thrive Doctor Mentorship Program":                             "https://careers.thrivepetcare.com/pages/doctor-mentorship-program",
  "Emergency Clinician Mentorship Program (ECMP)":                "https://www.medvet.com/careers/",
  "ACCESS Accelerated Training (AAT)":                            "https://accessanimalhospital.com/",
  "AmeriVet Doctor Mentorship Program":                           "https://www.amerivet.com/",
  "Heartland New Graduate Onboarding & Mentorship":               "https://www.heartlandvetpartners.com/",
  "Rarebreed Early Career Mentorship":                            "https://www.rarebreedvet.com/",
  "Alliance Academy Mentors Program":                             "https://www.allianceanimal.com/",
  "Affinity Veterinary Academy Graduate Transition Program":      "https://www.cityvet.com/",
  "CVP Doctor Mentorship Framework":                              "https://www.communityvetpartners.com/",
  "Innovetive University One-Year Mentor Program":                "https://www.innovetivepetcare.com/",
  "Destination Pet New Graduate Mentorship Framework":            "https://destinationpet.com/",
  "VPP New Graduate Mentorship Framework":                        "https://www.vetpartners.com/",
  "Ready, Vet, Go Mentorship Integration Program":                "https://readyvetgo.co/",
  "United Veterinary Care New Graduate Mentorship":               "https://unitedveterinarycare.com/new-graduate-veterinarian-mentorship/",
  "Vetco Total Care PACKS Early Career Mentorship":               "https://careers.petco.com/vtc-packs-early-career",
  "Mentoring@AVMA":                                               "https://www.avma.org/education/veterinary-careers/mentoring-early-career-veterinarians",
  "MentorVet Leap":                                               "https://www.mentorvet.net/",
  // Canada
  "VetStrategy New Grad Mentorship Program":                      "https://www.vetstrategy.com/careers/dvm-mentorship-program/",
  "P3 Veterinary Partners Mentorship Program":                    "https://www.p3vetpartners.ca/the-p3-connection/mentorship-program",
  "VIRMP Rotating Internship (Canada)":                          "https://www.virmp.org/",
  "Greencross Vets Graduate Vet Program":                         "https://www.greencrossvets.com.au/careers/",
  "Apiam Animal Health Graduate Program":                         "https://www.apiam.com.au/careers/",
  "AVA Mentoring Program":                                        "https://www.ava.com.au/membership/member-benefits/mentoring/",
  // Internships & Residencies
  "VIRMP \u2014 Veterinary Internship and Residency Matching Program": "https://www.virmp.org/",
  "Royal Veterinary College Rotating Internship Programme":       "https://www.rvc.ac.uk/study/postgraduate/internships/small-animal",
  "Royal Veterinary College Small Animal Residency Programmes":   "https://www.rvc.ac.uk/study/postgraduate/residencies/small-animal",
  "University of Liverpool Rotating Internship Programme":        "https://www.liverpool.ac.uk/sath/teaching/postgraduates/internships/",
  "University of Liverpool Anaesthesia Internship Programme":     "https://www.liverpool.ac.uk/sath/teaching/postgraduates/internships/",
  "University of Liverpool Small Animal Residency Programme":     "https://www.liverpool.ac.uk/sath/teaching/postgraduates/residencies/",
  "University of Cambridge Rotating Internship Programme":        "https://www.vet.cam.ac.uk/study/cts/jcts1/smallanimal",
  "University of Cambridge Senior Clinical Training Scholarship / Residency Programme": "https://www.vet.cam.ac.uk/study/cts/jcts1/smallanimal",
  "University of Edinburgh Rotating Internship Programme":        "https://vet.ed.ac.uk/clinical/vacancies/rotating-interns",
  "University of Edinburgh Residency / Clinical Scholarship Programme": "https://vet.ed.ac.uk/clinical/vacancies/clinicalscholarships",
  "University of Glasgow Small Animal Internship Programme":      "https://www.gla.ac.uk/explore/jobs/appointments/sahvacancies/",
  "University of Glasgow Small Animal Residency Programme":       "https://www.gla.ac.uk/explore/jobs/appointments/sahvacancies/",
  "IVC Evidensia Rotating and Discipline-Specific Internships":   "https://ivcevidensia.co.uk/careers?roles=8",
  "IVC Evidensia Small Animal Residency Programmes":              "https://ivcevidensia.co.uk/careers?roles=9",
  "Linnaeus Small Animal Rotating and Discipline-Specific Internships": "https://www.linnaeusgroup.co.uk/careers/internships",
  "Linnaeus Small Animal Residency Programmes":                   "https://www.linnaeusgroup.co.uk/careers/vacancies?role=6",
  "CVS Small Animal Rotating and Discipline-Specific Internship Programmes": "https://cvs-referrals.com/careers/internship/",
  "CVS Small Animal Residency Programmes":                        "https://cvs-referrals.com/careers/residencies/",
  "The Ralph Veterinary Internship Programmes":                   "https://theralph.vet/join-team-ralph/",
  "The Ralph Veterinary Residency Programme":                     "https://theralph.vet/join-team-ralph/",
  "BEVA Recognised Equine Internship":                            "https://www.beva.org.uk/New-Vet-Grads/Recognised-Internships",
  "ECVS Residency Training":                                      "https://www.ecvs.org/ecvs-for/residents.php",
  "ECVP Residency Programme":                                     "https://www.ecvpath.org/resident-registration",
  "ECVIM-CA Residency Programmes":                                "https://ecvim-ca.college/residency-vacancies/",
  "ECVM Residency Programmes":                                    "https://ecvmicro.org/training-centers/",
  "ECVAA Residency Programmes":                                   "https://www.ecvaa.org/ecvaa/training-centers-list",
  "ECVCN Residency Programmes":                                   "https://www.ecvcn.org/why-become-resident-why-become-supervisor",
  "ECVCP Residency Programmes":                                   "https://www.esvcp.org/open-positions.html",
  "ECVD Residency Programmes":                                    "https://www.ecvd.org/programmes/start-your-residency/",
  "ECVDI Residency Programmes":                                   "https://www.ecvdi.org/training-centers-list",
  "ECVECC Residency Programmes":                                  "https://www.ecvecc.org/resident-training-facilities",
  "ECVN Residency Programmes":                                    "https://www.ecvn.org/general-information/open-residency-position",
  "ECVO Internship & Residency Programmes":                       "https://www.ecvo.eu/residents/training-job-opportunities-for-interns-residents.html",
  // Postgraduate Certificates
  "Improve International Postgraduate Programmes":                "https://improveinternational.com/uk/postgraduate-programmes/",
  "BSAVA Postgraduate Certificates":                              "https://www.bsava.com/education/postgraduate-certificates/",
  "Royal Veterinary College CertAVP":                             "https://www.rvc.ac.uk/study/postgraduate/certavp",
  "University of Edinburgh CertAVP":                              "https://vet.ed.ac.uk/education/postgraduate/taught/rcvs-certavp",
  "University of Liverpool CertAVP":                              "https://www.liverpool.ac.uk/vets/cpd/certavp/",
  "University of Nottingham CertAVP":                             "https://www.nottingham.ac.uk/vet/study-with-us/cpd/rcvs-certificate-in-advanced-veterinary-practice-certavp.aspx",
  "University of Surrey Veterinary General Practice PGCert":      "https://www.surrey.ac.uk/postgraduate/veterinary-general-practice-pgcert",
};

// ——— Static index items ———

const trainingItems = [
  { title: "CVS Veterinary Group Graduate Programme", subtitle: "CVS Group", description: "Graduate development programme with mentorship and structured learning across CVS's nationwide network of practices.", section: "Graduate Development Programmes", navPath: "/training-programs/uk", tags: ["CVS", "graduate", "UK", "mentorship", "primary care"] },
  { title: "IVC Evidensia Graduate Academy", subtitle: "IVC Evidensia", description: "Graduate academy offering structured learning, mentoring, and career development opportunities across IVC Evidensia's European and UK practices.", section: "Graduate Development Programmes", navPath: "/training-programs/uk", tags: ["IVC", "IVC Evidensia", "Evidensia", "graduate", "UK", "Europe", "academy", "mentoring"] },
  { title: "Linnaeus Veterinary Graduate Development Programme", subtitle: "Linnaeus Group", description: "18-month structured programme with clinical rotations, mentoring, and professional development across Linnaeus's specialist and primary care hospitals.", section: "Graduate Development Programmes", navPath: "/training-programs/uk", tags: ["Linnaeus", "graduate", "UK", "rotations", "mentoring", "18 month"] },
  { title: "Medivet Early Careers Programme", subtitle: "Medivet", description: "Early career development with mentoring and structured learning pathways, supporting new graduates through their first years in practice.", section: "Graduate Development Programmes", navPath: "/training-programs/uk", tags: ["Medivet", "graduate", "UK", "early career", "mentoring"] },
  { title: "Vets4Pets Graduate Programme", subtitle: "Vets4Pets", description: "Graduate programme focusing on primary care development with ongoing clinical support, mentoring, and structured learning opportunities.", section: "Graduate Development Programmes", navPath: "/training-programs/uk", tags: ["Vets4Pets", "graduate", "UK", "primary care", "Companion Care"] },
  { title: "VetPartners Graduate Programme", subtitle: "VetPartners", description: "Structured graduate programme with dedicated clinical mentoring and professional development opportunities across VetPartners's diverse practice network.", section: "Graduate Development Programmes", navPath: "/training-programs/uk", tags: ["VetPartners", "graduate", "UK", "mentoring"] },
  // USA
  { title: "VCA Academy Mentorship Program", subtitle: "VCA Animal Hospitals (Mars Veterinary Health)", description: "6-month structured GP mentorship with tailored tracks for surgery, dentistry, and medical appointments. CE stipend and no negative accrual ProSal. Available USA & Canada.", section: "Graduate Development Programmes", navPath: "/training-programs/usa", tags: ["VCA", "Mars", "graduate", "USA", "Canada", "mentorship", "GP", "surgery", "dentistry", "ECC"] },
  { title: "Banfield Veterinary Emerging Leader Program", subtitle: "Banfield Pet Hospital (Mars Veterinary Health)", description: "12-month GP programme with a dedicated in-hospital coach, multi-phase onboarding, no-negative-accrual ProSal, and leadership development pathways.", section: "Graduate Development Programmes", navPath: "/training-programs/usa", tags: ["Banfield", "Mars", "graduate", "USA", "mentorship", "GP", "leadership", "ProSal"] },
  { title: "BluePearl EmERge Training Program", subtitle: "BluePearl Specialty + Emergency (Mars Veterinary Health)", description: "One-year ECC training programme comprising bootcamp, mentored immersion, and experiential phases. Followed by a two-year work commitment.", section: "Graduate Development Programmes", navPath: "/training-programs/usa", tags: ["BluePearl", "Mars", "ECC", "emergency", "USA", "graduate", "bootcamp", "critical care"] },
  { title: "VEG NERD Program (New ER Doctor)", subtitle: "Veterinary Emergency Group (VEG)", description: "Immersive 6-month ECC programme with travel-based surgical wet labs, full-time shifts with senior mentors, and approximately 160 RACE CE hours.", section: "Graduate Development Programmes", navPath: "/training-programs/usa", tags: ["VEG", "NERD", "emergency", "ECC", "USA", "graduate", "wet lab", "critical care"] },
  { title: "ER Immerse Program", subtitle: "Ethos Veterinary Health", description: "6-month ECC mentorship programme with in-hospital support from ER clinicians and ECC specialists and competency-based curriculum via VetBloom.", section: "Graduate Development Programmes", navPath: "/training-programs/usa", tags: ["Ethos", "emergency", "ECC", "USA", "graduate", "VetBloom", "critical care"] },
  { title: "NVA General Practice Mentorship Program", subtitle: "National Veterinary Associates (NVA)", description: "Up to 12-month GP programme with a designated in-clinic mentor, quarterly check-ins, peer case reviews, and $5,000 CE budget. Available USA & Canada.", section: "Graduate Development Programmes", navPath: "/training-programs/usa", tags: ["NVA", "National Veterinary Associates", "graduate", "USA", "Canada", "GP", "mentorship"] },
  { title: "Vetcor New Graduate Support Program", subtitle: "Vetcor", description: "12-month GP and mixed programme with one-on-one in-hospital mentorship, virtual roundtables, and skill-building days. Available USA & Canada.", section: "Graduate Development Programmes", navPath: "/training-programs/usa", tags: ["Vetcor", "graduate", "USA", "Canada", "mentorship", "GP", "mixed practice"] },
  { title: "Harbor GO Career Journey", subtitle: "Suveto / Harbor.vet Network", description: "Self-guided 12–24 month non-contract framework covering clinical excellence, business fluency, financial literacy, and co-ownership pathways.", section: "Graduate Development Programmes", navPath: "/training-programs/usa", tags: ["Suveto", "Harbor", "graduate", "USA", "mentorship", "dentistry", "surgery"] },
  { title: "MVP MBark Graduate Mentorship Program", subtitle: "Mission Pet Health (formerly Mission Veterinary Partners)", description: "12-month GP programme where mentors complete MBark Clinical Mentor Certification. Includes structured progression phases and custom dentistry labs.", section: "Graduate Development Programmes", navPath: "/training-programs/usa", tags: ["MVP", "Mission", "MBark", "graduate", "USA", "mentorship", "GP", "dentistry"] },
  { title: "SVP Doctor Mentorship Program", subtitle: "Mission Pet Health (formerly Southern Veterinary Partners)", description: "12-month GP programme with a paired on-site coach, Lead DVM Foundations training, and 50+ hours of RACE-approved CE across 850+ hospitals.", section: "Graduate Development Programmes", navPath: "/training-programs/usa", tags: ["SVP", "Southern Veterinary Partners", "Mission", "graduate", "USA", "mentorship", "GP", "dentistry"] },
  { title: "RISE DVM / VMD Mentorship Program", subtitle: "PetVet Care Centers", description: "12-month immersive programme with dual mentorship, tailored caseload ramp-up, national peer cohort, and up to $50,000 in new-grad incentives.", section: "Graduate Development Programmes", navPath: "/training-programs/usa", tags: ["PetVet", "RISE", "graduate", "USA", "mentorship", "ECC", "mixed animal"] },
  { title: "Thrive Doctor Mentorship Program", subtitle: "Thrive Pet Healthcare", description: "12-month GP, urgent care, and specialty programme with structured milestone curriculum, wellbeing support, and both Regional and on-site mentors.", section: "Graduate Development Programmes", navPath: "/training-programs/usa", tags: ["Thrive", "graduate", "USA", "mentorship", "GP", "urgent care", "specialty"] },
  { title: "Emergency Clinician Mentorship Program (ECMP)", subtitle: "MedVet", description: "6–12 month immersive ECC programme with 1:1 mentorship in a high-volume ER, designed to transition new graduates to standalone emergency clinicians.", section: "Graduate Development Programmes", navPath: "/training-programs/usa", tags: ["MedVet", "ECMP", "emergency", "ECC", "USA", "graduate", "critical care"] },
  { title: "ACCESS Accelerated Training (AAT)", subtitle: "ACCESS Specialty Animal Hospitals (Thrive Network)", description: "One-year ECC training programme with a two-year work commitment, progressing through foundation and specialist didactics and mentored hands-on work.", section: "Graduate Development Programmes", navPath: "/training-programs/usa", tags: ["ACCESS", "AAT", "emergency", "ECC", "USA", "graduate", "Thrive", "Florida", "critical care"] },
  { title: "AmeriVet Doctor Mentorship Program", subtitle: "AmeriVet Veterinary Partners", description: "12-month GP and urgent care programme with 1:1 on-site mentor, monthly virtual cohort conversations, and a clinical Hot Topics series.", section: "Graduate Development Programmes", navPath: "/training-programs/usa", tags: ["AmeriVet", "graduate", "USA", "mentorship", "GP", "urgent care"] },
  { title: "Heartland New Graduate Onboarding & Mentorship", subtitle: "Heartland Veterinary Partners", description: "12-month GP programme with a tailored caseload ramp-up schedule, structured procedural checklists, and a designated in-hospital DVM mentor.", section: "Graduate Development Programmes", navPath: "/training-programs/usa", tags: ["Heartland", "graduate", "USA", "mentorship", "GP", "spay", "neuter", "dentistry"] },
  { title: "Rarebreed Early Career Mentorship", subtitle: "Rarebreed Veterinary Partners", description: "12-month GP and urgent care programme with clinical autonomy, mentor support, the Rarebreed Learning Lab platform, and mental-health resources.", section: "Graduate Development Programmes", navPath: "/training-programs/usa", tags: ["Rarebreed", "graduate", "USA", "mentorship", "GP", "urgent care", "wellbeing"] },
  { title: "Alliance Academy Mentors Program", subtitle: "Alliance Animal Health", description: "12-month GP and urgent care programme with dual-tier mentoring, board-certified dentistry and surgery wet labs, and monthly compassion-fatigue sessions.", section: "Graduate Development Programmes", navPath: "/training-programs/usa", tags: ["Alliance", "graduate", "USA", "mentorship", "GP", "dentistry", "surgery", "urgent care"] },
  { title: "Affinity Veterinary Academy Graduate Transition Program", subtitle: "CityVet", description: "12-month GP and urgent care programme via the Affinity Veterinary Academy with abdominal ultrasound training and zero negative-accrual ProSal.", section: "Graduate Development Programmes", navPath: "/training-programs/usa", tags: ["Affinity", "CityVet", "graduate", "USA", "mentorship", "GP", "ultrasound", "ProSal"] },
  { title: "CVP Doctor Mentorship Framework", subtitle: "Community Veterinary Partners (CVP)", description: "12-month programme across GP, exotics, and equine practices with custom medical-autonomy mentorship and structured ProSal.", section: "Graduate Development Programmes", navPath: "/training-programs/usa", tags: ["CVP", "Community Veterinary Partners", "graduate", "USA", "mentorship", "GP", "exotics", "equine"] },
  { title: "Innovetive University One-Year Mentor Program", subtitle: "Innovetive Petcare", description: "12-month programme combining in-clinic modules with third-party clinical training, Global FAST ultrasound certification, and dentistry tracks.", section: "Graduate Development Programmes", navPath: "/training-programs/usa", tags: ["Innovetive", "graduate", "USA", "mentorship", "ultrasound", "FAST", "dentistry", "exotics"] },
  { title: "Destination Pet New Graduate Mentorship Framework", subtitle: "Destination Pet", description: "12-month GP and urgent care programme with a whole-health multi-site framework, $3,000–$5,000 CE allowance, and technical skill check-offs.", section: "Graduate Development Programmes", navPath: "/training-programs/usa", tags: ["Destination Pet", "graduate", "USA", "mentorship", "GP", "urgent care"] },
  { title: "VPP New Graduate Mentorship Framework", subtitle: "Veterinary Practice Partners (VPP)", description: "12-month GP programme maintaining local practice identity while providing network CE access, personal mentorship blueprints, and soft-skills development.", section: "Graduate Development Programmes", navPath: "/training-programs/usa", tags: ["VPP", "Veterinary Practice Partners", "graduate", "USA", "mentorship", "GP"] },
  { title: "Ready, Vet, Go Mentorship Integration Program", subtitle: "Ready, Vet, Go", description: "6-month structured curriculum with a one-year community membership, embedding graduate training into independent and private practices. Available USA & Canada.", section: "Graduate Development Programmes", navPath: "/training-programs/usa", tags: ["Ready Vet Go", "graduate", "USA", "Canada", "mentorship", "independent practice"] },
  { title: "United Veterinary Care New Graduate Mentorship", subtitle: "United Veterinary Care (UVC)", description: "Dedicated GP mentorship programme for new graduates entering clinical practice at United Veterinary Care locations.", section: "Graduate Development Programmes", navPath: "/training-programs/usa", tags: ["UVC", "United Veterinary Care", "graduate", "USA", "mentorship", "GP"] },
  { title: "Vetco Total Care PACKS Early Career Mentorship", subtitle: "Petco / Vetco Total Care", description: "Personalised GP mentor-doctor pairing with a co-created development plan and Merck-sponsored MentorVet Lift membership.", section: "Graduate Development Programmes", navPath: "/training-programs/usa", tags: ["Vetco", "Petco", "PACKS", "graduate", "USA", "mentorship", "GP", "MentorVet"] },
  { title: "Mentoring@AVMA", subtitle: "American Veterinary Medical Association", description: "6-month structured virtual mentoring programme pairing early-career vets with trained mentors. Not employer-hosted — open to any US graduate.", section: "Graduate Development Programmes", navPath: "/training-programs/usa", tags: ["AVMA", "mentoring", "USA", "graduate", "virtual", "independent"] },
  { title: "MentorVet Leap", subtitle: "MentorVet", description: "Evidence-based approximately 6-month transition-to-practice programme with cohort learning, 1:1 coaching, and a wellbeing curriculum.", section: "Graduate Development Programmes", navPath: "/training-programs/usa", tags: ["MentorVet", "Leap", "graduate", "USA", "mentorship", "wellbeing", "burnout"] },
  // Canada
  { title: "VetStrategy New Grad Mentorship Program", subtitle: "VetStrategy (IVC Evidensia family)", description: "12-month framework adapted from IVC Evidensia's European Graduate Academy, with regional mentor pairings, procedural logs, CE camps, and optional teaching-hospital placement.", section: "Graduate Development Programmes", navPath: "/training-programs/canada", tags: ["VetStrategy", "IVC", "graduate", "Canada", "mentorship", "GP"] },
  { title: "P3 Veterinary Partners Mentorship Program", subtitle: "P3 Veterinary Partners", description: "Goals-based GP mentorship with targeted individual and group CE including virtual learning, 1:1 sessions, wet labs, and courses.", section: "Graduate Development Programmes", navPath: "/training-programs/canada", tags: ["P3", "graduate", "Canada", "mentorship", "GP"] },
  { title: "VIRMP Rotating Internship (Canada)", subtitle: "Veterinary Internship & Residency Matching Program", description: "One-year rotating internships at Canadian veterinary teaching hospitals including Ontario Veterinary College (OVC) and Western College of Veterinary Medicine (WCVM).", section: "Graduate Development Programmes", navPath: "/training-programs/canada", tags: ["VIRMP", "internship", "Canada", "OVC", "WCVM", "rotating"] },
  { title: "Greencross Vets Graduate Vet Program", subtitle: "Greencross Vets", description: "Structured graduate programme with dedicated mentorship, ongoing clinical education, and professional development across Australia.", section: "Graduate Development Programmes", navPath: "/training-programs/australia", tags: ["Greencross", "graduate", "Australia", "mentor"] },
  { title: "Apiam Animal Health Graduate Program", subtitle: "Apiam Animal Health", description: "Graduate development programme focused on rural, regional, and production animal practice across regional Australia.", section: "Graduate Development Programmes", navPath: "/training-programs/australia", tags: ["Apiam", "graduate", "Australia", "rural", "farm animal", "production"] },
  { title: "AVA Mentoring Program", subtitle: "Australian Veterinary Association", description: "The AVA connects new graduate veterinarians with experienced mentors for professional guidance and career development.", section: "Graduate Development Programmes", navPath: "/training-programs/australia", tags: ["AVA", "mentoring", "Australia", "graduate"] },
].map((i) => ({ ...i, url: urlMap[i.title] || null, navPath: i.navPath + "#" + slugify(i.title) }));

const internshipItems = [
  { title: "VIRMP \u2014 Veterinary Internship and Residency Matching Program", subtitle: "VIRMP", description: "Central matching service for veterinary internships and residencies in North America.", section: "Internships & Residencies", navPath: "/internships-residencies/north-america", tags: ["VIRMP", "internship", "residency", "North America", "matching", "USA", "Canada"] },
  { title: "Royal Veterinary College Rotating Internship Programme", subtitle: "Royal Veterinary College", description: "Rotating small animal internship at the RVC referral hospital, expanding clinical knowledge and skills under supervision.", section: "Internships & Residencies", navPath: "/internships-residencies/uk", tags: ["RVC", "Royal Veterinary College", "internship", "UK", "small animal", "referral"] },
  { title: "Royal Veterinary College Small Animal Residency Programmes", subtitle: "Royal Veterinary College", description: "Specialist residency training in small animal disciplines; all residents also registered for a Master's degree.", section: "Internships & Residencies", navPath: "/internships-residencies/uk", tags: ["RVC", "Royal Veterinary College", "residency", "UK", "specialist", "MSc"] },
  { title: "University of Liverpool Rotating Internship Programme", subtitle: "University of Liverpool", description: "Rotating internship at the Small Animal Teaching Hospital (SATH) at Leahurst, multi-disciplinary referral setting.", section: "Internships & Residencies", navPath: "/internships-residencies/uk", tags: ["Liverpool", "SATH", "internship", "UK", "small animal", "Leahurst"] },
  { title: "University of Liverpool Anaesthesia Internship Programme", subtitle: "University of Liverpool", description: "Discipline-specific internship in anaesthesia at the Liverpool Small Animal Teaching Hospital.", section: "Internships & Residencies", navPath: "/internships-residencies/uk", tags: ["Liverpool", "internship", "UK", "anaesthesia", "discipline specific"] },
  { title: "University of Liverpool Small Animal Residency Programme", subtitle: "University of Liverpool", description: "Specialist residency programmes in multiple disciplines at SATH, Leahurst.", section: "Internships & Residencies", navPath: "/internships-residencies/uk", tags: ["Liverpool", "SATH", "residency", "UK", "specialist"] },
  { title: "University of Cambridge Rotating Internship Programme", subtitle: "University of Cambridge", description: "High-quality postgraduate training across small animal disciplines at the Cambridge Queen's Veterinary School Hospital.", section: "Internships & Residencies", navPath: "/internships-residencies/uk", tags: ["Cambridge", "internship", "UK", "small animal"] },
  { title: "University of Cambridge Senior Clinical Training Scholarship / Residency Programme", subtitle: "University of Cambridge", description: "Advanced clinical training programme preparing candidates for specialist residency entry.", section: "Internships & Residencies", navPath: "/internships-residencies/uk", tags: ["Cambridge", "residency", "UK", "clinical training scholarship", "specialist"] },
  { title: "University of Edinburgh Rotating Internship Programme", subtitle: "University of Edinburgh", description: "53-week rotating internship in small animal disciplines at Easter Bush Campus.", section: "Internships & Residencies", navPath: "/internships-residencies/uk", tags: ["Edinburgh", "internship", "UK", "rotating", "small animal", "53 week"] },
  { title: "University of Edinburgh Residency / Clinical Scholarship Programme", subtitle: "University of Edinburgh", description: "Professional Doctorate providing advanced clinical training in a chosen specialty at Easter Bush.", section: "Internships & Residencies", navPath: "/internships-residencies/uk", tags: ["Edinburgh", "residency", "UK", "specialist", "doctorate"] },
  { title: "University of Glasgow Small Animal Internship Programme", subtitle: "University of Glasgow", description: "Structured postgraduate clinical internship at the Glasgow Small Animal Hospital.", section: "Internships & Residencies", navPath: "/internships-residencies/uk", tags: ["Glasgow", "internship", "UK", "small animal"] },
  { title: "University of Glasgow Small Animal Residency Programme", subtitle: "University of Glasgow", description: "Specialist residency training at the Glasgow Small Animal Hospital.", section: "Internships & Residencies", navPath: "/internships-residencies/uk", tags: ["Glasgow", "residency", "UK", "specialist"] },
  { title: "IVC Evidensia Rotating and Discipline-Specific Internships", subtitle: "IVC Evidensia", description: "Internship programmes across IVC Evidensia's network providing training across a range of small animal disciplines.", section: "Internships & Residencies", navPath: "/internships-residencies/uk", tags: ["IVC", "IVC Evidensia", "Evidensia", "internship", "UK", "small animal", "rotating", "discipline specific"] },
  { title: "IVC Evidensia Small Animal Residency Programmes", subtitle: "IVC Evidensia", description: "Residency programmes across IVC Evidensia's network, training towards diploma specialist status.", section: "Internships & Residencies", navPath: "/internships-residencies/uk", tags: ["IVC", "IVC Evidensia", "Evidensia", "residency", "UK", "specialist", "diploma"] },
  { title: "Linnaeus Small Animal Rotating and Discipline-Specific Internships", subtitle: "Linnaeus Group", description: "Rotating and discipline-specific internships across Linnaeus's UK hospital network.", section: "Internships & Residencies", navPath: "/internships-residencies/uk", tags: ["Linnaeus", "internship", "UK", "small animal", "rotating"] },
  { title: "Linnaeus Small Animal Residency Programmes", subtitle: "Linnaeus Group", description: "Residency programmes across Linnaeus UK hospitals, training towards diplomatic specialist status.", section: "Internships & Residencies", navPath: "/internships-residencies/uk", tags: ["Linnaeus", "residency", "UK", "specialist", "diplomat"] },
  { title: "CVS Small Animal Rotating and Discipline-Specific Internship Programmes", subtitle: "CVS Group", description: "Internships exposing vets to referral practice and specialist disciplines at CVS referral hospitals.", section: "Internships & Residencies", navPath: "/internships-residencies/uk", tags: ["CVS", "internship", "UK", "small animal", "referral", "rotating"] },
  { title: "CVS Small Animal Residency Programmes", subtitle: "CVS Group", description: "Specialist residency programmes across CVS referral hospitals.", section: "Internships & Residencies", navPath: "/internships-residencies/uk", tags: ["CVS", "residency", "UK", "specialist"] },
  { title: "The Ralph Veterinary Internship Programmes", subtitle: "The Ralph", description: "Rotating and discipline-specific internship programmes at The Ralph referral hospital.", section: "Internships & Residencies", navPath: "/internships-residencies/uk", tags: ["Ralph", "The Ralph", "internship", "UK", "referral"] },
  { title: "The Ralph Veterinary Residency Programme", subtitle: "The Ralph", description: "Residency programmes in collaboration with European specialist colleges at The Ralph.", section: "Internships & Residencies", navPath: "/internships-residencies/uk", tags: ["Ralph", "The Ralph", "residency", "UK", "specialist", "European college"] },
  { title: "BEVA Recognised Equine Internship", subtitle: "British Equine Veterinary Association", description: "BEVA-recognised equine internships with agreed core standards for training and fair treatment of interns.", section: "Internships & Residencies", navPath: "/internships-residencies/worldwide", tags: ["BEVA", "equine", "internship", "horse", "UK", "worldwide"] },
  { title: "ECVS Residency Training", subtitle: "European College of Veterinary Surgeons", description: "Advanced surgical training programmes leading to board certification in veterinary surgery.", section: "Internships & Residencies", navPath: "/internships-residencies/europe", tags: ["ECVS", "surgery", "residency", "Europe", "specialist", "board certified"] },
  { title: "ECVP Residency Programme", subtitle: "European College of Veterinary Pathologists", description: "Specialised training in veterinary pathology leading to board certification.", section: "Internships & Residencies", navPath: "/internships-residencies/europe", tags: ["ECVP", "pathology", "residency", "Europe"] },
  { title: "ECVIM-CA Residency Programmes", subtitle: "European College of Veterinary Internal Medicine", description: "Residency training in internal medicine at institutes across Europe.", section: "Internships & Residencies", navPath: "/internships-residencies/europe", tags: ["ECVIM", "internal medicine", "residency", "Europe", "cardiology", "oncology"] },
  { title: "ECVM Residency Programmes", subtitle: "European College of Veterinary Microbiology", description: "Residency training in microbiology at European veterinary institutes.", section: "Internships & Residencies", navPath: "/internships-residencies/europe", tags: ["ECVM", "microbiology", "residency", "Europe"] },
  { title: "ECVAA Residency Programmes", subtitle: "European College of Veterinary Anaesthesia and Analgesia", description: "Residency training in anaesthesia and analgesia across Europe.", section: "Internships & Residencies", navPath: "/internships-residencies/europe", tags: ["ECVAA", "anaesthesia", "analgesia", "residency", "Europe"] },
  { title: "ECVCN Residency Programmes", subtitle: "European College of Veterinary and Comparative Nutrition", description: "Residency training in veterinary nutrition across European institutes.", section: "Internships & Residencies", navPath: "/internships-residencies/europe", tags: ["ECVCN", "nutrition", "residency", "Europe"] },
  { title: "ECVCP Residency Programmes", subtitle: "European College of Veterinary Clinical Pathology", description: "Residency training in clinical pathology at European veterinary institutes.", section: "Internships & Residencies", navPath: "/internships-residencies/europe", tags: ["ECVCP", "clinical pathology", "residency", "Europe"] },
  { title: "ECVD Residency Programmes", subtitle: "European College of Veterinary Dermatology", description: "Residency training in veterinary dermatology across Europe.", section: "Internships & Residencies", navPath: "/internships-residencies/europe", tags: ["ECVD", "dermatology", "residency", "Europe", "skin"] },
  { title: "ECVDI Residency Programmes", subtitle: "European College of Veterinary Diagnostic Imaging", description: "Residency training in veterinary diagnostic imaging across Europe.", section: "Internships & Residencies", navPath: "/internships-residencies/europe", tags: ["ECVDI", "imaging", "radiology", "residency", "Europe"] },
  { title: "ECVECC Residency Programmes", subtitle: "European College of Veterinary Emergency and Critical Care", description: "Residency training in emergency and critical care at institutes across Europe and New Zealand.", section: "Internships & Residencies", navPath: "/internships-residencies/europe", tags: ["ECVECC", "emergency", "critical care", "ECC", "residency", "Europe"] },
  { title: "ECVN Residency Programmes", subtitle: "European College of Veterinary Neurology", description: "Residency training in veterinary neurology at European institutes.", section: "Internships & Residencies", navPath: "/internships-residencies/europe", tags: ["ECVN", "neurology", "residency", "Europe", "brain"] },
  { title: "ECVO Internship & Residency Programmes", subtitle: "European College of Veterinary Ophthalmologists", description: "Internship and residency training in veterinary ophthalmology at European institutes.", section: "Internships & Residencies", navPath: "/internships-residencies/europe", tags: ["ECVO", "ophthalmology", "eyes", "internship", "residency", "Europe"] },
].map((i) => ({ ...i, url: urlMap[i.title] || null, navPath: i.navPath + "#" + slugify(i.title) }));

const certItems = [
  { title: "Improve International Postgraduate Programmes", subtitle: "Improve International", description: "Range of postgraduate veterinary courses and certificates including GPCert.", section: "Postgraduate Certificates", navPath: "/postgraduate-certificates/uk", tags: ["Improve", "GPCert", "postgraduate", "certificate", "UK"] },
  { title: "BSAVA Postgraduate Certificates", subtitle: "British Small Animal Veterinary Association", description: "Professional certificates in small animal medicine and surgery.", section: "Postgraduate Certificates", navPath: "/postgraduate-certificates/uk", tags: ["BSAVA", "certificate", "postgraduate", "small animal", "UK"] },
  { title: "Royal Veterinary College CertAVP", subtitle: "Royal Veterinary College", description: "RCVS-accredited Certificate in Advanced Veterinary Practice.", section: "Postgraduate Certificates", navPath: "/postgraduate-certificates/uk", tags: ["RVC", "CertAVP", "RCVS", "certificate", "UK", "advanced"] },
  { title: "University of Edinburgh CertAVP", subtitle: "University of Edinburgh", description: "RCVS Certificate in Advanced Veterinary Practice with flexible self-study options.", section: "Postgraduate Certificates", navPath: "/postgraduate-certificates/uk", tags: ["Edinburgh", "CertAVP", "RCVS", "certificate", "UK"] },
  { title: "University of Liverpool CertAVP", subtitle: "University of Liverpool", description: "Certificate in Advanced Veterinary Practice with online and face-to-face learning.", section: "Postgraduate Certificates", navPath: "/postgraduate-certificates/uk", tags: ["Liverpool", "CertAVP", "RCVS", "certificate", "UK"] },
  { title: "University of Nottingham CertAVP", subtitle: "University of Nottingham", description: "RCVS Certificate in Advanced Veterinary Practice with modular structure.", section: "Postgraduate Certificates", navPath: "/postgraduate-certificates/uk", tags: ["Nottingham", "CertAVP", "RCVS", "certificate", "UK"] },
  { title: "University of Surrey Veterinary General Practice PGCert", subtitle: "University of Surrey", description: "Modular PGCert delivered through online learning followed by a 2-week placement at the University.", section: "Postgraduate Certificates", navPath: "/postgraduate-certificates/uk", tags: ["Surrey", "PGCert", "certificate", "UK", "general practice"] },
].map((i) => ({ ...i, url: urlMap[i.title] || null, navPath: i.navPath + "#" + slugify(i.title) }));

// Build search index at cold-start (cached across warm invocations)
const conferenceItems = conferences.map((c) => ({
  title: c.title,
  subtitle: c.organiser,
  description: `${c.dates} \u00b7 ${c.location}${c.notes ? " \u2014 " + c.notes : ""}`,
  section: "Conferences",
  url: c.website || null,
  navPath: "/?tab=cpd#" + slugify(c.title),
  tags: [...c.specialties, ...c.regions, c.category || ""],
}));

const cpdItems = cpdProviders.map((p) => ({
  title: p.provider,
  subtitle: p.programme,
  description: `${p.location}${p.notes ? " \u2014 " + p.notes : ""}`,
  section: "CPD Providers",
  url: p.website || null,
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
