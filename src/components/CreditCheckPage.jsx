import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import { creditAPI, smsAPI, getAttachmentUrl } from "../services/api";
import Header from "./homepage/Header";
import HomePageFooter from "./homepage/HomePageFooter";

// Indian states list
const IndianStates = [
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

const CreditCheckPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    pan: "",
    email: "",
    dob: "",
    pincode: "",
    occupation: "",
    city: "",
    state: "",
    language: "",
  });
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [reportData, setReportData] = useState(null);
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [otp, setOtp] = useState("");
  const [, setOtpVerified] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;
    if (name === "pan") {
      newValue = value.toUpperCase();
    }
    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
    if (error) setError("");
  };

  const validateForm = () => {
    if (!formData.name || formData.name.trim().length < 2) {
      setError("Please enter your full name as per official records");
      return false;
    }
    if (!formData.mobile || !/^[0-9]{10}$/.test(formData.mobile)) {
      setError("Please enter a valid 10-digit mobile number");
      return false;
    }
    if (!formData.pan || !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pan.toUpperCase())) {
      setError("Please enter a valid 10-character PAN number (e.g. ABCDE1234F)");
      return false;
    }
    if (!formData.dob) {
      setError("Please enter your date of birth (required for bureau verification)");
      return false;
    }
    if (!formData.pincode || !/^[0-9]{6}$/.test(formData.pincode)) {
      setError("Please enter a valid 6-digit postal pincode");
      return false;
    }
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Please enter a valid email address to receive your report");
      return false;
    }
    if (!formData.state) {
      setError("Please select your state");
      return false;
    }
    if (!formData.occupation) {
      setError("Please select your occupation type");
      return false;
    }
    return true;
  };

  const handleSendOTP = async () => {
    if (!validateForm()) return;

    setOtpLoading(true);
    setOtpError("");

    try {
      const response = await smsAPI.sendOTP({
        mobile: formData.mobile,
        purpose: "credit report generation",
      });

      if (response.data.success) {
        setShowOtpDialog(true);
        setError("");
      } else {
        setOtpError(
          response.data.message || "Failed to send OTP. Please check your mobile number and retry."
        );
      }
    } catch (err) {
      setOtpError(
        err.response?.data?.message || "Failed to send OTP. Please try again."
      );
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setOtpLoading(true);
    setOtpError("");

    try {
      const response = await smsAPI.verifyOTP({
        mobile: formData.mobile,
        otp: otp,
      });

      if (response.data.success) {
        setOtpVerified(true);
        setShowOtpDialog(false);

        // Proceed with credit report generation
        setLoading(true);
        const creditResponse = await creditAPI.checkCreditScorePublic({
          ...formData,
          bureau: "experian",
        });

        setReportData(creditResponse.data);
        setSuccess(true);
        setOtp("");
      } else {
        setOtpError(response.data.message || "Invalid OTP. Please check and try again.");
      }
    } catch (err) {
      setOtpError(
        err.response?.data?.message || "Failed to verify OTP. Please try again."
      );
    } finally {
      setOtpLoading(false);
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setOtpLoading(true);
    setOtpError("");

    try {
      const response = await smsAPI.resendOTP({
        mobile: formData.mobile,
        purpose: "credit report generation",
      });

      if (response.data.success) {
        setOtpError("OTP has been resent to your mobile/WhatsApp successfully.");
      } else {
        setOtpError(
          response.data.message || "Failed to resend OTP. Please try again."
        );
      }
    } catch (err) {
      setOtpError(
        err.response?.data?.message || "Failed to resend OTP. Please try again."
      );
    } finally {
      setOtpLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!validateForm()) return;
    handleSendOTP();
  };

  return (
    <div className="bg-[#080E1B] font-body-md text-slate-100 antialiased min-h-screen selection:bg-cyan-500 selection:text-slate-950 flex flex-col justify-between">
      <Header />

      <main className="w-full relative overflow-hidden pt-[104px] pb-16 lg:pt-[116px] lg:pb-24 flex-grow flex items-center">
        {/* Dynamic Obsidian Lumina Background Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[760px] h-[380px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
        <div className="absolute top-1/3 right-10 w-[460px] h-[460px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none -z-10" />
        <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[130px] pointer-events-none -z-10" />

        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center justify-center gap-2 text-xs font-mono text-slate-400 mb-6">
            <Link to="/" className="hover:text-cyan-400 transition-colors">
              Home
            </Link>
            <span className="text-slate-600">/</span>
            <span className="text-cyan-400 font-semibold">Free Credit Report</span>
          </div>

          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 font-mono text-xs mb-4 shadow-[0_0_15px_rgba(0,210,255,0.15)]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#3afaac]" />
              <span>OFFICIAL BUREAU VERIFICATION • NO IMPACT ON SCORE</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-['Sora'] leading-[1.15] mb-4">
              Free Credit{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-emerald-400">
                Health Report.
              </span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-normal">
              Get your official Experian credit score instantly. Check detailed bureau telemetry, active loan accounts, and dispute eligibility for free.
            </p>
          </div>

          {/* Form / Result Glass Container */}
          <div className="max-w-2xl mx-auto relative">
            {/* Outer Specular Glow Frame */}
            <div className="relative rounded-[28px] p-6 sm:p-10 bg-gradient-to-b from-[#111f38]/90 via-[#0a1426]/95 to-[#060c18]/98 border border-cyan-500/30 shadow-[0_0_40px_rgba(0,210,255,0.12),0_25px_60px_-15px_rgba(0,0,0,0.8)] backdrop-blur-2xl">
              
              {/* Subtle grid texture overlay */}
              <div className="absolute inset-0 rounded-[28px] bg-[linear-gradient(to_right,rgba(0,210,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,210,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

              {success ? (
                /* SUCCESS STATE VIEW */
                <div className="relative z-10 text-center py-6 flex flex-col items-center">
                  <div className="w-20 h-20 rounded-2xl bg-emerald-500/15 border border-emerald-400/40 text-emerald-400 flex items-center justify-center shadow-[0_0_30px_rgba(58,250,172,0.35)] mb-6 animate-bounce">
                    <span className="material-symbols-outlined text-4xl">check_circle</span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-bold font-['Sora'] text-white tracking-tight mb-3">
                    Report Generated Successfully!
                  </h2>

                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-lg mb-6">
                    Your Experian credit diagnostic has been dispatched to your WhatsApp on{" "}
                    <strong className="text-cyan-300 font-mono">{formData.mobile}</strong> and delivered to{" "}
                    <strong className="text-cyan-300 font-mono">{formData.email}</strong>.
                  </p>

                  <div className="p-4 rounded-xl bg-cyan-950/50 border border-cyan-500/30 text-left text-xs font-mono text-slate-300 mb-8 w-full max-w-md space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Bureau Partner:</span>
                      <span className="text-cyan-300 font-bold">Experian India (CICRA 2005)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Score Audit Inquiry:</span>
                      <span className="text-emerald-400 font-bold">Soft Pull (0 Pts Impact)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Applicant:</span>
                      <span className="text-white uppercase font-bold">{formData.name}</span>
                    </div>
                  </div>

                  {reportData?.creditReport?.localPath && (
                    <a
                      href={getAttachmentUrl(reportData.creditReport.localPath)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 text-slate-950 font-bold text-base shadow-[0_0_30px_rgba(0,210,255,0.45)] hover:scale-105 active:scale-95 transition-all"
                    >
                      <span className="material-symbols-outlined text-xl">download</span>
                      <span>Download Full Credit PDF</span>
                    </a>
                  )}

                  <button
                    onClick={() => {
                      setSuccess(false);
                      setFormData({
                        name: "",
                        mobile: "",
                        pan: "",
                        email: "",
                        dob: "",
                        pincode: "",
                        occupation: "",
                        city: "",
                        state: "",
                        language: "",
                      });
                    }}
                    className="mt-6 text-xs font-mono text-slate-400 hover:text-cyan-400 transition-colors"
                  >
                    ← Check Another Profile
                  </button>
                </div>
              ) : (
                /* FORM INPUT VIEW */
                <div className="relative z-10">
                  <div className="flex items-center justify-between pb-4 mb-6 border-b border-cyan-500/20">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-cyan-400 text-xl">badge</span>
                      <h2 className="text-lg sm:text-xl font-bold font-['Sora'] text-white">
                        Enter Identification Details
                      </h2>
                    </div>
                    <span className="text-[11px] font-mono text-cyan-300 bg-cyan-950/60 px-2.5 py-1 rounded-full border border-cyan-500/30">
                      Step 1 of 2
                    </span>
                  </div>

                  {error && (
                    <div className="mb-6 p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs sm:text-sm flex items-center gap-2.5 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                      <span className="material-symbols-outlined text-red-400 shrink-0">error</span>
                      <span>{error}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-mono uppercase text-slate-300 font-semibold mb-1.5 tracking-wider">
                        Full Name <span className="text-cyan-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Ramesh Kumar Sharma"
                        required
                        className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-700/80 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-white placeholder-slate-500 text-sm outline-none transition-all"
                      />
                    </div>

                    {/* Mobile Number & PAN Number (Grid) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono uppercase text-slate-300 font-semibold mb-1.5 tracking-wider">
                          Mobile Number <span className="text-cyan-400">*</span>
                        </label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-mono">
                            +91
                          </span>
                          <input
                            type="tel"
                            name="mobile"
                            maxLength={10}
                            value={formData.mobile}
                            onChange={handleChange}
                            placeholder="9876543210"
                            required
                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-900/80 border border-slate-700/80 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-white placeholder-slate-500 text-sm outline-none transition-all font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase text-slate-300 font-semibold mb-1.5 tracking-wider">
                          PAN Number <span className="text-cyan-400">*</span>
                        </label>
                        <input
                          type="text"
                          name="pan"
                          maxLength={10}
                          value={formData.pan}
                          onChange={handleChange}
                          placeholder="ABCDE1234F"
                          required
                          className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-700/80 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-white placeholder-slate-500 text-sm outline-none transition-all uppercase font-mono tracking-wider"
                        />
                      </div>
                    </div>

                    {/* Date of Birth & Pincode (Grid) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono uppercase text-slate-300 font-semibold mb-1.5 tracking-wider">
                          Date of Birth <span className="text-cyan-400">*</span>
                        </label>
                        <input
                          type="date"
                          name="dob"
                          value={formData.dob}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-700/80 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-white placeholder-slate-500 text-sm outline-none transition-all font-mono"
                          style={{ colorScheme: "dark" }}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase text-slate-300 font-semibold mb-1.5 tracking-wider">
                          Pincode <span className="text-cyan-400">*</span>
                        </label>
                        <input
                          type="text"
                          name="pincode"
                          maxLength={6}
                          value={formData.pincode}
                          onChange={handleChange}
                          placeholder="e.g. 110001"
                          required
                          className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-700/80 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-white placeholder-slate-500 text-sm outline-none transition-all font-mono"
                        />
                      </div>
                    </div>

                    {/* Email Address */}
                    <div>
                      <label className="block text-xs font-mono uppercase text-slate-300 font-semibold mb-1.5 tracking-wider">
                        Email Address <span className="text-cyan-400">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        required
                        className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-700/80 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-white placeholder-slate-500 text-sm outline-none transition-all"
                      />
                    </div>

                    {/* Occupation & City (Grid) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono uppercase text-slate-300 font-semibold mb-1.5 tracking-wider">
                          Occupation <span className="text-cyan-400">*</span>
                        </label>
                        <select
                          name="occupation"
                          value={formData.occupation}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-700/80 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-white text-sm outline-none transition-all cursor-pointer"
                        >
                          <option value="" className="bg-slate-900 text-slate-400">
                            Select Occupation
                          </option>
                          <option value="salaried" className="bg-slate-900 text-white">
                            Salaried Employee
                          </option>
                          <option value="self_employed" className="bg-slate-900 text-white">
                            Self Employed / Business
                          </option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase text-slate-300 font-semibold mb-1.5 tracking-wider">
                          City
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          placeholder="e.g. Mumbai"
                          className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-700/80 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-white placeholder-slate-500 text-sm outline-none transition-all"
                        />
                      </div>
                    </div>

                    {/* State & Preferred Language (Grid) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono uppercase text-slate-300 font-semibold mb-1.5 tracking-wider">
                          State <span className="text-cyan-400">*</span>
                        </label>
                        <select
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-700/80 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-white text-sm outline-none transition-all cursor-pointer"
                        >
                          <option value="" className="bg-slate-900 text-slate-400">
                            Select State
                          </option>
                          {IndianStates.map((st) => (
                            <option key={st} value={st} className="bg-slate-900 text-white">
                              {st}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase text-slate-300 font-semibold mb-1.5 tracking-wider">
                          Preferred Language
                        </label>
                        <select
                          name="language"
                          value={formData.language}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-700/80 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-white text-sm outline-none transition-all cursor-pointer"
                        >
                          <option value="" className="bg-slate-900 text-slate-400">
                            Select Language
                          </option>
                          <option value="english" className="bg-slate-900 text-white">English</option>
                          <option value="hindi" className="bg-slate-900 text-white">Hindi</option>
                          <option value="telugu" className="bg-slate-900 text-white">Telugu</option>
                          <option value="tamil" className="bg-slate-900 text-white">Tamil</option>
                          <option value="punjabi" className="bg-slate-900 text-white">Punjabi</option>
                          <option value="marathi" className="bg-slate-900 text-white">Marathi</option>
                          <option value="gujarati" className="bg-slate-900 text-white">Gujarati</option>
                          <option value="bengali" className="bg-slate-900 text-white">Bengali</option>
                          <option value="kannada" className="bg-slate-900 text-white">Kannada</option>
                          <option value="malayalam" className="bg-slate-900 text-white">Malayalam</option>
                          <option value="other" className="bg-slate-900 text-white">Other</option>
                        </select>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-3">
                      <button
                        type="submit"
                        disabled={loading || otpLoading}
                        className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 text-slate-950 font-bold text-base sm:text-lg font-['Sora'] shadow-[0_0_25px_rgba(0,210,255,0.45)] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center justify-center gap-2"
                      >
                        {loading || otpLoading ? (
                          <>
                            <CircularProgress size={22} sx={{ color: "#080E1B" }} />
                            <span>Verifying Credentials...</span>
                          </>
                        ) : (
                          <>
                            <span className="material-symbols-outlined text-xl">bolt</span>
                            <span>Get Free Credit Report</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>

                  {/* Security Guarantee Strip */}
                  <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-slate-400 font-mono">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-cyan-400 text-sm">lock</span>
                      <span>256-Bit SSL Encrypted</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-emerald-400 text-sm">shield</span>
                      <span>100% Free & No Bureau Impact</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sky-400 text-sm">verified</span>
                      <span>CICRA 2005 Compliant</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* OTP Verification Modal Dialog (Tailwind + Obsidian Glassmorphic styling) */}
      <Dialog
        open={showOtpDialog}
        onClose={() => !otpLoading && setShowOtpDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "24px",
            background: "linear-gradient(145deg, #0d1a33 0%, #060c18 100%)",
            border: "1px solid rgba(0, 210, 255, 0.35)",
            boxShadow: "0 0 50px rgba(0, 210, 255, 0.2), 0 25px 60px rgba(0, 0, 0, 0.9)",
            color: "white",
            p: 1,
          },
        }}
      >
        <DialogTitle sx={{ pb: 1, borderBottom: "1px solid rgba(0, 210, 255, 0.15)" }}>
          <div className="flex items-center gap-2 text-white font-['Sora'] font-bold text-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00d2ff]" />
            <span>Verify Mobile Number</span>
          </div>
        </DialogTitle>

        <DialogContent sx={{ pt: 3 }}>
          <p className="text-slate-300 text-sm leading-relaxed mb-4">
            We have dispatched a 6-digit verification code to your WhatsApp & SMS on{" "}
            <strong className="text-cyan-300 font-mono">{formData.mobile}</strong>. Enter it below to unlock your report.
          </p>

          {otpError && (
            <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
              <span className="material-symbols-outlined text-red-400 text-sm">error</span>
              <span>{otpError}</span>
            </div>
          )}

          <div className="my-2">
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="••••••"
              maxLength={6}
              autoFocus
              className="w-full text-center tracking-[12px] text-2xl font-mono font-bold px-4 py-3.5 rounded-xl bg-slate-900 border border-cyan-500/40 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 text-white outline-none transition-all placeholder-slate-600"
            />
          </div>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, pt: 1, display: "flex", justifyContent: "space-between" }}>
          <button
            onClick={handleResendOTP}
            disabled={otpLoading}
            type="button"
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 disabled:opacity-50 transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">sms</span>
            <span>Resend Code</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowOtpDialog(false)}
              disabled={otpLoading}
              type="button"
              className="px-4 py-2 rounded-lg text-slate-400 hover:text-white text-xs font-semibold transition-colors"
            >
              Cancel
            </button>

            <button
              onClick={handleVerifyOTP}
              disabled={otpLoading || otp.length !== 6}
              type="button"
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-600 text-slate-950 text-xs font-bold font-['Sora'] shadow-[0_0_15px_rgba(0,210,255,0.35)] disabled:opacity-50 disabled:pointer-events-none hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
            >
              {otpLoading ? (
                <CircularProgress size={16} sx={{ color: "#080E1B" }} />
              ) : (
                <>
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  <span>Verify & Proceed</span>
                </>
              )}
            </button>
          </div>
        </DialogActions>
      </Dialog>

      <HomePageFooter />
    </div>
  );
};

export default CreditCheckPage;
