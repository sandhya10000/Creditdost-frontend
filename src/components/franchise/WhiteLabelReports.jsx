import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Alert,
  CircularProgress,
  TextField,
} from "@mui/material";
import {
  Lock,
  CheckCircle,
  ArrowForward,
  ArrowUpward,
  Visibility,
  Download,
  Payment,
  Check,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { franchiseAPI } from "../../services/api";

const BLUE = "#2563eb";
const NAVY = "#111827";
const INK = "#0f172a";
const MUTED = "#64748b";
const GREEN = "#059669";

// Sample reports live in public/samples/branded and are served from the site root
const SAMPLES = [
  {
    name: "Northstar Finserv",
    theme: "Navy & Royal Blue",
    description:
      "Tailored for corporate loan syndicates, wealth advisors, and prime retail DSA offices.",
    file: "credit-report-northstar-finserv.html",
    header: "#0f172a",
    palette: ["#0f172a", "#2563eb", "#60a5fa"],
    initials: "NS",
    dot: "#60a5fa",
    avatar: "#2563eb",
  },
  {
    name: "GreenLeaf Loans",
    theme: "Teal & Green Theme",
    description:
      "Ideal for agri-fintech, green energy lending, MSME lenders, and mutual fund distributors.",
    file: "credit-report-greenleaf-loans.html",
    header: "#064e3b",
    palette: ["#064e3b", "#10b981", "#a7f3d0"],
    initials: "GL",
    dot: "#6ee7b7",
    avatar: "#10b981",
  },
  {
    name: "Apex Capital",
    theme: "Charcoal & Bronze",
    description:
      "Polished executive design for high-ticket mortgage consultants and Chartered Accountants.",
    file: "credit-report-apex-capital.html",
    header: "#1e293b",
    palette: ["#1e293b", "#ffffff", "#fbbf24"],
    initials: "AC",
    dot: "#fbbf24",
    avatar: "#f59e0b",
  },
];

const CUSTOMISATION = [
  { icon: "🖼️", title: "Company Logo & Wordmark", desc: "High-resolution PNG, SVG, or JPEG integration seamlessly scaled for crystal-clear vector PDF export.", color: "#dbeafe" },
  { icon: "🏷️", title: "Company Name & Tagline", desc: "Prominent custom headers on every page highlighting your registration number, DSA codes, and slogan.", color: "#d1fae5" },
  { icon: "🌐", title: "Social & Web Presence", desc: "LinkedIn, Instagram, official portal links, plus dynamic QR code generated for borrowers to connect in 1 scan.", color: "#f3e8ff" },
  { icon: "🎨", title: "Custom Brand Palette", desc: "Match your primary, secondary, and badge colors with your firm's brand book or official website theme.", color: "#e0e7ff" },
  { icon: "📞", title: "Direct Contact & Office Info", desc: "Clickable phone numbers, direct one-tap WhatsApp chat links, agency email, and registered office address.", color: "#fef3c7" },
  { icon: "📑", title: "Header & Executive Summary", desc: "Personalised advisory commentary, custom legal disclaimer, and certified loan officer sign-off stamp.", color: "#cffafe" },
];

const STEPS = [
  { n: 1, title: "Pay one-time fee", desc: "Pay ₹10,000 + 18% GST via Razorpay. Zero monthly fees or recurring charges.", color: BLUE },
  { n: 2, title: "Onboarding in 1–2 days", desc: "Our dedicated designer reaches out within 3 hours via WhatsApp or phone call.", color: BLUE },
  { n: 3, title: "Submit brand assets", desc: "Share your PNG logo, desired brand colors, contact links, and preferred disclaimer text.", color: BLUE },
  { n: 4, title: "Approve & go live", desc: "Includes 2 free revision rounds. Once approved, all future reports export automatically branded.", color: GREEN },
];

const PLAN_FEATURES = [
  "Lifetime custom brand template configuration",
  "Logo, palette, contact info & social links integration",
  "Up to 2 complimentary revision rounds with dedicated designer",
  "Instant automated generation for all future credit analyses",
];

const loadRazorpayScript = () => {
  if (window.Razorpay) return Promise.resolve(true);
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const money = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

const WhiteLabelReports = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");
  const [contact, setContact] = useState({ name: "", email: "", mobile: "" });

  const basePrice = status?.basePrice || 10000;
  const gstPercent = status?.gstPercent ?? 18;
  const gstAmount = Math.round((basePrice * gstPercent) / 100);
  const total = status?.price || basePrice + gstAmount;

  const fetchStatus = async () => {
    try {
      const res = await franchiseAPI.getWhiteLabelStatus();
      setStatus(res.data);
    } catch (err) {
      console.error("Failed to load White Label status:", err);
      setError("Could not load White Label Reports. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRazorpayScript();
    fetchStatus();
  }, []);

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContact((prev) => ({ ...prev, [name]: value }));
  };

  const scrollToPayment = () => {
    document.getElementById("wl-payment")?.scrollIntoView({ behavior: "smooth" });
  };

  const verifyPayment = async (response) => {
    try {
      await franchiseAPI.verifyWhiteLabelPayment({
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
      });
      await fetchStatus();
    } catch (err) {
      console.error("White label verify error:", err);
      setError(
        err.response?.data?.message ||
          "Payment verification failed. Please contact support.",
      );
    } finally {
      setPaying(false);
    }
  };

  const handlePayment = async () => {
    if (!contact.name.trim() || !contact.email.trim() || !contact.mobile.trim()) {
      setError("Please enter your name, email and mobile number.");
      return;
    }
    try {
      setPaying(true);
      setError("");

      const scriptReady = await loadRazorpayScript();
      if (!scriptReady || !window.Razorpay) {
        throw new Error("Payment gateway not loaded. Please try again.");
      }

      const res = await franchiseAPI.createWhiteLabelOrder({
        name: contact.name.trim(),
        email: contact.email.trim(),
        mobile: contact.mobile.trim(),
      });
      const { orderId, keyId, amount, currency, prefill } = res.data;

      const rzp = new window.Razorpay({
        key: keyId,
        amount,
        currency,
        name: "Credit Dost",
        description: "White Label Reports (incl. 18% GST)",
        order_id: orderId,
        prefill,
        theme: { color: BLUE },
        handler: (response) => verifyPayment(response),
        modal: {
          ondismiss: () => {
            setPaying(false);
            setError("Payment cancelled.");
          },
        },
      });
      rzp.on("payment.failed", (response) => {
        setPaying(false);
        setError(`Payment failed: ${response.error.description}`);
      });
      rzp.open();
    } catch (err) {
      console.error("White label payment error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to start payment. Please try again.",
      );
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  const paid = status?.request;
  const eligible = status?.eligible;

  // ── Paid: active view ──
  if (paid) {
    return (
      <Box sx={{ maxWidth: 900, mx: "auto", p: { xs: 1, sm: 2 } }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 2, sm: 4 }, flexDirection: { xs: "column", sm: "row" }, p: { xs: 3, sm: 4 }, borderRadius: 4, bgcolor: "#fff", boxShadow: "0 8px 30px rgba(15,23,42,0.08)", textAlign: { xs: "center", sm: "left" } }}>
          <Box sx={{ width: 110, height: 110, borderRadius: "50%", bgcolor: "#d1fae5", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Box sx={{ width: 64, height: 64, borderRadius: "50%", bgcolor: GREEN, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <CheckCircle sx={{ fontSize: 40, color: "#fff" }} />
            </Box>
          </Box>
          <Box>
            <Typography variant="h5" fontWeight={800} color={INK}>
              White Label Reports Active
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }} color={MUTED}>
              Request ID: <strong style={{ color: BLUE }}>{paid.requestId}</strong>
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }} color={MUTED}>
              Paid on {new Date(paid.updatedAt || paid.createdAt).toLocaleDateString("en-IN")} · {money(paid.amount || total)} incl. GST
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  }

  // ── Not eligible: upgrade gate ──
  if (!eligible) {
    return (
      <Box sx={{ maxWidth: 860, mx: "auto", p: { xs: 1, sm: 2 } }}>
        <Box
          sx={{
            position: "relative",
            overflow: "hidden",
            borderRadius: 5,
            p: { xs: 3, sm: 5 },
            background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
            color: "#fff",
            boxShadow: "0 20px 50px rgba(15,23,42,0.25)",
          }}
        >
          <Box sx={{ position: "absolute", top: -60, right: -60, width: 220, height: 220, borderRadius: "50%", bgcolor: "rgba(96,165,250,0.15)" }} />
          <Box sx={{ position: "absolute", bottom: -80, left: -40, width: 180, height: 180, borderRadius: "50%", bgcolor: "rgba(251,191,36,0.1)" }} />

          <Box sx={{ position: "relative", display: "flex", flexDirection: { xs: "column", md: "row" }, alignItems: { xs: "flex-start", md: "center" }, gap: 4 }}>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1, px: 1.8, py: 0.6, borderRadius: 10, bgcolor: "rgba(251,191,36,0.15)", color: "#fbbf24", fontWeight: 700, fontSize: 13 }}>
                ⭐ Platinum &amp; Diamond feature
              </Box>
              <Typography sx={{ mt: 2, fontSize: { xs: "1.8rem", md: "2.2rem" }, fontWeight: 800, lineHeight: 1.15 }}>
                Unlock White Label Reports
              </Typography>
              <Typography sx={{ mt: 1.5, color: "#cbd5e1", lineHeight: 1.6, maxWidth: 480 }}>
                Brand every credit report with your logo, colours and contact details. This service is available on Platinum and Diamond packages.
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.2, mt: 2.5 }}>
                {["Your logo on every report", "Custom brand palette", "2 free revisions"].map((t) => (
                  <Box key={t} sx={{ px: 1.8, py: 0.7, borderRadius: 10, bgcolor: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", fontSize: 13.5, fontWeight: 600 }}>
                    ✓ {t}
                  </Box>
                ))}
              </Box>
              <Button
                variant="contained"
                endIcon={<ArrowForward />}
                onClick={() => navigate("/franchise/upgrade-package")}
                sx={{ mt: 3.5, px: 4, py: 1.4, borderRadius: 10, fontWeight: 700, textTransform: "none", fontSize: "1rem", bgcolor: BLUE, boxShadow: "0 10px 24px rgba(37,99,235,0.4)", "&:hover": { bgcolor: "#1d4ed8" } }}
              >
                Go Premium &amp; Brand Your Reports
              </Button>
            </Box>

            <Box sx={{ width: { xs: "100%", md: 230 }, flexShrink: 0, p: 3, borderRadius: 4, bgcolor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", textAlign: "center" }}>
              <Box sx={{ width: 72, height: 72, mx: "auto", borderRadius: "50%", bgcolor: "rgba(148,163,184,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Lock sx={{ fontSize: 36, color: "#e2e8f0" }} />
              </Box>
              <Typography sx={{ mt: 2, fontWeight: 800 }}>Locked</Typography>
              <Typography sx={{ mt: 0.5, fontSize: 13, color: "#94a3b8" }}>Requires Platinum or Diamond</Typography>
              <Box sx={{ mt: 2.5, pt: 2, borderTop: "1px solid rgba(255,255,255,0.12)" }}>
                <Typography sx={{ fontSize: 12, color: "#94a3b8" }}>One-time setup</Typography>
                <Typography sx={{ fontWeight: 800, fontSize: 22, color: "#fbbf24" }}>{money(status?.basePrice || 10000)} + GST</Typography>
                <Typography sx={{ fontSize: 11, color: "#94a3b8" }}>{status?.gstPercent ?? 18}% GST applies</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }

  // ── Eligible, not paid: marketing + payment ──
  return (
    <Box sx={{ bgcolor: "#f8fafc", mx: { xs: -1, sm: -2 }, mt: { xs: -2, sm: -3 }, px: { xs: 1.5, sm: 3 }, pb: 6, borderRadius: 2 }}>
      {error && (
        <Alert severity="error" sx={{ mt: 2, mb: 2, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {/* Offer bar */}
      <Box sx={{ mt: 2, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2, px: { xs: 2, sm: 3 }, py: 2, borderRadius: 3, bgcolor: NAVY, color: "#fff" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
          <Box sx={{ px: 1.5, py: 0.4, borderRadius: 10, border: "1px solid #334155", fontSize: 12, fontWeight: 700, color: "#93c5fd" }}>
            ● OFFER
          </Box>
          <Typography fontWeight={700}>
            AI Custom Branded Report • {money(basePrice)} + {gstPercent}% GST
          </Typography>
          <Typography sx={{ color: "#fbbf24", fontSize: 14 }}>Setup delivered in 1–2 working days</Typography>
        </Box>
        <Button
          variant="contained"
          onClick={scrollToPayment}
          endIcon={<ArrowForward />}
          sx={{ borderRadius: 10, px: 2.5, textTransform: "none", fontWeight: 700, bgcolor: BLUE }}
        >
          Pay &amp; Activate
        </Button>
      </Box>

      {/* Hero */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1.1fr 0.9fr" }, gap: 4, alignItems: "center", mt: 4 }}>
        <Box>
          <Box sx={{ display: "inline-flex", px: 2, py: 0.8, borderRadius: 10, border: "1px solid #bfdbfe", bgcolor: "#eff6ff", color: BLUE, fontWeight: 700, fontSize: 14 }}>
            ⚡ Turn Credit Reports Into Your Top Lead Magnet
          </Box>
          <Typography sx={{ mt: 2, fontSize: { xs: "2.4rem", md: "3.6rem" }, fontWeight: 800, lineHeight: 1.05, color: INK, letterSpacing: -1 }}>
            Your brand on
          </Typography>
          <Typography sx={{ fontSize: { xs: "2.4rem", md: "3.6rem" }, fontWeight: 800, lineHeight: 1.05, color: BLUE, letterSpacing: -1 }}>
            every credit report.
          </Typography>
          <Typography sx={{ mt: 2.5, color: "#475569", fontSize: "1.05rem", lineHeight: 1.6, maxWidth: 560 }}>
            Turn AI-analysed credit reports into your own high-trust marketing asset. Your logo, corporate colours, verified watermark, and contact details on every report shared with borrowers.
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.2, mt: 3 }}>
            {[
              `One-time fee ${money(basePrice)} + GST`,
              "2 free revisions included",
              "Setup in 1–2 working days",
              "Applied to all future reports",
            ].map((chip) => (
              <Box key={chip} sx={{ px: 2, py: 0.9, borderRadius: 10, bgcolor: "#fff", border: "1px solid #e2e8f0", fontWeight: 600, fontSize: 14, color: INK }}>
                {chip}
              </Box>
            ))}
          </Box>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 4 }}>
            <Button
              variant="contained"
              onClick={scrollToPayment}
              sx={{ borderRadius: 10, px: 4, py: 1.5, fontSize: "1.05rem", fontWeight: 700, textTransform: "none", bgcolor: BLUE, boxShadow: "0 10px 24px rgba(37,99,235,0.3)" }}
            >
              Get my branded AI report {money(total)}
            </Button>
            <Button
              variant="outlined"
              endIcon={<ArrowForward sx={{ transform: "rotate(90deg)" }} />}
              onClick={() => document.getElementById("wl-samples")?.scrollIntoView({ behavior: "smooth" })}
              sx={{ borderRadius: 10, px: 4, py: 1.5, fontSize: "1.05rem", fontWeight: 600, textTransform: "none", color: INK, borderColor: "#cbd5e1", bgcolor: "#fff" }}
            >
              See live samples
            </Button>
          </Box>
        </Box>

        {/* Preview card */}
        <Box sx={{ position: "relative", justifySelf: { xs: "center", md: "end" }, width: "100%", maxWidth: 380 }}>
          <Box sx={{ position: "absolute", top: -14, right: -10, zIndex: 2, px: 2, py: 0.8, borderRadius: 10, bgcolor: BLUE, color: "#fff", fontWeight: 700, fontSize: 14, boxShadow: "0 6px 16px rgba(37,99,235,0.35)" }}>
            ✨ Your Logo Here
          </Box>
          <Box sx={{ borderRadius: 4, bgcolor: "#fff", boxShadow: "0 24px 60px rgba(15,23,42,0.15)", overflow: "hidden", border: "1px solid #e2e8f0" }}>
            <Box sx={{ bgcolor: "#0f172a", color: "#fff", px: 2.5, py: 2, display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box sx={{ width: 40, height: 40, borderRadius: "50%", bgcolor: BLUE, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14 }}>NC</Box>
              <Box>
                <Typography fontWeight={800} fontSize={15}>NORTHSTAR FINSERV</Typography>
                <Typography fontSize={11} sx={{ color: "#93c5fd" }}>DSA Partner ID: DL-88210</Typography>
              </Box>
            </Box>
            <Box sx={{ p: 2.5 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: MUTED }}>
                <span>Applicant: Rohan Verma</span>
                <span style={{ fontFamily: "monospace" }}>2024-03-24</span>
              </Box>
              <Box sx={{ mt: 2, p: 2, borderRadius: 3, bgcolor: "#f8fafc", border: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                  <Typography fontSize={11} fontWeight={700} color={MUTED}>CIBIL SCORE</Typography>
                  <Typography fontSize={30} fontWeight={800} color={GREEN} lineHeight={1}>
                    742 <span style={{ fontSize: 14, color: MUTED }}>/ 900</span>
                  </Typography>
                  <Box sx={{ display: "inline-block", mt: 1, px: 1, py: 0.2, borderRadius: 1, bgcolor: "#d1fae5", color: "#065f46", fontSize: 11, fontWeight: 700 }}>EXCELLENT</Box>
                </Box>
                <Box sx={{ width: 64, height: 64, borderRadius: "50%", border: `6px solid ${GREEN}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>
                  Top 12%
                </Box>
              </Box>
              <Box sx={{ mt: 2, fontSize: 13, color: INK, display: "flex", justifyContent: "space-between" }}>
                <span>Active Loans: 3</span><span>₹14,50,000</span>
              </Box>
              <Box sx={{ mt: 1, fontSize: 13, color: INK, display: "flex", justifyContent: "space-between" }}>
                <span>On-time Payment Rate:</span><strong style={{ color: GREEN }}>100%</strong>
              </Box>
              <Box sx={{ mt: 2, p: 1.5, borderRadius: 3, bgcolor: "#ecfdf5", border: "1px solid #a7f3d0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography fontSize={13} fontWeight={700} color={INK}>Direct WhatsApp Callout</Typography>
                <Box sx={{ px: 1.5, py: 0.4, borderRadius: 10, bgcolor: GREEN, color: "#fff", fontSize: 12, fontWeight: 700 }}>Apply Now</Box>
              </Box>
            </Box>
          </Box>
          <Box sx={{ position: "absolute", left: -30, bottom: -28, display: "flex", alignItems: "center", gap: 1.5, px: 2, py: 1.5, borderRadius: 4, bgcolor: "#fff", boxShadow: "0 12px 30px rgba(15,23,42,0.15)" }}>
            <Box sx={{ width: 40, height: 40, borderRadius: "50%", bgcolor: "#d1fae5", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Check sx={{ color: GREEN }} />
            </Box>
            <Box>
              <Typography fontWeight={800} fontSize={15} color={INK}>4.2x Client Inquiries</Typography>
              <Typography fontSize={12} color={MUTED}>With agent branded exports</Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Customisation */}
      <Box sx={{ mt: 10 }}>
        <Typography sx={{ color: BLUE, fontWeight: 700, fontSize: 13, letterSpacing: 1 }}>CUSTOMISATION BREAKDOWN</Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: 2, mt: 1 }}>
          <Typography sx={{ fontSize: { xs: "2rem", md: "2.6rem" }, fontWeight: 800, color: INK, letterSpacing: -0.5 }}>
            What you can personalise
          </Typography>
          <Typography color={MUTED}>Tailored by our dedicated design team</Typography>
        </Box>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" }, gap: 3, mt: 4 }}>
          {CUSTOMISATION.map((c) => (
            <Box key={c.title} sx={{ p: 3.5, borderRadius: 5, bgcolor: "#fff", border: "1px solid #e2e8f0", boxShadow: "0 4px 14px rgba(15,23,42,0.04)" }}>
              <Box sx={{ width: 48, height: 48, borderRadius: "50%", bgcolor: c.color, mb: 2, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
                {c.icon}
              </Box>
              <Typography fontWeight={800} color={INK} sx={{ fontSize: "1.05rem" }}>{c.title}</Typography>
              <Typography sx={{ mt: 1, color: "#475569", lineHeight: 1.6, fontSize: 15 }}>{c.desc}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Samples */}
      <Box id="wl-samples" sx={{ mt: 10, textAlign: "center" }}>
        <Typography sx={{ color: BLUE, fontWeight: 700, fontSize: 13, letterSpacing: 1 }}>PORTFOLIO</Typography>
        <Typography sx={{ fontSize: { xs: "2rem", md: "2.6rem" }, fontWeight: 800, color: INK, letterSpacing: -0.5, mt: 1 }}>
          Sample Branded Report Themes
        </Typography>
        <Typography color={MUTED} sx={{ maxWidth: 640, mx: "auto", mt: 1 }}>
          See how your reports can look. These samples use fictional financial firms. Yours will carry your own logo, palette, and contact links.
        </Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" }, gap: 3, mt: 4, textAlign: "left" }}>
          {SAMPLES.map((s) => (
            <Box key={s.name} sx={{ borderRadius: 4, overflow: "hidden", bgcolor: "#fff", border: "1px solid #e2e8f0", boxShadow: "0 8px 24px rgba(15,23,42,0.06)" }}>
              <Box sx={{ bgcolor: s.header, color: "#fff", px: 2.5, py: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                  <Box sx={{ width: 34, height: 34, borderRadius: "50%", bgcolor: s.avatar, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800 }}>{s.initials}</Box>
                  <Typography fontWeight={700}>{s.name}</Typography>
                </Box>
                <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: s.dot }} />
              </Box>
              <Box sx={{ p: 2.5 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: MUTED, fontSize: 14 }}>
                  <span>Theme</span>
                  <strong style={{ color: INK }}>{s.theme}</strong>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1.5, color: MUTED, fontSize: 14 }}>
                  <span>Palette:</span>
                  {s.palette.map((c) => (
                    <Box key={c} sx={{ width: 18, height: 18, borderRadius: "50%", bgcolor: c, border: "1px solid #cbd5e1" }} />
                  ))}
                </Box>
                <Typography sx={{ mt: 2, color: "#475569", lineHeight: 1.6, fontSize: 15, minHeight: 72 }}>{s.description}</Typography>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<Visibility />}
                  href={`/samples/branded/${s.file}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ mt: 2, borderRadius: 10, py: 1.2, textTransform: "none", fontWeight: 700, bgcolor: BLUE }}
                >
                  View sample
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Download />}
                  href={`/samples/branded/${s.file}`}
                  download
                  sx={{ mt: 1.2, borderRadius: 10, py: 1.1, textTransform: "none", fontWeight: 600, color: INK, borderColor: "#cbd5e1" }}
                >
                  Download sample report
                </Button>
              </Box>
            </Box>
          ))}
        </Box>
        <Typography sx={{ mt: 3, fontStyle: "italic", fontSize: 13, color: "#94a3b8" }}>
          *Fictional examples created for demonstration. Your reports will feature your unique branding, phone numbers, and color schemes.
        </Typography>
      </Box>

      {/* How it works */}
      <Box sx={{ mt: 10, p: { xs: 3, md: 5 }, borderRadius: 5, bgcolor: "#fff", border: "1px solid #e2e8f0", textAlign: "center" }}>
        <Typography sx={{ color: BLUE, fontWeight: 700, fontSize: 13, letterSpacing: 1 }}>FAST &amp; SIMPLE</Typography>
        <Typography sx={{ fontSize: { xs: "2rem", md: "2.4rem" }, fontWeight: 800, color: INK, mt: 1 }}>How It Works</Typography>
        <Typography color={MUTED}>From order to your first branded export in 4 simple milestones.</Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr 1fr" }, gap: 2.5, mt: 4, textAlign: "left" }}>
          {STEPS.map((s) => (
            <Box key={s.n} sx={{ p: 3, borderRadius: 4, bgcolor: "#f8fafc", border: s.n === 4 ? "1px solid #bfdbfe" : "1px solid #e2e8f0" }}>
              <Box sx={{ width: 40, height: 40, borderRadius: "50%", bgcolor: s.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }}>
                {s.n}
              </Box>
              <Typography fontWeight={800} color={INK} sx={{ mt: 2 }}>{s.title}</Typography>
              <Typography sx={{ mt: 1, color: "#475569", fontSize: 14.5, lineHeight: 1.6 }}>{s.desc}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Pricing + payment */}
      <Box id="wl-payment" sx={{ mt: 10 }}>
        <Box sx={{ borderRadius: 5, bgcolor: "#0f172a", color: "#fff", p: { xs: 3, md: 5 }, display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 4 }}>
          <Box>
            <Box sx={{ display: "inline-block", px: 1.8, py: 0.6, borderRadius: 10, bgcolor: "#fbbf24", color: "#111827", fontWeight: 700, fontSize: 13 }}>
              ⭐ Most Popular Upgrade • Pay Once, Brand Forever
            </Box>
            <Box sx={{ display: "flex", alignItems: "baseline", gap: 1.5, mt: 2.5, flexWrap: "wrap" }}>
              <Typography sx={{ fontSize: { xs: "2.8rem", md: "3.6rem" }, fontWeight: 800, lineHeight: 1 }}>{money(total)}</Typography>
              <Typography sx={{ color: "#cbd5e1" }}>one-time setup fee</Typography>
              <Box sx={{ px: 1.2, py: 0.3, borderRadius: 10, bgcolor: BLUE, fontSize: 12, fontWeight: 700 }}>One-time</Box>
            </Box>
            <Typography sx={{ mt: 1.5, color: "#cbd5e1", lineHeight: 1.6 }}>
              {money(basePrice)} branding setup + {gstPercent}% GST ({money(gstAmount)}). Includes template creation, custom assets setup, and automated pipeline integration.
            </Typography>
          </Box>
          <Box>
            {PLAN_FEATURES.map((f) => (
              <Box key={f} sx={{ display: "flex", gap: 1.2, alignItems: "flex-start", mb: 1.5 }}>
                <Check sx={{ color: "#34d399", mt: "2px" }} />
                <Typography sx={{ lineHeight: 1.5 }}>{f}</Typography>
              </Box>
            ))}
          </Box>
          <Box sx={{ gridColumn: { xs: "1", md: "1 / -1" }, p: 2, borderRadius: 3, bgcolor: "rgba(148,163,184,0.12)", fontSize: 14, color: "#e2e8f0" }}>
            ℹ️ <strong>Note:</strong> AI analysis reports are charged separately at the current platform rate.
          </Box>
        </Box>

        {/* Checkout */}
        <Box sx={{ mt: 4, p: { xs: 3, md: 4 }, borderRadius: 5, bgcolor: "#fff", border: "1px solid #e2e8f0", boxShadow: "0 8px 30px rgba(15,23,42,0.06)" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 2 }}>
            <Box>
              <Typography sx={{ fontSize: { xs: "1.8rem", md: "2.2rem" }, fontWeight: 800, color: INK }}>Complete payment</Typography>
              <Typography color={MUTED}>Enter your contact details, then pay with Razorpay. Our team will reach out to configure your branding.</Typography>
            </Box>
            <Box sx={{ textAlign: "right" }}>
              <Typography sx={{ fontSize: "2rem", fontWeight: 800, color: BLUE }}>{money(total)}</Typography>
              <Typography fontSize={13} color={MUTED}>Inclusive of GST</Typography>
            </Box>
          </Box>

          <Box sx={{ mt: 3, p: 2.5, borderRadius: 3, bgcolor: "#f8fafc", border: "1px solid #e2e8f0" }}>
            <Typography fontSize={12} fontWeight={700} color="#94a3b8" letterSpacing={0.6}>CONTACT DETAILS</Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" }, gap: 2, mt: 1.5 }}>
              <TextField label="Full Name" name="name" value={contact.name} onChange={handleContactChange} required fullWidth />
              <TextField label="Email" name="email" type="email" value={contact.email} onChange={handleContactChange} required fullWidth />
              <TextField label="Mobile Number" name="mobile" value={contact.mobile} onChange={handleContactChange} inputProps={{ maxLength: 15 }} required fullWidth />
            </Box>
          </Box>

          <Box sx={{ mt: 3, p: 2.5, borderRadius: 3, border: `2px solid ${BLUE}`, bgcolor: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Payment sx={{ color: BLUE }} />
              <Box>
                <Typography fontWeight={700} color={INK}>Razorpay / Instant Pay</Typography>
                <Typography fontSize={13} color={MUTED}>UPI (GPay, PhonePe, Paytm), Cards, Net banking &amp; Wallets</Typography>
              </Box>
            </Box>
            <Box sx={{ textAlign: "right" }}>
              <Typography fontWeight={800} color={INK}>{money(total)}</Typography>
              <Typography fontSize={12} color={MUTED}>{money(basePrice)} + {money(gstAmount)} GST</Typography>
            </Box>
          </Box>

          <Button
            fullWidth
            variant="contained"
            size="large"
            disabled={paying}
            onClick={handlePayment}
            sx={{ mt: 3, py: 1.8, borderRadius: 10, fontSize: "1.05rem", fontWeight: 700, textTransform: "none", bgcolor: BLUE, boxShadow: "0 10px 24px rgba(37,99,235,0.3)" }}
          >
            {paying ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1, color: "inherit" }} />
                Processing...
              </>
            ) : (
              `Pay ${money(total)} with Razorpay`
            )}
          </Button>
          <Typography sx={{ mt: 2, textAlign: "center", fontSize: 12.5, color: "#94a3b8" }}>
            🔒 256-bit encrypted checkout. Tax invoice with GST input credit available on receipt.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default WhiteLabelReports;
