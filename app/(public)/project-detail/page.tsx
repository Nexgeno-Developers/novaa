"use client";

import ProjectHighlights from "@/components/client/ProjectHighlights";
import Highlights from "@/components/client/Highlights";
import ModernAmenities from "@/components/client/ModernAmenities";
import InvestmentPlans from "@/components/client/InvestmentPlans";
import MasterplanSection from "@/components/client/MasterplanSection";
import ContactForm from "@/components/client/ContactForm";
import GatewaySection from "@/components/client/GatewaySection";
import ProjectHeroSection from "@/components/client/ProjectHeroSection";

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
