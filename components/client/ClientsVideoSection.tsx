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

// Your actual YouTube Shorts URLs
const videos: VideoData[] = [
  {
    url: "https://www.youtube.com/shorts/s6_ZgUPRW1Y",
  },
  {
    url: "https://www.youtube.com/shorts/BKNuvvRgGWg",
  },
  {
    url: "https://www.youtube.com/shorts/jBb8o0-dfbA",
  },
  {
    url: "https://www.youtube.com/shorts/h92r_cXaQcA",
  },
  {
    url: "https://www.youtube.com/shorts/wzCJ2VnSAtA",
  },
  {
    url: "https://www.youtube.com/shorts/_aCR_LadAh8",
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

const ClientVideosSection: React.FC = () => {
  const [isInView, setIsInView] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null); // Start with first video playing
  const playerRefs = useRef<{ [key: number]: any }>({});
  const sectionRef = useRef<HTMLElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const wasInViewRef = useRef(false); // Track previous in-view state

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

  // Pause all videos when scrolling away
  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        // If section is not in viewport (scrolled away), pause all videos
        if (rect.bottom < 0 || rect.top > window.innerHeight) {
          Object.keys(playerRefs.current).forEach((key) => {
            const index = parseInt(key);
            const player = playerRefs.current[index];
            if (player) {
              try {
                player.getInternalPlayer()?.pauseVideo?.();
              } catch (error) {
                console.log("Error pausing video:", error);
              }
            }
          });
          setPlayingIndex(null);
        }
      }
    };

    const throttledScroll = () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(handleScroll, 100);
    };

    window.addEventListener('scroll', throttledScroll);
    
    return () => {
      window.removeEventListener('scroll', throttledScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Intersection Observer to detect when section is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const isCurrentlyInView = entry.isIntersecting;
          
          if (isCurrentlyInView && !wasInViewRef.current) {
            // Section just came into view - play first video
            setIsInView(true);
            setPlayingIndex(0); // Play first video when section comes into view
          } else if (!isCurrentlyInView && wasInViewRef.current) {
            // Section just went out of view - pause all videos
            setIsInView(false);
            setPlayingIndex(null);
          }
          
          // Update previous state
          wasInViewRef.current = isCurrentlyInView;
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

  // Pause all videos except the one that's playing
  useEffect(() => {
    Object.keys(playerRefs.current).forEach((key) => {
      const index = parseInt(key);
      const player = playerRefs.current[index];
      if (player && index !== playingIndex) {
        // Pause other videos
        try {
          player.getInternalPlayer()?.pauseVideo?.();
        } catch (error) {
          console.log("Error pausing video:", error);
        }
      }
    });
  }, [playingIndex]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const handleVideoPlay = (index: number) => {
    setPlayingIndex(index);
  };

  return (
    <section
      ref={sectionRef}
      className="relative py-16 lg:py-24 bg-secondary overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#CDB04E] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#CDB04E] rounded-full blur-[120px]" />
      </div>

      <div className="container font-cinzel relative z-20 px-4">
        <motion.div
          className="text-center mb-8 sm:mb-12 lg:mb-16"
          variants={headingVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <p className="text-[#CDB04E] text-sm sm:text-base font-semibold mb-2 tracking-wider uppercase"></p>
          <h2 className="text-2xl xs:text-3xl sm:text-4xl lg:text-[50px]  text-background mb-4 lg:mb-6">
            Phuket Projects in{" "}
            <span className="text-[#CDB04E] font-bold">Action</span>
          </h2>
        </motion.div>

        <div className="relative">
          <div className="embla" ref={emblaRef}>
            <div className="embla__container flex">
              {videos.map((video, idx) => {
                const isActive = isInView && idx === selectedIndex;
                const isPlaying = playingIndex === idx;

                return (
                  <div
                    key={idx}
                    className="embla__slide flex-[0_0_100%] sm:flex-[0_0_50%] md:flex-[0_0_33.333%] xl:flex-[0_0_25%] min-w-0 px-2 sm:px-3"
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
                      <div className="relative w-full h-full bg-gray-900">
                        <ReactPlayer
                          ref={(player) => {
                            if (player) {
                              playerRefs.current[idx] = player;
                            }
                          }}
                          src={video.url}
                          playing={isPlaying}
                          loop={true}
                          muted={false}
                          volume={isPlaying ? 1 : 0}
                          width="100%"
                          height="100%"
                          controls={true}
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                          }}
                          onPlay={() => handleVideoPlay(idx)}
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
          {videos.map((_, idx) => (
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

export default ClientVideosSection;