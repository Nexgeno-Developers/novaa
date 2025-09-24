// "use client";

// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { motion, Variants } from "framer-motion";
// import Link from "next/link";
// import Image from "next/image";
// import { Calendar, Clock, ArrowRight, Loader2 } from "lucide-react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { useAppDispatch } from "@/redux/hooks";
// import { fetchBlogs, Blog, setBlogs } from "@/redux/slices/blogsSlice";
// import {
//   fetchBlogCategories,
//   setCategories,
// } from "@/redux/slices/blogCategoriesSlice";
// import { RootState } from "@/redux";
// import { useRouter } from "next/navigation";
// import { setNavigationLoading } from "@/redux/slices/loadingSlice";
// import { useNavigationRouter } from "@/hooks/useNavigationRouter";

// interface BlogSectionProps {
//   pageSlug?: string;
//   title?: string;
//   description?: string;
//   showCategories?: boolean;
//   maxBlogs?: number;
//   displayMode?: "grid" | "list";
//   showReadMore?: boolean;
//   blogData?: {
//     categories: any[];
//     blogs: any[];
//   };
//   [key: string]: unknown;
// }

// const containerVariants: Variants = {
//   hidden: { opacity: 0 },
//   visible: {
//     opacity: 1,
//     transition: {
//       staggerChildren: 0.1,
//       duration: 0.6,
//     },
//   },
// };

// const itemVariants: Variants = {
//   hidden: { opacity: 0, y: 30 },
//   visible: {
//     opacity: 1,
//     y: 0,
//     transition: { duration: 0.6, ease: "easeOut" },
//   },
// };

// export default function BlogSection({
//   pageSlug,
//   title = "Our Blog",
//   description = "Stay updated with the latest insights and news",
//   showCategories = true,
//   maxBlogs = 6,
//   displayMode = "grid",
//   showReadMore = true,
//   blogData,
//   ...props
// }: BlogSectionProps) {
//   console.log("Blog data", blogData);
//   const dispatch = useAppDispatch();
//   const router = useNavigationRouter();
//   const { blogs, loading } = useSelector((state: RootState) => state.blogs);
//   const { categories } = useSelector(
//     (state: RootState) => state.blogCategories
//   );

//   // State for client-side loading when no server data is provided
//   const [isClientLoading, setIsClientLoading] = useState(!blogData);

//   useEffect(() => {
//     if (blogData?.blogs && blogData?.categories) {
//       // Use server-side data
//       dispatch(setBlogs(blogData.blogs));
//       dispatch(setCategories(blogData.categories));
//       setIsClientLoading(false);
//     } else {
//       // Fallback to client-side fetching if no server data
//       setIsClientLoading(true);
//       dispatch(
//         fetchBlogs({
//           status: "active",
//           limit: maxBlogs,
//         })
//       );

//       if (showCategories) {
//         dispatch(fetchBlogCategories());
//       }
//     }
//   }, [dispatch, maxBlogs, showCategories, blogData]);

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     });
//   };

//   const truncateText = (text: string, maxLength: number = 120) => {
//     if (text.length <= maxLength) return text;
//     return text.substr(0, maxLength) + "...";
//   };

//   // Show loading state only when client-side loading or Redux loading
//   const isLoading = isClientLoading || loading;

//   if (isLoading) {
//     return (
//       <section className="py-10 sm:py-20 bg-[#FAF4EB]">
//         <div className="container">
//           <div className="flex items-center justify-center">
//             <Loader2 className="h-8 w-8 animate-spin mr-2" />
//             <span>Loading blogs...</span>
//           </div>
//         </div>
//       </section>
//     );
//   }

//   if (!blogs.length) {
//     return (
//       <section className="py-10 sm:py-20 bg-[#FAF4EB]">
//         <div className="container text-center">
//           <h2 className="font-cinzel text-3xl sm:text-4xl font-bold text-[#01292B] mb-4">
//             {title}
//           </h2>
//           <p className="text-muted-foreground mb-8">{description}</p>
//           <p className="text-muted-foreground">
//             No blogs available at the moment.
//           </p>
//         </div>
//       </section>
//     );
//   }

//   return (
//     <section className="bg-[#FAF4EB] py-16">
//       <div className="container">
//         <motion.div
//           variants={containerVariants}
//           initial="hidden"
//           animate="visible"
//           className="flex flex-col md:flex-row justify-between gap-8"
//         >
//           {/* Left Column */}
//           <div className="flex flex-col gap-10 w-full md:w-1/2">
//             {blogs
//               .filter((_, idx) => idx % 2 === 0)
//               .map((blog) => (
//                 <motion.div key={blog._id} variants={itemVariants}>
//                   <div
//                     className="relative w-full max-w-[615px] h-[440px] sm:h-[720px] rounded-[40px] overflow-hidden group cursor-pointer"
//                     onClick={() => {
//                       // dispatch(setNavigationLoading(true));
//                       router.push(`/blog/${blog.slug}`);
//                     }}
//                   >
//                     <Image
//                       src={blog.image}
//                       alt={blog.title}
//                       fill
//                       className="object-cover rounded-[40px] group-hover:scale-105 transition-all duration-500"
//                     />

//                     {/* Category Badge - Top Right */}
//                     <div className="absolute top-4 right-4 z-20">
//                       <Badge className="bg-[#CDB04E] text-[#01292B] hover:bg-[#CDB04E]/90">
//                         {blog.categoryName}
//                       </Badge>
//                     </div>

//                     {/* Overlay */}
//                     <div className="absolute bottom-0 left-0 p-4 z-10 text-white">
//                       <h3 className="w-full sm:w-4/5 text-lg sm:text-[20px] leading-[126%] font-medium font-josefin">
//                         {blog.title}
//                       </h3>
//                       <div className="w-full sm:w-3/4 h-px bg-[#CDB04E] my-2" />
//                       <p className="description-text font-josefin">
//                         {truncateText(blog.description)}
//                       </p>

//                       {/* Author and Date Info */}
//                       <div className="flex items-center gap-4 text-sm text-white/80 mt-3 font-josefin">
//                         <div className="flex items-center gap-2">
//                           <div className="w-6 h-6 rounded-full bg-[#CDB04E] flex items-center justify-center">
//                             <span className="text-[#01292B] text-xs font-semibold">
//                               {blog.author.name.charAt(0)}
//                             </span>
//                           </div>
//                           <span>{blog.author.name}</span>
//                         </div>
//                         <div className="flex items-center gap-1">
//                           <Calendar className="h-4 w-4" />
//                           {formatDate(blog.createdAt)}
//                         </div>
//                         <div className="flex items-center gap-1">
//                           <Clock className="h-4 w-4" />
//                           {blog.readTime}
//                         </div>
//                       </div>
//                     </div>
//                     <div className="absolute inset-0 bg-black/20" />
//                   </div>
//                 </motion.div>
//               ))}
//           </div>

//           {/* Right Column */}
//           <div className="flex flex-col gap-10 w-full md:w-1/2">
//             {blogs
//               .filter((_, idx) => idx % 2 !== 0)
//               .map((blog) => (
//                 <motion.div key={blog._id} variants={itemVariants}>
//                   <div
//                     className="relative w-full max-w-[615px] h-[440px] sm:h-[540px] rounded-[40px] overflow-hidden group cursor-pointer"
//                     onClick={() => {
//                       router.push(`/blog/${blog.slug}`);
//                       // dispatch(setNavigationLoading(true));
//                     }}
//                   >
//                     <Image
//                       src={blog.image}
//                       alt={blog.title}
//                       fill
//                       className="object-cover rounded-[40px] group-hover:scale-105 transition-all duration-500"
//                     />

//                     {/* Category Badge - Top Right */}
//                     <div className="absolute top-4 right-4 z-20">
//                       <Badge className="bg-[#CDB04E] text-[#01292B] hover:bg-[#CDB04E]/90">
//                         {blog.categoryName}
//                       </Badge>
//                     </div>

//                     {/* Overlay */}
//                     <div className="absolute bottom-0 left-0 p-4 z-10 text-white">
//                       <h3 className="w-full sm:w-4/5 text-lg sm:text-[20px] font-medium">
//                         {blog.title}
//                       </h3>
//                       <div className="w-full sm:w-3/4 h-px bg-[#CDB04E] my-2" />
//                       <p className="description-text">
//                         {truncateText(blog.description)}
//                       </p>

//                       {/* Author and Date Info */}
//                       <div className="flex items-center gap-4 text-sm text-white/80 mt-3">
//                         <div className="flex items-center gap-2">
//                           <div className="w-6 h-6 rounded-full bg-[#CDB04E] flex items-center justify-center">
//                             <span className="text-[#01292B] text-xs font-semibold">
//                               {blog.author.name.charAt(0)}
//                             </span>
//                           </div>
//                           <span>{blog.author.name}</span>
//                         </div>
//                         <div className="flex items-center gap-1">
//                           <Calendar className="h-4 w-4" />
//                           {formatDate(blog.createdAt)}
//                         </div>
//                         <div className="flex items-center gap-1">
//                           <Clock className="h-4 w-4" />
//                           {blog.readTime}
//                         </div>
//                       </div>
//                     </div>
//                     <div className="absolute inset-0 bg-black/20" />
//                   </div>
//                 </motion.div>
//               ))}
//           </div>
//         </motion.div>

//         {/* Read More Button */}
//         {/* {showReadMore && blogs.length >= maxBlogs && (
//           <motion.div variants={itemVariants} className="text-center mt-12">
//               <Button
//                 size="lg"
//                 onClick={() => router.push('/blog')}
//                 className="bg-[#CDB04E] text-[#01292B] hover:bg-[#CDB04E]/90 px-8 py-3"
//               >
//                 View All Blogs
//                 <ArrowRight className="ml-2 h-5 w-5" />
//               </Button>
//           </motion.div>
//         )} */}
//       </div>
//     </section>
//   );
// }
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
import { fetchBlogs, Blog, setBlogs } from "@/redux/slices/blogsSlice";
import {
  fetchBlogCategories,
  setCategories,
} from "@/redux/slices/blogCategoriesSlice";
import { RootState } from "@/redux";
import { useRouter } from "next/navigation";
import { setNavigationLoading } from "@/redux/slices/loadingSlice";
import { useNavigationRouter } from "@/hooks/useNavigationRouter";

interface BlogSectionProps {
  pageSlug?: string;
  title?: string;
  description?: string;
  showCategories?: boolean;
  maxBlogs?: number;
  initialBlogs?: number;
  displayMode?: "grid" | "list";
  showReadMore?: boolean;
  enableLoadMore?: boolean;
  blogData?: {
    categories: any[];
    blogs: any[];
  };
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
  maxBlogs = 10,
  initialBlogs = 10,
  displayMode = "grid",
  showReadMore = true,
  enableLoadMore = true,
  blogData,
  ...props
}: BlogSectionProps) {
  // console.log("Blog data", blogData);
  const dispatch = useAppDispatch();
  const router = useNavigationRouter();
  const { blogs, loading } = useSelector((state: RootState) => state.blogs);
  const { categories } = useSelector(
    (state: RootState) => state.blogCategories
  );

  // State for client-side loading when no server data is provided
  const [isClientLoading, setIsClientLoading] = useState(!blogData);
  
  // New states for load more functionality
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [allBlogs, setAllBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    if (blogData?.blogs && blogData?.categories) {
      // Use server-side data
      dispatch(setBlogs(blogData.blogs));
      dispatch(setCategories(blogData.categories));
      setAllBlogs(blogData.blogs);
      setIsClientLoading(false);
      // Check if there are more blogs to load based on initialBlogs setting
      setHasMore(blogData.blogs.length >= initialBlogs && enableLoadMore);
    } else {
      // Fallback to client-side fetching if no server data
      setIsClientLoading(true);
      dispatch(
        fetchBlogs({
          status: "active",
          limit: 10, // Always load 10 at a time
          page: 1,
        })
      );

      if (showCategories) {
        dispatch(fetchBlogCategories());
      }
    }
  }, [dispatch, showCategories, blogData]);

  // Handle load more functionality
  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    const nextPage = currentPage + 1;

    try {
      const response = await fetch(`/api/blogs?status=active&limit=${maxBlogs}&page=${nextPage}`);
      const data = await response.json();

      if (data.success && data.data.length > 0) {
        const newBlogs = [...allBlogs, ...data.data];
        setAllBlogs(newBlogs);
        dispatch(setBlogs(newBlogs));
        setCurrentPage(nextPage);
        
        // Check if there are more pages
        setHasMore(data.pagination.hasNextPage);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading more blogs:", error);
      setHasMore(false);
    } finally {
      setIsLoadingMore(false);
    }
  };

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

  // Show loading state only when client-side loading or Redux loading (but not when loading more)
  const isLoading = isClientLoading || (loading && !isLoadingMore);

  if (isLoading) {
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

  // Use allBlogs instead of blogs for display
  const blogsToDisplay = allBlogs.length > 0 ? allBlogs : blogs;

  if (!blogsToDisplay.length) {
    return (
      <section className="py-10 sm:py-20 bg-[#FAF4EB]">
        <div className="container text-center">
          {/* <h2 className="font-cinzel text-3xl sm:text-4xl font-bold text-[#01292B] mb-4">
            {title}
          </h2>
          <p className="text-muted-foreground mb-8">{description}</p>
          <p className="text-muted-foreground">
            No blogs available at the moment.
          </p> */}
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin mr-2" />
            <span>Loading blogs...</span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#FAF4EB] py-16">
      <div className="container">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col md:flex-row justify-between gap-8"
        >
          {/* Left Column */}
          <div className="flex flex-col gap-10 w-full md:w-1/2">
            {blogsToDisplay
              .filter((_, idx) => idx % 2 === 0)
              .map((blog) => (
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
                      <h3 className="w-full text-lg sm:text-[20px] leading-[126%] font-medium font-josefin">
                        {blog.title}
                      </h3>
                      <div className="w-full h-px bg-[#CDB04E] my-2" />
                      <p className="description-text font-josefin">
                        {truncateText(blog.description)}
                      </p>

                      {/* Author and Date Info */}
                      <div className="flex items-center gap-4 text-sm text-white/80 mt-3 font-josefin">
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
            {blogsToDisplay
              .filter((_, idx) => idx % 2 !== 0)
              .map((blog) => (
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

        {/* Load More Button */}
        {enableLoadMore && hasMore && (
          <motion.div variants={itemVariants} className="text-center mt-12">
            <Button
              size="lg"
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className="bg-[#CDB04E] text-[#01292B] hover:bg-[#CDB04E]/90 px-8 py-3"
            >
              {isLoadingMore ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Loading More...
                </>
              ) : (
                <>
                  Load More Blogs
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
}