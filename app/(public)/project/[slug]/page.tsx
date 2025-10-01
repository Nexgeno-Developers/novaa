import { notFound } from "next/navigation";
import { Metadata } from "next";
import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";
import Category from "@/models/Category";
import Section from "@/models/Section";
import BreadcrumbsSection from "@/components/client/BreadcrumbsSection";
import ProjectHeroSection from "@/components/client/ProjectHeroSection";
import ProjectHighlights from "@/components/client/ProjectHighlights";
import Highlights from "@/components/client/Highlights";
import ModernAmenities from "@/components/client/ModernAmenities";
import MasterPlanSection from "@/components/client/MasterplanSection";
import InvestmentPlans from "@/components/client/InvestmentPlans";
import ContactForm from "@/components/ContactForm";
import GatewaySection from "@/components/client/GatewaySection";

// Direct database query without unstable_cache - following blog pattern
async function getProjectBySlug(slug: string) {
  try {
    await connectDB();

    console.log("Fetching project with slug:", slug);

    const project = await Project.findOne({ slug, isActive: true })
      .populate("category", "name _id")
      .lean();

    console.log("Project found:", !!project);

    if (!project) {
      console.log("Project not found with slug:", slug);
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
    return null;
  }
}

// Direct database query for breadcrumb data - following blog pattern
async function getBreadcrumbData() {
  try {
    await connectDB();

    const breadcrumbSection = await Section.findOne({
      pageSlug: "project",
      type: "breadcrumb",
      status: "active",
      "settings.isVisible": true,
    }).lean();

    return JSON.parse(JSON.stringify(breadcrumbSection));
  } catch (error) {
    console.error("Error fetching breadcrumb data:", error);
    return null;
  }
}

// generateStaticParams for better production performance - following blog pattern
export async function generateStaticParams() {
  try {
    await connectDB();
    const projects = await Project.find({ isActive: true })
      .select("slug")
      .lean();

    return projects.map((project) => ({
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
}): Promise<Metadata> {
  try {
    const { slug } = await params;
    const project = await getProjectBySlug(slug);

    if (!project) {
      return {
        title: "Project Not Found",
        description: "The requested project could not be found.",
        robots: "noindex,nofollow",
      };
    }

    const cleanDescription = project.description
      .replace(/<[^>]*>/g, "")
      .substring(0, 160);

    return {
      title: `${project.name} - ${project.location} | Real Estate`,
      description: cleanDescription,
      openGraph: {
        title: project.name,
        description: cleanDescription,
        images: project.images.slice(0, 1),
        type: "website",
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Project",
      description: "View our real estate project.",
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

    console.log("ProjectDetailPage accessed with slug:", slug);

    const [project, breadcrumbData] = await Promise.all([
      getProjectBySlug(slug),
      getBreadcrumbData(),
    ]);

    if (!project) {
      console.log("Project not found, calling notFound()");
      notFound();
    }

    return (
      <main className="relative">
        {/* {breadcrumbData && (
          <BreadcrumbsSection
            {...breadcrumbData.content}
            pageSlug={breadcrumbData.pageSlug}
          />
        )} */}
        <ProjectHeroSection project={project} />
        <GatewaySection project={project} />
        <ProjectHighlights project={project} />
        <Highlights project={project} />
        {/* <ModernAmenities project={project} /> */}
        <MasterPlanSection project={project} />
        <InvestmentPlans project={project} />
        <ContactForm />
      </main>
    );
  } catch (error) {
    console.error("Error in ProjectDetailPage:", error);
    notFound();
  }
}

// These exports control Next.js ISR behavior - following blog pattern
export const dynamicParams = true; // Allow dynamic segments not in generateStaticParams
export const revalidate = 60; // Revalidate page every 60 seconds (ISR)
