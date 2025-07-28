// import Navbar from '@/components/Navbar'
// import AboutUsSection from './components/AboutUsSection'
import CuratedCollection from "@/components/CuratedCollection";
import HeroSection from "@/components/HeroSection";
import AboutPage from "@/components/About";
import WhyInvestSection from "@/components/WhyInvestSection";
import PhuketPropertiesSection from "@/components/PhuketPropertiesSection";
import NovaaAdvantageSection from "@/components/NovaaAdvantageSection";
import ClientSection from "@/components/ClientSection";
import InvestSection from "@/components/InvestSection";
import InvestorInsightsSection from "@/components/InvestorInsightsSection";
import Testimonials from "@/components/Testimonials";

export default function Home() {
  return (
    <>
      <main className="relative w-full min-h-screen overflow-hidden">
        <HeroSection />
        <CuratedCollection />
        <AboutPage />
        <WhyInvestSection />
        <PhuketPropertiesSection />
        <NovaaAdvantageSection />
        <ClientSection />
        <InvestSection />
        <InvestorInsightsSection />
        <Testimonials />
      </main>
    </>
  );
}
