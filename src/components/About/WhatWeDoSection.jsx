import React, { useState, useEffect } from "react";

const WhatWeDoSection = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const services = [
    {
      icon: "🔍",
      title: "Credit Report Analysis",
      description:
        "Identifying errors, inconsistencies, and improvement opportunities in your credit report to help strengthen your credit profile",
    },
    {
      icon: "⚡",
      title: "Dispute & Correction Support",
      description:
        "Coordinating with banks and credit bureaus to dispute incorrect data and ensure accurate updates to your credit information.",
    },
    {
      icon: "🔄",
      title: "Settlement-to-Closed Status Correction",
      description:
        "Ensuring accurate reflection of paid or settled loans as 'closed' in your credit history.",
    },
    {
      icon: "📈",
      title: "Score Improvement Programs",
      description:
        "Step-by-step credit score improvement guidance through our Credit Boost Pro and Credit Boost Premier programs.",
    },
    {
      icon: "💬",
      title: "Personalized Consultation",
      description:
        "One-to-one credit consultation with actionable advice, personalized strategies, and continuous progress tracking.",
    },
  ];

  return (
    <div
      style={{
        padding: isMobile ? "40px 16px" : "80px 20px",
        backgroundColor: "#ffffff",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Elements - Hide on mobile */}
      {!isMobile && (
        <>
          <div
            style={{
              position: "absolute",
              top: "5%",
              right: "10%",
              width: "200px",
              height: "200px",
              background:
                "radial-gradient(circle, rgba(8, 145, 178, 0.05) 0%, transparent 70%)",
              borderRadius: "50%",
            }}
          />

          <div
            style={{
              position: "absolute",
              bottom: "10%",
              left: "5%",
              width: "300px",
              height: "300px",
              background:
                "radial-gradient(circle, rgba(6, 182, 212, 0.04) 0%, transparent 70%)",
              borderRadius: "50%",
            }}
          />
        </>
      )}

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Header */}
        <div
          style={{
            textAlign: "center",
            marginBottom: isMobile ? "40px" : "60px",
          }}
        >
          <div
            style={{
              color: "#0891b2",
              fontSize: isMobile ? "0.8rem" : "0.9rem",
              fontWeight: "600",
              letterSpacing: "2px",
              marginBottom: isMobile ? "8px" : "12px",
            }}
          >
            WHAT WE DO
          </div>

          <h2
            style={{
              fontSize: isMobile ? "1.75rem" : "clamp(2rem, 4vw, 2.75rem)",
              fontWeight: "700",
              color: "#0f172a",
              marginBottom: isMobile ? "12px" : "16px",
              lineHeight: 1.2,
              padding: isMobile ? "0 10px" : "0",
            }}
          >
            Comprehensive Credit Solutions
          </h2>

          <p
            style={{
              color: "#64748b",
              fontSize: isMobile ? "1rem" : "1.1rem",
              maxWidth: "600px",
              margin: "0 auto",
              lineHeight: 1.6,
              padding: isMobile ? "0 16px" : "0",
            }}
          >
            Specialized credit services designed to repair, rebuild, and manage
            your credit score and overall credit health effectively.
          </p>
        </div>

        {/* Services Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile
              ? "1fr"
              : "repeat(auto-fit, minmax(300px, 1fr))",
            gap: isMobile ? "20px" : "30px",
            padding: isMobile ? "0 8px" : "0",
          }}
        >
          {services.map((service, index) => (
            <div
              key={index}
              style={{
                backgroundColor: "#f8f9fa",
                padding: isMobile ? "30px 20px" : "40px 30px",
                borderRadius: "16px",
                textAlign: "center",
                transition: "all 0.3s ease",
                border: "1px solid #e2e8f0",
                position: "relative",
                overflow: "hidden",
                ...(isMobile && {
                  minHeight: "250px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }),
              }}
              onMouseOver={(e) => {
                if (!isMobile) {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.boxShadow =
                    "0 20px 40px rgba(0, 0, 0, 0.1)";
                  e.currentTarget.style.backgroundColor = "#ffffff";

                  // Animate the bottom line
                  const line = e.currentTarget.querySelector(".hover-line");
                  if (line) {
                    line.style.width = "80%";
                  }
                }
              }}
              onMouseOut={(e) => {
                if (!isMobile) {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.backgroundColor = "#f8f9fa";

                  // Reset the bottom line
                  const line = e.currentTarget.querySelector(".hover-line");
                  if (line) {
                    line.style.width = "0";
                  }
                }
              }}
              onClick={(e) => {
                if (isMobile) {
                  // Toggle mobile active state
                  const isActive =
                    e.currentTarget.style.backgroundColor ===
                    "rgb(255, 255, 255)";
                  e.currentTarget.style.backgroundColor = isActive
                    ? "#f8f9fa"
                    : "#ffffff";
                  e.currentTarget.style.boxShadow = isActive
                    ? "none"
                    : "0 10px 20px rgba(0, 0, 0, 0.08)";

                  const line = e.currentTarget.querySelector(".hover-line");
                  if (line) {
                    line.style.width = isActive ? "0" : "60%";
                  }
                }
              }}
            >
              {/* Icon */}
              <div
                style={{
                  fontSize: isMobile ? "2.5rem" : "3rem",
                  marginBottom: isMobile ? "16px" : "20px",
                }}
              >
                {service.icon}
              </div>

              {/* Title */}
              <h3
                style={{
                  fontSize: isMobile ? "1.125rem" : "1.25rem",
                  fontWeight: "600",
                  color: "#0f172a",
                  marginBottom: isMobile ? "12px" : "16px",
                  padding: isMobile ? "0 10px" : "0",
                }}
              >
                {service.title}
              </h3>

              {/* Description */}
              <p
                style={{
                  color: "#64748b",
                  fontSize: isMobile ? "0.9rem" : "0.95rem",
                  lineHeight: 1.6,
                  margin: 0,
                  padding: isMobile ? "0 8px" : "0",
                }}
              >
                {service.description}
              </p>

              {/* Hover Effect Line */}
              <div
                className="hover-line"
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "0",
                  height: isMobile ? "2px" : "3px",
                  backgroundColor: "#0891b2",
                  transition: "width 0.3s ease",
                  ...(isMobile && {
                    width: "0", // Start with 0 width on mobile
                  }),
                }}
              />
            </div>
          ))}
        </div>

        {/* Bottom CTA - Optional, commented out */}
        {/* {!isMobile && (
          <div style={{
            textAlign: 'center',
            marginTop: '60px',
            padding: '40px',
            backgroundColor: '#f8f9fa',
            borderRadius: '16px',
          }}>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#0f172a',
              marginBottom: '16px',
            }}>
              Ready to Transform Your Credit?
            </h3>
            <p style={{
              color: '#64748b',
              fontSize: '1rem',
              marginBottom: '24px',
              maxWidth: '500px',
              margin: '0 auto 24px',
            }}>
              Start your credit improvement journey today with expert guidance
            </p>
            <button style={{
              backgroundColor: '#0891b2',
              color: 'white',
              padding: '14px 32px',
              borderRadius: '50px',
              border: 'none',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#0e7490';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#0891b2';
              e.currentTarget.style.transform = 'translateY(0)';
            }}>
              Get Started Today
            </button>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default WhatWeDoSection;
