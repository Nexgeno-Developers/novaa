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
  const [videoId] = useState("egZAMZDvEuc");

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
    <section className="relative overflow-hidden bg-[#01292B]">
      {/* Full Screen Video Container */}
      <div className="relative w-full h-screen">
        {/* Header - Positioned at top center */}
        <div className="absolute top-0 left-0 right-0 z-30 pt-8 sm:pt-12 lg:pt-16">
          <motion.div
            className="text-center px-4"
            variants={headingVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-2xl xs:text-3xl sm:text-4xl lg:text-[50px] font-bold bg-gradient-to-b from-[#C3912F] via-[#F5E7A8] to-[#C3912F] bg-clip-text text-transparent font-cinzel">
              History of Phuket
            </h2>
          </motion.div>
        </div>

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
            className="bg-black/60 backdrop-blur-md text-white p-4 rounded-full hover:bg-black/80 transition-all duration-300 border-2 border-white/30 shadow-2xl hover:shadow-white/20"
            aria-label={isPlaying ? "Pause video" : "Play video"}
          >
            {isPlaying && isInView ? (
              <Pause className="w-6 h-6" fill="white" />
            ) : (
              <Play className="w-6 h-6 ml-0.5" fill="white" />
            )}
          </motion.button>

          {/* Mute/Unmute Button */}
          <motion.button
            onClick={toggleMute}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="bg-black/60 backdrop-blur-md text-white p-4 rounded-full hover:bg-black/80 transition-all duration-300 border-2 border-white/30 shadow-2xl hover:shadow-white/20"
            aria-label={isMuted ? "Unmute video" : "Mute video"}
          >
            {isMuted ? (
              <VolumeX className="w-6 h-6" strokeWidth={2.5} />
            ) : (
              <Volume2 className="w-6 h-6" strokeWidth={2.5} />
            )}
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default HistoryOfPhuketSection;