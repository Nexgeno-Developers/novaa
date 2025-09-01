"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, Variants } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, ArrowRight, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/redux/hooks";
import { fetchBlogs, Blog } from "@/redux/slices/blogsSlice";
import { fetchBlogCategories } from "@/redux/slices/blogCategoriesSlice";
import { RootState } from "@/redux";
import { useRouter } from "next/navigation";

interface BlogSectionProps {
  pageSlug: string;
  title?: string;
  description?: string;
  showCategories?: boolean;
  maxBlogs?: number;
  displayMode?: "grid" | "list";
  showReadMore?: boolean;
  // Add any other props that might come from your CMS content
  [key: string]: unknown;
}

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
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function BlogSection({
  pageSlug,
  title = "Our Blog",
  description = "Stay updated with the latest insights and news",
  showCategories = true,
  maxBlogs = 6,
  displayMode = "grid",
  showReadMore = true,
  ...props
}: BlogSectionProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { blogs, loading } = useSelector((state: RootState) => state.blogs);
  const { categories } = useSelector((state: RootState) => state.blogCategories);
  
  // Comment out filtration logic as requested
  // const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    dispatch(fetchBlogs({ 
      status: "active", 
      limit: maxBlogs,
      // category: selectedCategory !== "all" ? selectedCategory : undefined
    }));
    
    if (showCategories) {
      dispatch(fetchBlogCategories());
    }
  }, [dispatch, maxBlogs, showCategories]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const truncateText = (text: string, maxLength: number = 120) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + "...";
  };

  // const activeCategories = categories.filter(cat => cat.isActive);

  if (loading) {
    return (
      <section className="py-10 sm:py-20 bg-[#FAF4EB]">
        <div className="container">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin mr-2" />
            <span>Loading blogs...</span>
          </div>
        </div>
      </section>
    );
  }

  if (!blogs.length) {
    return (
      <section className="py-10 sm:py-20 bg-[#FAF4EB]">
        <div className="container text-center">
          <h2 className="font-cinzel text-3xl sm:text-4xl font-bold text-[#01292B] mb-4">
            {title}
          </h2>
          <p className="text-muted-foreground mb-8">{description}</p>
          <p className="text-muted-foreground">No blogs available at the moment.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#FAF4EB] py-16">
      <div className="container">
        {/* <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center mb-12"
        > */}
          {/* <motion.h2 
            variants={itemVariants}
            className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-bold text-[#01292B] mb-4"
          >
            {title}
          </motion.h2>
          <motion.p 
            variants={itemVariants}
            className="text-lg text-[#303030] max-w-2xl mx-auto mb-8"
          >
            {description}
          </motion.p> */}

          {/* Category Filter - Commented out as requested */}
          {/* {showCategories && activeCategories.length > 0 && (
            <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-3 mb-8">
              <Button
                variant={selectedCategory === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("all")}
                className={selectedCategory === "all" ? "text-background" : ""}
              >
                All
              </Button>
              {activeCategories.map((category) => (
                <Button
                  key={category._id}
                  variant={selectedCategory === category._id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category._id)}
                  className={selectedCategory === category._id ? "text-background" : ""}
                >
                  {category.title}
                </Button>
              ))}
            </motion.div>
          )} */}
        {/* </motion.div> */}

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col md:flex-row justify-between gap-8"
        >
          {/* Left Column */}
          <div className="flex flex-col gap-10 w-full md:w-1/2">
            {blogs.slice(0, 3).map((blog, idx) => (
              <motion.div key={blog._id} variants={itemVariants}>
                <div
                  className="relative w-full max-w-[615px] h-[440px] sm:h-[720px] rounded-[40px] overflow-hidden group cursor-pointer"
                  onClick={() => {
                    router.push(`/blog/${blog.slug}`);
                  }}
                >
                  <Image
                    src={blog.image}
                    alt={blog.title}
                    fill
                    className="object-cover rounded-[40px] group-hover:scale-105 transition-all duration-500"
                  />
                  
                  {/* Category Badge - Top Right */}
                  <div className="absolute top-4 right-4 z-20">
                    <Badge className="bg-[#CDB04E] text-[#01292B] hover:bg-[#CDB04E]/90">
                      {blog.categoryName}
                    </Badge>
                  </div>

                  {/* Overlay */}
                  <div className="absolute bottom-0 left-0 p-4 z-10 text-white">
                    <h3 className="w-full sm:w-4/5 text-lg sm:text-[20px] leading-[126%] font-medium">
                      {blog.title}
                    </h3>
                    <div className="w-full sm:w-3/4 h-px bg-[#CDB04E] my-2" />
                    <p className="description-text">
                      {truncateText(blog.description)}
                    </p>
                    
                    {/* Author and Date Info */}
                    <div className="flex items-center gap-4 text-sm text-white/80 mt-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#CDB04E] flex items-center justify-center">
                          <span className="text-[#01292B] text-xs font-semibold">
                            {blog.author.name.charAt(0)}
                          </span>
                        </div>
                        <span>{blog.author.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(blog.createdAt)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {blog.readTime}
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-black/20" />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-10 w-full md:w-1/2">
            {blogs.slice(3, 6).map((blog, idx) => (
              <motion.div key={blog._id} variants={itemVariants}>
                <div
                  className="relative w-full max-w-[615px] h-[440px] sm:h-[540px] rounded-[40px] overflow-hidden group cursor-pointer"
                  onClick={() => {
                    router.push(`/blog/${blog.slug}`);
                  }}
                >
                  <Image
                    src={blog.image}
                    alt={blog.title}
                    fill
                    className="object-cover rounded-[40px] group-hover:scale-105 transition-all duration-500"
                  />
                  
                  {/* Category Badge - Top Right */}
                  <div className="absolute top-4 right-4 z-20">
                    <Badge className="bg-[#CDB04E] text-[#01292B] hover:bg-[#CDB04E]/90">
                      {blog.categoryName}
                    </Badge>
                  </div>

                  {/* Overlay */}
                  <div className="absolute bottom-0 left-0 p-4 z-10 text-white">
                    <h3 className="w-full sm:w-4/5 text-lg sm:text-[20px] font-medium">
                      {blog.title}
                    </h3>
                    <div className="w-full sm:w-3/4 h-px bg-[#CDB04E] my-2" />
                    <p className="description-text">
                      {truncateText(blog.description)}
                    </p>
                    
                    {/* Author and Date Info */}
                    <div className="flex items-center gap-4 text-sm text-white/80 mt-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#CDB04E] flex items-center justify-center">
                          <span className="text-[#01292B] text-xs font-semibold">
                            {blog.author.name.charAt(0)}
                          </span>
                        </div>
                        <span>{blog.author.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(blog.createdAt)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {blog.readTime}
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-black/20" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Read More Button */}
        {showReadMore && blogs.length >= maxBlogs && (
          <motion.div 
            variants={itemVariants}
            className="text-center mt-12"
          >
            <Link href="/blog">
              <Button 
                size="lg" 
                className="bg-[#CDB04E] text-[#01292B] hover:bg-[#CDB04E]/90 px-8 py-3"
              >
                View All Blogs
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}