"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import Image from "next/image";

const PhuketPropertiesSection = () => {
  const features = [
    {
      title: "Strategic Locations",
      description:
        "All projects are conveniently near popular tourist sites at upcoming prime areas.",
    },
    {
      title: "Rental Potential",
      description:
        "High demand from expats and tourists for short-term and long-term rentals.",
    },
    {
      title: "Modern Lifestyle",
      description:
        "Premium amenities, cosmopolitan design, and luxury conveniences.",
    },
    {
      title: "Developer Trust",
      description:
        "Respected developers like Banyan Group and Origin ensure quality and timely delivery.",
    },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        duration: 0.8,
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

  return (
    <section className="relative min-h-screen overflow-hidden">
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: `
      linear-gradient(270deg, rgba(1, 41, 43, 0) -542.65%, #01292B 100%),
      url('/images/background.jpg')
    `,
        }}
      />

      {/* Top gradient overlay */}
      {/* <div
        className="absolute top-0 left-0 w-full h-full z-10"
        style={{
          background:
            "linear-gradient(180deg, rgba(1, 41, 43, 0) 0%, #01292B 100%)",
        }}
      /> */}

      {/* Bottom gradient overlay */}
      {/* <div 
        className="absolute bottom-0 left-0 w-full h-full z-10"
        style={{
          background: 'linear-gradient(0deg, rgba(1, 41, 43, 0) 0%, #01292B 100%)'
        }}
      /> */}

      <div className="relative z-20 container mx-auto px-4 lg:px-8 py-20">
        <div className="font-cinzel grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-screen">
          {/* Left Content */}
          <motion.div
            className="space-y-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            {/* Main Heading */}
            <motion.div variants={headingVariants} className="space-y-4">
              <h1 className="text-white text-2xl lg:text-3xl xl:text-4xl font-normal">
                DISCOVER PRIME PROPERTIES
              </h1>
              <h2
                className="text-2xl lg:text-3xl xl:text-4xl font-bold bg-clip-text text-transparent"
                style={{
                  background:
                    "radial-gradient(55.66% 55.66% at -0.55% 62.22%, #C3912F 0%, #F5E7A8 51.68%, #C3912F 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                ACROSS PHUKET
              </h2>
            </motion.div>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="font-josefin text-[#FFFFFF] text-md lg:text-lg font-light max-w-2xl"
            >
              Explore our Curated Selection of Luxury Residences. Whether you're
              seeking a beachfront villa, an investment opportunity, or a
              peaceful escape, unveil infinite blue development opportunities
              built of lifestyle and location in Phuket.
            </motion.p>

            {/* Why Invest Section */}
            <motion.div variants={itemVariants} className="space-y-6">
              <h3 className="font-josefin text-white text-xl lg:text-2xl font-medium">
                Why Invest in These Locations?
              </h3>

              <div className="space-y-6">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="flex items-start space-x-4"
                  >
                    {/* Gold Circle Icon */}
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-r from-[#C3912F] via-[#F5E7A8] to-[#C3912F]">
                        <Image
                          src={"/icons/pin.svg"}
                          alt="pin icon"
                          width={50}
                          height={50}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-josefin text-[#C3912F] text-xl font-normal">
                        {feature.title}
                      </h4>
                      <p className="font-josefin text-white text-base font-light">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side - Map Placeholder */}
          <motion.div
            className="flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
             <Image src={'/images/map2.png'} alt="map" width={400} height={400} />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PhuketPropertiesSection;
