import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import VeterinaryCareerHub from "./components/VeterinaryCareerHub";
import TrainingPrograms from "./components/TrainingPrograms";
import InternshipsResidencies from "./components/InternshipsResidencies";
import PostgraduateCertificates from "./components/PostgraduateCertificates";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<VeterinaryCareerHub />} />
          <Route path="/training-programs" element={<TrainingPrograms />} />
          <Route path="/internships-residencies" element={<InternshipsResidencies />} />
          <Route path="/postgraduate-certificates" element={<PostgraduateCertificates />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
