"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

interface HighlightedWord {
  word: string;
  style: {
    color?: string;
    fontWeight?: string;
    textDecoration?: string;
    background?: string;
    fontFamily?: string;
    fontSize?: string;
    fontStyle?: string;
  };
}

interface HeroSectionProps {
  mediaType?: "image" | "video" | "vimeo";
  mediaUrl?: string;
  vimeoUrl?: string;
  title?: string;
  subtitle?: string;
  highlightedWords?: HighlightedWord[];
  ctaButton?: {
    text: string;
    href: string;
    isActive: boolean;
  };
  overlayOpacity?: number;
  overlayColor?: string;
  titleFontFamily?: string;
  subtitleFontFamily?: string;
  titleFontSize?: string;
  subtitleFontSize?: string;
  titleGradient?: string;
  subtitleGradient?: string;
  [key: string]: unknown;
}

export default function HeroSection({
  mediaType = "image",
  mediaUrl = "/images/hero.jpg",
  vimeoUrl = "",
  title = "Experience Unparalleled",
  subtitle = "Luxury in Thailand",
  highlightedWords,
  ctaButton,
  overlayOpacity = 0.4,
  overlayColor = "#01292B",
  titleFontFamily = "font-cinzel",
  subtitleFontFamily = "font-cinzel",
  titleFontSize = "text-2xl md:text-[50px]",
  subtitleFontSize = "text-2xl md:text-[50px]",
  titleGradient = "none",
  subtitleGradient = "radial-gradient(61.54% 61.54% at 1.15% 54.63%, #C3912F 0%, #F5E7A8 48.26%, #C3912F 100%)",
  ...props
}: HeroSectionProps) {
  // Video control states
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const vimeoIframeRef = useRef<HTMLIFrameElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Helper function to extract Vimeo video ID from URL
  const extractVimeoId = (url: string): string | null => {
    const match = url.match(
      /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/
    );
    return match ? match[1] : null;
  };

  // Get background media based on mediaType
  const getBackgroundMedia = () => {
    if (mediaType === "vimeo" && vimeoUrl) {
      const videoId = extractVimeoId(vimeoUrl);
      if (videoId) {
        return {
          type: "vimeo",
          videoId: videoId,
          src: `https://player.vimeo.com/video/${videoId}?autoplay=1&muted=1&loop=1&background=1&controls=0&title=0&byline=0&portrait=0&playsinline=1&autopause=0`,
        };
      }
    } else if (mediaType === "video") {
      return {
        type: "video",
        src: mediaUrl,
      };
    } else {
      return {
        type: "image",
        src: mediaUrl,
      };
    }

    return {
      type: "image",
      src: mediaUrl,
    };
  };

  const backgroundMedia = getBackgroundMedia();

  // Vimeo Player API functions
  const sendVimeoCommand = (action: string, value?: any) => {
    if (vimeoIframeRef.current) {
      const data =
        value !== undefined ? { method: action, value } : { method: action };
      vimeoIframeRef.current.contentWindow?.postMessage(
        JSON.stringify(data),
        "*"
      );
    }
  };

  // Toggle play/pause
  const togglePlayPause = () => {
    if (backgroundMedia.type === "video" && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    } else if (backgroundMedia.type === "vimeo") {
      if (isPlaying) {
        sendVimeoCommand("pause");
      } else {
        sendVimeoCommand("play");
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Toggle mute/unmute
  const toggleMute = () => {
    if (backgroundMedia.type === "video" && videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    } else if (backgroundMedia.type === "vimeo") {
      sendVimeoCommand("setVolume", isMuted ? 1 : 0);
      setIsMuted(!isMuted);
    }
  };

  // Intersection Observer to pause/resume video based on visibility
  useEffect(() => {
    if (backgroundMedia.type === "image") return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            // Section is out of view - pause and mute
            if (backgroundMedia.type === "video" && videoRef.current) {
              videoRef.current.pause();
              videoRef.current.muted = true;
            } else if (backgroundMedia.type === "vimeo") {
              sendVimeoCommand("pause");
              sendVimeoCommand("setVolume", 0);
            }
            setIsPlaying(false);
            setIsMuted(true);
          } else {
            // Section is back in view - resume playing with sound
            if (backgroundMedia.type === "video" && videoRef.current) {
              videoRef.current.play().catch(console.error);
              videoRef.current.muted = false;
            } else if (backgroundMedia.type === "vimeo") {
              sendVimeoCommand("play");
              sendVimeoCommand("setVolume", 1);
            }
            setIsPlaying(true);
            setIsMuted(false);
          }
        });
      },
      {
        threshold: 0.5, // Trigger when 50% of section is visible/hidden
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
  }, [backgroundMedia.type]);

  // Initialize video state synchronization
  useEffect(() => {
    if (backgroundMedia.type === "video" && videoRef.current) {
      const video = videoRef.current;

      // Ensure video starts muted and playing
      video.muted = true;
      video.play().catch(console.error);
      setIsPlaying(true);
      setIsMuted(true);

      // Sync state with video element properties
      const syncState = () => {
        setIsPlaying(!video.paused);
        setIsMuted(video.muted);
      };

      // Listen for video events to keep state in sync
      video.addEventListener("play", syncState);
      video.addEventListener("pause", syncState);
      video.addEventListener("volumechange", syncState);

      return () => {
        video.removeEventListener("play", syncState);
        video.removeEventListener("pause", syncState);
        video.removeEventListener("volumechange", syncState);
      };
    } else if (backgroundMedia.type === "vimeo" && vimeoIframeRef.current) {
      // Wait for iframe to load and ensure muted state
      const timer = setTimeout(() => {
        sendVimeoCommand("setVolume", 0);
        setIsPlaying(true);
        setIsMuted(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [backgroundMedia.type]);

  // console.log("Props", props.heroSection);

  // const getTitleStyle = () => {
  //   if (titleGradient && titleGradient !== "none") {
  //     console.log("Applying title gradient:", titleGradient);
  //     return {
  //       background: titleGradient,
  //       WebkitBackgroundClip: "text",
  //       backgroundClip: "text",
  //       WebkitTextFillColor: "transparent",
  //       color: "transparent",
  //     };
  //   }
  //   return {
  //     color: "white",
  //   };
  // };
  // console.log("media ", mediaUrl);

  // const renderStyledTitle = () => {
  //   if (!title) return title;

  //   let styledTitle = title;
  //   highlightedWords?.forEach(({ word, style }) => {
  //     const regex = new RegExp(`\\b${word}\\b`, "gi");
  //     const backgroundStyle = style.background
  //       ? `background: ${style.background}; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;`
  //       : "";

  //     styledTitle = styledTitle.replace(
  //       regex,
  //       `<span class="${style.fontFamily || "font-cinzel"}" style="color: ${
  //         style.background ? "transparent" : style.color
  //       }; font-weight: ${style.fontWeight}; font-size: ${
  //         style.fontSize
  //       }; font-style: ${style.fontStyle}; ${backgroundStyle} ${
  //         style.textDecoration
  //           ? `text-decoration: ${style.textDecoration};`
  //           : ""
  //       }">${word}</span>`
  //     );
  //   });

  //   return <div dangerouslySetInnerHTML={{ __html: styledTitle }} />;
  // };

  return (
    <section
      ref={sectionRef}
      className="relative h-auto min-h-screen md:h-screen overflow-hidden pt-20"
    >
      {/* Background Media - Conditional Rendering */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        {backgroundMedia.type === "vimeo" ? (
          <iframe
            ref={vimeoIframeRef}
            src={backgroundMedia.src}
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
            allowFullScreen
            style={{
              pointerEvents: "none",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "100vw",
              height: "62.666vw",
              minWidth: "159.5vh",
              minHeight: "100vh",
            }}
          />
        ) : backgroundMedia.type === "video" ? (
          <video
            ref={videoRef}
            src={backgroundMedia.src}
            autoPlay
            muted
            loop
            playsInline
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "100vw",
              height: "100vh",
              objectFit: "cover",
            }}
          />
        ) : (
          <Image
            src={backgroundMedia.src}
            alt="Hero Background"
            fill
            className="object-cover"
            priority
          />
        )}
      </div>

      {/* Video Controls - Only show for video/vimeo */}
      {(backgroundMedia.type === "video" ||
        backgroundMedia.type === "vimeo") && (
        <div className="absolute flex-col bottom-24 xl:bottom-28 right-5 sm:right-8 z-20 flex gap-3">
          {/* Play/Pause Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={togglePlayPause}
            className="bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 cursor-pointer"
            aria-label={isPlaying ? "Pause video" : "Play video"}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 ml-0.5" />
            )}
          </motion.button>

          {/* Mute/Unmute Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleMute}
            className="bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 cursor-pointer"
            aria-label={isMuted ? "Unmute video" : "Mute video"}
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </motion.button>
        </div>
      )}

      {/* Dynamic Overlay */}
      <div
        className="absolute inset-x-0 bottom-0 h-1/2 z-0"
        style={{
          background: `linear-gradient(to top, ${overlayColor}${Math.round(
            overlayOpacity * 255
          )
            .toString(16)
            .padStart(2, "0")} 0%, transparent 100%)`,
        }}
      />
      {/* Text Overlay */}
      <div className="absolute bottom-6 sm:bottom-10 w-full z-10">
        <div className="container text-white">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className={`text-2xl lg:text-3xl xl:text-[60px] font-cinzel  leading-[100%] tracking-[0%] font-normal`}
            >
              {title}{" "}
            </motion.div>

            {subtitle && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className={`text-2xl lg:text-3xl font-bold xl:text-[60px] leading-[100%] mt-2 ${subtitleFontFamily}`}
                style={{
                  background:
                    "radial-gradient(61.54% 61.54% at 1.15% 54.63%, #C3912F 0%, #F5E7A8 48.26%, #C3912F 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  color: "transparent",
                }}
              >
                {subtitle}
              </motion.div>
            )}

            {ctaButton?.isActive && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
                className="mt-6"
              >
                <Link href={ctaButton.href}>
                  <Button
                    size="lg"
                    className="bg-primary text-white hover:bg-primary/90 transition-all duration-300 hover:scale-105"
                  >
                    {ctaButton.text}
                  </Button>
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
