import React, { useState, useEffect } from "react";

const WhoWeAreSection = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div
      style={{
        padding: isMobile ? "40px 16px" : "80px 20px",
        backgroundColor: "#ffffff",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated Background Elements - Hide on mobile */}
      {!isMobile && (
        <>
          <div
            style={{
              position: "absolute",
              top: "10%",
              right: "5%",
              width: "300px",
              height: "300px",
              background:
                "radial-gradient(circle, rgba(8, 145, 178, 0.05) 0%, transparent 70%)",
              borderRadius: "50%",
              animation: "float 8s ease-in-out infinite",
            }}
          />

          <div
            style={{
              position: "absolute",
              bottom: "15%",
              left: "10%",
              width: "400px",
              height: "400px",
              background:
                "radial-gradient(circle, rgba(6, 182, 212, 0.04) 0%, transparent 70%)",
              borderRadius: "50%",
              animation: "float 10s ease-in-out infinite reverse",
            }}
          />
        </>
      )}

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: isMobile
            ? "1fr"
            : "repeat(auto-fit, minmax(300px, 1fr))",
          gap: isMobile ? "40px" : "60px",
          alignItems: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Left Side - Content */}
        <div
          style={{
            padding: isMobile ? "0" : "20px",
            order: isMobile ? 2 : 1, // Content after image on mobile
          }}
        >
          <div
            style={{
              color: "#0891b2",
              fontSize: isMobile ? "0.8rem" : "0.9rem",
              fontWeight: "600",
              letterSpacing: "2px",
              marginBottom: isMobile ? "8px" : "12px",
              textAlign: isMobile ? "center" : "left",
            }}
          >
            WHO WE ARE
          </div>

          <h2
            style={{
              fontSize: isMobile ? "1.75rem" : "2.1rem",
              fontWeight: "700",
              color: "#0f172a",
              marginBottom: isMobile ? "16px" : "24px",
              lineHeight: 1.2,
              textAlign: isMobile ? "center" : "left",
            }}
          >
            Your Trusted Partner in Credit Score Improvement in India
          </h2>

          <p
            style={{
              color: "#64748b",
              fontSize: isMobile ? "1rem" : "1.1rem",
              lineHeight: 1.7,
              marginBottom: isMobile ? "20px" : "24px",
              fontWeight: "500",
              textAlign: isMobile ? "justify" : "left",
            }}
          >
            At <strong>Credit Dost</strong>, we believe everyone deserves a
            second chance to rebuild their credit and financial confidence.
          </p>

          <p
            style={{
              color: "#64748b",
              fontSize: isMobile ? "0.95rem" : "1rem",
              lineHeight: 1.7,
              marginBottom: isMobile ? "24px" : "32px",
              textAlign: isMobile ? "justify" : "left",
            }}
          >
            We are India's dedicated{" "}
            <strong>
              Credit Score Improvement and Dispute Resolution Company
            </strong>
            , helping individuals repair, rebuild, and manage their credit
            health with transparency, accuracy, and trust.
          </p>

          <div
            style={{
              backgroundColor: "#f8f9fa",
              padding: isMobile ? "20px" : "24px",
              borderRadius: "12px",
              borderLeft: "4px solid #0891b2",
            }}
          >
            <p
              style={{
                color: "#475569",
                fontSize: isMobile ? "0.95rem" : "1rem",
                lineHeight: 1.6,
                margin: 0,
                fontStyle: "italic",
                textAlign: isMobile ? "justify" : "left",
              }}
            >
              <strong>
                Credit Dost is a division of Optimystic Auxiliary Services Pvt.
                Ltd.
              </strong>
              , a compliance-driven financial services organization. We bring
              together a team of trained credit professionals, finance experts,
              and customer support specialists committed to simplifying credit
              score challenges.
            </p>
          </div>
        </div>

        {/* Right Side - Image/Graphic */}
        <div
          style={{
            position: "relative",
            height: isMobile ? "300px" : "500px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            order: isMobile ? 1 : 2, // Image before content on mobile
          }}
        >
          {/* Main Graphic */}
          <div
            style={{
              width: "100%",
              height: isMobile ? "100%" : "470px",

              backgroundImage: 'url("./images/website image.jpg")',
              backgroundSize: "cover",
              backgroundPosition: "center",
              borderRadius: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              overflow: "hidden",
              boxShadow: isMobile ? "0 4px 12px rgba(0, 0, 0, 0.08)" : "none",
            }}
          >
            <div
              style={{
                textAlign: "center",
                color: "#0891b2",
                padding: isMobile ? "20px" : "40px",
              }}
            ></div>

            {/* Decorative Elements - Hide on mobile */}
            {!isMobile && (
              <>
                <div
                  style={{
                    position: "absolute",
                    top: "20px",
                    right: "20px",
                    width: "60px",
                    height: "60px",
                    backgroundColor: "#0891b2",
                    borderRadius: "50%",
                    opacity: 0.1,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: "30px",
                    left: "30px",
                    width: "40px",
                    height: "40px",
                    backgroundColor: "#0891b2",
                    borderRadius: "50%",
                    opacity: 0.1,
                  }}
                />
              </>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
      `}</style>
    </div>
  );
};

export default WhoWeAreSection;
