// ─── Country hub configuration ────────────────────────────────────────────────

export const countryConfig = [
  {
    id: "australia",
    name: "Australia",
    flag: "🇦🇺",
    image: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=600&q=80",
  },
  {
    id: "canada",
    name: "Canada",
    flag: "🇨🇦",
    image: "https://images.pexels.com/photos/11862814/pexels-photo-11862814.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: "new-zealand",
    name: "New Zealand",
    flag: "🇳🇿",
    image: "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=600&q=80",
  },
  {
    id: "uk",
    name: "United Kingdom",
    flag: "🇬🇧",
    image: "https://images.pexels.com/photos/30721230/pexels-photo-30721230.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: "usa",
    name: "United States",
    flag: "🇺🇸",
    image: "https://images.pexels.com/photos/16156721/pexels-photo-16156721.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
];

// ─── UK ───────────────────────────────────────────────────────────────────────

export const ukPrograms = [
  {
    title: "Improve International Postgraduate Programmes",
    organisation: "Improve International",
    description: "GPCert, GPAdvCert, and PgC programmes across small animal medicine, surgery, ECC, dermatology, cardiology, and more.",
    url: "https://improveinternational.com/uk/postgraduate-programmes/",
  },
  {
    title: "BSAVA Postgraduate Certificates",
    organisation: "British Small Animal Veterinary Association",
    description: "Professional certificates in small animal medicine and surgery.",
    url: "https://www.bsava.com/education/postgraduate-certificates/",
  },
  {
    title: "Royal Veterinary College CertAVP",
    organisation: "Royal Veterinary College",
    description: "RCVS-accredited certificate programme in advanced veterinary practice.",
    url: "https://www.rvc.ac.uk/study/postgraduate/certavp",
  },
  {
    title: "University of Edinburgh CertAVP",
    organisation: "University of Edinburgh",
    description: "RCVS Certificate in Advanced Veterinary Practice with flexible study options.",
    url: "https://vet.ed.ac.uk/education/postgraduate/taught/rcvs-certavp",
  },
  {
    title: "University of Liverpool CertAVP",
    organisation: "University of Liverpool",
    description: "Certificate in Advanced Veterinary Practice with online and face-to-face learning.",
    url: "https://www.liverpool.ac.uk/vets/cpd/certavp/",
  },
  {
    title: "University of Nottingham CertAVP",
    organisation: "University of Nottingham",
    description: "RCVS Certificate in Advanced Veterinary Practice with modular structure.",
    url: "https://www.nottingham.ac.uk/vet/study-with-us/cpd/rcvs-certificate-in-advanced-veterinary-practice-certavp.aspx",
  },
  {
    title: "University of Surrey Veterinary General Practice PGCert",
    organisation: "University of Surrey",
    description: "Modular structure delivered through online learning followed by a 2-week placement at the University.",
    url: "https://www.surrey.ac.uk/postgraduate/veterinary-general-practice-pgcert",
  },
];

// ─── USA ──────────────────────────────────────────────────────────────────────

export const usaCertCategories = [
  {
    id: "isvps",
    name: "ISVPS / Improve International",
    description: "The closest direct equivalent to the UK GPCert — same awarding bodies (ISVPS, Harper Adams University), same modular format, now operating in North America.",
    programs: [
      {
        credential: "GPCert",
        title: "Multiple disciplines",
        organisation: "Improve Veterinary Education (USA) / ISVPS",
        country: "USA — open to Canada",
        format: "Online modular (~600 nominal hours) + ISVPS exam; minimum 1 year in practice to enrol",
        notes: "Closest direct equivalent to the UK GPCert. Internationally recognised middle-tier qualification awarded by ISVPS. Disciplines include Small Animal Medicine, Surgery, Cardiology, Dermatology, ECC, Exotics, Ophthalmology, Dentistry, and Diagnostic Imaging.",
        url: "https://improveinternational.com/us/",
      },
      {
        credential: "PgC",
        title: "Postgraduate Certificate (university-accredited)",
        organisation: "Harper Adams University (via Improve / ISVPS)",
        country: "USA — open to Canada",
        format: "GPCert programme + additional academic assessment; 30 ECTS university credits",
        notes: "University-accredited postgraduate certificate stacked on top of the GPCert. Transferable academic credit at Level 7. Same content as the UK PgC delivered by the same teaching faculty.",
        url: "https://improveinternational.com/us/",
      },
      {
        credential: "GPAdvCert",
        title: "Advanced level — post-GPCert",
        organisation: "Improve Veterinary Education / ISVPS",
        country: "USA — open to Canada",
        format: "Advanced modular programme + ISVPS assessment; typically completed after a GPCert",
        notes: "A step up from GPCert but still below Diplomate level. Deepens clinical knowledge in a discipline already studied at certificate level.",
        url: "https://improveinternational.com/us/advanced-programs/",
      },
    ],
  },
  {
    id: "rehab",
    name: "Rehabilitation & Sports Medicine",
    description: "The strongest and most clinically established category of North American certificate credentials — university-backed, exam-assessed, and widely recognised in practice.",
    programs: [
      {
        credential: "CCRP",
        title: "Canine Rehabilitation",
        organisation: "University of Tennessee (with Veterinary Academy of Higher Learning)",
        country: "USA — global intake",
        format: "Blended: online didactic + hands-on labs + clinical practicum + written & practical exam",
        notes: "First and best-known university-based canine rehabilitation credential; RACE-approved. Open to vets, vet techs, and physiotherapists.",
        url: "https://www.utvetrehab.com/canine-rehab-ccrp/",
      },
      {
        credential: "CCRT",
        title: "Canine Rehabilitation",
        organisation: "Canine Rehabilitation Institute (CRI)",
        country: "USA — global intake",
        format: "Modular courses + hands-on labs + exam; separate tracks for vets/PTs (CCRT) and technicians (CCRVN)",
        notes: "The other major canine rehabilitation certification alongside the CCRP. Widely held; recognised by employers across North America, the UK, and Australia.",
        url: "https://www.caninerehabinstitute.com/",
      },
      {
        credential: "CCRV",
        title: "Canine Rehabilitation",
        organisation: "Chi University",
        country: "USA",
        format: "On-site hands-on + distance learning + quizzes + written & practical exams + case studies",
        notes: "Certified Canine Rehabilitation Veterinarian from Chi University. Integrative-medicine oriented; endorsed credential for vets specifically.",
        url: "https://chiu.edu/",
      },
      {
        credential: "CERP",
        title: "Equine Rehabilitation",
        organisation: "University of Tennessee",
        country: "USA — global intake",
        format: "Blended online + hands-on labs + practicum + exam",
        notes: "Equine counterpart to the CCRP, from the same University of Tennessee programme.",
        url: "https://www.utvetrehab.com/",
      },
      {
        credential: "CERT",
        title: "Equine Rehabilitation",
        organisation: "Canine Rehabilitation Institute (CRI)",
        country: "USA — global intake",
        format: "Modular courses + hands-on labs + exam",
        notes: "Equine certification track from CRI, running alongside their canine rehabilitation programme.",
        url: "https://www.caninerehabinstitute.com/",
      },
    ],
  },
  {
    id: "acupuncture",
    name: "Acupuncture & Traditional Chinese Veterinary Medicine",
    description: "Multiple pathways exist for veterinary acupuncture in North America. All require a formal course, hands-on practical assessment, and an exam. IVAS and Chi University are the two principal awarding bodies.",
    programs: [
      {
        credential: "CVA",
        title: "Veterinary Acupuncture",
        organisation: "Chi University",
        country: "USA — global intake",
        format: "Online modules + on-site hands-on acupoint labs + exams",
        notes: "Certified Veterinary Acupuncturist. One of the most widely held acupuncture credentials; also hosted at partner institutions including UC Davis.",
        url: "https://chiu.edu/",
      },
      {
        credential: "CVA (IVAS)",
        title: "Veterinary Acupuncture",
        organisation: "International Veterinary Acupuncture Society (IVAS)",
        country: "USA & Canada — global",
        format: "Structured course (120+ hours) + internship + written & practical exams",
        notes: "Globally recognised acupuncture certification; IVAS is the international umbrella body. Graduates may join AAVA/IVAS as credentialed members.",
        url: "https://www.ivas.org/",
      },
      {
        credential: "EBVA cert",
        title: "Evidence-Based Veterinary Acupuncture",
        organisation: "Evidence-Based Veterinary Acupuncture (EBVA)",
        country: "USA — global intake",
        format: "Online + in-person workshops (Level 1 & 2) + assessment",
        notes: "Neuroanatomy and evidence-based approach. RACE-, IVAS-, AAVA- and IVAPM-recognised; credits count toward the CVPP pain credential.",
        url: "https://evidencebasedveterinaryacupuncture.com/",
      },
      {
        credential: "CVA (CuraCore)",
        title: "Medical Acupuncture",
        organisation: "CuraCore (Colorado State University-linked faculty)",
        country: "USA — global intake",
        format: "Online + hands-on labs + case logs + exam",
        notes: "Science-based medical acupuncture programme, formerly the CSU/Narda Robinson course. Distinct from TCVM-oriented providers.",
        url: "https://curacore.org/vet/",
      },
      {
        credential: "CVCH",
        title: "Chinese Herbal Medicine",
        organisation: "Chi University",
        country: "USA — global intake",
        format: "Modular online + on-site + exams",
        notes: "Certified Veterinary Chinese Herbalist. TCVM herbal therapy credential from Chi University.",
        url: "https://chiu.edu/",
      },
      {
        credential: "CVTP",
        title: "Tui-na (Veterinary Manual Therapy)",
        organisation: "Chi University",
        country: "USA — global intake",
        format: "Modular courses + assessment",
        notes: "Certified in Veterinary Tui-na — the TCVM manual therapy modality.",
        url: "https://chiu.edu/",
      },
      {
        credential: "CVFT",
        title: "Food Therapy",
        organisation: "Chi University",
        country: "USA — global intake",
        format: "Modular courses + assessment",
        notes: "Certified Veterinary Food Therapist. TCVM nutritional therapy credential.",
        url: "https://chiu.edu/",
      },
    ],
  },
  {
    id: "pain",
    name: "Pain Management & Integrative Medicine",
    description: "A growing category covering pain, chiropractic, hospice care, and botanical medicine. The CVPP is the most clinically mainstream of these.",
    programs: [
      {
        credential: "CVPP",
        title: "Pain Management",
        organisation: "International Veterinary Academy of Pain Management (IVAPM)",
        country: "USA & Canada — global",
        format: "Credential application + evidence of training/CE + skills assessment + exam",
        notes: "Certified Veterinary Pain Practitioner. Available separately to vets and to licensed vet techs. A widely recognised pain-management middle-tier credential.",
        url: "https://www.ivapm.org/",
      },
      {
        credential: "CVSMT",
        title: "Spinal Manipulation",
        organisation: "Healing Oasis Wellness Center / College of Animal Chiropractors",
        country: "USA — global intake",
        format: "Intensive modular course + exams",
        notes: "Certified Veterinary Spinal Manipulative Therapist. Animal chiropractic / spinal manipulation credential for vets.",
        url: "https://www.healingoasis.edu/",
      },
      {
        credential: "AVCA cert",
        title: "Animal Chiropractic",
        organisation: "American Veterinary Chiropractic Association (AVCA)",
        country: "USA & Canada",
        format: "AVCA-accredited programme + certification exam",
        notes: "Certifies vets and chiropractors in animal chiropractic technique. Recognised post-nominal in integrative veterinary practice.",
        url: "https://www.animalchiropractic.org/",
      },
      {
        credential: "CVMMP",
        title: "Medical Manipulation",
        organisation: "Chi University",
        country: "USA",
        format: "Modular course + assessment",
        notes: "Certified Veterinary Medical Manipulation Practitioner. Integrative manual-therapy credential.",
        url: "https://chiu.edu/",
      },
      {
        credential: "CHPV",
        title: "Hospice & Palliative Care",
        organisation: "International Association for Animal Hospice & Palliative Care (IAAHPC)",
        country: "USA & Canada — global",
        format: "Online programme + assessment",
        notes: "Certified Hospice & Palliative Care Veterinarian. End-of-life care credential with growing recognition.",
        url: "https://www.iaahpc.org/",
      },
      {
        credential: "CVBM",
        title: "Botanical Medicine",
        organisation: "CIVT / veterinary botanical medicine bodies",
        country: "USA — global intake",
        format: "Online modular programme + assessment",
        notes: "Certified Veterinary Botanical Medicine practitioner. Western botanical / herbal medicine credential.",
        url: "https://civtedu.org/",
      },
    ],
  },
  {
    id: "university",
    name: "University Certificate Programmes",
    description: "Credit-bearing postgraduate certificates from accredited US veterinary schools. These sit closest to the UK PgC in academic standing and can ladder toward master's degrees.",
    programs: [
      {
        credential: "GPCert Dentistry",
        title: "Veterinary Dentistry",
        organisation: "Improve Veterinary Education / ISVPS",
        country: "USA — open to Canada",
        format: "Online modular + ISVPS assessment",
        notes: "Certificate-tier dentistry route. The AVDC Diplomate (specialist tier) is a separate, higher qualification and is not included here.",
        url: "https://improveinternational.com/us/",
      },
      {
        credential: "Certificate",
        title: "Nutrition Case Management",
        organisation: "University of Tennessee",
        country: "USA — global intake",
        format: "Online structured certificate programme",
        notes: "University CE certificate in clinical nutrition case management. Structured with formal completion rather than a simple attendance record.",
        url: "https://vetce.tennessee.edu/",
      },
      {
        credential: "Certificate",
        title: "Companion Animal Pain Management",
        organisation: "University of Tennessee",
        country: "USA — global intake",
        format: "Online structured certificate programme",
        notes: "University-run pain management certificate track. Complements the CVPP credential pathway.",
        url: "https://vetce.tennessee.edu/",
      },
      {
        credential: "Graduate Certificate",
        title: "Shelter Medicine",
        organisation: "University of Florida (Maddie's Shelter Medicine Program)",
        country: "USA — online, global",
        format: "Online credit-bearing graduate certificate; can ladder to MS degree",
        notes: "University graduate certificate — sits below the ABVP Shelter Medicine Diplomate tier. One of three UF online graduate certificates in specialist niches.",
        url: "https://sheltermedicine.vetmed.ufl.edu/",
      },
      {
        credential: "Graduate Certificate",
        title: "Aquatic Animal Health",
        organisation: "University of Florida",
        country: "USA — online, global",
        format: "Online credit-bearing graduate certificate",
        notes: "University graduate certificate for vets developing an interest in fish and aquatic species medicine.",
        url: "https://aquatic.vetmed.ufl.edu/",
      },
      {
        credential: "Graduate Certificate",
        title: "Veterinary Forensic Sciences",
        organisation: "University of Florida",
        country: "USA — online, global",
        format: "Online credit-bearing graduate certificate",
        notes: "A recognised niche credential in veterinary forensics. Credit-bearing and stackable toward postgraduate study.",
        url: "https://forensics.vetmed.ufl.edu/",
      },
    ],
  },
];

export const usaTotalCount = usaCertCategories.reduce((acc, cat) => acc + cat.programs.length, 0);

// ─── Australia & New Zealand ───────────────────────────────────────────────────

// Trans-Tasman entries appear on both the AU and NZ pages
const transTasmanPrograms = [
  {
    title: "Membership of the ANZCVS (MANZCVS)",
    organisation: "Australian & New Zealand College of Veterinary Scientists (ANZCVS)",
    description: "Middle-tier credential below Fellowship, assessed by written papers plus an oral or practical examination. Over 25 subjects available — including Small Animal Medicine, Surgery, ECC, Equine, Cattle, Behaviour, Radiology, Anaesthesia, Exotic Animal Practice, Wildlife, and more. Self-directed preparation typically taking 1–3 years; exams held annually (Category 1) or biennially (Category 2). Open to vets registrable in Australia or New Zealand.",
    url: "https://www.anzcvs.org.au/examination-information/",
    type: "college-membership",
  },
  {
    title: "General Practitioner Certificate (GPCert)",
    organisation: "ISVPS / Improve Veterinary Education Australia",
    description: "Middle-tier modular certificate equivalent to the UK GPCert — same awarding bodies (ISVPS, Harper Adams University), same format. Disciplines include Small Animal Medicine, Surgery, Feline Practice, Cardiology, Oncology, Dermatology, Ophthalmology, Neurology, Exotic Animal Practice, ECC, CT, and Ultrasound. Typically 12–24 months online; stackable to a university-accredited PgC (Level 7, 30 ECTS). Open to AU, NZ, and Pacific vets. NZVA- and RACE-accredited for CPD.",
    url: "https://improveinternational.com.au/",
    type: "commercial-certificate",
  },
  {
    title: "Foundation Certificate in Emergency & Critical Care",
    organisation: "ISVPS / Improve Veterinary Education Australia",
    description: "Entry-level ECC credential — 15 fully online modules over 12 months (enrol any time). The only ISVPS-accredited Foundation Certificate in ECC in Australasia. Builds toward GPCert-level study.",
    url: "https://improveinternational.com.au/course/global-accelerated-emergency-program/",
    type: "commercial-certificate",
  },
];

export const australiaPrograms = [
  ...transTasmanPrograms,
  {
    title: "Graduate Certificate in Small Animal Emergency and Critical Care (GC-SAECC)",
    organisation: "University of Melbourne (Melbourne Veterinary School)",
    description: "AQF Level 8 graduate certificate covering the theory required for ANZCVS ECC Membership exam preparation. Four compulsory subjects (50 credit points), 100% online, approximately 212 CPD points. Intakes in March and July.",
    url: "https://study.unimelb.edu.au/find/courses/graduate/graduate-certificate-in-small-animal-emergency-and-critical-care/",
    type: "university-graduate-certificate",
  },
  {
    title: "Master of Veterinary Studies (MVSt)",
    organisation: "University of Queensland (UQ)",
    description: "Coursework Masters combining taught subjects with a graduate research project. Suited to career enhancement and discipline development, and as preparation for Higher Degree by Research. Entry via vet degree or prior Graduate Certificate/Diploma.",
    url: "https://my.uq.edu.au/programs-courses/program.html?acad_prog=5220",
    type: "university-masters",
  },
  {
    title: "Master of Veterinary Studies (MVetStud)",
    organisation: "Charles Sturt University (CSU), Wagga Wagga",
    description: "Flexible coursework Masters available fully online or on-campus. Credit for prior study and experience available; eligible domestic students may access FEE-HELP. Most CSU postgraduate courses can be studied entirely online.",
    url: "https://study.csu.edu.au/courses/animal-vet-sciences/master-veterinary-studies",
    type: "university-masters",
  },
  {
    title: "CVE Distance Education Programmes",
    organisation: "Centre for Veterinary Education (CVE), University of Sydney",
    description: "Year-long modular distance education programmes across 14+ disciplines — the leading AU/NZ resource for ANZCVS Membership exam preparation. Monthly modules with tutor feedback; optional practical workshops. Membership-based (not-for-profit, 8,600+ members). Not an AQF award but structured and widely recognised.",
    url: "https://www.cve.edu.au/distanceeducation",
    type: "structured-cpd",
  },
];

export const newZealandPrograms = [
  ...transTasmanPrograms,
  {
    title: "Master of Veterinary Medicine (MVM)",
    organisation: "Massey University (School of Veterinary Science)",
    description: "Flexible distance-learning Masters covering small animal, large animal, equine, epidemiology, and veterinary business. 120 credits: four to five taught courses plus a literature review, practicum, or research project. Courses typically offered every two years; maximum five years to complete. Contact workshops in Palmerston North.",
    url: "https://www.massey.ac.nz/study/all-qualifications-and-degrees/master-of-veterinary-medicine-PMVTM/",
    type: "university-masters",
  },
  {
    title: "Postgraduate Diploma in Veterinary Science (PGDipVSc)",
    organisation: "Massey University",
    description: "120-credit postgraduate diploma — a structured stepping-stone between the MVM taught courses and a full Masters. Available with Veterinary Medicine or Veterinary Public Health endorsements. Credits ladder into the MVM.",
    url: "https://www.massey.ac.nz/study/all-qualifications-and-degrees/postgraduate-diploma-in-veterinary-science-PDVTS/",
    type: "university-graduate-certificate",
  },
  {
    title: "Postgraduate Certificate of Science and Technology (PGCertScTech / GCertScTech)",
    organisation: "Massey University",
    description: "60-credit postgraduate certificate — the formal award vehicle for the NZVA-Massey CPD Pathway (Sheep, Beef Cattle & Deer). Stand-alone or stackable toward the MVM or Master of Agriculture. Up to 30 credits of 700-level courses transfer to a Masters.",
    url: "https://nzva.org.nz/edhub/cpd-pathway/sbcd-pathway/gradcertsctech/",
    type: "university-graduate-certificate",
  },
  {
    title: "Master of Veterinary Studies (MVS)",
    organisation: "Massey University",
    description: "Coursework and research Masters focusing on research skills and an Advanced Veterinary Practice specialisation. 120 credits full-time or 60 per semester. Available internal or by distance. Entry requires a BVSc with B-grade average or equivalent; selection by interview.",
    url: "https://www.massey.ac.nz/study/all-qualifications-and-degrees/master-of-veterinary-studies-PMVTT/",
    type: "university-masters",
  },
  {
    title: "NZVA–Massey CPD Pathway",
    organisation: "New Zealand Veterinary Association (NZVA) & Massey University",
    description: "Structured CPD pathway combining online and face-to-face courses, leading to formal Massey qualifications (GCertScTech, MVM, or Master of Agriculture) plus NZVA Accreditation. Currently live for Sheep, Beef Cattle & Deer; Dairy Cattle, Equine, and Companion Animal pathways in development.",
    url: "https://nzva.org.nz/edhub/cpd-pathway/",
    type: "structured-cpd",
  },
];

// ─── Filter options & labels for AU/NZ pages ─────────────────────────────────

export const OCEANIA_TYPE_OPTIONS = [
  { value: "college-membership",              label: "College Membership Exam" },
  { value: "commercial-certificate",          label: "Commercial Certificate" },
  { value: "university-graduate-certificate", label: "University Graduate Certificate / Diploma" },
  { value: "university-masters",              label: "University Masters" },
  { value: "structured-cpd",                 label: "Structured CPD" },
];

export const TYPE_LABELS = {
  "college-membership":              "College Membership",
  "commercial-certificate":          "Commercial Certificate",
  "university-graduate-certificate": "University Graduate Certificate",
  "university-masters":              "University Masters",
  "structured-cpd":                  "Structured CPD",
};

// ─── Hub page helpers ─────────────────────────────────────────────────────────

export const countForHub = (id) => {
  if (id === "uk")          return ukPrograms.length;
  if (id === "usa")         return usaTotalCount;
  if (id === "australia")   return australiaPrograms.length;
  if (id === "new-zealand") return newZealandPrograms.length;
  return null; // "Coming soon"
};
