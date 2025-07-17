"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

const CrisisInvestPeaceSection = () => {
  const features = [
    {
      id: 1,
      title: "Safe Tourist Hub",
      icon: "/invest/icon-one.svg",
      description: "Secure and stable investment environment",
    },
    {
      id: 2,
      title: "Assured Roi",
      icon: "/invest/icon-two.svg",
      description: "Guaranteed returns on your investment",
    },
    {
      id: 3,
      title: "Medical+ Legal Safety",
      icon: "/invest/icon-three.svg",
      description: "Comprehensive protection and support",
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
    hidden: { opacity: 0, y: 30 },
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
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const buttonVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        delay: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-20 overflow-hidden">
      {/* Background Pattern */}

      <div className="relative z-10 w-full">
        <div className="">
          {/* Header */}
          <motion.div
            className="max-w-6xl mx-auto text-center mb-16"
            variants={headingVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="font-cinzel text-4xl lg:text-5xl xl:text-6xl font-normal text-[#01292B] mb-6 leading-tight">
              WHEN CRISIS STRIKES AT INVEST IN
            </h2>
            <h3
              className=" font-cinzel text-4xl lg:text-5xl xl:text-6xl font-bold mb-8 bg-clip-text text-transparent leading-tight"
              style={{
                background: "linear-gradient(0deg, #D4AF37, #D4AF37)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              PEACE ABROAD
            </h3>
            <p className="font-josefin font-light text-[#303030] text-lg lg:text-xl max-w-4xl mx-auto ">
              From pandemics to storms, uncertainties may pause life in india.
              But your investment journey doesn&apos;t have to stop. Phuket is
              stable, safe, and growing - keep your dreams moving forward.
            </p>
          </motion.div>

          {/* Features */}
          <motion.div
            className="flex flex-col w-full bg-[#CDB04E1A] lg:flex-row items-center justify-center gap-8 lg:gap-16 mb-16 py-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            {features.map((feature, index) => {
              return (
                <motion.div
                  key={feature.id}
                  className="flex flex-col sm:flex-row  items-center text-center gap-4 group"
                  variants={itemVariants}
                  whileHover={{
                    scale: 1.05,
                    transition: { duration: 0.3 },
                  }}
                >
                  {/* Icon Circle */}
                  <motion.div
                    className="w-20 h-20 lg:w-24 lg:h-24 bg-[#01292B] rounded-full flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                    whileHover={{
                      backgroundColor: "#052d2f",
                      transition: { duration: 0.3 },
                    }}
                  >
                    <Image
                      src={feature.icon}
                      alt="logo"
                      width={30}
                      height={30}
                    />
                  </motion.div>

                  {/* Title */}
                  <h4 className="font-josefin text-lg lg:text-xl font-normal text-[#01292B] mb-2">
                    {feature.title}
                  </h4>

                  {/* Description (Hidden by default, shown on hover for additional context) */}
                  {/* <motion.p
                    className="text-sm text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                  >
                    {feature.description} */}
                  {/* </motion.p> */}
                </motion.div>
              );
            })}
          </motion.div>

          {/* Call to Action Button */}
          <motion.div
            className="flex justify-center"
            variants={buttonVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.button
              className="group relative inline-flex items-center px-8 py-4 text-[#01292B] font-semibold text-lg rounded-lg shadow-lg overflow-hidden"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(212, 175, 55, 0.3)",
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.3 }}
              style={{
                background:
                  "radial-gradient(157.46% 212.5% at -41.59% -68.75%, #C3912F 0%, #F5E7A8 50.26%, #C3912F 100%)",
              }}
            >
              {/* Background animation */}
              <motion.div
                className="absolute inset-0 "
                initial={{ x: "-100%" }}
                whileHover={{ x: "0%" }}
                transition={{ duration: 0.3 }}
              />

              {/* Button content */}
              <span className="relative z-10 mr-2">
                Continue Your Investment In Phuket
              </span>
              <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CrisisInvestPeaceSection;
