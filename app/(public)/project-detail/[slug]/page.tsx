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

// Direct database fetch function (no caching)
async function fetchProjectBySlugDirect(slug: string) {
  console.log(`[DIRECT_FETCH] Fetching project with slug: ${slug}`);
  
  try {
    await connectDB();
    
    const project = await Project.findOne({ slug, isActive: true })
      .populate("category", "name _id")
      .lean();

    if (!project) {
      console.log(`[DIRECT_FETCH] No project found with slug: ${slug}`);
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

    console.log(`[DIRECT_FETCH] Successfully fetched project: ${updatedProject.name}`);
    return updatedProject;
  } catch (error) {
    console.error(`[DIRECT_FETCH] Error fetching project with slug ${slug}:`, error);
    return null;
  }
}

// Cached version with smaller, more targeted cache tags
const getCachedProjectBySlug = (slug: string) =>
  unstable_cache(
    () => fetchProjectBySlugDirect(slug),
    [`project-detail-${slug}`],
    {
      tags: ["projects", `project-slug-${slug}`], // Fewer cache tags for less interference
      revalidate: false, // Only revalidate on demand
    }
  );

// Main function with multiple fallback attempts
async function getProjectBySlug(slug: string) {
  console.log(`[GET_PROJECT] Starting fetch for slug: ${slug}`);
  
  // Strategy 1: Try cached version first
  try {
    const cachedFunction = getCachedProjectBySlug(slug);
    const cachedProject = await Promise.race([
      cachedFunction(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Cache timeout')), 3000)
      )
    ]) as any;
    
    if (cachedProject) {
      console.log(`[GET_PROJECT] Cache hit for slug: ${slug}`);
      return cachedProject;
    }
    
    console.log(`[GET_PROJECT] Cache returned null for slug: ${slug}`);
  } catch (cacheError) {
    console.warn(`[GET_PROJECT] Cache error for slug ${slug}:`, cacheError);
  }
  
  // Strategy 2: Direct database fetch with retry
  console.log(`[GET_PROJECT] Attempting direct fetch for slug: ${slug}`);
  
  const maxRetries = 2;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`[GET_PROJECT] Direct fetch attempt ${attempt} for slug: ${slug}`);
      
      const directProject = await Promise.race([
        fetchProjectBySlugDirect(slug),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Direct fetch timeout')), 5000)
        )
      ]) as any;
      
      if (directProject) {
        console.log(`[GET_PROJECT] Direct fetch successful on attempt ${attempt} for slug: ${slug}`);
        return directProject;
      }
      
      console.log(`[GET_PROJECT] Direct fetch returned null on attempt ${attempt} for slug: ${slug}`);
    } catch (directError) {
      console.error(`[GET_PROJECT] Direct fetch attempt ${attempt} failed for slug ${slug}:`, directError);
      
      if (attempt < maxRetries) {
        const delay = 500 * attempt; // Exponential backoff
        console.log(`[GET_PROJECT] Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  // Strategy 3: Final attempt without timeout
  console.log(`[GET_PROJECT] Final attempt without timeout for slug: ${slug}`);
  try {
    const finalProject = await fetchProjectBySlugDirect(slug);
    if (finalProject) {
      console.log(`[GET_PROJECT] Final attempt successful for slug: ${slug}`);
      return finalProject;
    }
  } catch (finalError) {
    console.error(`[GET_PROJECT] Final attempt failed for slug ${slug}:`, finalError);
  }
  
  console.log(`[GET_PROJECT] All attempts failed for slug: ${slug}`);
  return null;
}

export async function generateStaticParams() {
  try {
    await connectDB();
    const projects = await Project.find({ isActive: true })
      .select("slug")
      .lean();

    console.log(`[STATIC_PARAMS] Generating static params for ${projects.length} projects`);
    
    return projects.map((project: any) => ({
      slug: project.slug,
    }));
  } catch (error) {
    console.error("[STATIC_PARAMS] Error generating static params:", error);
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
    console.error("[METADATA] Error generating metadata:", error);
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
  const { slug } = await params;
  
  console.log(`[PAGE] ProjectDetailPage accessed with slug: ${slug}`);

  try {
    const project = await getProjectBySlug(slug);

    if (!project) {
      console.log(`[PAGE] Project not found for slug: ${slug}, calling notFound()`);
      notFound();
    }

    console.log(`[PAGE] Successfully loaded project: ${project.name} for slug: ${slug}`);

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
  } catch (pageError) {
    console.error(`[PAGE] Unexpected error in ProjectDetailPage for slug ${slug}:`, pageError);
    notFound();
  }
}

export const dynamicParams = true;
export const revalidate = false;