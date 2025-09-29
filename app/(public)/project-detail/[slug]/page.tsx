// app/(public)/project-detail/[slug]/page.tsx

import { notFound } from "next/navigation";
import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";
import Category from "@/models/Category"; // Import Category model to ensure schema registration
import ProjectHeroSection from "@/components/client/ProjectHeroSection";
import ProjectHighlights from "@/components/client/ProjectHighlights";
import Highlights from "@/components/client/Highlights";
import ModernAmenities from "@/components/client/ModernAmenities";
import MasterPlanSection from "@/components/client/MasterplanSection";
import InvestmentPlans from "@/components/client/InvestmentPlans";
import ContactForm from "@/components/ContactForm";
import GatewaySection from "@/components/client/GatewaySection";

// Enhanced database query with better error handling and caching
async function getProjectBySlug(slug: string) {
  // Validate slug format
  if (!slug || typeof slug !== "string" || slug.trim().length === 0) {
    console.error("Invalid slug provided:", slug);
    return null;
  }

  // Sanitize slug to prevent injection attacks
  const sanitizedSlug = slug.trim().toLowerCase();

  try {
    await connectDB();

    console.log("Fetching project with slug:", sanitizedSlug);

    const project = await Project.findOne({
      slug: sanitizedSlug,
      isActive: true,
    })
      .populate("category", "name _id")
      .lean()
      .maxTimeMS(15000); // Increased timeout for better reliability

    console.log("Project found:", !!project);

    if (!project) {
      console.log("Project not found with slug:", sanitizedSlug);
      return null;
    }

    // Convert all BSON/ObjectId fields into plain strings
    const updatedProject = JSON.parse(JSON.stringify(project));

    // Ensure required fields exist with defaults
    updatedProject.images = updatedProject.images || [];
    updatedProject.location = updatedProject.location || "";
    updatedProject.description = updatedProject.description || "";
    updatedProject.badge = updatedProject.badge || "";
    updatedProject.price = updatedProject.price || "";
    updatedProject.categoryName =
      updatedProject.categoryName || updatedProject.category?.name || "";

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
          description:
            "Secure high returns with exclusive, time-sensitive opportunities.",
          backgroundImage: "",
          plans: [],
        },
        gateway: {
          title: "A place to come home to",
          subtitle: "and a location that",
          highlightText: "holds its value.",
          description:
            "Set between Layan and Bangtao, this address offers more than scenery.",
          sectionTitle: "Your Gateway to Paradise",
          sectionDescription:
            "Perfectly positioned where tropical elegance meets modern convenience.",
          backgroundImage: "",
          mapImage: "",
          categories: [],
        },
      };
    }

    console.log("Project data processed successfully");
    return updatedProject;
  } catch (error) {
    console.error("Error fetching project:", error);

    // Log specific error types for debugging
    if (error instanceof Error) {
      if (error.message.includes("timeout")) {
        console.error(
          "Database timeout error for slug:",
          sanitizedSlug,
          "Error:",
          error.message
        );
      } else if (error.message.includes("connection")) {
        console.error(
          "Database connection error for slug:",
          sanitizedSlug,
          "Error:",
          error.message
        );
      } else if (error.message.includes("Schema hasn't been registered")) {
        console.error(
          "Schema registration error for slug:",
          sanitizedSlug,
          "Error:",
          error.message
        );
      }
    }

    console.error("Unknown error for slug:", sanitizedSlug, "Error:", error);
    return null;
  }
}

// Enhanced generateStaticParams with better error handling
export async function generateStaticParams() {
  try {
    await connectDB();

    const projects = await Project.find({ isActive: true })
      .select("slug name")
      .lean()
      .maxTimeMS(15000); // 15 second timeout for build time

    console.log("Generating static params for projects:", projects.length);

    // Validate slugs and filter out invalid ones
    const validProjects = projects.filter(
      (project: any) =>
        project.slug &&
        typeof project.slug === "string" &&
        project.slug.trim().length > 0
    );

    console.log("Valid projects for static generation:", validProjects.length);

    return validProjects.map((project: any) => ({
      slug: project.slug.trim(),
    }));
  } catch (error) {
    console.error("Error generating static params:", error);

    // Return empty array to prevent build failure
    // The page will still work with dynamicParams = true
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

    // Validate slug parameter
    if (!slug || typeof slug !== "string" || slug.trim().length === 0) {
      console.error("Invalid slug parameter:", slug);
      notFound();
    }

    console.log("ProjectDetailPage accessed with slug:", slug);

    // Try to get project with retry mechanism for new projects
    let project = await getProjectBySlug(slug);

    // If project not found, wait a moment and try again (for newly created projects)
    if (!project) {
      console.log("Project not found on first attempt, retrying...");
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second
      project = await getProjectBySlug(slug);
    }

    // If still not found, try fallback API
    if (!project) {
      console.log("Project not found after retry, trying fallback API...");
      try {
        const fallbackResponse = await fetch(
          `${
            process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
          }/api/projects/fallback/${slug}`,
          {
            cache: "no-store",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          if (fallbackData.success && fallbackData.data) {
            console.log("Project found via fallback API");
            project = fallbackData.data;
          }
        }
      } catch (fallbackError) {
        console.error("Fallback API also failed:", fallbackError);
      }
    }

    if (!project) {
      console.log("Project not found after all attempts, calling notFound()");
      notFound();
    }

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

    // Log additional context for debugging
    if (error instanceof Error) {
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        slug: params ? (await params).slug : "unknown",
      });
    }

    notFound();
  }
}

// Optimized ISR configuration for stale-while-revalidate pattern
export const dynamicParams = true; // Allow dynamic segments not in generateStaticParams
export const revalidate = 3600; // Revalidate page every 1 hour (ISR) - serves stale content while revalidating
export const dynamic = "auto"; // Allow dynamic rendering for new projects
export const fetchCache = "default-cache"; // Enable proper caching for ISR
