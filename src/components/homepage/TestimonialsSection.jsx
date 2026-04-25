import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Avatar, IconButton, useTheme } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos, Star, StarBorder } from '@mui/icons-material';

const testimonials = [
  {
    name: 'Amit Verma',
    role: 'Delhi',
    content: "I started with Credit Dost as a side activity while doing my regular job. I had no background in credit repair. The training was simple and practical. Within a few months, I started getting regular clients, and today this is my primary source of income. What I like most is the continuous support—someone is always there to guide you.",
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop'
  },
  {
    name: 'Pooja Sharma',
    role: 'Jaipur',
    content: "People come to me after loan rejections and broken confidence. Through Credit Dost, I learned how to correctly analyse credit reports and guide customers ethically. It's not just about earning money; it's about solving real problems. That's why referrals come naturally.",
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop'
  },
  {
    name: 'Rakesh Singh',
    role: 'Patna',
    content: "I already worked as a loan agent, but many cases were getting rejected due to low CIBIL scores. Partnering with Credit Dost helped me convert those rejected cases into opportunities. Now, I don't lose customers—I help them fix their profile and then get loans approved.",
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop'
  },
  {
    name: 'Neha Kapoor',
    role: 'Mumbai',
    content: "What I appreciated most was the transparency. There were no fake income promises. I was told clearly—results depend on effort and consistency. The systems, training, and tools are strong, but you still have to work. That honesty gave me confidence to join.",
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=400&h=400&fit=crop'
  }
];

const TestimonialSection = () => {
  const theme = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const getVisibleTestimonials = () => {
    const visible = [];
    for (let i = 0; i < 2; i++) {
      visible.push(testimonials[(currentIndex + i) % testimonials.length]);
    }
    return visible;
  };

  return (
    <Box sx={{ 
      position: 'relative',
     
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%)',
      display: 'flex',
      alignItems: 'center',
      py: 7
    }}>
      {/* Animated Background Elements */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '50%',
        height: '100%',
        background: 'linear-gradient(135deg, #0891b2 0%, #0e7490 100%)',
        clipPath: 'polygon(30% 0, 100% 0, 100% 100%, 0% 100%)',
        zIndex: 0,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: '300px',
          height: '300px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '50%',
          animation: 'float 6s ease-in-out infinite'
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: '15%',
          right: '15%',
          width: '200px',
          height: '200px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '50%',
          animation: 'float 8s ease-in-out infinite reverse'
        },
        '@keyframes float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-30px)' }
        }
      }} />

      {/* Scroll to Top Button */}
     

      <Container sx={{ position: 'relative', zIndex: 1 }} style={{ maxWidth: '1400px' }}>
        {/* Header */}
        <Box sx={{ mb: 6 }}>
          <Typography sx={{
            color: '#0891b2',
            fontSize: '14px',
            fontWeight: 600,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            mb: 2,
            textAlign: 'left',
            [theme.breakpoints.down('sm')]: {
              fontSize: '12px',
              letterSpacing: '1.5px',
              textAlign: 'center',
            }
          }}>
            TESTIMONIALS
          </Typography>
          <Typography sx={{
            fontSize: "2.5rem",
            fontWeight: 800,
            color: '#1e293b',
            lineHeight: 1.2,
            maxWidth: '600px',
            textAlign: 'center',
            [theme.breakpoints.down('sm')]: {
              fontSize: '1.75rem',
              textAlign: 'center',
            },
            [theme.breakpoints.down('xs')]: {
              fontSize: '1.5rem',
            }
          }}>
            Real people. Real journeys. Real results.
          </Typography>
        </Box>

        {/* Testimonial Cards Container */}
        <Box sx={{ position: 'relative' }}>
          <Box sx={{
            display: 'flex',
            gap: 3,
            transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: `translateX(0)`
          }}>
            {getVisibleTestimonials().map((testimonial, idx) => (
              <Box key={idx} sx={{
                minWidth: { xs: '100%', md: 'calc(50% - 12px)' },
                bgcolor: idx === 0 ? '#f8fafc' : '#fed7aa',
                borderRadius: '16px',
                p: 4,
                display: 'flex',
                gap: 3,
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
                transition: 'all 0.6s ease',
                opacity: 1,
                animation: 'slideIn 0.6s ease-out'
              }}>
                {/* Avatar */}
                {/* <Avatar src={testimonial.avatar} sx={{
                  width: 160,
                  height: 160,
                  borderRadius: '12px',
                  flexShrink: 0
                }} /> */}

                {/* Content */}
                <Box sx={{ flex: 1, position: 'relative' }}>
                  {/* Stars */}
                  <Box sx={{ display: 'flex', gap: 0.5, mb: 2 }}>
                    {[...Array(5)].map((_, i) => (
                      i < testimonial.rating ? 
                        <Star key={i} sx={{ color: '#fbbf24', fontSize: '20px' }} /> :
                        <StarBorder key={i} sx={{ color: '#fbbf24', fontSize: '20px' }} />
                    ))}
                  </Box>

                  {/* Text */}
                  <Typography sx={{
                    fontSize: '16px',
                    color: '#475569',
                    lineHeight: 1.7,
                    mb: 3
                  }}>
                    {testimonial.content}
                  </Typography>

                  {/* Name and Role */}
                  <Box>
                    <Typography sx={{
                      fontSize: '18px',
                      fontWeight: 700,
                      color: '#1e293b',
                      mb: 0.5
                    }}>
                      {testimonial.name}
                    </Typography>
                    <Typography sx={{
                      fontSize: '14px',
                      color: '#64748b'
                    }}>
                      {testimonial.role}
                    </Typography>
                  </Box>

                  {/* Quote Mark */}
                  <Box sx={{
                    position: 'absolute',
                    bottom: -10,
                    right: 0,
                    fontSize: '120px',
                    color: 'rgba(0, 0, 0, 0.03)',
                    fontFamily: 'Georgia, serif',
                    lineHeight: 1,
                    userSelect: 'none'
                  }}>
                    "
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>

          {/* Navigation Arrows */}
          <IconButton onClick={handlePrev} sx={{
            position: 'absolute',
            left: -60,
            top: '50%',
            transform: 'translateY(-50%)',
            bgcolor: 'white',
            width: 48,
            height: 48,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            '&:hover': {
              bgcolor: '#0891b2',
              color: 'white'
            }
          }}>
            <ArrowBackIos sx={{ ml: 1, fontSize: '20px' }} />
          </IconButton>

          <IconButton onClick={handleNext} sx={{
            position: 'absolute',
            right: -60,
            top: '50%',
            transform: 'translateY(-50%)',
            bgcolor: 'white',
            width: 48,
            height: 48,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            '&:hover': {
              bgcolor: '#0891b2',
              color: 'white'
            }
          }}>
            <ArrowForwardIos sx={{ fontSize: '20px' }} />
          </IconButton>
        </Box>
      </Container>

      <style>
        {`
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
        `}
      </style>
    </Box>
  );
};

export default TestimonialSection;