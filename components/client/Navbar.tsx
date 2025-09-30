"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, ArrowRight, ChevronDown } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { setNavigationLoading } from "@/redux/slices/loadingSlice";
import { useAppDispatch } from "@/redux/hooks";
import { useNavigationRouter } from "@/hooks/useNavigationRouter";

// Define the component's props types
interface SubmenuItem {
  _id?: string;
  label: string;
  href: string;
  order: number;
  isActive: boolean;
}

interface NavbarItem {
  _id?: string;
  label: string;
  href: string;
  order: number;
  isActive: boolean;
  submenu?: SubmenuItem[];
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
  const dispatch = useAppDispatch();
  const router = useNavigationRouter();
  const pathname = usePathname(); 
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);

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
          className="absolute left-0 top-0 h-20 bg-background
             lg:[width:calc((100vw-1536px)/2+460px)] 
             xl:[width:calc((100vw-1536px)/2+340px)]"
        ></div>

        {/* Right extended background */}
        <div
          className="absolute right-0 top-0 h-20 bg-[#00000033] border border-[#00000033] 
             lg:[width:calc((100vw-1536px)/2+460px)]
             xl:[width:calc((100vw-1536px)/2+340px)]"
        ></div>

        <div className="container relative flex items-center justify-between h-20">
          {/* Logo */}
          <div
            className="flex items-center justify-start xl:justify-center bg-background h-full cursor-pointer relative z-10 xl:pr-30"
            onClick={() => router.push("/")}
          >
            {data.logo ? (
              <Image
                src={data.logo.url}
                width={155}
                height={60}
                alt={data.logo.alt}
                priority
                className="w-[140px] sm:w-[155px] 2xl:w-[180px] h-auto pt-[7px]"
              />
            ) : (
              <span className="text-xl font-bold">Novaa</span>
            )}
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-10 h-full">
            <nav className="flex items-center space-x-10 font-josefin text-lg font-normal">
              {mainNavItems.map((item, idx) => {
                const isLast = idx === mainNavItems.length - 1;
                const hasSubmenu = item.submenu && item.submenu.length > 0;
                const activeSubmenuItems = hasSubmenu
                  ? item.submenu
                      ?.filter((sub) => sub.isActive)
                      .sort((a, b) => a.order - b.order)
                  : [];

                return (
                  <div
                    key={item._id}
                    className={cn("relative", isLast && "pr-10 2xl:pr-40")}
                    onMouseEnter={() =>
                      hasSubmenu && setActiveSubmenu(item._id!)
                    }
                    onMouseLeave={() => setActiveSubmenu(null)}
                  >
                    {hasSubmenu ? (
                      <div
                        className={cn(
                          "flex items-center gap-1 hover:text-[#F0DE9C] transition-colors cursor-pointer",
                          pathname === item.href && "text-[#F0DE9C]"
                        )}
                      >
                        <Link href={item.href}>{item.label}</Link>
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        className={cn(
                          "hover:text-[#F0DE9C] transition-colors",
                          pathname === item.href && "text-[#F0DE9C]"
                        )}
                      >
                        {item.label}
                      </Link>
                    )}

                    {/* Premium Glass Submenu */}
                    <AnimatePresence>
                      {hasSubmenu && activeSubmenu === item._id && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{
                            duration: 0.2,
                            ease: [0.4, 0.0, 0.2, 1],
                          }}
                          className="absolute top-full left-0 pt-2 min-w-[220px] z-50"
                        >
                          <div className="relative">
                            {/* Glass background with premium styling */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl" />
                            <div className="absolute inset-0 bg-gradient-to-br from-[#F0DE9C]/5 to-transparent rounded-2xl" />

                            {/* Content */}
                            <div className="relative p-2">
                              {activeSubmenuItems &&
                                activeSubmenuItems.map((subItem, subIdx) => (
                                  <motion.div
                                    key={subItem._id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{
                                      delay: subIdx * 0.05,
                                      duration: 0.15,
                                    }}
                                  >
                                    <Link
                                      href={subItem.href}
                                      className={cn(
                                        "group flex items-center px-4 py-3 rounded-xl text-white/90 hover:text-white transition-all duration-200 hover:bg-white/10 relative overflow-hidden",
                                        pathname === subItem.href &&
                                          "text-[#F0DE9C] bg-white/10"
                                      )}
                                    >
                                      {/* Hover effect background */}
                                      <div className="absolute inset-0 bg-gradient-to-r from-[#F0DE9C]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

                                      <span className="relative font-medium text-sm">
                                        {subItem.label}
                                      </span>

                                      {/* Subtle arrow */}
                                      <ArrowRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-70 transform translate-x-2 group-hover:translate-x-0 transition-all duration-200" />
                                    </Link>
                                  </motion.div>
                                ))}
                            </div>

                            {/* Premium accent line */}
                            <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-[#F0DE9C]/30 to-transparent" />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </nav>

            <div className="flex items-center justify-center h-full relative z-10 2xl:pr-15">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex font-josefin items-center gap-2 px-6 pt-3 pb-2 rounded-md text-background font-semibold text-sm shadow-lg transition-all cursor-pointer"
                style={{
                  background:
                    "radial-gradient(114.24% 114.24% at -15.51% 0%, #C3912F 0%, #F5E7A8 16.95%, #C3912F 100%)",
                }}
                onClick={() => (
                  router.replace("/contact-us"),
                  dispatch(setNavigationLoading(true))
                )}
              >
                {contactItem?.label}
                <ArrowRight className="w-5 h-5 pb-1" />
              </motion.button>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={toggleMenu}
            className="lg:hidden rounded-md transition-colors"
          >
            {isMenuOpen ? (
              <X size={34} color="gold" />
            ) : (
              <Menu size={34} color="gold" />
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
                {mainNavItems.map((item) => {
                  const hasSubmenu = item.submenu && item.submenu.length > 0;
                  const activeSubmenuItems = hasSubmenu
                    ? item.submenu
                        ?.filter((sub) => sub.isActive)
                        .sort((a, b) => a.order - b.order)
                    : [];

                  return (
                    <div key={item._id} className="border-b border-white/10">
                      <Link
                        href={item.href}
                        className={cn(
                          "hover:text-[#F0DE9C] transition-colors py-2 flex items-center justify-between",
                          pathname === item.href && "text-[#F0DE9C]"
                        )}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <span>{item.label}</span>
                        {hasSubmenu && <ChevronDown className="w-4 h-4" />}
                      </Link>

                      {/* Mobile Submenu */}
                      {hasSubmenu && (
                        <div className="pl-4 pb-2 space-y-1">
                          {activeSubmenuItems &&
                            activeSubmenuItems.map((subItem) => (
                              <Link
                                key={subItem._id}
                                href={subItem.href}
                                className={cn(
                                  "block py-1 text-sm text-white/80 hover:text-[#F0DE9C] transition-colors",
                                  pathname === subItem.href && "text-[#F0DE9C]"
                                )}
                                onClick={() => setIsMenuOpen(false)}
                              >
                                {subItem.label}
                              </Link>
                            ))}
                        </div>
                      )}
                    </div>
                  );
                })}

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
