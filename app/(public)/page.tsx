import connectDB from '@/lib/mongodb';
import Section from '@/models/Section';
import { notFound } from 'next/navigation';

// --- Step 1: Import all your section components ---
import CuratedCollection from "@/components/CuratedCollection";
import HeroSection from "@/components/HeroSection";
import AboutPage from "@/components/About";
import WhyInvestSection from "@/components/WhyInvestSection";
import PhuketPropertiesSection from "@/components/PhuketPropertiesSection";
import NovaaAdvantageSection from "@/components/NovaaAdvantageSection";
import FaqSection from "@/components/FaqSection"; // Renamed from ClientSection for clarity
import InvestorInsightsSection from "@/components/InvestorInsightsSection";
import Testimonials from "@/components/Testimonials";
// Note: Add any other section components you have here.

// --- Step 2: Create a map to link section types to components ---
// The keys (e.g., 'hero', 'about') MUST match the 'type' field in your database sections.
const sectionComponentMap: { [key: string]: React.ComponentType<any> } = {
  hero: HeroSection,
  'curated-collection': CuratedCollection, // Assuming this is the type slug
  about: AboutPage,
  'why-invest': WhyInvestSection,
  properties: PhuketPropertiesSection,
  'novaa-advantage': NovaaAdvantageSection, // Assuming this is the type slug
  faq: FaqSection,
  testimonials: Testimonials,
  'investor-insights': InvestorInsightsSection,
};

// --- Step 3: Create a server-side function to fetch and sort data ---
async function getHomePageData() {
  try {
    await connectDB();

    // Fetch all active sections for the 'home' page and SORT them by the 'order' field.
    // This is the most critical part.
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

// --- Step 4: Make your page component async and render dynamically ---
export default async function Home() {
  const sections = await getHomePageData();

  if (!sections || sections.length === 0) {
    // You can render a fallback message or a simplified page if no sections are found
    return (
      <main className="flex items-center justify-center h-screen">
        <p>Homepage content is not configured yet.</p>
      </main>
    );
  }

  return (
    <main className="relative overflow-hidden">
      {sections.map(section => {
        // Find the corresponding component from the map based on the section's type
        const Component = sectionComponentMap[section.type];

        // If a component is found, render it. Otherwise, render nothing.
        // This prevents the page from crashing if a section type has no matching component.
        return Component ? <Component key={section._id} {...section.content} /> : null;
      })}
    </main>
  );
}
