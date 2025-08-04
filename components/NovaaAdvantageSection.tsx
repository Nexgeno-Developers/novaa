"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { Award, Shield, Eye, Users, TrendingUp, Building } from "lucide-react";
import Image from "next/image";

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
    <section className="font-cinzel relative bg-secondary py-20 overflow-hidden">
      <div className="container mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl lg:text-5xl font-normal text-gray-800 mb-4">
            THE NOVAA{" "}
            <span className="text-5xl lg:text-5xl font-bold bg-clip-text text-transparent bg-[#D4AF37]">
              ADVANTAGE
            </span>
          </h2>
          <p className="font-josefin text-[#303030] text-lg lg:text-xl mx-auto leading-relaxed">
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
            className="relative mx-auto w-80 h-80 lg:w-96 lg:h-96 xl:w-[450px] xl:h-[450px]"
            variants={centerVariants}
          >
            {/* Outer Ring Border */}
            <div className="relative w-80 h-80 lg:w-[420px] lg:h-[420px] flex items-center justify-center before:content-[''] before:absolute before:inset-[-12px] before:rounded-full before:border-1 before:border-[#01292B] before:z-0">
              {/* Background Circle with Image */}
              <div className="w-full h-full rounded-full overflow-hidden shadow-2xl relative z-10">
                {/* Background Image */}
                <div className="absolute inset-0">
                  <Image
                    src={"/advantage-section-images/bg.jpg"}
                    fill
                    className="object-cover "
                    alt="background"
                  />
                </div>
                <div className="absolute inset-0 bg-[#01292B99]"></div>

                {/* Center Logo/Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-28 h-28 lg:w-50 lg:h-50 bg-transparent rounded-full flex items-center justify-center">
                    <Image
                      src={"/advantage-section-images/logo.png"}
                      width={200}
                      height={200}
                      alt="icon"
                    />
                  </div>
                </div>

                {/* Overlay gradient (optional) */}
                {/* <div className="absolute inset-0 bg-gradient-to-br from-transparent via-black/10 to-black/20"></div> */}
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
                    <h3 className="text-sm lg:text-xl font-normal text-background">
                      {advantage.title}
                    </h3>
                    <p className="text-xs lg:text-base font-light text-[#303030] leading-relaxed">
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

        {/* Mobile Layout - 2 Cards Per Row */}
        <div className="md:hidden mt-16">
          <motion.div
            className="grid grid-cols-2 gap-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {advantages.map((advantage, index) => (
              <motion.div
                key={`mobile-${advantage.id}`}
                className="bg-white rounded-xl p-4 shadow-lg"
                variants={itemVariants}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="font-josefin flex items-center flex-col space-x-4">
                  <div className="flex items-center justify-between gap-4 py-2">
                  <Image
                    src={advantage.icon}
                    width={40}
                    height={40}
                    alt="icon"
                  />
                  <h3 className="text-sm font-semibold text-gray-800">
                    {advantage.title}
                  </h3>
                  </div>
                </div>
                  <p className=" font-josefin text-xs text-gray-600 leading-relaxed">
                    {advantage.description}
                  </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default NovaaAdvantageSection;
