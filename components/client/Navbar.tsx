"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, ArrowRight, ChevronDown, Download } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { setNavigationLoading } from "@/redux/slices/loadingSlice";
import { useAppDispatch } from "@/redux/hooks";
import { useNavigationRouter } from "@/hooks/useNavigationRouter";
import { fa } from "zod/v4/locales";
import { toast } from "sonner";

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
  const [isBrochureModalOpen, setIsBrochureModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // All active items, sorted by order
  const activeItems = data.items
    .filter((item) => item.isActive)
    .sort((a, b) => a.order - b.order);

  // Last item = separate button
  const contactItem = activeItems[activeItems.length - 1];

  // Rest of items (excluding last one)
  const mainNavItems = activeItems.slice(0, -1);

  // Input filtering functions
  const filterName = (value: string) => {
    // Only letters and spaces, max 20 characters
    return value.replace(/[^a-zA-Z\s]/g, "").slice(0, 20);
  };

  const filterPhone = (value: string) => {
    // Only numbers, max 15 characters
    return value.replace(/\D/g, "").slice(0, 15);
  };

  const filterEmail = (value: string) => {
    // Only @, -, _, and alphanumeric characters
    return value.replace(/[^a-zA-Z0-9@\-_.]/g, "");
  };

  const filterDescription = (value: string) => {
    // Only letters and spaces, max 200 characters
    return value.replace(/[^a-zA-Z\s]/g, "").slice(0, 200);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    let filteredValue = value;
    
    // Apply filters based on field name
    if (name === "name") {
      filteredValue = filterName(value);
    } else if (name === "phone") {
      filteredValue = filterPhone(value);
    } else if (name === "email") {
      filteredValue = filterEmail(value);
    } else if (name === "description") {
      filteredValue = filterDescription(value);
    }
    
    setFormData({
      ...formData,
      [name]: filteredValue,
    });
  };

  const handleBrochureSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Download brochure (replace with your actual brochure URL)
    toast.success("Brochure download starting...");
    const link = document.createElement("a");
    link.href = "/path-to-your-brochure.pdf"; // Update with your actual brochure path
    link.download = "company-brochure.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Reset form and close modal
    setFormData({ name: "", email: "", phone: "", description: "" });
    setIsSubmitting(false);
    setIsBrochureModalOpen(false);
  };

  return (
    <>
      <header className="absolute top-0 w-full bg-background lg:bg-[#00000099] z-20 text-white">
        <div className="relative">
          {/* Left extended background */}
          <div
            className="absolute left-0 top-0 h-20 bg-background
               lg:[width:calc((100vw-1536px)/2+460px)] 
               xl:[width:calc((100vw-1536px)/2+340px)]"
          ></div>

          {/* Right extended background */}
          {/* <div
            className="absolute right-0 top-0 h-20 bg-[#00000033] border border-[#00000033] 
               lg:[width:calc((100vw-1536px)/2+680px)]
               xl:[width:calc((100vw-1536px)/2+550px)]
               2xl:[width:calc((100vw-1536px)/2+420px)]"
          ></div> */}

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
                  alt={data.logo.url}
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

              <div className="flex items-center justify-center h-full relative z-10 gap-4">
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
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex font-josefin items-center gap-2 px-6 pt-3 pb-2 rounded-md text-background font-semibold text-sm shadow-lg transition-all cursor-pointer"
                  style={{
                    background:
                      "radial-gradient(114.24% 114.24% at -15.51% 0%, #C3912F 0%, #F5E7A8 16.95%, #C3912F 100%)",
                  }}
                  onClick={() => setIsBrochureModalOpen(true)}
                >
                  <Download className="w-5 h-5 text-background group-hover:animate-bounce" />
                  Download Brochure
                </motion.button>
              </div>

              {/* Brochure Download Button */}
              {/* <div className="flex items-center justify-center h-full relative z-10">
              
              </div> */}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={toggleMenu}
              className="lg:hidden rounded-md transition-colors"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? (
                <X size={34} color="gold" aria-hidden="true" />
              ) : (
                <Menu size={34} color="gold" aria-hidden="true" />
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
                                    pathname === subItem.href &&
                                      "text-[#F0DE9C]"
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

                  {/* Mobile Brochure Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center cursor-pointer gap-2 px-6 py-3 rounded-md bg-gradient-to-br from-[#C3912F] to-[#F5E7A8] text-background font-semibold shadow-lg"
                    onClick={() => {
                      setIsBrochureModalOpen(true);
                      setIsMenuOpen(false);
                    }}
                  >
                    <Download className="w-5 h-5" />
                    Download Brochure
                  </motion.button>
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Brochure Download Modal */}
      <AnimatePresence>
        {isBrochureModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsBrochureModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-background border border-[#F0DE9C]/20 rounded-2xl p-8 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-primary font-josefin">
                  Download Brochure
                </h2>
                <button
                  onClick={() => setIsBrochureModalOpen(false)}
                  className="text-white/60 hover:text-white transition-colors cursor-pointer"
                  aria-label="Close brochure download modal"
                >
                  <X className="w-6 h-6" aria-hidden="true" />
                </button>
              </div>

              {/* Form */}
              <form
                onSubmit={handleBrochureSubmit}
                className="space-y-4 font-josefin text-[14px]"
              >
                <div>
                  <label className="block text-primary text-sm font-medium mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    maxLength={20}
                    className="w-full px-4 py-3 bg-transparent border rounded-lg text-[#FFFFFFCC] placeholder-[#FFFFFF80] focus:outline-none focus:border-primary focus:ring-1 focus:ring-[#FFFFFF80] transition-all duration-300 border-[#FFFFFF80]"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label className="block text-primary text-sm font-medium mb-2">
                    Email Address (optional)
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-transparent border rounded-lg text-[#FFFFFFCC] placeholder-[#FFFFFF80] focus:outline-none focus:border-primary focus:ring-1 focus:ring-[#FFFFFF80] transition-all duration-300 border-[#FFFFFF80]"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-primary text-sm font-medium mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    maxLength={15}
                    className="w-full px-4 py-3 bg-transparent border rounded-lg text-[#FFFFFFCC] placeholder-[#FFFFFF80] focus:outline-none focus:border-primary focus:ring-1 focus:ring-[#FFFFFF80] transition-all duration-300 border-[#FFFFFF80]"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                <div>
                  <label className="block text-primary text-sm font-medium mb-2">
                    Description (optional)
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    maxLength={200}
                    className="w-full px-4 py-3 bg-transparent border rounded-lg text-[#FFFFFFCC] placeholder-[#FFFFFF80] focus:outline-none focus:border-primary focus:ring-1 focus:ring-[#FFFFFF80] transition-all duration-300 resize-none border-[#FFFFFF80]"
                    placeholder="Description (optional)"
                  />
                </div>

                {/* Submit Button */}
                <div className="flex justify-center pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`bg-gradient-to-r from-[#C3912F] via-[#F5E7A8] to-[#C3912F] hover:bg-[#CDB04E] text-background font-semibold px-12 py-2 sm:py-3 rounded-[10px] cursor-pointer text-base sm:text-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2 ${
                      isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-[#01292B]/30 border-t-[#01292B] rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Download className="w-5 h-5" />
                        Download Brochure
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
