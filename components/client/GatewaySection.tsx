"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Image from "next/image";

interface GatewayLocation {
  name: string;
  image: string;
  coords: {
    top: string;
    left: string;
  };
  icon: string;
}

interface GatewayCategory {
  title: string;
  description: string;
  icon: string;
  locations: GatewayLocation[];
}

interface GatewaySectionProps {
  project?: {
    projectDetail?: {
      gateway?: {
        title: string;
        subtitle: string;
        highlightText: string;
        description: string;
        sectionTitle: string;
        sectionDescription: string;
        backgroundImage: string;
        mapImage: string;
        categories: GatewayCategory[];
      };
    };
  };
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const headingVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

const mapPinVariants: Variants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
};

// const categoryButtonVariants: Variants = {
//   hidden: { opacity: 0, x: -20 },
//   visible: {
//     opacity: 1,
//     x: 0,
//     transition: {
//       duration: 0.5,
//       ease: "easeOut",
//     },
//   },
// };

// Default data for fallback
const defaultGatewayData = {
  title: "A place to come home to",
  subtitle: "and a location that",
  highlightText: "holds its value.",
  description:
    "Set between Layan and Bangtao, this address offers more than scenery. It brings you close to Phuket's most lived-in stretch from cafés and golf courses to global schools and beach clubs.",
  sectionTitle: "Your Gateway to Paradise",
  sectionDescription:
    "Perfectly positioned where tropical elegance meets modern convenience, discover a world of luxury at your doorstep.",
  backgroundImage: "/gateway-images/background.png",
  mapImage: "/images/map2.png",
  categories: [
    {
      title: "Bangtao & Layan Beach",
      description: "Pristine white sand beaches just 5 minutes away",
      icon: "/gateway-images/curve.svg",
      locations: [
        {
          name: "Patong Beach",
          image: "https://placehold.co/200x150/C3912F/FFFFFF?text=Patong+Beach",
          coords: { top: "33%", left: "15%" },
          icon: "/icons/map-pin.svg",
        },
        {
          name: "Karon Beach",
          image: "https://placehold.co/200x150/C3912F/FFFFFF?text=Karon+Beach",
          coords: { top: "50%", left: "15%" },
          icon: "/icons/map-pin.svg",
        },
        {
          name: "Kata Beach",
          image: "https://placehold.co/200x150/C3912F/FFFFFF?text=Kata+Beach",
          coords: { top: "55%", left: "45%" },
          icon: "/icons/map-pin.svg",
        },
        {
          name: "Kamala Beach",
          image: "https://placehold.co/200x150/C3912F/FFFFFF?text=Kamala+Beach",
          coords: { top: "35%", left: "35%" },
          icon: "/icons/map-pin.svg",
        },
        {
          name: "Surin Beach",
          image: "https://placehold.co/200x150/C3912F/FFFFFF?text=Surin+Beach",
          coords: { top: "60%", left: "20%" },
          icon: "/icons/map-pin.svg",
        },
      ],
    },
    {
      title: "Phuket Airport",
      description: "International gateway 25 minutes by car",
      icon: "/gateway-images/airport.svg",
      locations: [
        {
          name: "Origin Project",
          image: "https://placehold.co/200x150/01292B/FFFFFF?text=Origin",
          coords: { top: "33%", left: "15%" },
          icon: "/icons/map-pin.svg",
        },
        {
          name: "Banyan Tree Hub",
          image: "https://placehold.co/200x150/01292B/FFFFFF?text=Banyan",
          coords: { top: "50%", left: "15%" },
          icon: "/icons/map-pin.svg",
        },
        {
          name: "Laguna Complex",
          image: "https://placehold.co/200x150/01292B/FFFFFF?text=Laguna",
          coords: { top: "55%", left: "45%" },
          icon: "/icons/map-pin.svg",
        },
        {
          name: "Central Mall",
          image: "https://placehold.co/200x150/01292B/FFFFFF?text=Central",
          coords: { top: "35%", left: "35%" },
          icon: "/icons/map-pin.svg",
        },
        {
          name: "Island Villas",
          image: "https://placehold.co/200x150/01292B/FFFFFF?text=Villas",
          coords: { top: "60%", left: "20%" },
          icon: "/icons/map-pin.svg",
        },
      ],
    },
    {
      title: "Laguna Golf Course",
      description: "Championship course within walking distance",
      icon: "/gateway-images/golf.svg",
      locations: [
        {
          name: "Golf Club House",
          image: "https://placehold.co/200x150/5B21B6/FFFFFF?text=Golf+Club",
          coords: { top: "33%", left: "15%" },
          icon: "/icons/map-pin.svg",
        },
        {
          name: "Pro Shop",
          image: "https://placehold.co/200x150/5B21B6/FFFFFF?text=Pro+Shop",
          coords: { top: "50%", left: "15%" },
          icon: "/icons/map-pin.svg",
        },
        {
          name: "18th Hole",
          image: "https://placehold.co/200x150/5B21B6/FFFFFF?text=18th+Hole",
          coords: { top: "55%", left: "45%" },
          icon: "/icons/map-pin.svg",
        },
        {
          name: "Golf Academy",
          image: "https://placehold.co/200x150/5B21B6/FFFFFF?text=Academy",
          coords: { top: "35%", left: "35%" },
          icon: "/icons/map-pin.svg",
        },
        {
          name: "Driving Range",
          image: "https://placehold.co/200x150/5B21B6/FFFFFF?text=Range",
          coords: { top: "60%", left: "20%" },
          icon: "/icons/map-pin.svg",
        },
      ],
    },
    {
      title: "Villa Market",
      description: "Premium shopping and dining experiences",
      icon: "/gateway-images/market.svg",
      locations: [
        {
          name: "Villa Market Center",
          image: "https://placehold.co/200x150/059669/FFFFFF?text=Villa+Market",
          coords: { top: "33%", left: "15%" },
          icon: "/icons/map-pin.svg",
        },
        {
          name: "Lotus Restaurant",
          image: "https://placehold.co/200x150/059669/FFFFFF?text=Lotus",
          coords: { top: "50%", left: "15%" },
          icon: "/icons/map-pin.svg",
        },
        {
          name: "Spa & Wellness",
          image: "https://placehold.co/200x150/059669/FFFFFF?text=Spa",
          coords: { top: "55%", left: "45%" },
          icon: "/icons/map-pin.svg",
        },
        {
          name: "Fashion Boutique",
          image: "https://placehold.co/200x150/059669/FFFFFF?text=Boutique",
          coords: { top: "35%", left: "35%" },
          icon: "/icons/map-pin.svg",
        },
        {
          name: "Coffee Corner",
          image: "https://placehold.co/200x150/059669/FFFFFF?text=Coffee",
          coords: { top: "60%", left: "20%" },
          icon: "/icons/map-pin.svg",
        },
      ],
    },
  ],
};

const GatewaySection: React.FC<GatewaySectionProps> = ({ project }) => {
  // Use project data if available, otherwise use default data
  const gatewayData = project?.projectDetail?.gateway || defaultGatewayData;

  const [activeCategory, setActiveCategory] = useState(0);
  const [hoveredPin, setHoveredPin] = useState<string | null>(null);

  // If no categories are available, use default data
  const categories =
    gatewayData.categories && gatewayData.categories.length > 0
      ? gatewayData.categories
      : defaultGatewayData.categories;

  // Ensure activeCategory doesn't exceed available categories
  const safeActiveCategory =
    activeCategory >= categories.length ? 0 : activeCategory;
  const currentCategory = categories[safeActiveCategory];

  // Handle category change with bounds checking
  const handleCategoryChange = (index: number) => {
    if (index >= 0 && index < categories.length) {
      setActiveCategory(index);
    }
  };

  // Split categories into two halves
  const firstHalf = categories.slice(0, Math.ceil(categories.length / 2));
  const secondHalf = categories.slice(Math.ceil(categories.length / 2));

  // Use default background and map images if not provided
  const backgroundImage =
    gatewayData.backgroundImage || defaultGatewayData.backgroundImage;
  const mapImage = gatewayData.mapImage || defaultGatewayData.mapImage;

  // Category Button Component for reusability
  const CategoryButton: React.FC<{
    category: GatewayCategory;
    index: number;
    isActive: boolean;
    delay?: number;
  }> = ({ category, index, isActive, delay = 0 }) => (
    <motion.button
      key={index}
      onClick={() => handleCategoryChange(index)}
      className={`w-full flex items-center space-x-4 p-3 rounded-[20px] border border-[#CDB04E1A] transition-all duration-300 group cursor-pointer bg-[#CDB04E1A] hover:border-[#C3912F] ${
        isActive
          ? "bg-gradient-to-tr from-[#C3912F] to-[#F5E7A8] text-background"
          : "text-white"
      } hover:bg-opacity-30`}
      initial="hidden"
      animate="visible"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center justify-center">
        <div className="flex items-center justify-center w-[50px] h-[50px] sm:w-[70px] sm:h-[70px] rounded-2xl bg-gradient-to-br from-[#F5E7A8] to-[#C3912F] text-background">
          <Image
            src={category.icon}
            width={30}
            height={30}
            alt={category.title}
            className="object-contain"
          />
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-sm sm:text-xl font-normal font-josefin text-left">
          {category.title}
        </span>
        <p className="text-xs sm:text-lg font-light font-josefin text-left">
          {category.description}
        </p>
      </div>
    </motion.button>
  );

  return (
    <section className="relative overflow-hidden mx-auto">
      <Image
        src={backgroundImage}
        alt="Gateway Section Background"
        fill
        className="object-cover"
        priority
      />
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "linear-gradient(270deg, rgba(1, 41, 43, 0) -542.65%, #01292B 100%)",
        }}
      />

      {/* Top gradient overlay */}
      <div className="absolute inset-x-0 top-0 w-full h-1/6 z-10 bg-gradient-to-b from-[#01292B] to-[#01292B00]" />

      {/* Bottom gradient overlay */}
      <div className="absolute inset-x-0 bottom-0 w-full h-1/6 z-10 bg-gradient-to-t from-[#01292B] to-[#01292B00]" />

      <div className="container">
        <div className="relative z-20 py-10 sm:py-20">
          <div className="font-cinzel">
            {/* Title and Description - Centered (No Changes) */}
            <motion.div
              variants={headingVariants}
              initial="hidden"
              animate="visible"
              className="space-y-2 sm:space-y-4 text-center mb-8 sm:mb-16"
            >
              <h1 className="text-white text-2xl lg:text-3xl xl:text-[44px] font-normal uppercase tracking-wide leading-snug">
                {gatewayData.title} {gatewayData.subtitle}
                <br />
                <span className="font-bold bg-gradient-to-r from-[#C3912F] via-[#F5E7A8] to-[#C3912F] bg-clip-text text-transparent">
                  {gatewayData.highlightText}
                </span>
              </h1>
              <motion.div
                variants={itemVariants}
                className="font-josefin text-[#FFFFFFE5] text-center description-text mx-auto max-w-4xl pt-6"
                dangerouslySetInnerHTML={{ __html: gatewayData.description }}
              />
            </motion.div>

            {/* Three Column Layout with Aligned Rows */}
            <motion.div
              className="grid grid-cols-1 lg:grid-cols-3 gap-2 lg:gap-12"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              style={{
                gridTemplateRows: "auto 1fr", // First row auto-height for titles, second row flexible for buttons
              }}
            >
              {/* Left Column - Section Title */}
              <motion.div variants={itemVariants} className="font-josefin">
                <h3 className="text-white font-medium text-lg lg:text-4xl text-center lg:text-left lg:mt-10">
                  {gatewayData.sectionTitle}
                </h3>
              </motion.div>

              {/* Center Column - Interactive Map */}
              <motion.div
                className="h-[400px] sm:h-[500px] lg:h-[600px] flex items-center justify-center row-span-2"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <div className="relative w-full h-full max-w-lg">
                  <Image
                    src={mapImage}
                    alt="Interactive Map"
                    fill
                    className="object-contain"
                  />

                  {/* Map Pins */}
                  <AnimatePresence mode="wait">
                    {currentCategory?.locations?.map(
                      (location, locationIndex) => (
                        <motion.div
                          key={`${safeActiveCategory}-${locationIndex}-${location.name}`}
                          className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
                          style={{
                            top: location.coords.top,
                            left: location.coords.left,
                          }}
                          onMouseEnter={() => setHoveredPin(location.name)}
                          onMouseLeave={() => setHoveredPin(null)}
                          variants={mapPinVariants}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          transition={{ delay: locationIndex * 0.1 }}
                          whileHover={{ scale: 1.2 }}
                        >
                          {/* The Pin Icon */}
                          <motion.div
                            className="cursor-pointer drop-shadow-lg"
                            whileHover={{ y: -2 }}
                            transition={{
                              type: "spring",
                              stiffness: 300,
                              damping: 20,
                            }}
                          >
                            <Image
                              src={location.icon}
                              width={24}
                              height={24}
                              alt="Map pin"
                              className="filter drop-shadow-md"
                            />
                          </motion.div>

                          {/* Hover Image Card */}
                          <AnimatePresence>
                            {hoveredPin === location.name && (
                              <motion.div
                                className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-32 bg-white rounded-xl overflow-hidden border border-gray-200 shadow-xl z-20"
                                initial={{ opacity: 0, y: 10, scale: 0.8 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.8 }}
                                transition={{
                                  duration: 0.2,
                                  type: "spring",
                                  stiffness: 300,
                                  damping: 25,
                                }}
                              >
                                <div className="relative h-20 w-full">
                                  <img
                                    src={location.image}
                                    alt={location.name}
                                    className="w-full h-full object-cover"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                </div>
                                <div className="p-2">
                                  <p className="font-josefin text-center text-xs font-semibold text-gray-800 leading-tight">
                                    {location.name}
                                  </p>
                                </div>

                                {/* Tooltip Arrow */}
                                <div className="absolute top-full left-1/2 -translate-x-1/2">
                                  <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white" />
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      )
                    )}
                  </AnimatePresence>

                  {/* Map Loading State */}
                  {(!currentCategory?.locations ||
                    currentCategory.locations.length === 0) && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-white/50 text-center">
                        <p className="font-josefin">
                          No locations available for this category
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Right Column - Section Description */}
              <motion.div variants={itemVariants} className="font-josefin">
                <div
                  className="text-[#FFFFFFE5] description-text w-full text-center lg:text-left"
                  dangerouslySetInnerHTML={{
                    __html: gatewayData.sectionDescription,
                  }}
                />
              </motion.div>

              {/* Left Column - First 2 Category Buttons (Second Row) */}
              <motion.div variants={itemVariants} className="font-josefin">
                <div className="space-y-3">
                  {firstHalf.map((category, index) => (
                    <CategoryButton
                      key={`first-${index}`}
                      category={category}
                      index={index}
                      isActive={safeActiveCategory === index}
                      delay={index * 0.1}
                    />
                  ))}
                </div>
              </motion.div>

              {/* Right Column - Last 2 Category Buttons (Second Row) */}
              <motion.div variants={itemVariants} className="font-josefin">
                <div className="space-y-3">
                  {secondHalf.map((category, index) => {
                    const actualIndex =
                      Math.ceil(categories.length / 2) + index;
                    return (
                      <CategoryButton
                        key={`second-${index}`}
                        category={category}
                        index={actualIndex}
                        isActive={safeActiveCategory === actualIndex}
                      />
                    );
                  })}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GatewaySection;
