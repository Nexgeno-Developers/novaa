import React from "react";
import connectDB from "@/lib/mongodb";
import Section from "@/models/Section";

import CuratedCollection from "@/components/client/CuratedCollection";
import HeroSection from "@/components/client/HeroSection";
import AboutPage from "@/components/client/About";
import WhyInvestSection from "@/components/client/WhyInvestSection";
import PhuketPropertiesSection from "@/components/client/PhuketPropertiesSection";
import NovaaAdvantageSection from "@/components/client/NovaaAdvantageSection";
import FaqSection from "@/components/client/FaqSection";
import HistoryOfPhuketSection from "@/components/client/HistoryOfPhuketSection";
import InvestorInsightsSection from "@/components/client/InvestorInsightsSection";
import TestimonialsSection from "@/components/client/Testimonials";
import ClientsVideoSection from "@/components/client/ClientsVideoSection";
import { getSectionData } from "@/lib/data/getSectionData";
import CounterSection from "@/components/client/CounterSection";

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
  status: "active" | "inactive";
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

const sectionComponentMap: {
  [key: string]: React.ComponentType<SectionContent>;
} = {
  hero: HeroSection,
  collection: CuratedCollection,
  about: AboutPage,
  "why-invest": WhyInvestSection,
  "phuket-properties": PhuketPropertiesSection,
  advantage: NovaaAdvantageSection,
  faq: FaqSection,
  "history-of-phuket": HistoryOfPhuketSection,
  counter: CounterSection,
  testimonials: TestimonialsSection,

  insights: InvestorInsightsSection,
};

export default async function Home() {
  const sections: Section[] = await getSectionData("home");

  if (!sections || sections.length === 0) {
    return (
      <main className="flex items-center justify-center h-screen">
        <p>Homepage content is not configured yet.</p>
      </main>
    );
  }

  return (
    <main className="relative overflow-hidden">
      {sections.map((section: Section, index: number) => {
        const Component = sectionComponentMap[section.type];

        // console.log("Section:", section);

        // If a component is found, render it. Otherwise, render nothing.
        const sectionElement = Component ? (
          <Component
            key={section._id}
            {...(section.content.heroSection || section.content)}
          />
        ) : null;

        // Check if this is the FAQ section and insert History of Phuket after it
        if (section.type === "faq") {
          return (
            <React.Fragment key={`${section._id}-with-history`}>
              {sectionElement}
              <HistoryOfPhuketSection />
              <ClientsVideoSection />
            </React.Fragment>
          );
        }

        // Check if this is the Counter section and insert it after ClientsVideoSection
        // if (section.type === "counter") {
        //   return (
        //     <React.Fragment key={`${section._id}-counter`}>
        //       {sectionElement}
        //     </React.Fragment>
        //   );
        // }

        return sectionElement;
      })}
    </main>
  );
}

// Enable ISR with revalidation
// This allows the page to be regenerated in the background
export const revalidate = 30; // Revalidate every 30 seconds
export const dynamic = "force-static"; // Ensure the page is statically generated
