// import { notFound } from "next/navigation";
// import { unstable_cache } from "next/cache";
// import connectDB from "@/lib/mongodb";
// import Project from "@/models/Project";
// import ProjectHeroSection from "@/components/client/ProjectHeroSection";
// import ProjectHighlights from "@/components/client/ProjectHighlights";
// import Highlights from "@/components/client/Highlights";
// import ModernAmenities from "@/components/client/ModernAmenities";
// import MasterPlanSection from "@/components/client/MasterplanSection";
// import InvestmentPlans from "@/components/client/InvestmentPlans";
// import ContactForm from "@/components/ContactForm";
// import GatewaySection from "@/components/client/GatewaySection";

// // Create cached function for project data by slug
// const getCachedProjectBySlug = (slug: string) =>
//   unstable_cache(
//     async () => {
//       try {
//         await connectDB();

//         console.log("Fetching project with slug:", slug);

//         const project = await Project.findOne({ slug, isActive: true })
//           .populate("category", "name _id")
//           .lean();

//         console.log("Project found:", !!project);

//         if (!project) {
//           console.log("Project not found with slug:", slug);
//           return null;
//         }

//         // Convert all BSON/ObjectId fields into plain strings
//         const updatedProject = JSON.parse(JSON.stringify(project));

//         // Ensure required fields exist with defaults
//         updatedProject.images = updatedProject.images || [];
//         updatedProject.location = updatedProject.location || '';
//         updatedProject.description = updatedProject.description || '';
//         updatedProject.badge = updatedProject.badge || '';
//         updatedProject.price = updatedProject.price || '';
//         updatedProject.categoryName = updatedProject.categoryName || updatedProject.category?.name || '';
        
//         // Ensure projectDetail exists with defaults
//         if (!updatedProject.projectDetail) {
//           updatedProject.projectDetail = {
//             hero: {
//               backgroundImage: "",
//               title: updatedProject.name,
//               subtitle: "",
//               scheduleMeetingButton: "Schedule a meeting",
//               getBrochureButton: "Get Brochure",
//               brochurePdf: "",
//             },
//             projectHighlights: {
//               backgroundImage: "",
//               description: "",
//               highlights: [],
//             },
//             keyHighlights: {
//               backgroundImage: "",
//               description: "",
//               highlights: [],
//             },
//             modernAmenities: {
//               title: "MODERN AMENITIES FOR A BALANCED LIFESTYLE",
//               description: "",
//               amenities: [],
//             },
//             masterPlan: {
//               title: "",
//               subtitle: "",
//               description: "",
//               backgroundImage: "",
//               tabs: [],
//             },
//             investmentPlans: {
//               title: "LIMITED-TIME INVESTMENT PLANS",
//               description: "Secure high returns with exclusive, time-sensitive opportunities.",
//               backgroundImage: "",
//               plans: [],
//             },
//             gateway: {
//               title: "A place to come home to",
//               subtitle: "and a location that",
//               highlightText: "holds its value.",
//               description: "Set between Layan and Bangtao, this address offers more than scenery.",
//               sectionTitle: "Your Gateway to Paradise",
//               sectionDescription: "Perfectly positioned where tropical elegance meets modern convenience.",
//               backgroundImage: "",
//               mapImage: "",
//               categories: [],
//             },
//           };
//         }

//         console.log("Project data processed successfully");
//         return updatedProject;
//       } catch (error) {
//         console.error("Error fetching project:", error);
//         return null;
//       }
//     },
//     [`project-detail-${slug}`],
//     {
//       tags: ["projects", `project-slug-${slug}`, "project-details", "categories"],
//       revalidate: false,
//     }
//   );

// async function getProjectBySlug(slug: string) {
//   try {
//     const cachedFunction = getCachedProjectBySlug(slug);
//     return await cachedFunction();
//   } catch (error) {
//     console.error("Error in getProjectBySlug:", error);
//     return null;
//   }
// }

// // Update generateStaticParams to use slugs
// export async function generateStaticParams() {
//   try {
//     await connectDB();
//     const projects = await Project.find({ isActive: true })
//       .select("slug")
//       .lean();

//     console.log("Generating static params for projects:", projects.length);
    
//     return projects.map((project: any) => ({
//       slug: project.slug,
//     }));
//   } catch (error) {
//     console.error("Error generating static params:", error);
//     return [];
//   }
// }

// export async function generateMetadata({
//   params,
// }: {
//   params: Promise<{ slug: string }>;
// }) {
//   try {
//     const { slug } = await params;
//     const project = await getProjectBySlug(slug);

//     if (!project) {
//       return {
//         title: "Project Not Found",
//         description: "The requested project could not be found.",
//       };
//     }

//     const description = project.description
//       .replace(/<[^>]*>/g, "")
//       .substring(0, 160);

//     return {
//       title: `${project.name} - ${project.location} | Real Estate`,
//       description,
//       openGraph: {
//         title: project.name,
//         description,
//         images: project.images.slice(0, 1),
//       },
//     };
//   } catch (error) {
//     console.error("Error generating metadata:", error);
//     return {
//       title: "Project Details",
//       description: "Real estate project details",
//     };
//   }
// }

// export default async function ProjectDetailPage({
//   params,
// }: {
//   params: Promise<{ slug: string }>;
// }) {
//   try {
//     const { slug } = await params;

//     console.log("ProjectDetailPage accessed with slug:", slug);

//     const project = await getProjectBySlug(slug);

//     if (!project) {
//       console.log("Project not found, calling notFound()");
//       notFound();
//     }

//     return (
//       <main className="relative">
//         <ProjectHeroSection project={project} />

//         {project.projectDetail?.gateway?.categories?.length > 0 && (
//           <GatewaySection project={project} />
//         )}

//         {project.projectDetail?.projectHighlights?.highlights?.length > 0 && (
//           <ProjectHighlights project={project} />
//         )}

//         {project.projectDetail?.keyHighlights?.highlights?.length > 0 && (
//           <Highlights project={project} />
//         )}

//         {project.projectDetail?.modernAmenities?.amenities?.length > 0 && (
//           <ModernAmenities project={project} />
//         )}

//         {project.projectDetail?.investmentPlans?.plans?.length > 0 && (
//           <InvestmentPlans project={project} />
//         )}

//         {project.projectDetail?.masterPlan?.tabs?.length > 0 && (
//           <MasterPlanSection project={project} />
//         )}

//         <ContactForm />
//       </main>
//     );
//   } catch (error) {
//     console.error("Error in ProjectDetailPage:", error);
//     notFound();
//   }
// }

// export const dynamicParams = true;
// export const revalidate = false;
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
import ContentRefreshIndicator from "@/components/client/ContentRefreshIndicator";
import { ProjectDetailSkeleton } from "@/components/client/LoadingSkeletons";
import { Suspense } from "react";

// Your existing fetch functions remain the same...
async function fetchProjectBySlugDirect(slug: string) {
  console.log(`[PROJECT_DIRECT] Fetching project: ${slug}`);
  
  try {
    await connectDB();
    
    const project = await Project.findOne({ slug, isActive: true })
      .populate("category", "name _id")
      .lean();

    if (!project) {
      console.log(`[PROJECT_DIRECT] No project found: ${slug}`);
      return null;
    }

    const updatedProject = JSON.parse(JSON.stringify(project));

    // Ensure required fields exist with defaults
    updatedProject.images = updatedProject.images || [];
    updatedProject.location = updatedProject.location || '';
    updatedProject.description = updatedProject.description || '';
    updatedProject.badge = updatedProject.badge || '';
    updatedProject.price = updatedProject.price || '';
    updatedProject.categoryName = updatedProject.categoryName || updatedProject.category?.name || '';
    
    updatedProject._cacheMetadata = {
      fetchedAt: new Date().toISOString(),
      source: 'direct',
      slug: slug
    };
    
    // Default projectDetail structure (same as before)
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

    console.log(`[PROJECT_DIRECT] Successfully fetched: ${updatedProject.name}`);
    return updatedProject;
  } catch (error) {
    console.error(`[PROJECT_DIRECT] Error:`, error);
    return null;
  }
}

const getFreshProjectBySlug = (slug: string) =>
  unstable_cache(
    async () => {
      const project = await fetchProjectBySlugDirect(slug);
      if (project) {
        project._cacheMetadata.source = 'fresh-cache';
      }
      return project;
    },
    [`project-fresh-${slug}-${Date.now()}`],
    {
      tags: ["projects", `project-slug-${slug}`],
      revalidate: false,
    }
  );

const getStaleProjectBySlug = (slug: string) =>
  unstable_cache(
    async () => {
      const project = await fetchProjectBySlugDirect(slug);
      if (project) {
        project._cacheMetadata.source = 'stale-cache';
      }
      return project;
    },
    [`project-stale-${slug}`],
    {
      tags: ["projects", `project-slug-${slug}`],
      revalidate: 300,
    }
  );

// Modified SWR function with loading states
async function getProjectBySlugSWR(slug: string) {
  console.log(`[PROJECT_SWR] Starting SWR for slug: ${slug}`);
  
  let staleProject = null;
  let freshProject = null;
  let shouldShowRefreshIndicator = false;
  let isLoading = true;
  
  // Step 1: Try stale cache first (quick)
  try {
    console.log(`[PROJECT_SWR] Trying stale cache for: ${slug}`);
    const staleFunction = getStaleProjectBySlug(slug);
    staleProject = await Promise.race([
      staleFunction(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Stale cache timeout')), 1500) // Shorter timeout
      )
    ]) as any;
    
    if (staleProject) {
      console.log(`[PROJECT_SWR] Stale cache hit for: ${slug}`);
      shouldShowRefreshIndicator = true;
      isLoading = false; // We have some content to show
    }
  } catch (error) {
    console.log(`[PROJECT_SWR] Stale cache miss for: ${slug}`);
  }
  
  // Step 2: Try fresh cache
  try {
    console.log(`[PROJECT_SWR] Trying fresh cache for: ${slug}`);
    const freshFunction = getFreshProjectBySlug(slug);
    freshProject = await Promise.race([
      freshFunction(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Fresh cache timeout')), 3000)
      )
    ]) as any;
    
    if (freshProject) {
      console.log(`[PROJECT_SWR] Fresh cache hit for: ${slug}`);
      shouldShowRefreshIndicator = false;
      isLoading = false;
    }
  } catch (error) {
    console.log(`[PROJECT_SWR] Fresh cache miss for: ${slug}`);
  }
  
  // Step 3: Direct fetch if needed
  if (!freshProject) {
    const maxRetries = staleProject ? 1 : 3;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        freshProject = await Promise.race([
          fetchProjectBySlugDirect(slug),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Direct fetch timeout')), 3000)
          )
        ]) as any;
        
        if (freshProject) {
          console.log(`[PROJECT_SWR] Direct fetch successful on attempt ${attempt}`);
          isLoading = false;
          break;
        }
      } catch (error) {
        console.log(`[PROJECT_SWR] Direct fetch attempt ${attempt} failed`);
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 500 * attempt));
        }
      }
    }
  }
  
  const finalProject = freshProject || staleProject;
  
  if (finalProject) {
    finalProject._showRefreshIndicator = shouldShowRefreshIndicator && !freshProject;
    finalProject._isStale = !freshProject && !!staleProject;
    finalProject._isLoading = isLoading && !finalProject;
    
    console.log(`[PROJECT_SWR] Returning project: ${finalProject.name}, stale: ${finalProject._isStale}, loading: ${isLoading}`);
  } else {
    console.log(`[PROJECT_SWR] No project data available for: ${slug}`);
  }
  
  return finalProject;
}

// Main component that renders project content
function ProjectContent({ project, slug }: { project: any; slug: string }) {
  return (
    <main className="relative">
      {/* Show refresh indicator if serving stale content */}
      {project._showRefreshIndicator && (
        <ContentRefreshIndicator 
          type="project" 
          slug={slug}
          contentName={project.name}
        />
      )}
      
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
}

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
    console.error("[STATIC_PARAMS] Error:", error);
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
    const project = await getProjectBySlugSWR(slug);

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
    console.error("[METADATA] Error:", error);
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
  
  console.log(`[PAGE] ProjectDetailPage accessed: ${slug}`);

  try {
    const project = await getProjectBySlugSWR(slug);

    if (!project) {
      console.log(`[PAGE] No project found: ${slug}`);
      notFound();
    }

    console.log(`[PAGE] Loaded project: ${project.name}`);

    // If we're still loading and have no stale content, show skeleton
    if (project._isLoading) {
      return <ProjectDetailSkeleton />;
    }

    return (
      <Suspense fallback={<ProjectDetailSkeleton />}>
        <ProjectContent project={project} slug={slug} />
      </Suspense>
    );
  } catch (pageError) {
    console.error(`[PAGE] Error: ${slug}:`, pageError);
    // Show skeleton while we figure out what went wrong
    return <ProjectDetailSkeleton />;
  }
}

export const dynamicParams = true;
export const revalidate = false;