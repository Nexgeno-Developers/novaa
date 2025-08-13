"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function AboutPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Transform for NOVA heading - moves up as user scrolls
  const novaY = useTransform(scrollYProgress, [0, 0.3], [200, -155]);
  const novaOpacity = useTransform(scrollYProgress, [0.1, 0.35], [0, 1]);

  return (
    <section ref={containerRef} className="relative overflow-hidden">
      {/* Bottom Background Image - WITH clouds (z-10) */}
      <div className="absolute inset-0 z-10">
        <Image
          src="/images/about-bg-with-clouds.png"
          alt="Modern House with Clouds"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Gradient Overlay - Bottom half */}
      {/* Gradient Overlay - Bottom half with scroll and hover effects */}
      <div className="absolute inset-x-0 h-1/2 bottom-0 z-45 transition-all duration-500 bg-gradient-to-t from-[#01292B] to-[#01292B00]" />
      <div className="absolute inset-x-0 h-1/6 top-0 z-45 transition-all duration-500 bg-gradient-to-b from-[#01292B] to-[#01292B00]" />

      {/* NOVA Background Text - Between both images (z-30) */}
      <motion.div
        className="hidden sm:absolute inset-0 z-30 sm:flex items-center justify-center pointer-events-none transition-all duration-1500"
        style={{
          y: novaY,
          opacity: novaOpacity,
        }}
      >
        <div className="relative inline-block select-none">
          {/* Outline Layer */}
          <h1
            className="absolute top-0 left-0 font-cinzel font-bold leading-none md:text-[180px] lg:text-[200px] text-black"
            style={{
              WebkitTextStroke: "1px #F5E7A8",
              color: "transparent",
            }}
          >
            NOVAA
          </h1>

          {/* Gradient Layer */}
          <h1 className="relative font-cinzel font-bold leading-none text-transparent bg-clip-text bg-gradient-to-r from-[#C3912F] via-[#F5E7A8] to-[#C3912F] md:text-[180px] lg:text-[200px]">
            NOVAA
          </h1>
        </div>
      </motion.div>

      {/* Top Background Image - WITHOUT clouds (z-40) */}
      <div className="absolute inset-0 z-40">
        <Image
          src="/images/about-bg-without-cloud.png"
          alt="Modern House without Clouds"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Content - Topmost layer (z-50) */}
      <div className="container py-10 sm:py-20 relative z-50 flex flex-col justify-between sm:justify-center">
        {/* About Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-16 lg:mb-24"
        >
          <h1 className="font-josefin text-3xl sm:text-6xl lg:text-[80px] font-normal text-white mb-5">
            About
          </h1>
          <h2 className="sm:hidden font-cinzel font-bold leading-none select-none text-transparent bg-clip-text bg-gradient-to-r from-[#C3912F] via-[#F5E7A8] to-[#C3912F] text-7xl xs:text-8xl">
            NOVAA
          </h2>
        </motion.div>

        {/* Content */}
        <div className=" mt-10 sm:mt-50">
          <div className="flex flex-col lg:flex-row justify-between items-center">
            {/* Left Column - About Text */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true , amount : 0.3 }}
              className="flex flex-col sm:flex-row justify-between items-center bg-transparent  rounded-lg"
            >
              <div className="">
                <p className="max-w-2xl text-[#FFFFFFCC] text-center sm:text-left description-text mb-5 sm:mb-8">
                  is simply dummy text of the printing and typesetting industry.
                  Lorem Ipsum has been the industry&apos;s standard dummy text
                  ever since the 1500s, when an unknown printer took a galley of
                  type and scrambled it to make a type specimen book. It has
                  survived not only five centuries, but also the leap into
                  electronic typesetting, remaining essentially unchanged. It
                  was popularised in the 1960s with the release of Letraset
                  sheets containing Lorem Ipsum passages, and more recently with
                  desktop publishing software like Aldus PageMaker including
                  versions of Lorem Ipsum.
                </p>
              </div>
            </motion.div>
            <div className="">
              {/*Right Column - Discover More Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r  from-[#C3912F] via-[#F5E7A8] to-[#C3912F] inline-flex items-center gap-2 px-4 sm:px-5 py-2 rounded-md text-[#01292B] font-semibold shadow-lg cursor-pointer text-base sm:text-lg transition-all duration-300"
              >
                Discover More
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
