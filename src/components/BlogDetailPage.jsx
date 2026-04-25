import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { blogAPI } from "../services/api";
import Header from "./homepage/Header";
import { getImagePreviewUrl } from "../utils/googleDriveUtils";
import HomePageFooter from "./homepage/HomePageFooter";

const BlogDetailPage = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentPosts, setRecentPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Fetch blog from API
    fetchBlog();
  }, [slug]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      // Fetch blog, categories, recent posts, and tags
      const [blogResponse, categoriesResponse, recentResponse, tagsResponse] =
        await Promise.all([
          blogAPI.getBlogBySlug(slug),
          blogAPI.getBlogCategories(),
          blogAPI.getRecentBlogs({ limit: 5 }),
          blogAPI.getBlogTags(),
        ]);

      setBlog(blogResponse.data);
      setCategories(categoriesResponse.data.categories);
      setRecentPosts(recentResponse.data.recentBlogs);
      setTags(tagsResponse.data.tags);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching blog:", error);
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const styles = {
    container: {
      backgroundColor: "#f8f9fa",
      minHeight: "100vh",
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    },
    hero: {
      background: "linear-gradient(135deg, #1e3a5f 0%, #2c5282 100%)",
      color: "white",
      padding: "50px 20px",
      position: "relative",
      overflow: "hidden",
    },
    heroPattern: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      opacity: 0.1,
      backgroundImage:
        "repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)",
    },
    heroContent: {
      maxWidth: "1200px",
      margin: "0 auto",
      position: "relative",
      zIndex: 1,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: "20px",
    },
    heroTitle: {
      fontSize: "3rem",
      fontWeight: 700,
      margin: 0,
      lineHeight: 1.2,
    },
    breadcrumb: {
      fontSize: "1rem",
    },
    mainContent: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "60px 20px",
      display: "grid",
      gridTemplateColumns: "1fr 350px",
      gap: "40px",
    },
    contentCard: {
      backgroundColor: "white",
      borderRadius: "8px",
      overflow: "hidden",
      marginBottom: "30px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
    },
    featuredImage: {
      width: "100%",
      height: "auto",
      display: "block",
      minHeight: "100px",
      maxHeight: "490px",
      objectFit: "cover",
    },
    articleContent: {
      padding: "40px",
    },
    blogTitle: {
      fontSize: "2rem",
      fontWeight: 700,
      color: "#1e3a5f",
      marginBottom: "24px",
      lineHeight: 1.3,
    },
    blogMeta: {
      color: "#666",
      fontSize: "0.95rem",
      marginBottom: "32px",
      paddingBottom: "24px",
      borderBottom: "1px solid #eee",
    },
    blogText: {
      fontSize: "1.05rem",
      lineHeight: 1.8,
      color: "#444",
      marginBottom: "24px",
    },
    featureSection: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "30px",
      margin: "40px 0",
    },
    featureBox: {
      padding: "24px",
      backgroundColor: "#f8f9fa",
      borderRadius: "8px",
    },
    featureTitle: {
      fontSize: "1.25rem",
      fontWeight: 700,
      color: "#1e3a5f",
      marginBottom: "12px",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    featureText: {
      fontSize: "0.95rem",
      color: "#666",
      lineHeight: 1.6,
    },
    blockquote: {
      margin: "40px 0",
      padding: "32px",
      backgroundColor: "#f8f9fa",
      borderLeft: "4px solid #0891b2",
      borderRadius: "8px",
      fontSize: "1.1rem",
      fontStyle: "italic",
      color: "#555",
      lineHeight: 1.8,
    },
    sidebar: {
      position: "sticky",
      top: "20px",
      alignSelf: "start",
    },
    sidebarWidget: {
      backgroundColor: "white",
      padding: "24px",
      borderRadius: "8px",
      marginBottom: "24px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
    },
    widgetTitle: {
      fontSize: "1.25rem",
      fontWeight: 700,
      marginBottom: "16px",
      color: "#1e3a5f",
    },
    searchInput: {
      width: "100%",
      padding: "12px 16px",
      border: "1px solid #ddd",
      borderRadius: "4px",
      fontSize: "0.875rem",
    },
    categoryList: {
      listStyle: "none",
      padding: 0,
      margin: 0,
    },
    categoryItem: {
      padding: "12px 0",
      borderBottom: "1px solid #eee",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      cursor: "pointer",
      transition: "color 0.2s",
    },
    recentPost: {
      display: "flex",
      gap: "16px",
      padding: "16px 0",
      borderBottom: "1px solid #eee",
      cursor: "pointer",
    },
    recentPostImage: {
      width: "70px",
      height: "70px",
      objectFit: "cover",
      borderRadius: "4px",
      flexShrink: 0,
    },
    recentPostTitle: {
      fontSize: "0.875rem",
      fontWeight: 600,
      color: "#1e3a5f",
      marginBottom: "4px",
      lineHeight: 1.4,
    },
    recentPostDate: {
      fontSize: "0.75rem",
      color: "#999",
    },
    workWithUs: {
      background: "linear-gradient(135deg, #1e3a5f 0%, #2c5282 100%)",
      color: "white",
      textAlign: "center",
      padding: "32px 24px",
    },
    workTitle: {
      fontSize: "1.5rem",
      fontWeight: 700,
      marginBottom: "24px",
      paddingBottom: "16px",
      borderBottom: "2px solid rgba(255,255,255,0.2)",
    },
    workIcon: {
      width: "80px",
      height: "80px",
      backgroundColor: "white",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "0 auto 20px",
    },
    workText: {
      fontSize: "0.95rem",
      lineHeight: 1.8,
      opacity: 0.9,
    },
    tagsContainer: {
      display: "flex",
      flexWrap: "wrap",
      gap: "8px",
    },
    tag: {
      backgroundColor: "#f0f0f0",
      color: "#1e3a5f",
      padding: "8px 16px",
      borderRadius: "4px",
      fontSize: "0.875rem",
      fontWeight: 500,
      cursor: "pointer",
      border: "none",
      transition: "all 0.2s",
    },
    scrollToTop: {
      position: "fixed",
      bottom: "32px",
      right: "32px",
      width: "56px",
      height: "56px",
      borderRadius: "50%",
      backgroundColor: "#0891b2",
      color: "white",
      border: "none",
      cursor: "pointer",
      boxShadow: "0 4px 12px rgba(8, 145, 178, 0.3)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all 0.3s",
      zIndex: 1000,
    },
    loading: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "400px",
    },
    spinner: {
      border: "4px solid #f3f3f3",
      borderTop: "4px solid #0891b2",
      borderRadius: "50%",
      width: "50px",
      height: "50px",
      animation: "spin 1s linear infinite",
    },
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div style={styles.container}>
      <Header />
      <style>{`
      
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .category-item:hover {
          color: #0891b2;
        }
        .tag:hover {
          backgroundColor: #0891b2 !important;
          color: white !important;
        }
        .recent-post:hover .recent-post-title {
          color: #0891b2;
        }
        .scroll-to-top:hover {
          backgroundColor: #06b6d4;
          transform: scale(1.05);
        }
        @media (max-width: 968px) {
          .main-content {
            grid-template-columns: 1fr !important;
          }
          .hero-title {
            font-size: 2.1rem !important;
          }
          .feature-section {
            grid-template-columns: 1fr !important;
          }
            .blog-det-h1{
            font-size: 2.1rem !important;
            
        }
      `}</style>

      {/* Hero Section */}
      <div style={styles.hero}>
        <div style={styles.heroPattern}></div>
        <div style={styles.heroContent}>
          <div>
            <h1
              style={styles.heroTitle}
              className="blog-det-h1"
              sx={{ fontSize: { xs: "1.5rem", md: "2rem" } }}
            >
              {blog?.title || "Blog Details"}
            </h1>
          </div>
          <div style={styles.breadcrumb}>
            Home → <strong>{blog?.title || "Blog Details"}</strong>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {loading ? (
        <div style={styles.loading}>
          <div style={styles.spinner}></div>
        </div>
      ) : (
        <div style={styles.mainContent} className="main-content">
          {/* Blog Content */}
          <div>
            <div style={styles.contentCard}>
              {blog?.featuredImage && (
                <img
                  src={getImagePreviewUrl(blog.featuredImage)}
                  alt={blog.title}
                  style={styles.featuredImage}
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              )}

              <div style={styles.articleContent}>
                <h1 style={styles.blogTitle}>
                  {blog?.title || "Industry stan Women We make small"}
                </h1>

                <div style={styles.blogMeta}>
                  By Credit Dost | &nbsp;
                  {blog?.createdAt
                    ? formatDate(blog.createdAt)
                    : "October 19, 2024"}{" "}
                </div>

                <div
                  style={styles.blogText}
                  dangerouslySetInnerHTML={{
                    __html:
                      blog?.content ||
                      "Aliquam eros justo, posuere loborti viverra laoreet matti ullamcorper posuere viverra .Aliquam eros justo, posuere lobortis non, viverra laoreet augue mattis fermentum ullamcorper viver laoreet Aliquam eros justo, posuere loborti viverra laoreet matti ullamcorper posuere viverra .Aliquam eros justo, posuere lobortis non",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={styles.sidebar}>
            {/* Search */}
            <div style={styles.sidebarWidget}>
              <h3 style={styles.widgetTitle}>Search</h3>
              <input
                type="text"
                placeholder="Search"
                style={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Categories */}
            <div style={styles.sidebarWidget}>
              <h3 style={styles.widgetTitle}>Categories</h3>
              <ul style={styles.categoryList}>
                {categories.map((category, index) => (
                  <li
                    key={index}
                    style={styles.categoryItem}
                    className="category-item"
                    onClick={() => {
                      // Filter blogs by category
                      window.location.href = `/blogs?category=${encodeURIComponent(category.name)}`;
                    }}
                  >
                    <span>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        style={{ verticalAlign: "middle", marginRight: "8px" }}
                      >
                        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                      </svg>
                      {category.name}
                    </span>
                    <span>({category.count})</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recent Posts */}
            <div style={styles.sidebarWidget}>
              <h3 style={styles.widgetTitle}>Recent Post</h3>
              {recentPosts.map((post, index) => (
                <div
                  key={post._id || index}
                  style={{
                    ...styles.recentPost,
                    borderBottom:
                      index < recentPosts.length - 1
                        ? "1px solid #eee"
                        : "none",
                    cursor: "pointer",
                  }}
                  className="recent-post"
                  onClick={() => (window.location.href = `/blog/${post.slug}`)}
                >
                  {post.featuredImage && (
                    <img
                      src={getImagePreviewUrl(post.featuredImage)}
                      alt={post.title}
                      style={styles.recentPostImage}
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  )}
                  <div>
                    <div
                      style={styles.recentPostTitle}
                      className="recent-post-title"
                    >
                      {post.title}
                    </div>
                    <div style={styles.recentPostDate}>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        style={{ verticalAlign: "middle", marginRight: "4px" }}
                      >
                        <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
                      </svg>
                      {formatDate(post.createdAt)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Tags */}
            <div style={styles.sidebarWidget}>
              <h3 style={styles.widgetTitle}>Tags</h3>
              <div style={styles.tagsContainer}>
                {tags.map((tag, index) => (
                  <button 
                    key={index} 
                    style={styles.tag} 
                    className="tag"
                    onClick={() => {
                      // Filter blogs by tag
                      window.location.href = `/blogs?tag=${encodeURIComponent(tag.name)}`;
                    }}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Scroll to Top Button */}
      <button
        style={styles.scrollToTop}
        className="scroll-to-top"
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
        </svg>
      </button>
      <HomePageFooter />
    </div>
  );
};

export default BlogDetailPage;
