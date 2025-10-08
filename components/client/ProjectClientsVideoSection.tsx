"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import dynamic from "next/dynamic";
import useEmblaCarousel from "embla-carousel-react";
// import Autoplay from "embla-carousel-autoplay";

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
  {
    url: "https://www.youtube.com/shorts/s6_ZgUPRW1Y",
  },
  {
    url: " https://youtube.com/shorts/aqiD0nDdMDU?si=vhZV1VjSGNbL9BmD",
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
  const [isInView, setIsInView] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const playerRefs = useRef<{ [key: number]: any }>({});
  const sectionRef = useRef<HTMLElement>(null);

  // Embla Carousel setup
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      slidesToScroll: 1,
      containScroll: "trimSnaps",
      breakpoints: {
        "(min-width: 640px)": {
          slidesToScroll: 1,
          align: "start",
        },
        "(min-width: 768px)": {
          slidesToScroll: 1,
          align: "start",
        },
        "(min-width: 1024px)": {
          slidesToScroll: 1,
          align: "start",
        },
        "(min-width: 1280px)": {
          slidesToScroll: 1,
          align: "start",
        },
      },
    }
    // [
    //   Autoplay({
    //     delay: 5000,
    //     stopOnInteraction: false,
    //     stopOnMouseEnter: true,
    //   }),
    // ]
  );

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
        threshold: 0.3,
        rootMargin: "0px 0px -10% 0px",
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

  // Update selected index when carousel changes
  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on("select", onSelect);
    onSelect(); // Set initial index

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <section
      ref={sectionRef}
      className="relative py-16 lg:py-20 bg-[#01292B] overflow-hidden"
    >
      <div className="container font-cinzel relative z-20 px-4">
        <motion.div
          className="text-center mb-8 sm:mb-12 lg:mb-16"
          variants={headingVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2 className="text-2xl xs:text-3xl sm:text-4xl lg:text-[50px] text-white mb-4 lg:mb-6">
            {projectName}{" "}
            <span className="text-[#CDB04E] font-bold">in Action</span>
          </h2>
        </motion.div>

        <div className="relative">
          <div className="embla" ref={emblaRef}>
            <div className="embla__container flex">
              {projectVideos.map((video, idx) => {
                const isActive = isInView && idx === selectedIndex;

                return (
                  <div
                    key={idx}
                    className="embla__slide flex-[0_0_100%] sm:flex-[0_0_50%] md:flex-[0_0_33.333%] xl:flex-[0_0_25%] min-w-0 px-2 sm:px-3 py-2"
                  >
                    <motion.div
                      className="relative rounded-xl overflow-hidden mx-auto"
                      style={{
                        width: "290px",
                        height: "500px",
                      }}
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="relative w-full h-full">
                        <ReactPlayer
                          ref={(player) => {
                            if (player) {
                              playerRefs.current[idx] = player;
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
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={scrollPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-12 z-40 bg-[#CDB04E] hover:bg-[#F5E7A8] text-black rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110 cursor-pointer"
            aria-label="Previous video"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={scrollNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-12 z-40 bg-[#CDB04E] hover:bg-[#F5E7A8] text-black rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110 cursor-pointer"
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
                if (emblaApi) {
                  emblaApi.scrollTo(idx);
                }
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                idx === selectedIndex
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
