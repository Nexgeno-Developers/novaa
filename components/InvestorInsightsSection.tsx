"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

type Testimonial = {
  quote: string;
  name: string;
  designation: string;
  src: string;
};

const AnimatedTestimonials = ({
  testimonials,
  autoplay = false,
}: {
  testimonials: Testimonial[];
  autoplay?: boolean;
}) => {
  const [active, setActive] = useState(0);

  const handleNext = () => {
    setActive((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const isActive = (index: number) => {
    return index === active;
  };

  useEffect(() => {
    if (autoplay) {
      const interval = setInterval(handleNext, 5000);
      return () => clearInterval(interval);
    }
  }, [autoplay]);

  const randomRotateY = () => {
    return Math.floor(Math.random() * 21) - 10;
  };

  return (
    <div className="flex items-center justify-center">
      <div className="relative h-100 w-100 container mx-auto">
        <AnimatePresence>
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.src}
              initial={{
                opacity: 0,
                scale: 0.9,
                z: -100,
                rotate: randomRotateY(),
              }}
              animate={{
                opacity: isActive(index) ? 1 : 0.7,
                scale: isActive(index) ? 1 : 0.95,
                z: isActive(index) ? 0 : -100,
                rotate: isActive(index) ? 0 : randomRotateY(),
                zIndex: isActive(index) ? 40 : testimonials.length + 2 - index,
                y: isActive(index) ? [0, -80, 0] : 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.9,
                z: 100,
                rotate: randomRotateY(),
              }}
              transition={{
                duration: 0.8,
                ease: "easeInOut",
              }}
              className="absolute inset-0 origin-bottom"
            >
              <div className="relative h-full rounded-3xl bg-white shadow-2xl overflow-hidden">
                {/* Image Container with padding */}
                <div className="p-4 pb-2">
                  <img
                    src={testimonial.src}
                    alt={testimonial.name}
                    className="w-full h-70 rounded-2xl object-cover object-center"
                    draggable={false}
                  />
                </div>

                {/* Content below image */}
                <div className="px-4 pb-4">
                  <p className="font-josefin text-xs text-[#303030] font-light">
                    {testimonial.quote}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default function InvestorInsightsSection() {
  const propertyInsights = [
    {
      quote:
        "Luxury residential properties in 2024 with heavy property demand averaging 25% increase while rental yields in prime areas reached 7.8%, making it a new destination for HNIs.",
      name: "Luxury Property Market",
      designation: "2024 Market Analysis",
      src: "/images/invest-three.png",
    },
    {
      quote:
        "Commercial real estate opportunities showing 15% growth in Q3 2024, with office spaces in prime locations commanding premium rents.",
      name: "Commercial Real Estate",
      designation: "Q3 2024 Report",
      src: "/images/invest-four.png",
    },
    {
      quote:
        "Sustainable developments and green building initiatives are driving new investment patterns with 20% higher appreciation rates.",
      name: "Sustainable Development",
      designation: "Green Investment Trends",
      src: "/images/invest-three.jpg",
    },
    {
      quote:
        "Smart city developments and infrastructure projects are creating new opportunities for forward-thinking investors.",
      name: "Smart City Projects",
      designation: "Future Development",
      src: "/images/invest-two.png",
    },
    {
      quote:
        "Residential townships with integrated amenities showing consistent 12% annual growth in tier-2 cities across India.",
      name: "Residential Townships",
      designation: "Growth Markets",
      src: "/images/invest-one.png",
    },
  ];

  return (
    <div className="bg-background relative overflow-hidden py-20  ">

<div className="absolute top-[20%] bottom-[20%] left-0 right-0 bg-[#CDB04E0D] z-10" />

      <div className="container mx-auto  relative z-10 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-18 items-center my-10">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8 "
          >
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="font-cinzel text-4xl lg:text-5xl xl:text-6xl font-light text-white leading-tight text-center sm:text-left"
              >
                Insights for the{" "}
                <h3
                  className=" font-cinzel text-4xl lg:text-5xl xl:text-6xl font-bold mb-8 bg-clip-text text-transparent leading-tight"
                  style={{
                    background:
                      "linear-gradient(99.93deg, #C3912F 6.79%, #F5E7A8 31.89%, #C3912F 59.78%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Discerning Investor
                </h3>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="font-josefin text-lg lg:text-xl text-[#FFFFFFE5] font-light leading-relaxed"
              >
                Stay informed with trending stories, industry updates, and
                thoughtful articles curated just for you.
              </motion.p>
            </div>
          </motion.div>

          {/* Right Content - Animated Cards */}
          {/* <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            // transition={{ duration: 0.8, delay: 0.6 }}
            className=""
          > */}
            <div className="relative z-10">
              <AnimatedTestimonials
                testimonials={propertyInsights}
                autoplay={true}
              />
            </div>
          {/* </motion.div> */}
        </div>
      </div>
    </div>
  );
}
