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

// Bulletproof database query with retry logic and comprehensive error handling
async function getProjectBySlug(slug: string, retryCount = 0): Promise<any> {
  const MAX_RETRIES = 3;

  // Validate slug format
  if (!slug || typeof slug !== "string" || slug.trim().length === 0) {
    console.error("Invalid slug provided:", slug);
    return null;
  }

  // Sanitize slug to prevent injection attacks
  const sanitizedSlug = slug.trim().toLowerCase();

  try {
    // Ensure fresh database connection
    await connectDB();

    console.log(
      `Fetching project with slug: ${sanitizedSlug} (attempt ${retryCount + 1})`
    );

    const project = await Project.findOne({
      slug: sanitizedSlug,
      isActive: true,
    })
      .populate("category", "name _id")
      .lean()
      .maxTimeMS(20000); // Increased timeout

    console.log("Project found:", !!project);

    if (!project) {
      console.log("Project not found with slug:", sanitizedSlug);

      // Retry if project not found and we haven't exceeded retries
      if (retryCount < MAX_RETRIES) {
        console.log(
          `Project not found, retrying... (${retryCount + 1}/${MAX_RETRIES})`
        );
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 * (retryCount + 1))
        ); // Progressive delay
        return getProjectBySlug(slug, retryCount + 1);
      }

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

    // Retry on connection/timeout errors
    if (
      retryCount < MAX_RETRIES &&
      error instanceof Error &&
      (error.message.includes("connection") ||
        error.message.includes("timeout") ||
        error.message.includes("Schema hasn't been registered"))
    ) {
      console.log(
        `Database error, retrying... (${retryCount + 1}/${MAX_RETRIES})`
      );
      await new Promise((resolve) =>
        setTimeout(resolve, 2000 * (retryCount + 1))
      );
      return getProjectBySlug(slug, retryCount + 1);
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

    // Try to get project with comprehensive retry mechanism
    let project = await getProjectBySlug(slug);

    // If project not found, try multiple fallback strategies
    if (!project) {
      console.log(
        "Project not found on first attempt, trying fallback strategies..."
      );

      // Strategy 1: Try fallback API
      try {
        const fallbackResponse = await fetch(
          `${
            process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
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
        console.error("Fallback API failed:", fallbackError);
      }

      // Strategy 2: Try public API route
      if (!project) {
        try {
          const publicResponse = await fetch(
            `${
              process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
            }/api/projects/slug/${slug}`,
            {
              cache: "no-store",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (publicResponse.ok) {
            const publicData = await publicResponse.json();
            if (publicData.success && publicData.data) {
              console.log("Project found via public API");
              project = publicData.data;
            }
          }
        } catch (publicError) {
          console.error("Public API failed:", publicError);
        }
      }

      // Strategy 3: Final retry with fresh connection
      if (!project) {
        console.log(
          "All fallback strategies failed, attempting final retry..."
        );
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds
        project = await getProjectBySlug(slug, 0); // Fresh retry
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

// Bulletproof configuration - NO ISR to eliminate 404 errors
export const dynamicParams = true; // Allow dynamic segments not in generateStaticParams
export const dynamic = "force-dynamic"; // Force dynamic rendering - NO ISR
export const fetchCache = "force-no-store"; // Disable all caching to prevent stale data
export const revalidate = 0; // Disable ISR completely
