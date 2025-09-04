"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface ProjectHighlightsProps {
  project: {
    name: string;
    projectDetail?: {
      projectHighlights?: {
        backgroundImage?: string;
        description?: string;
        highlights?: Array<{
          image: string;
          title: string;
        }>;
      };
    };
  };
}

export default function ProjectHighlights({ project }: ProjectHighlightsProps) {
  const highlightsData = project.projectDetail?.projectHighlights;
  const projectName = project.name;
  
  // Default values
  const highlights = highlightsData?.highlights || [];
  const description = highlightsData?.description || 
    `${projectName} is a luxury development, set in lush tropical greenery. Managed by top hospitality brands, it blends five-star living with natural serenity. Each unit features curated landscapes, wellness-focused design, and premium amenities.`;

  if (highlights.length === 0) {
    return null; // Don't render if no highlights
  }

  return (
    <section className="bg-background text-white sm:py-16">
      <div className="container">
        <div className="font-cinzel text-center space-y-2 sm:space-y-4">
          <h2 className="text-2xl sm:text-3xl lg:text-[50px] font-normal uppercase text-center">
            Discover Tranquility at{" "}
            <span className="text-primary font-bold">
              {projectName}
            </span>
          </h2>
          <div 
            className="font-josefin lowercase text-white description-text text-center"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-6 mt-6 sm:mt-12">
          {highlights.map((highlight, index) => (
            <HoverImageCard 
              key={index} 
              defaultImage={highlight.image}
              hoverImage={highlight.image} // Using same image for hover, you can modify this
              title={highlight.title}
            />
          ))}
        </div>
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
      className="relative overflow-hidden rounded-2xl group cursor-pointer shadow-lg"
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
        <h3 className="text-white text-lg font-semibold">{title}</h3>
      </div>
    </motion.div>
  );
};