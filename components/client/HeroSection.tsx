"use client";

import { useEffect, useState } from "react";
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

interface HeroData {
  mediaType: 'image' | 'video';
  mediaUrl: string;
  title: string;
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
  // Add these gradient fields
  titleGradient?: string;
  subtitleGradient?: string;
}

export default function HeroSection() {
  const [heroData, setHeroData] = useState<HeroData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const response = await fetch('/api/cms/home');
        if (response.ok) {
          const data = await response.json();
          console.log('Fetched hero data:', data.heroSection); // Debug log
          setHeroData(data.heroSection);
        }
      } catch (error) {
        console.error('Failed to fetch hero data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroData();
  }, []);

  const getTitleStyle = () => {
    if (heroData?.titleGradient && heroData.titleGradient !== "none") {
      console.log('Applying title gradient:', heroData.titleGradient); // Debug log
      return {
        background: heroData.titleGradient,
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        WebkitTextFillColor: "transparent",
        color: "transparent",
      };
    }
    return {
      color: "white",
    };
  };

  const getSubtitleStyle = () => {
    if (heroData?.subtitleGradient && heroData.subtitleGradient !== "none") {
      console.log('Applying subtitle gradient:', heroData.subtitleGradient); // Debug log
      return {
        background: heroData.subtitleGradient,
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        WebkitTextFillColor: "transparent",
        color: "transparent",
      };
    }
    return {
      color: "white",
    };
  };

  const renderStyledTitle = () => {
    if (!heroData?.title) return heroData?.title;

    let styledTitle = heroData.title;
    heroData.highlightedWords?.forEach(({ word, style }) => {
      const regex = new RegExp(`\\b${word}\\b`, "gi");
      const backgroundStyle = style.background 
        ? `background: ${style.background}; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;`
        : '';
      
      styledTitle = styledTitle.replace(
        regex,
        `<span class="${style.fontFamily || 'font-cinzel'}" style="color: ${style.background ? 'transparent' : style.color}; font-weight: ${style.fontWeight}; font-size: ${style.fontSize}; font-style: ${style.fontStyle}; ${backgroundStyle} ${
          style.textDecoration ? `text-decoration: ${style.textDecoration};` : ""
        }">${word}</span>`
      );
    });

    return <div dangerouslySetInnerHTML={{ __html: styledTitle }} />;
  };

  // Show loading state
  if (loading) {
    return (
      <section className="relative h-screen overflow-hidden pt-20 bg-gray-900">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      </section>
    );
  }

  // Fallback to default if no data
  if (!heroData) {
    return (
      <section className="relative h-screen overflow-hidden pt-20">
        <Image
          src="/images/hero.jpg"
          alt="Luxury in Thailand"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-x0 bottom-0 h-1/2 z-0 bg-gradient-to-t from-[#01292B] to-[#01292B00]" />
        <div className="absolute bottom-6 sm:bottom-10 w-full z-10">
          <div className="container text-white font-cinzel">
            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-[40px] xs:text-[50px] sm:text-[60px] leading-[100%] tracking-[0%] font-normal"
            >
              Experience Unparalleled
            </motion.h2>
            <motion.h3
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="font-bold text-2xl xs:text-3xl md:text-5xl leading-[100%] bg-gradient-to-tl from-[#C3912F] via-[#F5E7A8] to-[#C3912F] bg-clip-text text-transparent mt-2"
            >
              Luxury in Thailand
            </motion.h3>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-screen overflow-hidden pt-20">
      {/* Background Media */}
      {heroData.mediaType === 'video' ? (
        <video
          src={heroData.mediaUrl}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <Image
          src={heroData.mediaUrl}
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
          background: `linear-gradient(to top, ${heroData.overlayColor || '#01292B'}${Math.round((heroData.overlayOpacity || 0.4) * 255).toString(16).padStart(2, '0')} 0%, transparent 100%)`
        }}
      />

      {/* Text Overlay */}
      <div className="absolute bottom-6 sm:bottom-10 w-full z-10">
        <div className="container text-white">
          <div className={`${heroData.titleFontFamily || 'font-cinzel'}`}>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className={`${heroData.titleFontSize || 'text-[40px] xs:text-[50px] sm:text-[60px]'} leading-[100%] tracking-[0%] font-normal`}
              style={getTitleStyle()}
            >
              {renderStyledTitle()}
            </motion.div>
            
            {heroData.subtitle && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className={`font-bold ${heroData.subtitleFontSize || 'text-2xl xs:text-3xl md:text-5xl'} leading-[100%] mt-2 ${heroData.subtitleFontFamily || 'font-cinzel'}`}
                style={getSubtitleStyle()}
              >
                {heroData.subtitle}
              </motion.div>
            )}

            {heroData.ctaButton?.isActive && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
                className="mt-6"
              >
                <Link href={heroData.ctaButton.href}>
                  <Button 
                    size="lg"
                    className="bg-primary text-white hover:bg-primary/90 transition-all duration-300 hover:scale-105"
                  >
                    {heroData.ctaButton.text}
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