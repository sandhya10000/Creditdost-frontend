import React from "react";

const HistorySection = () => {
  return (
    <section className="w-full py-16 lg:py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Story & Mission */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 font-label-code text-xs text-cyan-400 mb-3">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span>OUR JOURNEY</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white font-['Sora'] tracking-tight leading-tight">
                Empowering Financial Futures
              </h2>
            </div>

            <div className="space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed">
              <p>
                <strong className="text-white font-semibold">Credit Dost</strong> is a premier credit education and credit score improvement organization in India, founded by <strong className="text-white font-semibold">Mr. Nitin Verma</strong>, with a clear commitment to fostering financial inclusion and responsible credit literacy.
              </p>
              <p>
                Through years of hands-on engagement with banks, NBFCs, and credit bureaus, Mr. Verma noticed an urgent systemic challenge: hardworking citizens were frequently rejected for home loans, personal finance, and credit cards—not because of genuine inability to repay, but because of incorrect bureau reporting, unresolved clerical errors, and a total lack of transparent credit guidance.
              </p>
              <p>
                To solve this, Credit Dost was established in 2020 as an ethical, statutory-compliant advisory firm. Today, we empower thousands of borrowers across all Indian states to understand their credit rights, dispute errors legally under RBI frameworks, and systematically improve their credit standing.
              </p>
            </div>

            {/* Mission Highlight Card */}
            <div className="p-6 rounded-2xl glass-panel border border-cyan-500/30 relative overflow-hidden shadow-[0_0_25px_rgba(0,210,255,0.1)]">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-cyan-400 to-sky-500" />
              <div className="flex items-center gap-2.5 text-cyan-400 font-semibold text-base mb-2 font-['Sora']">
                <span className="material-symbols-outlined text-xl">flag</span>
                <h3>Our Mission</h3>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">
                To enable individuals, families, and entrepreneurs to achieve enduring financial stability through accurate credit education, ethical remediation, and legally sound bureau dispute solutions.
              </p>
            </div>
          </div>

          {/* Right Column: Founder Profile & Message */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Founder Card */}
            <div className="rounded-3xl glass-panel-elevated border border-slate-700/80 p-6 sm:p-8 relative overflow-hidden shadow-2xl">
              <div className="absolute -top-16 -right-16 w-48 h-48 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

              {/* Founded Badge */}
              <div className="flex items-center justify-between mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-semibold">
                  <span>ESTD. 2020</span>
                </div>
                <span className="text-xs text-slate-400 font-mono">LEADERSHIP</span>
              </div>

              {/* Founder Image & Details */}
              <div className="flex flex-col sm:flex-row items-center gap-5 mb-6">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-2 border-cyan-500/40 shrink-0 shadow-[0_0_20px_rgba(0,210,255,0.2)]">
                  <img
                    src="/images/about-h-new.jpeg"
                    alt="Mr. Nitin Verma - Founder & Director"
                    className="w-full h-full object-cover object-top"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/images/hero-new.png";
                    }}
                  />
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="text-xl font-bold text-white font-['Sora']">
                    Nitin Verma
                  </h3>
                  <p className="text-cyan-400 text-sm font-medium mt-0.5">
                    Founder &amp; Director
                  </p>
                  <p className="text-slate-400 text-xs mt-1">
                    Credit Rights Advocate &amp; Financial Strategist
                  </p>
                  <a
                    href="https://linkedin.com/in/itsnitinverma"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#0077b5] hover:bg-[#006097] text-white text-xs font-semibold transition-all hover:scale-105"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                    <span>Connect on LinkedIn</span>
                  </a>
                </div>
              </div>

              {/* Founder's Message */}
              <div className="p-4 rounded-xl bg-[#061022]/80 border border-slate-800/80 text-xs text-slate-300 leading-relaxed italic relative">
                <span className="material-symbols-outlined text-cyan-400/40 text-2xl absolute top-2 right-2">
                  format_quote
                </span>
                "Our vision at Credit Dost is simple: to make credit education understandable, accessible, and practical for every Indian. True empowerment comes when people understand how credit works and have the legal recourse to protect it."
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HistorySection;
