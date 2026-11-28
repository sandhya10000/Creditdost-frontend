import React from "react";
import { Link } from "react-router-dom";

const WhoWeAreSection = () => {
  return (
    <section className="w-full py-16 lg:py-20 bg-[#060c1d]/60 border-y border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 font-label-code text-xs text-cyan-400 mb-3">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span>WHO WE ARE</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white font-['Sora'] tracking-tight leading-tight">
                Your Trusted Partner in Credit Score Improvement
              </h2>
            </div>

            <div className="space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed">
              <p>
                At <strong className="text-white font-semibold">Credit Dost</strong>, we firmly believe that a past financial stumble or a bureaucratic reporting glitch should never define your future. Everyone deserves an honest, transparent second chance to rebuild their financial creditworthiness.
              </p>
              <p>
                We are India's premier dedicated credit repair and dispute advocacy firm. Our specialized team coordinates directly with lending institutions and all four RBI-licensed bureaus (CIBIL, Experian, Equifax, and CRIF High Mark) to ensure that erroneous late entries, outdated settlement records, and fraudulent inquiries are permanently removed.
              </p>
            </div>

            {/* Core Capability Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#09152e]/80 border border-slate-800/80">
                <span className="material-symbols-outlined text-emerald-400 text-lg mt-0.5 shrink-0">
                  check_circle
                </span>
                <span className="text-xs sm:text-sm text-slate-200">
                  Statutory dispute authority under Section 21 of CICRA 2005
                </span>
              </div>
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#09152e]/80 border border-slate-800/80">
                <span className="material-symbols-outlined text-cyan-400 text-lg mt-0.5 shrink-0">
                  check_circle
                </span>
                <span className="text-xs sm:text-sm text-slate-200">
                  Line-by-line report audits covering all 4 licensed Indian bureaus
                </span>
              </div>
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#09152e]/80 border border-slate-800/80">
                <span className="material-symbols-outlined text-sky-400 text-lg mt-0.5 shrink-0">
                  check_circle
                </span>
                <span className="text-xs sm:text-sm text-slate-200">
                  Zero score impact—all bureau checks performed as Soft Inquiries
                </span>
              </div>
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#09152e]/80 border border-slate-800/80">
                <span className="material-symbols-outlined text-purple-400 text-lg mt-0.5 shrink-0">
                  check_circle
                </span>
                <span className="text-xs sm:text-sm text-slate-200">
                  Direct submission to Bank Principal Nodal &amp; Ombudsman Desks
                </span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/credit-check"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 via-[#0084ff] to-[#0052ff] text-slate-950 font-bold text-sm shadow-[0_0_20px_rgba(0,210,255,0.35)] hover:scale-[1.02] active:scale-95 transition-all w-fit"
              >
                <span>Check Your Credit Report Now</span>
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </Link>
            </div>
          </div>

          {/* Right Column - Visual Graphic Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-md rounded-3xl overflow-hidden glass-panel-elevated border border-slate-700/80 relative shadow-2xl">
              <div className="w-full h-80 relative overflow-hidden">
                <img
                  src="/images/about-hero.jpg"
                  alt="Every Point Matters - Credit Dost"
                  className="w-full h-full object-cover brightness-90 hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/images/hero-new.png";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#060c1d] via-[#060c1d]/30 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 font-mono text-xs font-semibold">
                    DISPUTE RESOLUTION
                  </span>
                  <h4 className="text-xl font-bold text-white font-['Sora'] mt-2">
                    Every Point Matters.
                  </h4>
                  <p className="text-xs text-slate-300 mt-1">
                    We turn unfair credit rejections into clear bank approvals.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhoWeAreSection;
