import { notFound } from "next/navigation";
import { unstable_cache } from "next/cache";
import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";
import ProjectHeroSection from "@/components/client/ProjectHeroSection";
import ProjectHighlights from "@/components/client/ProjectHighlights";
import Highlights from "@/components/client/Highlights";
import ModernAmenities from "@/components/client/ModernAmenities";
import MasterPlanSection from "@/components/client/MasterplanSection";
import InvestmentPlans from "@/components/client/InvestmentPlans";
import ContactForm from "@/components/ContactForm";
import GatewaySection from "@/components/client/GatewaySection";

// Direct DB function (no cache)
async function getProjectBySlugDirect(slug: string) {
  try {
    await connectDB();
    
    const project = await Project.findOne({ slug, isActive: true })
      .populate("category", "name _id")
      .lean();

    if (!project) {
      return null;
    }

    // Convert BSON to plain object
    const updatedProject = JSON.parse(JSON.stringify(project));

    // Ensure required fields exist with defaults
    updatedProject.images = updatedProject.images || [];
    updatedProject.location = updatedProject.location || '';
    updatedProject.description = updatedProject.description || '';
    updatedProject.badge = updatedProject.badge || '';
    updatedProject.price = updatedProject.price || '';
    updatedProject.categoryName = updatedProject.categoryName || updatedProject.category?.name || '';
    
    // Ensure projectDetail exists with defaults
    if (!updatedProject.projectDetail) {
      updatedProject.projectDetail = {
        hero: {
          backgroundImage: "",
          title: updatedProject.name,
          subtitle: "",
          scheduleMeetingButton: "Schedule a meeting",
          getBrochureButton: "Get Brochure",
          brochurePdf: "",
        },
        projectHighlights: {
          backgroundImage: "",
          description: "",
          highlights: [],
        },
        keyHighlights: {
          backgroundImage: "",
          description: "",
          highlights: [],
        },
        modernAmenities: {
          title: "MODERN AMENITIES FOR A BALANCED LIFESTYLE",
          description: "",
          amenities: [],
        },
        masterPlan: {
          title: "",
          subtitle: "",
          description: "",
          backgroundImage: "",
          tabs: [],
        },
        investmentPlans: {
          title: "LIMITED-TIME INVESTMENT PLANS",
          description: "Secure high returns with exclusive, time-sensitive opportunities.",
          backgroundImage: "",
          plans: [],
        },
        gateway: {
          title: "A place to come home to",
          subtitle: "and a location that",
          highlightText: "holds its value.",
          description: "Set between Layan and Bangtao, this address offers more than scenery.",
          sectionTitle: "Your Gateway to Paradise",
          sectionDescription: "Perfectly positioned where tropical elegance meets modern convenience.",
          backgroundImage: "",
          mapImage: "",
          categories: [],
        },
      };
    }

    return updatedProject;
  } catch (error) {
    console.error("Error fetching project directly:", error);
    return null;
  }
}

// Cached function - will cache until revalidated
const getCachedProjectBySlug = unstable_cache(
  async (slug: string) => {
    console.log(`[CACHE MISS] Fetching fresh data for slug: ${slug}`);
    return await getProjectBySlugDirect(slug);
  },
  [], // Empty dependency array since slug is passed as parameter
  {
    tags: ["projects", "project-details"], // Simple tags for easy revalidation
    revalidate: 86400, // Cache for 24 hours OR until manually revalidated
  }
);

async function getProjectBySlug(slug: string) {
  try {
    console.log(`[REQUEST] Getting project with slug: ${slug}`);
    
    // This will use cache if available, or fetch fresh data and cache it
    const project = await getCachedProjectBySlug(slug);
    
    if (project) {
      console.log(`[CACHE HIT] Found cached project: ${project.name}`);
    }
    
    return project;
  } catch (error) {
    console.error("Error in getProjectBySlug:", error);
    // Fallback to direct query
    return await getProjectBySlugDirect(slug);
  }
}

// Generate static params for known projects
export async function generateStaticParams() {
  try {
    await connectDB();
    const projects = await Project.find({ isActive: true })
      .select("slug")
      .lean();

    return projects.map((project: any) => ({
      slug: project.slug,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  try {
    const { slug } = await params;
    const project = await getProjectBySlug(slug);

    if (!project) {
      return {
        title: "Project Not Found",
        description: "The requested project could not be found.",
      };
    }

    const description = project.description
      .replace(/<[^>]*>/g, "")
      .substring(0, 160);

    return {
      title: `${project.name} - ${project.location} | Real Estate`,
      description,
      openGraph: {
        title: project.name,
        description,
        images: project.images.slice(0, 1),
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Project Details",
      description: "Real estate project details",
    };
  }
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  try {
    const { slug } = await params;
    const project = await getProjectBySlug(slug);

    if (!project) {
      console.log("Project not found, calling notFound()");
      notFound();
    }

    console.log("Successfully loaded project:", project.name);

    return (
      <main className="relative">
        <ProjectHeroSection project={project} />

        {project.projectDetail?.gateway?.categories?.length > 0 && (
          <GatewaySection project={project} />
        )}

        {project.projectDetail?.projectHighlights?.highlights?.length > 0 && (
          <ProjectHighlights project={project} />
        )}

        {project.projectDetail?.keyHighlights?.highlights?.length > 0 && (
          <Highlights project={project} />
        )}

        {project.projectDetail?.modernAmenities?.amenities?.length > 0 && (
          <ModernAmenities project={project} />
        )}

        {project.projectDetail?.investmentPlans?.plans?.length > 0 && (
          <InvestmentPlans project={project} />
        )}

        {project.projectDetail?.masterPlan?.tabs?.length > 0 && (
          <MasterPlanSection project={project} />
        )}

        <ContactForm />
      </main>
    );
  } catch (error) {
    console.error("Error in ProjectDetailPage:", error);
    notFound();
  }
}

// Allow dynamic params for new projects
export const dynamicParams = true;
// Keep default caching behavior - will cache until revalidated