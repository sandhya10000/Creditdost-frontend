import React from "react";
import { Link } from "react-router-dom";

const HeroSection = () => {

  return (
    <>
      {/* HERO SECTION */}
      <section
        className="relative w-full overflow-hidden flex items-center min-h-[calc(100vh-84px)] pt-[84px] pb-8 lg:pt-[84px] lg:pb-10"
        style={{
          backgroundColor: "#040b1c",
          backgroundImage:
            "radial-gradient(900px 700px at 82% 50%, rgba(14, 116, 144, 0.28), transparent 60%), radial-gradient(600px 400px at 15% 15%, rgba(14, 116, 144, 0.12), transparent 50%)",
        }}
      >
        <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12 grid items-center">
          {/* Custom Desktop & Responsive Grid */}
          <div className="w-full grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_540px] gap-8 xl:gap-[48px] items-center">
            {/* Left Hero Column */}
            <div className="w-full flex flex-col z-10 pt-2 lg:pt-4">
              <div
                className="inline-flex items-center gap-2 rounded-full bg-[#081b3a]/80 border border-cyan-500/30 text-cyan-400 font-mono w-fit shadow-[0_0_15px_rgba(0,210,255,0.15)]"
                style={{
                  fontSize: "11.5px",
                  padding: "8px 14px",
                  marginBottom: "20px",
                }}
              >
                <span className="inline-block w-2 h-2 rounded-full bg-[#34d399] shadow-[0_0_8px_#34d399] animate-pulse"></span>
                <span>CICRA 2005 STATUTORY DISPUTE FRAMEWORK</span>
              </div>

              <h1
                className="text-white font-['Sora']"
                style={{
                  fontSize: "clamp(38px, 3.7vw, 54px)",
                  fontWeight: 600,
                  lineHeight: 1.08,
                  letterSpacing: "-0.025em",
                  marginBottom: "18px",
                }}
              >
                Reclaim Your Credit Score. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-emerald-400">
                  Turn Loan Rejections <br className="hidden xl:inline" />
                  into Easy Approvals.
                </span>
              </h1>

              <p
                className="font-normal"
                style={{
                  fontSize: "17px",
                  lineHeight: 1.65,
                  maxWidth: "600px",
                  color: "#a9b8d4",
                  marginBottom: "26px",
                }}
              >
                Wrong late marks, fake loan inquiries, and old settlement tags quietly hurt your credit score and block loan approvals. Credit Dost works legally with banks and credit bureaus to remove unfair negative entries permanently.
              </p>

              {/* CTA Action Cluster */}
              <div className="flex flex-wrap items-center gap-[12px] pb-6">
                <Link
                  to="/credit-check"
                  className="inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-cyan-400 via-[#0084ff] to-[#0052ff] text-slate-950 font-bold shadow-[0_0_25px_rgba(0,210,255,0.45)] hover:scale-[1.02] active:scale-95 transition-all shrink-0"
                  style={{
                    padding: "14px 24px",
                    fontSize: "15px",
                  }}
                >
                  <span className="material-symbols-outlined text-xl">download</span>
                  <span>Download Free Bureau Report</span>
                </Link>
                <Link
                  to="/credit-check"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#09152e]/90 border border-slate-700 hover:border-cyan-400 text-white font-semibold hover:bg-slate-800 transition-all shrink-0"
                  style={{
                    padding: "14px 24px",
                    fontSize: "15px",
                  }}
                >
                  <span className="material-symbols-outlined text-cyan-400">bolt</span>
                  <span>Check Free Score in 2 Mins</span>
                </Link>
              </div>

              {/* Trust Credentials Strip */}
              <div className="pt-5 grid grid-cols-3 gap-2 sm:gap-4 border-t border-slate-800/80 max-w-[600px]">
                <div className="flex items-center gap-2 text-slate-300 text-xs sm:text-sm">
                  <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center text-cyan-400 border border-cyan-500/20 shrink-0">
                    <span className="material-symbols-outlined text-sm">verified_user</span>
                  </div>
                  <span>256-Bit Bank Vault</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300 text-xs sm:text-sm">
                  <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center text-emerald-400 border border-emerald-500/20 shrink-0">
                    <span className="material-symbols-outlined text-sm">shield</span>
                  </div>
                  <span>Zero Bureau Impact</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300 text-xs sm:text-sm">
                  <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center text-sky-400 border border-sky-500/20 shrink-0">
                    <span className="material-symbols-outlined text-sm">support_agent</span>
                  </div>
                  <span>Pan-India Legal Desk</span>
                </div>
              </div>
            </div>

            {/* Right Hero Column: Reserved blank space for future content */}
            <div className="w-full min-h-[400px] xl:min-h-[600px] flex justify-center items-center py-0" />
          </div>
        </div>
      </section>

      {/* SECTION 2: ABOUT US INTRODUCTORY SECTION */}
      <section className="w-full py-12 lg:py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="glass-panel rounded-3xl p-6 sm:p-10 lg:p-12 border border-outline-variant/40 shadow-2xl relative overflow-hidden">
            {/* Glow accents */}
            <div className="absolute -right-24 -top-24 w-96 h-96 bg-primary-container/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -left-24 -bottom-24 w-96 h-96 bg-tertiary/10 rounded-full blur-3xl pointer-events-none"></div>

            {/* Top Header Block */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-8 border-b border-outline-variant/20 relative z-10">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs mb-3 shadow-[0_0_15px_rgba(0,210,255,0.12)]">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                  <span>WHO WE ARE • ABOUT CREDIT DOST</span>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl text-white font-bold tracking-tight font-['Sora'] leading-tight">
                  Your Trusted Partner to Repair Credit Scores and Restore Loan Approvals
                </h2>
                <p className="text-slate-300 text-sm sm:text-base mt-3 leading-relaxed">
                  Millions of hardworking people face loan rejections simply because of bank clerical mistakes, wrong late-payment entries, or old settled accounts still showing as overdue. At Credit Dost, we believe everyone deserves a second chance to rebuild their financial health with honesty, simplicity, and dignity.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0 w-full sm:w-auto">
                <Link
                  to="/about"
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 via-[#0084ff] to-[#0052ff] text-slate-950 font-bold text-sm shadow-[0_0_20px_rgba(0,210,255,0.35)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <span>Know Our Full Story</span>
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </Link>
                <Link
                  to="/credit-check"
                  className="px-6 py-3 rounded-xl bg-[#09152e]/90 border border-slate-700 hover:border-cyan-400 text-white font-semibold text-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-cyan-400 text-lg">verified</span>
                  <span>Free Credit Check</span>
                </Link>
              </div>
            </div>

            {/* 4 Core Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pt-8 relative z-10">
              {/* Pillar 1 */}
              <div className="p-5 rounded-2xl bg-[#071328]/70 border border-slate-800/80 hover:border-cyan-500/30 transition-all flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-xl">travel_explore</span>
                  </div>
                  <h3 className="text-white font-semibold text-base mb-2 font-['Sora']">
                    Find Hidden Mistakes
                  </h3>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                    We review all 4 official Indian credit bureaus (CIBIL, Experian, Equifax, CRIF) to uncover inaccurate entries, duplicate accounts, and wrong delayed marks.
                  </p>
                </div>
              </div>

              {/* Pillar 2 */}
              <div className="p-5 rounded-2xl bg-[#071328]/70 border border-slate-800/80 hover:border-emerald-500/30 transition-all flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-xl">gavel</span>
                  </div>
                  <h3 className="text-white font-semibold text-base mb-2 font-['Sora']">
                    100% Legal &amp; Lawful
                  </h3>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                    No false overnight promises or gray shortcuts. Every dispute is officially handled under RBI guidelines and statutory dispute laws directly with lenders.
                  </p>
                </div>
              </div>

              {/* Pillar 3 */}
              <div className="p-5 rounded-2xl bg-[#071328]/70 border border-slate-800/80 hover:border-sky-500/30 transition-all flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-xl">trending_up</span>
                  </div>
                  <h3 className="text-white font-semibold text-base mb-2 font-['Sora']">
                    Simple Growth Plan
                  </h3>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                    Get a clear, customized action plan written in plain everyday language so you know exactly how and when your credit score will bounce back.
                  </p>
                </div>
              </div>

              {/* Pillar 4 */}
              <div className="p-5 rounded-2xl bg-[#071328]/70 border border-slate-800/80 hover:border-purple-500/30 transition-all flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-xl">support_agent</span>
                  </div>
                  <h3 className="text-white font-semibold text-base mb-2 font-['Sora']">
                    Dedicated Real Help
                  </h3>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                    Our credit advisors guide you personally through every notice and update, answering all your doubts until you get your loan approval.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Support Banner */}
            <div className="mt-8 pt-5 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-400 relative z-10">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-cyan-400 text-base">headset_mic</span>
                <span>Have questions? Talk to our advisory desk: <strong className="text-white">+91 9217469202</strong> (Mon - Sat, 10 AM - 7 PM)</span>
              </div>
              <span className="text-slate-500 font-mono text-[11px]">OPTIMYSTIC AUXILIARY SERVICES PVT. LTD.</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
