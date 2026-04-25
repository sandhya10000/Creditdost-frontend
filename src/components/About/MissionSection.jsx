import React, { useState, useEffect } from "react";

const MissionSection = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const values = [
    {
      icon: "🔍",
      title: "Transparency",
      description:
        "Every process, explained clearly to every client. No hidden terms, no surprises.",
    },
    {
      icon: "⚖️",
      title: "Integrity",
      description:
        "No shortcuts, no false promises — only genuine guidance and ethical practices.",
    },
    {
      icon: "❤️",
      title: "Empathy",
      description:
        "We understand financial struggles and treat every case with care and compassion.",
    },
    {
      icon: "🚀",
      title: "Innovation",
      description:
        "Leveraging data-driven tools and technology to make credit correction smarter, faster, and more efficient.",
    },
    {
      icon: "🎯",
      title: "Results",
      description:
        "Because trust is built on visible improvement and delivered outcomes.",
    },
  ];

  return (
    <div
      style={{
        backgroundColor: "#f8f9fa",
        padding: isMobile ? "40px 0" : "80px 0",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: isMobile ? "0 16px" : "0 24px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "40% 60%",
            gap: isMobile ? "40px" : "48px",
          }}
        >
          {/* Left Side - Mission & Vision */}
          <div>
            <div
              style={{
                color: "#0891b2",
                fontSize: isMobile ? "12px" : "14px",
                fontWeight: 600,
                letterSpacing: isMobile ? "2px" : "3px",
                textTransform: "uppercase",
                marginBottom: isMobile ? "12px" : "16px",
                textAlign: isMobile ? "center" : "left",
              }}
            >
              OUR MISSION & VISION
            </div>

            <h2
              style={{
                color: "#1e293b",
                fontSize: isMobile ? "1.75rem" : "42px",
                fontWeight: 700,
                lineHeight: 1.2,
                marginBottom: isMobile ? "32px" : "48px",
                marginTop: 0,
                textAlign: isMobile ? "center" : "left",
              }}
            >
              Building Financial Confidence
            </h2>

            {/* Mission */}
            <div
              style={{
                marginBottom: isMobile ? "24px" : "40px",
                padding: isMobile ? "20px" : "30px",
                backgroundColor: "white",
                borderRadius: "12px",
                boxShadow: "0 5px 20px rgba(0, 0, 0, 0.08)",
              }}
            >
              <h3
                style={{
                  color: "#0891b2",
                  fontSize: isMobile ? "1.125rem" : "1.25rem",
                  fontWeight: 600,
                  marginBottom: isMobile ? "8px" : "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  justifyContent: isMobile ? "center" : "flex-start",
                }}
              >
                <span>🎯</span> Our Mission
              </h3>
              <p
                style={{
                  color: "#475569",
                  fontSize: isMobile ? "0.95rem" : "1rem",
                  lineHeight: 1.7,
                  margin: 0,
                  textAlign: isMobile ? "justify" : "left",
                }}
              >
                To help individuals build financial credibility and access fair
                lending opportunities by making credit score improvement simple,
                transparent, compliant, and result-oriented.
              </p>
            </div>

            {/* Vision */}
            <div
              style={{
                padding: isMobile ? "20px" : "30px",
                backgroundColor: "white",
                borderRadius: "12px",
                boxShadow: "0 5px 20px rgba(0, 0, 0, 0.08)",
              }}
            >
              <h3
                style={{
                  color: "#0891b2",
                  fontSize: isMobile ? "1.125rem" : "1.25rem",
                  fontWeight: 600,
                  marginBottom: isMobile ? "8px" : "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  justifyContent: isMobile ? "center" : "flex-start",
                }}
              >
                <span>🌟</span> Our Vision
              </h3>
              <p
                style={{
                  color: "#475569",
                  fontSize: isMobile ? "0.95rem" : "1rem",
                  lineHeight: 1.7,
                  margin: 0,
                  textAlign: isMobile ? "justify" : "left",
                }}
              >
                To become one of India's most trusted names in credit score
                improvement, empowering individuals with knowledge, ethical
                solutions, and long-term financial confidence.
              </p>
            </div>
          </div>

          {/* Right Side - Values */}
          <div>
            <div
              style={{
                color: "#0891b2",
                fontSize: isMobile ? "12px" : "14px",
                fontWeight: 600,
                letterSpacing: isMobile ? "2px" : "3px",
                textTransform: "uppercase",
                marginBottom: isMobile ? "12px" : "16px",
                textAlign: isMobile ? "center" : "left",
              }}
            >
              OUR VALUES
            </div>

            <h3
              style={{
                color: "#1e293b",
                fontSize: isMobile ? "1.5rem" : "1.75rem",
                fontWeight: 600,
                marginBottom: isMobile ? "24px" : "32px",
                textAlign: isMobile ? "center" : "left",
              }}
            >
              The Principles That Guide Us
            </h3>

            <div
              style={{ 
                display: "flex", 
                flexDirection: "column", 
                gap: isMobile ? "16px" : "24px" 
              }}
            >
              {values.map((value, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    gap: isMobile ? "16px" : "20px",
                    alignItems: isMobile ? "flex-start" : "flex-start",
                    padding: isMobile ? "20px" : "24px",
                    backgroundColor: "white",
                    borderRadius: "12px",
                    boxShadow: "0 3px 15px rgba(0, 0, 0, 0.08)",
                    transition: isMobile ? "none" : "transform 0.3s ease",
                    ...(isMobile && {
                      flexDirection: "row",
                      width: "100%",
                    }),
                  }}
                  onMouseOver={(e) => {
                    if (!isMobile) {
                      e.currentTarget.style.transform = "translateX(8px)";
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!isMobile) {
                      e.currentTarget.style.transform = "translateX(0)";
                    }
                  }}
                  onClick={(e) => {
                    if (isMobile) {
                      // Toggle active state on mobile
                      const isActive = e.currentTarget.style.boxShadow === "0 5px 20px rgba(8, 145, 178, 0.15)";
                      e.currentTarget.style.boxShadow = isActive 
                        ? "0 3px 15px rgba(0, 0, 0, 0.08)" 
                        : "0 5px 20px rgba(8, 145, 178, 0.15)";
                      e.currentTarget.style.borderLeft = isActive 
                        ? "none" 
                        : "3px solid #0891b2";
                    }
                  }}
                >
                  {/* Icon */}
                  <div
                    style={{
                      minWidth: isMobile ? "40px" : "50px",
                      width: isMobile ? "40px" : "50px",
                      height: isMobile ? "40px" : "50px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#e0f2fe",
                      borderRadius: isMobile ? "10px" : "12px",
                      fontSize: isMobile ? "1.25rem" : "1.5rem",
                      flexShrink: 0,
                    }}
                  >
                    {value.icon}
                  </div>

                  {/* Content */}
                  <div style={{
                    flex: 1,
                    minWidth: 0, // Prevent text overflow
                  }}>
                    <h4
                      style={{
                        color: "#1e293b",
                        fontSize: isMobile ? "1rem" : "1.1rem",
                        fontWeight: 600,
                        marginBottom: isMobile ? "6px" : "8px",
                        marginTop: 0,
                      }}
                    >
                      {value.title}
                    </h4>
                    <p
                      style={{
                        color: "#64748b",
                        fontSize: isMobile ? "0.875rem" : "0.95rem",
                        lineHeight: 1.6,
                        margin: 0,
                      }}
                    >
                      {value.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissionSection;