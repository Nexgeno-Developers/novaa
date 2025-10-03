"use client";

import React, { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import Image from "next/image";
import parse from "html-react-parser";
import { WaterEffectImage } from "./WaterEffectImage";

interface AdvantageItem {
  _id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
}

interface NovaaAdvantageSectionProps {
  title?: string;
  highlightedTitle?: string;
  description?: string;
  backgroundImage?: string;
  logoImage?: string;
  advantages?: AdvantageItem[];
  [key: string]: unknown;
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

export default function NovaaAdvantageSection({
  title = "THE",
  highlightedTitle = "NOVAA ADVANTAGE",
  description = "<p>Discover what makes NOVAA your premier choice for luxury real estate in Thailand.</p>",
  backgroundImage = "/advantage-section-images/background.png",
  logoImage = "/advantage-section-images/logo.png",
  advantages = [],
  ...props
}: NovaaAdvantageSectionProps) {
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [loadingStates, setLoadingStates] = useState({
    background: false,
    logo: false,
  });

  // console.log("Props", props);
  // console.log("Background Image", backgroundImage);
  // console.log("logoImage", logoImage);

  // Preload images
  useEffect(() => {
    const preloadImages = async () => {
      try {
        const promises = [];

        // Preload background image
        if (backgroundImage) {
          const bgPromise = new Promise((resolve, reject) => {
            const img = new window.Image();
            img.onload = () => {
              setLoadingStates((prev) => ({ ...prev, background: true }));
              resolve(img);
            };
            img.onerror = reject;
            img.src = backgroundImage;
          });
          promises.push(bgPromise);
        }

        // Preload logo image
        if (logoImage) {
          const logoPromise = new Promise((resolve, reject) => {
            const img = new window.Image();
            img.onload = () => {
              setLoadingStates((prev) => ({ ...prev, logo: true }));
              resolve(img);
            };
            img.onerror = reject;
            img.src = logoImage;
          });
          promises.push(logoPromise);
        }

        await Promise.all(promises);
        setImagesLoaded(true);
      } catch (error) {
        console.error("Error preloading images:", error);
        // Set loaded to true even on error to prevent infinite loading
        setImagesLoaded(true);
      }
    };

    preloadImages();
  }, [backgroundImage, logoImage]);

  // Helper functions for positioning
  const getPositionClasses = (position: string) => {
    const baseClasses = "absolute flex items-center";
    switch (position) {
      case "top-left":
        return `${baseClasses} top-6 left-8 md:top-[-1.8rem] md:left-[1.8rem] lg:top-[-4] lg:left-13 xl:left-10 2xl:left-15`;
      case "top-right":
        return `${baseClasses} top-6 right-8 md:top-[-1.8rem] md:right-[1.8rem] lg:top-[-4] lg:right-[-1.5rem] xl:right-[-2.5rem] 2xl:right-15`;
      case "left":
        return `${baseClasses} top-1/2 left-4 md:-left-[0.8rem] lg:left-[-0.5rem] xl:left-[-0.5rem] 2xl:left-[0rem] transform -translate-y-1/2`;
      case "right":
        return `${baseClasses} top-1/2 right-4 md:-right-[0.8rem] md:top-[8rem] lg:top-[9rem] lg:right-[-0.5rem] xl:right-[-1rem] xl:top-[11rem] 2xl:right-[0rem] transform -translate-y-1/2`;
      case "bottom-left":
        return `${baseClasses} bottom-8 left-8 md:bottom-[-2rem] md:left-[0.8rem] lg:bottom-[-2rem] xl:bottom-[-2rem]  2xl:bottom-[-3rem] lg:left-[2rem] xl:left-[2rem] 2xl:left-[3.5rem]`;
      case "bottom-right":
        return `${baseClasses} bottom-8 right-8 md:bottom-[-2rem] md:right-[0.5rem] lg:bottom-[-2rem] xl:bottom-[-2rem] lg:right-[2rem] 2xl:bottom-[-1.5rem] xl:right-[2rem] 2xl:right-[3.5rem]`;
      default:
        return baseClasses;
    }
  };

  const getContentPosition = (position: string) => {
    switch (position) {
      case "top-left":
        return "flex-row";
      case "top-right":
        return "flex-row-reverse";
      case "left":
        return "flex-row";
      case "right":
        return "flex-row-reverse";
      case "bottom-left":
        return "flex-row";
      case "bottom-right":
        return "flex-row-reverse";
      default:
        return "flex-row";
    }
  };

  // Animation variants
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

  const centerVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  // Sort advantages by order
  const sortedAdvantages = [...advantages].sort(
    (a, b) => (a.order || 0) - (b.order || 0)
  );

  return (
    <section className="font-cinzel relative bg-secondary pt-10 pb-15  lg:pt-20 lg:pb-30 overflow-hidden">
      {/* Preload images with Next.js Image component for better caching */}
      <div className="hidden">
        {backgroundImage && (
          <Image
            src={backgroundImage}
            alt="Preload background"
            width={400}
            height={400}
            priority
            onLoad={() =>
              setLoadingStates((prev) => ({ ...prev, background: true }))
            }
          />
        )}
        {logoImage && (
          <Image
            src={logoImage}
            alt="Preload logo"
            width={400}
            height={400}
            priority
            onLoad={() => setLoadingStates((prev) => ({ ...prev, logo: true }))}
          />
        )}
      </div>

      <div className="container">
        {/* Header */}
        <motion.div
          className="text-center mb-10 lg:mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-2xl sm:text-3xl lg:text-[50px] font-normal text-[#303030] mb-4">
            {title}{" "}
            <span className="font-bold bg-clip-text text-transparent bg-[#D4AF37]">
              {highlightedTitle}
            </span>
          </h2>

          <div className="font-josefin text-[#303030] description-text text-center">
            {parse(description)}
          </div>
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
            className="relative mx-auto w-60 h-60 xs:w-70 xs:h-70 sm:w-80 sm:h-80 md:w-[250px] md:h-[250px] lg:w-[300px] lg:h-[300px] xl:w-[360px] xl:h-[360px]"
            variants={centerVariants}
          >
            <div className="relative w-60 h-60 xs:w-70 xs:h-70 sm:w-80 sm:h-80 md:w-[250px] md:h-[250px] lg:w-[300px] lg:h-[300px] xl:w-[360px] xl:h-[360px] flex items-center justify-center before:content-[''] before:absolute before:inset-[-12px] before:rounded-full before:border-1 before:border-[#01292B] before:z-0">
              <div className="w-full h-full rounded-full overflow-hidden shadow-2xl relative z-10">
                {/* Loading placeholder */}
                {!imagesLoaded && (
                  <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                )}

                {/* Water effect image - only render when images are loaded */}
                {imagesLoaded && (
                  <WaterEffectImage
                    backgroundSrc={backgroundImage}
                    logoSrc={logoImage}
                    width={350}
                    height={350}
                    className="w-full h-full"
                    alt="Advantage Section Background"
                  />
                )}
              </div>
            </div>
          </motion.div>

          {/* Advantage Items */}
          {sortedAdvantages.map((advantage, index) => {
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
                  className={`${getContentPosition(
                    layout.position
                  )} hidden md:flex ${
                    index % 2 === 1 ? "gap-4" : "gap-0"
                  } font-josefin max-w-[220px] lg:max-w-[320px] ${
                    index === 1
                      ? "xl:max-w-[480px] lg:max-w-[400px]"
                      : "xl:max-w-[400px]"
                  } 2xl:max-w-[520px] space-x-2`}
                >
                  <div className="font-josefin">
                    <h3 className="text-sm lg:text-base xl:text-xl font-normal text-background max-w-full">
                      {advantage.title && advantage.title}
                    </h3>
                    <div className="text-[#303030] line-clamp-3 xl:line-clamp-none text-xs lg:text-sm xl:text-base 2xl:text-lg font-light">
                      {parse(advantage.description)}
                    </div>
                  </div>
                  <div
                    style={{
                      background:
                        "radial-gradient(117.4% 117.54% at -15.51% 0%, #C3912F 0%, #F5E7A8 16.95%, #C3912F 100%)",
                    }}
                    className="hidden flex-shrink-0 w-10 h-10 lg:w-16 lg:h-16 xl:w-20 xl:h-20 2xl:w-24 2xl:h-24
 bg-[#C3912F] rounded-full md:flex items-center justify-center shadow-lg relative"
                  >
                    <div className="w-[50%] h-[50%] relative">
                      <Image
                        src={advantage.icon}
                        alt="icon"
                        fill
                        className="object-contain"
                      />
                    </div>
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
            {sortedAdvantages.map((advantage) => (
              <motion.div
                key={`mobile-${advantage._id}`}
                className="bg-white rounded-xl p-2 my-2 shadow-lg"
                variants={itemVariants}
              >
                <div className="font-josefin flex items-center space-x-4">
                  <div className="flex items-center justify-between gap-4 py-2">
                    <Image
                      src={advantage.icon}
                      width={70}
                      height={50}
                      alt="icon"
                      className="pl-4"
                    />
                    <div className="flex flex-col">
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                        {advantage.title}
                      </h3>
                      <div className="font-josefin description-text text-[#303030]">
                        {parse(advantage.description)}
                      </div>
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
}
