import React from 'react';
import { Box } from '@mui/material';
import Header from './Header';
import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';
import StatsSection from './StatsSection';
import TestimonialsSection from './TestimonialsSection';
import CTASection from './CTASection';
import HomePageFooter from './HomePageFooter';
import FAQSection from './FAQSection';

const HomePage = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Header />
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <TestimonialsSection />
      <CTASection />
      <FAQSection/>
      <HomePageFooter />
    </Box>
  );
};

export default HomePage;