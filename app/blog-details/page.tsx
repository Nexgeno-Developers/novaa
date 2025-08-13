"use client";

import Breadcrumbs from "@/components/Breadcrumbs";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Calendar } from "lucide-react";

export default function Blogdetails() {
  const router = useRouter();

  // Blog data with full content
  const blogData = {
    1: {
      id: 1,
      title:
        "Maximizing ROI with Phuket Holiday Homes: A Complete Investment Guide",
      image: "/images/img1.webp",
      date: "January 15, 2025",
      readTime: "8 min read",
      excerpt: "Discover the latest market insights",
      content: {
        intro:
          "Phuket has emerged as one of Southeast Asia's premier destinations for holiday home investments, offering investors unparalleled opportunities for substantial returns. With its pristine beaches, world-class infrastructure, and growing tourism industry, the island presents a compelling case for savvy investors looking to maximize their ROI in the luxury real estate market.",
        sections: [
          {
            title: "Understanding Phuket's Investment Landscape",
            content:
              "The Thai government's commitment to developing Phuket as a luxury destination has resulted in significant infrastructure improvements, including the expansion of Phuket International Airport and the development of high-end marina facilities. These improvements have directly contributed to increased property values and rental yields across the island.",
          },
          // ... other sections
        ],
      },
    },
    2: {
      id: 2,
      title: "Investment Opportunities in Phuket",
      image: "/images/img2.webp",
      date: "December 12, 2024",
      readTime: "6 min read",
      excerpt: "Prime locations for maximum ROI",
      content: {
        intro:
          "Phuket's real estate market offers diverse investment opportunities, from beachfront villas to luxury condominiums. Understanding the nuances of each market segment is crucial for making informed investment decisions.",
        sections: [
          {
            title: "Prime Investment Locations",
            content:
              "Patong, Kata, and Kamala represent the most sought-after areas for property investment, each offering unique advantages and target demographics.",
          },
          // ... other sections
        ],
      },
    },
    3: {
      id: 3,
      title: "Holiday Home Rental Strategies",
      image: "/images/img3.webp",
      date: "February 5, 2025",
      readTime: "7 min read",
      excerpt: "Boost occupancy rates and revenue",
      content: {
        intro:
          "Owning a holiday home in Phuket is just the first step — maximizing your rental income requires strategic planning. From seasonal pricing to targeted marketing, these strategies can help you consistently attract high-value guests.",
        sections: [
          {
            title: "Seasonal Pricing Optimization",
            content:
              "Adjusting your rates based on high and low tourist seasons can significantly improve annual returns. Offering discounts during off-peak times can help maintain occupancy rates.",
          },
          {
            title: "Leveraging Online Platforms",
            content:
              "List your property on reputable vacation rental platforms like Airbnb and Booking.com, ensuring professional photos and compelling descriptions to stand out.",
          },
        ],
      },
    },
    4: {
      id: 4,
      title: "Legal Guide for Foreign Investors",
      image: "/images/img4.webp",
      date: "January 28, 2025",
      readTime: "9 min read",
      excerpt: "Understand property laws in Thailand",
      content: {
        intro:
          "Navigating Thailand's property laws as a foreign investor can be complex. This guide covers essential legal considerations to ensure your investment is secure and compliant.",
        sections: [
          {
            title: "Foreign Ownership Rules",
            content:
              "Foreigners cannot own land in Thailand directly, but there are legal workarounds such as long-term leases or owning property through a Thai company.",
          },
          {
            title: "Due Diligence Checklist",
            content:
              "Before purchasing, verify the title deed, check zoning regulations, and ensure there are no legal disputes over the property.",
          },
        ],
      },
    },
  };

  const recentBlogs = [
    {
      id: 1,
      title: "Luxury Real Estate Trends in Southeast Asia",
      excerpt: "Discover the latest market insights",
      image: "/images/img1.webp",
      date: "15/12/2024",
    },
    {
      id: 2,
      title: "Investment Opportunities in Phuket",
      excerpt: "Prime locations for maximum ROI",
      image: "/images/img2.webp",
      date: "12/12/2024",
    },
    {
      id: 3,
      title: "Holiday Home Rental Strategies",
      excerpt: "Maximize your property income",
      image: "/images/img3.webp",
      date: "10/12/2024",
    },
    {
      id: 4,
      title: "Legal Guide for Foreign Investors",
      excerpt: "Navigate property laws with ease",
      image: "/images/img4.webp",
      date: "08/12/2024",
    },
  ];

  // State to track current blog
  const [currentBlogId, setCurrentBlogId] = useState(1);
  const currentBlog = blogData[currentBlogId] || blogData[1];

  // Animation variants (same as before)
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.6,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const sidebarVariants: Variants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  // Handle blog click
  const handleBlogClick = (blogId: number) => {
    setCurrentBlogId(blogId);
  };

  return (
    <>
      <Breadcrumbs title="Blog Details" />

      <section className="w-full py-10 px-4 sm:py-20 bg-[#F8F6ED]">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
            {/* Left Main Content - 8 columns */}
            <motion.div
              className="lg:col-span-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              key={currentBlogId} // Re-animate when blog changes
            >
              {/* Hero Image */}
              <motion.div
                className="w-full h-[300px] sm:h-[450px] lg:h-[500px] rounded-[20px] overflow-hidden mb-8 lg:mb-12"
                variants={itemVariants}
              >
                <img
                  src={currentBlog.image}
                  alt={currentBlog.title}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </motion.div>

              {/* Article Content */}
              <motion.article className="space-y-8" variants={itemVariants}>
                {/* Title and Meta */}
                <div className="space-y-4">
                  <motion.h1
                    className="font-cinzel text-2xl sm:text-3xl lg:text-[42px] leading-[110%] text-[#072D2C] font-bold text-center sm:text-left"
                    variants={itemVariants}
                  >
                    {currentBlog.title}
                  </motion.h1>

                  <motion.div
                    className="flex items-center justify-center gap-4 text-center sm:text-left text-sm text-[#072D2C] opacity-70"
                    variants={itemVariants}
                  >
                    <div className="flex items-center gap-2">
                      <Calendar width={14} height={14} className="pb-[1px]" />
                      <span>{currentBlog.date}</span>
                    </div>
                    <div className="w-1 h-1 bg-[#072D2C] rounded-full"></div>
                    <span>{currentBlog.readTime}</span>
                  </motion.div>
                </div>

                {/* Article Body */}
                <motion.div className="space-y-6" variants={itemVariants}>
                  <p className="font-josefin description-text text-center sm:text-left text-[#303030]">
                    {currentBlog.content.intro}
                  </p>

                  {/* Dynamic sections based on current blog */}
                  {currentBlog.content.sections?.map((section, index) => (
                    <div key={index}>
                      <motion.h2
                        className="font-cinzel text-center sm:text-left text-[24px] lg:text-[28px] text-[#072D2C] font-bold mt-8 mb-4"
                        variants={itemVariants}
                      >
                        {section.title}
                      </motion.h2>
                      <p className="font-josefin text-center sm:text-left description-text text-[#303030]">
                        {section.content}
                      </p>
                    </div>
                  ))}
                </motion.div>

                {/* CTA Section */}
                <motion.div
                  className="bg-background rounded-[20px] p-8 mt-12 text-center"
                  variants={itemVariants}
                >
                  <h3 className="font-cinzel text-[#CDB04E] text-[24px] font-bold mb-4">
                    Ready to Explore Investment Opportunities?
                  </h3>
                  <p className="text-white description-text font-josefin mb-6 max-w-2xl mx-auto">
                    Discover exclusive property listings and investment
                    opportunities in Phuket with our expert guidance.
                  </p>
                  <motion.button
                    className="inline-flex gap-2 items-center justify-center bg-[#CDB04E] text-[#303030] px-6 sm:px-8 py-3 rounded-full font-semibold hover:bg-[#B8A045] transition-colors duration-300 cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push("/contact-us")}
                  >
                    Contact Our Experts
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </motion.div>
              </motion.article>
            </motion.div>

            {/* Right Sidebar - 4 columns, Sticky */}
            <motion.aside
              className="lg:col-span-4"
              variants={sidebarVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="sticky top-8">
                <div className="bg-[#072D2C] border border-[#CDB04E] rounded-[20px] p-6 overflow-hidden">
                  <motion.h3
                    className="font-cinzel text-[22px] font-bold leading-[100%] text-left mb-4"
                    variants={itemVariants}
                  >
                    <span className="text-white">RECENT</span>{" "}
                    <span className="text-[#CDB04E]">BLOG</span>
                  </motion.h3>

                  <motion.div
                    className="w-[120px] h-[3px] bg-[#CDB04E] mb-6"
                    variants={itemVariants}
                  />

                  <div className="space-y-2 max-h-[600px] overflow-y-auto overflow-x-hidden">
                    {recentBlogs.map((blog) => (
                      <motion.article
                        key={blog.id}
                        className={`group cursor-pointer p-2 rounded-lg transition-all duration-300 ${
                          currentBlogId === blog.id
                            ? "bg-[#CDB04E]/10 border border-[#CDB04E]/30"
                            : ""
                        }`}
                        variants={itemVariants}
                        whileHover={{ x: 8 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => handleBlogClick(blog.id)}
                      >
                        <div className="flex items-start gap-4">
                          <div className="relative overflow-hidden rounded-[12px] flex-shrink-0">
                            <img
                              src={blog.image}
                              alt={blog.title}
                              className="w-[90px] h-[90px] object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4
                              className={`font-medium text-[16px] leading-[20px] mb-2 line-clamp-2 group-hover:text-[#CDB04E] transition-colors duration-300 ${
                                currentBlogId === blog.id
                                  ? "text-[#CDB04E]"
                                  : "text-white"
                              }`}
                            >
                              {blog.title}
                            </h4>
                            <p className="text-[#CFCFCF] text-[12px] leading-[16px] mb-2 line-clamp-2">
                              {blog.excerpt}
                            </p>
                            <div className="flex items-center gap-2">
                              <Image
                                src="/images/calender.svg"
                                alt="Calendar"
                                width={12}
                                height={12}
                                className="opacity-70"
                              />
                              <span className="text-[11px] text-[#CFCFCF]">
                                {blog.date}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.article>
                    ))}
                  </div>
                </div>
              </div>
            </motion.aside>
          </div>
        </div>
      </section>
    </>
  );
}
