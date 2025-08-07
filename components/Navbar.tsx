"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="absolute top-0 w-full bg-background lg:bg-[#00000099] z-20 text-white">
      <div className="container max-w-[1440px] mx-auto flex items-center justify-between h-20">
        {/* Left: Logo */}
        <div
          className="flex items-center justify-start xl:justify-center bg-background h-full px-2 sm:px-4 md:px-6 xl:px-10 cursor-pointer"
          onClick={() => router.push("/")}
        >
          <Image
            src="/images/logo.png"
            width={190}
            height={60}
            alt="Logo"
            priority
          />
        </div>

        {/* Middle: Desktop Navigation */}
        {/* <nav className="hidden lg:flex items-center space-x-8 font-josefin text-lg font-normal">
          <Link href="/" className="hover:text-[#F0DE9C] transition-colors">
            Home
          </Link>
          <Link
            href="/about-us"
            className="hover:text-[#F0DE9C] transition-colors"
          >
            About Us
          </Link>
          <Link
            href="/project"
            className="hover:text-[#F0DE9C] transition-colors"
          >
            Projects
          </Link>
          <Link href="/blog" className="hover:text-[#F0DE9C] transition-colors">
            Blog
          </Link>
        </nav> */}

        {/* Right: Desktop Contact Button */}
        {/* <div className="hidden lg:flex items-center justify-end xl:justify-center bg-background   h-full px-2 sm:px-4 md:px-6 xl:px-10 ">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-md text-background font-semibold text-sm shadow-lg transition-all cursor-pointer"
            style={{
              background:
                "radial-gradient(114.24% 114.24% at -15.51% 0%, #C3912F 0%, #F5E7A8 16.95%, #C3912F 100%)",
            }}
            onClick={() => router.replace("/contact-us")}
          >
            Contact Us
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div> */}

        <div className="hidden lg:flex items-center space-x-10 h-full">
          <nav className="flex items-center space-x-10 font-josefin text-lg font-normal">
            <Link href="/" className="hover:text-[#F0DE9C] transition-colors">
              Home
            </Link>
            <Link
              href="/about-us"
              className="hover:text-[#F0DE9C] transition-colors"
            >
              About Us
            </Link>
            <Link
              href="/project"
              className="hover:text-[#F0DE9C] transition-colors"
            >
              Projects
            </Link>
            <Link
              href="/blog"
              className="hover:text-[#F0DE9C] transition-colors"
            >
              Blog
            </Link>
          </nav>
          <div className="flex items-center bg-background h-full px-2 sm:px-4 md:px-6 xl:px-10">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-6 py-2 rounded-md text-background font-semibold text-sm shadow-lg transition-all cursor-pointer"
              style={{
                background:
                  "radial-gradient(114.24% 114.24% at -15.51% 0%, #C3912F 0%, #F5E7A8 16.95%, #C3912F 100%)",
              }}
              onClick={() => router.replace("/contact-us")}
            >
              Contact Us
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
        {/* Mobile Menu Toggle */}
        <button
          onClick={toggleMenu}
          className="lg:hidden p-2 rounded-md transition-colors"
        >
          {isMenuOpen ? (
            <X size={24} color="gold" />
          ) : (
            <Menu size={24} color="gold" />
          )}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="bg-background backdrop-blur-md lg:hidden"
          >
            <nav className="font-josefin text-lg flex flex-col px-6 py-4 space-y-4">
              {["/", "/about-us", "/project", "/blog"].map((href, idx) => (
                <Link
                  key={idx}
                  href={href}
                  className="hover:text-[#F0DE9C] transition-colors py-2 border-b border-white/10"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {href === "/"
                    ? "Home"
                    : href.replace("/", "").replace("-", " ")}
                </Link>
              ))}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-background font-semibold shadow-lg"
                style={{
                  background:
                    "radial-gradient(114.24% 114.24% at -15.51% 0%, #C3912F 0%, #F5E7A8 16.95%, #C3912F 100%)",
                }}
                onClick={() => router.replace("/contact-us")}
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
