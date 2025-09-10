import connectDB from "@/lib/mongodb";
import Section from "@/models/Section";
import BreadcrumbsSection from "@/components/client/BreadcrumbsSection";
import OurStorySection from "@/components/client/OurStorySection";
import { getSectionData } from "@/lib/data/getSectionData";

interface SectionContent {
  [key: string]: unknown;
}

// export const dynamic = "force-dynamic";
// export const revalidate = 0;

const sectionComponentMap: {
  [key: string]: React.ComponentType<SectionContent>;
} = {
  breadcrumb: BreadcrumbsSection,
  "our-story": OurStorySection,
};

// async function getAboutPageData() {
//   try {
//     await connectDB();

//     // Fetch all active sections for the 'about-us' page and sort them by order
//     const sections = await Section.find({
//       pageSlug: "about-us",
//       status: "active",
//       "settings.isVisible": true, // Only fetch visible sections
//     })
//       .sort({ order: 1 })
//       .lean();

//     return sections;
//   } catch (error) {
//     console.error("Failed to fetch about page data:", error);
//     return [];
//   }
// }

export default async function AboutUsPage() {
  const sections = await getSectionData("about-us");

  console.log("About Us Sections:", sections);

  if (!sections || sections.length === 0) {
    return (
      <main className="flex items-center justify-center h-screen">
        <p>About Us content is not configured yet.</p>
      </main>
    );
  }

  return (
    <main className="relative">
      {sections.map((section) => {
        const Component =
          sectionComponentMap[section.type] ||
          sectionComponentMap[section.slug];
        // If a component is found, render it. Otherwise, render nothing.
        return Component ? (
          <Component
            key={section._id}
            {...section.content}
            pageSlug={section.pageSlug}
          />
        ) : null;
      })}
    </main>
  );
}
