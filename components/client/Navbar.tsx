"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, ArrowRight } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

// Define the component's props types
interface NavbarItem {
  _id?: string;
  label: string;
  href: string;
  order: number;
  isActive: boolean;
}

interface NavbarData {
  _id?: string;
  logo: {
    url: string;
    alt: string;
  };
  items: NavbarItem[];
  createdAt?: string;
  updatedAt?: string;
}

interface NavbarProps {
  data: NavbarData;
}

export default function Navbar({ data }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // All active items, sorted by order
  const activeItems = data.items
    .filter((item) => item.isActive)
    .sort((a, b) => a.order - b.order);

  // Last item = separate button
  const contactItem = activeItems[activeItems.length - 1];

  // Rest of items (excluding last one)
  const mainNavItems = activeItems.slice(0, -1);

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
          {/* Logo */}
          <div
            className="flex items-center justify-start xl:justify-center bg-background h-full cursor-pointer relative z-10"
            onClick={() => router.push("/")}
          >
            {data.logo ? (
              <Image
                src={data.logo.url}
                width={155}
                height={60}
                alt={data.logo.alt}
                priority
                className="w-[140px] sm:w-[155px] h-auto pt-[7px]"
              />
            ) : (
              <span className="text-xl font-bold">Novaa</span>
            )}
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-10 h-full 2xl:pr-40">
            <nav className="flex items-center space-x-10 font-josefin text-lg font-normal">
              {mainNavItems.map((item, idx) => {
                const isLast = idx === mainNavItems.length - 1;
                return (
                  <Link
                    key={item._id}
                    href={item.href}
                    className={cn(
                      "hover:text-[#F0DE9C] transition-colors",
                      pathname === item.href && "text-[#F0DE9C]",
                      isLast && "pr-8"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
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
                {contactItem?.label}
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

      {/* Mobile Dropdown */}
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
                {mainNavItems.map((item) => (
                  <Link
                    key={item._id}
                    href={item.href}
                    className={cn(
                      "hover:text-[#F0DE9C] transition-colors py-2 border-b border-white/10",
                      pathname === item.href && "text-[#F0DE9C]"
                    )}
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
                  {contactItem?.label}
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