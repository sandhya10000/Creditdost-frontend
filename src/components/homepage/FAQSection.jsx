import React, { useState } from "react";
import { Link } from "react-router-dom";

const faqs = [
  {
    id: 1,
    question: "What is Credit Score?",
    answer:
      "A credit score is a 3-digit numeric score that determines your credit worthiness. Your credit score typically falls between 300-900, and the higher your score the stronger is your credit worthiness.",
  },
  {
    id: 2,
    question: "How is credit score calculated?",
    answer:
      "Your credit score is derived from your past history on:\n• Amount of debt\n• Repayment of loans, credit cards\n• Number of open credit lines\n• Type and sub-type of loans\n• Tenure of loans\n• Recency of inquiry for new credit line",
  },
  {
    id: 3,
    question: "Who calculates my credit score?",
    answer:
      "In India, there are 4 credit information companies or credit bureaus licensed by the Reserve Bank of India (RBI):\n1. CIBIL (300-900)\n2. Equifax (300-900)\n3. Experian (300-900)\n4. CRIF Highmark (300-900)",
  },
  {
    id: 4,
    question: "How do I check my credit score?",
    answer:
      "On Credit Dost, you can get your credit score here absolutely free. Alternatively, you can go to the websites of any of the 4 licensed credit bureaus in India, fill in your details and request for a credit score upon payment of a nominal fee.",
  },
  {
    id: 5,
    question: "Why is my credit score important?",
    answer:
      "While evaluating your loan application, Banks and financial institutions use credit bureaus to obtain your credit history. A good credit score makes it easier for you to secure loans or extended credit lines with better terms.",
  },
  {
    id: 6,
    question: "What is a good credit score?",
    answer:
      "A credit score of 750 or above is considered a good credit score. It helps you qualify for loans or credit cards better because it gives your potential lenders more confidence in approving your requests for loans and other credit.",
  },
  {
    id: 7,
    question: "What are the disadvantages of bad credit score?",
    answer:
      "A credit score of 650 or lower is considered low and 400 or lower is considered bad. With such scores:\n• You get loans at very high interest rates\n• You delay building your wealth because a lot of it goes towards repaying high interest",
  },
  {
    id: 8,
    question: "Can I improve my credit score?",
    answer:
      "Yes you can improve your credit score if you take conscious and consistent measures to improve it. However, credit scores do not get impacted immediately after you have prepaid a loan or paid up any outstanding dues. It takes at least 45-60 days for your credit score to climb.",
  },
  {
    id: 9,
    question: "How soon can I expect my credit score to increase?",
    answer:
      "Resolution of an open credit line takes about 15 days to impact your credit score. We estimate an average 15 days for your credit score to improve after you have resolved one or more open credit lines.",
  },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* FAQ Left Header & Stats */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 font-label-code text-xs text-cyan-400 mb-3">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              <span>CREDIT EDUCATION</span>
            </div>
            <h2 className="font-headline-lg text-3xl sm:text-4xl text-white font-bold tracking-tight font-['Sora'] leading-tight">
              Frequently Asked <br />
              Questions
            </h2>
            <p className="font-body-md text-sm sm:text-base text-slate-300 mt-3 leading-relaxed">
              Get answers to all your credit score related questions. Understanding your credit is the first step towards financial freedom.
            </p>
          </div>

          {/* 4 Trust & Experience Stat Cards (from original FAQ section) */}
          <div className="grid grid-cols-2 gap-3.5 pt-2">
            <div className="p-4 rounded-2xl bg-[#09152e]/80 border border-slate-800/80 hover:border-cyan-500/30 transition-all flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-xl">group</span>
              </div>
              <div>
                <div className="text-white font-bold text-base leading-none font-['Sora']">10000+</div>
                <div className="text-slate-400 text-xs mt-1">Happy Customers</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#09152e]/80 border border-slate-800/80 hover:border-sky-500/30 transition-all flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-xl">account_balance</span>
              </div>
              <div>
                <div className="text-white font-bold text-base leading-none font-['Sora']">200+</div>
                <div className="text-slate-400 text-xs mt-1">Financial Partners</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#09152e]/80 border border-slate-800/80 hover:border-emerald-500/30 transition-all flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-xl">verified</span>
              </div>
              <div>
                <div className="text-white font-bold text-base leading-none font-['Sora']">98%</div>
                <div className="text-slate-400 text-xs mt-1">Success Rate</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#09152e]/80 border border-slate-800/80 hover:border-purple-500/30 transition-all flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-xl">workspace_premium</span>
              </div>
              <div>
                <div className="text-white font-bold text-base leading-none font-['Sora']">500+</div>
                <div className="text-slate-400 text-xs mt-1">Consultants Trained</div>
              </div>
            </div>
          </div>

          {/* Quick Contact Box */}
          <div className="p-5 rounded-2xl glass-panel-elevated border border-cyan-500/20 flex flex-col gap-2.5 shadow-[0_0_20px_rgba(0,210,255,0.08)]">
            <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm">
              <span className="material-symbols-outlined text-lg">help</span>
              <span>Still have questions about your score?</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Our credit counselors review your report line-by-line and clarify every doubt.
            </p>
            <Link
              to="/contact"
              className="text-xs text-cyan-400 hover:text-white flex items-center gap-1 transition-colors pt-1 font-semibold"
            >
              <span>Speak to a Credit Advisor</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
        </div>

        {/* FAQ Right Accordions */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.id}
                className={`rounded-2xl transition-all duration-200 border ${
                  isOpen
                    ? "bg-[#0c1a36]/90 border-cyan-500/40 shadow-[0_0_25px_rgba(0,210,255,0.12)]"
                    : "bg-[#071328]/70 border-slate-800/80 hover:border-slate-700 hover:bg-[#0a1833]/80"
                }`}
              >
                <button
                  type="button"
                  className="w-full flex items-center justify-between text-left p-5 font-['Sora'] text-white font-semibold text-sm sm:text-base gap-4 cursor-pointer"
                  onClick={() => toggleFaq(index)}
                  aria-expanded={isOpen}
                >
                  <span className={isOpen ? "text-cyan-400 font-bold" : "text-slate-100"}>
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${
                      isOpen
                        ? "bg-cyan-500 text-slate-950 rotate-180 shadow-[0_0_12px_rgba(0,210,255,0.5)]"
                        : "bg-slate-800 text-cyan-400"
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">expand_more</span>
                  </div>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-slate-300 text-xs sm:text-sm leading-relaxed whitespace-pre-line border-t border-slate-800/60 mt-1">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
