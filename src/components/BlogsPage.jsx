import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Chip,
  Pagination,
  CircularProgress,
  TextField,
  InputAdornment,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
} from "@mui/material";
import {
  Search as SearchIcon,
  Person as PersonIcon,
  Comment as CommentIcon,
  ArrowForward as ArrowForwardIcon,
  PlayArrow as PlayArrowIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { blogAPI } from "../services/api";
import Header from "./homepage/Header";
import HomePageFooter from "./homepage/HomePageFooter";

const BlogsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(parseInt(searchParams.get('page')) || 1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || "");
  const [recentPosts, setRecentPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || "");
  const [selectedTag, setSelectedTag] = useState(searchParams.get('tag') || "");
  const navigate = useNavigate();

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      
      // Update URL parameters
      const params = new URLSearchParams();
      if (page > 1) params.set('page', page);
      if (searchQuery) params.set('search', searchQuery);
      if (selectedCategory) params.set('category', selectedCategory);
      if (selectedTag) params.set('tag', selectedTag);
      setSearchParams(params);
      
      const response = await blogAPI.getAllBlogs({
        page,
        limit: 10,
        status: "published",
        search: searchQuery,
        category: selectedCategory,
        tag: selectedTag,
      });

      setBlogs(response.data.blogs);
      setTotalPages(response.data.totalPages);
      setRecentPosts(response.data.blogs.slice(0, 3));
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await blogAPI.getBlogCategories();
      setCategories(response.data.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await blogAPI.getBlogTags();
      setTags(response.data.tags);
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  useEffect(() => {
    fetchBlogs();
    fetchCategories();
    fetchTags();
  }, [page, searchQuery, selectedCategory, selectedTag]);

  // Handle URL parameter changes
  useEffect(() => {
    const urlPage = parseInt(searchParams.get('page')) || 1;
    const urlSearch = searchParams.get('search') || "";
    const urlCategory = searchParams.get('category') || "";
    const urlTag = searchParams.get('tag') || "";
    
    setPage(urlPage);
    setSearchQuery(urlSearch);
    setSelectedCategory(urlCategory);
    setSelectedTag(urlTag);
  }, [searchParams]);

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: date.toLocaleDateString("en-US", { month: "short" }),
    };
  };

  const handleCategoryClick = (categoryName) => {
    // When selecting a category, clear the tag filter
    setSelectedCategory(selectedCategory === categoryName ? "" : categoryName);
    if (selectedCategory === categoryName) {
      setSelectedTag("");
    }
  };

  const handleTagClick = (tagName) => {
    // When selecting a tag, clear the category filter
    setSelectedTag(selectedTag === tagName ? "" : tagName);
    if (selectedTag === tagName) {
      setSelectedCategory("");
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedTag("");
    setPage(1);
    // Clear URL parameters
    setSearchParams({});
  };

  return (
    <Box sx={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      {/* Hero Section */}
      <Header />
      <Box
        sx={{
          background: "linear-gradient(135deg, #1e3a5f 0%, #2c5282 100%)",
          color: "white",
          py: 12,
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0L50 50L0 100' fill='none' stroke='rgba(255,255,255,0.05)' stroke-width='2'/%3E%3Cpath d='M50 0L100 50L50 100' fill='none' stroke='rgba(255,255,255,0.05)' stroke-width='2'/%3E%3C/svg%3E\")",
            opacity: 0.3,
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: "2.5rem", md: "3.5rem" },
                  mb: 2,
                }}
              >
                Blogs
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: { xs: "left", md: "right" } }}>
                <Typography variant="body1" sx={{ display: "inline", mr: 1 }}>
                  Home
                </Typography>
                <ArrowForwardIcon
                  sx={{ fontSize: "1rem", verticalAlign: "middle", mx: 1 }}
                />
                <Typography
                  variant="body1"
                  sx={{ display: "inline", fontWeight: 600 }}
                >
                  Blog Classic
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Main Content */}
      <Container sx={{ py: 8 }} style={{ maxWidth: "1300px" }}>
        {loading ? (
          <Box display="flex" justifyContent="center" my={8}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid
            container
            spacing={4}
            style={{ flexWrap: "nowrap" }}
            sx={{ flexDirection: { md: "row", xs: "column" } }}
          >
            {/* Blog Posts */}
            <Grid item xs={12} md={8} style={{ flex: "1" }}>
              {blogs.map((blog) => {
                const date = formatDate(blog.createdAt);
                return (
                  <Card
                    key={blog._id}
                    sx={{
                      mb: 4,
                      boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                      borderRadius: 2,
                      overflow: "hidden",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        boxShadow: "0 8px 25px rgba(0,0,0,0.12)",
                        transform: "translateY(-4px)",
                      },
                    }}
                  >
                    <Box sx={{ position: "relative" }}>
                      {blog.featuredImage && (
                        <CardMedia
                          component="img"
                          image={blog.featuredImage}
                          alt={blog.title}
                          sx={{
                            objectFit: { md: "cover", xs: "contain" },
                            maxHeight: "400px",
                          }}
                        />
                      )}

                      {/* Video Play Button (if applicable) */}
                      {blog.hasVideo && (
                        <Box
                          sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            backgroundColor: "white",
                            borderRadius: "50%",
                            width: 80,
                            height: 80,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              transform: "translate(-50%, -50%) scale(1.1)",
                            },
                          }}
                        >
                          <PlayArrowIcon
                            sx={{ fontSize: 40, color: "#0891b2" }}
                          />
                        </Box>
                      )}
                    </Box>

                    <CardContent sx={{ p: 4 }}>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2, alignItems: "center" }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <PersonIcon
                            sx={{ fontSize: 18, color: "text.secondary" }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            By Credit Dost
                          </Typography>
                        </Box>
                        
                        {/* Date Box */}
                        <Box
                          sx={{
                            backgroundColor: "white",
                            borderRadius: 1,
                            px: 2,
                            py: 1,
                            textAlign: "center",
                            minWidth: 60,
                            boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
                            border: "1px solid #e0e0e0",
                          }}
                        >
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 700,
                              color: "#0891b2",
                              lineHeight: 1,
                              fontSize: "1rem",
                            }}
                          >
                            {date.day} {date.month}
                          </Typography>
                        </Box>
                        
                        {/* Category */}
                        {blog.categories && blog.categories.length > 0 && (
                          <Chip
                            label={blog.categories[0]}
                            size="small"
                            sx={{
                              backgroundColor: "#e3f2fd",
                              color: "#0891b2",
                              fontWeight: 600,
                              height: "24px",
                            }}
                          />
                        )}
                      </Box>

                      <Typography
                        variant="h4"
                        sx={{
                          fontWeight: 700,
                          fontSize: { xs: "1.5rem", md: "2rem" },
                          mb: 2,
                          color: "#1e3a5f",
                          cursor: "pointer",
                          "&:hover": {
                            color: "#0891b2",
                          },
                        }}
                        onClick={() => navigate(`/blog/${blog.slug}`)}
                      >
                        {blog.title}
                      </Typography>

                      <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ mb: 3, lineHeight: 1.8 }}
                        dangerouslySetInnerHTML={{
                          __html: blog.excerpt || 
                            blog.content?.substring(0, 200) + "..."
                        }}
                      />

                      <Button
                        variant="text"
                        endIcon={<ArrowForwardIcon />}
                        sx={{
                          color: "#0891b2",
                          fontWeight: 600,
                          textTransform: "none",
                          fontSize: "1rem",
                          "&:hover": {
                            backgroundColor: "transparent",
                            color: "#06b6d4",
                          },
                        }}
                        onClick={() => navigate(`/blog/${blog.slug}`)}
                      >
                        Read More
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}

              {blogs.length === 0 && !loading && (
                <Box textAlign="center" py={8}>
                  <Typography variant="h6" color="text.secondary">
                    No blogs found
                  </Typography>
                </Box>
              )}

              {totalPages > 1 && (
                <Box display="flex" justifyContent="center" mt={4}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    size="large"
                    sx={{
                      "& .MuiPaginationItem-root": {
                        borderRadius: 1,
                        fontWeight: 600,
                      },
                    }}
                  />
                </Box>
              )}
            </Grid>

            {/* Sidebar */}
            <Grid item xs={12} md={4} style={{ flex: "0.6" }}>
              {/* Search */}
              <Paper
                sx={{
                  p: 3,
                  mb: 4,
                  borderRadius: 2,
                  boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  Search
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Search..."
                  variant="outlined"
                  size="small"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton>
                          <SearchIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                {(searchQuery || selectedCategory || selectedTag) && (
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={clearFilters}
                    sx={{ mt: 2 }}
                  >
                    Clear Filters
                  </Button>
                )}
              </Paper>

              {/* Categories */}
              <Paper
                sx={{
                  p: 3,
                  mb: 4,
                  borderRadius: 2,
                  boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  Categories
                </Typography>
                <List disablePadding>
                  {categories.map((category, index) => (
                    <ListItem
                      key={index}
                      disableGutters
                      sx={{
                        py: 1.5,
                        borderBottom:
                          index < categories.length - 1
                            ? "1px solid #eee"
                            : "none",
                        cursor: "pointer",
                        backgroundColor:
                          selectedCategory === category.name
                            ? "#e3f2fd"
                            : "transparent",
                        "&:hover": {
                          color: "#0891b2",
                          backgroundColor:
                            selectedCategory === category.name
                              ? "#bbdefb"
                              : "#f5f5f5",
                        },
                      }}
                      onClick={() => handleCategoryClick(category.name)}
                    >
                      <ArrowForwardIcon
                        sx={{ fontSize: 16, mr: 1, color: "#0891b2" }}
                      />
                      <ListItemText
                        primary={category.name}
                        primaryTypographyProps={{
                          variant: "body2",
                          fontWeight: 500,
                        }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        ({category.count || 0})
                      </Typography>
                    </ListItem>
                  ))}
                </List>
              </Paper>

              {/* Tags */}
              <Paper
                sx={{
                  p: 3,
                  mb: 4,
                  borderRadius: 2,
                  boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  Tags
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag.name || tag}
                      variant={selectedTag === (tag.name || tag) ? "filled" : "outlined"}
                      color="primary"
                      clickable
                      onClick={() => handleTagClick(tag.name || tag)}
                      sx={{
                        mb: 1,
                        borderColor: selectedTag === (tag.name || tag) ? "transparent" : "rgba(0,0,0,0.23)",
                        backgroundColor: selectedTag === (tag.name || tag) ? "rgba(8, 145, 178, 0.1)" : "inherit",
                        "&:hover": {
                          backgroundColor: selectedTag === (tag.name || tag) ? "rgba(8, 145, 178, 0.2)" : "rgba(0,0,0,0.04)",
                        },
                      }}
                    />
                  ))}
                </Box>
              </Paper>

              {/* Recent Posts */}
              <Paper
                sx={{
                  p: 3,
                  mb: 4,
                  borderRadius: 2,
                  boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  Recent Post
                </Typography>
                <List disablePadding>
                  {recentPosts.map((post, index) => {
                    const date = formatDate(post.createdAt);
                    return (
                      <ListItem
                        key={index}
                        disableGutters
                        sx={{
                          py: 2,
                          borderBottom:
                            index < recentPosts.length - 1
                              ? "1px solid #eee"
                              : "none",
                          cursor: "pointer",
                          display: "flex",
                          gap: 2,
                          alignItems: "flex-start",
                        }}
                        onClick={() => navigate(`/blog/${post.slug}`)}
                      >
                        {post.featuredImage && (
                          <Box
                            component="img"
                            src={post.featuredImage}
                            alt={post.title}
                            sx={{
                              width: 70,
                              height: 70,
                              objectFit: "cover",
                              borderRadius: 1,
                              flexShrink: 0,
                            }}
                          />
                        )}
                        <Box>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 600,
                              color: "#1e3a5f",
                              mb: 0.5,
                              "&:hover": {
                                color: "#0891b2",
                              },
                            }}
                          >
                            {post.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {date.month} {date.day},{" "}
                            {new Date(post.createdAt).getFullYear()}
                          </Typography>
                        </Box>
                      </ListItem>
                    );
                  })}
                </List>
              </Paper>

              {/* Quote Widget */}
            </Grid>
          </Grid>
        )}
      </Container>
      <HomePageFooter />
    </Box>
  );
};

export default BlogsPage;
