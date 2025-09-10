import connectDB from "@/lib/mongodb";
import Section from "@/models/Section";
import Category from "@/models/Category"; // Import your Category model
import Project from "@/models/Project"; // Import your Project model
import BreadcrumbsSection from "@/components/client/BreadcrumbsSection";
import ProjectSection from "@/components/client/ProjectSection";

interface SectionContent {
  [key: string]: unknown; 
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const sectionComponentMap: { [key: string]: React.ComponentType<SectionContent> } = {
  breadcrumb: BreadcrumbsSection,
  project: ProjectSection,
};

async function getProjectPageData() {
  try {
    await connectDB();

    // Fetch sections, categories, and projects in parallel
    const [sections, categories, projects] = await Promise.all([
      Section.find({
        pageSlug: "project",
        status: "active",
        "settings.isVisible": true,
      })
        .sort({ order: 1 })
        .lean(),

      Category.find({ isActive: true }).sort({ order: 1 }).lean(),

      Project.find({ isActive: true })
        .populate("category")
        .sort({ order: 1 })
        .lean(),
    ]);

    // Attach project data to project sections
    const sectionsWithData = sections.map((section) => {
      if (section.type === "project") {
        return {
          ...section,
          projectsData: {
            categories,
            projects,
          },
        };
      }
      return section;
    });

    return sectionsWithData;
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
      {sections.map((section) => {
        const Component =
          sectionComponentMap[section.type] ||
          sectionComponentMap[section.slug];

        // Pass project data as props if available
        const componentProps = {
          ...section.content,
          pageSlug: section.pageSlug,
          ...(section.projectsData && { projectsData: section.projectsData }),
        };

        return Component ? (
          <Component key={section._id} {...componentProps} />
        ) : null;
      })}
    </main>
  );
}
