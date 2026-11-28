import React from "react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative w-full overflow-hidden pt-[104px] pb-12 lg:pt-[112px] lg:pb-16 border-b border-slate-800/80">
      {/* Background glow accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-10 right-10 w-[400px] h-[300px] bg-sky-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-6">
          <Link to="/" className="hover:text-cyan-400 transition-colors">
            Home
          </Link>
          <span className="text-slate-600">/</span>
          <span className="text-cyan-400 font-semibold">About Us</span>
        </div>

        {/* Hero Content */}
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs mb-4 shadow-[0_0_15px_rgba(0,210,255,0.15)]">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>ABOUT CREDIT DOST • WHO WE ARE</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight font-['Sora'] leading-[1.15] mb-5">
            Empowering Millions Across India to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-emerald-400">
              Reclaim Their Credit Freedom.
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-3xl mb-8">
            Founded in 2020 by <strong>Mr. Nitin Verma</strong>, Credit Dost was established with a singular mission: to ensure that hardworking individuals are never denied loans or financial opportunities because of bank clerical mistakes, unfair delayed entries, or lack of credit literacy.
          </p>

          {/* Quick Credential Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-2">
            <div className="p-3.5 rounded-xl bg-[#071328]/80 border border-slate-800/80 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-lg">calendar_month</span>
              </div>
              <div>
                <div className="text-white font-bold text-sm leading-none font-['Sora']">2020</div>
                <div className="text-slate-400 text-xs mt-0.5">Founded</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#071328]/80 border border-slate-800/80 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-lg">verified_user</span>
              </div>
              <div>
                <div className="text-white font-bold text-sm leading-none font-['Sora']">10,000+</div>
                <div className="text-slate-400 text-xs mt-0.5">Profiles Restored</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#071328]/80 border border-slate-800/80 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-lg">travel_explore</span>
              </div>
              <div>
                <div className="text-white font-bold text-sm leading-none font-['Sora']">All 4 Bureaus</div>
                <div className="text-slate-400 text-xs mt-0.5">CIBIL, Experian, etc.</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#071328]/80 border border-slate-800/80 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-lg">gavel</span>
              </div>
              <div>
                <div className="text-white font-bold text-sm leading-none font-['Sora']">100% Legal</div>
                <div className="text-slate-400 text-xs mt-0.5">CICRA 2005 Compliant</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
