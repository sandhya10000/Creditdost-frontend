import React from "react";
import { Link } from "react-router-dom";

const reasons = [
  {
    icon: "badge",
    title: "Experienced Bureau Specialists",
    description: "Deep credit-bureau dispute expertise with a proven track record in resolving complex CIBIL issues.",
  },
  {
    icon: "gavel",
    title: "100% Legally Compliant",
    description: "Every dispute adheres strictly to statutory rights under Section 21 of CICRA 2005 and RBI regulations.",
  },
  {
    icon: "tune",
    title: "Tailored Case Roadmaps",
    description: "Customized strategies built around your exact loan settlement, DPD status, or bureau inaccuracies.",
  },
  {
    icon: "trending_up",
    title: "High Resolution Rate",
    description: "Demonstrated success in expunging false late marks, wrongful written-offs, and unauthorized inquiries.",
  },
  {
    icon: "schedule",
    title: "Continuous Progress Tracking",
    description: "Clear milestone updates throughout every phase of bank nodal and bureau correspondence.",
  },
  {
    icon: "public",
    title: "Pan-India Dedicated Support",
    description: "Direct representation across 200+ partner banks, NBFCs, and financial institutions nationwide.",
  },
];

const WhyChooseUsSection = () => {
  return (
    <section className="w-full py-16 lg:py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 font-label-code text-xs text-cyan-400 mb-3">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>WHY CHOOSE US</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white font-['Sora'] tracking-tight">
            The Credit Dost Advantage
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mt-3 leading-relaxed">
            Why thousands of borrowers across India trust Credit Dost to restore their credit reputation and unlock prime loan approvals.
          </p>
        </div>

        {/* 6 Advantage Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((item, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-7 rounded-2xl glass-panel border border-slate-800/80 hover:border-cyan-500/40 hover:shadow-[0_0_25px_rgba(0,210,255,0.12)] transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                </div>
                <h3 className="text-lg font-bold text-white font-['Sora'] mb-2.5 group-hover:text-cyan-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Action Callout Banner */}
        <div className="mt-14 p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#09152e] via-[#0b1c3c] to-[#09152e] border border-cyan-500/30 shadow-[0_0_35px_rgba(0,210,255,0.15)] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-white font-['Sora']">
              Ready to Restore Your Credit Health?
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
              Get an instant assessment of your credit score across all four Indian bureaus with zero negative impact.
            </p>
          </div>
          <Link
            to="/credit-check"
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 via-[#0084ff] to-[#0052ff] text-slate-950 font-bold text-sm shadow-[0_0_20px_rgba(0,210,255,0.35)] hover:scale-105 active:scale-95 transition-all shrink-0 text-center"
          >
            Check Free Bureau Score
          </Link>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;
