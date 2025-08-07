"use client";

import { motion, Variants } from "framer-motion";
import Image from "next/image";

const Highlights = () => {
  const highlights = [
    "1 & 2 BHK premium apartments",
    "Vastu-compliant homes",
    "G+4 storey towers",
    "Prime Location in the Heart of Phuket",
    "Surrounded by nature and green zones",
    "Just 25 Minutes from Phuket International Airport",
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        duration: 0.6,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 30,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/images/highlights/bg.jpg')`,
        }}
      />

      {/* Color Overlay */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{ backgroundColor: "#01292BCC" }}
      />

      {/* Top to Bottom Gradient */}
      <div className="absolute inset-0 w-full h-1/3 bg-gradient-to-b from-[#01292B] to-[#01292B00]" />

      {/* Bottom to Top Gradient */}
      <div className="absolute inset-x-0 bottom-0 w-full h-1/4 bg-gradient-to-t from-[#01292B] to-[#01292B00]" />

      {/* Content Container */}
      <div className="relative z-10 container py:10 sm:py-24 min-h-screen flex flex-col justify-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
          className=""
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="mb-16">
            <h2 className="font-cinzel text-3xl md:text-4xl lg:text-[40px] font-normal text-white mb-6 text-center sm:text-left">
              PROJECT <span className="text-primary font-bold">HIGHLIGHTS</span>
            </h2>
            <p className="font-josefin text-white font-light text-sm md:text-base max-w-2xl leading-relaxed text-center sm:text-left">
              Is simply dummy text of the printing and typesetting industry.
              Lorem Ipsum has been the industry&apos;s standard dummy text ever since
              the 1500s.
            </p>
          </motion.div>

          {/* Highlights Grid */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12"
          >
            {highlights.map((highlight, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flex items-center space-x-4 group"
              >
                <div className="flex-shrink-0 mt-1">
                  <Image
                    src={"/icons/pin.svg"}
                    alt="pin icon"
                    width={30}
                    height={30}
                  />
                </div>
                <p className="font-josefin text-white text-lg md:text-xl font-normal leading-relaxed group-hover:text-primary transition-colors duration-300">
                  {highlight}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Highlights;
