import React, { Suspense, lazy } from 'react';
import { Box } from '@mui/material';
import Header from './Header';
import HeroSection from './HeroSection';
// Below-the-fold sections are lazy-loaded so first paint only waits for
// Header + Hero. The rest load in parallel right after.
const FeaturesSection = lazy(() => import('./FeaturesSection'));
const StatsSection = lazy(() => import('./StatsSection'));
const TestimonialsSection = lazy(() => import('./TestimonialsSection'));
const CTASection = lazy(() => import('./CTASection'));
const FAQSection = lazy(() => import('./FAQSection'));
const HomePageFooter = lazy(() => import('./HomePageFooter'));

const SectionFallback = () => <Box sx={{ minHeight: 120 }} />;

const HomePage = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Header />
      <HeroSection />
      <Suspense fallback={<SectionFallback />}>
        <FeaturesSection />
        <StatsSection />
        <TestimonialsSection />
        <CTASection />
        <FAQSection />
        <HomePageFooter />
      </Suspense>
    </Box>
  );
};

export default HomePage;
