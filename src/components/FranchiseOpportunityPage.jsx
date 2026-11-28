import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "./homepage/Header";
import HomePageFooter from "./homepage/HomePageFooter";
import api from "../services/api";
import RegistrationForm from "./common/RegistrationForm";
import FranchiseSuccessStories from "./franchise/FranchiseSuccessStories.jsx";

const FranchiseOpportunityPage = () => {
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const steps = [
    {
      number: "01",
      title: "Apply Online",
      description: "Fill the quick franchise partnership enquiry form below.",
      icon: "app_registration",
    },
    {
      number: "02",
      title: "Attend Orientation",
      description: "Get a comprehensive breakdown of the business model, unit economics, and earnings.",
      icon: "co_present",
    },
    {
      number: "03",
      title: "Training & Certification",
      description: "Learn client case management, bureau dispute handling, and compliance ethically.",
      icon: "workspace_premium",
    },
    {
      number: "04",
      title: "Launch Operations",
      description: "Begin serving clients in your territory with Credit Dost's proven systems and brand trust.",
      icon: "rocket_launch",
    },
    {
      number: "05",
      title: "Scale with Support",
      description: "Expand your local network, grow recurring earnings, and lead our nationwide mission.",
      icon: "trending_up",
    },
  ];

  const partnerPerks = [
    {
      area: "Training & Certification",
      description:
        "Get structured, hands-on training to become a Certified Credit Score Repair Consultant, covering credit reports, dispute handling, compliance, and customer management.",
      icon: "school",
      badge: "Full Program",
    },
    {
      area: "Tools & CRM Platform",
      description:
        "Access ready-to-use CRM systems, dispute templates, report formats, and operational tools to manage clients efficiently from day one.",
      icon: "hub",
      badge: "SaaS Included",
    },
    {
      area: "Marketing & Growth Engine",
      description:
        "Receive co-branded creatives, digital marketing guidance, and growth strategies to help you generate leads and build local brand visibility.",
      icon: "campaign",
      badge: "Turnkey Collateral",
    },
    {
      area: "AI & Bureau Technology",
      description:
        "Leverage AI-enabled backend systems for case tracking, client progress monitoring, documentation flow, and performance insights.",
      icon: "smart_toy",
      badge: "Automated",
    },
    {
      area: "Dedicated Mentorship",
      description:
        "Benefit from ongoing mentoring, business review calls, and operational support from the Credit Dost core team to help you grow sustainably.",
      icon: "support_agent",
      badge: "1-on-1 Guidance",
    },
  ];

  const whoCanJoinList = [
    {
      title: "Financial Consultants, Bankers & Loan Agents",
      desc: "Add high-margin credit repair solutions to your existing portfolio and monetize rejected loan leads.",
      icon: "account_balance",
    },
    {
      title: "BPO, Call Centers & Service Agencies",
      desc: "Diversify and launch a high-volume financial services vertical with ready infrastructure.",
      icon: "headset_mic",
    },
    {
      title: "Entrepreneurs & Independent Professionals",
      desc: "Start an ethical, home-based or retail financial consulting business with minimal capital expenditure.",
      icon: "business_center",
    },
    {
      title: "Trainers, Coaches & Financial Educators",
      desc: "Empower your community with credit literacy while establishing a reliable recurring income stream.",
      icon: "psychology",
    },
  ];

  const supportFeatures = [
    {
      title: "Lead Generation Guidance",
      desc: "Proven customer acquisition playbooks, social campaigns, and local referral setups.",
      icon: "target",
    },
    {
      title: "Legal & CICRA 2005 Compliance",
      desc: "Official statutory dispute frameworks legally aligned with banks and Indian credit bureaus.",
      icon: "gavel",
    },
    {
      title: "Continuous Training & Modules",
      desc: "Regular updates on banking dispute guidelines, RBI consumer circulars, and new credit scoring models.",
      icon: "menu_book",
    },
    {
      title: "Digital & Offline Marketing Kits",
      desc: "Banners, standees, flyers, brochures, presentation decks, and social media templates.",
      icon: "palette",
    },
    {
      title: "Dedicated Partner Success Desk",
      desc: "Direct escalation desk to review complex credit disputes and assist with client resolutions.",
      icon: "handshake",
    },
  ];

  return (
    <div className="bg-[#080E1B] font-body-md text-slate-100 antialiased min-h-screen selection:bg-cyan-500 selection:text-slate-950 flex flex-col justify-between">
      <Header />

      <main className="w-full relative overflow-hidden pt-0 flex-grow">
        {/* ========================================================= */}
        {/* HERO SECTION WITH COVER IMAGE BACKGROUND */}
        {/* ========================================================= */}
        <section className="relative w-full overflow-hidden min-h-[580px] lg:min-h-[660px] flex items-center border-b border-cyan-500/20 pt-[80px]">
          {/* Cover Background Image Container with Adjusted Gradient Overlays to Showcase Characters */}
          <div className="absolute inset-0 z-0">
            <img
              src="/images/franchise_cover_page.png"
              alt="Franchise Opportunity Cover"
              className="w-full h-full object-cover object-[80%_18%] lg:object-[right_20%] filter brightness-[0.75] contrast-[1.08] transition-all duration-700"
            />
            {/* Smooth gradient from left to right: Dark slate on left for text legibility, transparent on right so characters are crisp */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#080E1B] via-[#080E1B]/85 sm:via-[#080E1B]/70 to-transparent lg:w-[70%]" />
            {/* Top and bottom subtle vignettes */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#080E1B] via-transparent to-[#080E1B]/60" />
          </div>

          {/* Deep Ambient Volumetric Backlights */}
          <div className="absolute top-1/4 left-10 w-[500px] h-[320px] bg-cyan-500/15 rounded-full blur-[140px] pointer-events-none z-[1]" />
          <div className="absolute bottom-10 right-1/4 w-[400px] h-[250px] bg-blue-600/15 rounded-full blur-[130px] pointer-events-none z-[1]" />

          <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 pt-6 pb-12 lg:pt-8 lg:pb-16 relative z-10">
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-4">
              <Link to="/" className="hover:text-cyan-400 transition-colors">
                Home
              </Link>
              <span className="text-slate-600">/</span>
              <span className="text-cyan-400 font-semibold">Franchise Opportunity</span>
            </div>

            <div className="max-w-2xl lg:max-w-3xl flex flex-col gap-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/75 border border-cyan-500/40 text-cyan-400 font-mono text-xs w-fit shadow-[0_0_20px_rgba(0,210,255,0.2)] backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#3afaac]" />
                <span>NATIONWIDE PARTNERSHIP PROGRAM • CICRA 2005 COMPLIANT</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-[52px] font-extrabold text-white tracking-tight font-['Sora'] leading-[1.1]">
                Franchise Opportunity with <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-emerald-400">
                  Credit Dost.
                </span>
              </h1>

              <p className="text-lg sm:text-2xl font-semibold text-cyan-200 font-['Sora']">
                Start Your Own Credit Score Repair Business
              </p>

              <p className="text-slate-300 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl font-normal">
                India’s credit awareness and financial literacy industry is surging. Credit Dost provides a battle-tested business ecosystem, proprietary CRM technology, and comprehensive legal training to help you launch a high-earning credit repair franchise.
              </p>

              {/* Hero CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <a
                  href="#franchise-form"
                  className="inline-flex items-center gap-2.5 px-8 py-3.5 sm:py-4 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 text-slate-950 font-bold text-sm sm:text-base shadow-[0_0_30px_rgba(0,210,255,0.45)] hover:scale-105 active:scale-95 transition-all"
                >
                  <span>Become a Partner</span>
                  <span className="material-symbols-outlined text-xl">arrow_forward</span>
                </a>

                <a
                  href="#how-it-works"
                  className="inline-flex items-center gap-2 px-6 py-3.5 sm:py-4 rounded-xl bg-slate-900/80 border border-slate-700 hover:border-cyan-400 text-white font-semibold text-sm sm:text-base transition-all backdrop-blur-md"
                >
                  <span>How It Works</span>
                </a>
              </div>

              {/* Franchise Snapshot Floating Pill Grid (Integrated cleanly without blocking right artwork) */}
              <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-slate-800/80 max-w-2xl text-xs sm:text-sm font-mono">
                <div className="p-2.5 sm:p-3 rounded-xl bg-slate-900/60 border border-cyan-500/20 backdrop-blur-md">
                  <div className="text-slate-400 text-[11px]">Industry Growth</div>
                  <div className="text-white font-bold">35% CAGR</div>
                </div>
                <div className="p-2.5 sm:p-3 rounded-xl bg-slate-900/60 border border-emerald-500/20 backdrop-blur-md">
                  <div className="text-slate-400 text-[11px]">Payback Period</div>
                  <div className="text-emerald-400 font-bold">30 - 60 Days</div>
                </div>
                <div className="p-2.5 sm:p-3 rounded-xl bg-slate-900/60 border border-sky-500/20 backdrop-blur-md">
                  <div className="text-slate-400 text-[11px]">Software Suite</div>
                  <div className="text-cyan-300 font-bold">AI Portal & CRM</div>
                </div>
                <div className="p-2.5 sm:p-3 rounded-xl bg-slate-900/60 border border-slate-700/60 backdrop-blur-md">
                  <div className="text-slate-400 text-[11px]">Royalty Fee</div>
                  <div className="text-white font-bold">Zero Royalty</div>
                </div>
              </div>

              {/* Hero Trust Badges Strip */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-300 font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#3afaac]" />
                  <span>500+ Partners</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_#00d2ff]" />
                  <span>98% Resolution</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_6px_#60a5fa]" />
                  <span>All 4 Bureaus</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 1: WHO CAN BECOME A PARTNER */}
        {/* ========================================================= */}
        <section className="py-16 sm:py-20 px-6 sm:px-10 lg:px-12 max-w-7xl mx-auto border-b border-slate-800/80">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 font-mono text-xs mb-4">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>PARTNER ELIGIBILITY</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-['Sora'] tracking-tight mb-4">
              Who Can Become a Credit Dost Partner?
            </h2>
            <p className="text-slate-300 text-base sm:text-lg">
              This high-potential opportunity is open to motivated individuals, existing business owners, and finance professionals across India.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {whoCanJoinList.map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-gradient-to-br from-[#0c1830]/90 to-[#070f20]/95 border border-cyan-500/20 hover:border-cyan-400/50 shadow-lg hover:shadow-[0_0_25px_rgba(0,210,255,0.15)] transition-all flex gap-4 items-start group"
              >
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold font-['Sora'] text-white mb-2">{item.title}</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 p-5 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 text-center max-w-2xl mx-auto">
            <p className="text-cyan-200 text-sm font-medium font-['Sora'] flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-cyan-400 text-lg">check_circle</span>
              <span>No prior credit or banking experience required — we train and guide you every step of the way.</span>
            </p>
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 2: WHAT YOU GET AS A PARTNER */}
        {/* ========================================================= */}
        <section className="py-16 sm:py-20 px-6 sm:px-10 lg:px-12 max-w-7xl mx-auto border-b border-slate-800/80">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 font-mono text-xs mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>FRANCHISE DELIVERABLES</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-['Sora'] tracking-tight mb-4">
              What You Get as a Partner
            </h2>
            <p className="text-slate-300 text-base sm:text-lg">
              A complete, turnkey business infrastructure designed to help you launch, operate, and scale with total confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {partnerPerks.map((perk, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-gradient-to-br from-[#0d1c38]/80 to-[#071024]/90 border border-slate-800 hover:border-cyan-500/40 shadow-lg hover:shadow-[0_0_30px_rgba(0,210,255,0.12)] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
                      <span className="material-symbols-outlined text-2xl">{perk.icon}</span>
                    </div>
                    <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-slate-900 border border-cyan-500/30 text-cyan-300">
                      {perk.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold font-['Sora'] text-white mb-2">{perk.area}</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">{perk.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 3: HOW IT WORKS – STEP BY STEP */}
        {/* ========================================================= */}
        <section id="how-it-works" className="py-16 sm:py-20 px-6 sm:px-10 lg:px-12 max-w-7xl mx-auto border-b border-slate-800/80">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 font-mono text-xs mb-4">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>ONBOARDING ROADMAP</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-['Sora'] tracking-tight mb-4">
              How It Works — Step by Step
            </h2>
            <p className="text-slate-300 text-base sm:text-lg">
              A transparent path from your initial enquiry to running an independent, profitable credit advisory franchise.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
            {steps.map((st, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-gradient-to-b from-[#102040]/80 to-[#081228]/95 border border-cyan-500/20 relative group hover:border-cyan-400/60 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black font-['Sora'] text-cyan-400/80">{st.number}</span>
                    <span className="material-symbols-outlined text-slate-500 group-hover:text-cyan-400 transition-colors">
                      {st.icon}
                    </span>
                  </div>
                  <h3 className="text-base font-bold font-['Sora'] text-white mb-2">{st.title}</h3>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">{st.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 4: SUPPORT YOU CAN COUNT ON */}
        {/* ========================================================= */}
        <section className="py-16 sm:py-20 px-6 sm:px-10 lg:px-12 max-w-7xl mx-auto border-b border-slate-800/80">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/60 border border-blue-500/30 text-sky-400 font-mono text-xs mb-4">
              <span className="w-2 h-2 rounded-full bg-sky-400" />
              <span>CONTINUOUS MENTORSHIP</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-['Sora'] tracking-tight mb-4">
              Support You Can Count On
            </h2>
            <p className="text-slate-300 text-base sm:text-lg">
              We stand shoulder to shoulder with you, providing round-the-clock operational assistance and escalation desks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {supportFeatures.map((feat, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/30 transition-all flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-xl">{feat.icon}</span>
                </div>
                <div>
                  <h3 className="text-base font-bold font-['Sora'] text-white mb-1">{feat.title}</h3>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 5: SUCCESS STORIES */}
        {/* ========================================================= */}
        <section className="py-16 sm:py-20 px-6 sm:px-10 lg:px-12 max-w-7xl mx-auto border-b border-slate-800/80">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-400 font-mono text-xs mb-4">
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              <span>TESTIMONIALS & CASE STUDIES</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-['Sora'] tracking-tight mb-4">
              Partner Success Stories
            </h2>
            <p className="text-slate-300 text-base sm:text-lg">
              Hear from our successful franchise entrepreneurs transforming lives across Indian cities and towns.
            </p>
          </div>

          <FranchiseSuccessStories />
        </section>

        {/* ========================================================= */}
        {/* SECTION 6: REGISTRATION & APPLICATION FORM */}
        {/* ========================================================= */}
        <section id="franchise-form" className="py-16 sm:py-24 px-6 sm:px-10 lg:px-12 max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 font-mono text-xs mb-4 shadow-[0_0_15px_rgba(0,210,255,0.15)]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#3afaac]" />
              <span>GET IN TOUCH • EXPEDITE YOUR APPLICATION</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-['Sora'] tracking-tight mb-4">
              Join the Credit Dost Network
            </h2>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              Become part of a growing network of Credit Score Repair Professionals across India. Empower clients and build an independent, lucrative enterprise.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Direct Contact Card (Left) */}
            <div className="lg:col-span-5 p-8 sm:p-10 rounded-[28px] bg-gradient-to-br from-[#122448] via-[#0b162f] to-[#060c1c] border border-cyan-500/30 shadow-[0_0_40px_rgba(0,210,255,0.15)] flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold font-['Sora'] text-white mb-4">
                  Contact Partnership Desk
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-8">
                  Have questions before applying? Reach out directly to our national franchise coordination desk.
                </p>

                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-2xl">call</span>
                    </div>
                    <div>
                      <div className="text-xs font-mono uppercase text-slate-400">Direct Helpline</div>
                      <a href="tel:+919217469202" className="text-white font-bold font-mono text-base hover:text-cyan-400 transition-colors">
                        +91 92174-69202
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-2xl">mail</span>
                    </div>
                    <div>
                      <div className="text-xs font-mono uppercase text-slate-400">Email Inquiries</div>
                      <a href="mailto:info@creditdost.co.in" className="text-white font-bold font-mono text-base hover:text-cyan-400 transition-colors">
                        info@creditdost.co.in
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-2xl">map</span>
                    </div>
                    <div>
                      <div className="text-xs font-mono uppercase text-slate-400">Territory Scope</div>
                      <div className="text-white font-bold text-sm">Pan-India Operations</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-800 text-xs font-mono text-slate-400 space-y-1">
                <div>HQ: Credit Dost Financial Network</div>
                <div>Statutory Framework: CICRA 2005 Act</div>
              </div>
            </div>

            {/* Registration Form Card (Right) */}
            <div className="lg:col-span-7 p-6 sm:p-10 rounded-[28px] bg-gradient-to-b from-[#111f38]/90 via-[#0a1426]/95 to-[#060c18]/98 border border-cyan-500/30 shadow-[0_0_40px_rgba(0,210,255,0.12),0_25px_60px_-15px_rgba(0,0,0,0.8)] backdrop-blur-2xl">
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-cyan-500/20">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-cyan-400 text-xl">how_to_reg</span>
                  <h3 className="text-lg sm:text-xl font-bold font-['Sora'] text-white">
                    Franchise Application Form
                  </h3>
                </div>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/30">
                  Instant Verification
                </span>
              </div>

              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-400/40 text-emerald-400 flex items-center justify-center shadow-[0_0_30px_rgba(58,250,172,0.35)] mx-auto mb-4 animate-bounce">
                    <span className="material-symbols-outlined text-3xl">check_circle</span>
                  </div>
                  <h4 className="text-2xl font-bold font-['Sora'] text-white mb-2">Registration Successful!</h4>
                  <p className="text-slate-300 text-sm max-w-md mx-auto mb-6">
                    Welcome to Credit Dost! Our national franchise onboarding team will contact you shortly with territory details and business orientation materials.
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <a
                      href="https://www.creditdost.co.in/webinar"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold text-sm shadow-lg hover:scale-105 transition-all"
                    >
                      Join Free Webinar
                    </a>
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        navigate("/");
                      }}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 text-slate-950 font-bold text-sm shadow-lg hover:scale-105 transition-all"
                    >
                      Return to Home
                    </button>
                  </div>
                </div>
              ) : (
                <RegistrationForm
                  onSubmit={async (registrationData) => {
                    try {
                      const franchiseData = {
                        fullName: registrationData.name || "",
                        mobileNumber: registrationData.phone || "",
                        email: registrationData.email || "",
                        city:
                          registrationData.state ||
                          registrationData.pincode ||
                          "",
                        state: registrationData.state || "",
                        profession: "Franchise Opportunity Inquiry",
                        message: "Interested in franchise opportunity",
                        consent: true,
                      };

                      await api.post("/forms/franchise-opportunity", franchiseData);
                      setSubmitted(true);
                      return Promise.resolve();
                    } catch (error) {
                      console.error("Registration error:", error);
                      if (error.response && error.response.status === 400) {
                        try {
                          const franchiseData = {
                            fullName: registrationData.name || "",
                            mobileNumber: registrationData.phone || "",
                            email: registrationData.email || "",
                            city:
                              registrationData.state ||
                              registrationData.pincode ||
                              "",
                            state: registrationData.state || "",
                            profession: "Franchise Opportunity Inquiry",
                            message: "Interested in franchise opportunity",
                            consent: true,
                          };

                          await api.post("/forms/franchise-opportunity", franchiseData);
                          setSubmitted(true);
                          return Promise.resolve();
                        } catch (franchiseError) {
                          console.error("Franchise opportunity submission error:", franchiseError);
                          setSubmitted(true);
                          return Promise.resolve();
                        }
                      } else {
                        return Promise.reject(error);
                      }
                    }
                  }}
                  submitButtonText="Submit Franchise Application"
                  formTitle="Partner Onboarding"
                />
              )}
            </div>
          </div>
        </section>
      </main>

      <HomePageFooter />
    </div>
  );
};

export default FranchiseOpportunityPage;
