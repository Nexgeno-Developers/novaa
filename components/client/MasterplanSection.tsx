"use client";

import { useState } from "react";
import { motion, Variants } from "framer-motion";

interface MasterPlanTab {
  title: string;
  subtitle?: string;
  subtitle2?: string;
  image: string;
}

interface Project {
  _id: string;
  name: string;
  projectDetail?: {
    masterPlan: {
      title: string;
      subtitle: string;
      description: string;
      backgroundImage: string;
      tabs: MasterPlanTab[];
    };
  };
}

interface MasterplanSectionProps {
  project: Project;
}

const MasterplanSection = ({ project }: MasterplanSectionProps) => {
  // Set the first tab as active by default, or null if no tabs
  const [activeTab, setActiveTab] = useState(
    project.projectDetail?.masterPlan?.tabs?.length ? 0 : null
  );
  const [hoveredTab, setHoveredTab] = useState<number | null>(null);

  const masterPlan = project.projectDetail?.masterPlan;

  // Return null if no master plan data or no tabs
  if (!masterPlan || !masterPlan.tabs || masterPlan.tabs.length === 0) {
    return null;
  }

  // Animation variants for the header text
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <section
      className="relative w-full sm:py-20"
      style={{ backgroundColor: "#01292B" }}
    >
      {/* Content Container */}
      <div className="relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Header */}
          <motion.div
            variants={itemVariants}
            className="text-center mb-4 sm:mb-16 px-6"
          >
            {masterPlan.title && masterPlan.subtitle && (
              <h2 className="font-cinzel text-2xl sm:text-3xl lg:text-[50px] font-normal text-white mb-4 px-4">
                {masterPlan.title}{" "}
                <span className="text-primary">{masterPlan.subtitle}</span>
              </h2>
            )}
            {/* {masterPlan.subtitle && (
              <h3 className="font-cinzel text-xl sm:text-2xl lg:text-[35px] font-normal text-primary mb-4 px-4">
               
              </h3>
            )} */}
            {masterPlan.description && (
              <div
                className="font-josefin text-white max-w-4xl mx-auto description-text"
                dangerouslySetInnerHTML={{ __html: masterPlan.description }}
              />
            )}
          </motion.div>

          {/* Interactive Tabs Section */}
          <div className="w-full flex flex-col items-center">
            {masterPlan.tabs.map((tab, index) => (
              <motion.div
                key={index}
                layout // This prop enables the magic layout animation
                onMouseEnter={() => {
                  setHoveredTab(index);
                  setActiveTab(index);
                }}
                onMouseLeave={() => setHoveredTab(null)}
                className="w-full overflow-hidden cursor-pointer"
                transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                {activeTab === index ? (
                  // --- ACTIVE TAB VIEW ---
                  <motion.div
                    style={{ backgroundImage: `url(${tab.image})` }}
                    className="relative w-full h-[400px] sm:h-[600px] bg-center bg-cover flex items-center justify-center"
                    initial={{ opacity: 0.8 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  >
                    {/* Dark overlay for text readability */}
                    <div className="bg-black/50 w-full h-full inset-0 absolute"></div>
                    <div className="font-josefin text-center z-10 p-4">
                      <motion.h3
                        layoutId={`title-${index}`} // Match layoutId for smooth title transition
                        className="text-3xl md:text-6xl font-normal text-white mb-10"
                      >
                        {tab.title}
                      </motion.h3>
                      {/* Subtitles */}
                      {tab.subtitle && (
                        <motion.p
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2, duration: 0.4 }}
                          className="text-white font-medium text-base sm:text-2xl mb-1"
                        >
                         
                          <span className="font-light">{tab.subtitle}</span>
                        </motion.p>
                      )}
                      {tab.subtitle2 && (
                        <motion.p
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3, duration: 0.4 }}
                          className="text-white font-medium text-base sm:text-2xl"
                        >
                          
                          <span className="font-light">{tab.subtitle2}</span>
                        </motion.p>
                      )}
                    </div>
                  </motion.div>
                ) : (
                  // --- INACTIVE TAB VIEW ---
                  <div className="relative group w-full h-[100px] sm:h-[180px] flex items-center justify-center text-center bg-background hover:bg-[#024f53] transition-all duration-300">
                    {/* Background image revealed on hover */}
                    <div
                      style={{ backgroundImage: `url(${tab.image})` }}
                      className="absolute inset-0 bg-cover bg-center opacity-0 group-hover:opacity-20 transition-opacity duration-400 ease-out"
                    />
                    <motion.h3
                      layoutId={`title-${index}`} // Match layoutId for smooth title transition
                      className="relative z-10 font-josefin text-2xl md:text-4xl font-normal text-white leading-tight p-4 transition-all duration-300 group-hover:scale-105"
                    >
                      {tab.title}
                    </motion.h3>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MasterplanSection;
