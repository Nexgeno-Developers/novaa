// "use client";

// import Breadcrumbs from "@/components/client/Breadcrumbs";
// import Image from "next/image";
// import { motion, Variants } from "framer-motion";
// import { useRouter } from "next/navigation";
// import { useState } from "react";

// type Blog = {
//   id: number;
//   title: string;
//   image: string;
//   date: string;
//   readTime: string;
// };

// interface BreadcrumbType {
//   _id: string;
//   pageSlug: string;
//   title: string;
//   description: string;
//   backgroundImageUrl: string;
// }

// interface BlogClientDetailProps {
//   breadcrumbData: BreadcrumbType;
// }

// export default function Blogdetails({ breadcrumbData }: BlogClientDetailProps) {
//   const router = useRouter();

//   const blogData: Record<number, Blog> = {
//     1: {
//       id: 1,
//       title: "Maximizing ROI with Phuket Holiday Homes",
//       image: "/images/img1.webp",
//       date: "January 15, 2025",
//       readTime: "8 min read",
//     },
//     2: {
//       id: 2,
//       title: "Maximizing ROI with Phuket Holiday Homes",
//       image: "/images/img2.webp",
//       date: "December 12, 2024",
//       readTime: "6 min read",
//     },
//     3: {
//       id: 3,
//       title: "Maximizing ROI with Phuket Holiday Homes",
//       image: "/images/img3.webp",
//       date: "February 5, 2025",
//       readTime: "7 min read",
//     },
//     4: {
//       id: 4,
//       title: "Maximizing ROI with Phuket Holiday Homes",
//       image: "/images/img4.webp",
//       date: "January 28, 2025",
//       readTime: "9 min read",
//     },
//   };

//   const recentBlogs = [
//     {
//       id: 1,
//       title: "lorem Ipsem",
//       description: "is simply dummy text",
//       image: "/images/img1.webp",
//       date: "15/12/2024",
//     },
//     {
//       id: 2,
//       title: "lorem Ipsem",
//       description: "is simply dummy text",
//       image: "/images/img2.webp",
//       date: "12/12/2024",
//     },
//     {
//       id: 3,
//       title: "lorem Ipsem",
//       description: "is simply dummy text",
//       image: "/images/img3.webp",
//       date: "10/12/2024",
//     },
//     {
//       id: 4,
//       title: "lorem Ipsem",
//       description: "is simply dummy text",
//       image: "/images/img4.webp",
//       date: "08/12/2024",
//     },
//   ];

//   const [currentBlogId, setCurrentBlogId] = useState(1);
//   const currentBlog = blogData[currentBlogId] || blogData[1];

//   const containerVariants: Variants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: { staggerChildren: 0.1, duration: 0.6 },
//     },
//   };

//   const itemVariants: Variants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
//   };

//   const sidebarVariants: Variants = {
//     hidden: { opacity: 0, x: 50 },
//     visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
//   };

//   const handleBlogClick = (blogId: number) => {
//     setCurrentBlogId(blogId);
//   };

//   return (
//     <>
//       <Breadcrumbs
//         title={breadcrumbData.title}
//         description={breadcrumbData.description}
//         backgroundImageUrl={breadcrumbData.backgroundImageUrl}
//         pageName="Blog Detail"
//       />

//       <section className="w-full py-10 px-4 sm:py-20 bg-[#F8F6ED]">
//         <div className="container">
//           <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
//             {/* Left Main Content */}
//             <motion.div
//               className="lg:col-span-8"
//               variants={containerVariants}
//               initial="hidden"
//               animate="visible"
//               key={currentBlogId}
//             >
//               {/* Hero Image */}
//               <motion.div
//                 className="w-full h-[300px] sm:h-[450px] lg:h-[500px] rounded-[20px] overflow-hidden mb-8 lg:mb-12"
//                 variants={itemVariants}
//               >
//                 <img
//                   src={currentBlog.image}
//                   alt={currentBlog.title}
//                   className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
//                 />
//               </motion.div>

//               {/* Custom Content Replacement */}
//               <motion.div className="w-full py-5" variants={itemVariants}>
//                 <div className="max-w-[841px]">
//                   <h2 className="font-cinzel text-2xl text-center sm:text-left sm:text-[35px] leading-[100%] text-[#01292B] font-bold mb-6">
//                     {currentBlog.title}
//                   </h2>

//                   <p className="font-josefin text-[#303030] text-center sm:text-left description-text mb-4">
//                     is simply dummy text of the printing and typesetting
//                     industry. Lorem Ipsum has been the industry&apos;s standard
//                     dummy text ever since the 1500s, when an unknown printer
//                     took a galley of type and scrambled it to make a type
//                     specimen book. It has survived not only five centuries, but
//                     also the leap into is simply dummy text of the printing and
//                     typesetting industry. Lorem Ipsum has been the
//                     industry&apos;s standard dummy text ever since the 1500s,
//                     when an unknown printer took a galley of type and scrambled
//                     it to make a type specimen book. It has survived not only
//                     five centuries, but also the leap into
//                   </p>

//                   <p className="text-[16px] text-center sm:text-left sm:text-lg text-[#303030] font-semibold leading-[130%] mb-4">
//                     is simply dummy text of the printing and typesetting
//                     industry.
//                   </p>

//                   <p className="text-[#303030] text-center sm:text-left description-text mb-4">
//                     is simply dummy text of the printing and typesetting
//                     industry. Lorem Ipsum has been the industry&apos;s standard
//                     dummy text ever since the 1500s, when an unknown printer
//                     took a galley of type and scrambled it to make a type
//                     specimen book. It has survived
//                   </p>

//                   <p className="text-[16px] text-center sm:text-left sm:text-lg text-[#303030] font-normal leading-[130%] mb-4">
//                     is simply dummy text of the printing and typesetting
//                     industry.
//                   </p>

//                   <p className="text-[#303030] text-center sm:text-left description-text mb-4">
//                     is simply dummy text of the printing and typesetting
//                     industry. Lorem Ipsum has been the industry&apos;s standard
//                     dummy text ever since the 1500s, when an unknown printer
//                     took a galley of type and scrambled it to make a type
//                     specimen book. It has survived
//                   </p>
//                   <p className="text-[#303030] text-center sm:text-left description-text mb-4">
//                     is simply dummy text of the printing and typesetting
//                     industry. Lorem Ipsum has been the industry&apos;s standard
//                     dummy text ever since the 1500s, when an unknown printer
//                     took a galley of type and scrambled it to make a type
//                     specimen book. It has survived not only five centuries, but
//                     also the leap into is simply dummy text of the printing and
//                     typesetting industry. Lorem Ipsum has been the
//                     industry&apos;s standard dummy text ever since the 1500s,
//                     when an unknown printer took a galley of type and scrambled
//                     it to make a type specimen book. It has survived not only
//                     five centuries, but also the leap into
//                   </p>
//                   <p className="text-[#303030] text-center sm:text-left description-text mb-4">
//                     is simply dummy text of the printing and typesetting
//                     industry. Lorem Ipsum has been the industry&apos;s standard
//                     dummy text ever since the 1500s, when an unknown printer
//                     took a galley of type and scrambled it to make a type
//                     specimen book. It has survived
//                   </p>
//                 </div>
//               </motion.div>
//             </motion.div>

//             {/* Right Sidebar */}
//             <motion.aside
//               className="lg:col-span-4"
//               variants={sidebarVariants}
//               initial="hidden"
//               animate="visible"
//             >
//               <div className="sticky top-8">
//                 <div className="bg-[#072D2C] border border-[#CDB04E] rounded-[20px] p-6">
//                   <motion.h3
//                     className="font-cinzel text-[22px] font-bold mb-4"
//                     variants={itemVariants}
//                   >
//                     <span className="text-white">RECENT</span>{" "}
//                     <span className="text-[#CDB04E]">BLOG</span>
//                   </motion.h3>

//                   <motion.div
//                     className="w-[120px] h-[3px] bg-[#CDB04E] mb-6"
//                     variants={itemVariants}
//                   />

//                   <div className="space-y-2 max-h-[600px] overflow-y-auto overflow-x-hidden sm:pr-2">
//                     {recentBlogs.map((blog) => (
//                       <motion.article
//                         key={blog.id}
//                         className={`group cursor-pointer p-2 rounded-lg transition-all duration-300`}
//                         // ${
//                         //     currentBlogId === blog.id
//                         //     ? "bg-[#CDB04E]/10 border border-[#CDB04E]/30"
//                         //     : ""
//                         // }
//                         variants={itemVariants}
//                         whileHover={{ x: 6 }}
//                         onClick={() => handleBlogClick(blog.id)}
//                       >
//                         <div className="flex items-start gap-4">
//                           <div className="overflow-hidden rounded-[12px]">
//                             <img
//                               src={blog.image}
//                               alt={blog.title}
//                               className="w-[90px] h-[90px] object-cover group-hover:scale-110 transition-transform"
//                             />
//                           </div>
//                           <div className="flex-1">
//                             <h4
//                               className={`font-medium text-[16px] mb-2 line-clamp-2 group-hover:text-[#CDB04E] ${
//                                 currentBlogId === blog.id
//                                   ? "text-[#CDB04E]"
//                                   : "text-white"
//                               }`}
//                             >
//                               {blog.title}
//                             </h4>
//                             <p className="text-[#CFCFCF] text-[12px] mb-2 line-clamp-2">
//                               {blog.description}
//                             </p>
//                             <div className="flex items-center gap-2">
//                               <Image
//                                 src="/images/calender.svg"
//                                 alt="Calendar"
//                                 width={12}
//                                 height={12}
//                               />
//                               <span className="text-[11px] text-[#CFCFCF]">
//                                 {blog.date}
//                               </span>
//                             </div>
//                           </div>
//                         </div>
//                       </motion.article>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </motion.aside>
//           </div>
//         </div>
//       </section>
//     </>
//   );
// }
"use client";

import { motion, Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, Eye, Share2, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigationRouter } from "@/hooks/useNavigationRouter";

interface BlogData {
  _id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  image: string;
  category: {
    _id: string;
    title: string;
    slug: string;
  };
  categoryName: string;
  isActive: boolean;
  readTime: string;
  views: number;
  author: {
    name: string;
    avatar: string;
  };
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface BlogDetailClientProps {
  blog: BlogData;
  relatedBlogs: BlogData[];
}

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

export default function BlogDetailClient({ blog, relatedBlogs }: BlogDetailClientProps) {
  const router = useNavigationRouter()
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog.title,
          text: blog.description,
          url: window.location.href,
        });
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href);
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        // You could show a toast notification here
      } catch (error) {
        console.error('Failed to copy URL');
      }
    }
  };

  return (
    <section className="w-full py-10 px-4 sm:py-20 bg-[#F8F6ED]">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Left Main Content */}
          <motion.div
            className="lg:col-span-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Hero Image */}
            <motion.div
              className="w-full h-[300px] sm:h-[450px] lg:h-[500px] rounded-[20px] overflow-hidden mb-8 lg:mb-12"
              variants={itemVariants}
            >
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </motion.div>

            {/* Blog Header */}
            <motion.div className="mb-8" variants={itemVariants}>
              <div className="flex items-center gap-4 mb-4">
                <Badge className="bg-[#CDB04E] text-[#01292B] hover:bg-[#CDB04E]/90">
                  {blog.categoryName}
                </Badge>
                {blog.tags && blog.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {blog.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              
              <h1 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl leading-tight text-[#01292B] font-bold mb-6">
                {blog.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 text-sm text-[#303030] mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-[#01292B] flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {blog.author.name.charAt(0)}
                    </span>
                  </div>
                  <span className="font-medium">{blog.author.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {formatDate(blog.createdAt)}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {blog.readTime}
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  {blog.views} views
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShare}
                  className="flex items-center gap-2"
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              </div>
              
              <p className="font-josefin text-lg text-[#303030] leading-relaxed">
                {blog.description}
              </p>
            </motion.div>

            {/* Blog Content */}
            <motion.div className="w-full py-5" variants={itemVariants}>
              <div className="max-w-none prose prose-lg prose-slate">
                <div 
                  className="blog-content"
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                  style={{
                    color: '#303030',
                    lineHeight: '1.7',
                  }}
                />
              </div>
            </motion.div>

            {/* Social Share & Tags */}
            <motion.div variants={itemVariants} className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-[#01292B] mb-2">Tags:</h3>
                  <div className="flex flex-wrap gap-2">
                    {blog.tags && blog.tags.length > 0 ? (
                      blog.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-sm">
                          #{tag}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-muted-foreground text-sm">No tags</span>
                    )}
                  </div>
                </div>
                
                <Button
                  onClick={handleShare}
                  className="bg-[#CDB04E] text-[#01292B] hover:bg-[#CDB04E]/90"
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Share Article
                </Button>
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
                  <span className="text-[#CDB04E]">BLOGS</span>
                  <br />
                  <span className="text-sm font-normal text-[#CFCFCF]">
                    from {blog.categoryName}
                  </span>
                </motion.h3>

                <motion.div
                  className="w-[120px] h-[3px] bg-[#CDB04E] mb-6"
                  variants={itemVariants}
                />

                <div className="space-y-2 max-h-[600px] overflow-y-auto overflow-x-hidden sm:pr-2">
                  {relatedBlogs.length > 0 ? (
                    relatedBlogs.map((relatedBlog) => (
                      <motion.article
                        key={relatedBlog._id}
                        className="group cursor-pointer p-2 rounded-lg transition-all duration-300 hover:bg-[#CDB04E]/10"
                        variants={itemVariants}
                        whileHover={{ x: 6 }}
                      >
                        <Link href={`/blog/${relatedBlog.slug}`}>
                          <div className="flex items-start gap-4">
                            <div className="overflow-hidden rounded-[12px] flex-shrink-0">
                              <img
                                src={relatedBlog.image}
                                alt={relatedBlog.title}
                                className="w-[90px] h-[90px] object-cover group-hover:scale-110 transition-transform"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-[16px] mb-2 line-clamp-2 group-hover:text-[#CDB04E] text-white transition-colors">
                                {relatedBlog.title}
                              </h4>
                              <p className="text-[#CFCFCF] text-[12px] mb-2 line-clamp-2">
                                {relatedBlog.description}
                              </p>
                              <div className="flex items-center gap-2">
                                <Image
                                  src="/images/calender.svg"
                                  alt="Calendar"
                                  width={12}
                                  height={12}
                                />
                                <span className="text-[11px] text-[#CFCFCF]">
                                  {new Date(relatedBlog.createdAt).toLocaleDateString('en-GB', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric'
                                  })}
                                </span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </motion.article>
                    ))
                  ) : (
                    <motion.div variants={itemVariants} className="text-center py-8">
                      <p className="text-[#CFCFCF] text-sm">
                        No other blogs in this category yet.
                      </p>
                    </motion.div>
                  )}
                </div>
                
                {relatedBlogs.length > 0 && (
                  <motion.div variants={itemVariants} className="mt-6 pt-4 border-t border-[#CDB04E]/30">
                      <Button 
                        variant="outline" 
                        onClick={() => router.push('/blog')}
                        className="w-full border-[#CDB04E] text-[#CDB04E] hover:bg-[#CDB04E] hover:text-[#01292B]"
                      >
                        View All Blogs
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.aside>
        </div>
      </div>

      <style jsx global>{`
        .blog-content h1,
        .blog-content h2,
        .blog-content h3,
        .blog-content h4,
        .blog-content h5,
        .blog-content h6 {
          font-family: 'Cinzel', serif;
          color: #01292B;
          font-weight: 600;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }
        
        .blog-content h1 { font-size: 2.5rem; }
        .blog-content h2 { font-size: 2rem; }
        .blog-content h3 { font-size: 1.75rem; }
        .blog-content h4 { font-size: 1.5rem; }
        
        .blog-content p {
          font-family: 'Josefin Sans', sans-serif;
          margin-bottom: 1.5rem;
          line-height: 1.8;
        }
        
        .blog-content ul,
        .blog-content ol {
          margin-bottom: 1.5rem;
          padding-left: 1.5rem;
        }
        
        .blog-content li {
          margin-bottom: 0.5rem;
          line-height: 1.7;
        }
        
        .blog-content a {
          color: #CDB04E;
          text-decoration: underline;
        }
        
        .blog-content a:hover {
          color: #01292B;
        }
        
        .blog-content blockquote {
          border-left: 4px solid #CDB04E;
          padding-left: 1.5rem;
          margin: 2rem 0;
          font-style: italic;
          background-color: rgba(205, 176, 78, 0.1);
          padding: 1rem 1.5rem;
          border-radius: 0.5rem;
        }
        
        .blog-content img {
          border-radius: 0.75rem;
          margin: 2rem 0;
          max-width: 100%;
          height: auto;
        }
        
        .blog-content code {
          background-color: #f3f4f6;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          font-family: 'Courier New', monospace;
          font-size: 0.875rem;
        }
        
        .blog-content pre {
          background-color: #1f2937;
          color: #f9fafb;
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          margin: 1.5rem 0;
        }
        
        .blog-content pre code {
          background: none;
          padding: 0;
          color: inherit;
        }
      `}</style>
    </section>
  );
}