"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import Image from "next/image";

export default function WhyInvestSection() {
  const investmentPoints = [
    {
      id: 1,
      icon: "/icons/capital.svg",
      title: "Capital Appreciation",
      description:
        "Thailand's property market offers robust long-term growth, with luxury properties in Phuket appreciating by 8-10% annually due to high demand from international buyers and limited supply",
    },
    {
      id: 2,
      icon: "/icons/dollar.svg",
      title: "Rental Benefits",
      description:
        "Enjoy high rental yields of 6-8% in prime locations like Phuket and Bangkok, driven by a thriving tourism industry attracting over 40 million visitors yearly.",
    },
    {
      id: 3,
      icon: "/icons/location.svg",
      title: "Tourism Boom",
      description:
        "Phuket welcomed 12 million tourists in 2024, fueling demand for luxury accommodations and ensuring strong rental income for investors.",
    },
    {
      id: 4,
      icon: "/icons/economy.svg",
      title: "Economic Stability",
      description:
        "Thailand's steady GDP growth and foreigner-friendly policies create a secure environment for investments, supported by world-class infrastructure and healthcare.",
    },
  ];

  const images = [
    "/images/invest-one.png",
    "/images/invest-two.png",
    "/images/invest-three.png",
    "/images/invest-four.png",
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const imageVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="font-cinzel py-10 sm:py-16 lg:py-24 bg-secondary">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-12 xl:gap-16 items-start">
          {/* Left Column - Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="space-y-4 sm:space-y-6"
          >
            {/* Header */}
            <motion.div
              variants={itemVariants}
              className=" md:space-y-2 text-center xl:text-left"
            >
              <h2 className="text-2xl sm:text-3xl lg:text-[50px] font-normal text-[#303030]">
                Why Invest in
              </h2>
              <h3 className="text-2xl sm:text-3xl lg:text-[50px] font-bold text-[#D4AF37]">
                Phuket Thailand
              </h3>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              variants={itemVariants}
              className="font-josefin text-black description-text text-center xl:text-left "
            >
              With tourism revenue at 497.5 billion in 2024, making Phuket
              Thailand&#39;s top-earning province and a real estate market
              growing 5-7% per year, now is the time to explore high-potential
              opportunities in coastal investment.
            </motion.p>
            <motion.p
              variants={itemVariants}
              className="font-josefin text-black description-text text-center xl:text-left "
            >
              Phuket offers more than beachfront views,it delivers solid
              returns, high rental demand, and long-term stability in one of
              Asia&#39;s most dynamic coastal economies.
            </motion.p>
            {/* Investment Points */}
            <motion.div variants={containerVariants} className="lg:space-y-6">
              {investmentPoints.map((point, index) => (
                <motion.div
                  key={point.id}
                  variants={itemVariants}
                  className="flex items-start gap-6 group py-2"
                >
                  {/* Icon Circle */}
                  <div className="flex-shrink-0 h-15 w-15 sm:w-20 sm:h-20 bg-[#D4AF37] rounded-full flex items-center justify-center text-white group-hover:bg-[#B8851A] transition-colors duration-300">
                    <Image
                      src={point.icon}
                      width={30}
                      height={30}
                      alt="icon"
                      className=""
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-2 font-josefin">
                    <h4 className="text-lg sm:text-xl font-normal text-[#01292B]">
                      {point.title}
                    </h4>
                    <p className="text-[#303030] description-text">
                      {point.description}
                    </p>
                    {/* {point.details && (
                      <p className="text-sm text-gray-500 leading-relaxed">
                        {point.details}
                      </p>
                    )} */}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Column - 4-Image Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="flex flex-wrap gap-2 sm:gap-4 h-full sm:py-10"
          >
            {/* Image 1 */}
            <motion.div
              variants={imageVariants}
              className="relative h-80 lg:h-110 basis-[48.5%] sm:basis-[50%] md:basis-[50%] lg:basis-[54%] rounded-3xl overflow-hidden"
            >
              <Image
                src={images[0]}
                alt="Luxury Development Aerial View"
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
            </motion.div>

            {/* Image 2 */}
            <motion.div
              variants={imageVariants}
              className="relative h-80 lg:h-110 basis-[48.5%] sm:basis-[50%] md:basis-[50%] lg:basis-[43%] rounded-3xl overflow-hidden shadow-lg"
            >
              <Image
                src={images[1]}
                alt="Modern Architecture"
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
            </motion.div>

            {/* Image 3 */}
            <motion.div
              variants={imageVariants}
              className="relative h-80 lg:h-110 basis-[48.5%] sm:basis-[50%] md:basis-[50%] lg:basis-[60%] rounded-3xl overflow-hidden shadow-lg"
            >
              <Image
                src={images[2]}
                alt="Tropical Resort"
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
            </motion.div>

            {/* Image 4 */}
            <motion.div
              variants={imageVariants}
              className="relative h-80 lg:h-110 basis-[48.5%] sm:basis-[50%] md:basis-[50%] lg:basis-[37%] rounded-3xl overflow-hidden shadow-lg"
            >
              <Image
                src={images[3]}
                alt="Luxury Pool Area"
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
