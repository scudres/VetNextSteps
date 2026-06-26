import React from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import SharedHeader from "./SharedHeader";
import SharedFooter from "./SharedFooter";
import { slugify } from "../utils";

const countryConfig = [
  {
    id: "australia",
    name: "Australia",
    flag: "🇦🇺",
    image: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=600&q=80"
  },
  {
    id: "canada",
    name: "Canada",
    flag: "🇨🇦",
    image: "https://images.pexels.com/photos/11862814/pexels-photo-11862814.jpeg?auto=compress&cs=tinysrgb&w=600"
  },
  {
    id: "uk",
    name: "United Kingdom",
    flag: "🇬🇧",
    image: "https://images.pexels.com/photos/30721230/pexels-photo-30721230.jpeg?auto=compress&cs=tinysrgb&w=600"
  },
  {
    id: "usa",
    name: "United States",
    flag: "🇺🇸",
    image: "https://images.pexels.com/photos/16156721/pexels-photo-16156721.jpeg?auto=compress&cs=tinysrgb&w=600"
  }
];

const programs = {
  uk: [
    {
      title: "CVS Veterinary Group Graduate Programme",
      organisation: "CVS Group",
      description: "Comprehensive graduate development programme with mentorship and structured learning across CVS's nationwide network of practices.",
      url: "https://careers.cvsvets.com/Graduates"
    },
    {
      title: "IVC Evidensia Graduate Academy",
      organisation: "IVC Evidensia",
      description: "Graduate academy offering structured learning, mentoring, and career development opportunities across IVC Evidensia's European and UK practices.",
      url: "https://ivcevidensia.co.uk/graduate-academy"
    },
    {
      title: "Linnaeus Veterinary Graduate Development Programme",
      organisation: "Linnaeus Group",
      description: "18-month structured programme with clinical rotations, mentoring, and professional development across Linnaeus's specialist and primary care hospitals.",
      url: "https://www.linnaeusgroup.co.uk/careers/graduates-students-and-apprenticeships/veterinary-graduate-development-programme-at-linnaeus"
    },
    {
      title: "Medivet Early Careers Programme",
      organisation: "Medivet",
      description: "Comprehensive early career development with mentoring and structured learning pathways, supporting new graduates through their first years in practice.",
      url: "https://careers.medivet.co.uk/early-careers"
    },
    {
      title: "Vets4Pets Graduate Programme",
      organisation: "Vets4Pets",
      description: "Graduate programme focusing on primary care development with ongoing clinical support, mentoring, and structured learning opportunities.",
      url: "https://www.vets4petscareers.com/our-graduate-programme/"
    },
    {
      title: "VetPartners Graduate Programme",
      organisation: "VetPartners",
      description: "Structured graduate programme with dedicated clinical mentoring and professional development opportunities across VetPartners's diverse practice network.",
      url: "https://www.vetpartners.co.uk/your-career/graduates/"
    }
  ],
  usa: [
    {
      title: "VCA Academy Mentorship Program",
      organisation: "VCA Animal Hospitals (Mars Veterinary Health)",
      description: "6-month structured GP mentorship with tailored tracks for surgery, dentistry, and medical appointments. Includes one-on-one local mentorship, weekly progress tracking, a dedicated ER track with hands-on skills workshop, $3,000 CE stipend, and no negative accrual ProSal. Available USA & Canada.",
      url: "https://www.vcacareers.com/global/en/new-grads"
    },
    {
      title: "Banfield Veterinary Emerging Leader Program",
      organisation: "Banfield Pet Hospital (Mars Veterinary Health)",
      description: "12-month GP programme with a dedicated in-hospital coach, multi-phase onboarding that scales appointments gradually, no-negative-accrual ProSal, and leadership development pathways. First year emphasises learning over production.",
      url: "https://www.banfield.com/careers"
    },
    {
      title: "BluePearl EmERge Training Program",
      organisation: "BluePearl Specialty + Emergency (Mars Veterinary Health)",
      description: "One-year ECC training programme for new graduates comprising 16 weeks bootcamp (including 4 weeks at Tampa), 20 weeks mentored immersion, and 16 weeks experiential. Salary rises from $30k to $60k to $100k then market rate. Followed by a two-year work commitment.",
      url: "https://careers.bluepearlvet.com/us/en/emerge-program"
    },
    {
      title: "VEG NERD Program (New ER Doctor)",
      organisation: "Veterinary Emergency Group (VEG)",
      description: "Immersive 6-month ECC programme for new graduates featuring travel-based surgical and procedural wet labs, full-time shifts with senior mentors, weekly didactic rounds, and approximately 160 RACE CE hours. Full salary and benefits from day one. Four cohorts per year.",
      url: "https://www.veterinaryemergencygroup.com/meet-our-teams/early-career"
    },
    {
      title: "ER Immerse Program",
      organisation: "Ethos Veterinary Health",
      description: "6-month ECC mentorship programme with in-hospital support from ER clinicians and ECC specialists, competency-based curriculum via VetBloom, and weekly virtual didactic rounds and Grand Rounds. Open to new graduates and those new to emergency practice.",
      url: "https://www.ethosvet.com/er-immerse/"
    },
    {
      title: "NVA General Practice Mentorship Program",
      organisation: "National Veterinary Associates (NVA)",
      description: "Up to 12-month GP programme with a designated in-clinic mentor, quarterly regional check-ins, peer case reviews, $5,000 CE budget, surgical skills review, and no negative accrual. Available USA & Canada.",
      url: "https://gp.nva.com/why-join-nva/growth/mentorship"
    },
    {
      title: "Vetcor New Graduate Support Program",
      organisation: "Vetcor",
      description: "12-month GP and mixed programme with one-on-one in-hospital mentorship, twice-monthly virtual roundtables, VetLife collaboration circles, and skill-building days. Mentors complete Vetcor Mentorship Certification. Available USA & Canada.",
      url: "https://www.vetcor.com/careers/mentorship"
    },
    {
      title: "Harbor GO Career Journey",
      organisation: "Suveto / Harbor.vet Network",
      description: "Self-guided 12–24 month non-contract framework covering clinical excellence (surgery and dentistry wet labs), business fluency, financial literacy, and co-ownership pathways. Confirm current programme details on site.",
      url: "https://harbor.vet/"
    },
    {
      title: "MVP MBark Graduate Mentorship Program",
      organisation: "Mission Pet Health (formerly Mission Veterinary Partners)",
      description: "12-month GP programme where mentors complete MBark Clinical Mentor Certification. Includes structured progression phases and custom dentistry labs. Note: MVP merged with SVP to form Mission Pet Health in 2025; programme continues.",
      url: "https://missionvetpartners.com/"
    },
    {
      title: "SVP Doctor Mentorship Program",
      organisation: "Mission Pet Health (formerly Southern Veterinary Partners)",
      description: "12-month GP programme with a paired on-site coach and clinical mentor, Lead DVM Foundations training, and 50+ hours of RACE-approved CE covering dentistry, oncology, and internal medicine across 850+ hospitals. Note: SVP merged with MVP to form Mission Pet Health in 2025.",
      url: "https://amazingtogether.svp.vet/dvm-benefits-and-programs/"
    },
    {
      title: "RISE DVM / VMD Mentorship Program",
      organisation: "PetVet Care Centers",
      description: "12-month immersive programme with dual mentorship (local on-site mentor and national programme guide), tailored caseload ramp-up, national peer cohort, and up to $50,000 in new-grad incentives. Dedicated ECC and mixed animal sub-tracks available by location.",
      url: "https://www.petvetcarecenters.com/site/new-dvm-graduate-veterinary-careers"
    },
    {
      title: "Thrive Doctor Mentorship Program",
      organisation: "Thrive Pet Healthcare",
      description: "12-month GP, urgent care, and specialty programme with structured milestone curriculum for clinical reasoning and client management, wellbeing support via Lyra, Thrive U learning modules, and both a Regional Doctor Mentor and on-site mentor. A separate one-year ER training track is also available.",
      url: "https://careers.thrivepetcare.com/pages/doctor-mentorship-program"
    },
    {
      title: "Emergency Clinician Mentorship Program (ECMP)",
      organisation: "MedVet",
      description: "6–12 month immersive ECC programme with 1:1 mentorship in a high-volume ER, focused on expanding diagnostic and therapeutic capability and advanced communication skills. Designed to transition new graduates to standalone emergency clinicians.",
      url: "https://www.medvet.com/careers/"
    },
    {
      title: "ACCESS Accelerated Training (AAT)",
      organisation: "ACCESS Specialty Animal Hospitals (Thrive Network)",
      description: "One-year ECC training programme with a two-year work commitment, progressing through foundation and specialist didactics, mentored hands-on work with criticalists, and independent case flow. Based in South Florida.",
      url: "https://accessanimalhospital.com/"
    },
    {
      title: "AmeriVet Doctor Mentorship Program",
      organisation: "AmeriVet Veterinary Partners",
      description: "12-month GP and urgent care programme with a paired 1:1 on-site mentor, monthly virtual cohort conversation circles with guest speakers, a clinical Hot Topics series, and wellness resources.",
      url: "https://www.amerivet.com/"
    },
    {
      title: "Heartland New Graduate Onboarding & Mentorship",
      organisation: "Heartland Veterinary Partners",
      description: "12-month GP programme with a tailored caseload ramp-up schedule, structured procedural checklists covering spays, neuters, and dentistry, and a designated in-hospital DVM mentor.",
      url: "https://www.heartlandvetpartners.com/"
    },
    {
      title: "Rarebreed Early Career Mentorship",
      organisation: "Rarebreed Veterinary Partners",
      description: "12-month GP and urgent care programme offering clinical autonomy alongside structured mentor support, access to the Rarebreed Learning Lab platform, and integrated mental-health resources.",
      url: "https://www.rarebreedvet.com/"
    },
    {
      title: "Alliance Academy Mentors Program",
      organisation: "Alliance Animal Health",
      description: "12-month GP and urgent care programme with dual-tier mentoring (tenured local DVM and junior mentor), guidebook tracking, client-communication roleplay, board-certified dentistry and surgery wet labs, and monthly compassion-fatigue sessions.",
      url: "https://www.allianceanimal.com/"
    },
    {
      title: "Affinity Veterinary Academy Graduate Transition Program",
      organisation: "CityVet",
      description: "12-month GP and urgent care programme via the Affinity Veterinary Academy covering clinical, soft-skill, and leadership CE, abdominal ultrasound training, zero negative-accrual ProSal, and equity-partnership pathways.",
      url: "https://www.cityvet.com/"
    },
    {
      title: "CVP Doctor Mentorship Framework",
      organisation: "Community Veterinary Partners (CVP)",
      description: "12-month programme across GP, exotics, and equine practices, scaling from student colleague onboarding into custom medical-autonomy mentorship with structured ProSal and monthly resets.",
      url: "https://www.communityvetpartners.com/"
    },
    {
      title: "Innovetive University One-Year Mentor Program",
      organisation: "Innovetive Petcare",
      description: "12-month programme via Innovetive University combining in-clinic modules with third-party clinical training, Global FAST ultrasound certification, and small-animal dentistry tracks. Covers GP, emergency, exotics, and mixed practice.",
      url: "https://www.innovetivepetcare.com/"
    },
    {
      title: "Destination Pet New Graduate Mentorship Framework",
      organisation: "Destination Pet",
      description: "12-month GP and urgent care programme with a whole-health multi-site framework, local clinical autonomy, $3,000–$5,000 CE allowance, technical skill check-offs, and student-to-doctor career pathways.",
      url: "https://destinationpet.com/"
    },
    {
      title: "VPP New Graduate Mentorship Framework",
      organisation: "Veterinary Practice Partners (VPP)",
      description: "12-month GP programme maintaining local practice identity while providing network CE access, personal mentorship blueprints, and soft-skills development modules.",
      url: "https://www.vetpartners.com/"
    },
    {
      title: "Ready, Vet, Go Mentorship Integration Program",
      organisation: "Ready, Vet, Go",
      description: "6-month structured curriculum with a one-year community membership, embedding graduate training modules into independent and private practices. Includes weekly online training, monthly remote small-group coaching, and a peer community. Available USA & Canada.",
      url: "https://readyvetgo.co/"
    },
    {
      title: "United Veterinary Care New Graduate Mentorship",
      organisation: "United Veterinary Care (UVC)",
      description: "Dedicated GP mentorship programme for new graduates entering clinical practice. Confirm current duration and cohort details directly with UVC.",
      url: "https://unitedveterinarycare.com/new-graduate-veterinarian-mentorship/"
    },
    {
      title: "Vetco Total Care PACKS Early Career Mentorship",
      organisation: "Petco / Vetco Total Care",
      description: "Personalised GP mentor-doctor pairing with a co-created development plan. Mentors complete a 6-month mentor training programme. Includes Merck-sponsored MentorVet Lift membership.",
      url: "https://careers.petco.com/vtc-packs-early-career"
    },
    {
      title: "Mentoring@AVMA",
      organisation: "American Veterinary Medical Association",
      description: "6-month structured virtual mentoring programme pairing early-career vets with trained mentors outside their own workplace, with optional extension. Not employer-hosted — an independent resource available to any US graduate.",
      url: "https://www.avma.org/education/veterinary-careers/mentoring-early-career-veterinarians"
    },
    {
      title: "MentorVet Leap",
      organisation: "MentorVet",
      description: "Evidence-based approximately 6-month transition-to-practice programme with cohort learning, 1:1 coaching, and a wellbeing curriculum. Research shows improved outcomes for stress and burnout. Sometimes employer- or AVMA-sponsored.",
      url: "https://www.mentorvet.net/"
    }
  ],
  canada: [
    {
      title: "VetStrategy New Grad Mentorship Program",
      organisation: "VetStrategy (IVC Evidensia family)",
      description: "12-month framework adapted from IVC Evidensia's European Graduate Academy, with regional mentor pairings, procedural progression logs, CE camps, and an optional 8-week structured teaching-hospital placement. Canada's largest veterinary group. Limited spaces; open to relocators.",
      url: "https://www.vetstrategy.com/careers/dvm-mentorship-program/"
    },
    {
      title: "P3 Veterinary Partners Mentorship Program",
      organisation: "P3 Veterinary Partners",
      description: "Goals-based GP mentorship with targeted individual and group CE including virtual learning, 1:1 sessions, wet labs, and courses. Confirm current duration and cohort details with P3.",
      url: "https://www.p3vetpartners.ca/the-p3-connection/mentorship-program"
    },
    {
      title: "VIRMP Rotating Internship (Canada)",
      organisation: "Veterinary Internship & Residency Matching Program",
      description: "One-year rotating internships at Canadian veterinary teaching hospitals, including Ontario Veterinary College (OVC) and Western College of Veterinary Medicine (WCVM).",
      url: "https://www.virmp.org/"
    }
  ],
  australia: [
    {
      title: "Greencross Vets Graduate Vet Program",
      organisation: "Greencross Vets",
      description: "Structured graduate programme with dedicated mentorship, ongoing clinical education, and professional development for new veterinary graduates across Australia.",
      url: "https://www.greencrossvets.com.au/careers/"
    },
    {
      title: "Apiam Animal Health Graduate Program",
      organisation: "Apiam Animal Health",
      description: "Graduate development programme focused on rural, regional, and production animal practice, offering mentored placements and career support across regional Australia.",
      url: "https://www.apiam.com.au/apiam-careers/graduate-opportunities/"
    },
    {
      title: "AVA Mentoring Program",
      organisation: "Australian Veterinary Association",
      description: "The AVA connects new graduate veterinarians with experienced mentors for professional guidance, clinical support, and career development across all veterinary disciplines.",
      url: "https://www.ava.com.au/membership/member-benefits/mentoring/"
    }
  ]
};

const licensingNote = {
  uk: (
    <p className="text-sm text-gray-500 mb-6">
      Coming from overseas? You'll also need RCVS registration and a Skilled Worker Visa.{" "}
      <Link to="/uk" className="text-blue-600 hover:text-blue-800 font-medium">See the UK licensing guide →</Link>
    </p>
  ),
  usa: (
    <p className="text-sm text-gray-500 mb-6">
      Practising in the USA requires NAVLE and state licensing before joining any programme.{" "}
      <Link to="/usa" className="text-blue-600 hover:text-blue-800 font-medium">See the USA licensing guide →</Link>
    </p>
  ),
  canada: (
    <p className="text-sm text-gray-500 mb-6">
      Canadian licensing is managed province by province and requires the NAVLE.{" "}
      <Link to="/canada" className="text-blue-600 hover:text-blue-800 font-medium">See the Canada licensing guide →</Link>
    </p>
  ),
  australia: (
    <p className="text-sm text-gray-500 mb-6">
      Working in Australia requires AVA registration and state-level board approval.{" "}
      <Link to="/australia" className="text-blue-600 hover:text-blue-800 font-medium">See the Australia licensing guide →</Link>
    </p>
  ),
};

const TrainingPrograms = () => {
  const { country } = useParams();

  // ——— Sub-page: single country ———
  if (country) {
    const cfg = countryConfig.find(c => c.id === country);
    const countryPrograms = programs[country] || [];

    if (!cfg) {
      return (
        <div className="min-h-screen bg-white">
          <SharedHeader />
          <main className="py-16 text-center">
            <p className="text-gray-500 mb-4">Country not found.</p>
            <Link to="/training-programs" className="text-blue-600 hover:text-blue-800 font-medium">← Back to all programmes</Link>
          </main>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-white">
        <Helmet>
          <title>{cfg.name} Graduate Development Programmes | VetNextStep</title>
          <meta name="description" content={`Graduate development programmes for new veterinary graduates in ${cfg.name}.`} />
          <link rel="canonical" href={`https://vetnextstep.com/training-programs/${country}`} />
        </Helmet>
        <SharedHeader />

        <main className="py-8 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Breadcrumb */}
            <div className="mb-8">
              <Link to="/training-programs" className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                All Graduate Development Programmes
              </Link>
            </div>

            {/* Section header */}
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
              <span className="text-3xl">{cfg.flag}</span>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{cfg.name}</h1>
              <span className="ml-auto text-sm text-gray-400">{countryPrograms.length} programme{countryPrograms.length !== 1 ? "s" : ""}</span>
            </div>

            {licensingNote[country]}

            {/* Programme cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {countryPrograms.map((program, index) => (
                <div key={index} id={slugify(program.title)} className="bg-white rounded-xl border border-gray-100 p-6 hover:border-blue-200 hover:shadow-sm transition-colors scroll-mt-28">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{program.title}</h3>
                  <p className="text-sm text-blue-600 font-medium mb-3">{program.organisation}</p>
                  <p className="text-gray-600 text-sm leading-relaxed mb-5">{program.description}</p>
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
              ))}
            </div>

          </div>
        </main>
      </div>
    );
  }

  // ——— Hub page ———
  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Graduate Development Programmes | VetNextStep</title>
        <meta name="description" content="Find structured graduate development programmes for new veterinary graduates in the UK, USA, Canada, and Australia — including CVS, IVC Evidensia, Linnaeus, Medivet, Banfield, and more." />
        <link rel="canonical" href="https://vetnextstep.com/training-programs" />
        <meta property="og:title" content="Graduate Development Programmes | VetNextStep" />
        <meta property="og:description" content="Structured graduate development programmes with mentorship and clinical training for new veterinary graduates across the UK, USA, Canada, and Australia." />
        <meta property="og:url" content="https://vetnextstep.com/training-programs" />
        <meta property="og:type" content="website" />
      </Helmet>
      <SharedHeader />

      <main className="py-8 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-12">
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">Graduate Development Programmes</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Graduate development programmes with structured mentorship and clinical support — from the major corporate groups in the UK to hospital-based programmes in North America and Australia.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {countryConfig.map((c) => (
              <Link key={c.id} to={`/training-programs/${c.id}`} className="group block">
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-blue-300 hover:shadow-md transition-all">
                  <div className="h-48 relative overflow-hidden">
                    <img src={c.image} alt={c.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>
                    <div className="absolute bottom-3 left-4 text-white">
                      <div className="text-2xl mb-1">{c.flag}</div>
                      <h2 className="text-lg font-bold leading-tight">{c.name}</h2>
                    </div>
                  </div>
                  <div className="px-4 py-3 flex items-center justify-between bg-white">
                    <span className="text-sm text-gray-500">{programs[c.id].length} programme{programs[c.id].length !== 1 ? "s" : ""}</span>
                    <span className="text-blue-600 text-sm font-medium group-hover:translate-x-1 transition-transform inline-flex items-center">
                      View all
                      <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </main>
      <SharedFooter />
    </div>
  );
};

export default TrainingPrograms;
