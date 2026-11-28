import React from "react";
import { Link } from "react-router-dom";

const TestimonialsSection = () => {
  return (
    <>
      {/* SECTION 6: VERIFIED CUSTOMER TESTIMONIALS */}
      <section className="w-full py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="font-label-code text-xs text-primary-container uppercase tracking-widest block mb-2">
              Verified Transformations
            </span>
            <h2 className="font-headline-lg text-3xl sm:text-4xl text-white font-bold tracking-tight">
              Real People. Real Journeys. Real Results.
            </h2>
            <p className="font-body-lg text-sm sm:text-base text-on-surface-variant mt-2">
              See how our legal interventions lifted consumers from loan rejections to dream approvals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="rounded-3xl glass-panel p-7 border border-outline-variant/30 flex flex-col justify-between hover:border-primary-container/40 transition-all">
              <div>
                <div className="flex items-center gap-1 text-primary-container mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className="material-symbols-outlined text-lg"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                  ))}
                </div>
                <p className="font-body-md text-sm text-on-surface italic mb-6 leading-relaxed">
                  "A closed credit card from 2019 was still showing as 'Active with 90 Days Overdue'. Credit Dost drafted statutory notices to the bank's Nodal Officer. In 28 days, my CIBIL score jumped from 640 to 765, and my home loan was sanctioned!"
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-outline-variant/20">
                <div className="w-11 h-11 rounded-full bg-primary-container/20 border border-primary-container/40 text-primary-container flex items-center justify-center font-bold text-sm">
                  NK
                </div>
                <div>
                  <div className="font-title-md text-sm text-white font-bold">Neha Kapoor</div>
                  <div className="font-body-sm text-xs text-on-surface-variant">
                    Mumbai • Home Loan Approved
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="rounded-3xl glass-panel p-7 border border-outline-variant/30 flex flex-col justify-between hover:border-tertiary/40 transition-all">
              <div>
                <div className="flex items-center gap-1 text-tertiary mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className="material-symbols-outlined text-lg"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                  ))}
                </div>
                <p className="font-body-md text-sm text-on-surface italic mb-6 leading-relaxed">
                  "I started a Credit Dost partner franchise as a fintech venture. The comprehensive training, bureau API integrations, and legal escalation framework allowed me to build a dependable business serving 50+ clients monthly."
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-outline-variant/20">
                <div className="w-11 h-11 rounded-full bg-tertiary/20 border border-tertiary/40 text-tertiary flex items-center justify-center font-bold text-sm">
                  AV
                </div>
                <div>
                  <div className="font-title-md text-sm text-white font-bold">Amit Verma</div>
                  <div className="font-body-sm text-xs text-on-surface-variant">
                    Delhi NCR • Franchise Partner
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="rounded-3xl glass-panel p-7 border border-outline-variant/30 flex flex-col justify-between hover:border-secondary/40 transition-all">
              <div>
                <div className="flex items-center gap-1 text-secondary mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className="material-symbols-outlined text-lg"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                  ))}
                </div>
                <p className="font-body-md text-sm text-on-surface italic mb-6 leading-relaxed">
                  "Identity theft led to 4 fake micro-loan hard inquiries, degrading my score by 85 points. Credit Dost drafted legal notices under Section 21(3) of CICRA 2005. All unauthorized records were purged within 35 days."
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-outline-variant/20">
                <div className="w-11 h-11 rounded-full bg-secondary/20 border border-secondary/40 text-secondary flex items-center justify-center font-bold text-sm">
                  RS
                </div>
                <div>
                  <div className="font-title-md text-sm text-white font-bold">Rajesh Sundaram</div>
                  <div className="font-body-sm text-xs text-on-surface-variant">
                    Bengaluru • Identity Theft Rectified
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: FINANCIAL INSIGHTS & ARTICLES */}
      <section className="w-full py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="font-label-code text-xs text-primary-container uppercase tracking-widest block mb-2">
                Knowledge Centre
              </span>
              <h2 className="font-headline-lg text-3xl sm:text-4xl text-white font-bold tracking-tight">
                Building Better Financial Acumen
              </h2>
            </div>
            <Link
              to="/blogs"
              className="font-title-md text-sm text-primary-container hover:text-white flex items-center gap-1.5 mt-4 md:mt-0 transition-colors"
            >
              <span>View All Advisory Articles</span>
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Article 1 */}
            <div className="group rounded-3xl glass-panel overflow-hidden border border-outline-variant/30 hover:border-primary-container/40 transition-all flex flex-col">
              <Link
                to="/blog/the-90-day-dpd-mistake-that-damages-credit-for-7-years"
                className="w-full h-48 relative overflow-hidden block"
              >
                <img
                  alt="Calendar marked with 90 days delay"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-85"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJz4JanP4mNkJegqkE_V5lwCUGtl_NBlJRNjV-wFQ6l6XasmBFXKCXPzIhAGD1joFsQSpTuq2cLJLqPqePh_svxBTuoEvcdR4ej6J6mfe2cjtWBw7fQDT3zqG_0djWv-HZGHPoMNaufdXkuT3y7vsPuvRToCjgYvy-p801vU1W9_vw0R-cxL3tZxE_-7M45uuN2UWJ_ffVXfCOkLCscPz2YeeR7TikLGiXXf4ajyQ"
                />
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-error-container text-error font-label-code text-xs border border-error/30 font-semibold">
                  Critical Alert
                </span>
              </Link>
              <div className="p-6 flex flex-col justify-between flex-1">
                <div>
                  <div className="flex items-center gap-3 text-on-surface-variant font-label-code text-xs mb-2">
                    <span>By Legal Counsel</span>
                    <span>•</span>
                    <span>4 Min Read</span>
                  </div>
                  <h3 className="font-headline-sm text-lg text-white font-bold mb-3 group-hover:text-primary-container transition-colors">
                    <Link to="/blog/the-90-day-dpd-mistake-that-damages-credit-for-7-years">
                      The 90-Day DPD Mistake That Damages Credit for 7 Years
                    </Link>
                  </h3>
                  <p className="font-body-md text-xs sm:text-sm text-on-surface-variant line-clamp-2">
                    Understand how a single delayed EMI or credit card minimum payment triggers non-performing tags that remain on CIBIL records without formal intervention.
                  </p>
                </div>
                <Link
                  to="/blog/the-90-day-dpd-mistake-that-damages-credit-for-7-years"
                  className="mt-6 font-title-md text-sm text-primary-container group-hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span>Read Full Analysis</span>
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </Link>
              </div>
            </div>

            {/* Article 2 */}
            <div className="group rounded-3xl glass-panel overflow-hidden border border-outline-variant/30 hover:border-primary-container/40 transition-all flex flex-col">
              <Link
                to="/blog/is-fd-based-credit-card-the-biggest-credit-score-myth-in-india"
                className="w-full h-48 relative overflow-hidden block"
              >
                <img
                  alt="Credit card on fixed deposit certificate"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-85"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAbqYdayvoaG9_Rk30t9M9kTNSSpNZucC6dTFaY5vLXL8oYhxznFra2VIVFgKmHlsAeXtpYgJxnfFPPK-D9tlwz8gWn4CQmzVJMlwUWCKXYFQuoH5byvJCCe2_3NQOHXvxHkk6sIaAipiME53VcFvD_2Xrs_7uJtnrIjzs272O-LYypJr9HwLSkmhbd1NtZwOXFWmHZdyXacSXsOrHfqNVnEjipS_ZbFoHTDKTyFOo"
                />
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-secondary-container/80 text-secondary font-label-code text-xs border border-secondary/30 font-semibold">
                  Myth Buster
                </span>
              </Link>
              <div className="p-6 flex flex-col justify-between flex-1">
                <div>
                  <div className="flex items-center gap-3 text-on-surface-variant font-label-code text-xs mb-2">
                    <span>By Credit Dost Advisory</span>
                    <span>•</span>
                    <span>3 Min Read</span>
                  </div>
                  <h3 className="font-headline-sm text-lg text-white font-bold mb-3 group-hover:text-primary-container transition-colors">
                    <Link to="/blog/is-fd-based-credit-card-the-biggest-credit-score-myth-in-india">
                      Is an FD-Backed Credit Card the Best Way to Rebuild Score?
                    </Link>
                  </h3>
                  <p className="font-body-md text-xs sm:text-sm text-on-surface-variant line-clamp-2">
                    Secured credit cards help establish fresh payment records, but fail to eliminate existing historical disputes. Here is the exact strategy to combine both.
                  </p>
                </div>
                <Link
                  to="/blog/is-fd-based-credit-card-the-biggest-credit-score-myth-in-india"
                  className="mt-6 font-title-md text-sm text-primary-container group-hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span>Read Full Analysis</span>
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </Link>
              </div>
            </div>

            {/* Article 3 */}
            <div className="group rounded-3xl glass-panel overflow-hidden border border-outline-variant/30 hover:border-primary-container/40 transition-all flex flex-col">
              <Link
                to="/blog/the-dark-side-of-loan-apps-how-5000-instant-loans-destroy-long-term-credit"
                className="w-full h-48 relative overflow-hidden block"
              >
                <img
                  alt="Smartphone with loan app notifications"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-85"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA-2JtUDd6JReUglo3rthBPy2GlKf6y635me5f_7il_tcnYojdoBx-YeB2RWJxEntj01mkGFwaWM4tb73RfyWOQZ6dV3z-gKtvSrjZZMeitUzfUzfo_1g1RTYhQQ1PTOEi__3iakpNiR-AlWmfCtxq3qRaAB-13qXv6M3Nc2sRWBltN6avIlJPYDFAP9EUwTeZoEpwbYE7lfYmox2SCnuZDQzPRFJKInM3_lB68Paw"
                />
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-primary-container/20 text-primary-container font-label-code text-xs border border-primary-container/30 font-semibold">
                  Instant Loans
                </span>
              </Link>
              <div className="p-6 flex flex-col justify-between flex-1">
                <div>
                  <div className="flex items-center gap-3 text-on-surface-variant font-label-code text-xs mb-2">
                    <span>By Compliance Desk</span>
                    <span>•</span>
                    <span>5 Min Read</span>
                  </div>
                  <h3 className="font-headline-sm text-lg text-white font-bold mb-3 group-hover:text-primary-container transition-colors">
                    <Link to="/blog/the-dark-side-of-loan-apps-how-5000-instant-loans-destroy-long-term-credit">
                      The Dark Side of Instant Lending Apps: Ruining CIBIL Scores
                    </Link>
                  </h3>
                  <p className="font-body-md text-xs sm:text-sm text-on-surface-variant line-clamp-2">
                    How ₹5,000 instant personal loans trigger excessive bureau inquiries and uncoordinated multi-lender reporting that damages your creditworthiness.
                  </p>
                </div>
                <Link
                  to="/blog/the-dark-side-of-loan-apps-how-5000-instant-loans-destroy-long-term-credit"
                  className="mt-6 font-title-md text-sm text-primary-container group-hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span>Read Full Analysis</span>
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default TestimonialsSection;
