"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { ArrowUp, ArrowDown } from "lucide-react";

const ClientTestimonialsSection = () => {
  const [expandedIndex, setExpandedIndex] = useState(0);

  const testimonials = [
    {
      id: 1,
      preview:
        "is simply dummy text of the printing and typesetting industry. Lorem",
      fullText:
        "is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries.",
    },
    {
      id: 2,
      preview:
        "is simply dummy text of the printing and typesetting industry. Lorem",
      fullText:
        "is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
    },
    {
      id: 3,
      preview:
        "is simply dummy text of the printing and typesetting industry. Lorem",
      fullText:
        "is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting.",
    },
    {
      id: 4,
      preview:
        "is simply dummy text of the printing and typesetting industry. Lorem",
      fullText:
        "is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s.",
    },
  ];

  const toggleExpanded = (index : number) => {
    // console.log("Index" , index);
    setExpandedIndex(expandedIndex === index ? -1 : index);
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

  return (
    <section className="relative min-h-[142vh] overflow-hidden">
      {/* Background Image Placeholder */}
      <div className="absolute inset-0 ">
        {/* You can replace this with your actual background image */}
        <div className="absolute inset-0 bg-[url('/clients/bg.png')] bg-cover bg-center opacity-100"></div>
      </div>

      {/* Overlay with specified gradient */}
      <div
        className="absolute inset-0 z-10 opacity-90"
        style={{
          backgroundColor: "#01292BE5",
        }}
      />

      {/* Content */}
      <div className="font-cinzel relative z-20 container mx-auto px-4 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            className="text-center mb-16"
            variants={headingVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl xl:text-6xl font-normal text-white mb-6">
              WHAT{" "}
              <span
                className="font-bold bg-clip-text text-transparent"
                style={{
                  background:
                    "radial-gradient(59.18% 59.18% at 25.81% 20.89%, #C3912F 0%, #F5E7A8 48.93%, #C3912F 100%) ",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                OUR CLIENTS
              </span>{" "}
              SAY
            </h2>
            <p className="font-josefin font-light text-[#FFFFFFE5] text-lg lg:text-xl">
              Real feedback from the people who trust us with their goals.
            </p>
          </motion.div>

          {/* Testimonials Accordion */}
          <motion.div
            className="space-y-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                className="border-[0.5px] border-[#CDB04E] rounded-2xl overflow-hidden backdrop-blur-xs"
                variants={itemVariants}
                whileHover={{
                  
                  borderColor: "#e1c159",
                  transition: { duration: 0.3 },
                }}
              >
                <motion.button
                  className="w-full p-6 text-left focus:outline-none"
                  onClick={() => toggleExpanded(index)}
                  whileHover={{ backgroundColor: "rgba(212, 175, 55, 0.05)" }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-josefin text-[#C3912F] text-lg pr-4">
                        {testimonial.preview}
                      </p>
                    </div>
                    <motion.div
                      className="flex-shrink-0 ml-4"
                      // animate={{ rotate: expandedIndex === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {expandedIndex === index ? (
                        <ArrowUp className="w-6 h-6 text-[#C3912F]" />
                      ) : (
                        <ArrowDown className="w-6 h-6 text-[#C3912F]" />
                      )}
                    </motion.div>
                  </div>
                </motion.button>

                <AnimatePresence>
                  {expandedIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-2">
                        <div className="h-px bg-[#FFFFFF80] mb-4"></div>
                        <motion.p
                          className="font-josefin text-[#FFFFFF] text-md font-light"
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.1, duration: 0.3 }}
                        >
                          {testimonial.fullText}
                        </motion.p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ClientTestimonialsSection;
