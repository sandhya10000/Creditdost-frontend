import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setServicesDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setServicesDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Dropdown items matching Obsidian Lumina theme
  const serviceDropdownItems = [
    {
      title: "Credit Score Repair",
      subtitle: "RETAIL & INDIVIDUAL",
      description: "Purge bureau errors, dispute 90+ DPD & late tags",
      path: "/credit-score-repair",
      icon: "build_circle",
      iconBg: "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30",
    },
    {
      title: "Corporate CMR & Commercial",
      subtitle: "COMPANIES",
      description: "Improve CMR rank, dispute commercial NPA flags",
      path: "/credit-score-repair",
      icon: "corporate_fare",
      iconBg: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
    },
    {
      title: "Credit Bureau Check",
      subtitle: "OFFICIAL SOFT PULL",
      description: "Instant score across CIBIL, Experian, Equifax & CRIF",
      path: "/credit-check",
      icon: "credit_card",
      iconBg: "bg-sky-500/15 text-sky-400 border border-sky-500/30",
    },
    {
      title: "EMI Calculator",
      subtitle: "FINANCIAL TOOL",
      description: "Loan amortization & monthly repayment schedule",
      path: "/emi-calculator",
      icon: "calculate",
      iconBg: "bg-amber-500/15 text-amber-400 border border-amber-500/30",
    },
  ];

  const isServicesActive =
    location.pathname === "/credit-score-repair" ||
    location.pathname === "/credit-check" ||
    location.pathname === "/emi-calculator";

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#080E1B]/95 backdrop-blur-xl border-b border-outline-variant/30 shadow-[0_4px_30px_rgba(0,0,0,0.6)]">
      {/* Main Nav Bar */}
      <div className="h-20 max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center shrink-0">
          <Link to="/" className="flex items-center group">
            <img
              src="/images/white-logo.png"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/images/cred.png";
              }}
              alt="Credit Dost Logo"
              className="h-10 sm:h-12 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </Link>
        </div>

        {/* Navigation Links: Home, Credit score repair (Dropdown), Franchise Partner, About Us */}
        <nav className="hidden md:flex items-center gap-1 font-title-md text-sm">
          {/* Home */}
          <Link
            to="/"
            className={`px-4 py-2 rounded-lg transition-all text-sm font-medium ${
              location.pathname === "/"
                ? "bg-surface-container-high text-primary-container border border-primary-container/30 shadow-[0_0_12px_rgba(0,210,255,0.15)]"
                : "text-on-surface-variant hover:text-white hover:bg-surface-container/50"
            }`}
          >
            Home
          </Link>

          {/* Credit Score Repair / Services Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setServicesDropdownOpen((prev) => !prev)}
              onMouseEnter={() => setServicesDropdownOpen(true)}
              className={`px-4 py-2 rounded-lg transition-all text-sm font-medium flex items-center gap-1.5 ${
                isServicesActive || servicesDropdownOpen
                  ? "bg-surface-container-high text-primary-container border border-primary-container/30 shadow-[0_0_12px_rgba(0,210,255,0.15)]"
                  : "text-on-surface-variant hover:text-white hover:bg-surface-container/50"
              }`}
            >
              <span>Credit Score Repair</span>
              <span
                className={`material-symbols-outlined text-base transition-transform duration-200 ${
                  servicesDropdownOpen ? "rotate-180" : ""
                }`}
              >
                keyboard_arrow_down
              </span>
            </button>

            {/* Obsidian Lumina Dropdown Card */}
            {servicesDropdownOpen && (
              <div
                onMouseLeave={() => setServicesDropdownOpen(false)}
                className="absolute top-full left-0 mt-3 w-84 sm:w-96 rounded-2xl bg-[#0a1426]/95 text-slate-100 shadow-[0_25px_60px_rgba(0,0,0,0.85),0_0_35px_rgba(0,210,255,0.18)] border border-cyan-500/35 p-2.5 z-50 backdrop-blur-2xl animate-in fade-in slide-in-from-top-2 duration-200"
              >
                <div className="flex flex-col gap-1.5">
                  {serviceDropdownItems.map((item, idx) => (
                    <Link
                      key={idx}
                      to={item.path}
                      onClick={() => setServicesDropdownOpen(false)}
                      className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-cyan-950/40 border border-transparent hover:border-cyan-500/25 transition-all group"
                    >
                      <div
                        className={`w-10 h-10 rounded-xl ${item.iconBg} flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-105`}
                      >
                        <span className="material-symbols-outlined text-xl">
                          {item.icon}
                        </span>
                      </div>
                      <div className="flex flex-col flex-grow">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">
                            {item.title}
                          </span>
                          {item.subtitle && (
                            <span className="text-[10px] font-mono text-cyan-400/80 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-500/20">
                              {item.subtitle}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-400 font-normal mt-0.5 leading-snug">
                          {item.description}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Franchise Partner */}
          <Link
            to="/franchise-opportunity"
            className={`px-4 py-2 rounded-lg transition-all text-sm font-medium ${
              location.pathname === "/franchise-opportunity"
                ? "bg-surface-container-high text-primary-container border border-primary-container/30 shadow-[0_0_12px_rgba(0,210,255,0.15)]"
                : "text-on-surface-variant hover:text-white hover:bg-surface-container/50"
            }`}
          >
            Franchise Partner
          </Link>

          {/* About Us */}
          <Link
            to="/about"
            className={`px-4 py-2 rounded-lg transition-all text-sm font-medium ${
              location.pathname === "/about"
                ? "bg-surface-container-high text-primary-container border border-primary-container/30 shadow-[0_0_12px_rgba(0,210,255,0.15)]"
                : "text-on-surface-variant hover:text-white hover:bg-surface-container/50"
            }`}
          >
            About Us
          </Link>
        </nav>

        {/* Action CTA Header */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          <Link
            to="/credit-check"
            className="px-4 py-2 rounded-lg border border-primary/40 text-primary font-title-md text-xs sm:text-sm hover:bg-primary-container/10 hover:border-primary-container transition-all flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">speed</span>
            <span>Check Credit Score</span>
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link
                to={user?.role === "admin" ? "/admin/dashboard" : "/franchise/dashboard"}
                className="px-4 py-2 rounded-lg bg-surface-container-high border border-outline-variant/60 text-white font-title-md text-xs sm:text-sm hover:border-primary-container/80 transition-all flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-base text-primary-container">
                  dashboard
                </span>
                <span>Dashboard</span>
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg bg-surface-container-low border border-outline-variant/40 text-on-surface-variant hover:text-error transition-all"
                title="Logout"
              >
                <span className="material-symbols-outlined text-lg">logout</span>
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary-container to-[#0070f3] text-surface-container-lowest font-title-md text-xs sm:text-sm font-bold neon-glow-cyan hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">login</span>
              <span>Login</span>
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2.5 rounded-xl bg-surface-container-high border border-outline-variant/50 text-white"
          aria-label="Toggle mobile menu"
        >
          <span className="material-symbols-outlined text-2xl">
            {mobileMenuOpen ? "close" : "menu"}
          </span>
        </button>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-outline-variant/30 bg-[#080E1B] px-6 py-6 flex flex-col gap-4">
          <nav className="flex flex-col gap-2">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium ${
                location.pathname === "/"
                  ? "bg-surface-container-high text-primary-container border border-primary-container/30"
                  : "text-on-surface-variant hover:text-white"
              }`}
            >
              Home
            </Link>

            {/* Mobile Dropdown Options */}
            <div className="flex flex-col gap-1 pl-2 border-l-2 border-primary-container/30 my-1">
              <span className="text-xs uppercase font-label-code text-primary-container tracking-wider px-2 py-1">
                Credit Score Repair &amp; Tools
              </span>
              {serviceDropdownItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-xs sm:text-sm text-on-surface-variant hover:text-white flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-base text-primary-container">
                    {item.icon}
                  </span>
                  <span>{item.title}</span>
                </Link>
              ))}
            </div>

            <Link
              to="/franchise-opportunity"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium ${
                location.pathname === "/franchise-opportunity"
                  ? "bg-surface-container-high text-primary-container border border-primary-container/30"
                  : "text-on-surface-variant hover:text-white"
              }`}
            >
              Franchise Partner
            </Link>

            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium ${
                location.pathname === "/about"
                  ? "bg-surface-container-high text-primary-container border border-primary-container/30"
                  : "text-on-surface-variant hover:text-white"
              }`}
            >
              About Us
            </Link>
          </nav>

          <div className="pt-4 border-t border-outline-variant/20 flex flex-col gap-3">
            <Link
              to="/credit-check"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 rounded-xl border border-primary/40 text-primary font-title-md text-sm text-center flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-base">speed</span>
              <span>Check Free Credit Score</span>
            </Link>
            {isAuthenticated ? (
              <div className="flex gap-2">
                <Link
                  to={user?.role === "admin" ? "/admin/dashboard" : "/franchise/dashboard"}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-surface-container-high text-white text-center text-sm font-semibold"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="px-4 py-3 rounded-xl bg-error/20 text-error text-center text-sm font-semibold"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-container to-[#0070f3] text-surface-container-lowest font-title-md text-sm font-bold text-center flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-base">login</span>
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
