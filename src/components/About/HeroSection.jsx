import React from 'react';

const HeroSection = () => {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #0a1929 0%, #1a2744 50%, #0d2847 100%)',
      minHeight: '345px',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      padding: '80px 20px',
    }}>
      {/* Animated Curved Lines */}
      <svg style={{
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        opacity: 0.15,
      }}>
        <path
          d="M 0 200 Q 200 100 400 150 T 800 200"
          stroke="rgba(99, 211, 255, 0.6)"
          strokeWidth="2"
          fill="none"
          style={{
            animation: 'dashMove 20s linear infinite',
            strokeDasharray: '10 5',
          }}
        />
        <path
          d="M -100 300 Q 300 250 600 280 T 1200 300"
          stroke="rgba(255, 255, 255, 0.4)"
          strokeWidth="1.5"
          fill="none"
          style={{
            animation: 'dashMove 25s linear infinite reverse',
            strokeDasharray: '8 4',
          }}
        />
        <path
          d="M 200 50 Q 500 100 800 70 T 1400 50"
          stroke="rgba(99, 211, 255, 0.3)"
          strokeWidth="1"
          fill="none"
          style={{
            animation: 'dashMove 30s linear infinite',
            strokeDasharray: '6 3',
          }}
        />
      </svg>

      {/* Large Curved Gradient Overlays */}
      <div style={{
        position: 'absolute',
        top: '-20%',
        right: '-15%',
        width: '60%',
        height: '80%',
        background: 'radial-gradient(ellipse at center, rgba(6, 182, 212, 0.08) 0%, transparent 70%)',
        borderRadius: '40% 60% 70% 30% / 60% 40% 60% 40%',
        animation: 'morphCurve 15s ease-in-out infinite',
        transform: 'rotate(-15deg)',
      }} />
      
      <div style={{
        position: 'absolute',
        bottom: '-25%',
        left: '-20%',
        width: '70%',
        height: '90%',
        background: 'radial-gradient(ellipse at center, rgba(14, 165, 233, 0.12) 0%, transparent 65%)',
        borderRadius: '60% 40% 30% 70% / 40% 60% 40% 60%',
        animation: 'morphCurve 18s ease-in-out infinite reverse',
        transform: 'rotate(20deg)',
      }} />

      {/* Curved Arc Lines */}
      <div style={{
        position: 'absolute',
        top: '10%',
        right: '5%',
        width: '400px',
        height: '400px',
        border: '1px solid rgba(99, 211, 255, 0.15)',
        borderRadius: '50%',
        animation: 'rotateArc 30s linear infinite, fadeInOut 8s ease-in-out infinite',
      }} />
      
      <div style={{
        position: 'absolute',
        bottom: '15%',
        left: '10%',
        width: '300px',
        height: '300px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '50%',
        animation: 'rotateArc 25s linear infinite reverse, fadeInOut 6s ease-in-out infinite',
      }} />

      {/* Animated Background Elements */}
      <div style={{
        position: 'absolute',
        top: '5%',
        left: '10%',
        width: '2px',
        height: '120px',
        background: 'rgba(255, 255, 255, 0.3)',
        transform: 'rotate(45deg)',
        animation: 'fadeInOut 4s ease-in-out infinite',
      }} />
      
      <div style={{
        position: 'absolute',
        top: '40%',
        left: '60%',
        width: '12px',
        height: '12px',
        background: 'rgba(255, 255, 255, 0.6)',
        borderRadius: '50%',
        animation: 'pulse 3s ease-in-out infinite',
      }} />
      
      <div style={{
        position: 'absolute',
        top: '15%',
        right: '5%',
        width: '8px',
        height: '8px',
        background: 'rgba(99, 211, 255, 0.8)',
        borderRadius: '50%',
        animation: 'float 5s ease-in-out infinite',
      }} />
      
      <div style={{
        position: 'absolute',
        bottom: '20%',
        left: '75%',
        width: '16px',
        height: '16px',
        background: 'rgba(255, 255, 255, 0.4)',
        borderRadius: '50%',
        animation: 'pulse 4s ease-in-out infinite 1s',
      }} />
      
      <div style={{
        position: 'absolute',
        top: '30%',
        right: '20%',
        width: '150px',
        height: '2px',
        background: 'linear-gradient(90deg, transparent, rgba(99, 211, 255, 0.5), transparent)',
        transform: 'rotate(-30deg)',
        animation: 'slideIn 6s ease-in-out infinite',
      }} />
      
      {/* Glowing Orbs */}
      <div style={{
        position: 'absolute',
        bottom: '10%',
        left: '-5%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(14, 165, 233, 0.15) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'pulseGlow 8s ease-in-out infinite',
      }} />
      
      <div style={{
        position: 'absolute',
        top: '15%',
        right: '-10%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(6, 182, 212, 0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'floatSlow 10s ease-in-out infinite',
      }} />

      {/* Content */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
        position: 'relative',
        zIndex: 1,
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}>
          <h1 style={{
            color: 'white',
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: '700',
            margin: 0,
            letterSpacing: '-0.02em',
          }}>
            About Us
          </h1>
          
          <div style={{
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <span>Home</span>
            <span>›</span>
            <span style={{ fontWeight: '500' }}>About Us</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.5);
            opacity: 0.5;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes fadeInOut {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.8;
          }
        }

        @keyframes pulseGlow {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.7;
          }
        }

        @keyframes floatSlow {
          0%, 100% {
            transform: translate(0, 0);
          }
          33% {
            transform: translate(-20px, -30px);
          }
          66% {
            transform: translate(20px, -15px);
          }
        }

        @keyframes slideIn {
          0% {
            transform: translateX(-100px) rotate(-30deg);
            opacity: 0;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            transform: translateX(100px) rotate(-30deg);
            opacity: 0;
          }
        }

        @keyframes morphCurve {
          0%, 100% {
            border-radius: 60% 40% 30% 70% / 40% 60% 40% 60%;
            transform: rotate(0deg) scale(1);
          }
          25% {
            border-radius: 40% 60% 70% 30% / 60% 40% 60% 40%;
          }
          50% {
            border-radius: 70% 30% 50% 50% / 30% 70% 30% 70%;
            transform: rotate(5deg) scale(1.05);
          }
          75% {
            border-radius: 30% 70% 40% 60% / 50% 50% 70% 30%;
          }
        }

        @keyframes rotateArc {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes dashMove {
          from {
            stroke-dashoffset: 0;
          }
          to {
            stroke-dashoffset: 100;
          }
        }
      `}</style>
    </div>
  );
};

export default HeroSection;