import connectDB from '@/lib/mongodb';
import Section from '@/models/Section';
import BreadcrumbsSection from '@/components/client/BreadcrumbsSection';
import ProjectSection from '@/components/client/ProjectSection';

const sectionComponentMap: { [key: string]: React.ComponentType<any> } = {
  breadcrumb: BreadcrumbsSection,
  project: ProjectSection, // This maps to the "project" type our seed data
  // Add more project section components as needed
};

async function getProjectPageData() {
  try {
    await connectDB();

    // Fetch all active sections for the 'project' page and sort them by order
    const sections = await Section.find({ 
      pageSlug: 'project', 
      status: 'active',
      'settings.isVisible': true  // Only fetch visible sections
    })
      .sort({ order: 1 })
      .lean();

    return sections;
  } catch (error) {
    console.error("Failed to fetch project page data:", error);
    return [];
  }
}

export default async function ProjectPage() {
  const sections = await getProjectPageData();

  console.log("Project Sections:", sections);

  if (!sections || sections.length === 0) {
    return (
      <main className="flex items-center justify-center h-screen">
        <p>Project content is not configured yet.</p>
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