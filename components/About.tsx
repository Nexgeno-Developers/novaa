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
  const novaY = useTransform(scrollYProgress, [0, 0.3], [200, -170]);
  const novaOpacity = useTransform(scrollYProgress, [0.1, 0.35], [0, 1]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100vh] w-full overflow-hidden py-[15vh]"
    >
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
      <motion.div
        className="absolute inset-0 z-45 transition-all duration-500"
        style={{
          background: useTransform(
            scrollYProgress,
            [0, 1],
            [
              "linear-gradient(180deg, rgba(1, 41, 43, 0) 0%, rgba(1, 41, 43, 1) 100%)",
              "linear-gradient(180deg, rgba(1, 41, 43, 0) 0%, rgba(1, 41, 43, 0.25) 100%)",
            ]
          ),
        }}
        whileHover={{
          background:
            "linear-gradient(180deg, rgba(1, 41, 43, 0) 0%, rgba(1, 41, 43, 1) 100%)",
        }}
      />

      {/* NOVA Background Text - Between both images (z-30) */}
      <motion.div
        className="hidden sm:absolute inset-0 z-30 sm:flex items-center justify-center pointer-events-none transition-all duration-100"
        style={{
          y: novaY,
          opacity: novaOpacity,
        }}
      >
        <h1 className="font-cinzel font-bold leading-none select-none text-transparent bg-clip-text bg-gradient-to-r from-[#C3912F] via-[#F5E7A8] to-[#C3912F] text-[200px]">
          NOVAA
        </h1>
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
      <div className="relative z-50 flex flex-col justify-between sm:justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        {/* About Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-16 lg:mb-24"
        >
          <h2 className="font-josefin text-5xl sm:text-6xl lg:text-[80px] font-light text-white mb-4">
            About
          </h2>
        </motion.div>

        {/* Content Container */}
        <div className="max-w-7xl mx-auto w-full mt-30">
          <div className="flex justify-around items-center">
            {/* Left Column - About Text */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex justify-around items-center bg-transparent  p-8 sm:p-10 lg:p-12 rounded-lg"
            >
              <div className="max-w-xl">
                <h3 className="text-white text-xl sm:text-2xl font-semibold mb-6">
                  About
                </h3>
                <p className="text-gray-300 text-base sm:text-sm leading-relaxed mb-8">
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
                className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-[#01292B] font-semibold shadow-lg cursor-pointer transition-all duration-300"
                style={{
                  background:
                    "radial-gradient(114.24% 114.24% at -15.51% 0%, #C3912F 0%, #F5E7A8 16.95%, #C3912F 100%)",
                }}
              >
                Discover More
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
