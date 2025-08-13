"use client";

import Breadcrumbs from "@/components/Breadcrumbs";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Blog = {
  id: number;
  title: string;
  image: string;
  date: string;
  readTime: string;
};

export default function Blogdetails() {
  const router = useRouter();

  const blogData: Record<number, Blog> = {
    1: {
      id: 1,
      title: "Maximizing ROI with Phuket Holiday Homes",
      image: "/images/img1.webp",
      date: "January 15, 2025",
      readTime: "8 min read",
    },
    2: {
      id: 2,
      title: "Maximizing ROI with Phuket Holiday Homes",
      image: "/images/img2.webp",
      date: "December 12, 2024",
      readTime: "6 min read",
    },
    3: {
      id: 3,
      title: "Maximizing ROI with Phuket Holiday Homes",
      image: "/images/img3.webp",
      date: "February 5, 2025",
      readTime: "7 min read",
    },
    4: {
      id: 4,
      title: "Maximizing ROI with Phuket Holiday Homes",
      image: "/images/img4.webp",
      date: "January 28, 2025",
      readTime: "9 min read",
    },
  };

  const recentBlogs = [
    {
      id: 1,
      title: "lorem Ipsem",
      description: "is simply dummy text",
      image: "/images/img1.webp",
      date: "15/12/2024",
    },
    {
      id: 2,
      title: "lorem Ipsem",
      description: "is simply dummy text",
      image: "/images/img2.webp",
      date: "12/12/2024",
    },
    {
      id: 3,
      title: "lorem Ipsem",
      description: "is simply dummy text",
      image: "/images/img3.webp",
      date: "10/12/2024",
    },
    {
      id: 4,
      title: "lorem Ipsem",
      description: "is simply dummy text",
      image: "/images/img4.webp",
      date: "08/12/2024",
    },
  ];

  const [currentBlogId, setCurrentBlogId] = useState(1);
  const currentBlog = blogData[currentBlogId] || blogData[1];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, duration: 0.6 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const sidebarVariants: Variants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
  };

  const handleBlogClick = (blogId: number) => {
    setCurrentBlogId(blogId);
  };

  return (
    <>
      <Breadcrumbs title="Blog Details" />

      <section className="w-full py-10 px-4 sm:py-20 bg-[#F8F6ED]">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
            {/* Left Main Content */}
            <motion.div
              className="lg:col-span-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              key={currentBlogId}
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

              {/* Custom Content Replacement */}
              <motion.div
                className="w-full py-5"
                variants={itemVariants}
              >
                <div className="max-w-[841px]">
                  <h2 className="font-cinzel text-2xl text-center sm:text-left sm:text-[35px] leading-[100%] text-[#01292B] font-bold mb-6">
                    {currentBlog.title}
                  </h2>

                  <p className="font-josefin text-[#303030] text-center sm:text-left description-text mb-4">
                    is simply dummy text of the printing and typesetting
                    industry. Lorem Ipsum has been the industry's standard dummy
                    text ever since the 1500s, when an unknown printer took a
                    galley of type and scrambled it to make a type specimen
                    book. It has survived not only five centuries, but also the
                    leap into is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry's
                    standard dummy text ever since the 1500s, when an unknown
                    printer took a galley of type and scrambled it to make a
                    type specimen book. It has survived not only five centuries,
                    but also the leap into
                  </p>

                  <p className="text-[16px] text-center sm:text-left sm:text-lg text-[#303030] font-semibold leading-[130%] mb-4">
                      is simply dummy text of the printing and typesetting
                      industry.
                  </p>

                  <p className="text-[#303030] text-center sm:text-left description-text mb-4">
                  is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived 
                  </p>

                  <p className="text-[16px] text-center sm:text-left sm:text-lg text-[#303030] font-normal leading-[130%] mb-4">
                    <strong>
                    is simply dummy text of the printing and typesetting industry. 
                    </strong>
                  </p>

                  <p className="text-[#303030] text-center sm:text-left description-text mb-4">
                  is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived 
                  </p>
                  <p className="text-[#303030] text-center sm:text-left description-text mb-4">
                  is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into 
                  </p>
                  <p className="text-[#303030] text-center sm:text-left description-text mb-4">
                  is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived 
                  </p>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Sidebar */}
            <motion.aside
              className="lg:col-span-4"
              variants={sidebarVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="sticky top-8">
                <div className="bg-[#072D2C] border border-[#CDB04E] rounded-[20px] p-6">
                  <motion.h3
                    className="font-cinzel text-[22px] font-bold mb-4"
                    variants={itemVariants}
                  >
                    <span className="text-white">RECENT</span>{" "}
                    <span className="text-[#CDB04E]">BLOG</span>
                  </motion.h3>

                  <motion.div
                    className="w-[120px] h-[3px] bg-[#CDB04E] mb-6"
                    variants={itemVariants}
                  />

                  <div className="space-y-2 max-h-[600px] overflow-y-auto overflow-x-hidden sm:pr-2">
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
                        onClick={() => handleBlogClick(blog.id)}
                      >
                        <div className="flex items-start gap-4">
                          <div className="overflow-hidden rounded-[12px]">
                            <img
                              src={blog.image}
                              alt={blog.title}
                              className="w-[90px] h-[90px] object-cover group-hover:scale-110 transition-transform"
                            />
                          </div>
                          <div className="flex-1">
                            <h4
                              className={`font-medium text-[16px] mb-2 line-clamp-2 group-hover:text-[#CDB04E] ${
                                currentBlogId === blog.id
                                  ? "text-[#CDB04E]"
                                  : "text-white"
                              }`}
                            >
                              {blog.title}
                            </h4>
                            <p className="text-[#CFCFCF] text-[12px] mb-2 line-clamp-2">
                              {blog.description}
                            </p>
                            <div className="flex items-center gap-2">
                              <Image
                                src="/images/calender.svg"
                                alt="Calendar"
                                width={12}
                                height={12}
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
