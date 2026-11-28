import React from "react";
import { Link } from "react-router-dom";

const services = [
  {
    icon: "travel_explore",
    title: "Credit Report Analysis",
    description:
      "Identifying errors, clerical inaccuracies, duplicate tradelines, and dispute opportunities across CIBIL, Experian, Equifax, and CRIF reports.",
    color: "cyan",
  },
  {
    icon: "gavel",
    title: "Dispute & Correction Support",
    description:
      "Drafting and serving statutory dispute notices directly to Bank Nodal Officers and bureau redressal cells under CICRA 2005 regulations.",
    color: "emerald",
  },
  {
    icon: "task_alt",
    title: "Settlement-to-Closed Correction",
    description:
      "Coordinating formal settlement closures and obtaining legally binding Bank No-Objection Certificates (NOCs) to clear negative tags.",
    color: "sky",
  },
  {
    icon: "trending_up",
    title: "Score Improvement Programs",
    description:
      "Structured, personalized credit rebuilding roadmaps designed to help you cross the prime 750+ score threshold safely and quickly.",
    color: "purple",
  },
  {
    icon: "support_agent",
    title: "Personalized 1-on-1 Consultation",
    description:
      "Dedicated case counsel providing clear, human-level guidance without complex financial jargon at every milestone.",
    color: "teal",
  },
];

const WhatWeDoSection = () => {
  return (
    <section className="w-full py-16 lg:py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 font-label-code text-xs text-cyan-400 mb-3">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>WHAT WE DO</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white font-['Sora'] tracking-tight">
            Comprehensive Credit Solutions
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mt-3 leading-relaxed">
            Step-by-step credit repair, bureau correction, and score building programs designed for long-term financial freedom.
          </p>
        </div>

        {/* 5 Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((item, idx) => (
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

          {/* Quick CTA Card */}
          <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-[#09152e] to-[#040b1c] border border-cyan-500/30 flex flex-col justify-between shadow-[0_0_25px_rgba(0,210,255,0.1)]">
            <div>
              <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 font-mono text-xs font-semibold">
                GET STARTED
              </span>
              <h3 className="text-lg font-bold text-white font-['Sora'] mt-3 mb-2">
                Have Errors on Your Bureau Report?
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Connect with our senior dispute attorneys today for a line-by-line review of your credit liabilities.
              </p>
            </div>
            <Link
              to="/contact"
              className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-400 via-[#0084ff] to-[#0052ff] text-slate-950 font-bold text-xs shadow-[0_0_15px_rgba(0,210,255,0.3)] hover:scale-105 active:scale-95 transition-all w-fit"
            >
              <span>Book Consultation</span>
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatWeDoSection;
