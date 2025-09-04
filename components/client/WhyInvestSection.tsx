"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import Image from "next/image";

interface InvestmentPoint {
  _id: string;
  title: string;
  description: string;
  icon: string;
}

interface WhyInvestSectionProps {
  mainTitle?: string;
  highlightedTitle?: string;
  description?: string;
  investmentPoints?: InvestmentPoint[];
  images?: string[];
  [key: string]: unknown;
}

export default function WhyInvestSection({
  mainTitle = "WHY INVEST IN",
  highlightedTitle = "PHUKET",
  description = "<p>Discover the benefits of investing in Phuket's thriving real estate market.</p>",
  investmentPoints = [],
  images = [
    "/images/invest1.jpg",
    "/images/invest2.jpg", 
    "/images/invest3.jpg",
    "/images/invest4.jpg"
  ],
  ...props
}: WhyInvestSectionProps) {

  console.log("Props of why invest " , props)

  // Framer-motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };
  
  const itemVariants: Variants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };
  
  const imageVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, ease: "easeOut" },
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
            <motion.div
              variants={itemVariants}
              className="md:space-y-2 text-center xl:text-left"
            >
              <h2 className="text-2xl sm:text-3xl lg:text-[50px] font-normal text-[#303030]">
                {mainTitle}
              </h2>
              <h3 className="text-2xl sm:text-3xl lg:text-[50px] font-bold text-[#D4AF37]">
                {highlightedTitle}
              </h3>
            </motion.div>

            {/* The description can be rendered safely using dangerouslySetInnerHTML for TinyMCE content */}
            <motion.div
              variants={itemVariants}
              className="font-josefin text-[#303030] description-text text-center xl:text-left space-y-4"
              dangerouslySetInnerHTML={{ __html: description }}
            />

            <motion.div variants={containerVariants} className="lg:space-y-6">
              {investmentPoints.map((point) => (
                <motion.div
                  key={point._id}
                  variants={itemVariants}
                  className="flex items-start gap-6 group py-2"
                >
                  <div className="flex-shrink-0 h-15 w-15 sm:w-20 sm:h-20 bg-[#D4AF37] rounded-full flex items-center justify-center text-white group-hover:bg-[#B8851A] transition-colors duration-300">
                    <Image src={point.icon} width={30} height={30} alt="icon" />
                  </div>
                  <div className="flex-1 space-y-2 font-josefin">
                    <h4 className="text-lg sm:text-xl font-normal text-[#01292B]">
                      {point.title}
                    </h4>
                    <p className="text-[#303030] description-text">
                      {point.description}
                    </p>
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
            className="flex flex-wrap gap-3 lg:gap-4 h-full sm:py-10"
          >
            {/* Image 1 */}
            {images[0] && (
              <motion.div
                variants={imageVariants}
                className="relative h-80 lg:h-110 basis-[48.5%] md:basis-[48.5%] lg:basis-[52%] xl:basis-[54%] rounded-3xl overflow-hidden"
              >
                <Image
                  src={images[0]}
                  alt="Investment Image 1"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
              </motion.div>
            )}
            
            {/* Image 2 */}
            {images[1] && (
              <motion.div
                variants={imageVariants}
                className="relative h-80 lg:h-110 basis-[48.5%] md:basis-[48.5%] lg:basis-[43%] rounded-3xl overflow-hidden shadow-lg"
              >
                <Image
                  src={images[1]}
                  alt="Investment Image 2"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
              </motion.div>
            )}
            
            {/* Image 3 */}
            {images[2] && (
              <motion.div
                variants={imageVariants}
                className="relative h-80 lg:h-110 basis-[48.5%] md:basis-[48.5%] lg:basis-[58%] xl:basis-[60%] rounded-3xl overflow-hidden shadow-lg"
              >
                <Image
                  src={images[2]}
                  alt="Investment Image 3"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
              </motion.div>
            )}
            
            {/* Image 4 */}
            {images[3] && (
              <motion.div
                variants={imageVariants}
                className="relative h-80 lg:h-110 basis-[48.5%] md:basis-[48.5%] lg:basis-[37%] rounded-3xl overflow-hidden shadow-lg"
              >
                <Image
                  src={images[3]}
                  alt="Investment Image 4"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}