import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

import VeterinaryCareerHub from "./components/VeterinaryCareerHub";
import TrainingPrograms from "./components/TrainingPrograms";
import InternshipsResidencies from "./components/InternshipsResidencies";
import PostgraduateCertificates from "./components/PostgraduateCertificates";
import UKPage from "./components/UKPage";
import USAPage from "./components/USAPage";
import CanadaPage from "./components/CanadaPage";
import AustraliaPage from "./components/AustraliaPage";
import LegalPage from "./components/LegalPage";
import SearchResults from "./components/SearchResults";
import CPDPage from "./components/CPDPage";
import CPDProviders from "./components/CPDProviders";
import JobsPage from "./components/JobsPage";
import ContactPage from "./components/ContactPage";

// Disable browser scroll restoration so we control it entirely
if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    // If there's a hash anchor, let SharedHeader handle the scroll
    if (hash) return;
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

function App() {
  return (
    <HelmetProvider>
      <div className="App">
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/"                                        element={<VeterinaryCareerHub />} />
            <Route path="/training-programs"                       element={<TrainingPrograms />} />
            <Route path="/training-programs/:country"              element={<TrainingPrograms />} />
            <Route path="/internships-residencies"                              element={<InternshipsResidencies />} />
            <Route path="/internships-residencies/:region"                    element={<InternshipsResidencies />} />
            <Route path="/internships-residencies/:region/:subCategory"       element={<InternshipsResidencies />} />
            <Route path="/postgraduate-certificates"               element={<PostgraduateCertificates />} />
            <Route path="/postgraduate-certificates/:country"      element={<PostgraduateCertificates />} />
            <Route path="/uk"                                      element={<UKPage />} />
            <Route path="/usa"                                     element={<USAPage />} />
            <Route path="/canada"                                  element={<CanadaPage />} />
            <Route path="/australia"                               element={<AustraliaPage />} />
            <Route path="/legal"                                   element={<LegalPage />} />
            <Route path="/search"                                  element={<SearchResults />} />
            <Route path="/cpd"                                     element={<CPDPage />} />
            <Route path="/cpd/providers"                           element={<CPDProviders />} />
            <Route path="/cpd/providers/:country"                  element={<CPDProviders />} />
            <Route path="/cpd/:region"                             element={<CPDPage />} />
            <Route path="/jobs"                                    element={<JobsPage />} />
            <Route path="/contact"                                 element={<ContactPage />} />
          </Routes>
        </BrowserRouter>
      </div>
    </HelmetProvider>
  );
}

export default App;
