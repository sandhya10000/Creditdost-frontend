import React, { useState, useEffect } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { blogAPI } from "../services/api";
import Header from "./homepage/Header";
import HomePageFooter from "./homepage/HomePageFooter";

const BlogsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(parseInt(searchParams.get("page")) || 1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [recentPosts, setRecentPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [selectedTag, setSelectedTag] = useState(searchParams.get("tag") || "");
  const navigate = useNavigate();

  const fetchBlogs = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      if (page > 1) params.set("page", page);
      if (searchQuery) params.set("search", searchQuery);
      if (selectedCategory) params.set("category", selectedCategory);
      if (selectedTag) params.set("tag", selectedTag);
      setSearchParams(params);

      const response = await blogAPI.getAllBlogs({
        page,
        limit: 9,
        status: "published",
        search: searchQuery,
        category: selectedCategory,
        tag: selectedTag,
      });

      setBlogs(response.data.blogs || []);
      setTotalPages(response.data.totalPages || 1);
      setRecentPosts((response.data.blogs || []).slice(0, 4));
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await blogAPI.getBlogCategories();
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await blogAPI.getBlogTags();
      setTags(response.data.tags || []);
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  useEffect(() => {
    fetchBlogs();
    fetchCategories();
    fetchTags();
  }, [page, searchQuery, selectedCategory, selectedTag]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchBlogs();
  };

  return (
    <div className="bg-[#080E1B] font-body-md text-slate-100 antialiased min-h-screen flex flex-col justify-between selection:bg-cyan-500 selection:text-slate-950">
      <Header />

      <main className="relative flex-grow pt-24 pb-20 overflow-hidden">
        {/* Volumetric Backlights */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[360px] bg-cyan-500/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[340px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-6">
            <Link to="/" className="hover:text-cyan-400 transition-colors">Home</Link>
            <span className="text-slate-600">/</span>
            <span className="text-cyan-400 font-semibold">Blogs & Financial Insights</span>
          </div>

          {/* Page Hero Header */}
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-400 font-mono text-xs mb-4 shadow-[0_0_20px_rgba(0,210,255,0.2)]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#3afaac]" />
              <span>CREDIT LITERACY & BUREAU EDUCATION</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-['Sora'] tracking-tight mb-4">
              Credit Dost{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-emerald-400">
                Insights & Guides.
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Explore expert articles on CIBIL score recovery, bureau dispute playbooks, DPD resolution, and banking approval secrets.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left 8-Cols: Blog Post Cards */}
            <div className="lg:col-span-8">
              {loading ? (
                <div className="py-20 text-center">
                  <CircularProgress sx={{ color: "#00d2ff" }} />
                  <p className="text-slate-400 text-xs font-mono mt-3">Loading financial articles...</p>
                </div>
              ) : blogs.length === 0 ? (
                <div className="p-10 rounded-2xl bg-[#0a1426]/80 border border-slate-800 text-center">
                  <span className="material-symbols-outlined text-4xl text-slate-500 mb-2">article</span>
                  <h3 className="text-lg font-bold text-white mb-1">No articles found</h3>
                  <p className="text-xs text-slate-400 mb-4">Try adjusting your keyword search or category filters.</p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("");
                      setSelectedTag("");
                    }}
                    className="px-5 py-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {blogs.map((blog) => (
                    <article
                      key={blog._id}
                      className="rounded-[22px] overflow-hidden bg-[#0a1426]/85 border border-cyan-500/20 hover:border-cyan-400/50 transition-all duration-300 shadow-[0_0_30px_rgba(0,0,0,0.5)] flex flex-col justify-between group"
                    >
                      <div>
                        {blog.featuredImage ? (
                          <div className="h-48 overflow-hidden relative">
                            <img
                              src={blog.featuredImage}
                              alt={blog.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#080E1B]/80 backdrop-blur-md border border-cyan-500/30 text-cyan-300 text-[10px] font-mono uppercase font-bold">
                              {blog.category?.name || "Credit Score"}
                            </div>
                          </div>
                        ) : (
                          <div className="h-44 bg-gradient-to-br from-cyan-950 to-slate-900 flex items-center justify-center p-4 border-b border-cyan-500/10">
                            <span className="material-symbols-outlined text-4xl text-cyan-400/40">newspaper</span>
                          </div>
                        )}

                        <div className="p-5">
                          <div className="flex items-center gap-3 text-xs font-mono text-slate-400 mb-2.5">
                            <span>{new Date(blog.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                            <span>•</span>
                            <span className="text-emerald-400">{blog.readTime || "4 min read"}</span>
                          </div>

                          <h2 className="text-base sm:text-lg font-bold font-['Sora'] text-white group-hover:text-cyan-300 transition-colors line-clamp-2 leading-snug mb-2">
                            {blog.title}
                          </h2>

                          <p className="text-slate-400 text-xs leading-relaxed line-clamp-3 mb-4">
                            {blog.summary || blog.excerpt || (blog.content ? blog.content.replace(/<[^>]*>?/gm, "").slice(0, 130) : "")}...
                          </p>
                        </div>
                      </div>

                      <div className="p-5 pt-0 border-t border-slate-800/80 flex items-center justify-between">
                        <span className="text-xs font-mono text-slate-400">By {blog.author?.name || "Credit Dost Team"}</span>
                        <Link
                          to={`/blog/${blog.slug}`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors font-mono"
                        >
                          <span>Read Full Guide</span>
                          <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-10 flex justify-center gap-2">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => {
                        setPage(i + 1);
                        window.scrollTo({ top: 300, behavior: "smooth" });
                      }}
                      className={`w-10 h-10 rounded-xl font-mono text-xs font-bold transition-all ${
                        page === i + 1
                          ? "bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(0,210,255,0.4)]"
                          : "bg-slate-900 border border-slate-800 text-slate-300 hover:border-cyan-500/40"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right 4-Cols: Search, Categories, Recent Posts & Tags */}
            <aside className="lg:col-span-4 space-y-6">
              
              {/* Search Widget */}
              <div className="p-6 rounded-[22px] bg-[#0a1426]/90 border border-cyan-500/25 shadow-lg backdrop-blur-xl">
                <h3 className="text-sm font-bold font-['Sora'] text-white uppercase tracking-wider mb-3">
                  Search Articles
                </h3>
                <form onSubmit={handleSearchSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search CIBIL, DPD, loans..."
                    className="flex-1 bg-[#071120] text-white text-xs px-3.5 py-2.5 rounded-xl border border-cyan-500/30 focus:border-cyan-400 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30 transition-all flex items-center justify-center"
                  >
                    <span className="material-symbols-outlined text-base">search</span>
                  </button>
                </form>
              </div>

              {/* Categories Widget */}
              {categories.length > 0 && (
                <div className="p-6 rounded-[22px] bg-[#0a1426]/90 border border-cyan-500/25 shadow-lg backdrop-blur-xl">
                  <h3 className="text-sm font-bold font-['Sora'] text-white uppercase tracking-wider mb-3">
                    Categories
                  </h3>
                  <div className="space-y-1.5 font-mono text-xs">
                    {categories.map((cat) => (
                      <button
                        key={cat._id}
                        type="button"
                        onClick={() => {
                          setSelectedCategory(selectedCategory === cat.name ? "" : cat.name);
                          setPage(1);
                        }}
                        className={`w-full py-2 px-3 rounded-lg text-left flex items-center justify-between transition-all ${
                          selectedCategory === cat.name
                            ? "bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40"
                            : "text-slate-400 hover:text-white hover:bg-slate-900/50"
                        }`}
                      >
                        <span>{cat.name}</span>
                        <span className="text-[10px] text-slate-500">→</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Articles */}
              {recentPosts.length > 0 && (
                <div className="p-6 rounded-[22px] bg-[#0a1426]/90 border border-cyan-500/25 shadow-lg backdrop-blur-xl">
                  <h3 className="text-sm font-bold font-['Sora'] text-white uppercase tracking-wider mb-4">
                    Latest Insights
                  </h3>
                  <div className="space-y-4">
                    {recentPosts.map((post) => (
                      <Link
                        key={post._id}
                        to={`/blog/${post.slug}`}
                        className="flex gap-3 group items-center"
                      >
                        <div className="w-14 h-14 rounded-xl bg-slate-900 shrink-0 overflow-hidden border border-slate-800">
                          {post.featuredImage ? (
                            <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-cyan-400/40">
                              <span className="material-symbols-outlined text-sm">feed</span>
                            </div>
                          )}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 line-clamp-2 transition-colors">
                            {post.title}
                          </h4>
                          <span className="text-[10px] font-mono text-slate-500">
                            {new Date(post.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags Cloud */}
              {tags.length > 0 && (
                <div className="p-6 rounded-[22px] bg-[#0a1426]/90 border border-cyan-500/25 shadow-lg backdrop-blur-xl">
                  <h3 className="text-sm font-bold font-['Sora'] text-white uppercase tracking-wider mb-3">
                    Popular Topics
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {tags.map((tg) => (
                      <button
                        key={tg._id || tg.name}
                        onClick={() => {
                          setSelectedTag(selectedTag === tg.name ? "" : tg.name);
                          setPage(1);
                        }}
                        className={`text-[11px] font-mono px-2.5 py-1 rounded-lg border transition-all ${
                          selectedTag === tg.name
                            ? "bg-cyan-500 text-slate-950 font-bold border-cyan-400"
                            : "bg-slate-900/80 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white"
                        }`}
                      >
                        #{tg.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

            </aside>
          </div>
        </div>
      </main>

      <HomePageFooter />
    </div>
  );
};

export default BlogsPage;