// "use client";

// import React from "react";
// import { motion, Variants } from "framer-motion";
// import Image from "next/image";
// import Link from "next/link";
// import { ArrowRight } from "lucide-react";

// interface InvestmentPoint {
//   _id: string;
//   title: string;
//   description: string;
//   icon: string;
// }

// interface WhyInvestSectionProps {
//   mainTitle?: string;
//   highlightedTitle?: string;
//   description?: string;
//   investmentPoints?: InvestmentPoint[];
//   images?: string[];
//   [key: string]: unknown;
// }

// export default function WhyInvestSection({
//   mainTitle = "WHY INVEST IN",
//   highlightedTitle = "PHUKET",
//   description = "<p>Discover the benefits of investing in Phuket's thriving real estate market.</p>",
//   investmentPoints = [],
//   images = [
//     "/images/invest1.jpg",
//     "/images/invest2.jpg",
//     "/images/invest3.jpg",
//     "/images/invest4.jpg",
//   ],
//   ...props
// }: WhyInvestSectionProps) {
//   console.log("Props of why invest ", props);

//   // Framer-motion variants
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
//   };

//   const itemVariants: Variants = {
//     hidden: { opacity: 0, x: -50 },
//     visible: {
//       opacity: 1,
//       x: 0,
//       transition: { duration: 0.6, ease: "easeOut" },
//     },
//   };

//   const imageVariants: Variants = {
//     hidden: { opacity: 0, scale: 0.9 },
//     visible: {
//       opacity: 1,
//       scale: 1,
//       transition: { duration: 0.8, ease: "easeOut" },
//     },
//   };

//   const containerInvestmentVariants: Variants = {
//     hidden: {},
//     visible: {
//       transition: {
//         staggerChildren: 0.15,
//       },
//     },
//   };

//   return (
//     <section className="font-cinzel py-10 sm:py-16 lg:py-24 bg-secondary">
//       <div className="container">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-12 xl:gap-16 items-start">
//           {/* Left Column - Content */}
//           <motion.div
//             variants={containerVariants}
//             initial="hidden"
//             whileInView="visible"
//             viewport={{ once: true, margin: "-100px" }}
//             className="space-y-4 sm:space-y-6"
//           >
//             <motion.div
//               variants={itemVariants}
//               className="md:space-y-2 text-center xl:text-left"
//             >
//               <h2 className="text-2xl sm:text-3xl lg:text-[50px] font-normal text-[#303030]">
//                 {mainTitle}
//               </h2>
//               <h3 className="text-2xl sm:text-3xl lg:text-[50px] font-bold text-[#D4AF37]">
//                 {highlightedTitle}
//               </h3>
//             </motion.div>

//             {/* The description can be rendered safely using dangerouslySetInnerHTML for TinyMCE content */}
//             <motion.div
//               variants={itemVariants}
//               className="font-josefin text-[#303030] description-text text-center xl:text-left space-y-4"
//               dangerouslySetInnerHTML={{ __html: description }}
//             />

//             <motion.div
//               variants={containerInvestmentVariants}
//               initial="hidden"
//               animate="visible"
//               className=""
//             >
//               {investmentPoints.map((point, index) => (
//                 <motion.div
//                   key={point._id}
//                   initial="hidden"
//                   whileInView="visible"
//                   viewport={{ once: true, amount: 0.3, margin: "-50px" }}
//                   variants={{
//                     hidden: { opacity: 0, x: -20 },
//                     visible: {
//                       opacity: 1,
//                       x: 0,
//                       transition: {
//                         delay: index * 0.1,
//                         duration: 0.5,
//                         ease: "easeOut",
//                       },
//                     },
//                   }}
//                   className="flex items-start gap-6 group pb-4 sm:pb-0"
//                 >
//                   <motion.div
//                     whileHover={{ scale: 1.1, rotate: 5 }}
//                     transition={{ type: "spring", stiffness: 300 }}
//                     className="flex-shrink-0 h-15 w-15 sm:w-20 sm:h-20 bg-[#D4AF37] rounded-full flex items-center justify-center text-white group-hover:bg-[#B8851A] transition-colors duration-300"
//                     style={{
//                       background:
//                         "radial-gradient(117.4% 117.54% at -15.51% 0%, #C3912F 0%, #F5E7A8 16.95%, #C3912F 100%)",
//                     }}
//                   >
//                     <Image
//                       src={point.icon}
//                       width={30}
//                       height={30}
//                       alt="icon"
//                     />
//                   </motion.div>
//                   <div className="flex-1 space-y-2 font-josefin pb-4">
//                     <h4 className="text-lg sm:text-xl font-normal text-[#01292B]">
//                       {point.title}
//                     </h4>
//                     <div className="relative">
//                       <div
//                         className="text-[#303030] description-text line-clamp-3"
//                         dangerouslySetInnerHTML={{ __html: point.description }}
//                       />
//                       <Link
//                         href="/blog"
//                         className="inline-flex items-center gap-1 text-base text-[#D4AF37] hover:text-[#B8851A] font-medium transition-colors group/link absolute sm:bottom-0 right-2 pl-2"
//                       >
//                         Read More
//                       </Link>
//                     </div>
//                   </div>
//                 </motion.div>
//               ))}
//             </motion.div>
//           </motion.div>

//           {/* Right Column - 4-Image Grid */}
//           <motion.div
//             variants={containerVariants}
//             initial="hidden"
//             whileInView="visible"
//             viewport={{ once: true, margin: "-100px" }}
//             className="flex flex-wrap gap-3 lg:gap-4 h-auto lg:h-full sm:py-10"
//           >
//             {/* Image 1 */}
//             {images[0] && (
//               <motion.div
//                 variants={imageVariants}
//                 className="relative h-auto min-h-[200px] sm:h-80 lg:h-110 basis-[47%] sm:basis-[48%] md:basis-[48.5%] lg:basis-[52%] xl:basis-[54%] rounded-3xl overflow-hidden [@media(max-width:300px)]:basis-full"
//               >
//                 <Image
//                   src={images[0]}
//                   alt="Investment Image 1"
//                   fill
//                   className="object-cover hover:scale-105 transition-transform duration-700"
//                 />
//               </motion.div>
//             )}

//             {/* Image 2 */}
//             {images[1] && (
//               <motion.div
//                 variants={imageVariants}
//                 className="relative h-auto min-h-[200px] sm:h-80 lg:h-110 basis-[48.5%] md:basis-[48.5%] lg:basis-[43%] rounded-3xl overflow-hidden  [@media(max-width:300px)]:basis-full"
//               >
//                 <Image
//                   src={images[1]}
//                   alt="Investment Image 2"
//                   fill
//                   className="object-cover hover:scale-105 transition-transform duration-700"
//                 />
//               </motion.div>
//             )}

//             {/* Image 3 */}
//             {images[2] && (
//               <motion.div
//                 variants={imageVariants}
//                 className="relative h-auto min-h-[200px] sm:h-80 lg:h-110 basis-[47%] sm:basis-[48%] md:basis-[48.5%] lg:basis-[58%] xl:basis-[60%] rounded-3xl overflow-hidden [@media(max-width:300px)]:basis-full"
//               >
//                 <Image
//                   src={images[2]}
//                   alt="Investment Image 3"
//                   fill
//                   className="object-cover hover:scale-105 transition-transform duration-700"
//                 />
//               </motion.div>
//             )}

//             {/* Image 4 */}
//             {images[3] && (
//               <motion.div
//                 variants={imageVariants}
//                 className="relative h-auto min-h-[200px] sm:h-80 lg:h-110 basis-[48.5%] md:basis-[48.5%] lg:basis-[37%] rounded-3xl overflow-hidden [@media(max-width:300px)]:basis-full"
//               >
//                 <Image
//                   src={images[3]}
//                   alt="Investment Image 4"
//                   fill
//                   className="object-cover hover:scale-105 transition-transform duration-700"
//                 />
//               </motion.div>
//             )}
//           </motion.div>
//         </div>
//       </div>
//     </section>
//   );
// }

"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface InvestmentPoint {
  _id: string;
  title: string;
  description: string;
  icon: string;
}

interface WhyInvestSectionProps {
  mainTitle?: string;
  highlightedTitle?: string;
  description?: string;
  investmentPoints?: InvestmentPoint[];
  images?: string[];
  [key: string]: unknown;
}

export default function WhyInvestSection({
  mainTitle = "WHY INVEST IN",
  highlightedTitle = "PHUKET",
  description = "<p>Discover the benefits of investing in Phuket's thriving real estate market.</p>",
  investmentPoints = [],
  images = [
    "/images/invest1.jpg",
    "/images/invest2.jpg",
    "/images/invest3.jpg",
    "/images/invest4.jpg",
  ],
  ...props
}: WhyInvestSectionProps) {
  // Framer-motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const imageVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const containerInvestmentVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  // Ensure investmentPoints is always an array
  const safeInvestmentPoints = Array.isArray(investmentPoints) ? investmentPoints : [];
  // Ensure images is always an array
  const safeImages = Array.isArray(images) ? images : [];

  return (
    <section className="font-cinzel py-10 sm:py-16 lg:py-24 bg-secondary">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-12 xl:gap-16 items-start">
          {/* Left Column - Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="space-y-4 sm:space-y-6"
          >
            <motion.div
              variants={itemVariants}
              className="md:space-y-2 text-center xl:text-left"
            >
              <h2 className="text-2xl sm:text-3xl lg:text-[50px] font-normal text-[#303030]">
                {mainTitle}
              </h2>
              <h3 className="text-2xl sm:text-3xl lg:text-[50px] font-bold text-[#D4AF37]">
                {highlightedTitle}
              </h3>
            </motion.div>

            {/* The description can be rendered safely using dangerouslySetInnerHTML for TinyMCE content */}
            <motion.div
              variants={itemVariants}
              className="font-josefin text-[#303030] description-text text-center xl:text-left space-y-4"
              dangerouslySetInnerHTML={{ __html: description }}
            />

            <motion.div
              variants={containerInvestmentVariants}
              initial="hidden"
              animate="visible"
              className=""
            >
              {safeInvestmentPoints.map((point, index) => (
                <motion.div
                  key={point._id || `investment-point-${index}`}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3, margin: "-50px" }}
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: {
                      opacity: 1,
                      x: 0,
                      transition: {
                        delay: index * 0.1,
                        duration: 0.5,
                        ease: "easeOut",
                      },
                    },
                  }}
                  className="flex items-start gap-6 group pb-4 sm:pb-0 mb-5"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="flex-shrink-0 h-15 w-15 sm:w-20 sm:h-20 bg-[#D4AF37] rounded-full flex items-center justify-center text-white group-hover:bg-[#B8851A] transition-colors duration-300"
                    style={{
                      background:
                        "radial-gradient(117.4% 117.54% at -15.51% 0%, #C3912F 0%, #F5E7A8 16.95%, #C3912F 100%)",
                    }}
                  >
                    <Image
                      src={point.icon}
                      width={30}
                      height={30}
                      alt="icon"
                    />
                  </motion.div>
                  <div className="flex-1 space-y-2 font-josefin pb-4">
                    <h4 className="text-lg sm:text-xl font-normal text-[#01292B]">
                      {point.title}
                    </h4>
                    <div className="relative">
                      <div
                        className="text-[#303030] description-text line-clamp-3"
                        dangerouslySetInnerHTML={{ __html: point.description }}
                      />
                      <Link
                        href={`/why-invest#${point.title.replace(/\s+/g, '-').toLowerCase()}`}
                        className="inline-flex items-center gap-1 text-base text-[#D4AF37] hover:text-[#B8851A] font-medium transition-colors group/link absolute sm:-bottom-5 right-2 pl-2"
                      >
                        Read More
                        <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Column - 4-Image Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="flex flex-wrap gap-3 lg:gap-4 h-auto lg:h-full sm:py-10"
          >
            {/* Image 1 */}
            {safeImages[0] && (
              <motion.div
                variants={imageVariants}
                className="relative h-auto min-h-[200px] sm:h-80 lg:h-110 basis-[47%] sm:basis-[48%] md:basis-[48.5%] lg:basis-[52%] xl:basis-[54%] rounded-3xl overflow-hidden [@media(max-width:300px)]:basis-full"
              >
                <Image
                  src={safeImages[0]}
                  alt="Investment Image 1"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
              </motion.div>
            )}

            {/* Image 2 */}
            {safeImages[1] && (
              <motion.div
                variants={imageVariants}
                className="relative h-auto min-h-[200px] sm:h-80 lg:h-110 basis-[48.5%] md:basis-[48.5%] lg:basis-[43%] rounded-3xl overflow-hidden  [@media(max-width:300px)]:basis-full"
              >
                <Image
                  src={safeImages[1]}
                  alt="Investment Image 2"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
              </motion.div>
            )}

            {/* Image 3 */}
            {safeImages[2] && (
              <motion.div
                variants={imageVariants}
                className="relative h-auto min-h-[200px] sm:h-80 lg:h-110 basis-[47%] sm:basis-[48%] md:basis-[48.5%] lg:basis-[58%] xl:basis-[60%] rounded-3xl overflow-hidden [@media(max-width:300px)]:basis-full"
              >
                <Image
                  src={safeImages[2]}
                  alt="Investment Image 3"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
              </motion.div>
            )}

            {/* Image 4 */}
            {safeImages[3] && (
              <motion.div
                variants={imageVariants}
                className="relative h-auto min-h-[200px] sm:h-80 lg:h-110 basis-[48.5%] md:basis-[48.5%] lg:basis-[37%] rounded-3xl overflow-hidden [@media(max-width:300px)]:basis-full"
              >
                <Image
                  src={safeImages[3]}
                  alt="Investment Image 4"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}