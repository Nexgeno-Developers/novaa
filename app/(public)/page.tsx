import React from "react";
import connectDB from "@/lib/mongodb";
import Section from "@/models/Section";
import nextDynamic from "next/dynamic";
import { getSectionData } from "@/lib/data/getSectionData";

// Critical components - load immediately (above the fold)
import HeroSection from "@/components/client/HeroSection";

// Non-critical components - lazy load for better performance
const CuratedCollection = nextDynamic(() => import("@/components/client/CuratedCollection"), {
  loading: () => <div className="min-h-[400px]" />,
});
const AboutPage = nextDynamic(() => import("@/components/client/About"), {
  loading: () => <div className="min-h-[400px]" />,
});
const WhyInvestSection = nextDynamic(() => import("@/components/client/WhyInvestSection"), {
  loading: () => <div className="min-h-[400px]" />,
});
const PhuketPropertiesSection = nextDynamic(() => import("@/components/client/PhuketPropertiesSection"), {
  loading: () => <div className="min-h-[400px]" />,
});
const NovaaAdvantageSection = nextDynamic(() => import("@/components/client/NovaaAdvantageSection"), {
  loading: () => <div className="min-h-[400px]" />,
});
const FaqSection = nextDynamic(() => import("@/components/client/FaqSection"), {
  loading: () => <div className="min-h-[400px]" />,
});
const HistoryOfPhuketSection = nextDynamic(() => import("@/components/client/HistoryOfPhuketSection"), {
  loading: () => <div className="min-h-[400px]" />,
});
const InvestorInsightsSection = nextDynamic(() => import("@/components/client/InvestorInsightsSection"), {
  loading: () => <div className="min-h-[400px]" />,
});
const TestimonialsSection = nextDynamic(() => import("@/components/client/Testimonials"), {
  loading: () => <div className="min-h-[400px]" />,
});
const ClientsVideoSection = nextDynamic(() => import("@/components/client/ClientsVideoSection"), {
  loading: () => <div className="min-h-[400px]" />,
});
const CounterSection = nextDynamic(() => import("@/components/client/CounterSection"), {
  loading: () => <div className="min-h-[400px]" />,
});

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

// Enable ISR with revalidation for better performance
export const revalidate = 60; // Revalidate every 60 seconds
export const dynamic = "force-static"; // Ensure the page is statically generated
