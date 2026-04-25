import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { blogAPI } from '../../services/api';

const CTASection = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(3);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await blogAPI.getAllBlogs({ limit: 5 });
        const formattedBlogs = response.data.blogs.map(blog => ({
          id: blog._id,
          slug: blog.slug,
          image: blog.featuredImage,
          date: new Date(blog.createdAt).getDate(),
          month: new Date(blog.createdAt).toLocaleString('default', { month: 'short' }),
          author: blog.author?.name || 'admin',
          comments: blog.comments || 0,
          title: blog.title,
          categories: blog.categories || [],
        }));
        setBlogs(formattedBlogs);
      } catch (err) {
        setError('Failed to fetch blogs');
        console.error('Error fetching blogs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 600) {
        setCardsPerView(1);
      } else if (window.innerWidth <= 960) {
        setCardsPerView(2);
      } else {
        setCardsPerView(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(blogs.length - cardsPerView, prev + 1));
  };

  const translateX = blogs.length > 0 ? -(currentIndex * (100 / cardsPerView)) : 0;

  return (
    <section className="blogs-section" style={{padding: '56px 0'}}>
      <div className="animated-bg-circle circle-1"></div>
      <div className="animated-bg-circle circle-2"></div>
      <div className="animated-bg-circle circle-3"></div>
      <div className="animated-bg-circle circle-4"></div>

      <div className="container">
        <div className="section-header">
          <span className="overline">NEW BLOGS</span>
          <h2 className="section-title">Building better businesses together</h2>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p>Loading blogs...</p>
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p>{error}</p>
          </div>
        ) : (
          <div className="slider-container" style={{maxWidth: '1400px'}}>
            <button
              className={`nav-button nav-prev ${currentIndex === 0 ? 'disabled' : ''}`}
              onClick={handlePrev}
              disabled={currentIndex === 0 || blogs.length === 0}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>

            <div className="blog-cards-wrapper" style={{overflowX: 'hidden', overflowY: 'visible !important'}}>
              <div
                className="blog-cards-container"
                style={{
                  transform: `translateX(${translateX}%)`,
                }}
              >
                {blogs.map((blog) => (
                  <article key={blog.id} className="blog-card" onClick={() => navigate(`/blog/${blog.slug || blog.id}`)}>
                    <div className="blog-image-wrapper">
                      <img src={blog.image} alt={blog.title} className="blog-image" />
                    </div>
                    <div className="blog-content">
                      <div className="meta-info">
                        <div className="meta-item">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                          </svg>
                          <span>By Credit Dost</span>
                        </div>
                        
                        {/* Date Badge moved here */}
                        <div className="date-badge-inline">
                          <div className="date-number">{blog.date}</div>
                          <div className="date-month">{blog.month}</div>
                        </div>
                        
                        {/* Category */}
                        {blog.categories && blog.categories.length > 0 && (
                          <div className="category-tag">
                            {blog.categories[0]}
                          </div>
                        )}
                        
                        {/* <div className="meta-item">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                          </svg>
                          <span>Comments ({blog.comments})</span>
                        </div> */}
                      </div>
                      <h3 className="blog-title">{blog.title}</h3>
                      <div className="read-more">
                        <span>Read More</span>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                          <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <button
              className={`nav-button nav-next ${
                currentIndex >= blogs.length - cardsPerView ? 'disabled' : ''
              }`}
              onClick={handleNext}
              disabled={currentIndex >= blogs.length - cardsPerView || blogs.length === 0}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        )}
      </div>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .blogs-section {
          padding: 80px 0;
          position: relative;
          overflow: hidden;
          background-color: #f8f9fa;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        }

        .animated-bg-circle {
          position: absolute;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(0, 150, 200, 0.08), rgba(100, 200, 255, 0.08));
          animation: float 8s ease-in-out infinite;
        }

        .circle-1 {
          width: 300px;
          height: 300px;
          top: 10%;
          left: 5%;
          animation-delay: 0s;
        }

        .circle-2 {
          width: 200px;
          height: 200px;
          top: 60%;
          left: 80%;
          animation-delay: 2s;
        }

        .circle-3 {
          width: 150px;
          height: 150px;
          top: 30%;
          left: 90%;
          animation-delay: 4s;
        }

        .circle-4 {
          width: 250px;
          height: 250px;
          top: 70%;
          left: 10%;
          animation-delay: 6s;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-30px) translateX(20px);
          }
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 20px;
          position: relative;
          z-index: 1;
        }

        .section-header {
          text-align: center;
          margin-bottom: 48px;
        }

        .overline {
          color: #0096c8;
          font-weight: 600;
          letter-spacing: 2px;
          font-size: 0.875rem;
          display: block;
          margin-bottom: 8px;
        }

        .section-title {
          font-weight: 700;
          color: #1a2332;
          font-size: 2.5rem;
          margin: 0;
        }

        .slider-container {
          position: relative;
          max-width: 1300px;
          margin: 0 auto;
          padding: 0 40px;
        }

        .nav-button {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background-color: #0096c8;
          color: white;
          border: none;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
          transition: all 0.3s ease;
        }

        .nav-button:hover:not(.disabled) {
          background-color: #007ba3;
          transform: translateY(-50%) scale(1.1);
        }

        .nav-button.disabled {
          background-color: #e0e0e0;
          color: #9e9e9e;
          cursor: not-allowed;
        }

        .nav-prev {
          left: 0;
        }

        .nav-next {
          right: 0;
        }

        .blog-cards-wrapper {
          overflow: hidden;
          position: relative;
        }

        .blog-cards-container {
          display: flex;
          gap: 24px;
          padding:10px 0px;
          transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .blog-card {
          min-width: calc(33.333% - 16px);
          background-color: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .blog-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
        }

        .blog-image-wrapper {
          position: relative;
          width: 100%;
          height: 255px;
        }

        .blog-image {
          width: 100%;
          height: 100%;
        }

        /* Removed the original date-badge as it's now inline in meta-info */

        .blog-content {
          padding: 24px;
        }

        .meta-info {
          display: flex;
          align-items: center;
          gap: 24px;
          margin-bottom: 16px;
          color: #6c757d;
          font-size: 0.9rem;
          flex-wrap: wrap;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        
        .date-badge-inline {
          background-color: white;
          border-radius: 8px;
          padding: 8px 12px;
          text-align: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          display: flex;
          gap:5px;
          // flex-direction: column;
          align-items: center;
          min-width: 50px;
        }
        
        .date-badge-inline .date-number {
          font-size: 1.1rem;
          font-weight: 700;
          color: #0096c8;
          line-height: 1;
        }
        
        .date-badge-inline .date-month {
          font-size: 0.75rem;
          color: #6c757d;
          text-transform: capitalize;
          margin-top: 2px;
        }
        
        .category-tag {
          background-color: #e3f2fd;
          color: #0096c8;
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .meta-item svg {
          flex-shrink: 0;
        }

        .blog-title {
          font-weight: 600;
          color: #1a2332;
          font-size: 1.25rem;
          margin: 0 0 16px 0;
          line-height: 1.4;
        }

        .read-more {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #0096c8;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .read-more:hover {
          gap: 12px;
        }

        .read-more svg {
          transition: transform 0.3s ease;
        }

        .read-more:hover svg {
          transform: translateX(4px);
        }

        @media (max-width: 960px) {
          .blog-card {
            min-width: calc(50% - 12px);
          }

          .section-title {
            font-size: 2rem;
          }

          .slider-container {
            padding: 0 50px;
          }
        }

        @media (max-width: 600px) {
          .blog-card {
            min-width: 100%;
          }

          .section-title {
            font-size: 1.75rem;
          }

          .slider-container {
            padding: 0px;
          }

          .nav-button {
            width: 40px;
            height: 40px;
          }

          .blog-image-wrapper {
            height: 220px;
          }
        }
      `}</style>
    </section>
  );
};

export default CTASection;