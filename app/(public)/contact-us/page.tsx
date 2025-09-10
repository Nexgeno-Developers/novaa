import connectDB from '@/lib/mongodb';
import Section from '@/models/Section';
import BreadcrumbsSection from '@/components/client/BreadcrumbsSection';
import ContactSection from '@/components/client/ContactSection';
import { getSectionData } from '@/lib/data/getSectionData';

interface SectionContent {
  [key: string]: unknown; 
}

const sectionComponentMap: { [key: string]: React.ComponentType<SectionContent> } = {
  breadcrumb: BreadcrumbsSection,
  contact: ContactSection,
  // Add more Contact Us section components as needed
};

// async function getContactPageData() {
//   try {
//     await connectDB();

//     // Fetch all active sections for the 'contact-us' page and sort them by order
//     const sections = await Section.find({ 
//       pageSlug: 'contact-us', 
//       status: 'active',
//       'settings.isVisible': true  // Only fetch visible sections
//     })
//       .sort({ order: 1 })
//       .lean();

//     return sections;
//   } catch (error) {
//     console.error("Failed to fetch contact page data:", error);
//     return [];
//   }
// }

export default async function ContactUsPage() {
  const sections = await getSectionData('contact-us');

  console.log("Contact Us Sections:", sections);

  if (!sections || sections.length === 0) {
    return (
      <main className="flex items-center justify-center h-screen">
        <p>Contact Us content is not configured yet.</p>
      </main>
    );
  }

  return (
    <main className="relative">
      {sections.map(section => {
        const Component = sectionComponentMap[section.type] || sectionComponentMap[section.slug];
        // If a component is found, render it. Otherwise, render nothing.
        return Component ? <Component key={section._id} {...section.content} pageSlug={section.pageSlug} /> : null;
      })}
    </main>
  );
}