import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import SharedHeader from "./SharedHeader";
import SharedFooter from "./SharedFooter";
import FilterDropdown from "./FilterDropdown";
import { slugify } from "../utils";

const regionConfig = [
  {
    id: "europe",
    name: "Europe",
    flag: "🇪🇺",
    image: "https://images.pexels.com/photos/9494908/pexels-photo-9494908.jpeg?auto=compress&cs=tinysrgb&w=600"
  },
  {
    id: "north-america",
    name: "North America",
    flag: "🌎",
    image: "https://images.pexels.com/photos/16156721/pexels-photo-16156721.jpeg?auto=compress&cs=tinysrgb&w=600"
  },
  {
    id: "uk",
    name: "United Kingdom",
    flag: "🇬🇧",
    image: "https://images.pexels.com/photos/30721230/pexels-photo-30721230.jpeg?auto=compress&cs=tinysrgb&w=600"
  },
  {
    id: "worldwide",
    name: "Worldwide",
    flag: "🌍",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80"
  },
];

// Intermediate three-tile configuration for regions that split into sub-categories.
// All images from Pexels — free for commercial use, no attribution required.
// Selected to reflect the diversity of the veterinary profession (majority female; varied backgrounds).
const subCategoryConfig = {
  europe: [
    {
      id: "college",
      name: "EBVS Specialist Colleges",
      description: "Residency programmes administered by European Board of Veterinary Specialisation (EBVS) member colleges — the recognised route to European diplomate status.",
      emoji: "🎓",
      // Pexels #33674900 — professional portrait of Black woman in scrubs (Enson)
      image: "https://images.pexels.com/photos/33674900/pexels-photo-33674900.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      id: "university",
      name: "University Teaching Hospitals",
      description: "Rotating internships and residency positions at European veterinary faculties and their accredited teaching hospitals.",
      emoji: "🏫",
      // Pexels #7469274 — diverse clinical team (two women + vet) caring for a dog (Mikhail Nilov)
      image: "https://images.pexels.com/photos/7469274/pexels-photo-7469274.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      id: "corporate",
      name: "Corporate Groups & Employers",
      description: "Internships, residencies, and graduate programmes at pan-European corporate veterinary groups and specialist employers.",
      emoji: "🏥",
      // Pexels #6234610 — Black female clinical assistant + vet performing ultrasound on dog (Tima Miroshnichenko)
      image: "https://images.pexels.com/photos/6234610/pexels-photo-6234610.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
  ],
  uk: [
    {
      id: "college",
      name: "EBVS Specialist Colleges",
      description: "Residency programmes at UK training centres affiliated with European Board of Veterinary Specialisation (EBVS) colleges — the recognised route to European diplomate status.",
      emoji: "🎓",
      // Pexels #33674900 — professional portrait of Black woman in scrubs (Enson)
      image: "https://images.pexels.com/photos/33674900/pexels-photo-33674900.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      id: "university",
      name: "University Teaching Hospitals",
      description: "Rotating internships and specialist residency programmes at UK veterinary schools and their accredited teaching hospitals.",
      emoji: "🏫",
      // Pexels #7469274 — diverse clinical team (two women + vet) caring for a dog (Mikhail Nilov)
      image: "https://images.pexels.com/photos/7469274/pexels-photo-7469274.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      id: "corporate",
      name: "Corporate Groups & Referral Centres",
      description: "Internships and residency programmes at the UK's leading corporate veterinary groups and private specialist referral hospitals.",
      emoji: "🏥",
      // Pexels #6234610 — Black female clinical assistant + vet performing ultrasound on dog (Tima Miroshnichenko)
      image: "https://images.pexels.com/photos/6234610/pexels-photo-6234610.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
  ],
};

// Derive sub-category from programme metadata — avoids adding a field to every entry
const getSubCategory = (program) => {
  if (program.region === "europe") {
    if (
      program.organisation.startsWith("European College") ||
      program.organisation.startsWith("European Board") ||
      program.organisation.startsWith("European Veterinary")
    ) return "college";
    // Veterinary faculties and teaching hospitals
    if (
      program.organisation.includes("Universit") ||   // University / Università / Universidade / Universitario
      program.organisation.includes("Hochschule") ||  // TiHo Hannover
      program.organisation.includes("École") ||       // ENVA Alfort
      program.organisation.includes("Hospital Clín") || // UAB / UCM (Clínic / Clínico)
      program.organisation.includes("UCD") ||         // University College Dublin
      program.organisation.includes("Faculdade") ||   // Lisbon FMV
      program.organisation.includes("Ospedale")       // Bologna
    ) return "university";
    // Corporate groups and aggregators (AniCura, IVC Evidensia, European Commission/EURAXESS)
    return "corporate";
  }
  if (program.region === "uk") {
    if (
      program.organisation.startsWith("European College") ||
      program.organisation.startsWith("European Board") ||
      program.organisation.startsWith("European Veterinary")
    ) return "college";
    if (
      program.organisation.includes("University of") ||
      program.organisation.startsWith("Royal Veterinary College")
    ) return "university";
    return "corporate";
  }
  return null;
};

// Specialties relevant to internships & residencies
const SPECIALTY_OPTIONS = [
  "Anaesthesia",
  "Aquatic Medicine",
  "Behaviour & Welfare",
  "Cardiology",
  "Dentistry",
  "Dermatology",
  "Emergency & Critical Care",
  "Endocrinology",
  "Equine",
  "Farm Animal",
  "Imaging",
  "Internal Medicine",
  "Laboratory Animal Medicine",
  "Microbiology",
  "Neurology",
  "Nutrition",
  "Oncology",
  "Ophthalmology",
  "Parasitology",
  "Pathology",
  "Pharmacology & Toxicology",
  "Public Health",
  "Reproduction",
  "Sports Medicine & Rehabilitation",
  "Surgery",
  "Zoological Medicine",
];

const programs = [
  {
    title: "VIRMP - Veterinary Internship and Residency Matching Program",
    organisation: "Veterinary Internship & Residency Matching Program",
    description: "Central matching service for veterinary internships and residencies in North America.",
    url: "https://www.virmp.org/",
    region: "north-america",
    type: "internship",
    species: "small animal, equine, farm animal",
    internshipType: "both",
    specialties: [],
  },
  {
    title: "Royal Veterinary College Rotating Internship Programme",
    organisation: "Royal Veterinary College",
    description: "Designed for highly motivated recent veterinary graduates who wish to expand their clinical knowledge, skills and experience in all aspects of small animal practice, working under supervision in a multidisciplinary referral hospital.",
    url: "https://www.rvc.ac.uk/study/postgraduate/internships/small-animal",
    region: "uk",
    type: "internship",
    species: "small animal",
    internshipType: "rotating",
    specialties: [],
  },
  {
    title: "Royal Veterinary College Small Animal Residency Programmes",
    organisation: "Royal Veterinary College",
    description: "Designed for qualified veterinary graduates who wish to specialise in specific disciplines related to small animal practice. All residents are also registered for a Master's degree in Veterinary Medicine.",
    url: "https://www.rvc.ac.uk/study/postgraduate/residencies/small-animal",
    region: "uk",
    type: "residency",
    species: "small animal",
    specialties: ["Surgery","Internal Medicine","Neurology","Dermatology","Ophthalmology","Emergency & Critical Care","Cardiology","Oncology","Anaesthesia","Imaging"],
  },
  {
    title: "University of Liverpool Rotating Internship Programme",
    organisation: "University of Liverpool",
    description: "Rotating internships designed for highly motivated veterinary professionals who wish to develop their skills, experience and knowledge by working under supervision in a multi-disciplinary referral hospital.",
    url: "https://www.liverpool.ac.uk/sath/teaching/postgraduates/internships/",
    region: "uk",
    type: "internship",
    species: "small animal",
    internshipType: "rotating",
    specialties: [],
  },
  {
    title: "University of Liverpool Anaesthesia Internship Programme",
    organisation: "University of Liverpool",
    description: "A discipline-specific internship in anaesthesia for highly motivated veterinary professionals who wish to develop their skills, experience and knowledge under supervision in a multi-disciplinary referral hospital.",
    url: "https://www.liverpool.ac.uk/sath/teaching/postgraduates/internships/",
    region: "uk",
    type: "internship",
    species: "small animal",
    internshipType: "discipline-specific",
    specialties: ["Anaesthesia"],
  },
  {
    title: "University of Liverpool Small Animal Residency Programme",
    organisation: "University of Liverpool",
    description: "The Small Animal Teaching Hospital (SATH) offers several residency programmes for veterinarians who wish to specialise in specific disciplines, providing first class, world-renowned training for veterinary specialisation.",
    url: "https://www.liverpool.ac.uk/sath/teaching/postgraduates/residencies/",
    region: "uk",
    type: "residency",
    species: "small animal",
    specialties: ["Surgery","Internal Medicine","Neurology","Dermatology","Ophthalmology","Emergency & Critical Care","Cardiology","Oncology","Anaesthesia","Imaging"],
  },
  {
    title: "University of Cambridge Rotating Internship Programme",
    organisation: "University of Cambridge",
    description: "Provides an opportunity for qualified veterinarians to obtain high-quality postgraduate training across a large range of small animal disciplines, enhancing clinical, diagnostic, problem-solving, communication, and technical skills.",
    url: "https://www.vet.cam.ac.uk/study/cts/jcts1/smallanimal",
    region: "uk",
    type: "internship",
    species: "small animal",
    internshipType: "rotating",
    specialties: [],
  },
  {
    title: "University of Cambridge Senior Clinical Training Scholarship / Residency Programme",
    organisation: "University of Cambridge",
    description: "Advanced clinical training programme for veterinarians preparing to undertake specialist training. Prepares candidates for entry to a residency or specialism.",
    url: "https://www.vet.cam.ac.uk/study/cts/jcts1/smallanimal",
    region: "uk",
    type: "residency",
    species: "small animal",
    specialties: ["Surgery","Internal Medicine","Neurology","Dermatology","Cardiology"],
  },
  {
    title: "University of Edinburgh Rotating Internship Programme",
    organisation: "University of Edinburgh",
    description: "53-week rotating internship providing an opportunity for new graduates or recently-qualified veterinarians to receive high-quality postgraduate training in small animal disciplines under experienced clinicians.",
    url: "https://vet.ed.ac.uk/clinical/vacancies/rotating-interns",
    region: "uk",
    type: "internship",
    species: "small animal",
    internshipType: "rotating",
    specialties: [],
  },
  {
    title: "University of Edinburgh Residency / Clinical Scholarship Programme",
    organisation: "University of Edinburgh",
    description: "The Professional Doctorate in Veterinary Medicine provides an opportunity for qualified veterinary surgeons to undertake a period of advanced clinical training in a chosen specialty under RCVS and European/American veterinary specialist guidance.",
    url: "https://vet.ed.ac.uk/clinical/vacancies/clinicalscholarships",
    region: "uk",
    type: "residency",
    species: "small animal",
    specialties: ["Surgery","Internal Medicine","Neurology","Dermatology","Emergency & Critical Care"],
  },
  {
    title: "University of Glasgow Small Animal Internship Programme",
    organisation: "University of Glasgow",
    description: "Internship opportunities within the Small Animal Hospital at the University of Glasgow, providing structured postgraduate clinical training.",
    url: "https://www.gla.ac.uk/explore/jobs/appointments/sahvacancies/",
    region: "uk",
    type: "internship",
    species: "small animal",
    internshipType: "rotating",
    specialties: [],
  },
  {
    title: "University of Glasgow Small Animal Residency Programme",
    organisation: "University of Glasgow",
    description: "Residency opportunities within the Small Animal Hospital at the University of Glasgow, providing structured postgraduate specialist training.",
    url: "https://www.gla.ac.uk/explore/jobs/appointments/sahvacancies/",
    region: "uk",
    type: "residency",
    species: "small animal",
    specialties: ["Surgery","Internal Medicine","Neurology","Dermatology","Ophthalmology","Emergency & Critical Care"],
  },
  {
    title: "IVC Evidensia Rotating and Discipline-Specific Internships",
    organisation: "IVC Evidensia, various locations",
    description: "Internship programmes providing an opportunity for qualified veterinarians to obtain training across a large range of small animal disciplines.",
    url: "https://ivcevidensia.co.uk/careers?roles=8",
    region: "uk",
    type: "internship",
    species: "small animal",
    internshipType: "both",
    specialties: [],
  },
  {
    title: "IVC Evidensia Small Animal Residency Programmes",
    organisation: "IVC Evidensia, various locations",
    description: "Residency programmes providing an opportunity for qualified veterinarians to obtain specialised training working towards diplomat status in their chosen discipline.",
    url: "https://ivcevidensia.co.uk/careers?roles=9",
    region: "uk",
    type: "residency",
    species: "small animal",
    specialties: ["Surgery","Internal Medicine","Neurology","Dermatology","Oncology","Emergency & Critical Care"],
  },
  {
    title: "Linnaeus Small Animal Rotating and Discipline-Specific Internships",
    organisation: "Linnaeus Group, various locations",
    description: "Rotating and discipline-specific internships providing an opportunity for qualified veterinarians to obtain training in a large range of small animal disciplines.",
    url: "https://www.linnaeusgroup.co.uk/careers/internships",
    region: "uk",
    type: "internship",
    species: "small animal",
    internshipType: "both",
    specialties: [],
  },
  {
    title: "Linnaeus Small Animal Residency Programmes",
    organisation: "Linnaeus Group, various locations",
    description: "Residency programmes providing an opportunity for qualified veterinarians to obtain specialised training working towards diplomat status in their chosen discipline.",
    url: "https://www.linnaeusgroup.co.uk/careers/vacancies?role=6",
    region: "uk",
    type: "residency",
    species: "small animal",
    specialties: ["Surgery","Internal Medicine","Neurology","Dermatology","Oncology","Cardiology"],
  },
  {
    title: "CVS Small Animal Rotating and Discipline-Specific Internship Programmes",
    organisation: "CVS Group, various locations",
    description: "Give exposure to referral practice and a broad range of specialist disciplines, working alongside world-class nurses, vets and specialists.",
    url: "https://cvs-referrals.com/careers/internship/",
    region: "uk",
    type: "internship",
    species: "small animal",
    internshipType: "both",
    specialties: [],
  },
  {
    title: "CVS Small Animal Residency Programmes",
    organisation: "CVS Group, various locations",
    description: "Residency programmes providing an opportunity for qualified veterinarians to obtain specialised training working towards diplomat status in their chosen discipline.",
    url: "https://cvs-referrals.com/careers/residencies/",
    region: "uk",
    type: "residency",
    species: "small animal",
    specialties: ["Surgery","Internal Medicine","Neurology","Dermatology","Oncology","Emergency & Critical Care"],
  },
  {
    title: "The Ralph Veterinary Internship Programmes",
    organisation: "The Ralph",
    description: "Various rotating and discipline-specific internship programmes at The Ralph referral hospital.",
    url: "https://theralph.vet/join-team-ralph/",
    region: "uk",
    type: "internship",
    species: "small animal",
    internshipType: "both",
    specialties: [],
  },
  {
    title: "The Ralph Veterinary Residency Programme",
    organisation: "The Ralph",
    description: "Various residency programmes in collaboration with European specialist colleges, at The Ralph referral hospital.",
    url: "https://theralph.vet/join-team-ralph/",
    region: "uk",
    type: "residency",
    species: "small animal",
    specialties: ["Surgery","Internal Medicine","Neurology","Ophthalmology","Emergency & Critical Care"],
  },

  // ── UK — EBVS Specialist College Residencies ─────────────────────────────
  {
    title: "EBVS Vacancies Board — United Kingdom",
    organisation: "European Board of Veterinary Specialisation",
    description: "The EBVS central vacancy feed, filterable to United Kingdom positions. Covers residency and internship posts across all EBVS specialist colleges at UK-based training centres. Updated continuously.",
    url: "https://www.ebvs.eu/vacancies-ebvs",
    region: "uk",
    type: "internship & residency",
    species: "all species",
    internshipType: "discipline-specific",
    specialties: [],
  },
  {
    title: "ECVS Residency Programmes — UK Training Centres",
    organisation: "European College of Veterinary Surgeons",
    description: "Surgical residency positions at UK ECVS-approved training centres, including university teaching hospitals and private referral practices. Live vacancies listed on the ECVS website.",
    url: "https://www.ecvs.org/ecvs-for/residents.php",
    region: "uk",
    type: "residency",
    species: "small animal, equine",
    specialties: ["Surgery"],
  },
  {
    title: "ECVIM-CA Residency Programmes — UK Training Centres",
    organisation: "European College of Veterinary Internal Medicine – Companion Animals",
    description: "Internal medicine, cardiology, and oncology residency positions at UK ECVIM-CA-approved training centres. Live vacancies listed on the ECVIM-CA website.",
    url: "https://ecvim-ca.college/residency-vacancies/",
    region: "uk",
    type: "residency",
    species: "small animal",
    specialties: ["Internal Medicine", "Cardiology", "Oncology"],
  },
  {
    title: "ECVAA Residency Programmes — UK Training Centres",
    organisation: "European College of Veterinary Anaesthesia and Analgesia",
    description: "Anaesthesia and analgesia residency positions at UK ECVAA-approved training centres. Training-centre list on the ECVAA website.",
    url: "https://www.ecvaa.org/ecvaa/training-centers-list",
    region: "uk",
    type: "residency",
    species: "small animal, equine",
    specialties: ["Anaesthesia"],
  },
  {
    title: "ECVN Residency Programmes — UK Training Centres",
    organisation: "European College of Veterinary Neurology",
    description: "Neurology residency positions at UK ECVN-approved training centres. Open residency positions listed on the ECVN website.",
    url: "https://www.ecvn.org/general-information/open-residency-position",
    region: "uk",
    type: "residency",
    species: "small animal",
    specialties: ["Neurology"],
  },
  {
    title: "ECVD Residency Programmes — UK Training Centres",
    organisation: "European College of Veterinary Dermatology",
    description: "Dermatology residency positions at UK ECVD-approved training centres. Vacancies listed on the 'Start your residency' page.",
    url: "https://www.ecvd.org/programmes/start-your-residency/",
    region: "uk",
    type: "residency",
    species: "small animal",
    specialties: ["Dermatology"],
  },
  {
    title: "ECVDI Residency Programmes — UK Training Centres",
    organisation: "European College of Veterinary Diagnostic Imaging",
    description: "Diagnostic imaging residency positions at UK ECVDI-approved training centres.",
    url: "https://www.ecvdi.org/training-centers-list",
    region: "uk",
    type: "residency",
    species: "all species",
    specialties: ["Imaging"],
  },
  {
    title: "ECVECC Residency Programmes — UK Training Centres",
    organisation: "European College of Veterinary Emergency and Critical Care",
    description: "Emergency and critical care residency positions at UK ECVECC-approved training centres.",
    url: "https://www.ecvecc.org/resident-training-facilities",
    region: "uk",
    type: "residency",
    species: "small animal",
    specialties: ["Emergency & Critical Care"],
  },
  {
    title: "ECVO Internship & Residency Programmes — UK Training Centres",
    organisation: "European College of Veterinary Ophthalmologists",
    description: "Ophthalmology internship and residency positions at UK ECVO-approved training centres.",
    url: "https://www.ecvo.eu/residents/training-job-opportunities-for-interns-residents.html",
    region: "uk",
    type: "internship & residency",
    species: "small animal",
    internshipType: "discipline-specific",
    specialties: ["Ophthalmology"],
  },

  {
    title: "BEVA Recognised Equine Internship",
    organisation: "British Equine Veterinary Association",
    description: "All BEVA recognised internships have agreed to a set of core standards that ensure interns receive the right training and are treated fairly.",
    url: "https://www.beva.org.uk/New-Vet-Grads/Recognised-Internships",
    region: "worldwide",
    type: "internship",
    species: "equine",
    internshipType: "discipline-specific",
    specialties: ["Equine"],
  },
  {
    title: "ECVS Residency Training",
    organisation: "European College of Veterinary Surgeons",
    description: "Advanced surgical training programmes leading to board certification in veterinary surgery.",
    url: "https://www.ecvs.org/ecvs-for/residents.php",
    region: "europe",
    type: "residency",
    species: "small animal",
    specialties: ["Surgery"],
  },
  {
    title: "ECVP Residency Programme",
    organisation: "European College of Veterinary Pathologists",
    description: "Specialised training in veterinary pathology leading to board certification.",
    url: "https://www.ecvpath.org/resident-registration",
    region: "europe",
    type: "residency",
    species: "mixed",
    specialties: ["Pathology"],
  },
  {
    title: "ECVIM-CA Residency Programmes",
    organisation: "European College of Veterinary Internal Medicine",
    description: "Specialised residency training programmes in internal medicine at various veterinary institutes across Europe.",
    url: "https://ecvim-ca.college/residency-vacancies/",
    region: "europe",
    type: "residency",
    species: "small animal",
    specialties: ["Internal Medicine","Cardiology","Oncology","Endocrinology"],
  },
  {
    title: "ECVM Residency Programmes",
    organisation: "European College of Veterinary Microbiology",
    description: "Specialised residency training programmes in microbiology at various veterinary institutes across Europe.",
    url: "https://ecvmicro.org/training-centers/",
    region: "europe",
    type: "residency",
    species: "mixed",
    specialties: ["Microbiology"],
  },
  {
    title: "ECVAA Residency Programmes",
    organisation: "European College of Veterinary Anaesthesia and Analgesia",
    description: "Specialised residency training programmes in anaesthesia and analgesia at various veterinary institutes across Europe.",
    url: "https://www.ecvaa.org/ecvaa/training-centers-list",
    region: "europe",
    type: "residency",
    species: "small animal",
    specialties: ["Anaesthesia"],
  },
  {
    title: "ECVCN Residency Programmes",
    organisation: "European College of Veterinary and Comparative Nutrition",
    description: "Specialised residency training programmes in veterinary nutrition at various institutes across Europe.",
    url: "https://www.ecvcn.org/why-become-resident-why-become-supervisor",
    region: "europe",
    type: "residency",
    species: "small animal",
    specialties: ["Nutrition"],
  },
  {
    title: "ECVCP Residency Programmes",
    organisation: "European College of Veterinary Clinical Pathology",
    description: "Specialised residency training programmes in clinical pathology at various veterinary institutes across Europe.",
    url: "https://www.esvcp.org/open-positions.html",
    region: "europe",
    type: "residency",
    species: "mixed",
    specialties: ["Pathology"],
  },
  {
    title: "ECVD Residency Programmes",
    organisation: "European College of Veterinary Dermatology",
    description: "Specialised residency training programmes in veterinary dermatology at various institutes across Europe.",
    url: "https://www.ecvd.org/programmes/start-your-residency/",
    region: "europe",
    type: "residency",
    species: "small animal",
    specialties: ["Dermatology"],
  },
  {
    title: "ECVDI Residency Programmes",
    organisation: "European College of Veterinary Diagnostic Imaging",
    description: "Specialised residency training programmes in veterinary diagnostic imaging at various institutes across Europe.",
    url: "https://www.ecvdi.org/training-centers-list",
    region: "europe",
    type: "residency",
    species: "small animal",
    specialties: ["Imaging"],
  },
  {
    title: "ECVECC Residency Programmes",
    organisation: "European College of Veterinary Emergency and Critical Care",
    description: "Specialised residency training programmes in veterinary emergency and critical care at institutes across Europe and New Zealand.",
    url: "https://www.ecvecc.org/resident-training-facilities",
    region: "europe",
    type: "residency",
    species: "small animal",
    specialties: ["Emergency & Critical Care"],
  },
  {
    title: "ECVN Residency Programmes",
    organisation: "European College of Veterinary Neurology",
    description: "Specialised residency training programmes in veterinary neurology at various institutes across Europe.",
    url: "https://www.ecvn.org/general-information/open-residency-position",
    region: "europe",
    type: "residency",
    species: "small animal",
    specialties: ["Neurology"],
  },
  {
    title: "ECVO Internship & Residency Programmes",
    organisation: "European College of Veterinary Ophthalmologists",
    description: "Specialised internship and residency training programmes in veterinary ophthalmology at various institutes across Europe.",
    url: "https://www.ecvo.eu/residents/training-job-opportunities-for-interns-residents.html",
    region: "europe",
    type: "internship & residency",
    species: "small animal",
    internshipType: "discipline-specific",
    specialties: ["Ophthalmology"],
  },

  {
    title: "EBVS Central Vacancies Board",
    organisation: "European Board of Veterinary Specialisation",
    description: "The primary live vacancy feed for internships and residencies across all EBVS specialist colleges. Filterable by country, discipline, and species — the single best starting point for European specialist training. Updated continuously.",
    url: "https://www.ebvs.eu/vacancies-ebvs",
    region: "europe",
    type: "internship & residency",
    species: "all species",
    internshipType: "discipline-specific",
    specialties: [],
  },
  {
    title: "ECVIM-CA Internship Vacancies",
    organisation: "European College of Veterinary Internal Medicine – Companion Animals",
    description: "A dedicated board listing internship positions at ECVIM-CA-approved institutions — providing clinical experience that feeds into ECVIM-CA internal medicine, cardiology, and oncology residency tracks. Separate from the ECVIM-CA residency vacancy board.",
    url: "https://ecvim-ca.college/internship-vacancies/",
    region: "europe",
    type: "internship",
    species: "small animal",
    internshipType: "discipline-specific",
    specialties: ["Internal Medicine", "Cardiology", "Oncology"],
  },

  {
    title: "ECEIM Residency Programmes",
    organisation: "European College of Equine Internal Medicine",
    description: "Residency training in equine internal medicine across 51 approved training institutions in Europe. A one-year clinical internship is a prerequisite. Live posts are listed on the ECEIM jobs page.",
    url: "https://www.eceim.info/jobs",
    region: "europe",
    type: "residency",
    species: "equine",
    specialties: ["Equine", "Internal Medicine"],
  },
  {
    title: "ECVSMR Residency Programmes",
    organisation: "European College of Veterinary Sports Medicine and Rehabilitation",
    description: "Residency training across separate small-animal and equine tracks in veterinary sports medicine and rehabilitation at approved centres across Europe.",
    url: "https://www.ecvsmr.org/residency-programs",
    region: "europe",
    type: "residency",
    species: "small animal, equine",
    specialties: ["Sports Medicine & Rehabilitation"],
  },
  {
    title: "EVDC Residency Programmes",
    organisation: "European Veterinary Dental College",
    description: "Residency training in veterinary dentistry and oral surgery, with general and equine tracks at approved centres across Europe. A dedicated vacancy page lists current positions.",
    url: "https://www.evdc.org/residents_and_training/residency_training_vacancies",
    region: "europe",
    type: "residency",
    species: "small animal, equine",
    specialties: ["Dentistry"],
  },
  {
    title: "ECZM Residency Programmes",
    organisation: "European College of Zoological Medicine",
    description: "Residency training across five subspecialties: Avian, Herpetology, Small Mammal, Zoo Health Management, and Wildlife. Live vacancies and approved programme lists are on the ECZM site.",
    url: "https://www.eczm.eu/vacancies",
    region: "europe",
    type: "residency",
    species: "exotic, zoo, wildlife",
    specialties: ["Zoological Medicine"],
  },
  {
    title: "ECAR Residency Programmes",
    organisation: "European College of Animal Reproduction",
    description: "Residency training in animal reproduction across all species — small animal, equine, ruminant, porcine, and biotechnology tracks. A one-year internship prerequisite is required.",
    url: "https://www.ecarcollege.org/jobs/",
    region: "europe",
    type: "residency",
    species: "all species",
    specialties: ["Reproduction"],
  },
  {
    title: "ECAWBM Residency Programmes",
    organisation: "European College of Animal Welfare and Behavioural Medicine",
    description: "Residency training across two tracks: Animal Welfare Science, Ethics & Law (AWSEL) and Behavioural Medicine (BM). Positions are advertised via the college site and the EBVS vacancy feed.",
    url: "https://www.ecawbm.org/",
    region: "europe",
    type: "residency",
    species: "all species",
    specialties: ["Behaviour & Welfare"],
  },
  {
    title: "ECVPH Residency Programmes",
    organisation: "European College of Veterinary Public Health",
    description: "Residency training in veterinary public health — covering population medicine and food science — primarily in academic and government institutions across Europe.",
    url: "https://ecvph.org/",
    region: "europe",
    type: "residency",
    species: "all species",
    specialties: ["Public Health"],
  },
  {
    title: "ECLAM Residency Programmes",
    organisation: "European College of Laboratory Animal Medicine",
    description: "Residency training in laboratory animal medicine, primarily within research institutions and pharmaceutical organisations. Positions are advertised via the college site and the EBVS feed.",
    url: "https://eclam.eu/",
    region: "europe",
    type: "residency",
    species: "laboratory animals",
    specialties: ["Laboratory Animal Medicine"],
  },
  {
    title: "ECVPT Residency Programmes",
    organisation: "European College of Veterinary Pharmacology and Toxicology",
    description: "Residency training in veterinary pharmacology and toxicology, predominantly in academic and industry settings. Positions are advertised via the college site and the EBVS vacancy feed.",
    url: "https://ecvpt.org/",
    region: "europe",
    type: "residency",
    species: "all species",
    specialties: ["Pharmacology & Toxicology"],
  },
  {
    title: "EVPC Residency Programmes",
    organisation: "European Veterinary Parasitology College",
    description: "Residency training in veterinary parasitology, primarily in academic settings across Europe. Positions are advertised via the college site and the EBVS vacancy feed.",
    url: "https://www.eurovetpar.org/",
    region: "europe",
    type: "residency",
    species: "all species",
    specialties: ["Parasitology"],
  },
  {
    title: "ECAAH Residency Programmes",
    organisation: "European College of Aquatic Animal Health",
    description: "Residency training in aquatic animal health covering fish, crustaceans, and molluscs. A newer college with a small number of approved centres; positions are advertised via the college site and the EBVS feed.",
    url: "https://ecaah.org/",
    region: "europe",
    type: "residency",
    species: "aquatic",
    specialties: ["Aquatic Medicine"],
  },
  {
    title: "ECBHM Residency Programmes",
    organisation: "European College of Bovine Health Management",
    description: "Residency training in bovine herd-health management at veterinary universities across Europe. Positions are advertised via the college site and the EBVS vacancy feed.",
    url: "https://www.ecbhm.org/",
    region: "europe",
    type: "residency",
    species: "bovine",
    specialties: ["Farm Animal"],
  },
  {
    title: "ECPHM Residency Programmes",
    organisation: "European College of Porcine Health Management",
    description: "Residency training in porcine health management within production-animal university departments across Europe.",
    url: "https://www.ecphm.org/",
    region: "europe",
    type: "residency",
    species: "porcine",
    specialties: ["Farm Animal"],
  },
  {
    title: "ECPVS Residency Programmes",
    organisation: "European College of Poultry Veterinary Science",
    description: "Residency training in poultry veterinary science, primarily in production-animal settings. Positions are advertised via the college site and the EBVS vacancy feed.",
    url: "https://www.ecpvs.org/",
    region: "europe",
    type: "residency",
    species: "poultry",
    specialties: ["Farm Animal"],
  },
  {
    title: "ECSRHM Residency Programmes",
    organisation: "European College of Small Ruminant Health Management",
    description: "Residency training in small ruminant (sheep and goat) health management at veterinary universities across Europe.",
    url: "https://ecsrhm.org/",
    region: "europe",
    type: "residency",
    species: "sheep, goats",
    specialties: ["Farm Animal"],
  },

  // ── Pan-European Corporate Groups ────────────────────────────────────────────
  {
    title: "AniCura Internships & Graduate Programme (Europe)",
    organisation: "AniCura (Mars Veterinary Health)",
    description: "Pan-European veterinary group with 500+ clinics across ~17 countries. Offers rotating internships, discipline-specific internships, specialist residencies, and a structured 15-month Graduate Programme. Roles are listed on their global careers platform.",
    url: "https://anicuraglobal.teamtailor.com/departments/veterinary-student-jobs",
    region: "europe",
    type: "internship",
    species: "small animal",
    internshipType: "both",
    specialties: [],
  },
  {
    title: "IVC Evidensia Internships & Residencies (Europe)",
    organisation: "IVC Evidensia",
    description: "Europe's largest veterinary group with 100+ referral centres across the continent. Offers rotating and discipline-specific internships, specialist residencies, and a Graduate Academy programme. European brands recruit locally and through the group careers hub.",
    url: "https://ivcevidensia.com/career/",
    region: "europe",
    type: "internship & residency",
    species: "small animal",
    internshipType: "both",
    specialties: [],
  },

  // ── Academic Job Board ───────────────────────────────────────────────────────
  {
    title: "EURAXESS — Veterinary Research & Clinical Positions",
    organisation: "European Commission",
    description: "The European Commission's researcher mobility platform. Lists university-based veterinary internship and residency positions as research or clinical roles across the EU. Search 'veterinary internship' or 'residency'.",
    url: "https://euraxess.ec.europa.eu/jobs",
    region: "europe",
    type: "internship & residency",
    species: "all species",
    internshipType: "discipline-specific",
    specialties: [],
  },

  // ── Key European Universities ────────────────────────────────────────────────
  {
    title: "Utrecht University Residency Programmes",
    organisation: "Faculty of Veterinary Medicine, Utrecht University, Netherlands",
    description: "The only veterinary faculty in the Netherlands and a major centre for European college residencies across many disciplines. Live posts are listed on the 'Working at Utrecht University' careers page.",
    url: "https://www.uu.nl/en/organisation/faculty-of-veterinary-medicine/education/veterinary-programmes/residencies",
    region: "europe",
    type: "residency",
    species: "small animal, equine",
    specialties: [],
  },
  {
    title: "Vetsuisse – University of Zurich Internship & Residency Programmes",
    organisation: "Vetsuisse, University of Zurich, Switzerland",
    description: "Internships and residencies across approximately 24 European college disciplines at the University of Zurich's Vetsuisse faculty. One of Switzerland's two veterinary schools.",
    url: "https://www.vet.uzh.ch/en/studium/College(s)-Weiterbildungen.html",
    region: "europe",
    type: "internship & residency",
    species: "small animal, equine",
    internshipType: "rotating",
    specialties: [],
  },
  {
    title: "Vetsuisse – University of Bern Residency Programmes",
    organisation: "Vetsuisse, University of Bern, Switzerland",
    description: "Residency programmes across approximately 18 specialist disciplines at the University of Bern's Vetsuisse faculty.",
    url: "https://www.vetsuisse.unibe.ch/continuing_education/specialisation_offers_entwurf/index_eng.html",
    region: "europe",
    type: "residency",
    species: "small animal, equine",
    specialties: [],
  },
  {
    title: "University of Veterinary Medicine Hannover (TiHo) Internship & Residency Programmes",
    organisation: "Tierärztliche Hochschule Hannover, Germany",
    description: "Rotating internship programme and European college residency positions at one of Germany's leading veterinary schools. Positions are posted on the TiHo HR portal.",
    url: "https://www.tiho-hannover.de/kliniken-institute/kliniken/klinik-fuer-kleintiere/lehre/internship-programm",
    region: "europe",
    type: "internship & residency",
    species: "small animal, equine",
    internshipType: "rotating",
    specialties: [],
  },
  {
    title: "Autonomous University of Barcelona (UAB) Internship & Residency Programmes",
    organisation: "Hospital Clínic Veterinari, UAB, Spain",
    description: "18 resident places across 10 specialties and a 12-month rotating internship programme at the Hospital Clínic Veterinari of the Autonomous University of Barcelona.",
    url: "https://www.uab.cat/en/animal-medicine-surgery/residences-boarding-schools",
    region: "europe",
    type: "internship & residency",
    species: "small animal, equine",
    internshipType: "rotating",
    specialties: [],
  },
  {
    title: "Complutense University of Madrid (UCM) Internship & Residency Programmes",
    organisation: "Hospital Clínico Veterinario Complutense, Madrid, Spain",
    description: "Rotating internado and European college residency positions (anaesthesia, surgery, internal medicine, imaging, and emergency & critical care) at Madrid's main veterinary teaching hospital.",
    url: "https://www.ucm.es/hcv/internados",
    region: "europe",
    type: "internship & residency",
    species: "small animal, equine",
    internshipType: "rotating",
    specialties: ["Surgery", "Internal Medicine", "Anaesthesia", "Imaging", "Emergency & Critical Care"],
  },
  {
    title: "University College Dublin (UCD) Internship & Residency Programmes",
    organisation: "UCD Veterinary Hospital, Ireland",
    description: "Rotating and discipline-specific internship and residency programmes at UCD's veterinary teaching hospital. Positions are listed on the UCD jobs site.",
    url: "https://www.ucd.ie/vthweb/vetprofessionals/internshipsresidencies/",
    region: "europe",
    type: "internship & residency",
    species: "small animal, equine",
    internshipType: "both",
    specialties: [],
  },
  {
    title: "University of Bologna Rotating Internship & Residency Programmes",
    organisation: "Ospedale Veterinario Universitario 'Giuseppe Gentile', Bologna, Italy",
    description: "Rotating internship pathways (selections held twice a year) feeding into EBVS residency programmes at the University of Bologna's teaching hospital.",
    url: "https://site.unibo.it/ospedale-veterinario/it/area-veterinari/percorsi-formativi",
    region: "europe",
    type: "internship & residency",
    species: "small animal",
    internshipType: "rotating",
    specialties: [],
  },
  {
    title: "University of Lisbon (FMV) Internship & Residency Programmes",
    organisation: "Faculdade de Medicina Veterinária, Universidade de Lisboa, Portugal",
    description: "Internatos (small animal and equine) and EBVS European college residency programmes at the Lisbon veterinary teaching hospital.",
    url: "https://www.fmv.ulisboa.pt/en/services/teaching-hospital",
    region: "europe",
    type: "internship & residency",
    species: "small animal, equine",
    internshipType: "rotating",
    specialties: [],
  },
  {
    title: "ENVA (National Veterinary School of Alfort) Internship & Residency Programmes",
    organisation: "École Nationale Vétérinaire d'Alfort, France",
    description: "Internats (access via the national French concours) and résidanats across companion animal, equine, and farm animal disciplines at one of France's four national veterinary schools.",
    url: "https://www.vet-alfort.fr/formation/formation-initiale-et-specialisee/internat-et-residanat",
    region: "europe",
    type: "internship & residency",
    species: "small animal, equine, farm animal",
    internshipType: "rotating",
    specialties: [],
  },
];

const licensingNote = {
  uk: (
    <p className="text-sm text-gray-500 mb-6">
      UK internships and residencies require RCVS registration. Overseas vets will also need a Skilled Worker Visa.{" "}
      <Link to="/uk" className="text-blue-600 hover:text-blue-800 font-medium">See the UK licensing guide →</Link>
    </p>
  ),
  "north-america": (
    <p className="text-sm text-gray-500 mb-6">
      VIRMP positions require NAVLE and state or provincial licensure. See country guides for registration steps:{" "}
      <Link to="/usa" className="text-blue-600 hover:text-blue-800 font-medium">USA</Link>
      {" · "}
      <Link to="/canada" className="text-blue-600 hover:text-blue-800 font-medium">Canada →</Link>
    </p>
  ),
};

const PROGRAM_TYPE_OPTIONS = [
  { value: "rotating",            label: "Rotating Internship"            },
  { value: "discipline-specific", label: "Discipline-Specific Internship" },
  { value: "residency",           label: "Residency"                      },
];

const programMatchesFilters = (p, typeFilters, specialtyFilters) => {
  // Type filter
  if (typeFilters.length > 0) {
    const matchesType = typeFilters.some((ft) => {
      if (ft === "rotating") {
        return p.type === "internship" && (p.internshipType === "rotating" || p.internshipType === "both");
      }
      if (ft === "discipline-specific") {
        return (
          (p.type === "internship" || p.type === "internship & residency") &&
          (p.internshipType === "discipline-specific" || p.internshipType === "both")
        );
      }
      if (ft === "residency") {
        return p.type === "residency" || p.type === "internship & residency";
      }
      return false;
    });
    if (!matchesType) return false;
  }
  // Specialty filter — umbrella entries (empty specialties) always pass
  if (specialtyFilters.length > 0 && p.specialties && p.specialties.length > 0) {
    if (!p.specialties.some((s) => specialtyFilters.includes(s))) return false;
  }
  return true;
};

const ProgramCard = ({ program }) => (
  <div id={slugify(program.title)} className="bg-white rounded-xl border border-gray-100 p-6 hover:border-blue-200 hover:shadow-sm transition-colors scroll-mt-28">
    <div className="flex flex-wrap gap-2 mb-3">
      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium capitalize">
        {program.type === "internship" && program.internshipType === "rotating"
          ? "Rotating Internship"
          : program.type === "internship" && program.internshipType === "discipline-specific"
          ? "Discipline-Specific Internship"
          : program.type === "internship" && program.internshipType === "both"
          ? "Rotating & Discipline-Specific Internship"
          : program.type === "internship & residency"
          ? "Internship & Residency"
          : program.type}
      </span>
      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs capitalize">{program.species}</span>
      {program.specialties && program.specialties.length > 0 && program.specialties.map((s) => (
        <span key={s} className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full text-xs">{s}</span>
      ))}
    </div>
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
);

const InternshipsResidencies = () => {
  const { region, subCategory } = useParams();
  const [typeFilters,      setTypeFilters]      = useState([]);
  const [specialtyFilters, setSpecialtyFilters] = useState([]);

  const toggleType      = (v) => setTypeFilters((p)      => p.includes(v) ? p.filter((x) => x !== v) : [...p, v]);
  const toggleSpecialty = (v) => setSpecialtyFilters((p) => p.includes(v) ? p.filter((x) => x !== v) : [...p, v]);
  const clearFilters    = ()  => { setTypeFilters([]); setSpecialtyFilters([]); };
  const activeCount     = typeFilters.length + specialtyFilters.length;

  // ——— Sub-category programme list (e.g. /europe/colleges, /uk/university) ———
  if (region && subCategory) {
    const cfg        = regionConfig.find((r) => r.id === region);
    const subCatCfg  = (subCategoryConfig[region] || []).find((s) => s.id === subCategory);
    // EBVS colleges are pan-European bodies — when viewing UK/college, source from the
    // comprehensive Europe college list rather than the smaller UK-tagged subset.
    const programRegion = (region === "uk" && subCategory === "college") ? "europe" : region;
    const regionPrograms = programs.filter(
      (p) => p.region === programRegion &&
             getSubCategory(p) === subCategory &&
             programMatchesFilters(p, typeFilters, specialtyFilters)
    );

    if (!cfg || !subCatCfg) {
      return (
        <div className="min-h-screen bg-white">
          <SharedHeader />
          <main className="py-16 text-center">
            <p className="text-gray-500 mb-4">Page not found.</p>
            <Link to="/internships-residencies" className="text-blue-600 hover:text-blue-800 font-medium">← Back to all programmes</Link>
          </main>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-white">
        <Helmet>
          <title>{subCatCfg.name} — {cfg.name} Internships & Residencies | VetNextStep</title>
          <meta name="description" content={`Veterinary ${subCatCfg.name.toLowerCase()} internships and residencies in ${cfg.name}.`} />
          <link rel="canonical" href={`https://vetnextstep.com/internships-residencies/${region}/${subCategory}`} />
        </Helmet>
        <SharedHeader />

        <main className="py-8 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Breadcrumb */}
            <nav className="mb-8 flex flex-wrap items-center gap-1.5 text-sm">
              <Link to="/internships-residencies" className="text-blue-600 hover:text-blue-800 font-medium">
                All Internships & Residencies
              </Link>
              <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <Link to={`/internships-residencies/${region}`} className="text-blue-600 hover:text-blue-800 font-medium">
                {cfg.name}
              </Link>
              <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-gray-600">{subCatCfg.name}</span>
            </nav>

            {/* Section header */}
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
              <span className="text-3xl">{subCatCfg.emoji}</span>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{subCatCfg.name}</h1>
                <p className="text-sm text-gray-500 mt-0.5">{cfg.flag} {cfg.name}</p>
              </div>
              <span className="ml-auto text-sm text-gray-400">
                {regionPrograms.length} programme{regionPrograms.length !== 1 ? "s" : ""}
              </span>
            </div>

            {licensingNote[region]}

            {/* Filters */}
            <div className="flex flex-wrap gap-2 mb-4 items-center">
              <FilterDropdown
                label="Type"
                options={PROGRAM_TYPE_OPTIONS}
                selected={typeFilters}
                onToggle={toggleType}
                valueKey="value"
                labelKey="label"
              />
              <FilterDropdown
                label="Specialty"
                options={SPECIALTY_OPTIONS}
                selected={specialtyFilters}
                onToggle={toggleSpecialty}
              />
              {activeCount > 0 && (
                <button onClick={clearFilters} className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 underline underline-offset-2">
                  Clear all ({activeCount})
                </button>
              )}
            </div>
            {activeCount > 0 && (
              <p className="text-xs text-gray-400 mb-6">
                Umbrella programmes covering multiple disciplines appear for all specialty filters.
              </p>
            )}

            {regionPrograms.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-100 p-12 text-center text-gray-400 text-sm">
                No programmes match the current filters.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {regionPrograms.map((program, index) => (
                  <ProgramCard key={index} program={program} />
                ))}
              </div>
            )}

          </div>
        </main>
      </div>
    );
  }

  // ——— Sub-hub: regions with two-tile intermediate (europe, uk) ———
  if (region && subCategoryConfig[region]) {
    const cfg     = regionConfig.find((r) => r.id === region);
    const subCats = subCategoryConfig[region];

    if (!cfg) {
      return (
        <div className="min-h-screen bg-white">
          <SharedHeader />
          <main className="py-16 text-center">
            <p className="text-gray-500 mb-4">Region not found.</p>
            <Link to="/internships-residencies" className="text-blue-600 hover:text-blue-800 font-medium">← Back to all programmes</Link>
          </main>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-white">
        <Helmet>
          <title>{cfg.name} Internships & Residencies | VetNextStep</title>
          <meta name="description" content={`Veterinary internships and residencies in ${cfg.name} — browse by programme type.`} />
          <link rel="canonical" href={`https://vetnextstep.com/internships-residencies/${region}`} />
        </Helmet>
        <SharedHeader />

        <main className="py-8 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Breadcrumb */}
            <div className="mb-8">
              <Link to="/internships-residencies" className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                All Internships & Residencies
              </Link>
            </div>

            {/* Region header */}
            <div className="flex items-center gap-3 mb-10">
              <span className="text-4xl">{cfg.flag}</span>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{cfg.name}</h1>
            </div>

            {/* Sub-category tiles */}
            <div className={`grid grid-cols-1 gap-6 ${subCats.length >= 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
              {subCats.map((sub) => {
                // EBVS colleges are pan-European — count from europe list for uk/college tile
                const countRegion = (region === "uk" && sub.id === "college") ? "europe" : region;
                const count = programs.filter(
                  (p) => p.region === countRegion && getSubCategory(p) === sub.id
                ).length;
                return (
                  <Link key={sub.id} to={`/internships-residencies/${region}/${sub.id}`} className="group block">
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-blue-300 hover:shadow-md transition-all">
                      <div className="h-48 relative overflow-hidden">
                        <img
                          src={sub.image}
                          alt={sub.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        <div className="absolute bottom-3 left-4 text-white">
                          <div className="text-2xl mb-1">{sub.emoji}</div>
                          <h2 className="text-lg font-bold leading-tight">{sub.name}</h2>
                        </div>
                      </div>
                      <div className="px-4 py-4 bg-white">
                        <p className="text-sm text-gray-600 leading-relaxed mb-3">{sub.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">{count} programme{count !== 1 ? "s" : ""}</span>
                          <span className="text-blue-600 text-sm font-medium group-hover:translate-x-1 transition-transform inline-flex items-center">
                            Browse
                            <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

          </div>
        </main>
      </div>
    );
  }

  // ——— Single region programme list (north-america, worldwide) ———
  if (region) {
    const cfg = regionConfig.find((r) => r.id === region);
    const regionPrograms = programs
      .filter((p) => p.region === region && programMatchesFilters(p, typeFilters, specialtyFilters));

    if (!cfg) {
      return (
        <div className="min-h-screen bg-white">
          <SharedHeader />
          <main className="py-16 text-center">
            <p className="text-gray-500 mb-4">Region not found.</p>
            <Link to="/internships-residencies" className="text-blue-600 hover:text-blue-800 font-medium">← Back to all programmes</Link>
          </main>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-white">
        <Helmet>
          <title>{cfg.name} Internships & Residencies | VetNextStep</title>
          <meta name="description" content={`Veterinary internships and residencies in ${cfg.name}.`} />
          <link rel="canonical" href={`https://vetnextstep.com/internships-residencies/${region}`} />
        </Helmet>
        <SharedHeader />

        <main className="py-8 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Breadcrumb */}
            <div className="mb-8">
              <Link to="/internships-residencies" className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                All Internships & Residencies
              </Link>
            </div>

            {/* Section header */}
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
              <span className="text-3xl">{cfg.flag}</span>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{cfg.name}</h1>
              <span className="ml-auto text-sm text-gray-400">
                {regionPrograms.length} programme{regionPrograms.length !== 1 ? "s" : ""}
              </span>
            </div>

            {licensingNote[region]}

            {/* Filters */}
            <div className="flex flex-wrap gap-2 mb-4 items-center">
              <FilterDropdown
                label="Type"
                options={PROGRAM_TYPE_OPTIONS}
                selected={typeFilters}
                onToggle={toggleType}
                valueKey="value"
                labelKey="label"
              />
              <FilterDropdown
                label="Specialty"
                options={SPECIALTY_OPTIONS}
                selected={specialtyFilters}
                onToggle={toggleSpecialty}
              />
              {activeCount > 0 && (
                <button onClick={clearFilters} className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 underline underline-offset-2">
                  Clear all ({activeCount})
                </button>
              )}
            </div>
            {activeCount > 0 && (
              <p className="text-xs text-gray-400 mb-6">
                Umbrella programmes covering multiple disciplines appear for all specialty filters.
              </p>
            )}

            {regionPrograms.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-100 p-12 text-center text-gray-400 text-sm">
                No programmes match the current filters in this region.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {regionPrograms.map((program, index) => (
                  <ProgramCard key={index} program={program} />
                ))}
              </div>
            )}

          </div>
        </main>
      </div>
    );
  }

  // ——— Hub page ———
  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Veterinary Internships & Residencies | VetNextStep</title>
        <meta name="description" content="Browse veterinary internships and residencies in the UK, Europe, and North America. Find rotating internships, specialist residencies, and VIRMP programs for new vet graduates." />
        <link rel="canonical" href="https://vetnextstep.com/internships-residencies" />
        <meta property="og:title" content="Veterinary Internships & Residencies | VetNextStep" />
        <meta property="og:description" content="Find rotating internships, specialist residencies, and VIRMP programs for veterinary graduates across the UK, Europe, and North America." />
        <meta property="og:url" content="https://vetnextstep.com/internships-residencies" />
        <meta property="og:type" content="website" />
      </Helmet>
      <SharedHeader />

      <main className="py-8 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-12">
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">Internships & Residencies</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Rotating internships and specialist residency positions across the UK, North America, Europe, and worldwide. Select a region to browse programmes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {regionConfig.map((r) => {
              const count = programs.filter((p) => p.region === r.id).length;
              return (
                <Link key={r.id} to={`/internships-residencies/${r.id}`} className="group block">
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-blue-300 hover:shadow-md transition-all">
                    <div className="h-48 relative overflow-hidden">
                      <img src={r.image} alt={r.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>
                      <div className="absolute bottom-3 left-4 text-white">
                        <div className="text-2xl mb-1">{r.flag}</div>
                        <h2 className="text-lg font-bold leading-tight">{r.name}</h2>
                      </div>
                    </div>
                    <div className="px-4 py-3 flex items-center justify-between bg-white">
                      <span className="text-sm text-gray-500">{count} programme{count !== 1 ? "s" : ""}</span>
                      <span className="text-blue-600 text-sm font-medium group-hover:translate-x-1 transition-transform inline-flex items-center">
                        View all
                        <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

        </div>
      </main>
      <SharedFooter />
    </div>
  );
};

export default InternshipsResidencies;
