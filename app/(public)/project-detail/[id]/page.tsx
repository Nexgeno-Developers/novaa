import { notFound } from "next/navigation";
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

async function getProjectData(id: string) {
  try {
    await connectDB();

    // Make sure the ID is valid MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      console.log("Invalid MongoDB ObjectId format:", id);
      return null;
    }

    const project = await Project.findById(id).populate("category")

    if (!project || !project.isActive) {
      console.log("Project not found or inactive:", id);
      return null;
    }

    console.log("Project found:", project.name);

    // Convert all BSON/ObjectId fields into plain strings
    const plainProject = JSON.parse(JSON.stringify(project));

    return plainProject;
  } catch (error) {
    console.error("Failed to fetch project data:", error);
    return null;
  }
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  console.log("Project detail page requested for ID:", id);

  const project = await getProjectData(id);

  if (!project) {
    console.log("Project not found for ID:", id);
    notFound();
  }

  // Serialize the project data for client components
  const serializedProject = {
    _id: project._id.toString(),
    name: project.name,
    price: project.price,
    images: project.images,
    location: project.location,
    description: project.description,
    badge: project.badge,
    category: {
      _id: project.category._id.toString(),
      name: project.category.name,
    },
    categoryName: project.categoryName,
    isActive: project.isActive,
    order: project.order,
    projectDetail: project.projectDetail || {
      hero: {
        backgroundImage: "",
        title: project.name,
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
      gatewaySection: {
        title: "A place to come home to",
        subtitle: "and a location that",
        highlightText: "holds its value.",
        description:
          "Set between Layan and Bangtao, this address offers more than scenery. It brings you close to Phuket's most lived-in stretch from cafés and golf courses to global schools and beach clubs.",
        explorerTitle: "Your Gateway to Paradise",
        explorerDescription:
          "Perfectly positioned where tropical elegance meets modern convenience, discover a world of luxury at your doorstep.",
        backgroundImage: "/gateway-images/background.png",
        mapImage: "/images/map2.png",
        categories: [],
      },
    },
  };

  return (
    <main className="relative">
      {/* Hero Section */}
      <ProjectHeroSection project={serializedProject} />

      {/* Gateway section  */}
      {serializedProject.projectDetail?.gateway?.categories?.length > 0 && (
        <GatewaySection project={serializedProject} />
      )}

      {/* Project Highlights Section - Only render if has highlights */}
      {serializedProject.projectDetail?.projectHighlights?.highlights?.length >
        0 && <ProjectHighlights project={serializedProject} />}

      {/* Key Highlights Section - Only render if has highlights */}
      {serializedProject.projectDetail?.keyHighlights?.highlights?.length >
        0 && <Highlights project={serializedProject} />}

      {/* Modern Amenities Section - Only render if has amenities */}
      {serializedProject.projectDetail?.modernAmenities?.amenities?.length >
        0 && <ModernAmenities project={serializedProject} />}

      {/* Investment Plans Section - Only render if has plans */}
      {serializedProject.projectDetail?.investmentPlans?.plans?.length > 0 && (
        <InvestmentPlans project={serializedProject} />
      )}

      {/* Master Plan Section - Only render if has tabs */}
      {serializedProject.projectDetail?.masterPlan?.tabs?.length > 0 && (
        <MasterPlanSection project={serializedProject} />
      )}

      {/* Contact Form */}
      <ContactForm />
    </main>
  );
}

export async function generateStaticParams() {
  try {
    await connectDB();
    const projects = await Project.find({ isActive: true }).select('_id').lean();
    
    console.log("Generated static params for projects:", projects.length);
    
    return projects.map((project: any) => ({
      id: project._id.toString(),
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  try {
    const project = await getProjectData(id);

    if (!project) {
      return {
        title: "Project Not Found",
      };
    }

    return {
      title: `${project.name} - ${project.location} | Real Estate`,
      description: project.description.replace(/<[^>]*>/g, "").substring(0, 160),
      openGraph: {
        title: project.name,
        description: project.description
          .replace(/<[^>]*>/g, "")
          .substring(0, 160),
        images: project.images.slice(0, 1),
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Project Not Found",
    };
  }
}