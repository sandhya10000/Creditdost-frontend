import React from 'react';
import { Linkedin, Twitter, Github } from 'lucide-react';

const TeamSection = () => {
  const teamMembers = [
    {
      name: 'Albert Flores',
      position: 'Designer',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
      social: { linkedin: '#', twitter: '#', github: '#' }
    },
    {
      name: 'Kathryn Murphy',
      position: 'Developer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      social: { linkedin: '#', twitter: '#', github: '#' }
    },
    {
      name: 'Marvin McKinney',
      position: 'Frontend Developer',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
      social: { linkedin: '#', twitter: '#', github: '#' }
    },
    {
      name: 'Leslie Alexander',
      position: 'Backend Developer',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
      social: { linkedin: '#', twitter: '#', github: '#' }
    }
  ];

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .team-section {
          position: relative;
          padding: 100px 20px;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          overflow: hidden;
          min-height: 100vh;
        }

        .animated-bg {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          overflow: hidden;
          z-index: 0;
        }

        .floating-circle {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          animation: float 20s ease-in-out infinite;
        }

        .circle-1 {
          left: 5%;
          top: 10%;
          width: 400px;
          height: 400px;
          background: linear-gradient(135deg, rgba(96, 165, 250, 0.2) 0%, rgba(147, 197, 253, 0.2) 100%);
          animation-delay: 0s;
          animation-duration: 20s;
        }

        .circle-2 {
          right: 5%;
          top: 20%;
          width: 350px;
          height: 350px;
          background: linear-gradient(135deg, rgba(167, 139, 250, 0.2) 0%, rgba(196, 181, 253, 0.2) 100%);
          animation-delay: 3s;
          animation-duration: 25s;
        }

        .circle-3 {
          left: 50%;
          top: 60%;
          width: 300px;
          height: 300px;
          background: linear-gradient(135deg, rgba(251, 146, 60, 0.15) 0%, rgba(252, 165, 165, 0.15) 100%);
          animation-delay: 6s;
          animation-duration: 22s;
        }

        .circle-4 {
          left: 15%;
          bottom: 10%;
          width: 250px;
          height: 250px;
          background: linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(134, 239, 172, 0.15) 100%);
          animation-delay: 9s;
          animation-duration: 18s;
        }

        .circle-5 {
          right: 15%;
          bottom: 15%;
          width: 320px;
          height: 320px;
          background: linear-gradient(135deg, rgba(236, 72, 153, 0.15) 0%, rgba(251, 207, 232, 0.15) 100%);
          animation-delay: 12s;
          animation-duration: 24s;
        }

        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 30px) scale(0.9);
          }
        }

        .container {
          
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .section-header {
          text-align: center;
          margin-bottom: 80px;
        }

        .section-title {
          font-size: 3rem;
          font-weight: 800;
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 16px;
          letter-spacing: -1px;
        }

        .section-subtitle {
          font-size: 1.25rem;
          color: #475569;
          font-weight: 400;
        }

        .team-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 30px;
          padding: 0 20px;
        }

        .team-card {
          position: relative;
          height: 420px;
          border-radius: 24px;
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        .team-card:hover {
          transform: translateY(-12px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
        }

        .card-bg {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
          transition: transform 0.5s ease;
        }

        .glow-effect {
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%);
          opacity: 0;
          transition: opacity 0.5s ease;
          pointer-events: none;
        }

        .team-card:hover .glow-effect {
          opacity: 1;
        }

        .card-content {
          position: relative;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px;
          z-index: 2;
        }

        .team-avatar {
          width: 160px;
          height: 160px;
          border-radius: 50%;
          object-fit: cover;
          margin-bottom: 24px;
          border: 4px solid rgba(59, 130, 246, 0.2);
          box-shadow: 0 20px 60px rgba(59, 130, 246, 0.2);
          transition: all 0.5s ease;
        }

        .team-card:hover .team-avatar {
          transform: scale(1.05);
          box-shadow: 0 30px 80px rgba(59, 130, 246, 0.3);
          border-color: rgba(59, 130, 246, 0.4);
        }

        .member-name {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 8px;
          text-align: center;
          transition: transform 0.5s ease;
        }

        .team-card:hover .member-name {
          transform: translateY(-8px);
        }

        .member-position {
          font-size: 1rem;
          color: #3b82f6;
          margin-bottom: 24px;
          text-align: center;
          transition: transform 0.5s ease;
        }

        .team-card:hover .member-position {
          transform: translateY(-8px);
        }

        .social-container {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 80px;
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 20px;
          transform: translateY(100%);
          transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .team-card:hover .social-container {
          transform: translateY(0);
        }

        .social-icon {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
          cursor: pointer;
          text-decoration: none;
        }

        .social-icon:hover {
          background-color: rgba(255, 255, 255, 0.3);
          transform: translateY(-4px) rotate(10deg);
        }

        @media (max-width: 768px) {
          .section-title {
            font-size: 2rem;
          }

          .section-subtitle {
            font-size: 1rem;
          }

          .team-grid {
            grid-template-columns: 1fr;
            max-width: 400px;
            margin: 0 auto;
          }

          .team-card {
            height: 380px;
          }

          .team-avatar {
            width: 120px;
            height: 120px;
          }
        }
      `}</style>

      <div className="team-section">
        <div className="animated-bg">
          <div className="floating-circle circle-1"></div>
          <div className="floating-circle circle-2"></div>
          <div className="floating-circle circle-3"></div>
          <div className="floating-circle circle-4"></div>
          <div className="floating-circle circle-5"></div>
        </div>

        <div className="container">
          <div className="section-header">
            <h2 className="section-title">OUR TEAM</h2>
            <p className="section-subtitle">Leading the way in business transformation</p>
          </div>

          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <div key={index} className="team-card">
                <div className="glow-effect"></div>
                <div className="card-bg"></div>
                <div className="card-content">
                  <img 
                    src={member.avatar} 
                    alt={member.name}
                    className="team-avatar"
                  />
                  <h3 className="member-name">{member.name}</h3>
                  <p className="member-position">{member.position}</p>
                </div>
                <div className="social-container">
                  <a 
                    href={member.social.linkedin} 
                    className="social-icon"
                    onClick={(e) => e.preventDefault()}
                  >
                    <Linkedin size={20} />
                  </a>
                  <a 
                    href={member.social.twitter} 
                    className="social-icon"
                    onClick={(e) => e.preventDefault()}
                  >
                    <Twitter size={20} />
                  </a>
                  <a 
                    href={member.social.github} 
                    className="social-icon"
                    onClick={(e) => e.preventDefault()}
                  >
                    <Github size={20} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default TeamSection;