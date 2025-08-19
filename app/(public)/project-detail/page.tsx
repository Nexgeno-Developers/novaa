"use client";

import ProjectHighlights from "@/components/ProjectHighlights";
import Highlights from "@/components/Highlights";
import ModernAmenities from "@/components/ModernAmenities";
import InvestmentPlans from "@/components/InvestmentPlans";
import MasterplanSection from "@/components/MasterplanSection";
import ContactForm from "@/components/ContactForm";
import GatewaySection from "@/components/GatewaySection";
import ProjectHeroSection from "@/components/ProjectHeroSection";

export default function HeroSection() {
  return (
    <>
      <ProjectHeroSection />
      <GatewaySection />
      <ProjectHighlights />
      <Highlights />
      <ModernAmenities />
      <InvestmentPlans />
      <MasterplanSection />
      <ContactForm />
    </>
  );
}
