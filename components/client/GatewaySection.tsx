"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Image from "next/image";
import { getSvgViewBox, MapDimensions } from "@/lib/mapUtils";

interface GatewayLocation {
  name: string;
  image: string;
  coords: {
    top: string;
    left: string;
  };
  icon: string;
  pixelCoords: {
    x: number;
    y: number;
  };
  categoryId?: string;
}

interface GatewayCategory {
  title: string;
  description: string;
  icon: string;
  locations: GatewayLocation[];
}

interface MainProjectLocation {
  title: string;
  description: string;
  icon: string;
  coords: {
    x: number;
    y: number;
  };
}

interface CurveLine {
  id: string;
  categoryId: string;
  locationId: string;
  svgPath: string;
  color: string;
  thickness: number;
  dashPattern: number[];
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
        mainProjectLocation: MainProjectLocation;
        curveLines: CurveLine[];
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
  mainProjectLocation: {
    title: "",
    description: "",
    icon: "/icons/map-pin.svg",
    coords: { x: 0, y: 0 },
  },
  curveLines: [] as CurveLine[],
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
          pixelCoords: { x: 0, y: 0 },
          categoryId: "",
        },
        {
          name: "Karon Beach",
          image: "https://placehold.co/200x150/C3912F/FFFFFF?text=Karon+Beach",
          coords: { top: "50%", left: "15%" },
          icon: "/icons/map-pin.svg",
          pixelCoords: { x: 0, y: 0 },
          categoryId: "",
        },
        {
          name: "Kata Beach",
          image: "https://placehold.co/200x150/C3912F/FFFFFF?text=Kata+Beach",
          coords: { top: "55%", left: "45%" },
          icon: "/icons/map-pin.svg",
          pixelCoords: { x: 0, y: 0 },
          categoryId: "",
        },
        {
          name: "Kamala Beach",
          image: "https://placehold.co/200x150/C3912F/FFFFFF?text=Kamala+Beach",
          coords: { top: "35%", left: "35%" },
          icon: "/icons/map-pin.svg",
          pixelCoords: { x: 0, y: 0 },
          categoryId: "",
        },
        {
          name: "Surin Beach",
          image: "https://placehold.co/200x150/C3912F/FFFFFF?text=Surin+Beach",
          coords: { top: "60%", left: "20%" },
          icon: "/icons/map-pin.svg",
          pixelCoords: { x: 0, y: 0 },
          categoryId: "",
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

  // Debug logging
  console.log("GatewaySection received project:", project);
  console.log("GatewaySection gatewayData:", gatewayData);
  console.log(
    "GatewaySection mainProjectLocation:",
    gatewayData.mainProjectLocation
  );
  console.log("GatewaySection mapImage:", gatewayData.mapImage);
  console.log("GatewaySection curveLines:", gatewayData.curveLines);
  console.log(
    "GatewaySection curveLines length:",
    gatewayData.curveLines?.length
  );
  console.log(
    "GatewaySection first curve dashPattern:",
    gatewayData.curveLines?.[0]?.dashPattern
  );
  console.log(
    "GatewaySection mainProjectLocation coords:",
    gatewayData.mainProjectLocation?.coords
  );
  // console.log("GatewaySection svgViewBox:", svgViewBox);

  const [activeCategory, setActiveCategory] = useState(0);
  const [hoveredPin, setHoveredPin] = useState<string | null>(null);
  const [svgViewBox, setSvgViewBox] = useState("0 0 800 600");

  // Convert pixel coordinates from map editor (800x600) to SVG coordinates
  const convertCoordinates = (pixelCoords: { x: number; y: number }) => {
    const mapDimensions = { width: 800, height: 600 };
    const viewBoxValues = svgViewBox.split(" ").map(Number);
    const svgWidth = viewBoxValues[2];
    const svgHeight = viewBoxValues[3];

    const converted = {
      x: (pixelCoords.x / mapDimensions.width) * svgWidth,
      y: (pixelCoords.y / mapDimensions.height) * svgHeight,
    };

    return converted;
  };

  // Convert SVG path from map editor coordinates to current SVG coordinates
  const convertSvgPath = (svgPath: string) => {
    const mapDimensions = { width: 800, height: 600 };
    const viewBoxValues = svgViewBox.split(" ").map(Number);
    const svgWidth = viewBoxValues[2];
    const svgHeight = viewBoxValues[3];

    const scaleX = svgWidth / mapDimensions.width;
    const scaleY = svgHeight / mapDimensions.height;

    console.log("Converting SVG path:", {
      originalPath: svgPath,
      svgViewBox: svgViewBox,
      svgWidth: svgWidth,
      svgHeight: svgHeight,
      scaleX: scaleX,
      scaleY: scaleY,
    });

    // Parse and convert the SVG path
    const convertedPath = svgPath.replace(/(\d+\.?\d*)/g, (match) => {
      const num = parseFloat(match);
      // Check if this is an x-coordinate (even positions) or y-coordinate (odd positions)
      const isX = svgPath.indexOf(match) % 2 === 0;
      return isX ? (num * scaleX).toString() : (num * scaleY).toString();
    });

    console.log("Converted SVG path:", convertedPath);

    return convertedPath;
  };

  // Calculate responsive SVG viewBox
  useEffect(() => {
    const updateViewBox = () => {
      const container = document.querySelector(".map-container");
      if (container) {
        const rect = container.getBoundingClientRect();
        const mapDimensions: MapDimensions = { width: 800, height: 600 };
        const aspectRatio = mapDimensions.width / mapDimensions.height;

        let responsiveWidth = rect.width;
        let responsiveHeight = rect.height;

        if (rect.width / rect.height > aspectRatio) {
          responsiveWidth = rect.height * aspectRatio;
        } else {
          responsiveHeight = rect.width / aspectRatio;
        }

        setSvgViewBox(`0 0 ${responsiveWidth} ${responsiveHeight}`);
      }
    };

    updateViewBox();
    window.addEventListener("resize", updateViewBox);
    return () => window.removeEventListener("resize", updateViewBox);
  }, []);

  // If no categories are available, use default data
  const categories =
    gatewayData.categories && gatewayData.categories.length > 0
      ? gatewayData.categories
      : (defaultGatewayData.categories as any[]);

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
      className={`w-full flex items-center space-x-4 p-2 rounded-[20px] border border-[#CDB04E1A] transition-all duration-300 group cursor-pointer bg-[#CDB04E1A] hover:border-[#C3912F] ${
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
        <div className="flex items-center justify-center w-[50px] h-[50px] sm:w-[60px] sm:h-[60px] rounded-2xl bg-gradient-to-br from-[#F5E7A8] to-[#C3912F] text-background">
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
        <span className="text-sm sm:text-lg font-normal font-josefin text-left">
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

            {/* Three Column Layout with Flex */}
            <motion.div
              className="flex flex-col lg:flex-row gap-2 lg:gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Left Column - Section Title and Buttons */}
              <motion.div variants={itemVariants} className="font-josefin flex flex-col w-full lg:w-[30%]">
                <h3 className="text-white font-medium text-lg lg:text-4xl text-center lg:text-left lg:mt-10">
                  {/* {gatewayData.sectionTitle} */}
                </h3>
                <div className="space-y-3 mt-4 lg:mt-8">
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

              {/* Center Column - Interactive Map */}
              <motion.div
                className="h-[400px] sm:h-[500px] lg:h-[700px] flex items-center justify-center w-full lg:w-[40%]"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <div className="relative w-full h-full map-container">
                  <Image
                    key={mapImage}
                    src={mapImage}
                    alt="Interactive Map"
                    fill
                    className="object-contain"
                  />

                  {/* SVG Overlay for curves and main project */}
                  <svg
                    key={`${mapImage}-${gatewayData.mainProjectLocation?.coords.x}-${gatewayData.mainProjectLocation?.coords.y}`}
                    className="absolute inset-0 w-full h-full z-5"
                    viewBox={svgViewBox}
                    preserveAspectRatio="xMidYMid meet"
                  >
                    {/* Main Project Location */}
                    {gatewayData.mainProjectLocation &&
                      gatewayData.mainProjectLocation.coords.x > 0 &&
                      gatewayData.mainProjectLocation.coords.y > 0 &&
                      (() => {
                        const convertedCoords = convertCoordinates(
                          gatewayData.mainProjectLocation.coords
                        );
                        return (
                          <motion.foreignObject
                            x={convertedCoords.x - 12}
                            y={convertedCoords.y - 12}
                            width="24"
                            height="24"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                          >
                            <div className="w-6 h-6 flex items-center justify-center">
                              <img
                                src="/gateway-images/main-project-icon.svg"
                                alt="Main Project"
                                className="w-full h-full drop-shadow-lg"
                              />
                            </div>
                          </motion.foreignObject>
                        );
                      })()}

                    {/* Filtered curves for active category */}
                    {(() => {
                      const filteredCurves = gatewayData.curveLines?.filter(
                        (curve) => curve.categoryId === currentCategory?.title
                      );
                      console.log("Filtering curves for active category:", {
                        activeCategory: currentCategory?.title,
                        allCurves: gatewayData.curveLines,
                        allCurveCategoryIds: gatewayData.curveLines?.map(
                          (curve) => curve.categoryId
                        ),
                        filteredCurves: filteredCurves,
                        filteredCount: filteredCurves?.length,
                      });
                      return filteredCurves;
                    })()?.map((curve, index: number) => {
                      const strokeDasharray =
                        curve.dashPattern && curve.dashPattern.length > 0
                          ? curve.dashPattern.join(",")
                          : "10,5";

                      console.log("Rendering curve:", {
                        curveId: curve.id,
                        originalSvgPath: curve.svgPath,
                        convertedSvgPath: convertSvgPath(curve.svgPath),
                        strokeDasharray: strokeDasharray,
                        color: curve.color,
                        thickness: curve.thickness,
                        svgViewBox: svgViewBox,
                        mainProjectCoords:
                          gatewayData.mainProjectLocation?.coords,
                      });

                      const convertedPath = convertSvgPath(curve.svgPath);
                      console.log(
                        "About to render curve with path:",
                        convertedPath
                      );

                      return (
                        <motion.path
                          key={curve.id}
                          d={convertedPath}
                          stroke={curve.color}
                          strokeWidth={curve.thickness}
                          strokeDasharray={strokeDasharray}
                          strokeDashoffset="0"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          fill="none"
                          initial={{
                            opacity: 0,
                            strokeDashoffset: strokeDasharray
                              .split(",")
                              .reduce((a, b) => a + parseInt(b), 0)
                              .toString(),
                          }}
                          animate={{
                            opacity: 1,
                            strokeDashoffset: 0,
                          }}
                          transition={{
                            duration: 1.5,
                            delay: index * 0.1,
                            ease: "easeInOut",
                          }}
                          className="drop-shadow-sm"
                          style={{
                            filter: "drop-shadow(0 0 3px rgba(0,0,0,0.3))",
                          }}
                        />
                      );
                    })}

                    {/* Gateway Location Markers - SVG elements for responsiveness */}
                    {currentCategory?.locations?.map(
                      (location: any, locationIndex: number) => {
                        // Convert percentage coordinates to pixel coordinates first
                        const percentageCoords = {
                          x: parseFloat(location.coords.left.replace("%", "")),
                          y: parseFloat(location.coords.top.replace("%", "")),
                        };

                        // Convert to pixel coordinates (assuming 800x600 map)
                        const pixelCoords = {
                          x: (percentageCoords.x / 100) * 800,
                          y: (percentageCoords.y / 100) * 600,
                        };

                        // Convert to SVG coordinates
                        const svgCoords = convertCoordinates(pixelCoords);

                        return (
                          <motion.foreignObject
                            key={`gateway-svg-${safeActiveCategory}-${locationIndex}-${location.name}`}
                            x={svgCoords.x - 12}
                            y={svgCoords.y - 24}
                            width="24"
                            height="24"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                              duration: 0.5,
                              delay: locationIndex * 0.1 + 0.3,
                            }}
                            className="cursor-pointer"
                            onMouseEnter={() => setHoveredPin(location.name)}
                            onMouseLeave={() => setHoveredPin(null)}
                            whileHover={{ scale: 1.2 }}
                          >
                            <div className="w-full h-full flex items-center justify-center">
                              <img
                                src="/gateway-images/location.svg"
                                alt="Location"
                                className="w-full h-full drop-shadow-lg"
                              />
                            </div>
                          </motion.foreignObject>
                        );
                      }
                    )}

                    {/* Hover Image Cards for SVG Map Pins */}
                    <AnimatePresence>
                      {currentCategory?.locations?.map(
                        (location: any, locationIndex: number) => {
                          if (hoveredPin !== location.name) return null;

                          // Convert percentage coordinates to pixel coordinates first
                          const percentageCoords = {
                            x: parseFloat(
                              location.coords.left.replace("%", "")
                            ),
                            y: parseFloat(location.coords.top.replace("%", "")),
                          };

                          // Convert to pixel coordinates (assuming 800x600 map)
                          const pixelCoords = {
                            x: (percentageCoords.x / 100) * 800,
                            y: (percentageCoords.y / 100) * 600,
                          };

                          // Convert to SVG coordinates
                          const svgCoords = convertCoordinates(pixelCoords);

                          return (
                            <motion.foreignObject
                              key={`hover-${location.name}`}
                              x={svgCoords.x - 64}
                              y={svgCoords.y - 100}
                              width="128"
                              height="80"
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
                              <div className="w-full h-full bg-white rounded-xl overflow-hidden border border-gray-200 shadow-xl">
                                <div className="relative h-full w-full">
                                  <img
                                    src={location.image}
                                    alt={location.name}
                                    className="w-full h-[80%] object-cover p-1 rounded-xl"
                                  />
                                  {/* <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" /> */}
                                  <div className="absolute bottom-[-8px] left-2 right-2 p-2">
                                    <p className=" font-josefin text-xs font-medium truncate text-center text-background uppercase">
                                      {location.name}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </motion.foreignObject>
                          );
                        }
                      )}
                    </AnimatePresence>
                  </svg>

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

              {/* Right Column - Section Description and Buttons */}
              <motion.div variants={itemVariants} className="font-josefin flex flex-col w-full lg:w-[30%]">
                {/* <div
                  className="text-[#FFFFFFE5] description-text w-full text-center lg:text-left"
                  dangerouslySetInnerHTML={{
                    __html: gatewayData.sectionDescription,
                  }}
                /> */}
                <div className="space-y-3 mt-4 lg:mt-8">
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
