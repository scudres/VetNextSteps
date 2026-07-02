import React from "react";
import { Link } from "react-router-dom";

const SharedFooter = () => (
  <footer className="bg-gray-900 text-white py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center space-x-3 mb-4">
            <img src="/favicon.svg" alt="VetNextStep logo" className="w-10 h-10" />
            <h3 className="text-xl font-bold">VetNextStep</h3>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            Career progression tools for vets at every stage — licensing guides, CPD, conferences, internships, residencies, and postgraduate certificates.
          </p>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-gray-400">
            <li><Link to="/training-programs" className="hover:text-white transition-colors">Graduate Programmes</Link></li>
            <li><Link to="/?tab=countries" className="hover:text-white transition-colors">Licensing Info</Link></li>
            <li><Link to="/internships-residencies" className="hover:text-white transition-colors">Internships</Link></li>
            <li><Link to="/postgraduate-certificates" className="hover:text-white transition-colors">Certificates</Link></li>
            <li><Link to="/cpd" className="hover:text-white transition-colors">CPD & Conferences</Link></li>
            <li><Link to="/jobs" className="hover:text-white transition-colors">Job Opportunities</Link></li>
            <li><Link to="/resources" className="hover:text-white transition-colors">Useful Resources</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4">Countries</h4>
          <ul className="space-y-2 text-gray-400">
            <li><Link to="/australia" className="hover:text-white transition-colors">Australia</Link></li>
            <li><Link to="/canada" className="hover:text-white transition-colors">Canada</Link></li>
            <li><Link to="/uk" className="hover:text-white transition-colors">United Kingdom</Link></li>
            <li><Link to="/usa" className="hover:text-white transition-colors">United States</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4">Resources</h4>
          <ul className="space-y-2 text-gray-400">
            <li><a href="https://www.icva.net/navle/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">NAVLE</a></li>
            <li><a href="https://www.virmp.org/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">MATCH</a></li>
            <li><a href="https://www.rcvs.org.uk/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">RCVS</a></li>
            <li><a href="https://www.rcvs.org.uk/lifelong-learning/veterinary-graduate-development-programme-vetgdp/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">RCVS VetGDP</a></li>
            <li><a href="https://www.avma.org/education/foreign/information-foreign-veterinary-graduates-working-veterinarian-us" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">AVMA Foreign Guide</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 mt-8 pt-6 pb-2 flex justify-center">
        <Link to="/contact" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Contact VetNextStep
        </Link>
      </div>
      <div className="pt-6 text-center text-gray-400">
        <p className="mb-1 text-xs text-gray-500 max-w-2xl mx-auto leading-relaxed">
          All content on VetNextStep is for informational purposes only and does not constitute legal, immigration, or professional advice. Always verify licensing, visa, and registration requirements directly with the relevant regulatory body. Information is not real-time — check official sources before making career or financial decisions.
        </p>
        <p className="mb-3">&copy; 2025–present VetNextStep.</p>
        <p className="text-xs space-x-3">
          <Link to="/legal?tab=terms"   className="hover:text-white underline">Terms of Use</Link>
          <span>&middot;</span>
          <Link to="/legal?tab=privacy" className="hover:text-white underline">Privacy Policy</Link>
          <span>&middot;</span>
          <Link to="/legal?tab=cookies" className="hover:text-white underline">Cookies</Link>
          <span>&middot;</span>
          <Link to="/legal?tab=ip"      className="hover:text-white underline">Copyright</Link>
        </p>
      </div>
    </div>
  </footer>
);

export default SharedFooter;
