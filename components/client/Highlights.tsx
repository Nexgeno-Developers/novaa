"use client";

import { motion, Variants } from "framer-motion";
import Image from "next/image";

interface HighlightsProps {
  project: {
    name: string;
    projectDetail?: {
      keyHighlights?: {
        backgroundImage?: string;
        description?: string;
        highlights?: Array<{
          text: string;
        }>;
      };
    };
  };
}

const Highlights: React.FC<HighlightsProps> = ({ project }) => {
  const highlightsData = project.projectDetail?.keyHighlights;
  const projectName = project.name;

  // Default values
  const backgroundImage = highlightsData?.backgroundImage || '/images/highlights/bg.jpg';
  const description = highlightsData?.description || 
    "Is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.";
  
  const highlights = highlightsData?.highlights || [
    { text: "1 & 2 BHK premium apartments" },
    { text: "Vastu-compliant homes" },
    { text: "G+4 storey towers" },
    { text: "Prime Location" },
    { text: "Surrounded by nature and green zones" },
    { text: "Modern amenities and facilities" }
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        duration: 0.6,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 30,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  if (highlights.length === 0) {
    return null; // Don't render if no highlights
  }

  return (
    <section className="relative w-full overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('${backgroundImage}')`,
        }}
      />

      {/* Color Overlay */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{ backgroundColor: "#01292BCC" }}
      />

      {/* Top to Bottom Gradient */}
      <div className="absolute inset-0 w-full h-1/3 bg-gradient-to-b from-[#01292B] to-[#01292B00]" />

      {/* Bottom to Top Gradient */}
      <div className="absolute inset-x-0 bottom-0 w-full h-1/4 bg-gradient-to-t from-[#01292B] to-[#01292B00]" />

      {/* Content Container */}
      <div className="relative z-10 container py-10 sm:py-20 flex flex-col sm:justify-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="mb-2 sm:mb-16">
            <h2 className="font-cinzel text-2xl sm:text-3xl lg:text-[50px] font-normal text-white mb-6 text-center sm:text-left">
              PROJECT <span className="text-primary font-bold">HIGHLIGHTS</span>
            </h2>
            <div 
              className="font-josefin text-white description-text max-w-2xl text-center sm:text-left"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          </motion.div>

          {/* Highlights Grid */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-8 lg:gap-12"
          >
            {highlights.map((highlight, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flex items-center space-x-4 group"
              >
                <div className="flex-shrink-0 mt-1">
                  <Image
                    src="/icons/checked-icon.svg"
                    alt="pin icon"
                    width={30}
                    height={30}
                  />
                </div>
                <p className="font-josefin text-white text-base md:text-xl font-normal leading-relaxed group-hover:text-primary transition-colors duration-300">
                  {highlight.text}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Highlights;