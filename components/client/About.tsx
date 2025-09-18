"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { setNavigationLoading } from "@/redux/slices/loadingSlice";
import { useAppDispatch } from "@/redux/hooks";

interface AboutSectionProps {
  title?: string;
  subtitle?: string;
  description?: string;
  buttonText?: string;
  buttonUrl?: string;
  bgType?: "image" | "video";
  bgImage1?: string;
  bgImage2?: string;
  bgVideo?: string;
  topOverlay?: boolean;
  bottomOverlay?: boolean;
  [key: string]: unknown;
}

export default function AboutPage({
  title = "ABOUT",
  subtitle = "NOVAA",
  description = "Discover luxury real estate opportunities in Thailand's most prestigious locations.",
  buttonText = "Learn More",
  buttonUrl = "/about-us",
  bgType = "image",
  bgImage1 = "/images/about-bg1.jpg",
  bgImage2 = "/images/about-bg2.jpg",
  bgVideo = "/videos/about-bg.mp4",
  topOverlay = true,
  bottomOverlay = true,
  ...props
}: AboutSectionProps) {
  const dispatch = useAppDispatch();
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Re-enabled animations
  const novaY = useTransform(scrollYProgress, [0, 0.3], [100, -200]);
  const novaOpacity = useTransform(scrollYProgress, [0.1, 0.35], [0, 1]);

  return (
    <motion.section ref={containerRef} className="relative overflow-hidden">
      {/* === CONDITIONAL BACKGROUND: VIDEO === */}
      {bgType === "video" && bgVideo && (
        <div className="absolute inset-0 z-10">
          <video
            src={bgVideo}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* === CONDITIONAL BACKGROUND: IMAGES === */}
      {bgType === "image" && (
        <>
          {bgImage1 && (
            <div className="absolute inset-0 z-10">
              <Image
                src={bgImage1}
                alt="Background Image 1"
                fill
                className="object-cover"
                priority
              />
            </div>
          )}
          {bgImage2 && (
            <div className="absolute inset-0 z-40">
              <Image
                src={bgImage2}
                alt="Background Image 2"
                fill
                className="object-cover"
                priority
              />
            </div>
          )}
        </>
      )}

      {/* Overlays */}
      {bottomOverlay && (
        <div className="absolute inset-x-0 h-1/2 bottom-0 z-45 bg-gradient-to-t from-[#01292B] to-transparent" />
      )}
      {topOverlay && (
        <div className="absolute inset-x-0 h-1/6 top-0 z-45 bg-gradient-to-b from-[#01292B] to-transparent" />
      )}

      {/* Animated Background Text */}
      {subtitle && (
        <motion.div
          className="hidden md:absolute inset-0 z-30 sm:flex items-center justify-center pointer-events-none transition-all duration-1500"
          style={{ y: novaY, opacity: novaOpacity }}
        >
          <div className="relative inline-block select-none">
            <h1
              className="absolute top-0 left-0 font-cinzel font-bold leading-none md:text-[180px] lg:text-[200px]"
              style={{ WebkitTextStroke: "1px #F5E7A8", color: "transparent" }}
            >
              {subtitle}
            </h1>
            <h1 className="relative font-cinzel font-bold leading-none text-transparent bg-clip-text bg-gradient-to-r from-[#C3912F] via-[#F5E7A8] to-[#C3912F] md:text-[180px] lg:text-[200px]">
              {subtitle}
            </h1>
          </div>
        </motion.div>
      )}

      {/* Content Layer */}
      <div className="container py-10 sm:pb-30 sm:pt-20 relative z-50 flex flex-col justify-between sm:justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-10 lg:mb-28"
        >
          <h1 className="font-josefin text-3xl sm:text-6xl lg:text-[80px] font-normal text-white pb-10 xl:pb-20">
            {title}
          </h1>
          {subtitle && (
            <h2 className="md:hidden font-cinzel font-bold leading-none select-none text-transparent bg-clip-text bg-gradient-to-r from-[#C3912F] via-[#F5E7A8] to-[#C3912F] text-7xl xs:text-8xl">
              {subtitle}
            </h2>
          )}
        </motion.div>

        <div className="mt-10 sm:mt-50">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-8 lg:gap-4">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true, amount: 0.3 }}
              className="font-josefin max-w-[950px] text-[#FFFFFFCC] text-center sm:text-left font-light text-base leading-[24px] sm:text-xl sm:leading-[28px] min-h-[230px]"
              dangerouslySetInnerHTML={{ __html: description }}
            />

            <div className="flex-shrink-0">
              <Link href={buttonUrl}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r font-josefin from-[#C3912F] via-[#F5E7A8] to-[#C3912F] inline-flex items-center gap-2 px-4 sm:px-5 py-2 rounded-md text-[#01292B] font-semibold shadow-lg cursor-pointer text-base sm:text-lg"
                >
                  {buttonText}
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
