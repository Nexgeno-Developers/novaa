import { notFound } from "next/navigation";
import { Metadata } from "next";
import BreadcrumbsSection from "@/components/client/BreadcrumbsSection";
import ProjectHeroSection from "@/components/client/ProjectHeroSection";
import ProjectHighlights from "@/components/client/ProjectHighlights";
import Highlights from "@/components/client/Highlights";
import ModernAmenities from "@/components/client/ModernAmenities";
import MasterPlanSection from "@/components/client/MasterplanSection";
import InvestmentPlans from "@/components/client/InvestmentPlans";
import ContactForm from "@/components/ContactForm";
import GatewaySection from "@/components/client/GatewaySection";
import ProjectClientsVideoSection from "@/components/client/ProjectClientsVideoSection";
import PriceEnquiryCTA from "@/components/client/PriceEnquiryCTA";

// API-based fetch function to avoid Mongoose schema issues
async function getProjectBySlug(slug: string) {
  try {
    console.log("Fetching project with slug via API:", slug);

    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }/api/projects/slug/${slug}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        // Add cache control for better performance
        next: { revalidate: 60 },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        console.log("Project not found with slug:", slug);
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      console.log("API returned error:", result.error);
      return null;
    }

    const project = result.data;
    console.log("Project found via API:", !!project);

    // Ensure required fields exist with defaults
    const updatedProject = {
      ...project,
      images: project.images || [],
      location: project.location || "",
      description: project.description || "",
      badge: project.badge || "",
      categoryName: project.categoryName || project.category?.name || "",

      // Ensure projectDetail exists with defaults
      projectDetail: project.projectDetail || {
        hero: {
          backgroundImage: "",
          title: project.name,
          subtitle: "",
          scheduleMeetingButton: "Schedule a meeting",
          getBrochureButton: "Get Brochure",
          brochurePdf: "",
        },
        discoverTranquility: {
          sectionTitle: "Discover Tranquility at",
          backgroundImage: "",
          description: "",
          tabs: [],
        },
        keyHighlights: {
          backgroundImage: "",
          description: "",
          highlights: [],
        },
        clientVideos: {
          title: "in Action",
          videos: [],
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
          mainProjectLocation: {
            title: "",
            description: "",
            icon: "/icons/map-pin.svg",
            coords: { x: 0, y: 0 },
          },
          curveLines: [],
          categories: [],
        },
      },
    };

    console.log("Project data processed successfully via API");
    return updatedProject;
  } catch (error) {
    console.error("Error fetching project via API:", error);
    return null;
  }
}

// API-based fetch for breadcrumb data
async function getBreadcrumbData() {
  try {
    // For now, return null for breadcrumbs - can be implemented later if needed
    return null;
  } catch (error) {
    console.error("Error fetching breadcrumb data:", error);
    return null;
  }
}

// Updated generateStaticParams using API to avoid Mongoose schema issues
export async function generateStaticParams() {
  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }/api/cms/projects`,
      {
        // Use static generation
        next: { revalidate: 3600 }, // Revalidate every hour
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      console.log("API returned error:", result.error);
      return [];
    }

    const projects = result.data.filter((project: any) => project.isActive);

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

    if (!project || !project.isActive) {
      console.log("Project not found or inactive, calling notFound()");
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
        <PriceEnquiryCTA />
        <ProjectHighlights project={project} />
        <Highlights project={project} />
        <ProjectClientsVideoSection
          projectName={project.name}
          clientVideos={project.projectDetail.clientVideos}
        />
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

// These exports control Next.js ISR behavior
export const dynamicParams = true; // Allow dynamic segments not in generateStaticParams
export const revalidate = 60; // Revalidate page every 60 seconds (ISR)
