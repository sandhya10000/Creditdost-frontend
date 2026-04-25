import React, { useState } from "react";

const services = [
  {
    title: "Credit Score Repair",
    description:
      "Expert credit repair services that fix errors, improve your score, and restore your financial credibility",
    icon: "👥",
    image: "/images/IMG 2-01.jpg",
  },

  {
    title: "Franchise Opportunity",
    description:
      "Partner with Credit Dost and build a rewarding business helping people improve their credit scores and financial confidence.",
    icon: "📈",
    image: "/images/franchise-new.jpeg",
  },
  {
    title: "Credit Dost Suvidha Centre",
    description:
      "Start a profitable credit repair business with Credit Dost Suvidha Centre and help people improve their credit scores.",
    icon: "📈",
    image: "/images/Suvidha-centre.jpg",
  },
];

const FeaturesSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const handlePrevious = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev === 0 ? services.length - 1 : prev - 1));
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev === services.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsAnimating(false), 500);
  };

  const getVisibleCards = () => {
    const cards = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % services.length;
      cards.push({ ...services[index], position: i });
    }
    return cards;
  };

  return (
    <div
      className="features-container"
      style={{
        position: "relative",
        background: "#f5f7fa",
        padding: "56px 20px",
        overflow: "hidden",
      }}
    >
      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, -30px) scale(1.1); }
        }
        @keyframes float2 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(-40px, 60px) rotate(180deg); }
        }
        @keyframes morph {
          0%, 100% { border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; }
          50% { border-radius: 70% 30% 30% 70% / 70% 70% 30% 30%; }
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
        .service-card {
          height: 100%;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          border: none;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          background: white;
          overflow: hidden;
        }
        .service-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.15);
        }
        .nav-buttonz {
          background: #d4e8f0;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          color: #007ba7;
        }
        .nav-buttonz:hover:not(:disabled) {
          background: #b8dae8;
          transform: scale(1.05);
        }
        .nav-buttonz:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        /* Mobile responsiveness */
        @media (max-width: 768px) {
          .service-card {
            max-width: 100%;
            margin-bottom: 20px;
          }
          
          .features-container {
            padding: 40px 16px !important;
          }
          
          .features-header {
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: 20px;
          }
          
          .features-title {
            font-size: 2rem !important;
          }
          
          .features-subtitle {
            font-size: 0.85rem !important;
          }
          
          .nav-buttons {
            order: -1;
            margin-bottom: 20px;
          }
          
          .service-grid {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
          
          .service-card-content {
            padding: 24px !important;
          }
          
          .service-card-image {
            height: 160px !important;
          }
          
          .service-card-icon {
            font-size: 40px !important;
            height: 100px !important;
          }
          
          .animated-bg-elements {
            display: none;
          }
        }
        
        @media (max-width: 480px) {
          .features-container {
            padding: 32px 12px !important;
          }
          
          .features-title {
            font-size: 1.75rem !important;
          }
          
          .service-card-icon {
            height: 80px !important;
          }
          
          .service-card-content {
            padding: 20px !important;
          }
          
          .nav-buttonz {
            width: 48px !important;
            height: 48px !important;
            font-size: 20px !important;
          }
        }
      `}</style>

      {/* Animated Background Elements */}
      <div
        className="animated-bg-elements"
        style={{
          position: "absolute",
          top: "10%",
          left: "5%",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(0, 123, 255, 0.08) 0%, transparent 70%)",
          animation: "float 8s ease-in-out infinite",
        }}
      />
      <div
        className="animated-bg-elements"
        style={{
          position: "absolute",
          bottom: "72%",
          right: "8%",
          width: "250px",
          height: "250px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(0, 188, 212, 0.09) 0%, transparent 70%)",
          animation: "float2 10s ease-in-out infinite",
        }}
      />
      <div
        className="animated-bg-elements"
        style={{
          position: "absolute",
          top: "50%",
          right: "-3%",
          width: "200px",
          height: "200px",
          borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
          background:
            "linear-gradient(45deg, rgba(156, 39, 176, 0.1) 0%, transparent 100%)",
          animation: "morph 12s ease-in-out infinite",
        }}
      />

      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <div
          className="features-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "60px",
            flexWrap: "wrap",
            gap: "20px",
          }}
        >
          <div>
            <div
              style={{
                color: "#007ba7",
                fontSize: "0.95rem",
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                marginBottom: "12px",
              }}
            >
              OUR SERVICES
            </div>
            <h2
              className="features-title"
              style={{
                fontSize: "2.5rem",
                fontWeight: 800,
                color: "#1a2332",
                lineHeight: 1.2,

                margin: 0,
              }}
            >
              Innovate to dominate with us
            </h2>
          </div>

          <div className="nav-buttons" style={{ display: "flex", gap: "16px" }}>
            <button
              onClick={handlePrevious}
              disabled={isAnimating}
              className="nav-buttonz"
            >
              ←
            </button>
            <button
              onClick={handleNext}
              disabled={isAnimating}
              className="nav-buttonz"
            >
              →
            </button>
          </div>
        </div>

        <div
          className="service-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "32px",
            marginTop: "48px",
          }}
        >
          {getVisibleCards().map((service, idx) => (
            <div
              key={`${service.title}-${idx}`}
              className="service-card"
              style={{
                animation: `slideIn 0.5s ease-out ${idx * 0.1}s both`,
              }}
            >
              <div
                className="service-card-icon"
                style={{
                  background: "#007ba7",
                  height: "120px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "-50%",
                    left: "-50%",
                    width: "200%",
                    height: "200%",
                    background:
                      "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
                    animation: "pulse 3s ease-in-out infinite",
                  }}
                />
                <div
                  style={{
                    fontSize: "50px",
                    zIndex: 1,
                  }}
                >
                  {service.icon}
                </div>
              </div>

              <div className="service-card-content" style={{ padding: "32px" }}>
                <h3
                  style={{
                    fontWeight: 700,
                    color: "#1a2332",
                    marginBottom: "16px",
                    fontSize: "1.5rem",
                    marginTop: 0,
                  }}
                >
                  {service.title}
                </h3>
                <p
                  style={{
                    color: "#6b7280",
                    lineHeight: 1.7,
                    fontSize: "0.95rem",
                    marginBottom: "24px",
                  }}
                >
                  {service.description}
                </p>

                <img
                  className="service-card-image"
                  src={service.image}
                  alt={service.title}
                  style={{
                    width: "100%",
                    height: "245px",

                    borderRadius: "12px",
                    display: "block",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
