"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { ArrowRight } from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="absolute top-0 w-full h-20 bg-background lg:bg-[#00000099] flex items-center justify-between text-white z-20">
      {/* Left: Logo */}
      <div className="flex items-center justify-center w-[40vh] md:w-full lg:w-[40vh] sm:w-32 bg-background h-full">
        <Image
          src={"/images/logo.png"}
          width={150}
          height={100}
          alt="Logo"
          className=""
        />
      </div>

      {/* Middle: Desktop Navbar */}
      <nav className="font-josefin text-lg font-normal hidden lg:flex items-center space-x-10 ml-auto mr-10">
        <Link
          href="/"
          className="hover:text-[#F0DE9C] transition-colors duration-300"
        >
          Home
        </Link>
        <Link
          href="/about-us"
          className="hover:text-[#F0DE9C] transition-colors duration-300"
        >
          About Us
        </Link>
        <Link
          href="/project"
          className="hover:text-[#F0DE9C] transition-colors duration-300"
        >
          Projects
        </Link>
        <Link
          href="/blog"
          className="hover:text-[#F0DE9C] transition-colors duration-300"
        >
          Blog
        </Link>
      </nav>

      {/* Mobile Menu Button */}
      <button
        onClick={toggleMenu}
        className=" lg:hidden p-2 mr-2 bg-background rounded-md transition-colors duration-300"
      >
        {isMenuOpen ? <X size={24} color="gold" /> : <Menu size={24} color="gold" />}
      </button>

      {/* Right: Contact Us Button - Hidden on mobile */}
      <div className="hidden lg:flex items-center justify-center bg-[#00000033] w-[40vh] h-full px-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center gap-2 px-6 py-2 rounded-md text-background font-semibold text-sm shadow-lg cursor-pointer transition-all duration-300"
          style={{
            background:
              "radial-gradient(114.24% 114.24% at -15.51% 0%, #C3912F 0%, #F5E7A8 16.95%, #C3912F 100%)",
          }}
        >
          Contact Us
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 w-full bg-background backdrop-blur-md lg:hidden z-50"
          >
            <nav className="font-josefin text-lg flex flex-col p-6 space-y-4">
              <Link
                href="/"
                className="hover:text-[#F0DE9C] transition-colors duration-300 py-2 border-b border-white/10"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/about-us"
                className="hover:text-[#F0DE9C] transition-colors duration-300 py-2 border-b border-white/10"
                onClick={() => setIsMenuOpen(false)}
              >
                About Us
              </Link>
              <Link
                href="/project"
                className="hover:text-[#F0DE9C] transition-colors duration-300 py-2 border-b border-white/10"
                onClick={() => setIsMenuOpen(false)}
              >
                Projects
              </Link>
              <Link
                href="/blog"
                className="hover:text-[#F0DE9C] transition-colors duration-300 py-2 border-b border-white/10"
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-background font-semibold shadow-lg cursor-pointer transition-all duration-300"
                style={{
                  background:
                    "radial-gradient(114.24% 114.24% at -15.51% 0%, #C3912F 0%, #F5E7A8 16.95%, #C3912F 100%)",
                }}
              >
                Contact Us
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
