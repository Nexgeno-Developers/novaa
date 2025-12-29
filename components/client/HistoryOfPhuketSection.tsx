"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

const headingVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

const HistoryOfPhuketSection = () => {
  const videoRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true); // Start muted for autoplay to work
  const [videoId] = useState("3o_f2rXdHgw");

  // YouTube embed URL with parameters
  const getEmbedUrl = (autoplay: boolean = false, mute: boolean = true) => {
    return `https://www.youtube.com/embed/${videoId}?autoplay=${
      autoplay ? 1 : 0
    }&mute=${
      mute ? 1 : 0
    }&controls=0&showinfo=0&rel=0&modestbranding=1&enablejsapi=1&start=0&end=70&loop=1&playlist=${videoId}`;
  };

  // Intersection Observer to detect when section comes into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
        if (entry.isIntersecting) {
          setIsPlaying(true);
        } else {
          setIsPlaying(false);
        }
      },
      {
        threshold: 0.3,
        rootMargin: "0px",
      }
    );

    const currentRef = videoRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  // Handle mute toggle
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // Handle play/pause toggle
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <>
      {/* Heading Section with Secondary Background */}
      <section className="relative py-16 lg:pt-24 lg:pb-8 bg-secondary overflow-hidden">
        {/* Background Elements */}
        {/* <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#CDB04E] rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#CDB04E] rounded-full blur-[120px]" />
        </div> */}

        <div className="container font-cinzel relative z-20">
          <motion.div
            className="text-center"
            variants={headingVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-2xl xs:text-3xl sm:text-4xl lg:text-[50px] bg-background font-cinzel bg-clip-text text-transparent">
              Origin of <span className="text-[#CDB04E] font-bold">Phuket</span>
            </h2>
          </motion.div>
        </div>
      </section>

      {/* Full Screen Video Section */}
      <section className="relative overflow-hidden bg-[#01292B]">
        <div className="relative w-full h-screen">
          {/* Video */}
          <div ref={videoRef} className="absolute inset-0 w-full h-full">
            <iframe
              ref={iframeRef}
              key={`${isPlaying}-${isMuted}`} // Force re-render when state changes
              src={getEmbedUrl(isPlaying, isMuted)}
              title="History of Phuket"
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                pointerEvents: "none",
              }}
            />
          </div>

          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-black/20 pointer-events-none" />

          {/* Control Buttons - Bottom Right */}
          <div className="absolute bottom-8 right-8 z-30 flex gap-4">
            {/* Play/Pause Button */}
            <motion.button
              onClick={togglePlayPause}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="bg-background cursor-pointer backdrop-blur-md text-white p-4 rounded-full hover:bg-background/80 transition-all duration-300 border-2 border-white/30 shadow-2xl hover:shadow-white/20"
              aria-label={isPlaying ? "Pause video" : "Play video"}
            >
              {isPlaying && isInView ? (
                <Pause className="w-6 h-6 text-primary" />
              ) : (
                <Play className="w-6 h-6 ml-0.5 text-primary" />
              )}
            </motion.button>

            {/* Mute/Unmute Button */}
            <motion.button
              onClick={toggleMute}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="bg-background cursor-pointer backdrop-blur-md text-white p-4 rounded-full hover:bg-background/80 transition-all duration-300 border-2 border-white/30 shadow-2xl hover:shadow-white/20"
              aria-label={isMuted ? "Unmute video" : "Mute video"}
            >
              {isMuted ? (
                <VolumeX className="w-6 h-6 text-primary" strokeWidth={2.5} />
              ) : (
                <Volume2 className="w-6 h-6 text-primary" strokeWidth={2.5} />
              )}
            </motion.button>
          </div>
        </div>
      </section>
    </>
  );
};

export default HistoryOfPhuketSection;
