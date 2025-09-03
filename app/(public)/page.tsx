import connectDB from '@/lib/mongodb';
import Section from '@/models/Section';

import CuratedCollection from "@/components/client/CuratedCollection";
import HeroSection from "@/components/client/HeroSection";
import AboutPage from "@/components/client/About";
import WhyInvestSection from "@/components/client/WhyInvestSection";
import PhuketPropertiesSection from "@/components/client/PhuketPropertiesSection";
import NovaaAdvantageSection from "@/components/client/NovaaAdvantageSection";
import FaqSection from "@/components/client/FaqSection";
import InvestorInsightsSection from "@/components/client/InvestorInsightsSection";
import {EliteClientsTestimonials} from "@/components/client/Testimonials";

interface SectionContent {
  [key: string]: unknown; 
}

const sectionComponentMap: { [key: string]: React.ComponentType<SectionContent> } = {
  hero: HeroSection,
  'collection': CuratedCollection,
  'about': AboutPage,
  'why-invest': WhyInvestSection,
  'phuket-properties': PhuketPropertiesSection,
  advantage: NovaaAdvantageSection,
  faq: FaqSection,
  testimonials: EliteClientsTestimonials,
  insights: InvestorInsightsSection,
};

async function getHomePageData() {
  try {
    await connectDB();

    // Fetch all active sections for the 'home' page and SORT them by the 'order' field.
    const sections = await Section.find({ pageSlug: 'home', status: 'active' })
      .sort({ order: 1 })
      .lean(); // .lean() improves performance

    return sections;
  } catch (error) {
    console.error("Failed to fetch homepage data:", error);
    // Return an empty array or handle the error as needed
    return [];
  }
}

export default async function Home() {
  const sections = await getHomePageData();

  console.log("Sections" , sections)

  if (!sections || sections.length === 0) {
    return (
      <main className="flex items-center justify-center h-screen">
        <p>Homepage content is not configured yet.</p>
      </main>
    );
  }

  return (
    <main className="relative overflow-hidden">
      {sections.map(section => {
        const Component = sectionComponentMap[section.type];
        // If a component is found, render it. Otherwise, render nothing.
        // This prevents the page from crashing if a section type has no matching component.
        return Component ? <Component key={section._id} {...(section.content.heroSection || section.content)} /> : null;
      })}
    </main>
  );
}
