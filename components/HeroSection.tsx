"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Background Image */}
      <Image
        src="/images/hero.jpg"
        alt="Luxury in Thailand"
        layout="fill"
        objectFit="cover"
        priority
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(183.79deg,rgba(1,41,43,0)_3.21%,#01292B_91.78%)]" />


      {/* Text Overlay */}
      <div className=" font-cinzel absolute left-0 sm:absolute bottom-[10rem] p-5 sm:bottom-10 sm:left-10 z-10 text-white max-w-[80%]">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-[50px] sm:text-[60px] leading-[100%] tracking-[0%] font-cinzel font-normal"
        >
          Experience <span className="font-semibold">Unparalleled</span>
        </motion.h2>
        <motion.h3
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-3xl md:text-4xl text-[#F0DE9C] mt-2 font-cinzel"
        >
          Luxury in Thailand
        </motion.h3>
      </div>
    </section>
  );
}
