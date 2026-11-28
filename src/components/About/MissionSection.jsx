import React from "react";

const values = [
  {
    icon: "visibility",
    title: "Transparency",
    description: "Every step is explained clearly. No fine print, no hidden charges, and no unrealistic promises.",
  },
  {
    icon: "balance",
    title: "Integrity",
    description: "Strictly lawful, RBI-compliant practices. We never compromise on ethical credit remediation.",
  },
  {
    icon: "favorite",
    title: "Empathy",
    description: "We understand that financial stress affects real lives, so we treat every client with utmost respect.",
  },
  {
    icon: "psychology",
    title: "Innovation",
    description: "Smart algorithmic dispute drafting and automated bureau tracking for faster, verifiable results.",
  },
  {
    icon: "verified",
    title: "Results",
    description: "Tangible credit score improvements and permanent expungement of inaccurate liabilities.",
  },
];

const MissionSection = () => {
  return (
    <section className="w-full py-16 lg:py-20 bg-[#060c1d]/60 border-y border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Mission & Vision Cards */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 font-label-code text-xs text-cyan-400 mb-3">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span>OUR MISSION &amp; VALUES</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white font-['Sora'] tracking-tight leading-tight">
                Building Financial Confidence
              </h2>
              <p className="text-slate-300 text-sm sm:text-base mt-3 leading-relaxed">
                We believe financial freedom begins with knowing your rights and having an advocate in your corner.
              </p>
            </div>

            {/* Mission Card */}
            <div className="p-6 rounded-2xl glass-panel border border-cyan-500/30 relative overflow-hidden shadow-[0_0_20px_rgba(0,210,255,0.08)]">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-xl">flag</span>
              </div>
              <h3 className="text-lg font-bold text-white font-['Sora'] mb-2">Our Mission</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                To empower Indian citizens and entrepreneurs to overcome credit barriers by delivering accurate bureau literacy, ethical dispute remediation, and sustainable financial empowerment.
              </p>
            </div>

            {/* Vision Card */}
            <div className="p-6 rounded-2xl glass-panel border border-emerald-500/30 relative overflow-hidden shadow-[0_0_20px_rgba(52,211,153,0.08)]">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-xl">rocket_launch</span>
              </div>
              <h3 className="text-lg font-bold text-white font-['Sora'] mb-2">Our Vision</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                To be India’s most trusted credit advocacy ecosystem—bridging the information divide between borrowers and financial institutions with integrity, empathy, and statutory rigor.
              </p>
            </div>
          </div>

          {/* Right Column: 5 Core Values */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <h3 className="text-xl font-bold text-white font-['Sora'] mb-2">
              The Principles That Guide Us
            </h3>

            <div className="space-y-3.5">
              {values.map((val, idx) => (
                <div
                  key={idx}
                  className="p-4 sm:p-5 rounded-2xl bg-[#09152e]/80 border border-slate-800/80 hover:border-cyan-500/30 transition-all flex items-start gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-xl">{val.icon}</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-base font-['Sora'] mb-1">
                      {val.title}
                    </h4>
                    <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                      {val.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionSection;
