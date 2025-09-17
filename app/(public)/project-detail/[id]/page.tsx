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

// // Cached project fetcher
// const getCachedProjectData = (id: string) =>
//   unstable_cache(
//     async () => {
//       try {
//         await connectDB();

//         if (!id.match(/^[0-9a-fA-F]{24}$/)) return null;

//         const project = await Project.findById(id).populate("category");
//         if (!project || !project.isActive) return null;

//         return JSON.parse(JSON.stringify(project));
//       } catch (error) {
//         console.error("Failed to fetch project data:", error);
//         return null;
//       }
//     },
//     [`project-detail-${id}`],
//     {
//       tags: [`project-${id}`, "projects", "project-details" ,  "categories"],
//       revalidate: 3600,
//     }
//   );

// async function getProjectData(id: string) {
//   const cachedFunction = getCachedProjectData(id);
//   return cachedFunction();
// }

// export default async function ProjectDetailPage({
//   params,
// }: {
//   params: Promise<{ id: string }>;
// }) {
//   const { id } = await params;
//   const project = await getProjectData(id);

//   if (!project) {
//     console.log("Project not found for ID:", id);
//     notFound();
//   }

//   const serializedProject = {
//     _id: project._id.toString(),
//     name: project.name,
//     price: project.price,
//     images: project.images,
//     location: project.location,
//     description: project.description,
//     badge: project.badge,
//     category: {
//       _id: project.category._id.toString(),
//       name: project.category.name,
//     },
//     categoryName: project.categoryName,
//     isActive: project.isActive,
//     order: project.order,
//     projectDetail: project.projectDetail || {
//       hero: {
//         backgroundImage: "",
//         title: project.name,
//         subtitle: "",
//         scheduleMeetingButton: "Schedule a meeting",
//         getBrochureButton: "Get Brochure",
//         brochurePdf: "",
//       },
//       projectHighlights: {
//         backgroundImage: "",
//         description: "",
//         highlights: [],
//       },
//       keyHighlights: {
//         backgroundImage: "",
//         description: "",
//         highlights: [],
//       },
//       modernAmenities: {
//         title: "MODERN AMENITIES FOR A BALANCED LIFESTYLE",
//         description: "",
//         amenities: [],
//       },
//       masterPlan: {
//         title: "",
//         subtitle: "",
//         description: "",
//         backgroundImage: "",
//         tabs: [],
//       },
//       investmentPlans: {
//         title: "LIMITED-TIME INVESTMENT PLANS",
//         description:
//           "Secure high returns with exclusive, time-sensitive opportunities.",
//         backgroundImage: "",
//         plans: [],
//       },
//       gatewaySection: {
//         title: "A place to come home to",
//         subtitle: "and a location that",
//         highlightText: "holds its value.",
//         description:
//           "Set between Layan and Bangtao, this address offers more than scenery. It brings you close to Phuket's most lived-in stretch from cafés and golf courses to global schools and beach clubs.",
//         explorerTitle: "Your Gateway to Paradise",
//         explorerDescription:
//           "Perfectly positioned where tropical elegance meets modern convenience, discover a world of luxury at your doorstep.",
//         backgroundImage: "/gateway-images/background.png",
//         mapImage: "/images/map2.png",
//         categories: [],
//       },
//     },
//   };

//   return (
//     <main className="relative">
//       <ProjectHeroSection project={serializedProject} />

//       {serializedProject.projectDetail?.gateway?.categories?.length > 0 && (
//         <GatewaySection project={serializedProject} />
//       )}

//       {serializedProject.projectDetail?.projectHighlights?.highlights?.length >
//         0 && <ProjectHighlights project={serializedProject} />}

//       {serializedProject.projectDetail?.keyHighlights?.highlights?.length > 0 && (
//         <Highlights project={serializedProject} />
//       )}

//       {serializedProject.projectDetail?.modernAmenities?.amenities?.length >
//         0 && <ModernAmenities project={serializedProject} />}

//       {serializedProject.projectDetail?.investmentPlans?.plans?.length > 0 && (
//         <InvestmentPlans project={serializedProject} />
//       )}

//       {serializedProject.projectDetail?.masterPlan?.tabs?.length > 0 && (
//         <MasterPlanSection project={serializedProject} />
//       )}

//       <ContactForm />
//     </main>
//   );
// }

// export const dynamicParams = true;
// export const revalidate = false;

// export async function generateStaticParams() {
//   try {
//     await connectDB();
//     const projects = await Project.find({ isActive: true })
//       .select("_id")
//       .lean();

//     return projects.map((project: any) => ({
//       id: project._id.toString(),
//     }));
//   } catch (error) {
//     console.error("Error generating static params:", error);
//     return [];
//   }
// }

// export async function generateMetadata({
//   params,
// }: {
//   params: Promise<{ id: string }>;
// }) {
//   const { id } = await params;
//   const project = await getProjectData(id);

//   if (!project) {
//     return {
//       title: "Project Not Found",
//     };
//   }

//   const description = project.description
//     .replace(/<[^>]*>/g, "")
//     .substring(0, 160);

//   return {
//     title: `${project.name} - ${project.location} | Real Estate`,
//     description,
//     openGraph: {
//       title: project.name,
//       description,
//       images: project.images.slice(0, 1),
//     },
//   };
// }

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

// Create cached function for project data (following blog pattern)
const getCachedProjectById = (id: string) =>
  unstable_cache(
    async () => {
      try {
        await connectDB();

        console.log("Fetching project with ID:", id);

        // Validate ObjectId format
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
          console.log("Invalid ObjectId format:", id);
          return null;
        }

        const project = await Project.findOne({ _id: id, isActive: true })
          .populate("category", "name _id")
          .lean();

        console.log("Project found:", !!project);

        if (!project) {
          console.log("Project not found with ID:", id);
          return null;
        }

        // Convert all BSON/ObjectId fields into plain strings
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

        console.log("Project data processed successfully");
        return updatedProject;
      } catch (error) {
        console.error("Error fetching project:", error);
        return null;
      }
    },
    [`project-detail-${id}`],
    {
      tags: ["projects", `project-${id}`, "project-details", "categories"],
      revalidate: 3600,
    }
  );

async function getProjectById(id: string) {
  try {
    const cachedFunction = getCachedProjectById(id);
    return await cachedFunction();
  } catch (error) {
    console.error("Error in getProjectById:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  try {
    const { id } = await params;
    const project = await getProjectById(id);

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
  params: Promise<{ id: string }>;
}) {
  try {
    const { id } = await params;

    console.log("ProjectDetailPage accessed with ID:", id);

    const project = await getProjectById(id);

    if (!project) {
      console.log("Project not found, calling notFound()");
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
    notFound();
  }
}

// Remove generateStaticParams entirely - let it be fully dynamic
export const dynamic = "force-dynamic";