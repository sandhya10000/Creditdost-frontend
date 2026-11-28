import React, { Suspense, lazy } from "react";
import Header from "./Header";
import HeroSection from "./HeroSection";

// Below-the-fold sections are lazy-loaded
const FeaturesSection = lazy(() => import("./FeaturesSection"));
const StatsSection = lazy(() => import("./StatsSection"));
const TestimonialsSection = lazy(() => import("./TestimonialsSection"));
const FAQSection = lazy(() => import("./FAQSection"));
const HomePageFooter = lazy(() => import("./HomePageFooter"));

const SectionFallback = () => <div className="min-h-[120px]" />;

const HomePage = () => {
  return (
    <div className="bg-[#080E1B] font-body-md text-on-surface antialiased mesh-glow-bg min-h-screen selection:bg-primary-container selection:text-surface-container-lowest">
      <Header />
      <main className="w-full min-h-screen relative overflow-hidden">
        <div className="flex flex-col w-full relative z-10">
          <HeroSection />
          <Suspense fallback={<SectionFallback />}>
            <FeaturesSection />
            <StatsSection />
            <TestimonialsSection />
            <FAQSection />
          </Suspense>
        </div>
      </main>
      <Suspense fallback={<SectionFallback />}>
        <HomePageFooter />
      </Suspense>
    </div>
  );
};

export default HomePage;
