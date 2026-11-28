import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import Header from "./homepage/Header";
import HomePageFooter from "./homepage/HomePageFooter";
import api from "../services/api";

const CreditScoreRepairPage = () => {
  // Mode selection: 'individual' (Personal Credit Score Repair) or 'corporate' (Company CMR for Corporates)
  const [activeTab, setActiveTab] = useState("individual");

  // Form states
  const [formData, setFormData] = useState({
    // Shared / Contact
    fullName: "",
    email: "",
    mobileNumber: "",
    city: "",
    state: "",
    message: "",
    authorization: true,

    // Individual specific
    creditScore: "",
    problemType: "Loan Rejection",
    occupation: "Salaried",
    income: "",

    // Corporate specific
    companyName: "",
    entityType: "Private Limited (Pvt Ltd)",
    designation: "Director",
    gstNumber: "",
    turnoverRange: "₹1 Cr - ₹5 Cr",
    cmrRank: "",
    corporateProblemType: "CMR Rank Improvement",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const indianStates = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi",
    "Jammu and Kashmir",
    "Ladakh",
    "Lakshadweep",
    "Puducherry",
  ];

  const individualProblemTypes = [
    "Loan Rejection",
    "Late DPD Marks Dispute",
    "Settlement Tag Removal",
    "Wrong Account / Identity Theft",
    "Low CIBIL Score (Below 700)",
    "Suit Filed / Wilful Defaulter Error",
    "Other Personal Credit Issue",
  ];

  const corporateProblemTypes = [
    "High Risk CMR Rank (CMR 7-10)",
    "Working Capital / CC Limit Rejection",
    "Commercial NPA Tag Removal",
    "Bank Charge Satisfaction & NOC Update",
    "Corporate Loan Rejection",
    "Wrong Credit Bureau / Commercial Entry",
    "Other Corporate Credit Challenge",
  ];

  const entityTypes = [
    "Private Limited (Pvt Ltd)",
    "Public Limited (Ltd)",
    "Limited Liability Partnership (LLP)",
    "Partnership Firm",
    "MSME / Sole Proprietorship",
  ];

  const turnoverOptions = [
    "Below ₹1 Crore",
    "₹1 Crore - ₹5 Crores",
    "₹5 Crores - ₹25 Crores",
    "₹25 Crores - ₹100 Crores",
    "₹100 Crores+",
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "mobileNumber") {
      const clean = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, [name]: clean }));
      return;
    }
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      setError("Please enter the contact person's name");
      return false;
    }
    if (!formData.mobileNumber || formData.mobileNumber.length !== 10) {
      setError("Please enter a valid 10-digit mobile number");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    if (!formData.state) {
      setError("Please select your state");
      return false;
    }

    if (activeTab === "corporate") {
      if (!formData.companyName.trim()) {
        setError("Please enter your Company / Business legal name");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    setLoading(true);

    try {
      const payload = {
        enquiryType: activeTab,
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        mobileNumber: formData.mobileNumber,
        city: formData.city.trim(),
        state: formData.state,
        problemType: activeTab === "individual" ? formData.problemType : formData.corporateProblemType,
        creditScore: activeTab === "individual" ? formData.creditScore : "",
        message: formData.message.trim(),
        occupation: activeTab === "individual" ? formData.occupation : "",
        income: activeTab === "individual" ? formData.income : "",

        // Corporate payload
        companyName: activeTab === "corporate" ? formData.companyName.trim() : "",
        entityType: activeTab === "corporate" ? formData.entityType : "",
        designation: activeTab === "corporate" ? formData.designation : "",
        gstNumber: activeTab === "corporate" ? formData.gstNumber.trim().toUpperCase() : "",
        turnoverRange: activeTab === "corporate" ? formData.turnoverRange : "",
        cmrRank: activeTab === "corporate" ? formData.cmrRank : "",
      };

      await api.post("/forms/credit-repair", payload);
      setSuccess(true);
    } catch (err) {
      console.error("Submission error:", err);
      setError(
        err.response?.data?.message || "Failed to submit request. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    "& .MuiOutlinedInput-root": {
      color: "#ffffff",
      backgroundColor: "#071120",
      borderRadius: "12px",
      fontFamily: "'Inter', sans-serif",
      "& fieldset": {
        borderColor: "rgba(0, 210, 255, 0.25)",
        borderWidth: "1.5px",
      },
      "&:hover fieldset": {
        borderColor: "rgba(0, 210, 255, 0.6)",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#00d2ff !important",
        boxShadow: "0 0 16px rgba(0, 210, 255, 0.3)",
        borderWidth: "2px",
      },
      "& input": {
        color: "#ffffff !important",
        backgroundColor: "transparent !important",
        WebkitTextFillColor: "#ffffff !important",
        fontSize: "0.95rem",
        "&:-webkit-autofill": {
          WebkitBoxShadow: "0 0 0 1000px #071120 inset !important",
          WebkitTextFillColor: "#ffffff !important",
        },
      },
    },
    "& .MuiInputLabel-root": {
      color: "rgba(203, 213, 225, 0.8)",
      "&.Mui-focused": { color: "#00d2ff !important" },
    },
  };

  return (
    <div className="bg-[#080E1B] font-body-md text-slate-100 antialiased min-h-screen flex flex-col justify-between selection:bg-cyan-500 selection:text-slate-950">
      <Header />

      <main className="relative flex-grow pt-20 overflow-hidden">
        {/* Volumetric Backlights */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[360px] bg-cyan-500/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[340px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />

        {/* HERO SECTION */}
        <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 z-10">
          
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-6">
            <Link to="/" className="hover:text-cyan-400 transition-colors">
              Home
            </Link>
            <span className="text-slate-600">/</span>
            <span className="text-cyan-400 font-semibold">
              {activeTab === "individual" ? "Personal Credit Repair" : "Corporate CMR & Commercial"}
            </span>
          </div>

          {/* TWO-OPTION SEGMENTED CONTROLLER (SENIOR'S REQUIREMENT) */}
          <div className="flex justify-center mb-10">
            <div className="p-1.5 rounded-2xl bg-slate-900/90 border border-cyan-500/30 backdrop-blur-xl flex flex-col sm:flex-row gap-2 max-w-xl w-full shadow-[0_0_30px_rgba(0,210,255,0.15)]">
              
              {/* Option 1: Individual Customers */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab("individual");
                  setSuccess(false);
                  setError("");
                }}
                className={`flex-1 py-3 px-5 rounded-xl font-['Sora'] font-bold text-xs sm:text-sm transition-all duration-300 flex items-center justify-center gap-2.5 ${
                  activeTab === "individual"
                    ? "bg-gradient-to-r from-cyan-400 to-sky-500 text-slate-950 shadow-[0_0_20px_rgba(0,210,255,0.4)] scale-[1.02]"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                }`}
              >
                <span className="material-symbols-outlined text-lg">person</span>
                <span>Individual Credit Score Repair</span>
              </button>

              {/* Option 2: Corporate CMR for Companies */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab("corporate");
                  setSuccess(false);
                  setError("");
                }}
                className={`flex-1 py-3 px-5 rounded-xl font-['Sora'] font-bold text-xs sm:text-sm transition-all duration-300 flex items-center justify-center gap-2.5 ${
                  activeTab === "corporate"
                    ? "bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(58,250,172,0.4)] scale-[1.02]"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                }`}
              >
                <span className="material-symbols-outlined text-lg">corporate_fare</span>
                <span>CMR for Corporate & MSME</span>
              </button>

            </div>
          </div>

          {/* DYNAMIC HERO HEADLINE & VALUE PROP */}
          <div className="text-center max-w-4xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-400 font-mono text-xs mb-4 shadow-[0_0_20px_rgba(0,210,255,0.2)]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#3afaac]" />
              <span>
                {activeTab === "individual"
                  ? "CICRA 2005 STATUTORY DISPUTE FRAMEWORK • RETAIL"
                  : "COMMERCIAL CREDIT RESTORATION • CIBIL CMR-1 TARGET"}
              </span>
            </div>

            {activeTab === "individual" ? (
              <>
                <h1 className="text-3xl sm:text-5xl lg:text-[56px] font-extrabold text-white font-['Sora'] tracking-tight leading-[1.12] mb-4">
                  Reclaim Your Credit Score. <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-emerald-400">
                    Turn Loan Rejections into Approvals.
                  </span>
                </h1>
                <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                  Wrong late marks (DPD), fake loan inquiries, and settlement tags quietly damage your personal CIBIL score. We dispute and resolve unfair negative entries legally with banks.
                </p>
              </>
            ) : (
              <>
                <h1 className="text-3xl sm:text-5xl lg:text-[56px] font-extrabold text-white font-['Sora'] tracking-tight leading-[1.12] mb-4">
                  Boost Your Company CMR Rank. <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                    Unlock Corporate CC Limits & Loans.
                  </span>
                </h1>
                <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                  High-risk CMR ranks (CMR-7 to CMR-10) and unresolved bank charges stall bank working capital, credit lines, and tender bids. Credit Dost works with commercial bureaus to restore clean corporate financial health.
                </p>
              </>
            )}

            {/* Quick Impact Metric Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto mt-8 font-mono text-xs">
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-cyan-500/20 backdrop-blur-md">
                <div className="text-slate-400">Success Rate</div>
                <div className="text-white font-bold text-base mt-0.5">98% Verified</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-emerald-500/20 backdrop-blur-md">
                <div className="text-slate-400">Average Turnaround</div>
                <div className="text-emerald-400 font-bold text-base mt-0.5">30 - 60 Days</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-sky-500/20 backdrop-blur-md">
                <div className="text-slate-400">Bureau Coverage</div>
                <div className="text-cyan-300 font-bold text-base mt-0.5">All 4 Bureaus</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-700/60 backdrop-blur-md">
                <div className="text-slate-400">Legal Alignment</div>
                <div className="text-white font-bold text-base mt-0.5">CICRA 2005 Compliant</div>
              </div>
            </div>
          </div>

          {/* DYNAMIC CONSULTATION FORM CARD */}
          <div id="enquiry-form" className="max-w-4xl mx-auto">
            <div className="p-6 sm:p-10 rounded-[28px] bg-gradient-to-b from-[#111f38]/95 via-[#0a1426]/98 to-[#060c18] border border-cyan-500/35 shadow-[0_0_50px_rgba(0,210,255,0.15),0_30px_70px_rgba(0,0,0,0.85)] backdrop-blur-2xl">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-cyan-500/20 gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    activeTab === "individual"
                      ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30"
                      : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                  }`}>
                    <span className="material-symbols-outlined text-2xl">
                      {activeTab === "individual" ? "psychology" : "business_center"}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold font-['Sora'] text-white">
                      {activeTab === "individual"
                        ? "Personal Credit Score Review Application"
                        : "Corporate CMR & Commercial Dispute Application"}
                    </h2>
                    <p className="text-xs font-mono text-slate-400 mt-0.5">
                      {activeTab === "individual"
                        ? "Confidential one-on-one consultation with senior credit case officers"
                        : "B2B desk for Company Directors, Partners, and CFOs"}
                    </p>
                  </div>
                </div>

                <span className={`text-xs font-mono px-3 py-1 rounded-full border self-start sm:self-auto ${
                  activeTab === "individual"
                    ? "text-cyan-300 bg-cyan-950/60 border-cyan-500/30"
                    : "text-emerald-300 bg-emerald-950/60 border-emerald-500/30"
                }`}>
                  {activeTab === "individual" ? "Individual Form" : "Corporate CMR"}
                </span>
              </div>

              {success ? (
                <div className="py-12 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/40 flex items-center justify-center mx-auto mb-4 animate-bounce shadow-[0_0_30px_rgba(58,250,172,0.35)]">
                    <span className="material-symbols-outlined text-3xl">check_circle</span>
                  </div>
                  <h3 className="text-2xl font-bold font-['Sora'] text-white mb-2">
                    Application Successfully Submitted!
                  </h3>
                  <p className="text-slate-300 text-sm max-w-md mx-auto mb-6">
                    {activeTab === "individual"
                      ? "Thank you! Our personal credit dispute team will review your bureau profile and contact you within 24 business hours."
                      : "Thank you! Our Corporate Credit & CMR Desk has logged your company details. A senior commercial dispute consultant will reach out shortly."}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSuccess(false);
                      setFormData((prev) => ({
                        ...prev,
                        fullName: "",
                        email: "",
                        mobileNumber: "",
                        city: "",
                        message: "",
                        companyName: "",
                        gstNumber: "",
                      }));
                    }}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 text-slate-950 font-bold text-sm shadow-lg hover:scale-105 transition-all"
                  >
                    Submit Another Request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-6">
                  {error && (
                    <div className="p-3.5 rounded-xl bg-red-950/50 border border-red-500/40 text-red-200 text-xs sm:text-sm flex items-center gap-2">
                      <span className="material-symbols-outlined text-red-400 text-lg shrink-0">error</span>
                      <span>{error}</span>
                    </div>
                  )}

                  {/* ========================================================= */}
                  {/* CORPORATE SPECIFIC ROW (ONLY VISIBLE ON CORPORATE TAB) */}
                  {/* ========================================================= */}
                  {activeTab === "corporate" && (
                    <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-emerald-500/30 space-y-4">
                      <div className="text-xs font-mono uppercase tracking-wider text-emerald-300 font-bold flex items-center gap-2">
                        <span className="material-symbols-outlined text-base">domain</span>
                        <span>Company & Commercial Details</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Company Name */}
                        <div>
                          <label className="block text-xs font-mono uppercase text-slate-300 tracking-wider mb-1 font-semibold">
                            Company / Entity Legal Name *
                          </label>
                          <TextField
                            fullWidth
                            required
                            name="companyName"
                            placeholder="e.g. Apex LogiTech Solutions Pvt Ltd"
                            value={formData.companyName}
                            onChange={handleChange}
                            sx={inputStyle}
                          />
                        </div>

                        {/* Entity Constitution */}
                        <div>
                          <label className="block text-xs font-mono uppercase text-slate-300 tracking-wider mb-1 font-semibold">
                            Constitution / Entity Type *
                          </label>
                          <FormControl fullWidth sx={inputStyle}>
                            <Select
                              name="entityType"
                              value={formData.entityType}
                              onChange={handleChange}
                              MenuProps={{ PaperProps: { sx: { bgcolor: "#0a1426", color: "#fff" } } }}
                            >
                              {entityTypes.map((type) => (
                                <MenuItem key={type} value={type}>
                                  {type}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </div>

                        {/* GSTIN or Company PAN */}
                        <div>
                          <label className="block text-xs font-mono uppercase text-slate-300 tracking-wider mb-1 font-semibold">
                            Company GSTIN / PAN (Optional)
                          </label>
                          <TextField
                            fullWidth
                            name="gstNumber"
                            placeholder="e.g. 07AAAAA0000A1Z5"
                            value={formData.gstNumber}
                            onChange={handleChange}
                            sx={inputStyle}
                          />
                        </div>

                        {/* Annual Turnover Range */}
                        <div>
                          <label className="block text-xs font-mono uppercase text-slate-300 tracking-wider mb-1 font-semibold">
                            Annual Turnover Range
                          </label>
                          <FormControl fullWidth sx={inputStyle}>
                            <Select
                              name="turnoverRange"
                              value={formData.turnoverRange}
                              onChange={handleChange}
                              MenuProps={{ PaperProps: { sx: { bgcolor: "#0a1426", color: "#fff" } } }}
                            >
                              {turnoverOptions.map((opt) => (
                                <MenuItem key={opt} value={opt}>
                                  {opt}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ========================================================= */}
                  {/* CONTACT PERSON & SHARED FIELDS */}
                  {/* ========================================================= */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Contact Full Name */}
                    <div>
                      <label className="block text-xs font-mono uppercase text-slate-300 tracking-wider mb-1 font-semibold">
                        {activeTab === "corporate" ? "Authorized Person Name *" : "Full Name *"}
                      </label>
                      <TextField
                        fullWidth
                        required
                        name="fullName"
                        placeholder="e.g. Ramesh Kumar"
                        value={formData.fullName}
                        onChange={handleChange}
                        sx={inputStyle}
                      />
                    </div>

                    {/* Designation (Corporate) or Occupation (Individual) */}
                    <div>
                      <label className="block text-xs font-mono uppercase text-slate-300 tracking-wider mb-1 font-semibold">
                        {activeTab === "corporate" ? "Designation / Role *" : "Employment Type"}
                      </label>
                      {activeTab === "corporate" ? (
                        <TextField
                          fullWidth
                          name="designation"
                          placeholder="e.g. Managing Director / Partner / CFO"
                          value={formData.designation}
                          onChange={handleChange}
                          sx={inputStyle}
                        />
                      ) : (
                        <FormControl fullWidth sx={inputStyle}>
                          <Select
                            name="occupation"
                            value={formData.occupation}
                            onChange={handleChange}
                            MenuProps={{ PaperProps: { sx: { bgcolor: "#0a1426", color: "#fff" } } }}
                          >
                            <MenuItem value="Salaried">Salaried (Private / Govt)</MenuItem>
                            <MenuItem value="Self Employed Professional">Self Employed Professional</MenuItem>
                            <MenuItem value="Business Owner">Business Owner</MenuItem>
                            <MenuItem value="Other">Other</MenuItem>
                          </Select>
                        </FormControl>
                      )}
                    </div>

                    {/* Official Mobile Number */}
                    <div>
                      <label className="block text-xs font-mono uppercase text-slate-300 tracking-wider mb-1 font-semibold">
                        Mobile Number * (10 Digits)
                      </label>
                      <TextField
                        fullWidth
                        required
                        type="tel"
                        name="mobileNumber"
                        placeholder="9876543210"
                        value={formData.mobileNumber}
                        onChange={handleChange}
                        sx={inputStyle}
                      />
                    </div>

                    {/* Email Address */}
                    <div>
                      <label className="block text-xs font-mono uppercase text-slate-300 tracking-wider mb-1 font-semibold">
                        {activeTab === "corporate" ? "Official Corporate Email *" : "Email Address *"}
                      </label>
                      <TextField
                        fullWidth
                        required
                        type="email"
                        name="email"
                        placeholder="name@company.com"
                        value={formData.email}
                        onChange={handleChange}
                        sx={inputStyle}
                      />
                    </div>

                    {/* State */}
                    <div>
                      <label className="block text-xs font-mono uppercase text-slate-300 tracking-wider mb-1 font-semibold">
                        State / Union Territory *
                      </label>
                      <FormControl fullWidth required sx={inputStyle}>
                        <InputLabel sx={{ color: "rgba(203, 213, 225, 0.8)" }}>Select State</InputLabel>
                        <Select
                          name="state"
                          value={formData.state}
                          label="Select State"
                          onChange={handleChange}
                          MenuProps={{ PaperProps: { sx: { bgcolor: "#0a1426", color: "#fff", maxHeight: 300 } } }}
                        >
                          {indianStates.map((st) => (
                            <MenuItem key={st} value={st}>
                              {st}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>

                    {/* City */}
                    <div>
                      <label className="block text-xs font-mono uppercase text-slate-300 tracking-wider mb-1 font-semibold">
                        City
                      </label>
                      <TextField
                        fullWidth
                        name="city"
                        placeholder="e.g. Mumbai, Delhi, Bengaluru"
                        value={formData.city}
                        onChange={handleChange}
                        sx={inputStyle}
                      />
                    </div>

                    {/* Score (Individual: CIBIL 300-900 / Corporate: CMR Rank 1-10) */}
                    <div>
                      <label className="block text-xs font-mono uppercase text-slate-300 tracking-wider mb-1 font-semibold">
                        {activeTab === "corporate"
                          ? "Current CMR Rank (Optional)"
                          : "Estimated Credit Score (Optional)"}
                      </label>
                      {activeTab === "corporate" ? (
                        <FormControl fullWidth sx={inputStyle}>
                          <Select
                            name="cmrRank"
                            value={formData.cmrRank}
                            onChange={handleChange}
                            displayEmpty
                            MenuProps={{ PaperProps: { sx: { bgcolor: "#0a1426", color: "#fff" } } }}
                          >
                            <MenuItem value="">Not Sure / Need Assessment</MenuItem>
                            <MenuItem value="CMR-1 to 3">CMR-1 to CMR-3 (Low Risk)</MenuItem>
                            <MenuItem value="CMR-4 to 6">CMR-4 to CMR-6 (Moderate Risk)</MenuItem>
                            <MenuItem value="CMR-7 to 10">CMR-7 to CMR-10 (High Risk / Reject)</MenuItem>
                          </Select>
                        </FormControl>
                      ) : (
                        <TextField
                          fullWidth
                          type="number"
                          name="creditScore"
                          placeholder="e.g. 620"
                          value={formData.creditScore}
                          onChange={handleChange}
                          sx={inputStyle}
                        />
                      )}
                    </div>

                    {/* Problem / Dispute Category */}
                    <div>
                      <label className="block text-xs font-mono uppercase text-slate-300 tracking-wider mb-1 font-semibold">
                        Primary Dispute Challenge *
                      </label>
                      <FormControl fullWidth required sx={inputStyle}>
                        <Select
                          name={activeTab === "individual" ? "problemType" : "corporateProblemType"}
                          value={activeTab === "individual" ? formData.problemType : formData.corporateProblemType}
                          onChange={handleChange}
                          MenuProps={{ PaperProps: { sx: { bgcolor: "#0a1426", color: "#fff" } } }}
                        >
                          {activeTab === "individual"
                            ? individualProblemTypes.map((t) => (
                                <MenuItem key={t} value={t}>
                                  {t}
                                </MenuItem>
                              ))
                            : corporateProblemTypes.map((t) => (
                                <MenuItem key={t} value={t}>
                                  {t}
                                </MenuItem>
                              ))}
                        </Select>
                      </FormControl>
                    </div>
                  </div>

                  {/* Case Details Message */}
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-300 tracking-wider mb-1 font-semibold">
                      Brief Case Notes / Rejection History (Optional)
                    </label>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      name="message"
                      placeholder={
                        activeTab === "individual"
                          ? "Mention details of any loan rejected, lender name, or incorrect late payments..."
                          : "Mention bank name, working capital sanction issues, or details of incorrect charge flags..."
                      }
                      value={formData.message}
                      onChange={handleChange}
                      sx={inputStyle}
                    />
                  </div>

                  {/* Submit CTA */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full py-4 px-6 rounded-xl font-bold text-base text-slate-950 shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 flex items-center justify-center gap-2 ${
                        activeTab === "individual"
                          ? "bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 shadow-[0_0_30px_rgba(0,210,255,0.4)]"
                          : "bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 shadow-[0_0_30px_rgba(58,250,172,0.4)]"
                      }`}
                    >
                      {loading ? (
                        <>
                          <CircularProgress size={20} sx={{ color: "#080E1B" }} />
                          <span>Submitting Case Application...</span>
                        </>
                      ) : (
                        <>
                          <span>
                            {activeTab === "individual"
                              ? "Get Free Personal Credit Review"
                              : "Submit Corporate CMR Case for Evaluation"}
                          </span>
                          <span className="material-symbols-outlined text-xl">arrow_forward</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* PROCESS & HOW IT WORKS SECTION */}
          <div className="mt-20 pt-12 border-t border-slate-800/80">
            <div className="text-center mb-12">
              <h3 className="text-2xl sm:text-3xl font-bold font-['Sora'] text-white">
                How Our Resolution Desk Resolves Credit Inaccuracies
              </h3>
              <p className="text-slate-400 text-sm max-w-xl mx-auto mt-2">
                A legally compliant dispute protocol governed by the Credit Information Companies (Regulation) Act, 2005.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                {
                  step: "01",
                  title: "Bureau Data Audit",
                  desc: "Soft evaluation across CIBIL, Experian, Equifax & CRIF to pinpoint errors, DPD tags & wrong liabilities.",
                  icon: "find_in_page",
                },
                {
                  step: "02",
                  title: "Statutory Dispute Draft",
                  desc: "Drafting formal dispute applications under Section 21 of CICRA 2005 for institutional submission.",
                  icon: "gavel",
                },
                {
                  step: "03",
                  title: "Lender & Bank Liaison",
                  desc: "Direct communication with bank nodal officers and bureau dispute desks for record rectification.",
                  icon: "handshake",
                },
                {
                  step: "04",
                  title: "Score & CMR Re-Index",
                  desc: "Final verification of updated bureau records, clean NOC updates, and restored creditworthiness.",
                  icon: "trending_up",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="p-6 rounded-2xl bg-[#0a1426]/70 border border-slate-800 hover:border-cyan-500/30 transition-all backdrop-blur-md"
                >
                  <div className="text-xs font-mono text-cyan-400 font-bold mb-3">{item.step} // STAGE</div>
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-4 border border-cyan-500/20">
                    <span className="material-symbols-outlined text-xl">{item.icon}</span>
                  </div>
                  <h4 className="text-white font-bold font-['Sora'] text-base mb-2">{item.title}</h4>
                  <p className="text-slate-400 text-xs leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <HomePageFooter />
    </div>
  );
};

export default CreditScoreRepairPage;