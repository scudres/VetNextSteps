import React from "react";
import { Link } from "react-router-dom";

// Deliberately carries no section index. The mega-menu in SharedHeader lists
// the whole site; repeating it here was the third copy of the same list.
const SharedFooter = () => (
  <footer className="bg-navy text-blue-100 mt-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-9">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="flex items-center gap-3">
          <img src="/favicon.svg" alt="" className="w-10 h-10" />
          <div>
            <p className="text-lg font-bold text-white leading-tight">VetNextStep</p>
            <p className="text-xs">Veterinary career progression</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <Link to="/about"   className="underline underline-offset-2 hover:text-white">About VetNextStep</Link>
          <Link to="/contact" className="underline underline-offset-2 hover:text-white">Contact</Link>
          <Link to="/resources" className="underline underline-offset-2 hover:text-white">Useful resources</Link>
        </div>
      </div>

      <p className="mt-7 pt-6 border-t border-white/15 text-xs leading-relaxed max-w-3xl">
        All content on VetNextStep is for informational purposes only and does not constitute legal,
        immigration, or professional advice. Always verify licensing, visa, and registration requirements
        directly with the relevant regulatory body. Information is not real-time — check official sources
        before making career or financial decisions.
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
        <span>&copy; 2025–present VetNextStep.</span>
        <Link to="/legal?tab=terms"   className="underline underline-offset-2 hover:text-white">Terms of Use</Link>
        <Link to="/legal?tab=privacy" className="underline underline-offset-2 hover:text-white">Privacy Policy</Link>
        <Link to="/legal?tab=cookies" className="underline underline-offset-2 hover:text-white">Cookies</Link>
        <Link to="/legal?tab=ip"      className="underline underline-offset-2 hover:text-white">Copyright</Link>
      </div>
    </div>
  </footer>
);

export default SharedFooter;
