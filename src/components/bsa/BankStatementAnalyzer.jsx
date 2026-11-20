import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  FileText,
  UploadCloud,
  CheckCircle,
  AlertCircle,
  Download,
  Eye,
  RefreshCw,
  Lock,
  Calendar,
  Building,
  User,
  ShieldCheck,
  TrendingUp,
  Percent,
} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const BankStatementAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState("");
  const [requiresPassword, setRequiresPassword] = useState(false);
  const [consent, setConsent] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [currentJobId, setCurrentJobId] = useState(null);
  const [jobData, setJobData] = useState(null);
  const [status, setStatus] = useState("idle"); // idle, processing, finalizing, success, error
  const [errorMessage, setErrorMessage] = useState("");
  const [analyses, setAnalyses] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  
  const pollTimerRef = useRef(null);

  // Fetch past analyses
  const fetchHistory = async () => {
    try {
      setLoadingHistory(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE_URL}/bsa/my-analyses?limit=10`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data && res.data.success) {
        setAnalyses(res.data.data || []);
      }
    } catch (err) {
      console.error("Failed to load BSA history", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchHistory();
    return () => {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    };
  }, []);

  // Poll analysis status
  useEffect(() => {
    if (!currentJobId || status === "success" || status === "error") {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
      return;
    }

    const poll = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE_URL}/bsa/${currentJobId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data && res.data.success) {
          const doc = res.data.data;
          setJobData(doc);
          if (doc.status === "Success") {
            setStatus("success");
            setUploading(false);
            fetchHistory();
          } else if (doc.status === "Failed") {
            setStatus("error");
            setErrorMessage(doc.failureReason || "Analysis failed. Please check the statement file.");
            setUploading(false);
          } else if (doc.status === "Finalizing") {
            setStatus("finalizing");
          } else {
            setStatus("processing");
          }
        }
      } catch (err) {
        console.error("Error polling status", err);
      }
    };

    pollTimerRef.current = setInterval(poll, 4000);
    poll(); // Initial call

    return () => {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    };
  }, [currentJobId, status]);

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (selected.type !== "application/pdf" && !selected.name.toLowerCase().endsWith(".pdf")) {
        setErrorMessage("Please select a valid PDF file.");
        return;
      }
      if (selected.size > 15 * 1024 * 1024) {
        setErrorMessage("File size exceeds 15 MB limit.");
        return;
      }
      setFile(selected);
      setErrorMessage("");
      setRequiresPassword(false);
      setPassword("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setErrorMessage("Please select a bank statement PDF.");
      return;
    }
    if (!consent) {
      setErrorMessage("Please give consent to proceed with statement analysis.");
      return;
    }

    try {
      setUploading(true);
      setErrorMessage("");
      setStatus("processing");

      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("file", file);
      if (password) {
        formData.append("password", password);
      }

      const res = await axios.post(`${API_BASE_URL}/bsa/analyze`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data && res.data.success) {
        setCurrentJobId(res.data.id);
        setStatus("processing");
      }
    } catch (err) {
      setUploading(false);
      setStatus("error");
      const resp = err.response?.data;
      if (resp?.requiresPassword) {
        setRequiresPassword(true);
        setErrorMessage(resp.message || "This statement is password-protected. Please enter password.");
      } else {
        setErrorMessage(resp?.message || "Failed to start analysis. Please try again.");
      }
    }
  };

  const handleDownloadReport = async (id, fileName, download = true) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE_URL}/bsa/${id}/report${download ? "?download=1" : ""}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      if (download) {
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName ? `Statement_Report_${fileName}` : `CreditDost_Report_${id}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        window.open(url, "_blank");
      }
      setTimeout(() => window.URL.revokeObjectURL(url), 10000);
    } catch (err) {
      console.error("Failed to fetch report PDF", err);
      alert("Could not load report PDF. Please try again.");
    }
  };

  return (
    <div style={{ maxWidth: "1100px", margin: "40px auto", padding: "0 20px", fontFamily: "sans-serif" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px", textAlign: "center" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#1e293b", margin: "0 0 8px 0" }}>
          Bank Statement Analyzer
        </h1>
        <p style={{ color: "#64748b", fontSize: "15px", margin: 0 }}>
          Extract, reconcile, and generate comprehensive Credit Intelligence Reports with automated underwriting KPIs.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "40px" }}>
        {/* Upload Form Card */}
        <div style={{ background: "#ffffff", padding: "28px", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#0f172a", marginBottom: "18px" }}>
            Upload Bank Statement
          </h2>

          <form onSubmit={handleSubmit}>
            {/* Drop Zone */}
            <label
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "32px 20px",
                border: "2px dashed #cbd5e1",
                borderRadius: "8px",
                cursor: "pointer",
                background: "#f8fafc",
                marginBottom: "20px",
                transition: "all 0.2s",
              }}
            >
              <UploadCloud style={{ width: "40px", height: "40px", color: "#3b82f6", marginBottom: "12px" }} />
              <span style={{ fontSize: "14px", fontWeight: "500", color: "#334155", marginBottom: "4px" }}>
                {file ? file.name : "Click to browse or drop your bank statement PDF"}
              </span>
              <span style={{ fontSize: "12px", color: "#94a3b8" }}>Max 15 MB • PDF files only</span>
              <input type="file" accept=".pdf,application/pdf" onChange={handleFileChange} style={{ display: "none" }} />
            </label>

            {/* Password input if protected */}
            {requiresPassword && (
              <div style={{ marginBottom: "18px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "500", color: "#475569", marginBottom: "6px" }}>
                  PDF Password
                </label>
                <div style={{ display: "flex", alignItems: "center", border: "1px solid #cbd5e1", borderRadius: "6px", padding: "8px 12px" }}>
                  <Lock style={{ width: "16px", height: "16px", color: "#94a3b8", marginRight: "8px" }} />
                  <input
                    type="password"
                    placeholder="Enter statement password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ border: "none", outline: "none", width: "100%", fontSize: "14px" }}
                  />
                </div>
              </div>
            )}

            {/* Customer Consent Checkbox */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: "22px" }}>
              <input
                type="checkbox"
                id="bsa-consent"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                style={{ marginTop: "3px", cursor: "pointer" }}
              />
              <label htmlFor="bsa-consent" style={{ fontSize: "13px", color: "#475569", cursor: "pointer", lineHeight: "1.4" }}>
                I confirm that I have obtained customer consent to analyze this bank statement for credit underwriting purposes.
              </label>
            </div>

            {/* Error Banner */}
            {errorMessage && (
              <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#fef2f2", color: "#b91c1c", padding: "10px 14px", borderRadius: "6px", fontSize: "13px", marginBottom: "18px", border: "1px solid #fecaca" }}>
                <AlertCircle style={{ width: "16px", height: "16px", flexShrink: 0 }} />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={uploading || !file || !consent}
              style={{
                width: "100%",
                padding: "12px",
                background: uploading || !file || !consent ? "#94a3b8" : "#2563eb",
                color: "#ffffff",
                border: "none",
                borderRadius: "6px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: uploading || !file || !consent ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              {uploading ? (
                <>
                  <RefreshCw style={{ width: "16px", height: "16px", animation: "spin 1s linear infinite" }} />
                  Processing Statement...
                </>
              ) : (
                "Analyse Statement"
              )}
            </button>
          </form>
        </div>

        {/* Live Processing or Result Card */}
        <div style={{ background: "#ffffff", padding: "28px", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#0f172a", marginBottom: "18px" }}>
            Analysis Status
          </h2>

          {status === "idle" && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, color: "#94a3b8", textAlign: "center" }}>
              <FileText style={{ width: "48px", height: "48px", strokeWidth: 1.5, marginBottom: "12px" }} />
              <p style={{ margin: 0, fontSize: "14px" }}>Upload a statement to begin credit intelligence analysis.</p>
            </div>
          )}

          {(status === "processing" || status === "finalizing") && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, textAlign: "center" }}>
              <RefreshCw style={{ width: "40px", height: "40px", color: "#2563eb", animation: "spin 1.5s linear infinite", marginBottom: "16px" }} />
              <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#1e293b", margin: "0 0 6px 0" }}>
                {status === "processing" ? "Extracting & Reconciling Rows…" : "Generating Credit Intelligence Report…"}
              </h3>
              <p style={{ fontSize: "13px", color: "#64748b", margin: 0, maxWidth: "320px" }}>
                Verifying opening/closing balances, calculating cash flow velocity, detecting loan liabilities, and building risk scorecard.
              </p>
            </div>
          )}

          {status === "success" && jobData && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#16a34a", marginBottom: "16px", fontWeight: "600", fontSize: "14px" }}>
                <CheckCircle style={{ width: "18px", height: "18px" }} />
                <span>Statement Successfully Reconciled</span>
              </div>

              <div style={{ background: "#f8fafc", padding: "14px", borderRadius: "8px", border: "1px solid #e2e8f0", marginBottom: "18px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", fontSize: "13px" }}>
                  <div>
                    <span style={{ color: "#64748b" }}>Bank: </span>
                    <strong style={{ color: "#1e293b" }}>{jobData.bankName || "Detected Bank"}</strong>
                  </div>
                  <div>
                    <span style={{ color: "#64748b" }}>Holder: </span>
                    <strong style={{ color: "#1e293b" }}>{jobData.accountHolderName || "N/A"}</strong>
                  </div>
                  <div>
                    <span style={{ color: "#64748b" }}>Account: </span>
                    <strong style={{ color: "#1e293b" }}>{jobData.accountNumberMasked || "N/A"}</strong>
                  </div>
                  <div>
                    <span style={{ color: "#64748b" }}>Reconciliation: </span>
                    <span style={{ color: "#16a34a", fontWeight: "600" }}>{jobData.reconciliationStatus || "VERIFIED"}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: "12px", marginTop: "auto" }}>
                <button
                  onClick={() => handleDownloadReport(jobData.id, jobData.fileName, false)}
                  style={{
                    flex: 1,
                    padding: "10px",
                    background: "#ffffff",
                    border: "1px solid #cbd5e1",
                    color: "#334155",
                    borderRadius: "6px",
                    fontWeight: "500",
                    fontSize: "13px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    cursor: "pointer",
                  }}
                >
                  <Eye style={{ width: "16px", height: "16px" }} />
                  View PDF
                </button>
                <button
                  onClick={() => handleDownloadReport(jobData.id, jobData.fileName, true)}
                  style={{
                    flex: 1,
                    padding: "10px",
                    background: "#2563eb",
                    border: "none",
                    color: "#ffffff",
                    borderRadius: "6px",
                    fontWeight: "500",
                    fontSize: "13px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    cursor: "pointer",
                  }}
                >
                  <Download style={{ width: "16px", height: "16px" }} />
                  Download PDF
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* History Table */}
      <div style={{ background: "#ffffff", padding: "24px", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h2 style={{ fontSize: "16px", fontWeight: "600", color: "#0f172a", margin: 0 }}>
            Recent Analyses
          </h2>
          <button
            onClick={fetchHistory}
            style={{ background: "none", border: "none", color: "#2563eb", cursor: "pointer", fontSize: "13px", display: "flex", alignItems: "center", gap: "4px" }}
          >
            <RefreshCw style={{ width: "14px", height: "14px" }} /> Refresh
          </button>
        </div>

        {loadingHistory ? (
          <div style={{ textAlign: "center", padding: "20px", color: "#64748b", fontSize: "13px" }}>Loading past statements...</div>
        ) : analyses.length === 0 ? (
          <div style={{ textAlign: "center", padding: "20px", color: "#94a3b8", fontSize: "13px" }}>No statement analyses found.</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #e2e8f0", textAlign: "left", color: "#64748b" }}>
                <th style={{ padding: "10px" }}>File Name</th>
                <th style={{ padding: "10px" }}>Bank</th>
                <th style={{ padding: "10px" }}>Account Holder</th>
                <th style={{ padding: "10px" }}>Date</th>
                <th style={{ padding: "10px" }}>Status</th>
                <th style={{ padding: "10px", textAlign: "right" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {analyses.map((item) => (
                <tr key={item.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "12px 10px", fontWeight: "500", color: "#1e293b" }}>{item.fileName || "Statement.pdf"}</td>
                  <td style={{ padding: "12px 10px", color: "#475569" }}>{item.bankName || "—"}</td>
                  <td style={{ padding: "12px 10px", color: "#475569" }}>{item.accountHolderName || "—"}</td>
                  <td style={{ padding: "12px 10px", color: "#64748b" }}>{new Date(item.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: "12px 10px" }}>
                    <span
                      style={{
                        padding: "3px 8px",
                        borderRadius: "12px",
                        fontSize: "11px",
                        fontWeight: "600",
                        background: item.status === "Success" ? "#dcfce7" : item.status === "Failed" ? "#fee2e2" : "#fef9c3",
                        color: item.status === "Success" ? "#15803d" : item.status === "Failed" ? "#b91c1c" : "#854d0e",
                      }}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td style={{ padding: "12px 10px", textAlign: "right" }}>
                    {item.status === "Success" && (
                      <button
                        onClick={() => handleDownloadReport(item.id, item.fileName, true)}
                        style={{
                          background: "#f1f5f9",
                          border: "1px solid #cbd5e1",
                          borderRadius: "4px",
                          padding: "4px 8px",
                          cursor: "pointer",
                          color: "#1e293b",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          fontSize: "12px",
                        }}
                      >
                        <Download style={{ width: "13px", height: "13px" }} /> Download
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default BankStatementAnalyzer;
