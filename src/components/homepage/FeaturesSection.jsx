import React from "react";
import { Link } from "react-router-dom";

const FeaturesSection = () => {
  return (
    <>
      {/* SECTION 3: CORE COMPREHENSIVE SOLUTIONS (3-Column Bento Grid) */}
      <section className="w-full py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="font-label-code text-xs text-primary-container uppercase tracking-widest block mb-2">
                Our Comprehensive Solutions
              </span>
              <h2 className="font-headline-lg text-3xl sm:text-4xl text-white tracking-tight font-bold">
                Innovate to Dominate Your Financial Standing
              </h2>
            </div>
            <div className="mt-4 md:mt-0 flex gap-2">
              <span className="font-label-code text-xs text-on-surface-variant flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-high border border-outline-variant/30">
                <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse"></span>
                End-to-End Resolution Pipeline
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Solution Card 1 */}
            <div className="group rounded-3xl glass-panel p-7 border border-outline-variant/30 hover:border-primary-container/50 hover:shadow-[0_0_30px_rgba(0,210,255,0.15)] transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-primary-container/10 border border-primary-container/30 text-primary-container flex items-center justify-center group-hover:scale-105 group-hover:bg-primary-container/20 transition-all shadow-[0_0_15px_rgba(0,210,255,0.2)]">
                    <span className="material-symbols-outlined text-3xl">build_circle</span>
                  </div>
                  <span className="font-label-code text-xs px-3 py-1 rounded-full bg-tertiary/15 text-tertiary border border-tertiary/30 font-semibold">
                    Fast-Track Legal
                  </span>
                </div>
                <h3 className="font-headline-md text-xl text-white font-bold mb-2">
                  Credit Score Repair &amp; DPD Rectification
                </h3>
                <p className="font-body-md text-sm text-on-surface-variant mb-6 leading-relaxed">
                  Expert credit restoration services that draft institutional notices, purge erroneous late-payment tags, and transform damaging "Settled/Written-Off" accounts into healthy "Closed" portfolios.
                </p>
                <div className="w-full h-44 rounded-2xl overflow-hidden mb-6 relative border border-outline-variant/30">
                  <img
                    alt="Desktop screen showing bureau dispute platform"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-90"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCr7DX7DWjmp81g0h0UFCMfSGanjQcWqTrHsT1_cspbnRxKT9p8Cqvn4qZ66Ylk6r4c_x7pFHaH5jBlyAs8C1SdTMnpEY7Pn9V7zUR-i_fbee0LBnftDiS_ONqu5EcU1_elWTiT4IUWOmkXLTHNHVRN9iGXRHajL_cxdpbyt7euiM8m1rA0POlcKNJNelaJNAdGIiQ2hwtDAOFcMzxbT42Xkt7RmdZ6Hv71mEduLEM"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/40 to-transparent flex items-end p-4">
                    <span className="text-primary-container font-label-code text-xs font-semibold">
                      Expunge 90+ DPD Flags Permanently
                    </span>
                  </div>
                </div>
              </div>
              <Link
                to="/credit-score-repair"
                className="inline-flex items-center gap-2 font-title-md text-sm text-primary-container group-hover:text-white group-hover:translate-x-1 transition-all"
              >
                <span>Fix My Credit Now</span>
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </Link>
            </div>

            {/* Solution Card 2 */}
            <div className="group rounded-3xl glass-panel p-7 border border-outline-variant/30 hover:border-primary-container/50 hover:shadow-[0_0_30px_rgba(0,210,255,0.15)] transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-secondary/15 border border-secondary/30 text-secondary flex items-center justify-center group-hover:scale-105 group-hover:bg-secondary/25 transition-all shadow-[0_0_15px_rgba(180,197,255,0.2)]">
                    <span className="material-symbols-outlined text-3xl">query_stats</span>
                  </div>
                  <span className="font-label-code text-xs px-3 py-1 rounded-full bg-primary-container/15 text-primary-container border border-primary-container/30 font-semibold">
                    High ROI Model
                  </span>
                </div>
                <h3 className="font-headline-md text-xl text-white font-bold mb-2">
                  Franchise Partner Program
                </h3>
                <p className="font-body-md text-sm text-on-surface-variant mb-6 leading-relaxed">
                  Partner with India’s leading credit remediation authority. Build a scalable, high-margin fintech consulting practice supported by automated bureau crawlers, comprehensive training, and backend legal support.
                </p>
                <div className="w-full h-44 rounded-2xl overflow-hidden mb-6 relative border border-outline-variant/30">
                  <img
                    alt="Modern fintech partner workspace"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-90"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCK-01lTjGsgBPJJOPb_hoCSct4NfR7nSP9cuCamomai_6P9hNMEfscuhl00EY5K68q2-CbxU0yg2dwdK9LPGIs01wqPKFnhDsJqUrM4l_AuFgoitNwSGTC9UdQ2ae5Scb6Z88RhTZGc0Ppj6IFTwVAU0sM2cJv410pxwryOP2DwE5JEpqVQL2YACdkU6hQlrrJL6sXRa9DQmGtF58b_OMrABPEKInw34y1mBZj8A0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/40 to-transparent flex items-end p-4">
                    <span className="text-tertiary font-label-code text-xs font-semibold">
                      Earn Up To ₹1.5L/Month Net
                    </span>
                  </div>
                </div>
              </div>
              <Link
                to="/franchise-opportunity"
                className="inline-flex items-center gap-2 font-title-md text-sm text-primary-container group-hover:text-white group-hover:translate-x-1 transition-all"
              >
                <span>Apply for Franchise</span>
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </Link>
            </div>

            {/* Solution Card 3 */}
            <div className="group rounded-3xl glass-panel p-7 border border-outline-variant/30 hover:border-primary-container/50 hover:shadow-[0_0_30px_rgba(0,210,255,0.15)] transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-tertiary/15 border border-tertiary/30 text-tertiary flex items-center justify-center group-hover:scale-105 group-hover:bg-tertiary/25 transition-all shadow-[0_0_15px_rgba(58,250,172,0.2)]">
                    <span className="material-symbols-outlined text-3xl">speed</span>
                  </div>
                  <span className="font-label-code text-xs px-3 py-1 rounded-full bg-secondary-container/40 text-secondary border border-secondary/30 font-semibold">
                    Multi-Bureau Check
                  </span>
                </div>
                <h3 className="font-headline-md text-xl text-white font-bold mb-2">
                  Credit Health Diagnostic &amp; Soft Pull
                </h3>
                <p className="font-body-md text-sm text-on-surface-variant mb-6 leading-relaxed">
                  Generate instant multi-bureau telemetry from CIBIL, Experian, Equifax, and CRIF. Uncover hidden DPD records, clerical misreports, and unauthorized inquiries without hurting your score.
                </p>
                <div className="w-full h-44 rounded-2xl overflow-hidden mb-6 relative border border-outline-variant/30">
                  <img
                    alt="Credit bureau telemetry diagnostic check"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-90"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAEAgN9nmTv_s2NS51huZGI9qhz1k6bFPDsfgcTJEhhg5z6TjM8Z3FXuWj3nk8GDYr1svRNes1kgT8lVRLGpXUAXH4DC7F1Ix1TrETgoUDYe8vc_MTJ7hboBASvYXxfOzgagwhjpaFubx2la5Df37bp5AHhHI6n_G8ApO5fu9Z7p_Qhusvr79yPIFmZS42nfiLkGGonI-OBYrTaaKcTtJ3IXUTYRzV_3Ezgai11_Vo"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/40 to-transparent flex items-end p-4">
                    <span className="text-secondary font-label-code text-xs font-semibold">
                      Zero Bureau Negative Impact
                    </span>
                  </div>
                </div>
              </div>
              <Link
                to="/credit-check"
                className="inline-flex items-center gap-2 font-title-md text-sm text-primary-container group-hover:text-white group-hover:translate-x-1 transition-all"
              >
                <span>Check Credit Health</span>
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default FeaturesSection;
