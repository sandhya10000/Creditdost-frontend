import React, { useState, useEffect } from 'react';

const WhyChooseUsSection = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const reasons = [
    {
      icon: '👥',
      title: 'Experienced Team',
      description: 'Deep credit-bureau expertise with proven track record in credit correction.'
    },
    {
      icon: '⚖️',
      title: 'Legally Compliant',
      description: '100% legally compliant dispute process following all regulatory guidelines.'
    },
    {
      icon: '🎯',
      title: 'Personalized Solutions',
      description: 'Customized approaches for each client based on their unique credit situation.'
    },
    {
      icon: '📊',
      title: 'High Success Rate',
      description: 'Proven success in error correction and significant score improvement.'
    },
    {
      icon: '🏆',
      title: 'Trusted Training',
      description: 'Trusted by professionals trained under Credit Dost Learning programs.'
    },
    {
      icon: '🤝',
      title: 'Continuous Support',
      description: 'End-to-end guidance and support throughout your credit improvement journey.'
    }
  ];

  return (
    <div style={{
      padding: isMobile ? '40px 16px' : '80px 20px',
      backgroundColor: '#ffffff',
      position: 'relative',
      overflow: 'hidden',
    }}>
      
      {/* Background Elements - Hide on mobile */}
      {!isMobile && (
        <>
          <div style={{
            position: 'absolute',
            top: '10%',
            left: '5%',
            width: '200px',
            height: '200px',
            background: 'radial-gradient(circle, rgba(8, 145, 178, 0.05) 0%, transparent 70%)',
            borderRadius: '50%',
            animation: 'float 6s ease-in-out infinite',
          }} />
          
          <div style={{
            position: 'absolute',
            bottom: '15%',
            right: '8%',
            width: '250px',
            height: '250px',
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.04) 0%, transparent 70%)',
            borderRadius: '50%',
            animation: 'float 8s ease-in-out infinite reverse',
          }} />
        </>
      )}

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 1,
      }}>
        
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: isMobile ? '40px' : '60px',
        }}>
          <div style={{
            color: '#0891b2',
            fontSize: isMobile ? '0.8rem' : '0.9rem',
            fontWeight: '600',
            letterSpacing: isMobile ? '1.5px' : '2px',
            marginBottom: isMobile ? '8px' : '12px',
          }}>
            WHY CHOOSE US
          </div>
          
          <h2 style={{
            fontSize: isMobile ? '1.75rem' : 'clamp(2rem, 4vw, 2.75rem)',
            fontWeight: '700',
            color: '#0f172a',
            marginBottom: isMobile ? '12px' : '16px',
            lineHeight: 1.2,
            padding: isMobile ? '0 10px' : '0',
          }}>
            The Credit Dost Advantage
          </h2>
          
          <p style={{
            color: '#64748b',
            fontSize: isMobile ? '1rem' : '1.1rem',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: 1.6,
            padding: isMobile ? '0 16px' : '0',
          }}>
            Experience the difference with our proven approach to credit score improvement
          </p>
        </div>

        {/* Reasons Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: isMobile ? '20px' : '30px',
          marginBottom: isMobile ? '40px' : '60px',
          padding: isMobile ? '0 8px' : '0',
        }}>
          {reasons.map((reason, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: isMobile ? 'flex-start' : 'flex-start',
                gap: isMobile ? '16px' : '20px',
                padding: isMobile ? '24px' : '30px',
                backgroundColor: '#f8f9fa',
                borderRadius: '16px',
                transition: isMobile ? 'all 0.2s ease' : 'all 0.3s ease',
                ...(isMobile && {
                  minHeight: '120px',
                }),
              }}
              onMouseOver={(e) => {
                if (!isMobile) {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.backgroundColor = '#e0f2fe';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(8, 145, 178, 0.1)';
                }
              }}
              onMouseOut={(e) => {
                if (!isMobile) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.backgroundColor = '#f8f9fa';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
              onClick={(e) => {
                if (isMobile) {
                  // Toggle mobile active state
                  const isActive = e.currentTarget.style.backgroundColor === 'rgb(224, 242, 254)';
                  e.currentTarget.style.backgroundColor = isActive ? '#f8f9fa' : '#e0f2fe';
                  e.currentTarget.style.boxShadow = isActive 
                    ? 'none' 
                    : '0 5px 20px rgba(8, 145, 178, 0.15)';
                  e.currentTarget.style.transform = isActive 
                    ? 'translateY(0)' 
                    : 'translateY(-3px)';
                }
              }}
            >
              {/* Icon */}
              <div style={{
                fontSize: isMobile ? '2rem' : '2.5rem',
                flexShrink: 0,
                ...(isMobile && {
                  marginTop: '2px',
                }),
              }}>
                {reason.icon}
              </div>
              
              {/* Content */}
              <div style={{
                flex: 1,
                minWidth: 0, // Prevent text overflow
              }}>
                <h3 style={{
                  fontSize: isMobile ? '1.125rem' : '1.25rem',
                  fontWeight: '600',
                  color: '#0f172a',
                  marginBottom: isMobile ? '8px' : '12px',
                  lineHeight: 1.3,
                }}>
                  {reason.title}
                </h3>
                <p style={{
                  color: '#64748b',
                  fontSize: isMobile ? '0.9rem' : '0.95rem',
                  lineHeight: 1.6,
                  margin: 0,
                }}>
                  {reason.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        {/* Add CTA if needed */}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }
      `}</style>
    </div>
  );
};

export default WhyChooseUsSection;