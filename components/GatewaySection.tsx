"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Image from "next/image";

// --- Data for the explorer ---
const explorerData = {
  beaches: {
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
  airports: {
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
  golf: {
    title: "Laguna Golf Course",
    description: "Championship course within walking distance",
    icon: "/gateway-images/golf.svg",
    locations: [
      {
        name: "Phuket Town Hall",
        image: "https://placehold.co/200x150/5B21B6/FFFFFF?text=Town+Hall",
        coords: { top: "33%", left: "15%" },
        icon: "/icons/map-pin.svg",
      },
      {
        name: "Tourism Authority",
        image: "https://placehold.co/200x150/5B21B6/FFFFFF?text=Tourism",
        coords: { top: "50%", left: "15%" },
        icon: "/icons/map-pin.svg",
      },
      {
        name: "Marine Department",
        image: "https://placehold.co/200x150/5B21B6/FFFFFF?text=Marine",
        coords: { top: "55%", left: "45%" },
        icon: "/icons/map-pin.svg",
      },
      {
        name: "Tourism Authority",
        image: "https://placehold.co/200x150/5B21B6/FFFFFF?text=Tourism",
        coords: { top: "50%", left: "15%" },
        icon: "/icons/map-pin.svg",
      },
      {
        name: "Marine Department",
        image: "https://placehold.co/200x150/5B21B6/FFFFFF?text=Marine",
        coords: { top: "55%", left: "45%" },
        icon: "/icons/map-pin.svg",
      },
    ],
  },
  market: {
    title: "Villa Market",
    description: "Premium shopping and dining experiences",
    icon: "/gateway-images/market.svg",
    locations: [
      {
        name: "Phuket Town Hall",
        image: "https://placehold.co/200x150/5B21B6/FFFFFF?text=Town+Hall",
        coords: { top: "33%", left: "15%" },
        icon: "/icons/map-pin.svg",
      },
      {
        name: "Tourism Authority",
        image: "https://placehold.co/200x150/5B21B6/FFFFFF?text=Tourism",
        coords: { top: "50%", left: "15%" },
        icon: "/icons/map-pin.svg",
      },
      {
        name: "Marine Department",
        image: "https://placehold.co/200x150/5B21B6/FFFFFF?text=Marine",
        coords: { top: "55%", left: "45%" },
        icon: "/icons/map-pin.svg",
      },
      {
        name: "Tourism Authority",
        image: "https://placehold.co/200x150/5B21B6/FFFFFF?text=Tourism",
        coords: { top: "50%", left: "15%" },
        icon: "/icons/map-pin.svg",
      },
      {
        name: "Marine Department",
        image: "https://placehold.co/200x150/5B21B6/FFFFFF?text=Marine",
        coords: { top: "55%", left: "45%" },
        icon: "/icons/map-pin.svg",
      },
    ],
  },
};

type Category = keyof typeof explorerData;

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

// --- Main Component ---
const GatewaySection = () => {
  const [activeCategory, setActiveCategory] = useState<Category>("beaches");
  const [hoveredPin, setHoveredPin] = useState<string | null>(null);

  const currentData = explorerData[activeCategory];

  return (
    <section className="relative overflow-hidden">
      <Image
        src="/gateway-images/background.png"
        alt="Phuket Properties Section"
        fill
        className="object-cover "
        priority
      />
      <div
        className="absolute inset-0 z-0 "
        style={{
          background:
            "linear-gradient(270deg, rgba(1, 41, 43, 0) -542.65%, #01292B 100%",
        }}
      />
      {/* Top gradient overlay */}
      <div className="absolute inset-x-0 top-0 w-full h-1/6 z-10 bg-gradient-to-b from-[#01292B] to-[#01292B00]" />
      {/* Bottom gradient overlay */}
      <div className="absolute inset-x-0 bottom-0 w-full h-1/6 z-10 bg-gradient-to-t from-[#01292B] to-[#01292B00]" />
      <div className="relative z-20 container mx-auto py-10 sm:py-20">
        <div className="font-cinzel grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          {/* Left Content */}
          <motion.div
            className="space-y-2 sm:space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Main Heading */}
            <motion.div
              variants={headingVariants}
              className="space-y-2 sm:space-y-4 text-center lg:text-left "
            >
              <h1 className="text-white text-xl xs:text-2xl lg:text-3xl xl:text-[50px] font-normal uppercase sm:leading-12 px-4 sm:px-0">
                A place to come home to and a location that{" "}
                <span className="text-xl xs:text-2xl lg:text-3xl xl:text-[50px] font-bold bg-gradient-to-r from-[#C3912F] via-[#F5E7A8] to-[#C3912F] bg-clip-text text-transparent">
                  holds its value.
                </span>
              </h1>
            </motion.div>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="font-josefin text-[#FFFFFFE5] text-center sm:text-left text-xs xs:text-sm sm:text-md lg:text-lg font-light w-full px-5 sm:px-0 leading-snug lg:max-w-2xl"
            >
              Set between Layan and Bangtao, this address offers more than
              scenery. It brings you close to Phuket&apos;s most lived-in
              stretch from cafés and golf courses to global schools and beach
              clubs.
            </motion.p>

            {/* Phuket Explorer Section */}
            <motion.div
              variants={itemVariants}
              className="space-y-6 font-josefin text-center lg:text-left"
            >
              <h3 className="text-white font-medium text-md sm:text-xl text-4xl">
                Your Gateway to Paradise
              </h3>
              <p className="text-[#FFFFFFE5] text-lg font-light border-b-[0.5px] border-b-white w-[80%] pb-4 mx-auto lg:mx-0">
                Perfectly positioned where tropical elegance meets modern
                convenience, discover a world of luxury at your doorstep.
              </p>

              {/* Category Buttons */}
              <div className="space-y-3 flex flex-col items-center lg:items-start">
                {Object.keys(explorerData).map((key) => {
                  const categoryKey = key as Category;
                  const isActive = activeCategory === categoryKey;
                  return (
                    <button
                      key={categoryKey}
                      onClick={() => setActiveCategory(categoryKey)}
                      className={`w-[80%] flex items-center  space-x-4 p-4 rounded-[20px] border border-[#01292B] transition-all duration-300 group cursor-pointer bg-[#CDB04E33] text-[#CDB04E] hover:border-[#C3912F] ${isActive ? "bg-gradient-to-br from-[#F5E7A8] to-[#C3912F] text-background" : ""} hover:bg-opacity-30"
                      }`}
                    >
                      <div className="flex items-center justify-center">
                        <div
                          className={`flex items-center justify-center w-[50px] h-[50px] rounded-2xl bg-gradient-to-br from-[#F5E7A8] to-[#C3912F] text-background   `}
                        >
                          <Image
                            src={explorerData[categoryKey].icon}
                            width={20}
                            height={20}
                            alt=""
                          />
                        </div>
                      </div>
                     <div className="flex flex-col">
                     <span className="text-sm sm:text-xl font-normal font-josefin text-left">
                        {explorerData[categoryKey].title}
                      </span>
                      <p className="text-xs sm:text-lg font-light text-[#FFFFFFE5] font-josefin">{explorerData[categoryKey].description}</p>
                     </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side - Map */}
          <div className="w-full sm:h-[400px] md:h-full lg:h-full lg:mt-20 flex px-10 sm:px-0 items-center justify-center">
            <motion.div
              className="relative w-full max-w-xl h-full"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <Image
                src={"/images/map2.png"}
                alt="map"
                width={450}
                height={450}
              />

              {/* Map Pins */}
              <AnimatePresence>
                {currentData.locations.map((location) => (
                  <motion.div
                    key={location.name}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2"
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
                  >
                    {/* The Pin Icon */}
                    <Image
                      src={location.icon}
                      width={20}
                      height={20}
                      alt="Map pin"
                      className="hover:cursor-pointer"
                    />

                    {/* Hover Image Card */}
                    <AnimatePresence>
                      {hoveredPin === location.name && (
                        <motion.div
                          className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-30 bg-white rounded-xl  overflow-hidden border border-background"
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
};

export default GatewaySection;
