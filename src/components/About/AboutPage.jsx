import React from "react";
import Header from "../homepage/Header";
import HomePageFooter from "../homepage/HomePageFooter";
import FAQSection from "../homepage/FAQSection";
import TestimonialSection from "../homepage/TestimonialsSection";
import HeroSection from "./HeroSection";
import HistorySection from "./HistorySection";
import WhoWeAreSection from "./WhoWeareSection";
import WhatWeDoSection from "./WhatWeDoSection";
import MissionSection from "./MissionSection";
import WhyChooseUsSection from "./WhyChooseUsSection";

const AboutPage = () => {
  return (
    <div className="bg-[#080E1B] font-body-md text-on-surface antialiased mesh-glow-bg min-h-screen selection:bg-primary-container selection:text-surface-container-lowest">
      <Header />
      <main className="w-full min-h-screen relative overflow-hidden">
        <div className="flex flex-col w-full relative z-10">
          <HeroSection />
          <HistorySection />
          <WhoWeAreSection />
          <WhatWeDoSection />
          <MissionSection />
          <WhyChooseUsSection />
          <FAQSection />
          <TestimonialSection />
        </div>
      </main>
      <HomePageFooter />
    </div>
  );
};

export default AboutPage;
