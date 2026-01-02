"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Image from "next/image";
import { useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Location {
  id: string;
  name: string;
  image: string;
  coords: { top: string; left: string };
  icon: string;
}

interface Category {
  id: string;
  title: string;
  icon: string;
  locations: Location[];
}

interface PhuketPropertiesSectionProps {
  mainHeading?: string;
  subHeading?: string;
  description?: string;
  explorerHeading?: string;
  explorerDescription?: string;
  backgroundImage?: string;
  mapImage?: string;
  categories?: Category[];
  [key: string]: unknown;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
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

export default function PhuketPropertiesSection({
  mainHeading = "DISCOVER ",
  subHeading = "PHUKET ",
  description = "<p>Explore premium properties across Phuket's most sought-after locations.</p>",
  explorerHeading = "PHUKET EXPLORER",
  explorerDescription = "<p>Navigate through different property categories and locations.</p>",
  backgroundImage = "/images/background.jpg",
  mapImage = "/images/map2.png",
  categories = [],
  ...props
}: PhuketPropertiesSectionProps) {
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [hoveredPin, setHoveredPin] = useState<string | null>(null);

  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 });

  // Set initial active category when categories change
  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0].id);
    }
  }, [categories, activeCategory]);

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [inView, controls]);

  // If no categories, don't render the section
  if (categories.length === 0) {
    return null;
  }

  const currentCategory = categories.find((cat) => cat.id === activeCategory);

  // Helper function to render HTML content safely
  const createMarkup = (html: string) => {
    return { __html: html };
  };

  return (
    <section className="relative overflow-hidden">
      <Image
        src={backgroundImage}
        alt="Phuket Properties Section"
        fill
        className="object-cover"
        priority
        quality={75}
        sizes="100vw"
      />
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "linear-gradient(270deg, rgba(1, 41, 43, 0) -542.65%, #01292B 100%",
        }}
      />
      {/* Top gradient overlay */}
      <div className="absolute inset-x-0 top-0 w-full h-1/6 z-10 bg-gradient-to-b from-[#01292B] to-[#01292B00]" />
      {/* Bottom gradient overlay */}
      <div className="absolute inset-x-0 bottom-0 w-full h-1/6 z-10 bg-gradient-to-t from-[#01292B] to-[#01292B00]" />

      <div className="relative z-20 container py-10 lg:py-20">
        {/* Main Heading */}
        <motion.div
          variants={headingVariants}
          className="font-cinzel space-y-2 sm:space-y-4 text-center "
        >
          <h1 className="text-white text-2xl lg:text-3xl xl:text-[50px] font-normal">
            {mainHeading} <span className="font-bold bg-clip-text text-transparent bg-[#D4AF37]">{subHeading}</span>
          </h1>
        

          {/* Description */}
          {/* <motion.div
            variants={itemVariants}
            className="font-josefin text-[#FFFFFFE5] description-text"
            dangerouslySetInnerHTML={createMarkup(description)}
          /> */}
        </motion.div>

        <div className="font-cinzel grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-20 items-start">
          {/* Left Content */}
          <motion.div
            className="space-y-4 sm:space-y-8 pt-15"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Phuket Explorer Section */}
            <motion.div
              ref={ref}
              initial="hidden"
              animate={controls}
              variants={itemVariants}
              className="space-y-2 lg:space-y-4 font-josefin text-center md:text-left"
            >
              <h3 className="text-white font-medium text-2xl sm:text-3xl lg:text-4xl">
                {explorerHeading}
              </h3>
              <div
                className="text-[#FFFFFFE5] description-text border-b-[0.5px] border-b-white lg:w-[80%] pb-4 text-center sm:text-left"
                dangerouslySetInnerHTML={createMarkup(explorerDescription)}
              />

              {/* Category Buttons - Scrollable */}
              <ScrollArea className="h-[400px] w-full lg:w-[80%] pr-4">
                <div className="space-y-3 flex flex-col items-center lg:items-start">
                  {categories.map((category) => {
                    const isActive = activeCategory === category.id;
                    return (
                      <button
                        key={category.id}
                        onClick={() => setActiveCategory(category.id)}
                        className={`w-full lg:w-[90%] flex items-center space-x-4 p-2 xs:p-2 xl:p-4 rounded-[20px] border border-[#01292B] transition-all duration-300 transform hover:translate-x-2 group cursor-pointer ${
                          isActive
                            ? "bg-gradient-to-br from-[#F5E7A8] to-[#C3912F] text-background"
                            : "bg-[#CDB04E33] text-[#CDB04E] hover:border-[#C3912F] hover:bg-opacity-30"
                        }`}
                      >
                        <div
                          className={`transition-colors duration-300 ${
                            isActive ? "text-background" : "text-background"
                          }`}
                        >
                          <div
                            className={`flex items-center border-l-2 ml-2 sm:ml-0 pl-4 sm:pl-2 ${
                              isActive
                                ? "border-l-background"
                                : "border-l-primary"
                            } h-[35px]`}
                          >
                            <div
                              className={`w-[30px] h-[30px] sm:w-[35px] lg:w-[40px] sm:h-[35px] lg:h-[40px] ${
                                isActive ? "bg-background" : "bg-primary"
                              } mask mask-center mask-no-repeat`}
                              style={{
                                WebkitMaskImage: `url(${category.icon})`,
                                maskImage: `url(${category.icon})`,
                                WebkitMaskSize: "contain",
                                maskSize: "contain",
                                WebkitMaskRepeat: "no-repeat",
                                maskRepeat: "no-repeat",
                              }}
                            />
                          </div>
                        </div>
                        <span className="text-left text-base sm:text-lg lg:text-xl font-medium font-josefin line-clamp-1">
                          {category.title}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </ScrollArea>
            </motion.div>

            {/* Locations List - Scrollable */}
            <motion.div
              variants={itemVariants}
              className="space-y-2 sm:space-y-4 pt-4"
            >
              <AnimatePresence mode="wait">
                <motion.h4
                  key={activeCategory + "-title"}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3 }}
                  className="border-t-[0.5px] border-b-white w-full lg:w-[80%] flex items-center justify-center md:justify-start space-x-3 text-xl text-white font-cinzel"
                >
                  <Image
                    src={"/icons/map-pin.svg"}
                    width={20}
                    height={20}
                    alt="Map pin"
                    className="hover:cursor-pointer pt-2"
                  />
                  <span className="pt-4 font-josefin text-xl xs:text-2xl lg:text-3xl leading-relaxed">
                    {currentCategory?.title}
                  </span>
                </motion.h4>
              </AnimatePresence>

              <ScrollArea className="h-[300px] w-full lg:w-[80%]">
                <div className="space-y-3 pr-4">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeCategory}
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: 1,
                        transition: { staggerChildren: 0.05 },
                      }}
                      exit={{ opacity: 0 }}
                      className="border-b-[0.5px] border-b-white w-full pb-4"
                    >
                      {currentCategory?.locations.map((location) => (
                        <motion.div
                          key={location.id}
                          className="flex items-center justify-center lg:justify-start space-x-3 group"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                        >
                          <div className="flex items-center w-full lg:w-[95%] my-2 rounded-4xl px-4 py-2 gap-4 border-[0.2px] border-[#CDB04E0D] bg-[#CDB04E0D]">
                            <div className="h-2 w-2 sm:w-4 sm:h-4 rounded-full bg-[#C3912F] transition-transform duration-300 group-hover:scale-105"></div>
                            <p className="text-white font-josefin text-base sm:text-lg lg:text-xl font-light transition-colors duration-300 group-hover:text-white">
                              {location.name}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </ScrollArea>
            </motion.div>
          </motion.div>

          {/* Right Side - Map */}
          <div className="w-full h-[400px] xs:h-[500px] sm:h-[600px] lg:h-[1000px] 2xl:h-[1100px] flex px-10 sm:px-0 items-center justify-center">
            <motion.div
              className="relative w-full max-w-md sm:max-w-lg md:max-w-xl h-full"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <Image
                src={mapImage}
                alt="Phuket map"
                fill
                className="object-contain"
              />

              {/* Map Pins */}
              <AnimatePresence>
                {currentCategory?.locations.map((location) => (
                  <motion.div
                    key={location.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                      top: location.coords.top,
                      left: location.coords.left,
                    }}
                    onMouseEnter={() => setHoveredPin(location.id)}
                    onMouseLeave={() => setHoveredPin(null)}
                    variants={mapPinVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                  >
                    {/* The Pin Icon */}
                    <div className="relative w-[15px] h-[15px] sm:w-[30px] sm:h-[30px]">
                      <Image
                        src={location.icon}
                        alt="Map pin"
                        fill
                        className="hover:cursor-pointer object-contain"
                      />
                    </div>
                    {/* Hover Image Card */}
                    <AnimatePresence>
                      {hoveredPin === location.id && location.image && (
                        <motion.div
                          className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-30 bg-white rounded-xl overflow-hidden border border-background"
                          initial={{ opacity: 0, y: 10, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.9 }}
                          transition={{ duration: 0.2 }}
                        >
                          <img
                            src={location.image}
                            alt={location.name}
                            className="w-full h-full object-cover p-2 rounded-xl"
                          />
                          <p className="p-1 font-josefin text-center text-xs font-semibold text-gray-800 bg-gray-50">
                            {location.name}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
