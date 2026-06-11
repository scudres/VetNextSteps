import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import VeterinaryCareerHub from "./components/VeterinaryCareerHub";
import TrainingPrograms from "./components/TrainingPrograms";
import InternshipsResidencies from "./components/InternshipsResidencies";
import PostgraduateCertificates from "./components/PostgraduateCertificates";
import UKPage from "./components/UKPage";
import USAPage from "./components/USAPage";
import CanadaPage from "./components/CanadaPage";
import AustraliaPage from "./components/AustraliaPage";

function App() {
  return (
    <HelmetProvider>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<VeterinaryCareerHub />} />
            <Route path="/training-programs" element={<TrainingPrograms />} />
            <Route path="/internships-residencies" element={<InternshipsResidencies />} />
            <Route path="/postgraduate-certificates" element={<PostgraduateCertificates />} />
            <Route path="/uk" element={<UKPage />} />
            <Route path="/usa" element={<USAPage />} />
            <Route path="/canada" element={<CanadaPage />} />
            <Route path="/australia" element={<AustraliaPage />} />
          </Routes>
        </BrowserRouter>
      </div>
    </HelmetProvider>
  );
}

export default App;
