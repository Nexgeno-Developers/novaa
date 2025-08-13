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
      <div className="relative">
        {/* Left extended background */}
        <div
          className="absolute left-0 top-0 h-20 bg-background"
          style={{ width: "calc((100vw - 1536px) / 2 + 340px)" }}
        ></div>

        {/* Right extended background */}
        <div
          className="absolute right-0 top-0 h-20 bg-[#00000033] border border-[#00000033]"
          style={{ width: "calc((100vw - 1536px) / 2 + 340px)" }}
        ></div>

        <div className="container relative flex items-center justify-between h-20">
          {/* Left: Logo */}
          <div
            className="flex items-center justify-start xl:justify-center bg-background h-full cursor-pointer relative z-10"
            onClick={() => router.push("/")}
          >
            <Image
              src="/images/logo.png"
              width={155}
              height={60}
              alt="Logo"
              priority
              className="w-[140px] sm:w-[155px] h-auto pt-[7px]"
            />
          </div>

          <div className="hidden lg:flex items-center space-x-10 h-full 2xl:pr-40">
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
                className="hover:text-[#F0DE9C] transition-colors mr-10"
              >
                Blog
              </Link>
            </nav>
            <div className="flex items-center justify-center h-full relative z-10">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-6 pt-3 pb-2 rounded-md text-background font-semibold text-sm shadow-lg transition-all cursor-pointer"
                style={{
                  background:
                    "radial-gradient(114.24% 114.24% at -15.51% 0%, #C3912F 0%, #F5E7A8 16.95%, #C3912F 100%)",
                }}
                onClick={() => router.replace("/contact-us")}
              >
                Contact Us
                <ArrowRight className="w-5 h-5 pb-1" />
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
            <div className="container">
              <nav className="font-josefin text-lg flex flex-col pb-4 space-y-2">
                {/* Navigation items with proper labels */}
                {[
                  { href: "/", label: "Home" },
                  { href: "/about-us", label: "About Us" },
                  { href: "/project", label: "Project" },
                  { href: "/blog", label: "Blog" },
                ].map((item, idx) => (
                  <Link
                    key={idx}
                    href={item.href}
                    className="hover:text-[#F0DE9C] transition-colors py-2 border-b border-white/10"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 px-6 py-3 mt-2 rounded-md text-background font-semibold shadow-lg"
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
