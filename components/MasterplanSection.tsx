"use client";

import { useState } from "react";
import { motion, Variants } from "framer-motion";

const MasterplanSection = () => {
  // State to manage the currently active tab, initialized to '3' (Common Zones)
  const [activeTab, setActiveTab] = useState(3);

  // Updated features array with image sources for each tab
  const features = [
    {
      id: 1,
      title: "Luxury Condominiums",
      imgSrc: "/images/highlights/bg.jpg",
    },
    {
      id: 2,
      title: "Premium Residences by Dusit International",
      imgSrc: "/images/highlights/bg.jpg",
    },
    {
      id: 3,
      title: "Common Zones",
      subtitle: "Shopping Centre",
      subtitle2: "Spa & Villa",
      imgSrc: "/images/highlights/bg.jpg",
    },
    {
      id: 4,
      title: "Integrated Amenities",
      imgSrc: "/images/highlights/bg.jpg",
    },
    {
      id: 5,
      title: "Exclusive Ocean Club",
      imgSrc: "/images/highlights/bg.jpg",
    },
  ];

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
      className="relative w-full py-24"
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
            className="text-center mb-16 px-6"
          >
            <h2 className="font-cinzel text-3xl md:text-4xl lg:text-[40px] font-normal text-white mb-4">
              A MASTERPLAN THAT BLENDS NATURE,{" "}
              <span className="text-primary font-bold">
                WELLNESS &amp; HOSPITALITY
              </span>
            </h2>
            <p className="font-josefin font-light text-white text-sm md:text-base max-w-4xl mx-auto leading-relaxed">
              At Layan Verde, architecture and nature blend seamlessly. The
              master plan features luxury residences, hotel-managed units,
              lifestyle amenities, and lush green spaces — all designed for a
              resort-style experience in Phuket.
            </p>
          </motion.div>

          {/* Interactive Tabs Section */}
          <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-5">
            {features.map((feature) => (
              <motion.div
                key={feature.id}
                layout // This prop enables the magic layout animation
                onClick={() => setActiveTab(feature.id)}
                className="w-full rounded-2xl overflow-hidden cursor-pointer"
                transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
              >
                {activeTab === feature.id ? (
                  // --- ACTIVE TAB VIEW ---
                  <motion.div
                    style={{ backgroundImage: `url(${feature.imgSrc})` }}
                    className="relative w-full h-[600px] bg-center bg-cover flex items-center justify-center"
                    initial={{ opacity: 0.8 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {/* Dark overlay for text readability */}
                    <div className="bg-black/50 w-full h-full inset-0 absolute"></div>
                    <div className="font-josefin text-center z-10 p-4">
                      <motion.h3
                        layoutId={`title-${feature.id}`} // Match layoutId for smooth title transition
                        className="text-3xl md:text-6xl font-normal text-white mb-10"
                      >
                        {feature.title}
                      </motion.h3>
                      {/* Subtitles for Common Zones */}
                      {feature.subtitle && (
                        <motion.p
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4, duration: 0.5 }}
                          className="text-white font-medium text-2xl mb-1"
                        >
                          C1 -{" "}
                          <span className="font-light">{feature.subtitle}</span>
                        </motion.p>
                      )}
                      {feature.subtitle2 && (
                        <motion.p
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5, duration: 0.5 }}
                          className="text-white font-medium text-2xl"
                        >
                          C2 -{" "}
                          <span className="font-light">
                            {feature.subtitle2}
                          </span>
                        </motion.p>
                      )}
                    </div>
                  </motion.div>
                ) : (
                  // --- INACTIVE TAB VIEW ---
                  <div className="relative group w-full h-[180px] flex items-center justify-center text-center bg-background hover:bg-[#024f53] transition-colors duration-300">
                    {/* Background image revealed on hover */}
                    <div
                      style={{ backgroundImage: `url(${feature.imgSrc})` }}
                      className="absolute inset-0 bg-cover bg-center opacity-0 group-hover:opacity-20 transition-opacity duration-500 ease-in-out"
                    />
                    <motion.h3
                      layoutId={`title-${feature.id}`} // Match layoutId for smooth title transition
                      className="relative z-10 font-josefin text-2xl md:text-4xl font-normal text-white leading-tight p-4"
                    >
                      {feature.title}
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
