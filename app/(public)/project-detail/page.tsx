// import { notFound } from 'next/navigation';
// import connectDB from '@/lib/mongodb';
// import Project from '@/models/Project';
// import ProjectHeroSection from '@/components/client/ProjectHeroSection';
// import ProjectHighlights from '@/components/client/ProjectHighlights';
// import Highlights from '@/components/client/Highlights';
// import ModernAmenities from '@/components/client/ModernAmenities';
// import InvestmentPlans from '@/components/client/InvestmentPlans';
// import MasterPlanSection from '@/components/client/MasterplanSection';
// import ContactForm from '@/components/ContactForm';
// import GatewaySection from '@/components/client/GatewaySection';

// async function getProjectData(id: string) {
//   try {
//     await connectDB();
    
//     const project = await Project.findById(id).populate('category').lean();
    
//     if (!project || !project.isActive) {
//       return null;
//     }
    
//     return project;
//   } catch (error) {
//     console.error("Failed to fetch project data:", error);
//     return null;
//   }
// }

// export default async function ProjectDetailPage({
//   params,
// }: {
//   params: Promise<{ id: string }>;
// }) {
//   const { id } = await params;
//   const project = await getProjectData(id);

//   if (!project) {
//     notFound();
//   }

//   // Serialize the project data for client components
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
//         brochurePdf: ""
//       },
//       projectHighlights: {
//         backgroundImage: "",
//         description: "",
//         highlights: []
//       },
//       keyHighlights: {
//         backgroundImage: "",
//         description: "",
//         highlights: []
//       },
//       modernAmenities: {
//         title: "MODERN AMENITIES FOR A BALANCED LIFESTYLE",
//         description: "",
//         amenities: []
//       },
//       masterPlan: {
//         title: "",
//         subtitle: "",
//         description: "",
//         backgroundImage: ""
//       }
//     }
//   };

//   return (
//     <main className="relative">
//       {/* Hero Section */}
//       <ProjectHeroSection project={serializedProject} />
      
//       {/* Project Highlights Section - Only render if has highlights */}
//       {serializedProject.projectDetail?.projectHighlights?.highlights?.length > 0 && (
//         <ProjectHighlights project={serializedProject} />
//       )}
      
//       {/* Key Highlights Section - Only render if has highlights */}
//       {serializedProject.projectDetail?.keyHighlights?.highlights?.length > 0 && (
//         <Highlights project={serializedProject} />
//       )}
      
//       {/* Modern Amenities Section - Only render if has amenities */}
//       {serializedProject.projectDetail?.modernAmenities?.amenities?.length > 0 && (
//         <ModernAmenities project={serializedProject} />
//       )}
      
//       {/* Investment Plans Section - Keep as static for now */}
//       <InvestmentPlans />
      
//       {/* Master Plan Section - Only render if has content */}
//       {(serializedProject.projectDetail?.masterPlan?.title || 
//         serializedProject.projectDetail?.masterPlan?.description) && (
//         <MasterPlanSection project={serializedProject} />
//       )}
      
//       {/* Gateway Section - Keep as static for now */}
//       <GatewaySection />
      
//       {/* Contact Form - Keep as static for now */}
//       <ContactForm />
//     </main>
//   );
// }

// // Generate metadata for SEO
// export async function generateMetadata({
//   params,
// }: {
//   params: Promise<{ id: string }>;
// }) {
//   const { id } = await params;
//   const project = await getProjectData(id);

//   if (!project) {
//     return {
//       title: 'Project Not Found',
//     };
//   }

//   return {
//     title: `${project.name} - ${project.location} | Real Estate`,
//     description: project.description.replace(/<[^>]*>/g, '').substring(0, 160),
//     openGraph: {
//       title: project.name,
//       description: project.description.replace(/<[^>]*>/g, '').substring(0, 160),
//       images: project.images.slice(0, 1),
//     },
//   };
// }