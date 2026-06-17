import React from "react";
const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import SharedHeader from "./SharedHeader";

const countryConfig = [
  {
    id: "uk",
    name: "United Kingdom",
    flag: "\uD83C\uDDEC\uD83C\uDDE7",
    image: "https://images.pexels.com/photos/30721230/pexels-photo-30721230.jpeg?auto=compress&cs=tinysrgb&w=600"
  },
  {
    id: "usa",
    name: "United States",
    flag: "\uD83C\uDDFA\uD83C\uDDF8",
    image: "https://images.pexels.com/photos/16156721/pexels-photo-16156721.jpeg?auto=compress&cs=tinysrgb&w=600"
  },
  {
    id: "canada",
    name: "Canada",
    flag: "\uD83C\uDDE8\uD83C\uDDE6",
    image: "https://images.pexels.com/photos/11862814/pexels-photo-11862814.jpeg?auto=compress&cs=tinysrgb&w=600"
  },
  {
    id: "australia",
    name: "Australia",
    flag: "\uD83C\uDDE6\uD83C\uDDFA",
    image: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=600&q=80"
  }
];

const ukPrograms = [
  {
    title: "Improve International Postgraduate Programmes",
    organisation: "Improve International",
    description: "GPCert, GPAdvCert, and PgC programmes across small animal medicine, surgery, ECC, dermatology, cardiology, and more.",
    url: "https://improveinternational.com/uk/postgraduate-programmes/"
  },
  {
    title: "BSAVA Postgraduate Certificates",
    organisation: "British Small Animal Veterinary Association",
    description: "Professional certificates in small animal medicine and surgery.",
    url: "https://www.bsava.com/education/postgraduate-certificates/"
  },
  {
    title: "Royal Veterinary College CertAVP",
    organisation: "Royal Veterinary College",
    description: "RCVS-accredited certificate programme in advanced veterinary practice.",
    url: "https://www.rvc.ac.uk/study/postgraduate/certavp"
  },
  {
    title: "University of Edinburgh CertAVP",
    organisation: "University of Edinburgh",
    description: "RCVS Certificate in Advanced Veterinary Practice with flexible study options.",
    url: "https://vet.ed.ac.uk/education/postgraduate/taught/rcvs-certavp"
  },
  {
    title: "University of Liverpool CertAVP",
    organisation: "University of Liverpool",
    description: "Certificate in Advanced Veterinary Practice with online and face-to-face learning.",
    url: "https://www.liverpool.ac.uk/vets/cpd/certavp/"
  },
  {
    title: "University of Nottingham CertAVP",
    organisation: "University of Nottingham",
    description: "RCVS Certificate in Advanced Veterinary Practice with modular structure.",
    url: "https://www.nottingham.ac.uk/vet/study-with-us/cpd/rcvs-certificate-in-advanced-veterinary-practice-certavp.aspx"
  },
  {
    title: "University of Surrey Veterinary General Practice PGCert",
    organisation: "University of Surrey",
    description: "Modular structure delivered through online learning followed by a 2-week placement at the University.",
    url: "https://www.surrey.ac.uk/postgraduate/veterinary-general-practice-pgcert"
  }
];

// USA / Canada — grouped by category
const usaCertCategories = [
  {
    id: "isvps",
    name: "ISVPS / Improve International",
    description: "The closest direct equivalent to the UK GPCert — same awarding bodies (ISVPS, Harper Adams University), same modular format, now operating in North America.",
    programs: [
      {
        credential: "GPCert",
        title: "Multiple disciplines",
        organisation: "Improve Veterinary Education (USA) / ISVPS",
        country: "USA \u2014 open to Canada",
        format: "Online modular (~600 nominal hours) + ISVPS exam; minimum 1 year in practice to enrol",
        notes: "Closest direct equivalent to the UK GPCert. Internationally recognised middle-tier qualification awarded by ISVPS. Disciplines include Small Animal Medicine, Surgery, Cardiology, Dermatology, ECC, Exotics, Ophthalmology, Dentistry, and Diagnostic Imaging.",
        url: "https://improveinternational.com/us/"
      },
      {
        credential: "PgC",
        title: "Postgraduate Certificate (university-accredited)",
        organisation: "Harper Adams University (via Improve / ISVPS)",
        country: "USA \u2014 open to Canada",
        format: "GPCert programme + additional academic assessment; 30 ECTS university credits",
        notes: "University-accredited postgraduate certificate stacked on top of the GPCert. Transferable academic credit at Level 7. Same content as the UK PgC delivered by the same teaching faculty.",
        url: "https://improveinternational.com/us/"
      },
      {
        credential: "GPAdvCert",
        title: "Advanced level \u2014 post-GPCert",
        organisation: "Improve Veterinary Education / ISVPS",
        country: "USA \u2014 open to Canada",
        format: "Advanced modular programme + ISVPS assessment; typically completed after a GPCert",
        notes: "A step up from GPCert but still below Diplomate level. Deepens clinical knowledge in a discipline already studied at certificate level.",
        url: "https://improveinternational.com/us/advanced-programs/"
      }
    ]
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
        country: "USA \u2014 global intake",
        format: "Blended: online didactic + hands-on labs + clinical practicum + written & practical exam",
        notes: "First and best-known university-based canine rehabilitation credential; RACE-approved. Open to vets, vet techs, and physiotherapists.",
        url: "https://www.utvetrehab.com/canine-rehab-ccrp/"
      },
      {
        credential: "CCRT",
        title: "Canine Rehabilitation",
        organisation: "Canine Rehabilitation Institute (CRI)",
        country: "USA \u2014 global intake",
        format: "Modular courses + hands-on labs + exam; separate tracks for vets/PTs (CCRT) and technicians (CCRVN)",
        notes: "The other major canine rehabilitation certification alongside the CCRP. Widely held; recognised by employers across North America, the UK, and Australia.",
        url: "https://www.caninerehabinstitute.com/"
      },
      {
        credential: "CCRV",
        title: "Canine Rehabilitation",
        organisation: "Chi University",
        country: "USA",
        format: "On-site hands-on + distance learning + quizzes + written & practical exams + case studies",
        notes: "Certified Canine Rehabilitation Veterinarian from Chi University. Integrative-medicine oriented; endorsed credential for vets specifically.",
        url: "https://chiu.edu/"
      },
      {
        credential: "CERP",
        title: "Equine Rehabilitation",
        organisation: "University of Tennessee",
        country: "USA \u2014 global intake",
        format: "Blended online + hands-on labs + practicum + exam",
        notes: "Equine counterpart to the CCRP, from the same University of Tennessee programme.",
        url: "https://www.utvetrehab.com/"
      },
      {
        credential: "CERT",
        title: "Equine Rehabilitation",
        organisation: "Canine Rehabilitation Institute (CRI)",
        country: "USA \u2014 global intake",
        format: "Modular courses + hands-on labs + exam",
        notes: "Equine certification track from CRI, running alongside their canine rehabilitation programme.",
        url: "https://www.caninerehabinstitute.com/"
      }
    ]
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
        country: "USA \u2014 global intake",
        format: "Online modules + on-site hands-on acupoint labs + exams",
        notes: "Certified Veterinary Acupuncturist. One of the most widely held acupuncture credentials; also hosted at partner institutions including UC Davis.",
        url: "https://chiu.edu/"
      },
      {
        credential: "CVA (IVAS)",
        title: "Veterinary Acupuncture",
        organisation: "International Veterinary Acupuncture Society (IVAS)",
        country: "USA & Canada \u2014 global",
        format: "Structured course (120+ hours) + internship + written & practical exams",
        notes: "Globally recognised acupuncture certification; IVAS is the international umbrella body. Graduates may join AAVA/IVAS as credentialed members.",
        url: "https://www.ivas.org/"
      },
      {
        credential: "EBVA cert",
        title: "Evidence-Based Veterinary Acupuncture",
        organisation: "Evidence-Based Veterinary Acupuncture (EBVA)",
        country: "USA \u2014 global intake",
        format: "Online + in-person workshops (Level 1 & 2) + assessment",
        notes: "Neuroanatomy and evidence-based approach. RACE-, IVAS-, AAVA- and IVAPM-recognised; credits count toward the CVPP pain credential.",
        url: "https://evidencebasedveterinaryacupuncture.com/"
      },
      {
        credential: "CVA (CuraCore)",
        title: "Medical Acupuncture",
        organisation: "CuraCore (Colorado State University-linked faculty)",
        country: "USA \u2014 global intake",
        format: "Online + hands-on labs + case logs + exam",
        notes: "Science-based medical acupuncture programme, formerly the CSU/Narda Robinson course. Distinct from TCVM-oriented providers.",
        url: "https://curacore.org/vet/"
      },
      {
        credential: "CVCH",
        title: "Chinese Herbal Medicine",
        organisation: "Chi University",
        country: "USA \u2014 global intake",
        format: "Modular online + on-site + exams",
        notes: "Certified Veterinary Chinese Herbalist. TCVM herbal therapy credential from Chi University.",
        url: "https://chiu.edu/"
      },
      {
        credential: "CVTP",
        title: "Tui-na (Veterinary Manual Therapy)",
        organisation: "Chi University",
        country: "USA \u2014 global intake",
        format: "Modular courses + assessment",
        notes: "Certified in Veterinary Tui-na — the TCVM manual therapy modality.",
        url: "https://chiu.edu/"
      },
      {
        credential: "CVFT",
        title: "Food Therapy",
        organisation: "Chi University",
        country: "USA \u2014 global intake",
        format: "Modular courses + assessment",
        notes: "Certified Veterinary Food Therapist. TCVM nutritional therapy credential.",
        url: "https://chiu.edu/"
      }
    ]
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
        country: "USA & Canada \u2014 global",
        format: "Credential application + evidence of training/CE + skills assessment + exam",
        notes: "Certified Veterinary Pain Practitioner. Available separately to vets and to licensed vet techs. A widely recognised pain-management middle-tier credential.",
        url: "https://www.ivapm.org/"
      },
      {
        credential: "CVSMT",
        title: "Spinal Manipulation",
        organisation: "Healing Oasis Wellness Center / College of Animal Chiropractors",
        country: "USA \u2014 global intake",
        format: "Intensive modular course + exams",
        notes: "Certified Veterinary Spinal Manipulative Therapist. Animal chiropractic / spinal manipulation credential for vets.",
        url: "https://www.healingoasis.edu/"
      },
      {
        credential: "AVCA cert",
        title: "Animal Chiropractic",
        organisation: "American Veterinary Chiropractic Association (AVCA)",
        country: "USA & Canada",
        format: "AVCA-accredited programme + certification exam",
        notes: "Certifies vets and chiropractors in animal chiropractic technique. Recognised post-nominal in integrative veterinary practice.",
        url: "https://www.animalchiropractic.org/"
      },
      {
        credential: "CVMMP",
        title: "Medical Manipulation",
        organisation: "Chi University",
        country: "USA",
        format: "Modular course + assessment",
        notes: "Certified Veterinary Medical Manipulation Practitioner. Integrative manual-therapy credential.",
        url: "https://chiu.edu/"
      },
      {
        credential: "CHPV",
        title: "Hospice & Palliative Care",
        organisation: "International Association for Animal Hospice & Palliative Care (IAAHPC)",
        country: "USA & Canada \u2014 global",
        format: "Online programme + assessment",
        notes: "Certified Hospice & Palliative Care Veterinarian. End-of-life care credential with growing recognition.",
        url: "https://www.iaahpc.org/"
      },
      {
        credential: "CVBM",
        title: "Botanical Medicine",
        organisation: "CIVT / veterinary botanical medicine bodies",
        country: "USA \u2014 global intake",
        format: "Online modular programme + assessment",
        notes: "Certified Veterinary Botanical Medicine practitioner. Western botanical / herbal medicine credential.",
        url: "https://civtedu.org/"
      }
    ]
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
        country: "USA \u2014 open to Canada",
        format: "Online modular + ISVPS assessment",
        notes: "Certificate-tier dentistry route. The AVDC Diplomate (specialist tier) is a separate, higher qualification and is not included here.",
        url: "https://improveinternational.com/us/"
      },
      {
        credential: "Certificate",
        title: "Nutrition Case Management",
        organisation: "University of Tennessee",
        country: "USA \u2014 global intake",
        format: "Online structured certificate programme",
        notes: "University CE certificate in clinical nutrition case management. Structured with formal completion rather than a simple attendance record.",
        url: "https://vetce.tennessee.edu/"
      },
      {
        credential: "Certificate",
        title: "Companion Animal Pain Management",
        organisation: "University of Tennessee",
        country: "USA \u2014 global intake",
        format: "Online structured certificate programme",
        notes: "University-run pain management certificate track. Complements the CVPP credential pathway.",
        url: "https://vetce.tennessee.edu/"
      },
      {
        credential: "Graduate Certificate",
        title: "Shelter Medicine",
        organisation: "University of Florida (Maddie\u2019s Shelter Medicine Program)",
        country: "USA \u2014 online, global",
        format: "Online credit-bearing graduate certificate; can ladder to MS degree",
        notes: "University graduate certificate — sits below the ABVP Shelter Medicine Diplomate tier. One of three UF online graduate certificates in specialist niches.",
        url: "https://sheltermedicine.vetmed.ufl.edu/"
      },
      {
        credential: "Graduate Certificate",
        title: "Aquatic Animal Health",
        organisation: "University of Florida",
        country: "USA \u2014 online, global",
        format: "Online credit-bearing graduate certificate",
        notes: "University graduate certificate for vets developing an interest in fish and aquatic species medicine.",
        url: "https://aquatic.vetmed.ufl.edu/"
      },
      {
        credential: "Graduate Certificate",
        title: "Veterinary Forensic Sciences",
        organisation: "University of Florida",
        country: "USA \u2014 online, global",
        format: "Online credit-bearing graduate certificate",
        notes: "A recognised niche credential in veterinary forensics. Credit-bearing and stackable toward postgraduate study.",
        url: "https://forensics.vetmed.ufl.edu/"
      }
    ]
  }
];

// Flat count for nav card
const usaTotalCount = usaCertCategories.reduce((acc, cat) => acc + cat.programs.length, 0);

const ProgramCard = ({ id, credential, title, organisation, country, format, notes, url }) => (
  <div id={id} className="bg-white rounded-xl border border-gray-100 p-6 hover:border-blue-200 hover:shadow-sm transition-colors flex flex-col scroll-mt-28">
    <div className="mb-3">
      <span className="inline-block px-2.5 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold tracking-wide">
        {credential}
      </span>
    </div>
    <h3 className="text-base font-semibold text-gray-900 mb-1 leading-snug">{title}</h3>
    <p className="text-sm text-blue-600 font-medium mb-1">{organisation}</p>
    <p className="text-xs text-gray-400 mb-3">{country}</p>
    <p className="text-xs text-gray-600 leading-relaxed mb-2">{format}</p>
    {notes && <p className="text-xs text-gray-500 italic leading-relaxed mb-4">{notes}</p>}
    <div className="mt-auto pt-2">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
      >
        Visit Programme
        <svg className="ml-2 w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </a>
    </div>
  </div>
);

const PostgraduateCertificates = () => {
  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Postgraduate Certificates for Vets | VetNextStep</title>
        <meta name="description" content="RCVS CertAVP programmes in the UK, plus North American middle-tier credentials — ISVPS GPCert, rehabilitation (CCRP/CCRT), acupuncture (CVA), pain management (CVPP), and university graduate certificates." />
        <link rel="canonical" href="https://vetnextstep.com/postgraduate-certificates" />
        <meta property="og:title" content="Postgraduate Certificates for Vets | VetNextStep" />
        <meta property="og:description" content="Postgraduate certificate pathways for vets in the UK and North America — from RCVS CertAVP to rehabilitation, acupuncture, and university graduate certificates." />
        <meta property="og:url" content="https://vetnextstep.com/postgraduate-certificates" />
        <meta property="og:type" content="website" />
      </Helmet>
      <SharedHeader />

      <main className="py-8 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Page title */}
          <div className="text-center mb-12">
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">Postgraduate Certificates</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Certificate-tier qualifications for vets looking to develop a clinical interest — below specialist Diplomate level, above standard CPD. UK and North America covered.
            </p>
          </div>

          {/* Country nav cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-16">
            {countryConfig.map((country) => {
              const count = country.id === "uk" ? ukPrograms.length : country.id === "usa" ? usaTotalCount : 0;
              return (
                <a key={country.id} href={`#${country.id}`} className="group block">
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-blue-300 hover:shadow-sm transition-colors">
                    <div className="h-40 relative overflow-hidden">
                      <img src={country.image} alt={country.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                      <div className="absolute bottom-3 left-4 text-white">
                        <h2 className="text-lg font-bold">{country.name}</h2>
                      </div>
                    </div>
                    <div className="px-4 py-3 flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {count > 0 ? `${count} programme${count !== 1 ? "s" : ""}` : "Coming soon"}
                      </span>
                      <span className="text-blue-600 text-sm font-medium group-hover:translate-x-1 transition-transform inline-flex items-center">
                        View
                        <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>

          {/* ——— UK ——— */}
          <section id="uk" className="mb-20 scroll-mt-28">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
              <span className="text-3xl">\uD83C\uDDEC\uD83C\uDDE7</span>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">United Kingdom</h2>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-8">
              <h3 className="text-base font-semibold text-blue-900 mb-1">About the RCVS CertAVP</h3>
              <p className="text-sm text-blue-800 mb-3">
                The Certificate in Advanced Veterinary Practice (CertAVP) is an RCVS-accredited qualification allowing veterinarians to demonstrate advanced knowledge and skills in a chosen subject area. It is offered by multiple UK universities and is a recognised pathway to fellowship. RCVS registration is a prerequisite — <Link to="/uk" className="text-blue-700 hover:underline font-medium">see the UK licensing guide</Link> if you're working towards registration.
              </p>
              <a
                href="https://www.rcvs.org.uk/lifelong-learning/postgraduate-qualifications/certificate-in-advanced-veterinary-practice-certavp/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-700 hover:text-blue-900 text-sm font-medium"
              >
                Learn more at RCVS
                <svg className="ml-1 w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ukPrograms.map((program, index) => (
                <div key={index} id={slugify(program.title)} className="bg-white rounded-xl border border-gray-100 p-6 hover:border-blue-200 hover:shadow-sm transition-colors flex flex-col scroll-mt-28">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{program.title}</h3>
                  <p className="text-sm text-blue-600 font-medium mb-3">{program.organisation}</p>
                  <p className="text-gray-600 text-sm leading-relaxed mb-5">{program.description}</p>
                  <div className="mt-auto">
                    <a
                      href={program.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                    >
                      Visit Programme
                      <svg className="ml-2 w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ——— USA ——— */}
          <section id="usa" className="mb-20 scroll-mt-28">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">United States</h2>
            </div>

            <p className="text-sm text-gray-500 mb-8">
              Most programmes below require you to hold a valid US (or provincial Canadian) veterinary licence before enrolling.{" "}
              <Link to="/usa" className="text-blue-600 hover:text-blue-800 font-medium">See the USA licensing guide →</Link>
            </p>

            {usaCertCategories.map((category) => (
              <div key={category.id} className="mb-12">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{category.name}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{category.description}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {category.programs.map((program, idx) => (
                    <ProgramCard key={idx} id={slugify(program.title)} {...program} />
                  ))}
                </div>
              </div>
            ))}
          </section>

          {/* ——— Canada ——— */}
          <section id="canada" className="mb-20 scroll-mt-28">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
              <span className="text-3xl">\uD83C\uDDE8\uD83C\uDDE6</span>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Canada</h2>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-8">
              <h3 className="text-base font-semibold text-blue-900 mb-2">Most USA credentials are open to Canadian vets</h3>
              <p className="text-sm text-blue-800 leading-relaxed mb-3">
                The majority of the North American middle-tier credentials listed above — including ISVPS GPCert/PgC, CCRP, CCRT, CVPP (IVAPM), and IVAS CVA — are available to Canadian veterinarians. The "Country" field on each card above indicates availability.
              </p>
              <p className="text-sm text-blue-800 leading-relaxed">
                Canada-specific postgraduate certificate programmes (through provincial veterinary colleges and CVMA) will be added to this section when confirmed.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
              <p className="text-gray-500 mb-4">Canada-specific programmes coming soon. In the meantime, see the USA section above.</p>
              <Link to="/canada" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm">
                View full Canada career guide
                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </section>

          {/* ——— Australia ——— */}
          <section id="australia" className="mb-16 scroll-mt-28">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
              <span className="text-3xl">\uD83C\uDDE6\uD83C\uDDFA</span>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Australia</h2>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
              <p className="text-gray-500 mb-4">Postgraduate certificate programmes for Australia will be added here soon.</p>
              <Link to="/australia" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm">
                View full Australia career guide
                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
};

export default PostgraduateCertificates;
