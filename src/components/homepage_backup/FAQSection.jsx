import React, { useState } from "react";

const faqs = [
  {
    id: 1,
    question: "What is Credit Score?",
    answer:
      "A credit score is a 3-digit numeric score that determines your credit worthiness. Your credit score typically falls between 300-900, and the higher your score the stronger is your credit worthiness.",
  },
  {
    id: 2,
    question: "How is credit score calculated?",
    answer:
      "Your credit score is derived from your past history on: • Amount of debt • Repayment of loans, credit cards • Number of open credit lines • Type and sub-type of loans • Tenure of loans • Recency of inquiry for new credit line",
  },
  {
    id: 3,
    question: "Who calculates my credit score?",
    answer:
      "In India, there are 4 credit information companies or credit bureaus licensed by the Reserve Bank of India (RBI): 1. CIBIL (300-900) 2. Equifax (300-900) 3. Experian (300-900) 4. CRIF Highmark (300-900)",
  },
  {
    id: 4,
    question: "How do I check my credit score?",
    answer:
      "On Credit Dost, you can get your credit score here absolutely free. Alternatively, you can go to the websites of any of the 4 licensed credit bureaus in India, fill in your details and request for a credit score upon payment of a nominal fee.",
  },
  {
    id: 5,
    question: "Why is my credit score important?",
    answer:
      "While evaluating your loan application, Banks and financial institutions use credit bureaus to obtain your credit history. A good credit score makes it easier for you to secure loans or extended credit lines with better terms.",
  },
  {
    id: 6,
    question: "What is a good credit score?",
    answer:
      "A credit score of 750 or above is considered a good credit score. It helps you qualify for loans or credit cards better because it gives your potential lenders more confidence in approving your requests for loans and other credit.",
  },
  {
    id: 7,
    question: "What are the disadvantages of bad credit score?",
    answer:
      "A credit score of 650 or lower is considered low and 400 or lower is considered bad. With such scores: • You get loans at very high interest rates • You delay building your wealth because a lot of it goes towards repaying high interest",
  },
  {
    id: 8,
    question: "Can I improve my credit score?",
    answer:
      "Yes you can improve your credit score if you take conscious and consistent measures to improve it. However, credit scores do not get impacted immediately after you have prepaid a loan or paid up any outstanding dues. It takes at least 45-60 days for your credit score to climb.",
  },
  {
    id: 9,
    question: "How soon can I expect my credit score to increase?",
    answer:
      "Resolution of an open credit line takes about 15 days to impact your credit score. We estimate an average 15 days for your credit score to improve after you have resolved one or more open credit lines.",
  },
];

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? -1 : index);
  };

  const stats = [
    {
      icon: (
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
        </svg>
      ),
      number: "10000+",
      label: "Happy Customers",
      suffix: "+",
      duration: 2500,
    },
    {
      icon: (
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 2L20 7L12 12L4 7L12 2Z"></path>
          <path d="M20 17L12 22L4 17"></path>
          <path d="M20 12L12 17L4 12"></path>
        </svg>
      ),
      number: "200+",
      label: "Financial Partners",
      suffix: "+",
      duration: 2000,
    },
    {
      icon: (
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
        </svg>
      ),
      number: "98",
      label: "Success Rate",
      suffix: "%",
      duration: 1800,
    },
    {
      icon: (
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="8" r="7"></circle>
          <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
        </svg>
      ),
      number: "500+",
      label: "Consultants Trained",
      suffix: "+",
      duration: 2200,
    },
  ];

  const AnimatedCounter = ({ end, suffix, duration }) => {
    const [count, setCount] = useState(0);
    const [hasAnimated, setHasAnimated] = useState(false);

    React.useEffect(() => {
      if (!hasAnimated) {
        const element = document.getElementById(`counter-${end}`);
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setHasAnimated(true);
              let start = 0;
              const increment = end / (duration / 16);
              const timer = setInterval(() => {
                start += increment;
                if (start >= end) {
                  setCount(end);
                  clearInterval(timer);
                } else {
                  setCount(Math.ceil(start));
                }
              }, 16);
            }
          },
          { threshold: 0.5 }
        );

        if (element) {
          observer.observe(element);
        }

        return () => observer.disconnect();
      }
    }, [end, duration, hasAnimated]);

    return (
      <span id={`counter-${end}`}>
        {count}
        {suffix}
      </span>
    );
  };

  return (
    <div className="faq-wrap">
      <section className="faq-section">
        <div className="animated-bg-element element-1"></div>
        <div className="animated-bg-element element-2"></div>
        <div className="animated-bg-element element-3"></div>
        <div className="animated-bg-element element-4"></div>
        <div className="animated-bg-element element-5"></div>

        <div className="faq-container">
          <div className="faq-left">
            <span className="overline" style={{ color: "#fff" }}>
              CREDIT EDUCATION
            </span>
            <h2 className="faq-title">
              Frequently Asked
              <br />
              Questions
            </h2>
            <p className="faq-description">
              Get answers to all your credit score related questions.
              Understanding your credit is the first step towards financial
              freedom.
            </p>

            <div className="stats-container">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="stat-card"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="stat-icon">{stat.icon}</div>
                  <div className="stat-content">
                    <div className="stat-number">
                      <AnimatedCounter
                        end={parseInt(stat.number)}
                        suffix={stat.suffix}
                        duration={stat.duration}
                      />
                    </div>
                    <div className="stat-label">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="faq-right">
            <div className="accordion-container">
              {faqs.map((faq, index) => (
                <div
                  key={faq.id}
                  className={`accordion-item ${
                    activeIndex === index ? "active" : ""
                  }`}
                >
                  <button
                    className="accordion-header"
                    onClick={() => toggleAccordion(index)}
                  >
                    <span className="accordion-question">{faq.question}</span>
                    <div className="accordion-icon">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        {activeIndex === index ? (
                          <polyline points="18 15 12 9 6 15"></polyline>
                        ) : (
                          <polyline points="6 9 12 15 18 9"></polyline>
                        )}
                      </svg>
                    </div>
                  </button>
                  <div className="accordion-content">
                    <p>{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .faq-wrap{
          background: linear-gradient(135deg, #0a5d7a 0%, #0e9ac7 100%);
        }

        .faq-section {
          background: linear-gradient(135deg, #0a5d7a 0%, #0e9ac7 100%);
          padding: 80px 20px;
          position: relative;
          max-width: 1400px;
          margin: 0 auto;
          overflow: hidden;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        }

        .animated-bg-element {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.05);
          animation: floatElement 12s ease-in-out infinite;
        }

        .element-1 {
          width: 400px;
          height: 400px;
          top: -100px;
          left: -100px;
          animation-delay: 0s;
        }

        .element-2 {
          width: 300px;
          height: 300px;
          top: 40%;
          left: -50px;
          animation-delay: 2s;
        }

        .element-3 {
          width: 250px;
          height: 250px;
          bottom: -50px;
          left: 20%;
          animation-delay: 4s;
        }

        .element-4 {
          width: 350px;
          height: 350px;
          top: 10%;
          right: -80px;
          animation-delay: 1s;
        }

        .element-5 {
          width: 200px;
          height: 200px;
          bottom: 15%;
          right: 10%;
          animation-delay: 3s;
        }

        @keyframes floatElement {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(20px, -20px) scale(1.05);
          }
          50% {
            transform: translate(-15px, 15px) scale(0.95);
          }
          75% {
            transform: translate(10px, -10px) scale(1.02);
          }
        }

        .faq-container {
          max-width: 1400px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          position: relative;
          z-index: 1;
          align-items: start;
        }

        .faq-left {
          color: white;
        }

        .overline {
          font-size: 0.875rem;
          font-weight: 600;
          letter-spacing: 3px;
          text-transform: uppercase;
          display: block;
          margin-bottom: 16px;
          opacity: 0.9;
        }

        .faq-title {
          font-size: 3rem;
          font-weight: 700;
          line-height: 1.2;
          margin-bottom: 24px;
        }

        .faq-description {
          font-size: 1rem;
          line-height: 1.7;
          opacity: 0.9;
          margin-bottom: 40px;
        }

        .stats-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .stat-card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          display: flex;
          align-items: center;
          gap: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          animation: slideInUp 0.6s ease-out forwards;
          opacity: 0;
          transform: translateY(30px);
        }

        @keyframes slideInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
        }

        .stat-icon {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          background: linear-gradient(135deg, #0a5d7a 0%, #0e9ac7 100%);
          color: white;
          transition: transform 0.3s ease;
        }

        .stat-card:hover .stat-icon {
          transform: scale(1.1) rotate(5deg);
        }

        .stat-content {
          flex: 1;
        }

        .stat-number {
          font-size: 1.75rem;
          font-weight: 700;
          color: #1a2332;
          line-height: 1;
          margin-bottom: 4px;
          font-family: 'Arial', sans-serif;
        }

        .stat-label {
          font-size: 0.95rem;
          color: #1a2332;
          font-weight: 500;
        }

        .faq-right {
          background: white;
          border-radius: 16px;
          padding: 40px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
          max-height: 600px;
          overflow-y: auto;
        }

        .faq-right::-webkit-scrollbar {
          width: 6px;
        }

        .faq-right::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }

        .faq-right::-webkit-scrollbar-thumb {
          background: #0a5d7a;
          border-radius: 10px;
        }

        .accordion-container {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .accordion-item {
          border-bottom: 1px solid #e0e0e0;
          padding-bottom: 16px;
        }

        .accordion-item:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .accordion-header {
          width: 100%;
          background: none;
          border: none;
          padding: 20px 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          transition: all 0.3s ease;
          gap: 12px;
        }

        .accordion-item.active .accordion-header {
          background: linear-gradient(135deg, #0a5d7a 0%, #0e9ac7 100%);
          border-radius: 8px;
          padding: 20px 24px;
          margin: -4px 0 12px 0;
        }

        .accordion-question {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1a2332;
          text-align: left;
          transition: color 0.3s ease;
          flex: 1;
        }

        .accordion-item.active .accordion-question {
          color: white;
        }

        .accordion-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #0a5d7a 0%, #0e9ac7 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.3s ease;
        }

        .accordion-item.active .accordion-icon {
          background: white;
          color: #0a5d7a;
        }

        .accordion-icon svg {
          transition: transform 0.3s ease;
        }

        .accordion-content {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.4s ease, padding 0.4s ease;
          padding: 0 0;
        }

        .accordion-item.active .accordion-content {
          max-height: 500px;
          padding: 0 0 16px 0;
        }

        .accordion-content p {
          color: #6c757d;
          line-height: 1.7;
          font-size: 0.95rem;
          margin: 0;
        }

        @media (max-width: 1024px) {
          .faq-container {
            grid-template-columns: 1fr;
            gap: 40px;
          }

          .faq-title {
            font-size: 2.5rem;
          }

          .stats-container {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 768px) {
          .faq-section {
            padding: 60px 20px;
          }

          .faq-title {
            font-size: 2rem;
          }

          .faq-right {
            padding: 24px;
          }

          .stats-container {
            grid-template-columns: 1fr;
          }

          .stat-card {
            width: 100%;
          }

          .accordion-question {
            font-size: 1rem;
          }

          .accordion-icon {
            width: 36px;
            height: 36px;
          }

          .stat-number {
            font-size: 1.5rem;
          }

          .stat-icon {
            width: 50px;
            height: 50px;
          }
            .overline{
            text-align:center;
            }
            .faq-title{
             text-align:center;
            }
             .faq-description{
             text-align:center;
             }
        }

        @media (max-width: 480px) {
          .faq-section {
            padding: 40px 16px;
          }

          .faq-title {
            font-size: 1.75rem;
          }

          .stat-card {
            padding: 16px;
          }

          .accordion-header {
            padding: 16px 0;
          }

          .accordion-item.active .accordion-header {
            padding: 16px 20px;
          }
        }
      `}</style>
      </section>
    </div>
  );
};

export default FAQSection;
