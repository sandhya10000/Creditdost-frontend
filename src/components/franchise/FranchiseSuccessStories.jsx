import React, { useState, useEffect } from "react";
import { Grid, Typography, Box, Paper, IconButton } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";

const FranchiseSuccessStories = () => {
  const successStories = [
    {
      name: "Pomi Rani Deb Dutta",
      company: "Pomi Rani Deb Dutta",
      location: "Silchar, Assam",
      content:
        "Credit Dost provides a very structured and professional credit score improvement process. The reporting system and dispute handling are transparent, which helps in building strong client trust.",
      rating: 5,
      avatar: "/images/Poni.jpg",
    },
    {
      name: "Sunil Kumar",
      company: "Aarunee Enterprises",
      location: "Noida",
      content:
        "Working with Credit Dost has helped us offer genuine credit improvement solutions to our clients. The process is clear, ethical, and results are delivered within realistic timelines.",
      rating: 5,
      avatar: "/images/Sunil.jpg",
    },
    {
      name: "Krishna Dhan Shil",
      company: "Varasha Digitalization",
      location: "Agartala, Tripura",
      content:
        "Credit Dost ke solutions practical aur result-oriented hain. Northeast region ke clients ko process clearly samajh aata hai, aur improvement noticeable hota hai.",
      rating: 5,
      avatar: "/images/Krishna.jpg",
    },
    {
      name: "Gopal Rathore",
      company: "Yash Enterprises",
      location: "Chittorgarh–Pratapgarh, Rajasthan",
      content:
        "Credit Dost ka backend support kaafi strong hai. Client onboarding se leke progress tracking tak sab kuch systematic aur transparent hai.",
      rating: 5,
      avatar: "/images/GopalRathore.jpg",
    },
    {
      name: "B. Rasmita Dora",
      company: "Quick Loan Services",
      location: "Bhubaneswar, Odisha",
      content:
        "After associating with Credit Dost, our loan clients are better prepared and more confident. Credit score improvement has directly supported faster loan approvals.",
      rating: 5,
      avatar: "/images/Rasmita.jpg",
    },
    {
      name: "Shruti",
      company: "A Star Credit Financial Services",
      location: "Mumbai",
      content:
        "In a competitive market like Mumbai, Credit Dost stands out because of its professionalism and realistic approach. Clients appreciate the clarity and genuine guidance.",
      rating: 5,
      avatar: "/images/shruti.jpg",
    },
    {
      name: "Pavan Kumar Naini",
      company: "Loanseva Fintechnologies Solutions",
      location: "Hyderabad",
      content:
        "Credit Dost ke credit analysis aur dispute management process kaafi detailed hain. Fintech businesses ke liye yeh ek reliable partner hai.",
      rating: 5,
      avatar: "/images/pavan.jpg",
    },
    {
      name: "Rohit Kumar Jain",
      company: "Jain Insurance Finance E-Mitra Service",
      location: "Kota, Rajasthan",
      content:
        "Credit Dost ke saath kaam karke clients ko credit score ke basics samjhana easy ho gaya hai. Improvement process transparent hai aur over-promising bilkul nahi hoti.",
      rating: 5,
      avatar: "/images/Rohit.jpg",
    },
    {
      name: "Chaturbhuj",
      company: "Loyal Business Services",
      location: "Dhanbad, Jharkhand",
      content:
        "Credit Dost follows an ethical and compliance-driven approach. Clients get honest guidance, which helps in long-term credibility and repeat business.",
      rating: 5,
      avatar: "/images/Chaturbhuj.jpg",
    },
    {
      name: "Dharmendra Baghel",
      company: "Baghel and Poorna Associate",
      location: "Raipur, Chhattisgarh",
      content:
        "Credit Dost ke professional documentation aur clear communication ne client trust ko kaafi strong banaya hai. Service quality consistently good rahi hai.",
      rating: 5,
      avatar: "/images/dharmendra bhagel.jpg",
    },
    {
      name: "M. Vinay Arun Kumar",
      location: "Hyderabad, Telangana",
      content:
        "Partnering with Credit Dost has added real value to our financial services. The credit improvement journey is systematic, measurable, and client-friendly.",
      rating: 5,
      avatar: "/images/M Vinay Arun.jpg",
    },
  ];

  const TestimonialCard = (props) => (
    <Paper
      elevation={0}
      sx={{
        padding: "25px",
        borderRadius: "20px",
        background: "linear-gradient(135deg, #e8f5e9 0%, #e3f2fd 100%)",
        border: "1px solid #c8e6c9",
        position: "relative",
        height: "100%",
        boxShadow: "0 15px 30px rgba(0, 0, 0, 0.05)",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
        },
        "&::before": {
          content: '"“"',
          position: "absolute",
          top: 20,
          left: 20,
          fontSize: "4rem",
          color: "#4caf50",
          opacity: 0.2,
          fontFamily: "Georgia, serif",
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, mb: 2 }}>
        <Box
          component="img"
          src={props.avatar}
          alt={props.name}
          sx={{
            width: 60,
            height: 60,
            borderRadius: "50%",
            objectFit: "cover",
            border: "3px solid white",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        />
        <Box>
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, color: "#1a237e", mb: 0.5 }}
          >
            {props.name}
          </Typography>
          {props.company && (
            <Typography
              variant="body2"
              sx={{ color: "#4caf50", fontWeight: 600, mb: 0.5 }}
            >
              {props.company}
            </Typography>
          )}
          <Typography variant="body2" sx={{ color: "#666" }}>
            {props.location}
          </Typography>
        </Box>
      </Box>
      <Typography
        variant="body1"
        sx={{
          color: "#333",
          fontStyle: "normal",
          lineHeight: 1.6,
          mt: 3,
          pl: 3,
        }}
      >
        {props.content}
      </Typography>
    </Paper>
  );

  const [currentSlide, setCurrentSlide] = useState(0);
  const slidesPerPage = 2; // Show 2 slides at a time
  const maxSlides = Math.ceil(successStories.length / slidesPerPage) - 1;

  // Auto-scroll functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev < maxSlides ? prev + 1 : 0));
    }, 5000); // Auto-scroll every 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [maxSlides]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev < maxSlides ? prev + 1 : 0));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : maxSlides));
  };

  // Group stories into pairs
  const groupedStories = [];
  for (let i = 0; i < successStories.length; i += slidesPerPage) {
    groupedStories.push(successStories.slice(i, i + slidesPerPage));
  }

  return (
    <Box sx={{ py: 6, position: "relative" }}>
      <Box sx={{ overflow: "hidden", mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            transition: "transform 0.5s ease-in-out",
            transform: `translateX(-${currentSlide * 100}%)`,
          }}
        >
          {groupedStories.map((pair, slideIndex) => (
            <Box
              key={slideIndex}
              sx={{
                flex: "0 0 100%",
                display: "flex",
                gap: 2,
                px: 1,
                boxSizing: "border-box",
              }}
            >
              {pair.map((story, storyIndex) => (
                <Box
                  key={storyIndex}
                  sx={{
                    flex: {
                      xs: "0 0 100%", // optional, for extra small screens
                      sm: "0 0 100%", // 1 item
                      md: "0 0 calc(50% - 8px)", // 2 items
                    },
                  }}
                >
                  <TestimonialCard {...story} />
                </Box>
              ))}
            </Box>
          ))}
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
        }}
      >
        <IconButton
          onClick={prevSlide}
          sx={{
            backgroundColor: "white",
            border: "1px solid #ddd",
            "&:hover": {
              backgroundColor: "#f5f5f5",
            },
          }}
        >
          <ChevronLeft />
        </IconButton>

        <Box sx={{ display: "flex", gap: 1 }}>
          {Array.from({ length: maxSlides + 1 }).map((_, index) => (
            <Box
              key={index}
              sx={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                backgroundColor: currentSlide === index ? "#4caf50" : "#e0e0e0",
                cursor: "pointer",
                transition: "background-color 0.3s",
                "&:hover": {
                  backgroundColor:
                    currentSlide === index ? "#4caf50" : "#bdbdbd",
                },
              }}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </Box>

        <IconButton
          onClick={nextSlide}
          sx={{
            backgroundColor: "white",
            border: "1px solid #ddd",
            "&:hover": {
              backgroundColor: "#f5f5f5",
            },
          }}
        >
          <ChevronRight />
        </IconButton>
      </Box>
    </Box>
  );
};

export default FranchiseSuccessStories;
