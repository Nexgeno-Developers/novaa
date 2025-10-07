"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import dynamic from "next/dynamic";

// Dynamically import ReactPlayer to avoid SSR issues
const ReactPlayer = dynamic(() => import("react-player"), {
  ssr: false,
});

interface VideoData {
  url: string;
}

interface ProjectClientsVideoSectionProps {
  projectName: string;
}

// Project-specific YouTube Shorts URLs
const projectVideos: VideoData[] = [
  {
    url: "https://www.youtube.com/shorts/s6_ZgUPRW1Y",
  },
  {
    url: "https://www.youtube.com/shorts/BKNuvvRgGWg",
  },
];

const headingVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const ProjectClientsVideoSection: React.FC<ProjectClientsVideoSectionProps> = ({
  projectName,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const playerRefs = useRef<{ [key: number]: any }>({});
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Intersection Observer to detect when section is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
          } else {
            setIsInView(false);
          }
        });
      },
      {
        threshold: 0.3, // Trigger when 30% of the section is visible
        rootMargin: "0px 0px -10% 0px", // Start playing slightly before fully in view
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const getVisibleVideos = () => {
    const visible = [];

    // For mobile (below sm), always show only 1 video
    if (isMobile) {
      visible.push({
        ...projectVideos[activeIndex],
        position: 1, // Always position 1 for mobile (centered)
        originalIndex: activeIndex,
      });
      return visible;
    }

    if (projectVideos.length === 2) {
      // For 2 videos: show both, right one is active
      for (let i = 0; i < 2; i++) {
        const index = (activeIndex + i) % projectVideos.length;
        visible.push({
          ...projectVideos[index],
          position: i,
          originalIndex: index,
        });
      }
    } else if (projectVideos.length === 3) {
      // For 3 videos: show all 3, middle one is active
      for (let i = -1; i < 2; i++) {
        const index =
          (activeIndex + i + projectVideos.length) % projectVideos.length;
        visible.push({
          ...projectVideos[index],
          position: i + 1,
          originalIndex: index,
        });
      }
    } else {
      // For 4+ videos: show 4 videos around active one
      for (let i = -1; i < 3; i++) {
        const index =
          (activeIndex + i + projectVideos.length) % projectVideos.length;
        visible.push({
          ...projectVideos[index],
          position: i + 1,
          originalIndex: index,
        });
      }
    }

    return visible;
  };

  const nextVideo = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % projectVideos.length);
    setTimeout(() => setIsTransitioning(false), 600);
  }, [isTransitioning]);

  const prevVideo = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setDirection(-1);
    setActiveIndex(
      (prev) => (prev - 1 + projectVideos.length) % projectVideos.length
    );
    setTimeout(() => setIsTransitioning(false), 600);
  }, [isTransitioning]);

  const visibleVideos = getVisibleVideos();

  const getVideoProps = (position: number) => {
    // For mobile, always scale up the single visible video
    if (isMobile) {
      return { scale: 1.0, opacity: 1, zIndex: 30 };
    }

    if (projectVideos.length === 2) {
      // For 2 videos: left smaller, right active
      switch (position) {
        case 0: // Left video
          return { scale: 0.85, opacity: 0.7, zIndex: 10 };
        case 1: // Right video (active)
          return { scale: 1.1, opacity: 1, zIndex: 30 };
        default:
          return { scale: 0.85, opacity: 0.7, zIndex: 10 };
      }
    } else if (projectVideos.length === 3) {
      // For 3 videos: left and right smaller, middle active
      switch (position) {
        case 0: // Left video
          return { scale: 0.85, opacity: 0.7, zIndex: 10 };
        case 1: // Middle video (active)
          return { scale: 1.1, opacity: 1, zIndex: 30 };
        case 2: // Right video
          return { scale: 0.85, opacity: 0.7, zIndex: 10 };
        default:
          return { scale: 0.85, opacity: 0.7, zIndex: 10 };
      }
    } else {
      // For 4+ videos: original logic
      switch (position) {
        case 0:
          return { scale: 0.9, opacity: 0.7, zIndex: 10 };
        case 1:
          return { scale: 1.1, opacity: 1, zIndex: 30 };
        case 2:
          return { scale: 0.9, opacity: 0.7, zIndex: 10 };
        case 3:
          return { scale: 0.75, opacity: 0.5, zIndex: 5 };
        default:
          return { scale: 0.75, opacity: 0.5, zIndex: 5 };
      }
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative py-16 lg:py-20 bg-[#01292B] overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#CDB04E] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#CDB04E] rounded-full blur-[120px]" />
      </div>

      <div className="container font-cinzel relative z-20 max-w-7xl px-4">
        <motion.div
          className="text-center mb-8 sm:mb-12 lg:mb-16"
          variants={headingVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2 className="text-2xl xs:text-3xl sm:text-4xl lg:text-[50px] text-white mb-4 lg:mb-6">
            {projectName}{" "}
            <span className="text-[#CDB04E] font-bold">Testimonials</span>
          </h2>
        </motion.div>

        <div className="relative">
          <div className="flex items-center justify-center gap-2 lg:gap-4">
            <AnimatePresence mode="popLayout" initial={false}>
              {visibleVideos.map((video, idx) => {
                const videoProps = getVideoProps(video.position);
                const isActive =
                  isInView &&
                  (isMobile
                    ? true // For mobile: always active since only one video is shown
                    : projectVideos.length === 2
                    ? video.position === 1 // For 2 videos: right one is active
                    : video.position === 1); // For 3+ videos: middle one is active

                return (
                  <motion.div
                    key={`${video.originalIndex}-${activeIndex}`}
                    initial={{
                      scale: 0.7,
                      opacity: 0,
                      x: direction > 0 ? 100 : -100,
                    }}
                    animate={{
                      scale: videoProps.scale,
                      opacity: videoProps.opacity,
                      x: 0,
                    }}
                    exit={{
                      scale: 0.7,
                      opacity: 0,
                      x: direction > 0 ? -100 : 100,
                    }}
                    transition={{
                      duration: 0.5,
                      ease: "easeInOut",
                    }}
                    className="relative rounded-xl overflow-hidden shadow-2xl"
                    style={{
                      zIndex: videoProps.zIndex,
                      width: "300px",
                      height: "500px",
                    }}
                  >
                    <div className="relative w-full h-full bg-gray-900">
                      <ReactPlayer
                        ref={(player) => {
                          if (player) {
                            playerRefs.current[video.originalIndex] = player;
                          }
                        }}
                        src={video.url}
                        playing={isActive}
                        loop={true}
                        muted={false}
                        volume={isActive ? 1 : 0}
                        width="100%"
                        height="100%"
                        controls={true}
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                        }}
                      />
                    </div>

                    {isActive && (
                      <div className="absolute inset-0 rounded-xl border-2 border-[#CDB04E] pointer-events-none z-20" />
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          <button
            onClick={prevVideo}
            disabled={isTransitioning}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-12 z-40 bg-[#CDB04E] hover:bg-[#F5E7A8] text-black rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            aria-label="Previous video"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextVideo}
            disabled={isTransitioning}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-12 z-40 bg-[#CDB04E] hover:bg-[#F5E7A8] text-black rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            aria-label="Next video"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        <div className="pt-8 flex justify-center gap-2 mt-8">
          {projectVideos.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (isTransitioning) return;
                setDirection(idx > activeIndex ? 1 : -1);
                setActiveIndex(idx);
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                idx === activeIndex
                  ? "bg-[#CDB04E] w-8"
                  : "bg-gray-600 hover:bg-gray-400"
              }`}
              aria-label={`Go to video ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectClientsVideoSection;
