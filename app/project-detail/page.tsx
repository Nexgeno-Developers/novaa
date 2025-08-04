"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import ProjectHighlights from "@/components/ProjectHighlights";
import Highlights from "@/components/Highlights";
import ModernAmenities from "@/components/ModernAmenities";
import InvestmentPlans from "@/components/InvestmentPlans";
import MasterplanSection from "@/components/MasterplanSection";
import ContactForm from "@/components/ContactForm";

export default function HeroSection() {
  return (
    <>
    <section className="relative w-full min-h-screen overflow-hidden">
      {/* Background Image */}
      <Image
        src="/images/project-details-hero.jpg"
        alt="project details background"
        fill
        priority
        className="object-cover"
      />

      {/* Dark overlay */}
      <div className="absolute bottom-0 w-full h-1/2 inset-x-0 z-0 bg-gradient-to-b from-bg-[#01292B00] to-[#01292B]" />

      {/* Text Overlay */}
      <div className="font-cinzel absolute left-0 sm:absolute bottom-[10rem] p-5 md:bottom-[10rem] lg:bottom-10 sm:left-10 z-10 text-primary max-w-[90%]">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-[50px] sm:text-[60px] leading-[100%] tracking-[0%] font-cinzel font-bold"
        >
          Layan Verde
          <span className="font-normal text-white">
            - A Resort-Inspired Lifestyle in Phuket
          </span>
        </motion.h2>
        <motion.h3
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="flex items-center gap-4 font-josefin font-light text-md md:text-base text-white mt-2 pl-1"
        >
          Luxury &amp; Premium Condominiums Managed by 5{" "}
          <Star fill="white" className="hidden lg:inline w-3 h-3" /> &amp;{" "}
          <Star fill="white" className="hidden lg:inline w-3 h-3" /> Hotels in the Lush
          Green Heart of Phuket
        </motion.h3>
        
      </div>
      <div className="absolute bottom-30 mx-5 md:bottom-20 md:left-[40px] lg:bottom-20 lg:right-20 flex justify-end gap-4 z-20">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex bg-gradient-to-r from-[#C3912F] via-[#F5E7A8] to-[#C3912F] hover:bg-[#CDB04E] font-josefin items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-md text-background font-semibold shadow-lg cursor-pointer transition-all duration-300"
          >
            Schedule a meeting
            <ArrowRight className="w-5 h-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex font-josefin items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-md border-[#CDB04E99] bg-[#CDB04E1A] text-primary font-semibold shadow-lg cursor-pointer transition-all duration-300"
          >
            Get Brochure
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>

       
    </section>
    <ProjectHighlights />
    <Highlights />
    <ModernAmenities />
    <InvestmentPlans />
    <MasterplanSection />
    <ContactForm />
    </>
  );
}
