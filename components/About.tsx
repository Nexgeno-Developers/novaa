// app/components/About.tsx (or wherever your component is located)
"use client"; // The parent component that uses hooks must be a client component.

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

// Define the structure of the data we expect from the API
interface AboutData {
  title: string;
  showSubtitle: boolean;
  description: string;
  buttonText: string;
  buttonUrl: string;
  bgType: "image" | "video";
  bgImage1: string;
  bgImage2: string;
  bgVideo: string;
  topOverlay: boolean;
  bottomOverlay: boolean;
}

// --- The Client Component that handles animations ---
// It fetches its own data now to work within the client environment.
export default function AboutPage() {
  const [data, setData] = useState<AboutData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getAboutData() {
      try {
        // We fetch from the relative path, as this runs on the client
        const res = await fetch(`/api/cms/about`);
        if (!res.ok) throw new Error("Failed to fetch data");
        const jsonResponse = await res.json();
        setData(jsonResponse.data);
      } catch (error) {
        console.error("Error fetching About Us data:", error);
        setData(null);
      } finally {
        setIsLoading(false);
      }
    }
    getAboutData();
  }, []);

  const containerRef = useRef<HTMLElement | null>(null);

const {scrollYProgress} = useScroll(
  containerRef.current
    ? { target: containerRef, offset: ["start end", "end start"] }
    : {}
);

  // Re-enabled animations
  const novaY = useTransform(scrollYProgress, [0, 0.3], [100, -155]);
  const novaOpacity = useTransform(scrollYProgress, [0.1, 0.35], [0, 1]);

  if (isLoading) {
    // Optional: Add a loading skeleton or spinner
    return <section className="relative h-[80vh] bg-gray-900"></section>;
  }

  if (!data) {
    return null; // Don't render anything if data fetching failed
  }

  return (
    <motion.section ref={containerRef} className="relative overflow-hidden">
      {/* === CONDITIONAL BACKGROUND: VIDEO === */}
      {data?.bgType === "video" && data.bgVideo && (
        <div className="absolute inset-0 z-10">
          <video
            src={data.bgVideo}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* === CONDITIONAL BACKGROUND: IMAGES === */}
      {data?.bgType === "image" && (
        <>
          {data?.bgImage1 && (
            <div className="absolute inset-0 z-10">
              <Image
                src={data.bgImage1}
                alt="Modern House with Clouds"
                fill
                className="object-cover"
                priority
              />
            </div>
          )}
          {data?.bgImage2 && (
            <div className="absolute inset-0 z-40">
              <Image
                src={data.bgImage2}
                alt="Modern House without Clouds"
                fill
                className="object-cover"
                priority
              />
            </div>
          )}
        </>
      )}

      {/* Overlays */}
      {data.bottomOverlay && (
        <div className="absolute inset-x-0 h-1/2 bottom-0 z-45 bg-gradient-to-t from-[#01292B] to-transparent" />
      )}
      {data.topOverlay && (
        <div className="absolute inset-x-0 h-1/6 top-0 z-45 bg-gradient-to-b from-[#01292B] to-transparent" />
      )}

      {/* Animated NOVA Background Text */}
      {data.showSubtitle && (
        <motion.div
          className="hidden sm:absolute inset-0 z-30 sm:flex items-center justify-center pointer-events-none transition-all duration-1500"
          style={{ y: novaY, opacity: novaOpacity }}
        >
          <div className="relative inline-block select-none">
            <h1
              className="absolute top-0 left-0 font-cinzel font-bold leading-none md:text-[180px] lg:text-[200px]"
              style={{ WebkitTextStroke: "1px #F5E7A8", color: "transparent" }}
            >
              NOVAA
            </h1>
            <h1 className="relative font-cinzel font-bold leading-none text-transparent bg-clip-text bg-gradient-to-r from-[#C3912F] via-[#F5E7A8] to-[#C3912F] md:text-[180px] lg:text-[200px]">
              NOVAA
            </h1>
          </div>
        </motion.div>
      )}

      {/* Content Layer */}
      <div className="container py-10 sm:py-20 relative z-50 flex flex-col justify-between sm:justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-16 lg:mb-24"
        >
          <h1 className="font-josefin text-3xl sm:text-6xl lg:text-[80px] font-normal text-white mb-5">
            {data.title}
          </h1>
          {data.showSubtitle && (
            <h2 className="sm:hidden font-cinzel font-bold leading-none select-none text-transparent bg-clip-text bg-gradient-to-r from-[#C3912F] via-[#F5E7A8] to-[#C3912F] text-7xl xs:text-8xl">
              NOVAA
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
              className="max-w-2xl text-[#FFFFFFCC] text-center sm:text-left description-text"
              dangerouslySetInnerHTML={{ __html: data.description }}
            />

            <div className="flex-shrink-0">
              <Link href={data.buttonUrl || "#"}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-[#C3912F] via-[#F5E7A8] to-[#C3912F] inline-flex items-center gap-2 px-4 sm:px-5 py-2 rounded-md text-[#01292B] font-semibold shadow-lg cursor-pointer text-base sm:text-lg"
                >
                  {data.buttonText}
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
