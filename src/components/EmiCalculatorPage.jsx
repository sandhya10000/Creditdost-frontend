import React, { useState } from "react";
import {
  Container,
  TextField,
  CircularProgress,
  IconButton,
  Tooltip,
} from "@mui/material";
import { emiAPI } from "../services/api";
import Header from "./homepage/Header";
import HomePageFooter from "./homepage/HomePageFooter";

const EmiCalculatorPage = () => {
  const [loanAmount, setLoanAmount] = useState("500000");
  const [interestRate, setInterestRate] = useState("10.5");
  const [loanTenure, setLoanTenure] = useState("5");
  const [emiResult, setEmiResult] = useState(null);
  const [emiSchedule, setEmiSchedule] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSchedule, setShowSchedule] = useState(false);

  // Client-side quick calculation fallback for instant UI response
  const calculateClientEMI = (p, r, y) => {
    const monthlyRate = r / 12 / 100;
    const months = y * 12;
    const emi = (p * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    const totalPayment = emi * months;
    const totalInterest = totalPayment - p;
    return {
      emi: Math.round(emi).toLocaleString("en-IN"),
      totalInterest: Math.round(totalInterest).toLocaleString("en-IN"),
      principal: Math.round(p).toLocaleString("en-IN"),
      totalPayment: Math.round(totalPayment).toLocaleString("en-IN"),
      rawEmi: Math.round(emi),
      rawInterest: Math.round(totalInterest),
      rawPrincipal: Math.round(p),
      rawTotal: Math.round(totalPayment),
    };
  };

  const validateForm = () => {
    if (!loanAmount || Number(loanAmount) <= 0) {
      setError("Please enter a valid loan amount (e.g., ₹5,00,000)");
      return false;
    }
    if (!interestRate || Number(interestRate) <= 0) {
      setError("Please enter a valid interest rate (e.g., 10.5%)");
      return false;
    }
    if (!loanTenure || Number(loanTenure) <= 0) {
      setError("Please enter a valid loan tenure in years (e.g., 5)");
      return false;
    }
    return true;
  };

  const calculateEMI = async () => {
    if (!validateForm()) return;

    setError("");
    setLoading(true);

    try {
      const p = parseFloat(loanAmount);
      const r = parseFloat(interestRate);
      const t = parseFloat(loanTenure);

      try {
        const response = await emiAPI.calculateEMI({
          loanAmount: p,
          interestRate: r,
          loanTenure: t,
        });
        setEmiResult(response.data);

        const scheduleResponse = await emiAPI.generateEmiSchedule({
          loanAmount: p,
          interestRate: r,
          loanTenure: t,
        });
        setEmiSchedule(scheduleResponse.data.schedule);
      } catch (apiErr) {
        // Fallback to robust offline calculation if API endpoint is unavailable
        const clientRes = calculateClientEMI(p, r, t);
        setEmiResult(clientRes);

        // Generate client-side amortization table
        const sched = [];
        let balance = p;
        const monthlyRate = r / 12 / 100;
        const totalMonths = t * 12;
        const emi = clientRes.rawEmi;

        for (let m = 1; m <= totalMonths; m++) {
          const interest = Math.round(balance * monthlyRate);
          const principal = Math.min(emi - interest, balance);
          balance = Math.max(0, balance - principal);
          sched.push({
            month: m,
            emi: emi.toLocaleString("en-IN"),
            interest: interest.toLocaleString("en-IN"),
            principal: principal.toLocaleString("en-IN"),
            balance: balance.toLocaleString("en-IN"),
          });
          if (balance === 0) break;
        }
        setEmiSchedule(sched);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error calculating EMI. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const downloadSchedule = () => {
    if (emiSchedule.length === 0) {
      setError("No EMI schedule available. Please calculate EMI first.");
      return;
    }

    let csvContent = "Month,EMI (INR),Interest (INR),Principal (INR),Outstanding Balance (INR)\n";
    emiSchedule.forEach((row) => {
      csvContent += `${row.month},${row.emi.replace(/,/g, "")},${row.interest.replace(/,/g, "")},${row.principal.replace(/,/g, "")},${row.balance.replace(/,/g, "")}\n`;
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `CreditDost_EMI_Schedule_${loanAmount}_INR.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-[#080E1B] font-body-md text-slate-100 antialiased min-h-screen flex flex-col justify-between selection:bg-cyan-500 selection:text-slate-950">
      <Header />

      <main className="relative flex-grow pt-24 pb-20 overflow-hidden">
        {/* Volumetric Backdrops */}
        <div className="absolute top-1/4 left-1/4 w-[550px] h-[350px] bg-cyan-500/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/4 w-[450px] h-[300px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />

        <Container maxWidth="lg" className="relative z-10 px-4 sm:px-6">
          {/* Header Section */}
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-400 font-mono text-xs mb-4 shadow-[0_0_20px_rgba(0,210,255,0.2)]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#3afaac]" />
              <span>SMART FINANCIAL AMORTIZATION TOOL</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-['Sora'] tracking-tight mb-4">
              Loan EMI{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-emerald-400">
                Calculator.
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Calculate your exact monthly payments, total interest burden, and download an amortization repayment schedule approved for personal, home, and business loans.
            </p>
          </div>

          {/* Main Grid: Calculator Inputs & Instant Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
            
            {/* Input Parameters Card */}
            <div className="lg:col-span-6 p-6 sm:p-8 rounded-[24px] bg-[#0a1426]/90 border border-cyan-500/30 shadow-[0_0_40px_rgba(0,210,255,0.12),0_25px_60px_-15px_rgba(0,0,0,0.8)] backdrop-blur-xl">
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-cyan-500/20">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-cyan-400 text-2xl">tune</span>
                  <h2 className="text-xl font-bold font-['Sora'] text-white">Loan Parameters</h2>
                </div>
                <span className="text-xs font-mono text-slate-400">INR (₹)</span>
              </div>

              {error && (
                <div className="mb-5 p-3.5 rounded-xl bg-red-950/50 border border-red-500/40 text-red-200 text-xs sm:text-sm flex items-center gap-2">
                  <span className="material-symbols-outlined text-red-400 text-lg shrink-0">error</span>
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-5">
                {/* Loan Amount */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-mono uppercase text-slate-300 font-semibold tracking-wider">
                      Loan Amount (₹) *
                    </label>
                    <span className="text-xs font-mono text-cyan-400 font-bold">
                      ₹{Number(loanAmount || 0).toLocaleString("en-IN")}
                    </span>
                  </div>
                  <TextField
                    fullWidth
                    required
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                    placeholder="500000"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        color: "#ffffff",
                        backgroundColor: "rgba(10, 20, 38, 0.75)",
                        borderRadius: "12px",
                        fontFamily: "'Inter', sans-serif",
                        "& fieldset": { borderColor: "rgba(0, 210, 255, 0.25)", borderWidth: "1.5px" },
                        "&:hover fieldset": { borderColor: "rgba(0, 210, 255, 0.55)" },
                        "&.Mui-focused fieldset": { borderColor: "#00d2ff !important", boxShadow: "0 0 16px rgba(0, 210, 255, 0.25)" },
                      },
                    }}
                  />
                  {/* Quick Preset Buttons */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {["100000", "500000", "1000000", "2500000", "5000000"].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setLoanAmount(preset)}
                        className={`text-[11px] font-mono px-2.5 py-1 rounded-lg border transition-all ${
                          loanAmount === preset
                            ? "bg-cyan-500/20 text-cyan-300 border-cyan-400 font-bold"
                            : "bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700"
                        }`}
                      >
                        ₹{(Number(preset) / 100000).toFixed(preset >= 1000000 ? 0 : 1)}L
                      </button>
                    ))}
                  </div>
                </div>

                {/* Interest Rate */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-mono uppercase text-slate-300 font-semibold tracking-wider">
                      Annual Interest Rate (%) *
                    </label>
                    <span className="text-xs font-mono text-cyan-400 font-bold">{interestRate || 0}% p.a.</span>
                  </div>
                  <TextField
                    fullWidth
                    required
                    type="number"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    placeholder="10.5"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        color: "#ffffff",
                        backgroundColor: "rgba(10, 20, 38, 0.75)",
                        borderRadius: "12px",
                        fontFamily: "'Inter', sans-serif",
                        "& fieldset": { borderColor: "rgba(0, 210, 255, 0.25)", borderWidth: "1.5px" },
                        "&:hover fieldset": { borderColor: "rgba(0, 210, 255, 0.55)" },
                        "&.Mui-focused fieldset": { borderColor: "#00d2ff !important", boxShadow: "0 0 16px rgba(0, 210, 255, 0.25)" },
                      },
                    }}
                  />
                  {/* Preset Rates */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {[
                      { label: "Home (8.5%)", rate: "8.5" },
                      { label: "Personal (11.5%)", rate: "11.5" },
                      { label: "Business (14%)", rate: "14" },
                    ].map((item) => (
                      <button
                        key={item.rate}
                        type="button"
                        onClick={() => setInterestRate(item.rate)}
                        className={`text-[11px] font-mono px-2.5 py-1 rounded-lg border transition-all ${
                          interestRate === item.rate
                            ? "bg-cyan-500/20 text-cyan-300 border-cyan-400 font-bold"
                            : "bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Loan Tenure */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-mono uppercase text-slate-300 font-semibold tracking-wider">
                      Tenure (Years) *
                    </label>
                    <span className="text-xs font-mono text-cyan-400 font-bold">
                      {loanTenure || 0} Years ({Number(loanTenure || 0) * 12} Months)
                    </span>
                  </div>
                  <TextField
                    fullWidth
                    required
                    type="number"
                    step="1"
                    value={loanTenure}
                    onChange={(e) => setLoanTenure(e.target.value)}
                    placeholder="5"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        color: "#ffffff",
                        backgroundColor: "rgba(10, 20, 38, 0.75)",
                        borderRadius: "12px",
                        fontFamily: "'Inter', sans-serif",
                        "& fieldset": { borderColor: "rgba(0, 210, 255, 0.25)", borderWidth: "1.5px" },
                        "&:hover fieldset": { borderColor: "rgba(0, 210, 255, 0.55)" },
                        "&.Mui-focused fieldset": { borderColor: "#00d2ff !important", boxShadow: "0 0 16px rgba(0, 210, 255, 0.25)" },
                      },
                    }}
                  />
                  {/* Preset Tenures */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {["1", "3", "5", "10", "15", "20"].map((yr) => (
                      <button
                        key={yr}
                        type="button"
                        onClick={() => setLoanTenure(yr)}
                        className={`text-[11px] font-mono px-2.5 py-1 rounded-lg border transition-all ${
                          loanTenure === yr
                            ? "bg-cyan-500/20 text-cyan-300 border-cyan-400 font-bold"
                            : "bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700"
                        }`}
                      >
                        {yr} {yr === "1" ? "Year" : "Years"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Calculate Trigger */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={calculateEMI}
                    disabled={loading}
                    className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 text-slate-950 font-bold text-base shadow-[0_0_30px_rgba(0,210,255,0.45)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <CircularProgress size={20} sx={{ color: "#080E1B" }} />
                        <span>Calculating Schedule...</span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-xl">calculate</span>
                        <span>Calculate EMI Breakdown</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Output Summary Card */}
            <div className="lg:col-span-6 p-6 sm:p-8 rounded-[24px] bg-gradient-to-b from-[#111f38]/95 via-[#0a1426]/98 to-[#060c18] border border-cyan-500/30 shadow-[0_0_40px_rgba(0,210,255,0.15),0_25px_60px_-15px_rgba(0,0,0,0.8)] backdrop-blur-xl">
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-cyan-500/20">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-400 text-2xl">analytics</span>
                  <h2 className="text-xl font-bold font-['Sora'] text-white">Payment Summary</h2>
                </div>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/30">
                  Live Amortization
                </span>
              </div>

              {emiResult ? (
                <div className="space-y-6">
                  {/* Hero Metric: Monthly EMI */}
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-950/60 via-slate-900/80 to-[#080E1B] border border-cyan-400/40 shadow-[0_0_25px_rgba(0,210,255,0.2)] text-center">
                    <span className="text-xs font-mono uppercase tracking-widest text-cyan-300">
                      Calculated Monthly EMI
                    </span>
                    <div className="text-4xl sm:text-5xl font-black font-['Sora'] text-white mt-1 mb-2 tracking-tight">
                      ₹{emiResult.emi}
                    </div>
                    <span className="text-xs text-slate-400 font-mono">
                      Payable each month for {loanTenure} years ({Number(loanTenure) * 12} instalments)
                    </span>
                  </div>

                  {/* 3-Way Financial Distribution Metric Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
                    <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
                      <div className="text-slate-400 text-xs mb-1">Principal Amount</div>
                      <div className="text-white font-bold text-base">₹{emiResult.principal}</div>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-900/70 border border-amber-500/30">
                      <div className="text-amber-400 text-xs mb-1">Total Interest</div>
                      <div className="text-amber-300 font-bold text-base">₹{emiResult.totalInterest}</div>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-900/70 border border-emerald-500/30">
                      <div className="text-emerald-400 text-xs mb-1">Total Payable</div>
                      <div className="text-emerald-300 font-bold text-base">₹{emiResult.totalPayment}</div>
                    </div>
                  </div>

                  {/* Actions: View / Hide Schedule + Download CSV */}
                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setShowSchedule(!showSchedule)}
                      className="flex-1 py-3 px-4 rounded-xl bg-slate-800/80 border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 font-semibold text-sm transition-all flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-lg">
                        {showSchedule ? "visibility_off" : "table_chart"}
                      </span>
                      <span>{showSchedule ? "Hide Schedule" : "View Detailed Amortization"}</span>
                    </button>

                    <Tooltip title="Download CSV Schedule">
                      <button
                        type="button"
                        onClick={downloadSchedule}
                        className="py-3 px-4 rounded-xl bg-cyan-500/15 border border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/25 transition-all flex items-center justify-center"
                      >
                        <span className="material-symbols-outlined text-xl">download</span>
                      </button>
                    </Tooltip>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-slate-400">
                  <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto mb-4">
                    <span className="material-symbols-outlined text-3xl">calculate</span>
                  </div>
                  <h3 className="text-lg font-bold font-['Sora'] text-white mb-1">
                    Ready to Calculate
                  </h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
                    Enter your loan amount, interest rate, and tenure on the left and click calculate to view the complete schedule.
                  </p>
                  <button
                    type="button"
                    onClick={calculateEMI}
                    className="px-6 py-2.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold hover:bg-cyan-500/30 transition-all"
                  >
                    Quick Calculate Default Loan (₹5L @ 10.5%)
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* Amortization Table Section (if toggled) */}
          {showSchedule && emiSchedule.length > 0 && (
            <div className="mt-8 p-6 sm:p-8 rounded-[24px] bg-[#0a1426]/95 border border-cyan-500/30 shadow-[0_0_40px_rgba(0,210,255,0.15)] backdrop-blur-2xl">
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-cyan-500/20">
                <div>
                  <h3 className="text-xl font-bold font-['Sora'] text-white">Monthly Repayment Schedule</h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    Breakdown of monthly principal, interest, and residual balance
                  </p>
                </div>
                <button
                  type="button"
                  onClick={downloadSchedule}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold hover:bg-cyan-500/30 transition-all"
                >
                  <span className="material-symbols-outlined text-base">download</span>
                  <span>Export CSV</span>
                </button>
              </div>

              <div className="overflow-x-auto max-h-[460px] rounded-xl border border-slate-800">
                <table className="w-full text-left font-mono text-xs">
                  <thead className="bg-[#0e1f3a] text-cyan-300 uppercase tracking-wider sticky top-0 border-b border-cyan-500/30">
                    <tr>
                      <th className="py-3.5 px-4">Month</th>
                      <th className="py-3.5 px-4">EMI (₹)</th>
                      <th className="py-3.5 px-4">Interest (₹)</th>
                      <th className="py-3.5 px-4">Principal (₹)</th>
                      <th className="py-3.5 px-4">Remaining Balance (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {emiSchedule.map((row) => (
                      <tr key={row.month} className="hover:bg-cyan-950/20 transition-colors">
                        <td className="py-3 px-4 font-bold text-white">Month {row.month}</td>
                        <td className="py-3 px-4 text-cyan-300 font-semibold">₹{row.emi}</td>
                        <td className="py-3 px-4 text-amber-400">₹{row.interest}</td>
                        <td className="py-3 px-4 text-emerald-400">₹{row.principal}</td>
                        <td className="py-3 px-4 text-white">₹{row.balance}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </Container>
      </main>

      <HomePageFooter />
    </div>
  );
};

export default EmiCalculatorPage;