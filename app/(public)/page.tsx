import connectDB from '@/lib/mongodb';
import Section from '@/models/Section';
import { unstable_cache } from 'next/cache';

import CuratedCollection from "@/components/client/CuratedCollection";
import HeroSection from "@/components/client/HeroSection";
import AboutPage from "@/components/client/About";
import WhyInvestSection from "@/components/client/WhyInvestSection";
import PhuketPropertiesSection from "@/components/client/PhuketPropertiesSection";
import NovaaAdvantageSection from "@/components/client/NovaaAdvantageSection";
import FaqSection from "@/components/client/FaqSection";
import InvestorInsightsSection from "@/components/client/InvestorInsightsSection";
import TestimonialsSection from "@/components/client/Testimonials";
import { getSectionData } from '@/lib/data/getSectionData';

// Define proper TypeScript interfaces based on your Section model
interface SectionContent {
  [key: string]: any; // Mixed type from Mongoose
}

interface Section {
  _id: string;
  name: string;
  slug: string;
  type: string;
  order: number;
  pageSlug: string;
  component: string;
  status: 'active' | 'inactive';
  settings: {
    isVisible: boolean;
    backgroundColor?: string;
    padding?: string;
    margin?: string;
    customCSS?: string;
    animation?: string;
  };
  content: SectionContent;
  createdAt: Date;
  updatedAt: Date;
}

const sectionComponentMap: { [key: string]: React.ComponentType<SectionContent> } = {
  hero: HeroSection,
  'collection': CuratedCollection,
  'about': AboutPage,
  'why-invest': WhyInvestSection,
  'phuket-properties': PhuketPropertiesSection,
  "advantage": NovaaAdvantageSection,
  faq: FaqSection,
  testimonials: TestimonialsSection,
  insights: InvestorInsightsSection,
};

export default async function Home() {
  const sections: Section[] = await getSectionData('home');

  console.log("Sections", sections);

  if (!sections || sections.length === 0) {
    return (
      <main className="flex items-center justify-center h-screen">
        <p>Homepage content is not configured yet.</p>
      </main>
    );
  }

  return (
    <main className="relative overflow-hidden">
      {sections.map((section: Section) => {
        const Component = sectionComponentMap[section.type];
        console.log("Component", Component);
        console.log("Section type", section.type);
        
        // If a component is found, render it. Otherwise, render nothing.
        return Component ? (
          <Component 
            key={section._id} 
            {...(section.content.heroSection || section.content)} 
          />
        ) : null;
      })}
    </main>
  );
}