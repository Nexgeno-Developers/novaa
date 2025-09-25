"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Divide, Star } from "lucide-react";
import parse from "html-react-parser";

interface ProjectHeroSectionProps {
  project: {
    name: string;
    projectDetail?: {
      hero?: {
        backgroundImage?: string;
        title?: string;
        subtitle?: string;
        scheduleMeetingButton?: string;
        getBrochureButton?: string;
        brochurePdf?: string;
      };
    };
  };
}

const ProjectHeroSection: React.FC<ProjectHeroSectionProps> = ({ project }) => {
  const heroData = project.projectDetail?.hero;

  const backgroundImage =
    heroData?.backgroundImage || "/images/project-details-hero.jpg";
  const title = heroData?.title || project.name;
  const subtitle = heroData?.subtitle || "A Resort-Inspired Lifestyle";
  const scheduleMeetingText =
    heroData?.scheduleMeetingButton || "Schedule a meeting";
  const getBrochureText = heroData?.getBrochureButton || "Get Brochure";
  const brochurePdf = heroData?.brochurePdf;

  const handleBrochureDownload = () => {
    if (brochurePdf) {
      // Create a temporary link and trigger download
      const link = document.createElement("a");
      link.href = brochurePdf;
      link.download = `${project.name}-Brochure.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      console.log("No brochure PDF available");
    }
  };

  const handleScheduleMeeting = () => {
    // You can integrate with Calendly or any scheduling service here
    // For now, just logging
    console.log("Schedule meeting clicked");
    // Example Calendly integration:
    // window.open('https://calendly.com/your-calendly-link', '_blank');
  };

  return (
    <section className="relative h-screen overflow-hidden bg-background">
      {/* Background Image - Full Width */}
      <Image
        src={backgroundImage}
        alt="project details background"
        fill
        priority
        className="object-cover"
      />

      {/* Dark overlay */}
      <div className="absolute bottom-0 w-full h-1/2 inset-x-0 z-0 bg-gradient-to-b from-bg-[#01292B00] to-[#01292B]" />

      {/* Content Container - Constrained to container width */}
      <div className="container relative h-full z-10">
        <div className="relative h-full flex flex-col justify-end mt-10">
          {/* Text Content */}
          <div className="font-cinzel text-primary pb-5 sm:pb-0">
            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-[40px] xs:text-[50px] sm:text-[60px] leading-[100%] tracking-[0%] font-cinzel font-bold"
            >
              {title && <div>{parse(title)}</div>}
            </motion.h2>
            <motion.h3
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="flex items-center gap-4 font-josefin font-light text-white mt-2 pl-1"
            >
              {subtitle && <div>{parse(subtitle)}</div>}
            </motion.h3>
          </div>

          {/* Buttons Container */}
          <div className="flex justify-start lg:justify-end gap-4 mb-20 pt-0 sm:pt-5 xl:pt-0">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleScheduleMeeting}
              className="inline-flex bg-gradient-to-r from-[#C3912F] via-[#F5E7A8] to-[#C3912F] hover:bg-[#CDB04E] font-josefin items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-md text-background font-semibold shadow-lg cursor-pointer transition-all duration-300 text-xs sm:text-base"
            >
              {parse(scheduleMeetingText)}
              <ArrowRight className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBrochureDownload}
              className="inline-flex font-josefin items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-md border-[#CDB04E99] bg-[#CDB04E1A] text-primary font-semibold shadow-lg cursor-pointer transition-all duration-300 text-xs sm:text-base"
            >
              {parse(getBrochureText)}
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectHeroSection;
