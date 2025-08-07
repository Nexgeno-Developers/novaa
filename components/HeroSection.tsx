"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="relative h-screen overflow-hidden pt-20">
      {/* Background Image */}
      <Image
        src="/images/hero.jpg"
        alt="Luxury in Thailand"
        fill
        className="object-cover"
        priority
      />

      {/* Dark bottom overlay */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 z-0 bg-gradient-to-t from-[#01292B] to-[#01292B00]" />

      {/* Text Overlay */}
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
