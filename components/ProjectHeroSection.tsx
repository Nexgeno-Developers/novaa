import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";

const ProjectHeroSection = () => {
  return (
    <section className="relative h-screen overflow-hidden bg-background">
      {/* Background Image - Full Width */}
      <Image
        src="/images/project-details-hero.jpg"
        alt="project details background"
        fill
        priority
        className="object-cover"
      />
      
      {/* Dark overlay */}
      <div className="absolute bottom-0 w-full h-1/2 inset-x-0 z-0 bg-gradient-to-b from-bg-[#01292B00] to-[#01292B]" />
      
      {/* Content Container - Constrained to container width */}
      <div className="container relative h-full z-10">
        <div className="relative h-full flex flex-col justify-end pb-10 sm:pb-20">
          
          {/* Text Content */}
          <div className="font-cinzel text-primary mb-6 sm:mb-10">
            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-[40px] xs:text-[50px] sm:text-[60px] leading-[100%] tracking-[0%] font-cinzel font-bold"
            >
              Layan Verde
              <span className="text-2xl xs:text-3xl md:text-5xl font-normal text-white block sm:inline">
                - A Resort-Inspired Lifestyle in Phuket
              </span>
            </motion.h2>
            <motion.h3
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="flex items-center gap-4 font-josefin font-light text-xs sm:text-md md:text-base text-white mt-2 pl-1"
            >
              Luxury &amp; Premium Condominiums Managed by 5{" "}
              <Star fill="white" className="hidden lg:inline w-3 h-3" /> &amp;{" "}
              <Star fill="white" className="hidden lg:inline w-3 h-3" /> Hotels
              in the Lush Green Heart of Phuket
            </motion.h3>
          </div>
          
          {/* Buttons Container */}
          <div className="flex justify-start lg:justify-end gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex bg-gradient-to-r from-[#C3912F] via-[#F5E7A8] to-[#C3912F] hover:bg-[#CDB04E] font-josefin items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-md text-background font-semibold shadow-lg cursor-pointer transition-all duration-300 text-xs sm:text-base"
            >
              Schedule a meeting
              <ArrowRight className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex font-josefin items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-md border-[#CDB04E99] bg-[#CDB04E1A] text-primary font-semibold shadow-lg cursor-pointer transition-all duration-300 text-xs sm:text-base"
            >
              Get Brochure
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default ProjectHeroSection;