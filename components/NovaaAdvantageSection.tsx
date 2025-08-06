"use client";

import React from "react";
import { useEffect } from "react";
import { motion, Variants } from "framer-motion";
import { Award, Shield, Eye, Users, TrendingUp, Building } from "lucide-react";
import Image from "next/image";
import { WaterEffectImage } from "./WaterEffectImage";

const NovaaAdvantageSection = () => {
  const advantages = [
    {
      id: 1,
      title: "Scouting Excellence",
      description:
        "We identify prime properties in high-growth areas, ensuring maximum returns and flexibility.",
      icon: "/advantage-section-images/icon-one.png",
      position: "top-left",
      angle: -45,
    },
    {
      id: 2,
      title: "Freehold & Rental Income Support",
      description:
        "Secure freehold ownership and set up rentals or your rental income with guaranteed returns.",
      icon: "/advantage-section-images/icon-two.png",
      position: "top-right",
      angle: 45,
    },
    {
      id: 3,
      title: "Unmatched Transparency",
      description:
        "Every transaction is clear and documented, ensuring you gain the complete peace of mind.",
      icon: "/advantage-section-images/icon-three.png",
      position: "left",
      angle: -90,
    },
    {
      id: 4,
      title: "Bureaucratic Ease",
      description:
        "We manage all regulatory processes, so you can focus on enjoying your investment.",
      icon: "/advantage-section-images/icon-four.png",
      position: "right",
      angle: 90,
    },
    {
      id: 5,
      title: "Visa & Legal Assistance",
      description:
        "From residency programs to legal consultations, we provide comprehensive support.",
      icon: "/advantage-section-images/icon-five.png",
      position: "bottom-left",
      angle: -135,
    },
    {
      id: 6,
      title: "Expert Curation",
      description:
        "Early property selection and exclusive access to the best developments of the global elite.",
      icon: "/advantage-section-images/icon-six.png",
      position: "bottom-right",
      angle: 135,
    },
  ];

  const getPositionClasses = (position: string) => {
    const baseClasses = "absolute flex items-center";
    switch (position) {
      case "top-left":
        return `${baseClasses} top-8 left-8 md:top-0 md:left-0 lg:top-0 lg:left-5`;
      case "top-right":
        return `${baseClasses} top-8 right-8 md:top-0 md:-right-8 lg:top-0 lg:right-10`;
      case "left":
        return `${baseClasses} top-1/2 left-4 md:left-0 lg:left-[-2rem] transform -translate-y-1/2`;
      case "right":
        return `${baseClasses} top-1/2 right-4 md:-right-10 lg:right-[-1rem] transform -translate-y-1/2`;
      case "bottom-left":
        return `${baseClasses} bottom-8 left-8 md:bottom-0 lg:bottom-0 lg:left-[1rem]`;
      case "bottom-right":
        return `${baseClasses} bottom-8 right-8 md:bottom-0 md:-right-10 lg:bottom-0 lg:right-[3rem]`;
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

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        duration: 0.8,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const centerVariants: Variants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1,
        ease: "easeOut",
        delay: 0.3,
      },
    },
  };

  return (
    <section className="font-cinzel relative bg-secondary py-10 lg:py-20 overflow-hidden">
      <div className="container mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-10 lg:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-xl xs:text-2xl sm:text-3xl lg:text-[50px] font-normal text-[#303030] mb-4">
            THE NOVAA{" "}
            <span className="font-bold bg-clip-text text-transparent bg-[#D4AF37]">
              ADVANTAGE
            </span>
          </h2>
          <p className="font-josefin text-[#303030] text-xs xs:text-sm sm:text-base lg:text-xl mx-auto leading-relaxed px-4 lg:px-0">
            At Novaa, we redefine the investment experience by offering
            end-to-end solutions tailored for HNIs
          </p>
        </motion.div>

        {/* Main Content Area */}
        <motion.div
          className="relative container mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Central Circle */}
          <motion.div
            className="relative mx-auto w-60 h-60 xs:w-70 xs:h-70 sm:w-80 sm:h-80 lg:w-96 lg:h-96 xl:w-[450px] xl:h-[450px]"
            variants={centerVariants}
          >
            {/* Outer Ring Border */}
            <div className="relative w-60 h-60 xs:w-70 xs:h-70 sm:w-80 sm:h-80 md:w-[380px] md:h-[380px] xl:w-[420px] xl:h-[420px] flex items-center justify-center before:content-[''] before:absolute before:inset-[-12px] before:rounded-full before:border-1 before:border-[#01292B] before:z-0">
              {/* Background Circle with Image */}
              {/* Background Circle with Water Effect */}
              <div className="w-full h-full rounded-full overflow-hidden shadow-2xl relative z-10">
                <WaterEffectImage
                  backgroundSrc="/advantage-section-images/background.png"
                  logoSrc="/advantage-section-images/logo.png"
                  className="w-full h-full"
                  alt="Advantage Section Background"
                />
              </div>
            </div>
          </motion.div>

          {/* Advantage Items */}
          {advantages.map((advantage, index) => {
            return (
              <motion.div
                key={advantage.id}
                className={getPositionClasses(advantage.position)}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <div
                  className={`${getContentPosition(
                    advantage.position
                  )} hidden  sm:flex font-josefin max-w-[250px] lg:max-w-sm space-x-4`}
                >
                  {/* Content */}
                  <div className="font-josefin space-y-2 mx-4">
                    <h3 className="text-sm md:text-lg lg:text-xl font-normal text-background">
                      {advantage.title}
                    </h3>
                    <p className="text-xs md:text-sm lg:text-base font-light text-[#303030] leading-relaxed">
                      {advantage.description}
                    </p>
                  </div>

                  {/* Icon Circle */}
                  <div className="hidden flex-shrink-0 w-16 h-16 lg:w-20 lg:h-20 rounded-full lg:flex items-center justify-center shadow-lg">
                    <Image
                      src={advantage.icon}
                      width={100}
                      height={100}
                      alt="icon"
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Mobile Layout - 1 Cards Per Row */}
        <div className="md:hidden mt-10">
          <motion.div
            className="grid grid-cols-1"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {advantages.map((advantage, index) => (
              <motion.div
                key={`mobile-${advantage.id}`}
                className="bg-white rounded-xl p-2 m-2 shadow-lg"
                variants={itemVariants}
              >
                <div className="font-josefin flex items-center space-x-4">
                  <div className="flex items-center justify-between gap-4 py-2">
                    <Image
                      src={advantage.icon}
                      width={40}
                      height={40}
                      alt="icon"
                    />
                    <div className="flex flex-col">
                      <h3 className="text-sm font-semibold text-gray-800">
                        {advantage.title}
                      </h3>
                      <p className=" font-josefin text-[10px] xs:text-xs text-gray-600 leading-relaxed">
                        {advantage.description}
                      </p>
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
