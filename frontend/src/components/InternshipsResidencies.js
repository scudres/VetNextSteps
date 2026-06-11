import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const InternshipsResidencies = () => {
  const programs = [
    {
      title: "VIRMP - Veterinary Internship and Residency Matching Program",
      organisation: "USA/Canada",
      description: "Central matching service for veterinary internships and residencies in North America.",
      url: "https://www.virmp.org/",
      country: "USA/Canada",
      type: "internship",
      species: "small animal, equine, farm animal"
    },
    {
      title: "Royal Veterinary College Rotating Internship Programme",
      organisation: "Royal Veterinary College",
      description: "The programme is designed for highly motivated recent veterinary graduates (typically less than five years) who wish to expand their clinical knowledge, skills and experience in all aspects of small animal practice, working under supervision in a multidisciplinary referral hospital",
      url: "https://www.rvc.ac.uk/study/postgraduate/internships/small-animal",
      country: "UK",
      type: "internship",
      species: "small animal"
    },
    {
      title: "Royal Veterinary College Small Animal Residency Programmes",
      organisation: "Royal Veterinary College",
      description: "TThese residencies are designed for qualified veterinary graduates who wish to specialise in specific disciplines related to small animal practice. All residents are also registered for a Master's degree in Veterinary Medicine.",
      url: "https://www.rvc.ac.uk/study/postgraduate/residencies/small-animal",
      country: "UK",
      type: "residency",
      species: "small animal"
    },
    {
      title: "University of Liverpool Rotating Internship Programme",
      organisation: "Univeristy of Liverpool",
      description: "Rotating internships are designed for highly motivated veterinary professionals who wish to develop their skills, experience and knowledge by working under supervision in a multi-disciplinary referral hospital to prepare them for entry to a residency programme.",
      url: "https://www.liverpool.ac.uk/sath/teaching/postgraduates/internships/",
      country: "UK",
      type: "internship",
      species: "small animal"
    },
    {
      title: "University of Liverpool Anaesthesia Internship Programme",
      organisation: "Univeristy of Liverpool",
      description: "Rotating internships are designed for highly motivated veterinary professionals who wish to develop their skills, experience and knowledge by working under supervision in a multi-disciplinary referral hospital to prepare them for entry to a residency programme.",
      url: "https://www.liverpool.ac.uk/sath/teaching/postgraduates/internships/",
      country: "UK",
      type: "internship",
      species: "small animal"
    },
    {
      title: "University of Liverpool Small Animal Residency Programme",
      organisation: "Univeristy of Liverpool",
      description: "The Small Animal Teaching Hospital (SATH) offers several residency programmes designed for veterinarians who wish to specialise in specific disciplines related to small animal practice. They provide first class, world-renowned training for veterinary specialisation.",
      url: "https://www.liverpool.ac.uk/sath/teaching/postgraduates/residencies/#:~:text=The%20Small%20Animal%20Teaching%20Hospital,renowned%20training%20for%20veterinary%20specialisation.",
      country: "UK",
      type: "residency",
      species: "small animal"
    },
    {
      title: "University of Cambridge Rotating Internship Programme",
      organisation: "Univeristy of Cambridge",
      description: "The Internship programme provides an opportunity for qualified veterinarians to obtain high-quality, post-graduate training in a large range of small animal disciplines. The objectives of the Programme are to enhance participants' clinical, diagnostic, problem-solving, communication, and technical skills, and to prepare the interns to advance to a Senior Clinical Training Programme and subsequent specialism should you wish or to head back into general practice with increased confidence to practice to a high standard of care.",
      url: "https://www.vet.cam.ac.uk/study/cts/jcts1/smallanimal",
      country: "UK",
      type: "internship",
      species: "small animal"
    },
    {
      title: "University of Cambridge Senior Clinical Training Scholarship / Residency Programme",
      organisation: "Univeristy of Cambridge",
      description: "The Internship programme provides an opportunity for qualified veterinarians to obtain high-quality, post-graduate training in a large range of small animal disciplines. The objectives of the Programme are to enhance participants' clinical, diagnostic, problem-solving, communication, and technical skills, and to prepare the interns to advance to a Senior Clinical Training Programme and subsequent specialism should you wish or to head back into general practice with increased confidence to practice to a high standard of care.",
      url: "https://www.vet.cam.ac.uk/study/cts/jcts1/smallanimal",
      country: "UK",
      type: "residency",
      species: "small animal"
    },
    {
      title: "University of Edinburgh Rotating Internship Programme",
      organisation: "Univeristy of Edinburgh",
      description: "53 week Rotating Internship programme provides an opportunity for new graduates or recently-qualified veterinarians to receive high-quality postgraduate training in small animal disciplines under the supervision of experienced clinicians in the R(D)SVS Hospital for Small Animals.",
      url: "https://vet.ed.ac.uk/clinical/vacancies/rotating-interns",
      country: "UK",
      type: "internship",
      species: "small animal"
    },
    {
      title: "University of Edinburgh Residency / Clinical Scholarship Programme",
      organisation: "Univeristy of Edinburgh",
      description: "The Professional Doctorate in Veterinary Medicine will provide an opportunity for qualified veterinary surgeons to undertake a period of advanced clinical training in a chosen specialty under the guidance and supervision of the Royal College of Veterinary Surgeons and European/ American veterinary specialists.",
      url: "https://vet.ed.ac.uk/clinical/vacancies/clinicalscholarships",
      country: "UK",
      type: "residency",
      species: "small animal"
    },
    {
      title: "University of Glasgow Small Animal Internship Programme",
      organisation: "Univeristy of Glasgow",
      description: "",
      url: "https://www.gla.ac.uk/explore/jobs/appointments/sahvacancies/",
      country: "UK",
      type: "internship",
      species: "small animal"
    },
    {
      title: "University of Glasgow Small Animal Internship Programme",
      organisation: "Univeristy of Glasgow",
      description: "",
      url: "https://www.gla.ac.uk/explore/jobs/appointments/sahvacancies/",
      country: "UK",
      type: "residency",
      species: "small animal"
    },
    {
      title: "IVC Evidensia Rotating and Discipline Specific Internships",
      organisation: "IVC Evidensia, various locations",
      description: "The Internship programmes provides an opportunity for qualified veterinarians to obtain training in a large range of small animal disciplines.",
      url: "https://ivcevidensia.co.uk/careers?roles=8",
      country: "UK",
      type: "internship",
      species: "small animal"
    },
    {
      title: "IVC Evidensia Small Animal Residency Programmes",
      organisation: "IVC Evidensia, various locations",
      description: "The residency programmes provides an opportunity for qualified veterinarians to obtain specialised training working towards diplomat status in their chosen discpline.",
      url: "https://ivcevidensia.co.uk/careers?roles=9",
      country: "UK",
      type: "residency",
      species: "small animal"
    },
    {
      title: "IVC Evidensia Small Animal Residency Programmes",
      organisation: "IVC Evidensia, various locations",
      description: "The residency programmes provides an opportunity for qualified veterinarians to obtain specialised training working towards diplomat status in their chosen discpline.",
      url: "https://ivcevidensia.co.uk/careers?roles=9",
      country: "UK",
      type: "residency",
      species: "small animal"
    },
    {
      title: "Linnaeus Small Animal Rotating and Displine Specific Internships",
      organisation: "Linnaeus Group, various locations",
      description: "Rotating and discipline specific internships providing an opportunity for qualified veterinarians to obtain training in a large range of small animal disciplines.",
      url: "https://www.linnaeusgroup.co.uk/careers/internships",
      country: "UK",
      type: "internship",
      species: "small animal"
    },
    {
      title: "Linnaeus Small Animal Residency Programmes",
      organisation: "Linnaeus Group, various locations",
      description: "Residency programmes providing an opportunity for qualified veterinarians to obtain specialised training working towards diplomat status in their chosen discpline.",
      url: "https://www.linnaeusgroup.co.uk/careers/vacancies?role=6",
      country: "UK",
      type: "residency",
      species: "small animal"
    },
    {
      title: "CVS Small Animal Rotating and Discpline Specific Internship Programmes",
      organisation: "CVS Group, various locations",
      description: "Give exposure to referral practice and a broad range of specialist disciplines working alongside world-class nurses, vets and specialists",
      url: "https://cvs-referrals.com/careers/internship/",
      country: "UK",
      type: "internship",
      species: "small animal"
    },
    {
      title: "CVS Small Animal Residency Programmes",
      organisation: "CVS Group, various locations",
      description: "Residency programmes providing an opportunity for qualified veterinarians to obtain specialised training working towards diplomat status in their chosen discpline.",
      url: "https://cvs-referrals.com/careers/residencies/",
      country: "UK",
      type: "residency",
      species: "small animal"
    },
    {
      title: "BEVA Recognised Equine Internship",
      organisation: "BEVA",
      description: "All BEVA recognised internships have agreed to a set of core standards that ensure interns receive the right training and are treated fairly.",
      url: "https://www.beva.org.uk/New-Vet-Grads/Recognised-Internships",
      country: "Worldwide",
      type: "internship",
      species: "equine"
    },
    {
      title: "ECVS Residency Training",
      organisation: "European College of Veterinary Surgeons",
      description: "Advanced surgical training programs leading to board certification in veterinary surgery.",
      url: "https://www.ecvs.org/ecvs-for/residents.php",
      country: "Europe",
      type: "residency",
      species: "small animal"
    },
    {
      title: "ECVP Residency Programme",
      organisation: "European College of Veterinary Pathologists",
      description: "Specialized training in veterinary pathology leading to board certification.",
      url: "https://www.ecvpath.org/resident-registration",
      country: "Europe",
      type: "residency",
      species: "mixed"
    },
    {
      title: "The Ralph Veterinary Residency Programme",
      organisation: "The Ralph",
      description: "Various residency programs in collaboration with European colleges.",
      url: "https://theralph.vet/join-team-ralph/",
      country: "UK",
      type: "residency",
      species: "small animal"
    },
    {
      title: "The Ralph Veterinary Internship Programmes",
      organisation: "The Ralph",
      description: "Various rotating and discpline specific programs.",
      url: "https://theralph.vet/join-team-ralph/",
      country: "UK",
      type: "residency",
      species: "small animal"
    },
    {
      title: "ECVIM-CA Residency Programmes",
      organisation: "ECVIM",
      description: "Specialized residency training programs in internal medicine at various veterinary institutes.",
      url: "https://ecvim-ca.college/residency-vacancies/",
      country: "Europe",
      type: "residency",
      species: "small animal",
    },
    {
      title: "European College of Veterinary Microbiology (ECVM) Residency Programmes",
      organisation: "ECVM",
      description: "Specialized residency training programs in microbiology at various veterinary institutes.",
      url: "https://ecvmicro.org/training-centers/",
      country: "Europe",
      type: "residency",
      species: "small animal",
    },
    {
      title: "European College of Veterinary Anaesthesia and Analgesia Residency Programmes",
      organisation: "ECVAA",
      description: "Specialized residency training programs in anaesthesia and analgesia at various veterinary institutes.",
      url: "https://www.ecvaa.org/ecvaa/training-centers-list",
      country: "Europe",
      type: "residency",
      species: "small animal",
    },
    {
      title: "European College of Veterinary and Comparative Nutrition",
      organisation: "ECVCN",
      description: "Specialized residency training programs in nutrition at various veterinary institutes.",
      url: "https://www.ecvcn.org/why-become-resident-why-become-supervisor",
      country: "Europe",
      type: "residency",
      species: "small animal",
    },
    {
      title: "European College of Veterinary Clinical Pathology",
      organisation: "ECVCP",
      description: "Specialized residency training programs in clinical pathology at various veterinary institutes.",
      url: "https://www.esvcp.org/open-positions.html",
      country: "Europe",
      type: "residency",
      species: "small animal",
    },
    {
      title: "European College of Veterinary Dermatology",
      organisation: "ECVD",
      description: "Specialized residency training programs in veterinary dermatology at various veterinary institutes.",
      url: "https://www.ecvd.org/programmes/start-your-residency/",
      country: "Europe",
      type: "residency",
      species: "small animal",
    },
    {
      title: "European College of Veterinary Diagnostic Imaging",
      organisation: "ECVDI",
      description: "Specialized residency training programs in veterinary diagnostic imaging at various veterinary institutes.",
      url: "https://www.ecvdi.org/training-centers-list",
      country: "Europe",
      type: "residency",
      species: "small animal",
    },
    {
      title: "European College of Veterinary Emergency and Critical Care",
      organisation: "ECVECC",
      description: "Specialized residency training programs in veterinary emergency and critical care at various veterinary institutes.",
      url: "https://www.ecvecc.org/resident-training-facilities",
      country: "Europe, New Zealand",
      type: "residency",
      species: "small animal",
    },
    {
      title: "European College of Veterinary Neurology",
      organisation: "ECVN",
      description: "Specialized residency training programs in veterinary neurology at various veterinary institutes.",
      url: "https://www.ecvn.org/general-information/open-residency-position",
      country: "Europe",
      type: "residency",
      species: "small animal",
    },
     {
      title: "European College of Veterinary Ophthalmologists",
      organisation: "ECVO",
      description: "Specialized internship and residency training programs in veterinary ophthalmology at various veterinary institutes.",
      url: "https://www.ecvo.eu/residents/training-job-opportunities-for-interns-residents.html",
      country: "Europe",
      type: "intern, residency",
      species: "small animal",
    },
  ];

  // Unique species and types for filter dropdowns
  const speciesList = [
    "All Species",
    "Small Animal",
    "Equine",
    "Exotic",
    "Farm/Mixed",
    "Mixed"
  ];
  const typeList = [
    "All Types",
    "internship",
    "residency"
  ];

  // Filter state
  const [selectedSpecies, setSelectedSpecies] = useState("All Species");
  const [selectedType, setSelectedType] = useState("All Types");

  // Filtering logic
  const filteredPrograms = programs.filter(program => {
    // Species filter (checks if selected species is in the program.species string)
    const speciesMatch =
      selectedSpecies === "All Species" ||
      program.species.toLowerCase().includes(selectedSpecies.toLowerCase());

    // Type filter
    const typeMatch =
      selectedType === "All Types" ||
      program.type.toLowerCase() === selectedType.toLowerCase();

    return speciesMatch && typeMatch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Helmet>
        <title>Veterinary Internships & Residencies | VetNextStep</title>
        <meta name="description" content="Browse veterinary internships and residencies in the UK, Europe, and North America. Find rotating internships, specialist residencies, and VIRMP programs for new vet graduates." />
        <link rel="canonical" href="https://www.vetnextstep.com/internships-residencies" />
        <meta property="og:title" content="Veterinary Internships & Residencies | VetNextStep" />
        <meta property="og:description" content="Find rotating internships, specialist residencies, and VIRMP programs for veterinary graduates across the UK, Europe, and North America." />
        <meta property="og:url" content="https://www.vetnextstep.com/internships-residencies" />
        <meta property="og:type" content="website" />
      </Helmet>
      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-lg md:text-xl">V</span>
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">VetNextStep</h1>
                <p className="hidden sm:block text-sm text-gray-600">Your Veterinary Career Compass</p>
              </div>
            </Link>
            <Link
              to="/"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 md:px-6 rounded-lg transition-colors duration-200 flex items-center text-sm md:text-base"
            >
              <svg className="w-4 h-4 mr-1 md:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="hidden sm:inline">Back to Home</span>
              <span className="sm:hidden">Home</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-8 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">Internships & Residencies</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Specialized training opportunities for advanced veterinary education and board certification preparation.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-10 justify-center">
            <select
              value={selectedSpecies}
              onChange={e => setSelectedSpecies(e.target.value)}
              className="px-4 py-2 rounded-lg border border-blue-300 focus:ring-2 focus:ring-blue-500"
            >
              {speciesList.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <select
              value={selectedType}
              onChange={e => setSelectedType(e.target.value)}
              className="px-4 py-2 rounded-lg border border-blue-300 focus:ring-2 focus:ring-blue-500"
            >
              {typeList.map(t => (
                <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredPrograms.map((program, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">{program.title}</h2>
                  <span className="self-start px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium whitespace-nowrap">
                    {program.country}
                  </span>
                </div>
                <p className="text-gray-700 mb-4">
                  <strong className="text-blue-600">Organisation:</strong> {program.organisation}
                </p>
                <p className="text-gray-700 mb-4">
                  <strong className="text-blue-600">Type:</strong> {program.type.charAt(0).toUpperCase() + program.type.slice(1)}
                </p>
                <p className="text-gray-700 mb-4">
                  <strong className="text-blue-600">Species:</strong> {program.species}
                </p>
                <p className="text-gray-600 mb-6 leading-relaxed">{program.description}</p>
                <a
                  href={program.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  Visit Programme
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
};

export default InternshipsResidencies;
