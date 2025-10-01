// "use client";

// import { motion } from "framer-motion";
// import Image from "next/image";

// interface ProjectHighlightsProps {
//   project: {
//     name: string;
//     projectDetail?: {
//       projectHighlights?: {
//         backgroundImage?: string;
//         description?: string;
//         highlights?: Array<{
//           image: string;
//           title: string;
//         }>;
//       };
//     };
//   };
// }

// export default function ProjectHighlights({ project }: ProjectHighlightsProps) {
//   const highlightsData = project.projectDetail?.projectHighlights;
//   const projectName = project.name;
  
//   // Default values
//   const highlights = highlightsData?.highlights || [];
//   const description = highlightsData?.description || 
//     `${projectName} is a luxury development, set in lush tropical greenery. Managed by top hospitality brands, it blends five-star living with natural serenity. Each unit features curated landscapes, wellness-focused design, and premium amenities.`;

//   if (highlights.length === 0) {
//     return null; // Don't render if no highlights
//   }

//   return (
//     <section className="bg-background text-white sm:py-16">
//       <div className="container">
//         <div className="font-cinzel text-center space-y-2 sm:space-y-4">
//           <h2 className="text-2xl sm:text-3xl lg:text-[50px] font-normal uppercase text-center">
//             Discover Tranquility at{" "}
//             <span className="text-primary font-bold">
//               {projectName}
//             </span>
//           </h2>
//           <div 
//             className="font-josefin lowercase text-white description-text text-center"
//             dangerouslySetInnerHTML={{ __html: description }}
//           />
//         </div>

//         <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-6 mt-6 sm:mt-12">
//           {highlights.map((highlight, index) => (
//             <HoverImageCard 
//               key={index} 
//               defaultImage={highlight.image}
//               hoverImage={highlight.image} // Using same image for hover, you can modify this
//               title={highlight.title}
//             />
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

// const HoverImageCard = ({
//   defaultImage,
//   hoverImage,
//   title,
// }: {
//   defaultImage: string;
//   hoverImage: string;
//   title: string;
// }) => {
//   return (
//     <motion.div
//       className="relative overflow-hidden rounded-2xl group cursor-pointer shadow-lg font-josefin"
//       whileHover="hover"
//       initial="rest"
//       animate="rest"
//     >
//       <motion.div
//         className="w-full h-50 sm:h-72 md:h-80 bg-gradient-to-b from-[#00000000] to-[#000000]"
//         variants={{
//           rest: { opacity: 1 },
//           hover: { opacity: 0 },
//         }}
//         transition={{ duration: 0.4 }}
//       >
//         <Image
//           src={defaultImage}
//           alt={title}
//           width={500}
//           height={500}
//           className="w-full h-full object-cover"
//         />
//       </motion.div>

//       <motion.div
//         className="absolute inset-0 w-full h-full"
//         variants={{
//           rest: { opacity: 0 },
//           hover: { opacity: 1 },
//         }}
//         transition={{ duration: 0.4 }}
//       >
//         <Image
//           src={hoverImage}
//           alt={title}
//           width={500}
//           height={500}
//           className="w-full h-full object-cover"
//         />
//       </motion.div>

//       <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4">
//         <h3 className="text-white text-lg font-semibold font-josefin">{title}</h3>
//       </div>
//     </motion.div>
//   );
// };

// "use client";

// import { motion, AnimatePresence } from "framer-motion";
// import Image from "next/image";
// import { useState } from "react";

// interface ProjectTabsProps {
//   project: {
//     name: string;
//   };
// }

// // Mock data for the tabs - replace with your CMS data
// const tabsData = [
//   {
//     id: "amenities",
//     label: "Amenities",
//     items: [
//       {
//         image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
//         title: "Infinity Pool",
//       },
//       {
//         image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&q=80",
//         title: "Fitness Center",
//       },
//       {
//         image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
//         title: "Spa & Wellness",
//       },
//       {
//         image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80",
//         title: "Clubhouse",
//       },
//       {
//         image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&q=80",
//         title: "Garden Terrace",
//       },
//       {
//         image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
//         title: "Kids Play Area",
//       },
//     ],
//   },
//   {
//     id: "external",
//     label: "External",
//     items: [
//       {
//         image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
//         title: "Building Facade",
//       },
//       {
//         image: "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&q=80",
//         title: "Entrance Plaza",
//       },
//       {
//         image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
//         title: "Landscape Design",
//       },
//       {
//         image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&q=80",
//         title: "Outdoor Lounge",
//       },
//       {
//         image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80",
//         title: "Walking Paths",
//       },
//       {
//         image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80",
//         title: "Night View",
//       },
//     ],
//   },
//   {
//     id: "internal",
//     label: "Internal",
//     items: [
//       {
//         image: "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&q=80",
//         title: "Living Room",
//       },
//       {
//         image: "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=800&q=80",
//         title: "Master Bedroom",
//       },
//       {
//         image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80",
//         title: "Modern Kitchen",
//       },
//       {
//         image: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&q=80",
//         title: "Bathroom Suite",
//       },
//       {
//         image: "https://images.unsplash.com/photo-1600210491369-e753d80a41f3?w=800&q=80",
//         title: "Dining Area",
//       },
//       {
//         image: "https://images.unsplash.com/photo-1600566752229-250ed79174a5?w=800&q=80",
//         title: "Walk-in Closet",
//       },
//     ],
//   },
//   {
//     id: "layouts",
//     label: "Layouts",
//     items: [
//       {
//         image: "https://images.unsplash.com/photo-1503174971373-b1f69850bded?w=800&q=80",
//         title: "1 Bedroom Layout",
//       },
//       {
//         image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
//         title: "2 Bedroom Layout",
//       },
//       {
//         image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80",
//         title: "3 Bedroom Layout",
//       },
//       {
//         image: "https://images.unsplash.com/photo-1600566753151-384129cf4e3e?w=800&q=80",
//         title: "Penthouse Layout",
//       },
//       {
//         image: "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=800&q=80",
//         title: "Duplex Layout",
//       },
//       {
//         image: "https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=800&q=80",
//         title: "Studio Layout",
//       },
//     ],
//   },
// ];

// export default function ProjectTabsSection({ project }: ProjectTabsProps) {
//   const [activeTab, setActiveTab] = useState(tabsData[0].id);
//   const projectName = project.name;

//   const activeTabData = tabsData.find((tab) => tab.id === activeTab);

//   return (
//     <section className="bg-background text-white py-12 sm:py-16">
//       <div className="container">
//         <div className="font-cinzel text-center space-y-2 sm:space-y-4 mb-8 sm:mb-12">
//           <h2 className="text-2xl sm:text-3xl lg:text-[50px] font-normal uppercase text-center">
//             Discover Tranquility at{" "}
//             <span className="text-primary font-bold">{projectName}</span>
//           </h2>
//         </div>

//         {/* Premium Tabs */}
//         <div className="flex justify-center mb-8 sm:mb-12">
//           <div className="inline-flex gap-1 sm:gap-2 p-1.5 sm:p-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
//             {tabsData.map((tab) => (
//               <button
//                 key={tab.id}
//                 onClick={() => setActiveTab(tab.id)}
//                 className="relative px-4 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base font-josefin font-medium transition-colors duration-300 rounded-full"
//               >
//                 {activeTab === tab.id && (
//                   <motion.div
//                     layoutId="activeTab"
//                     className="absolute inset-0 bg-primary rounded-full"
//                     transition={{
//                       type: "spring",
//                       stiffness: 380,
//                       damping: 30,
//                     }}
//                   />
//                 )}
//                 <span
//                   className={`relative z-10 transition-colors duration-300 ${
//                     activeTab === tab.id ? "text-white" : "text-white/60"
//                   }`}
//                 >
//                   {tab.label}
//                 </span>
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Tab Content */}
//         <AnimatePresence mode="wait">
//           <motion.div
//             key={activeTab}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -20 }}
//             transition={{
//               duration: 0.5,
//               ease: [0.25, 0.46, 0.45, 0.94],
//             }}
//             className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-6"
//           >
//             {activeTabData?.items.map((item, index) => (
//               <motion.div
//                 key={`${activeTab}-${index}`}
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 transition={{
//                   duration: 0.4,
//                   delay: index * 0.1,
//                   ease: [0.25, 0.46, 0.45, 0.94],
//                 }}
//               >
//                 <HoverImageCard
//                   defaultImage={item.image}
//                   hoverImage={item.image}
//                   title={item.title}
//                 />
//               </motion.div>
//             ))}
//           </motion.div>
//         </AnimatePresence>
//       </div>
//     </section>
//   );
// }

// const HoverImageCard = ({
//   defaultImage,
//   hoverImage,
//   title,
// }: {
//   defaultImage: string;
//   hoverImage: string;
//   title: string;
// }) => {
//   return (
//     <motion.div
//       className="relative overflow-hidden rounded-2xl group cursor-pointer shadow-lg font-josefin"
//       whileHover="hover"
//       initial="rest"
//       animate="rest"
//     >
//       <motion.div
//         className="w-full h-50 sm:h-72 md:h-80 bg-gradient-to-b from-[#00000000] to-[#000000]"
//         variants={{
//           rest: { opacity: 1 },
//           hover: { opacity: 0 },
//         }}
//         transition={{ duration: 0.4 }}
//       >
//         <Image
//           src={defaultImage}
//           alt={title}
//           width={500}
//           height={500}
//           className="w-full h-full object-cover"
//         />
//       </motion.div>

//       <motion.div
//         className="absolute inset-0 w-full h-full"
//         variants={{
//           rest: { opacity: 0 },
//           hover: { opacity: 1 },
//         }}
//         transition={{ duration: 0.4 }}
//       >
//         <Image
//           src={hoverImage}
//           alt={title}
//           width={500}
//           height={500}
//           className="w-full h-full object-cover"
//         />
//       </motion.div>

//       <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4">
//         <h3 className="text-white text-lg font-semibold font-josefin">
//           {title}
//         </h3>
//       </div>
//     </motion.div>
//   );
// };

"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface ProjectTabsProps {
  project: {
    name: string;
  };
}

// Mock data for the tabs - replace with your CMS data
const tabsData = [
  {
    id: "amenities",
    label: "Amenities",
    items: [
      {
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
        title: "Infinity Pool",
      },
      {
        image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&q=80",
        title: "Fitness Center",
      },
      {
        image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
        title: "Spa & Wellness",
      },
      {
        image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80",
        title: "Clubhouse",
      },
      {
        image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&q=80",
        title: "Garden Terrace",
      },
      {
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
        title: "Kids Play Area",
      },
    ],
  },
  {
    id: "external",
    label: "External",
    items: [
      {
        image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
        title: "Building Facade",
      },
      {
        image: "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&q=80",
        title: "Entrance Plaza",
      },
      {
        image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
        title: "Landscape Design",
      },
      {
        image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&q=80",
        title: "Outdoor Lounge",
      },
      {
        image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80",
        title: "Walking Paths",
      },
      {
        image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80",
        title: "Night View",
      },
    ],
  },
  {
    id: "internal",
    label: "Internal",
    items: [
      {
        image: "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&q=80",
        title: "Living Room",
      },
      {
        image: "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=800&q=80",
        title: "Master Bedroom",
      },
      {
        image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80",
        title: "Modern Kitchen",
      },
      {
        image: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&q=80",
        title: "Bathroom Suite",
      },
      {
        image: "https://images.unsplash.com/photo-1600210491369-e753d80a41f3?w=800&q=80",
        title: "Dining Area",
      },
      {
        image: "https://images.unsplash.com/photo-1600566752229-250ed79174a5?w=800&q=80",
        title: "Walk-in Closet",
      },
    ],
  },
  {
    id: "layouts",
    label: "Layouts",
    items: [
      {
        image: "https://images.unsplash.com/photo-1503174971373-b1f69850bded?w=800&q=80",
        title: "1 Bedroom Layout",
      },
      {
        image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
        title: "2 Bedroom Layout",
      },
      {
        image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80",
        title: "3 Bedroom Layout",
      },
      {
        image: "https://images.unsplash.com/photo-1600566753151-384129cf4e3e?w=800&q=80",
        title: "Penthouse Layout",
      },
      {
        image: "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=800&q=80",
        title: "Duplex Layout",
      },
      {
        image: "https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=800&q=80",
        title: "Studio Layout",
      },
    ],
  },
];

export default function ProjectTabsSection({ project }: ProjectTabsProps) {
  const [activeTab, setActiveTab] = useState(tabsData[0].id);
  const projectName = project.name;

  const activeTabData = tabsData.find((tab) => tab.id === activeTab);

  const handleTabChange = (tabId: string) => {
    if (activeTab === tabId) return;
    setActiveTab(tabId);
  };

  return (
    <section className="bg-background text-white py-12 sm:py-16">
      <div className="container">
        <div className="font-cinzel text-center space-y-2 sm:space-y-4 mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-[50px] font-normal uppercase text-center">
            Discover Tranquility at{" "}
            <span className="text-primary font-bold">{projectName}</span>
          </h2>
        </div>

        {/* Region-style Tabs */}
        <div className="flex justify-center items-center mb-10 px-4 overflow-x-auto">
          {tabsData.map((tab) => {
            const isActive = activeTab === tab.id;
            const itemCount = tab.items.length;

            return (
              <Button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                variant="ghost"
                className={`font-josefin relative rounded-none px-2 sm:px-10 py-6 sm:py-8 font-medium border-y-2 transition-colors duration-300 text-sm sm:text-[22px]
                  ${
                    isActive
                      ? "border-white text-white"
                      : "border-white/50 border-y-[1.2px] text-white/80"
                  }
                  cursor-pointer hover:text-primary`}
              >
                <span className="flex items-center gap-2">
                  {tab.label}
                  <span className="text-[10px] sm:text-xs bg-white/10 px-2 py-0.5 rounded-full">
                    {itemCount}
                  </span>
                </span>
              </Button>
            );
          })}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{
              duration: 0.5,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-6"
          >
            {activeTabData?.items.map((item, index) => (
              <motion.div
                key={`${activeTab}-${index}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.1,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
              >
                <HoverImageCard
                  defaultImage={item.image}
                  hoverImage={item.image}
                  title={item.title}
                />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

const HoverImageCard = ({
  defaultImage,
  hoverImage,
  title,
}: {
  defaultImage: string;
  hoverImage: string;
  title: string;
}) => {
  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl group cursor-pointer shadow-lg font-josefin"
      whileHover="hover"
      initial="rest"
      animate="rest"
    >
      <motion.div
        className="w-full h-50 sm:h-72 md:h-80 bg-gradient-to-b from-[#00000000] to-[#000000]"
        variants={{
          rest: { opacity: 1 },
          hover: { opacity: 0 },
        }}
        transition={{ duration: 0.4 }}
      >
        <Image
          src={defaultImage}
          alt={title}
          width={500}
          height={500}
          className="w-full h-full object-cover"
        />
      </motion.div>

      <motion.div
        className="absolute inset-0 w-full h-full"
        variants={{
          rest: { opacity: 0 },
          hover: { opacity: 1 },
        }}
        transition={{ duration: 0.4 }}
      >
        <Image
          src={hoverImage}
          alt={title}
          width={500}
          height={500}
          className="w-full h-full object-cover"
        />
      </motion.div>

      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4">
        <h3 className="text-white text-lg font-semibold font-josefin">
          {title}
        </h3>
      </div>
    </motion.div>
  );
};