import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TextField, CircularProgress } from '@mui/material';
import { ifscAPI } from '../../services/api';
import Header from './Header';
import HomePageFooter from './HomePageFooter';

const IfscFinder = () => {
  const [ifscCode, setIfscCode] = useState('');
  const [bankDetails, setBankDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notFound, setNotFound] = useState(false);

  const validateIfsc = (code) => {
    const ifscRegex = /^[A-Za-z]{4}0[A-Za-z0-9]{6}$/;
    return ifscRegex.test(code);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setNotFound(false);
    setBankDetails(null);

    const cleanCode = ifscCode.trim().toUpperCase();

    if (!cleanCode) {
      setError('Please enter an IFSC code');
      return;
    }

    if (!validateIfsc(cleanCode)) {
      setError('Invalid IFSC format. Must be 11 characters (e.g. HDFC0000123, SBIN0001234)');
      return;
    }

    setLoading(true);

    try {
      const response = await ifscAPI.getBankDetails(cleanCode);
      if (response.data === "Not Found" || !response.data) {
        setNotFound(true);
      } else {
        setBankDetails(response.data);
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setNotFound(true);
      } else {
        setError(err.response?.data?.message || 'Error fetching bank branch details. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#080E1B] font-body-md text-slate-100 antialiased min-h-screen flex flex-col justify-between selection:bg-cyan-500 selection:text-slate-950">
      <Header />

      <main className="relative flex-grow pt-24 pb-20 overflow-hidden">
        {/* Volumetric ambient backlights */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[350px] bg-cyan-500/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/4 w-[450px] h-[300px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
          {/* Header Title */}
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-400 font-mono text-xs mb-4 shadow-[0_0_20px_rgba(0,210,255,0.2)]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#3afaac]" />
              <span>RBI RECOGNIZED NATIONAL CLEARING SEARCH</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-['Sora'] tracking-tight mb-4">
              IFSC Code{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-emerald-400">
                Finder.
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Find verified bank branch details, RTGS / NEFT / IMPS availability, complete address, and contact information instantly.
            </p>
          </div>

          {/* Search Card */}
          <div className="p-6 sm:p-10 rounded-[24px] bg-[#0a1426]/90 border border-cyan-500/30 shadow-[0_0_40px_rgba(0,210,255,0.15),0_25px_60px_-15px_rgba(0,0,0,0.85)] backdrop-blur-2xl mb-8">
            <form onSubmit={handleSearch} noValidate>
              <div className="mb-4">
                <label className="block text-xs font-mono uppercase text-slate-300 tracking-wider mb-2 font-semibold">
                  Enter 11-Character IFSC Code *
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <TextField
                    fullWidth
                    required
                    value={ifscCode}
                    onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                    placeholder="e.g. HDFC0000123, SBIN0000456, ICIC0001020"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        color: "#ffffff",
                        backgroundColor: "#071120",
                        borderRadius: "12px",
                        fontFamily: "monospace",
                        letterSpacing: "0.08em",
                        "& fieldset": { borderColor: "rgba(0, 210, 255, 0.25)", borderWidth: "1.5px" },
                        "&:hover fieldset": { borderColor: "rgba(0, 210, 255, 0.55)" },
                        "&.Mui-focused fieldset": { borderColor: "#00d2ff !important", boxShadow: "0 0 16px rgba(0, 210, 255, 0.25)" },
                        "& input": {
                          color: "#ffffff !important",
                          textTransform: "uppercase",
                        },
                      },
                    }}
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="py-3.5 px-8 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 text-slate-950 font-bold text-sm sm:text-base shadow-[0_0_25px_rgba(0,210,255,0.4)] hover:scale-105 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shrink-0"
                  >
                    {loading ? (
                      <>
                        <CircularProgress size={20} sx={{ color: "#080E1B" }} />
                        <span>Searching...</span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-xl">search</span>
                        <span>Find Bank Details</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="text-[11px] font-mono text-slate-400 mt-2">
                  Format: 4 letters (Bank Code) + 0 + 6 letters/digits (Branch Code)
                </div>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="p-3.5 rounded-xl bg-red-950/50 border border-red-500/40 text-red-200 text-xs sm:text-sm flex items-center gap-2 mt-4">
                  <span className="material-symbols-outlined text-red-400 text-lg shrink-0">error</span>
                  <span>{error}</span>
                </div>
              )}

              {/* Not Found Alert */}
              {notFound && (
                <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs sm:text-sm flex items-center gap-2 mt-4">
                  <span className="material-symbols-outlined text-amber-400 text-lg shrink-0">info</span>
                  <span>No branch found matching IFSC "{ifscCode}". Please verify and check again.</span>
                </div>
              )}
            </form>
          </div>

          {/* Results Display */}
          {bankDetails && (
            <div className="p-6 sm:p-8 rounded-[24px] bg-gradient-to-b from-[#111f38]/95 via-[#0a1426]/98 to-[#060c18] border border-cyan-500/35 shadow-[0_0_40px_rgba(0,210,255,0.15)] backdrop-blur-2xl">
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-cyan-500/20">
                <div>
                  <span className="text-xs font-mono uppercase text-cyan-400 font-bold">Verified Bank Record</span>
                  <h2 className="text-2xl font-bold font-['Sora'] text-white mt-0.5">{bankDetails.BANK}</h2>
                </div>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/30">
                  Active IFSC
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
                <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
                  <div className="text-slate-400 mb-1">Branch Name</div>
                  <div className="text-white font-bold text-sm">{bankDetails.BRANCH}</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
                  <div className="text-slate-400 mb-1">IFSC Code</div>
                  <div className="text-cyan-300 font-bold text-sm">{bankDetails.IFSC}</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 sm:col-span-2">
                  <div className="text-slate-400 mb-1">Branch Address</div>
                  <div className="text-white text-sm font-sans">{bankDetails.ADDRESS}</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
                  <div className="text-slate-400 mb-1">City / District</div>
                  <div className="text-white font-semibold">{bankDetails.CITY || bankDetails.DISTRICT}</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
                  <div className="text-slate-400 mb-1">State</div>
                  <div className="text-white font-semibold">{bankDetails.STATE}</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 sm:col-span-2 flex flex-wrap gap-4 text-xs font-mono">
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <span>✓</span> <span>RTGS: {bankDetails.RTGS ? "Available" : "Not Supported"}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-cyan-400">
                    <span>✓</span> <span>NEFT: {bankDetails.NEFT ? "Available" : "Not Supported"}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sky-400">
                    <span>✓</span> <span>IMPS: {bankDetails.IMPS ? "Available" : "Not Supported"}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <HomePageFooter />
    </div>
  );
};

export default IfscFinder;