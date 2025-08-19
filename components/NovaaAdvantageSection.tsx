// components/public/NovaaAdvantageSection.tsx
"use client";

import React, { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import Image from "next/image";
import { WaterEffectImage } from "./WaterEffectImage"; // Assuming this is in the same folder

// Types matching the backend model
interface AdvantageItem {
  _id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
}

interface AdvantageData {
  title: string;
    highlightedTitle: string;
  description: string;
  backgroundImage: string;
  logoImage: string;
  advantages: AdvantageItem[];
}

// These layout properties are static and based on order, not from the DB
const layoutProperties = [
    { position: "top-left" },
    { position: "top-right" },
    { position: "left" },
    { position: "right" },
    { position: "bottom-left" },
    { position: "bottom-right" },
];

const NovaaAdvantageSection = () => {
  const [data, setData] = useState<AdvantageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/cms/advantage');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const fetchedData = await response.json();
        // Sort advantages by the order field from the DB
        fetchedData.advantages.sort((a: AdvantageItem, b: AdvantageItem) => a.order - b.order);
        setData(fetchedData);
      } catch (error) {
        console.error("Failed to fetch advantage section data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  
  // Helper functions remain the same
  const getPositionClasses = (position: string) => {
    const baseClasses = "absolute flex items-center";
    switch (position) {
      case "top-left": return `${baseClasses} top-6 left-8 md:top-0 md:left-0 lg:top-[-4] lg:left-8`;
      case "top-right": return `${baseClasses} top-6 right-8 md:top-0 md:-right-8 lg:top-[-4] lg:right-8`;
      case "left": return `${baseClasses} top-1/2 left-4 md:left-0 lg:left-[-2rem] transform -translate-y-1/2`;
      case "right": return `${baseClasses} top-1/2 right-4 md:-right-10 lg:right-[-2rem] transform -translate-y-1/2`;
      case "bottom-left": return `${baseClasses} bottom-8 left-8 md:bottom-0 lg:bottom-0 lg:left-[2rem]`;
      case "bottom-right": return `${baseClasses} bottom-8 right-8 md:bottom-0 md:-right-10 lg:bottom-0 lg:right-[2rem]`;
      default: return baseClasses;
    }
  };

  const getContentPosition = (position: string) => {
    switch (position) {
      case "top-left": return "flex-row";
      case "top-right": return "flex-row-reverse";
      case "left": return "flex-row";
      case "right": return "flex-row-reverse";
      case "bottom-left": return "flex-row";
      case "bottom-right": return "flex-row-reverse";
      default: return "flex-row";
    }
  };

  // Animation variants remain the same
  const containerVariants: Variants = { /* ... as before ... */ };
  const itemVariants: Variants = { /* ... as before ... */ };
  const centerVariants: Variants = { /* ... as before ... */ };

  if (loading) {
    // You can add a skeleton loader here for better UX
    return <section className="font-cinzel relative bg-secondary py-10 lg:py-20 overflow-hidden text-center">Loading Advantages...</section>;
  }

  if (!data) {
    return null; // Or show an error message
  }

  return (
    <section className="font-cinzel relative bg-secondary py-10 lg:py-20 overflow-hidden">
      <div className="container">
        {/* Header */}
        <motion.div
          className="text-center mb-10 lg:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Use dangerouslySetInnerHTML to render HTML from title */}
           <h2 className="text-2xl sm:text-3xl lg:text-[50px] font-normal text-[#303030] mb-4">
            {data.title}{' '}
            <span className="font-bold bg-clip-text text-transparent bg-[#D4AF37]">
              {data.highlightedTitle}
            </span>
          </h2>

          {/* Use dangerouslySetInnerHTML for the description from TinyMCE */}
          <div className="font-josefin text-[#303030] description-text text-center"
               dangerouslySetInnerHTML={{ __html: data.description }}
          />
        </motion.div>

        {/* Main Content Area */}
        <motion.div
          className="relative"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Central Circle */}
          <motion.div
            className="relative mx-auto w-60 h-60 xs:w-70 xs:h-70 sm:w-80 sm:h-80 lg:w-96 lg:h-96 xl:w-[428px] xl:h-[428px]"
            variants={centerVariants}
          >
            <div className="relative w-60 h-60 xs:w-70 xs:h-70 sm:w-80 sm:h-80 md:w-[380px] md:h-[380px] xl:w-[420px] xl:h-[420px] flex items-center justify-center before:content-[''] before:absolute before:inset-[-12px] before:rounded-full before:border-1 before:border-[#01292B] before:z-0">
              <div className="w-full h-full rounded-full overflow-hidden shadow-2xl relative z-10">
                <WaterEffectImage
                  backgroundSrc={data.backgroundImage}
                  logoSrc={data.logoImage}
                  className="w-full h-full"
                  alt="Advantage Section Background"
                />
              </div>
            </div>
          </motion.div>

          {/* Advantage Items */}
          {data.advantages.map((advantage, index) => {
            const layout = layoutProperties[index % layoutProperties.length]; // Cycle through positions
            return (
              <motion.div
                key={advantage._id}
                className={getPositionClasses(layout.position)}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <div
                  className={`${getContentPosition(layout.position)} hidden md:flex gap-4 font-josefin max-w-[250px] lg:max-w-sm xl:max-w-[400px] space-x-2`}
                >
                  <div className="font-josefin space-y-2">
                    <h3 className="text-sm md:text-lg lg:text-xl font-normal text-background">
                      {advantage.title}
                    </h3>
                    <div className="text-[#303030] description-text"
                         dangerouslySetInnerHTML={{ __html: advantage.description }}
                    />
                  </div>
                  <div className="hidden flex-shrink-0 w-16 h-16 lg:w-24 lg:h-24 rounded-full lg:flex items-center justify-center shadow-lg">
                    <Image src={advantage.icon} width={100} height={100} alt="icon" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Mobile Layout */}
        <div className="md:hidden mt-10">
          <motion.div
            className="grid grid-cols-1"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {data.advantages.map((advantage) => (
              <motion.div
                key={`mobile-${advantage._id}`}
                className="bg-white rounded-xl p-2 my-2 shadow-lg"
                variants={itemVariants}
              >
                <div className="font-josefin flex items-center space-x-4">
                  <div className="flex items-center justify-between gap-4 py-2">
                    <Image src={advantage.icon} width={60} height={60} alt="icon" />
                    <div className="flex flex-col">
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                        {advantage.title}
                      </h3>
                      <div className="font-josefin description-text text-[#303030]"
                           dangerouslySetInnerHTML={{ __html: advantage.description }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default NovaaAdvantageSection;