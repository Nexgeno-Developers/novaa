"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

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
  mediaType?: "image" | "video";
  mediaUrl?: string;
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
  console.log("Props", props.heroSection);

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
    <section className="relative h-screen overflow-hidden pt-20">
      {/* Background Media */}
      {mediaType === "video" ? (
        <video
          src={mediaUrl}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <Image
          src={mediaUrl}
          alt="Hero Background"
          fill
          className="object-cover"
          priority
        />
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
