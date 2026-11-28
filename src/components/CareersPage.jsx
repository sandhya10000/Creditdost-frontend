import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
} from "@mui/material";
import Header from "./homepage/Header";
import HomePageFooter from "./homepage/HomePageFooter";
import { careersAPI } from "../services/api";

const CareersPage = () => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState("");
  const [resume, setResume] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState("");

  const positions = [
    {
      id: 1,
      title: "Credit Analyst (Operations)",
      location: "New Delhi (On-site)",
      type: "Full Time",
      department: "Operations",
      description:
        "We are looking for a detail-oriented analyst to manage the backend credit repair process. You will be the technical expert analyzing credit reports.",
      responsibilities: [
        "Analyze credit reports from CIBIL, Experian, CRIF, and Equifax to identify errors.",
        "Draft professional dispute letters and coordinate with credit bureaus for rectification.",
        "Maintain strict data privacy and update client records in the CRM.",
      ],
      requirements: [
        "Experience: 1-3 years in Banking, Loan Processing, or Backend Operations.",
        "Strong understanding of banking terms (DPD, Write-off, Settlement).",
        "Proficiency in MS Excel is mandatory.",
      ],
    },
    {
      id: 2,
      title: "Client Success Manager",
      location: "New Delhi",
      type: "Full Time",
      department: "Customer Support",
      description:
        "You will be the primary point of contact for our premium clients, guiding them through their journey to a better credit score.",
      responsibilities: [
        "Onboard new clients and explain the credit repair roadmap.",
        "Provide monthly updates on score improvements and handle client queries via call/email.",
        "Focus on retention and ensure high customer satisfaction scores (CSAT).",
      ],
      requirements: [
        "Excellent verbal and written communication skills (English & Hindi).",
        "High levels of patience and empathy.",
        "Prior experience in Customer Success or Relationship Management is a plus.",
      ],
    },
    {
      id: 3,
      title: "Inside Sales Executive",
      location: "New Delhi",
      type: "Full Time",
      department: "Sales & Revenue",
      description:
        "Drive the company's growth by consulting potential customers who have inquired about our services. This is a high-reward role with attractive incentives.",
      responsibilities: [
        "Contact inbound leads (people looking to fix their score) and counsel them on Credit Dost packages.",
        "Understand customer financial pain points and offer the right solution.",
        "Meet and exceed monthly sales targets.",
      ],
      requirements: [
        "1+ year of experience in Tele-sales, BFSI sales, or Ed-tech sales.",
        "High energy and a target-driven mindset.",
        "Ability to explain complex financial concepts simply.",
      ],
    },
  ];

  const hiringSteps = [
    { step: "01", title: "Apply", description: "Submit your resume through our career portal." },
    { step: "02", title: "Screening", description: "Introductory evaluation call with our HR desk." },
    { step: "03", title: "Interview", description: "Technical dispute & culture alignment round." },
    { step: "04", title: "Offer", description: "Competitive compensation & immediate onboarding." },
  ];

  const handleApplyClick = (positionTitle) => {
    setSelectedPosition(positionTitle);
    setOpenModal(true);
    setSubmitSuccess(false);
    setError("");
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedPosition("");
    setResume(null);
    setFormData({ name: "", email: "", phone: "" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setResume(e.target.files[0]);
    }
  };

  const handleSubmitApplication = async () => {
    if (!formData.name || !formData.email || !formData.phone) {
      setError("Please fill in your name, email, and phone number.");
      return;
    }
    if (!resume) {
      setError("Please upload your resume (PDF or DOCX).");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      const appData = new FormData();
      appData.append("name", formData.name);
      appData.append("email", formData.email);
      appData.append("phone", formData.phone);
      appData.append("position", selectedPosition);
      appData.append("resume", resume);

      await careersAPI.submitApplication(appData);
      setSubmitSuccess(true);
    } catch (err) {
      console.error("Application error:", err);
      setError(err.response?.data?.message || "Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#080E1B] font-body-md text-slate-100 antialiased min-h-screen flex flex-col justify-between selection:bg-cyan-500 selection:text-slate-950">
      <Header />

      <main className="relative flex-grow pt-24 pb-20 overflow-hidden">
        {/* Volumetric Backlights */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[350px] bg-cyan-500/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[350px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-6">
            <Link to="/" className="hover:text-cyan-400 transition-colors">Home</Link>
            <span className="text-slate-600">/</span>
            <span className="text-cyan-400 font-semibold">Careers</span>
          </div>

          {/* Hero Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-16">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-400 font-mono text-xs mb-4 shadow-[0_0_20px_rgba(0,210,255,0.2)]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#3afaac]" />
                <span>WE ARE EXPANDING • NATIONAL FINTECH TEAM</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-extrabold text-white font-['Sora'] tracking-tight leading-[1.12] mb-4">
                Shape the Future of <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-emerald-400">
                  Financial Health.
                </span>
              </h1>

              <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-xl mb-6">
                Join India's fastest-growing credit score restoration platform. Help millions of borrowers correct unfair bureau reporting and regain access to formal banking credit.
              </p>

              <div className="flex gap-4">
                <a
                  href="#open-positions"
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 text-slate-950 font-bold text-sm shadow-[0_0_25px_rgba(0,210,255,0.4)] hover:scale-105 active:scale-95 transition-all"
                >
                  View Open Positions ↓
                </a>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="rounded-[28px] overflow-hidden border border-cyan-500/30 p-2 bg-[#0a1426]/80 backdrop-blur-xl shadow-[0_0_40px_rgba(0,210,255,0.15)]">
                <img
                  src="/images/about/about-2.png"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/images/white-logo.png";
                  }}
                  alt="Team Credit Dost"
                  className="w-full h-72 sm:h-80 object-cover rounded-[22px] filter brightness-[0.9]"
                />
              </div>
            </div>
          </div>

          {/* Why Work at Credit Dost */}
          <div className="mb-20">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold font-['Sora'] text-white">Why Build Your Career with Us?</h2>
              <p className="text-slate-400 text-sm mt-1">High impact, collaborative culture, and fast-track learning</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: "Real Consumer Impact",
                  desc: "We don't just write dispute letters; we solve life-altering financial obstacles, helping families qualify for homes and education.",
                  icon: "volunteer_activism",
                },
                {
                  title: "Exponential Career Growth",
                  desc: "Work closely with banking leaders, dispute attorneys, and statutory credit specialists in an agile, merit-based environment.",
                  icon: "rocket_launch",
                },
                {
                  title: "Competitive Incentives",
                  desc: "Industry-benchmark salary packages, milestone bonuses, and health coverage for you and your family.",
                  icon: "workspace_premium",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-6 sm:p-8 rounded-[24px] bg-[#0a1426]/85 border border-slate-800 hover:border-cyan-500/30 transition-all backdrop-blur-xl"
                >
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                  </div>
                  <h3 className="text-lg font-bold font-['Sora'] text-white mb-2">{item.title}</h3>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Open Positions Section */}
          <div id="open-positions" className="mb-20 pt-8">
            <div className="text-center mb-10">
              <span className="text-xs font-mono uppercase text-cyan-400 font-bold">CURRENT OPENINGS</span>
              <h2 className="text-2xl sm:text-4xl font-extrabold font-['Sora'] text-white mt-1">
                Explore Available Roles
              </h2>
            </div>

            <div className="space-y-6 max-w-4xl mx-auto">
              {positions.map((pos) => (
                <div
                  key={pos.id}
                  className="p-6 sm:p-8 rounded-[24px] bg-[#0a1426]/90 border border-cyan-500/25 hover:border-cyan-400/50 transition-all shadow-[0_0_30px_rgba(0,0,0,0.5)] backdrop-blur-xl"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                    <div>
                      <h3 className="text-xl font-bold font-['Sora'] text-white">{pos.title}</h3>
                      <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-400 mt-1">
                        <span className="text-cyan-400 font-semibold">{pos.location}</span>
                        <span>•</span>
                        <span>{pos.type}</span>
                        <span>•</span>
                        <span className="text-emerald-400">{pos.department}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleApplyClick(pos.title)}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 text-slate-950 font-bold text-xs sm:text-sm hover:scale-105 active:scale-95 transition-all self-start sm:self-auto shrink-0"
                    >
                      Apply Now →
                    </button>
                  </div>

                  <p className="text-slate-300 text-xs sm:text-sm my-4 leading-relaxed">{pos.description}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
                    <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
                      <div className="font-mono text-cyan-300 font-semibold uppercase mb-2">Key Responsibilities:</div>
                      <ul className="space-y-1.5 text-slate-400 list-disc list-inside">
                        {pos.responsibilities.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
                      <div className="font-mono text-emerald-300 font-semibold uppercase mb-2">Requirements:</div>
                      <ul className="space-y-1.5 text-slate-400 list-disc list-inside">
                        {pos.requirements.map((req, i) => (
                          <li key={i}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hiring Process Steps */}
          <div className="pt-10 border-t border-slate-800/80">
            <div className="text-center mb-10">
              <h3 className="text-2xl font-bold font-['Sora'] text-white">Our 4-Step Hiring Protocol</h3>
              <p className="text-slate-400 text-xs sm:text-sm font-mono mt-1">Transparent, fast, and structured</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {hiringSteps.map((st) => (
                <div key={st.step} className="p-5 rounded-2xl bg-[#0a1426]/60 border border-slate-800 text-center">
                  <div className="text-xs font-mono text-cyan-400 font-bold mb-1">{st.step} // STAGE</div>
                  <div className="text-white font-bold text-base mb-1">{st.title}</div>
                  <div className="text-slate-400 text-xs">{st.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Application Modal */}
        <Dialog
          open={openModal}
          onClose={handleCloseModal}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              bgcolor: "#0a1426",
              color: "#fff",
              border: "1px solid rgba(0, 210, 255, 0.3)",
              borderRadius: "24px",
              p: 2,
            },
          }}
        >
          <DialogTitle sx={{ color: "#fff", fontFamily: "'Sora', sans-serif", fontWeight: 700 }}>
            Apply for {selectedPosition}
          </DialogTitle>
          <DialogContent>
            {submitSuccess ? (
              <div className="text-center py-6">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3">
                  <span className="material-symbols-outlined text-3xl">check_circle</span>
                </div>
                <h4 className="text-xl font-bold text-white mb-2">Application Received!</h4>
                <p className="text-slate-300 text-xs sm:text-sm">
                  Our talent acquisition team will review your profile and reach out if your background matches our needs.
                </p>
              </div>
            ) : (
              <div className="space-y-4 pt-2">
                {error && (
                  <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-300 mb-1">Full Name *</label>
                  <TextField
                    fullWidth
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Priyanshu Verma"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        color: "#fff",
                        bgcolor: "#071120",
                        borderRadius: "12px",
                        "& fieldset": { borderColor: "rgba(0, 210, 255, 0.25)" },
                      },
                    }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-300 mb-1">Email Address *</label>
                  <TextField
                    fullWidth
                    required
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="name@example.com"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        color: "#fff",
                        bgcolor: "#071120",
                        borderRadius: "12px",
                        "& fieldset": { borderColor: "rgba(0, 210, 255, 0.25)" },
                      },
                    }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-300 mb-1">Phone Number *</label>
                  <TextField
                    fullWidth
                    required
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="9876543210"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        color: "#fff",
                        bgcolor: "#071120",
                        borderRadius: "12px",
                        "& fieldset": { borderColor: "rgba(0, 210, 255, 0.25)" },
                      },
                    }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-300 mb-1">Resume / CV * (PDF, DOCX)</label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="block w-full text-xs text-slate-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-cyan-500/20 file:text-cyan-300 hover:file:bg-cyan-500/30 cursor-pointer"
                  />
                </div>
              </div>
            )}
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            {submitSuccess ? (
              <button
                onClick={handleCloseModal}
                className="px-5 py-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold"
              >
                Close
              </button>
            ) : (
              <>
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitApplication}
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 text-slate-950 text-xs font-bold shadow-lg disabled:opacity-50"
                >
                  {isSubmitting ? "Uploading..." : "Submit Application"}
                </button>
              </>
            )}
          </DialogActions>
        </Dialog>
      </main>

      <HomePageFooter />
    </div>
  );
};

export default CareersPage;