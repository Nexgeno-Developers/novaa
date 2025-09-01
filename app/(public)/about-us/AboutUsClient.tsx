// // "use client";

// // import Breadcrumbs from "@/components/client/Breadcrumbs";
// // import parse from "html-react-parser";

// // // Define types for the props for better code quality
// // interface BreadcrumbData {
// //   title: string;
// //   description: string;
// //   backgroundImageUrl: string;
// // }

// // interface OurStoryData {
// //   title: string;
// //   description: string;
// //   mediaType: "image" | "video";
// //   mediaUrl: string;
// // }

// // interface AboutUsClientProps {
// //   breadcrumbData: BreadcrumbData;
// //   ourStoryData: OurStoryData;
// // }

// // // CLIENT component that handles renderin
// // export default function AboutUsClient({
// //   breadcrumbData,
// //   ourStoryData,
// // }: AboutUsClientProps) {
// //   // Simple way to split title like "OUR STORY" into "OUR" and "STORY"
// //   const titleParts = ourStoryData.title.split(" ");
// //   const firstWord = titleParts.shift();
// //   const restOfTitle = titleParts.join(" ");

// //   return (
// //     <>
// //       <Breadcrumbs
// //         title={breadcrumbData.title}
// //         description={breadcrumbData.description}
// //         backgroundImageUrl={breadcrumbData.backgroundImageUrl}
// //         pageName="About Us"
// //       />

// //       <section className="bg-[#FAF4EB] py-10 sm:py-20 text-center">
// //         <div className="container">
// //           <h2 className="font-cinzel text-2xl sm:text-3xl lg:text-[50px] leading-snug text-center">
// //             <span className="font-normal text-[#151515]">{firstWord} </span>
// //             <span className="font-bold text-[#CDB04E]">{restOfTitle}</span>
// //           </h2>

// //           <div className="font-josefin text-center mt-4 text-[#151515] description-text">
// //             {parse(ourStoryData.description)}
// //           </div>

// //           <div className="mt-12 flex justify-center">
// //             <div className="w-full rounded-xl overflow-hidden shadow-xl">
// //               {ourStoryData.mediaType === "video" ? (
// //                 <video
// //                   src={ourStoryData.mediaUrl}
// //                   autoPlay
// //                   muted
// //                   playsInline
// //                   loop
// //                   className="w-full h-full object-cover"
// //                 />
// //               ) : (
// //                 <img
// //                   src={ourStoryData.mediaUrl}
// //                   alt={ourStoryData.title}
// //                   className="w-full h-full object-cover"
// //                 />
// //               )}
// //             </div>
// //           </div>
// //         </div>
// //       </section>
// //     </>
// //   );
// // }


// "use client";

// import React, { useState, useEffect } from "react";
// import Breadcrumbs from "@/components/client/Breadcrumbs";
// import parse from "html-react-parser";

// // Define types for better type safety
// interface BreadcrumbSection {
//   title: string;
//   description: string;
//   backgroundImageUrl: string;
// }

// interface OurStorySection {
//   title: string;
//   description: string;
//   mediaType: "image" | "video";
//   mediaUrl: string;
// }

// interface Section {
//   _id: string;
//   name: string;
//   slug: string;
//   type: string;
//   content: any;
//   status: "active" | "inactive";
//   settings: {
//     isVisible: boolean;
//   };
//   order: number;
// }

// interface AboutUsClientProps {
//   pageSlug: string;
// }

// export default function AboutUsClient({ pageSlug }: AboutUsClientProps) {
//   const [sections, setSections] = useState<Section[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // Extract specific sections from the sections array
//   const breadcrumbSection = sections.find(s => s.slug === 'breadcrumb')?.content as BreadcrumbSection;
//   const ourStorySection = sections.find(s => s.slug === 'our-story')?.content as OurStorySection;

//   useEffect(() => {
//     const fetchSections = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch(`/api/cms/sections/${pageSlug}/about-us`);
        
//         if (!response.ok) {
//           throw new Error(`Failed to fetch sections: ${response.status}`);
//         }

//         const data = await response.json();
//         console.log('Fetched sections:', data);
        
//         // Filter only active and visible sections, then sort by order
//         const activeSections = data.sections
//           ?.filter((section: Section) => 
//             section.status === 'active' && 
//             section.settings?.isVisible
//           )
//           .sort((a: Section, b: Section) => a.order - b.order) || [];

//         setSections(activeSections);
//       } catch (err) {
//         console.error('Error fetching sections:', err);
//         setError(err instanceof Error ? err.message : 'Failed to load page content');
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (pageSlug) {
//       fetchSections();
//     }
//   }, [pageSlug]);

//   // Loading state
//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
//       </div>
//     );
//   }

//   // Error state
//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Page</h2>
//           <p className="text-gray-600">{error}</p>
//         </div>
//       </div>
//     );
//   }

//   // No sections found
//   if (sections.length === 0) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <h2 className="text-2xl font-bold text-gray-600 mb-4">No Content Available</h2>
//           <p className="text-gray-500">This page doesn't have any published content yet.</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       {/* Breadcrumb Section */}
//       {breadcrumbSection && (
//         <Breadcrumbs
//           title={breadcrumbSection.title || "About Us"}
//           description={breadcrumbSection.description || "Learn more about our company"}
//           backgroundImageUrl={breadcrumbSection.backgroundImageUrl || "/images/default-breadcrumb.jpg"}
//           pageName="About Us"
//         />
//       )}

//       {/* Our Story Section */}
//       {ourStorySection && (
//         <section className="bg-[#FAF4EB] py-10 sm:py-20 text-center">
//           <div className="container">
//             {ourStorySection.title && (
//               <h2 className="font-cinzel text-2xl sm:text-3xl lg:text-[50px] leading-snug text-center">
//                 {(() => {
//                   // Simple way to split title like "OUR STORY" into "OUR" and "STORY"
//                   const titleParts = ourStorySection.title.split(" ");
//                   const firstWord = titleParts.shift();
//                   const restOfTitle = titleParts.join(" ");
                  
//                   return (
//                     <>
//                       <span className="font-normal text-[#151515]">{firstWord} </span>
//                       <span className="font-bold text-[#CDB04E]">{restOfTitle}</span>
//                     </>
//                   );
//                 })()}
//               </h2>
//             )}

//             {ourStorySection.description && (
//               <div className="font-josefin text-center mt-4 text-[#151515] description-text">
//                 {parse(ourStorySection.description)}
//               </div>
//             )}

//             {ourStorySection.mediaUrl && (
//               <div className="mt-12 flex justify-center">
//                 <div className="w-full rounded-xl overflow-hidden shadow-xl">
//                   {ourStorySection.mediaType === "video" ? (
//                     <video
//                       src={ourStorySection.mediaUrl}
//                       autoPlay
//                       muted
//                       playsInline
//                       loop
//                       className="w-full h-full object-cover"
//                     />
//                   ) : (
//                     <img
//                       src={ourStorySection.mediaUrl}
//                       alt={ourStorySection.title || "Our Story"}
//                       className="w-full h-full object-cover"
//                     />
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>
//         </section>
//       )}

//       {/* Render any additional sections that might be added in the future */}
//       {sections
//         .filter(section => !['breadcrumb', 'our-story'].includes(section.slug))
//         .map((section) => (
//           <div key={section._id}>
//             {/* You can add more section renderers here as needed */}
//             <div className="py-10">
//               <div className="container">
//                 <h3 className="text-2xl font-bold mb-4">{section.name}</h3>
//                 <p className="text-gray-600">Section type: {section.type}</p>
//                 {/* Add specific rendering logic for other section types */}
//               </div>
//             </div>
//           </div>
//         ))}
//     </>
//   );
// }