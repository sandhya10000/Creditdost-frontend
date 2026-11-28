import React, { useState } from "react";
import { Link } from "react-router-dom";
import { TextField, CircularProgress, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import Header from "./homepage/Header";
import HomePageFooter from "./homepage/HomePageFooter";
import api from "../services/api";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobileNumber: "",
    subject: "General Inquiry",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "mobileNumber") {
      const numeric = value.replace(/[^0-9]/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, [name]: numeric }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError("Please fill in all required fields (Name, Email, Message)");
      return;
    }

    setIsSubmitting(true);

    try {
      await api.post("/forms/contact", formData);
      setSuccess(true);
      setFormData({
        name: "",
        email: "",
        mobileNumber: "",
        subject: "General Inquiry",
        message: "",
      });
    } catch (err) {
      console.error("Contact form error:", err);
      setError(err.response?.data?.message || "Failed to submit message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = {
    "& .MuiOutlinedInput-root": {
      color: "#ffffff",
      backgroundColor: "#071120",
      borderRadius: "12px",
      fontFamily: "'Inter', sans-serif",
      "& fieldset": { borderColor: "rgba(0, 210, 255, 0.25)", borderWidth: "1.5px" },
      "&:hover fieldset": { borderColor: "rgba(0, 210, 255, 0.55)" },
      "&.Mui-focused fieldset": { borderColor: "#00d2ff !important", boxShadow: "0 0 16px rgba(0, 210, 255, 0.25)" },
      "& input": { color: "#ffffff !important" },
    },
    "& .MuiInputLabel-root": {
      color: "rgba(203, 213, 225, 0.8)",
      "&.Mui-focused": { color: "#00d2ff !important" },
    },
  };

  return (
    <div className="bg-[#080E1B] font-body-md text-slate-100 antialiased min-h-screen flex flex-col justify-between selection:bg-cyan-500 selection:text-slate-950">
      <Header />

      <main className="relative flex-grow pt-24 pb-20 overflow-hidden">
        {/* Volumetric ambient backlights */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[350px] bg-cyan-500/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/4 w-[450px] h-[300px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs & Header */}
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-6">
            <Link to="/" className="hover:text-cyan-400 transition-colors">Home</Link>
            <span className="text-slate-600">/</span>
            <span className="text-cyan-400 font-semibold">Contact Us</span>
          </div>

          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-400 font-mono text-xs mb-4 shadow-[0_0_20px_rgba(0,210,255,0.2)]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#3afaac]" />
              <span>DIRECT CLIENT & PARTNER DESK</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-['Sora'] tracking-tight mb-4">
              Get in{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-emerald-400">
                Touch.
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Have questions about your credit score, bureau dispute cases, or partnership inquiries? Reach our advisory team directly.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Form */}
            <div className="lg:col-span-7 p-6 sm:p-10 rounded-[28px] bg-gradient-to-b from-[#111f38]/95 via-[#0a1426]/98 to-[#060c18] border border-cyan-500/30 shadow-[0_0_40px_rgba(0,210,255,0.12),0_25px_60px_-15px_rgba(0,0,0,0.85)] backdrop-blur-2xl">
              <div className="pb-4 mb-6 border-b border-cyan-500/20">
                <h2 className="text-xl font-bold font-['Sora'] text-white">Send Us a Message</h2>
                <p className="text-xs text-slate-400 font-mono mt-0.5">We respond within 24 business hours</p>
              </div>

              {success ? (
                <div className="py-10 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-400/40 text-emerald-400 flex items-center justify-center mx-auto mb-4 animate-bounce shadow-[0_0_30px_rgba(58,250,172,0.35)]">
                    <span className="material-symbols-outlined text-3xl">check_circle</span>
                  </div>
                  <h3 className="text-2xl font-bold font-['Sora'] text-white mb-2">Message Delivered!</h3>
                  <p className="text-slate-300 text-sm max-w-sm mx-auto mb-6">
                    Thank you for reaching out. A Credit Dost representative has received your enquiry and will contact you shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSuccess(false)}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 text-slate-950 font-bold text-sm shadow-lg hover:scale-105 transition-all"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                  {error && (
                    <div className="p-3.5 rounded-xl bg-red-950/50 border border-red-500/40 text-red-200 text-xs sm:text-sm flex items-center gap-2">
                      <span className="material-symbols-outlined text-red-400 text-lg shrink-0">error</span>
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase text-slate-300 tracking-wider mb-1 font-semibold">
                        Your Name *
                      </label>
                      <TextField
                        fullWidth
                        required
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Rahul Sharma"
                        sx={inputStyle}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-slate-300 tracking-wider mb-1 font-semibold">
                        Email Address *
                      </label>
                      <TextField
                        fullWidth
                        required
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="name@example.com"
                        sx={inputStyle}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase text-slate-300 tracking-wider mb-1 font-semibold">
                        Mobile Number (Optional)
                      </label>
                      <TextField
                        fullWidth
                        name="mobileNumber"
                        value={formData.mobileNumber}
                        onChange={handleChange}
                        placeholder="9876543210"
                        sx={inputStyle}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-slate-300 tracking-wider mb-1 font-semibold">
                        Subject
                      </label>
                      <FormControl fullWidth sx={inputStyle}>
                        <Select
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          MenuProps={{ PaperProps: { sx: { bgcolor: "#0a1426", color: "#fff" } } }}
                        >
                          <MenuItem value="General Inquiry">General Inquiry</MenuItem>
                          <MenuItem value="Credit Score Repair">Credit Score Repair</MenuItem>
                          <MenuItem value="Corporate CMR Dispute">Corporate CMR Dispute</MenuItem>
                          <MenuItem value="Franchise Opportunity">Franchise Partnership</MenuItem>
                          <MenuItem value="Technical Support">Technical Support</MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-300 tracking-wider mb-1 font-semibold">
                      Your Message *
                    </label>
                    <TextField
                      fullWidth
                      required
                      multiline
                      rows={4}
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="How can our team assist you today?"
                      sx={inputStyle}
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 text-slate-950 font-bold text-base shadow-[0_0_30px_rgba(0,210,255,0.4)] hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <CircularProgress size={20} sx={{ color: "#080E1B" }} />
                          <span>Delivering Message...</span>
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-xl">send</span>
                          <span>Send Message</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Right Column: Contact Details Cards */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 sm:p-8 rounded-[24px] bg-[#0a1426]/90 border border-cyan-500/25 shadow-[0_0_30px_rgba(0,210,255,0.1)] backdrop-blur-xl space-y-6">
                <div className="pb-4 border-b border-cyan-500/20">
                  <h3 className="text-xl font-bold font-['Sora'] text-white">Contact Information</h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">National support channels</p>
                </div>

                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-2xl">mail</span>
                    </div>
                    <div>
                      <div className="text-xs font-mono uppercase text-slate-400">Direct Email</div>
                      <a href="mailto:info@creditdost.co.in" className="text-white font-bold font-mono text-base hover:text-cyan-400 transition-colors">
                        info@creditdost.co.in
                      </a>
                      <div className="text-[11px] text-slate-400 mt-0.5">Official enquiries & dispute desk</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-2xl">call</span>
                    </div>
                    <div>
                      <div className="text-xs font-mono uppercase text-slate-400">Telephone Helpline</div>
                      <a href="tel:+919217469202" className="text-white font-bold font-mono text-base hover:text-cyan-400 transition-colors">
                        +91 92174-69202
                      </a>
                      <div className="text-[11px] text-slate-400 mt-0.5">Mon - Sat: 10:00 AM - 6:30 PM IST</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-400 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-2xl">verified_user</span>
                    </div>
                    <div>
                      <div className="text-xs font-mono uppercase text-slate-400">Statutory Office</div>
                      <div className="text-white font-bold text-sm">Credit Dost Financial Services</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">CICRA 2005 Dispute Framework (Pan-India)</div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-800">
                  <div className="text-xs font-mono uppercase text-slate-400 mb-3 font-semibold">Social Channels</div>
                  <div className="flex gap-3">
                    {[
                      { href: "https://facebook.com", icon: "public" },
                      { href: "https://twitter.com", icon: "alternate_email" },
                      { href: "https://linkedin.com", icon: "share" },
                      { href: "https://instagram.com", icon: "photo_camera" },
                    ].map((item, idx) => (
                      <a
                        key={idx}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-400 text-slate-300 hover:text-cyan-400 flex items-center justify-center transition-all"
                      >
                        <span className="material-symbols-outlined text-lg">{item.icon}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      <HomePageFooter />
    </div>
  );
};

export default ContactPage;