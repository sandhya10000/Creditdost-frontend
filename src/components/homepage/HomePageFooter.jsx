import React from "react";
import { Link } from "react-router-dom";

const HomePageFooter = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full bg-[#040814] text-slate-300 border-t border-slate-800/80 pt-16 pb-8 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12">
          {/* Brand & Contact Column */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <Link to="/" className="inline-block w-fit">
              <img
                alt="Credit Dost Logo"
                className="h-9 w-auto object-contain brightness-110"
                src="/images/white-logo.png"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/images/cred.png";
                }}
              />
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Credit Dost is a dedicated financial service point offering credit score repair, loan assistance, and financial support services.
            </p>

            {/* Contact Info (without address) */}
            <div className="flex flex-col gap-2.5 pt-1 text-sm">
              <a
                href="mailto:info@creditdost.co.in"
                className="flex items-center gap-2.5 text-slate-300 hover:text-cyan-400 transition-colors w-fit"
              >
                <span className="material-symbols-outlined text-cyan-400 text-lg">mail</span>
                <span>info@creditdost.co.in</span>
              </a>
              <a
                href="tel:+919217469202"
                className="flex items-center gap-2.5 text-slate-300 hover:text-cyan-400 transition-colors w-fit"
              >
                <span className="material-symbols-outlined text-cyan-400 text-lg">call</span>
                <span>+91 92174-69202</span>
              </a>
            </div>

            {/* Social Media Links */}
            <div className="flex items-center gap-2.5 pt-2">
              <a
                href="https://www.facebook.com/aapkacreditdost"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 hover:border-cyan-500/50 hover:bg-cyan-500 hover:text-slate-950 flex items-center justify-center text-slate-300 transition-all hover:scale-105"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://x.com/aapkacreditdost"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
                className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 hover:border-cyan-500/50 hover:bg-cyan-500 hover:text-slate-950 flex items-center justify-center text-slate-300 transition-all hover:scale-105"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/aapkacreditdost"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 hover:border-cyan-500/50 hover:bg-cyan-500 hover:text-slate-950 flex items-center justify-center text-slate-300 transition-all hover:scale-105"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/company/aapkacreditdost"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 hover:border-cyan-500/50 hover:bg-cyan-500 hover:text-slate-950 flex items-center justify-center text-slate-300 transition-all hover:scale-105"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
              <a
                href="http://www.youtube.com/@aapkacreditdost"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 hover:border-cyan-500/50 hover:bg-cyan-500 hover:text-slate-950 flex items-center justify-center text-slate-300 transition-all hover:scale-105"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Services */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <span className="font-['Sora'] text-sm font-semibold text-white tracking-wide">
              Services
            </span>
            <div className="flex flex-col gap-2.5 pt-1">
              <Link
                to="/credit-score-repair"
                className="text-sm text-slate-400 hover:text-cyan-400 hover:translate-x-1 transition-all"
              >
                Credit Score Repair
              </Link>
              <Link
                to="/franchise-opportunity"
                className="text-sm text-slate-400 hover:text-cyan-400 hover:translate-x-1 transition-all"
              >
                Franchise Opportunity
              </Link>
              <Link
                to="/credit-check"
                className="text-sm text-slate-400 hover:text-cyan-400 hover:translate-x-1 transition-all"
              >
                Free Credit Report
              </Link>
            </div>
          </div>

          {/* Column 3: Financial Tools */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <span className="font-['Sora'] text-sm font-semibold text-white tracking-wide">
              Financial Tools
            </span>
            <div className="flex flex-col gap-2.5 pt-1">
              <Link
                to="/credit-check"
                className="text-sm text-slate-400 hover:text-cyan-400 hover:translate-x-1 transition-all"
              >
                Free Credit Report
              </Link>
              <Link
                to="/emi-calculator"
                className="text-sm text-slate-400 hover:text-cyan-400 hover:translate-x-1 transition-all"
              >
                EMI Calculator
              </Link>
              <Link
                to="/ifsc-finder"
                className="text-sm text-slate-400 hover:text-cyan-400 hover:translate-x-1 transition-all"
              >
                IFSC Finder
              </Link>
            </div>
          </div>

          {/* Column 4: Quick Links */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <span className="font-['Sora'] text-sm font-semibold text-white tracking-wide">
              Quick Links
            </span>
            <div className="flex flex-col gap-2.5 pt-1">
              <Link
                to="/about"
                className="text-sm text-slate-400 hover:text-cyan-400 hover:translate-x-1 transition-all"
              >
                About Us
              </Link>
              <Link
                to="/contact"
                className="text-sm text-slate-400 hover:text-cyan-400 hover:translate-x-1 transition-all"
              >
                Contact Us
              </Link>
              <Link
                to="/careers"
                className="text-sm text-slate-400 hover:text-cyan-400 hover:translate-x-1 transition-all"
              >
                Careers
              </Link>
              <Link
                to="/blogs"
                className="text-sm text-slate-400 hover:text-cyan-400 hover:translate-x-1 transition-all"
              >
                Blog
              </Link>
            </div>
          </div>

          {/* Column 5: Legal */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <span className="font-['Sora'] text-sm font-semibold text-white tracking-wide">
              Legal
            </span>
            <div className="flex flex-col gap-2.5 pt-1">
              <Link
                to="/privacy-policy"
                className="text-sm text-slate-400 hover:text-cyan-400 hover:translate-x-1 transition-all"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms-and-conditions"
                className="text-sm text-slate-400 hover:text-cyan-400 hover:translate-x-1 transition-all"
              >
                Terms of Service
              </Link>
              <Link
                to="/disclaimer"
                className="text-sm text-slate-400 hover:text-cyan-400 hover:translate-x-1 transition-all"
              >
                Disclaimer
              </Link>
              <Link
                to="/refund-policy"
                className="text-sm text-slate-400 hover:text-cyan-400 hover:translate-x-1 transition-all"
              >
                Refund Policy
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Scroll-to-Top Button */}
        <div className="pt-8 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <p>© 2026 Credit Dost. All rights reserved.</p>
          <button
            onClick={scrollToTop}
            aria-label="Back to top"
            className="w-10 h-10 rounded-full bg-[#0891b2] hover:bg-cyan-400 text-white hover:text-slate-950 flex items-center justify-center transition-all shadow-[0_0_15px_rgba(8,145,178,0.4)] hover:scale-105 active:scale-95 cursor-pointer shrink-0"
          >
            <span className="material-symbols-outlined text-xl">expand_less</span>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default HomePageFooter;
