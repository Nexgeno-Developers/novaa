// "use client";

// import React from "react";
// import { motion, Variants } from "framer-motion";
// import Image from "next/image";

// const PhuketPropertiesSection = () => {
//   const features = [
//     {
//       title: "Strategic Locations",
//       description:
//         "All projects are conveniently near popular tourist sites at upcoming prime areas.",
//     },
//     {
//       title: "Rental Potential",
//       description:
//         "High demand from expats and tourists for short-term and long-term rentals.",
//     },
//     {
//       title: "Modern Lifestyle",
//       description:
//         "Premium amenities, cosmopolitan design, and luxury conveniences.",
//     },
//     {
//       title: "Developer Trust",
//       description:
//         "Respected developers like Banyan Group and Origin ensure quality and timely delivery.",
//     },
//   ];

//   const containerVariants: Variants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.3,
//         duration: 0.8,
//       },
//     },
//   };

//   const itemVariants: Variants = {
//     hidden: { opacity: 0, x: -50 },
//     visible: {
//       opacity: 1,
//       x: 0,
//       transition: {
//         duration: 0.6,
//         ease: "easeOut",
//       },
//     },
//   };

//   const headingVariants: Variants = {
//     hidden: { opacity: 0, y: 30 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: {
//         duration: 0.8,
//         ease: "easeOut",
//       },
//     },
//   };

//   return (
//     <section className="relative overflow-hidden">
//       <div
//         className="absolute inset-0 z-0 bg-cover bg-center"
//         style={{
//           backgroundImage: `
//       linear-gradient(270deg, rgba(1, 41, 43, 0) -542.65%, #01292B 100%),
//       url('/images/background.jpg')
//     `,
//         }}
//       />

//       {/* Top gradient overlay */}
//       {/* <div
//         className="absolute top-0 left-0 w-full h-full z-10"
//         style={{
//           background:
//             "linear-gradient(180deg, rgba(1, 41, 43, 0) 0%, #01292B 100%)",
//         }}
//       /> */}

//       {/* Bottom gradient overlay */}
//       {/* <div
//         className="absolute bottom-0 left-0 w-full h-full z-10"
//         style={{
//           background: 'linear-gradient(0deg, rgba(1, 41, 43, 0) 0%, #01292B 100%)'
//         }}
//       /> */}

//       <div className="relative z-20 container mx-auto py-20">
//         <div className="font-cinzel grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
//           {/* Left Content */}
//           <motion.div
//             className="space-y-8"
//             variants={containerVariants}
//             initial="hidden"
//             whileInView="visible"
//             viewport={{ once: true, amount: 0.3 }}
//           >
//             {/* Main Heading */}
//             <motion.div variants={headingVariants} className="space-y-4 text-center sm:text-left ">
//               <h1 className="text-white text-2xl lg:text-3xl xl:text-4xl font-normal">
//                 DISCOVER PRIME PROPERTIES
//               </h1>
//               <h2
//                 className="text-2xl lg:text-3xl xl:text-4xl font-bold bg-clip-text text-transparent"
//                 style={{
//                   background:
//                     "radial-gradient(55.66% 55.66% at -0.55% 62.22%, #C3912F 0%, #F5E7A8 51.68%, #C3912F 100%)",
//                   WebkitBackgroundClip: "text",
//                   WebkitTextFillColor: "transparent",
//                 }}
//               >
//                 ACROSS PHUKET
//               </h2>
//             </motion.div>

//             {/* Description */}
//             <motion.p
//               variants={itemVariants}
//               className="font-josefin text-[#FFFFFF] text-center sm:text-left text-md lg:text-lg font-light max-w-2xl"
//             >
//               Explore our Curated Selection of Luxury Residences. Whether you&#39;re
//               seeking a beachfront villa, an investment opportunity, or a
//               peaceful escape, unveil infinite blue development opportunities
//               built of lifestyle and location in Phuket.
//             </motion.p>

//             {/* Why Invest Section */}
//             <motion.div variants={itemVariants} className="space-y-6">
//               <h3 className="font-josefin text-white text-xl lg:text-2xl font-medium">
//                 Why Invest in These Locations?
//               </h3>

//               <div className="space-y-6">
//                 {features.map((feature, index) => (
//                   <motion.div
//                     key={index}
//                     variants={itemVariants}
//                     className="flex items-start space-x-4"
//                   >
//                     {/* Gold Circle Icon */}
//                     <div className="flex-shrink-0 mt-1">
//                       <div className="w-5 h-5 rounded-full bg-gradient-to-r from-[#C3912F] via-[#F5E7A8] to-[#C3912F]">
//                         <Image
//                           src={"/icons/pin.svg"}
//                           alt="pin icon"
//                           width={50}
//                           height={50}
//                         />
//                       </div>
//                     </div>

//                     <div className="space-y-2">
//                       <h4 className="font-josefin text-[#C3912F] text-xl font-normal">
//                         {feature.title}
//                       </h4>
//                       <p className="font-josefin text-white text-base font-light">
//                         {feature.description}
//                       </p>
//                     </div>
//                   </motion.div>
//                 ))}
//               </div>
//             </motion.div>
//           </motion.div>

//           {/* Right Side - Map Placeholder */}
//           <motion.div
//             className="flex items-center justify-center"
//             initial={{ opacity: 0, scale: 0.9 }}
//             whileInView={{ opacity: 1, scale: 1 }}
//             viewport={{ once: true, amount: 0.3 }}
//             transition={{ duration: 0.8, ease: "easeOut" }}
//           >
//              <Image src={'/images/map2.png'} alt="map" width={400} height={400} />
//           </motion.div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default PhuketPropertiesSection;

"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Image from "next/image";

// --- Data for the explorer ---
// You can easily update this data to change the content for each category.
const explorerData = {
  beaches: {
    title: "Beaches Locations",
    icon: "/icons/beach.svg",
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
  projects: {
    title: "Projects Locations",
    icon: "/icons/project.svg",
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
  alliance: {
    title: "Government Alliance",
    icon: "/icons/alliance.svg",
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
const PhuketPropertiesSection = () => {
  const [activeCategory, setActiveCategory] = useState<Category>("beaches");
  const [hoveredPin, setHoveredPin] = useState<string | null>(null);

  const currentData = explorerData[activeCategory];

  return (
    <section className="relative overflow-hidden">
      <Image
        src="/images/background.jpg"
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
      <div className="relative z-20 container mx-auto  py-20 lg:py-28">
        <div className="font-cinzel grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          {/* Left Content */}
          <motion.div
            className="space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Main Heading */}
            <motion.div
              variants={headingVariants}
              className="space-y-4 text-center sm:text-left "
            >
              <h1 className="text-white text-2xl lg:text-3xl xl:text-4xl font-normal">
                DISCOVER PRIME PROPERTIES
              </h1>
              <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold bg-gradient-to-r from-[#C3912F] via-[#F5E7A8] to-[#C3912F] bg-clip-text text-transparent">
                ACROSS PHUKET
              </h2>
            </motion.div>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="font-josefin text-[#FFFFFFE5] text-center sm:text-left text-md lg:text-lg font-light max-w-2xl"
            >
              Explore a Curated Selection of Luxury Residences . Whether
              you&#39;re seeking a beachfront retreat, an investment
              opportunity, or a peaceful escape amidst nature, these
              developments represent the best of lifestyle and location in
              Phuket.
            </motion.p>

            {/* Phuket Explorer Section */}
            <motion.div
              variants={itemVariants}
              className="space-y-6 font-josefin text-center sm:text-left"
            >
              <h3 className="text-white font-medium text-4xl">
                Phuket Explorer
              </h3>
              <p className="text-[#FFFFFFE5] text-lg font-light">
                Discover the beauty and development of Phuket Island
              </p>

              {/* Category Buttons */}
              <div className="space-y-3 flex flex-col items-center sm:items-start">
                {Object.keys(explorerData).map((key) => {
                  const categoryKey = key as Category;
                  const isActive = activeCategory === categoryKey;
                  return (
                    <button
                      key={categoryKey}
                      onClick={() => setActiveCategory(categoryKey)}
                      className={`w-[60%] flex items-center space-x-4 p-4 rounded-4xl border border-[#01292B] transition-all duration-300 group cursor-pointer ${
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
                        <Image
                          src={explorerData[categoryKey].icon}
                          width={35}
                          height={35}
                          alt="Map pin "
                          className="pl-2 border-l-2 border-l-background"
                        />
                      </div>
                      <span className="text-lg font-medium font-josefin">
                      {explorerData[categoryKey].title}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>

            {/* Locations List */}
            <motion.div variants={itemVariants} className="space-y-4 pt-4">
              <AnimatePresence mode="wait">
                <motion.h4
                  key={activeCategory + "-title"}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center justify-center sm:justify-start space-x-3 text-xl text-white font-cinzel"
                >
                  <Image
                    src={"/icons/map-pin.svg"}
                    width={20}
                    height={20}
                    alt="Map pin"
                    className="hover:cursor-pointer"
                  />
                  <span className="font-josefin text-3xl leading-relaxed pt-2">
                    {currentData.title}
                  </span>
                </motion.h4>
              </AnimatePresence>
              <div className="space-y-3">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeCategory}
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: 1,
                      transition: { staggerChildren: 0.05 },
                    }}
                    exit={{ opacity: 0 }}
                  >
                    {currentData.locations.map((location) => (
                      <motion.div
                        key={location.name}
                        className="flex items-center justify-center sm:justify-start space-x-3 group"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                      >
                        <div className="flex items-center w-[60%] my-2 rounded-4xl px-4 py-2 gap-2 border-[0.2px] border-[#FFFFFF] bg-[#CDB04E0D]">
                          <div className="w-4 h-4 rounded-full bg-[#C3912F] transition-transform duration-300 group-hover:scale-105"></div>
                          <p className="text-white font-josefin text-xl font-light transition-colors duration-300 group-hover:text-white">
                            {location.name}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side - Map */}
          <div className="w-full sm:h-[600px] lg:h-full sm:mt-20 flex px-10 sm:px-0 items-center justify-center">
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

export default PhuketPropertiesSection;
