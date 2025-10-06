"use client";

import React, { useEffect, useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import parse from "html-react-parser";
import BreadcrumbsSection from "@/components/client/BreadcrumbsSection";

interface InvestmentPoint {
  _id: string;
  title: string;
  description: string;
  icon: string;
}

interface WhyInvestDetailClientProps {
  mainTitle: string;
  highlightedTitle: string;
  description: string;
  investmentPoints: InvestmentPoint[];
  images: string[];
}

export default function WhyInvestDetailClient({
  mainTitle,
  highlightedTitle,
  description,
  investmentPoints,
  images,
}: WhyInvestDetailClientProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  // Scroll to specific section if hash is present
  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.substring(1);
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
    }
  }, []);

  return (
    <>
      <BreadcrumbsSection title="Our Investment" pageSlug="our-investment" />
      <div ref={containerRef} className="bg-secondary">
        {/* Hero Section */}
        {/* <motion.section
          style={{ opacity, scale }}
          className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#01292B] to-[#023B3E]"
        > */}
        {/* Animated Background Pattern */}
        {/* <div className="absolute inset-0 opacity-10">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-64 h-64 rounded-full bg-[#D4AF37]"
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                }}
                animate={{
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                }}
                transition={{
                  duration: 20 + Math.random() * 10,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                style={{
                  filter: "blur(80px)",
                }}
              />
            ))}
          </div>

          <div className="container relative z-10 py-20">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center space-y-6"
            >
              <motion.h1
                className="font-cinzel text-4xl md:text-5xl lg:text-7xl font-normal text-white"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                {mainTitle}
              </motion.h1>
              <motion.h2
                className="font-cinzel text-4xl md:text-5xl lg:text-7xl font-bold text-[#D4AF37]"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                {highlightedTitle}
              </motion.h2>
              <motion.div
                className="font-josefin text-white/80 text-lg md:text-xl max-w-3xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                {parse(description)}
              </motion.div>
            </motion.div>
          </div> */}

        {/* Scroll Indicator */}
        {/* <motion.div
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
              <motion.div
                className="w-1.5 h-1.5 bg-white rounded-full"
                animate={{ y: [0, 16, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </motion.div> */}
        {/* </motion.section> */}

        {/* Investment Points Detail Sections */}
        {/* Investment Points Detail Sections */}
        <div className="py-20">
          {investmentPoints.map((point, index) => (
            <InvestmentPointDetail
              key={point.title}
              point={
                point.title ? point : { ...point, title: `Point ${index + 1}` }
              }
              image={images[index] || images[0]}
              index={index}
            />
          ))}
          
          {/* Static Investment Points */}
          <InvestmentPointDetail
            key="proposed-government-initiatives"
            point={{
              _id: "static-5",
              title: "Proposed Government Initiatives",
              description: `
                <p>Thailand's government is actively opening doors to international investors, with several forward-looking initiatives designed to make foreign property ownership easier, longer-term, and more attractive:</p>
                <ul style="margin-top: 1rem; margin-bottom: 1rem; list-style-type: disc; padding-left: 2rem;">
                  <li>Increasing foreign freehold quota from 49% to 74%</li>
                  <li>99-year land leases for foreign nationals</li>
                  <li>10-year tourist visa for long-stay international visitors</li>
                  <li>Golden Visa programs to encourage property-linked residency</li>
                  <li>Expansion of Phuket International Airport from a current capacity of 12.5 million to 19 million passengers unlocking even more global connectivity</li>
                </ul>
                <p>These proposed changes signal a clear direction: Thailand wants serious investors and is building the ecosystem to support them.</p>
              `,
              icon: "/icons/government.svg"
            }}
            image={images[0]}
            index={investmentPoints.length}
          />
          
          <InvestmentPointDetail
            key="currency"
            point={{
              _id: "static-6",
              title: "Currency",
              description: `
                <p>The Thai Baht (THB) has steadily appreciated at an average rate of 5% per year over the last two decades making it one of Asia's more stable and strengthening currencies.</p>
                <p style="margin-top: 1rem;">For Indian investors, this offers added currency gains over time, strengthening both capital returns and rental income in INR terms. In a world of currency volatility, the Baht's performance is yet another layer of confidence.</p>
              `,
              icon: "/icons/currency.svg"
            }}
            image={images[1] || images[0]}
            index={investmentPoints.length + 1}
          />
        </div>

      </div>
    </>
  );
}

interface InvestmentPointDetailProps {
  point: InvestmentPoint;
  image: string;
  index: number;
}

function InvestmentPointDetail({
  point,
  image,
  index,
}: InvestmentPointDetailProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-100px" });
  const isEven = index % 2 === 0;

  // Parallax effect for image
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.9]);

  return (
    <section
      id={point.title.replace(/\s+/g, "-").toLowerCase()}
      ref={ref}
      className="relative overflow-hidden scroll-mt-20"
    >
      <div className="container">
        <div
          className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center ${
            isEven ? "" : "lg:grid-flow-dense"
          }`}
        >
          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: isEven ? -100 : 100 }}
            animate={
              isInView
                ? { opacity: 1, x: 0 }
                : { opacity: 0, x: isEven ? -100 : 100 }
            }
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`space-y-6 ${isEven ? "" : "lg:col-start-2"}`}
          >
            {/* Icon with Gradient Background */}
            {/* <motion.div
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : { scale: 0 }}
              transition={{ delay: 0.3, duration: 0.6, type: "spring" }}
              className="relative inline-block"
            >
              <div
                className="w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center relative overflow-hidden"
                style={{
                  background:
                    "radial-gradient(117.4% 117.54% at -15.51% 0%, #C3912F 0%, #F5E7A8 16.95%, #C3912F 100%)",
                }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 opacity-20"
                  style={{
                    background:
                      "conic-gradient(from 0deg, transparent, #fff, transparent)",
                  }}
                />
                <Image
                  src={point.icon}
                  width={60}
                  height={60}
                  alt={point.title}
                  className="relative z-10"
                />
              </div>
            </motion.div> */}

            {/* Title with Animated Underline */}
            <div className="space-y-3">
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ delay: 0.4, duration: 0.6 }}
                className="font-cinzel text-3xl md:text-4xl lg:text-5xl font-bold text-primary relative inline-block "
              >
                {point.title}
                {/* <motion.div
                  initial={{ scaleX: 0 }}
                  animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#D4AF37] to-[#F5E7A8] origin-left"
                /> */}
              </motion.h3>
            </div>

            {/* Description with Staggered Animation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="font-josefin text-[#303030] text-base md:text-lg lg:text-xl leading-relaxed space-y-4"
            >
              {parse(point.description)}
            </motion.div>

            {/* Decorative Element */}
            {/* <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="flex items-center gap-4"
            >
              <div className="h-px flex-1 bg-gradient-to-r from-[#D4AF37] to-transparent" />
              <div className="w-2 h-2 bg-[#D4AF37] rounded-full" />
              <div className="w-1 h-1 bg-[#D4AF37] rounded-full" />
            </motion.div> */}
          </motion.div>

          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: isEven ? 100 : -100 }}
            animate={
              isInView
                ? { opacity: 1, x: 0 }
                : { opacity: 0, x: isEven ? 100 : -100 }
            }
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`relative ${
              isEven ? "" : "lg:col-start-1 lg:row-start-1"
            }`}
          >
            <motion.div
              style={{ y: imageY, scale: imageScale }}
              className="relative h-[400px] md:h-[500px] lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl"
            >
              {/* Image with Overlay */}
              <Image
                src={image}
                alt={point.title}
                fill
                className="object-cover"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

              {/* Floating Badge */}
              {/* <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="absolute top-6 right-6 bg-white/95 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg"
              >
                <span className="font-cinzel text-[#D4AF37] font-bold text-lg">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </motion.div> */}

              {/* Corner Decoration */}
              {/* <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                transition={{ delay: 0.9, duration: 0.6 }}
                className="absolute bottom-6 left-6 w-16 h-16 border-l-4 border-b-4 border-[#D4AF37]"
              /> */}
            </motion.div>

            {/* Floating Decoration */}
            <motion.div
              animate={{
                y: [0, -20, 0],
                rotate: [0, 5, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -top-10 -right-10 w-32 h-32 bg-[#D4AF37]/20 rounded-full blur-3xl"
            />
          </motion.div>
        </div>
      </div>

      {/* Background Decorative Elements */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.05, 0.1, 0.05],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className={`absolute ${
          isEven ? "left-0" : "right-0"
        } top-1/2 -translate-y-1/2 w-96 h-96 bg-[#D4AF37] rounded-full blur-3xl -z-10`}
      />
    </section>
  );
}
