import connectDB from '@/lib/mongodb';
import Section from '@/models/Section';
import BreadcrumbsSection from '@/components/client/BreadcrumbsSection';
import BlogSection from '@/components/client/BlogSection';

const sectionComponentMap: { [key: string]: React.ComponentType<any> } = {
  breadcrumb: BreadcrumbsSection,
  blog: BlogSection, // Add the blog section component
  // Add more Blog section components as needed
};

async function getBlogPageData() {
  try {
    await connectDB();

    // Fetch all active sections for the 'blog' page and sort them by order
    const sections = await Section.find({ 
      pageSlug: 'blog', 
      status: 'active',
      'settings.isVisible': true  // Only fetch visible sections
    })
      .sort({ order: 1 })
      .lean();

    return sections;
  } catch (error) {
    console.error("Failed to fetch blog page data:", error);
    return [];
  }
}

export default async function BlogPage() {
  const sections = await getBlogPageData();

  console.log("Blog Sections:", sections);

  if (!sections || sections.length === 0) {
    return (
      <main className="flex items-center justify-center h-screen">
        <p>Blog content is not configured yet.</p>
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