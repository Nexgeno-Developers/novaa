// "use client";

// import React, { useCallback, useEffect, useState } from "react";
// import useEmblaCarousel from "embla-carousel-react";
// import { motion } from "framer-motion";
// import { ArrowLeft, ArrowRight } from "lucide-react";
// import Image from "next/image";

// type UseCarouselOptions = {
//   autoplay?: boolean;
//   delay?: number;
// };

// interface Testimonial {
//   id: number;
//   name: string;
//   role: string;
//   rating: number;
//   quote: string;
//   avatar: string;
//   demo: string;
// }

// const testimonials: Testimonial[] = [
//   {
//     id: 1,
//     name: "Mr. David Chen",
//     role: "Business Magnate, Singapore",
//     rating: 5,
//     quote:
//       "From visa assistance to legal paperwork, Novaa handled everything flawlessly. A truly luxurious experience. — Mr. David Chen, Business Magnate, Singapore",
//     avatar: "/testimonials/image-one.png",
//     demo: "Demo",
//   },
//   {
//     id: 2,
//     name: "Mr. Arjun Mehta",
//     role: "Entrepreneur, Mumbai",
//     rating: 5,
//     quote:
//       "Novaa transformed my investment journey. Their transparency and end-to-end support made owning a luxury property in Phuket effortless. — Mr. Arjun Mehra, Entrepreneur, Mumbai",
//     avatar: "/testimonials/image-two.png",
//     demo: "Demo",
//   },
//   {
//     id: 3,
//     name: "Ms. Elena Volkov",
//     role: "Investor, London",
//     rating: 5,
//     quote:
//       "The rental income from my Layan Verde property exceeded my expectations. Novaa management is impeccable. — Ms. Elena Volkov, Investor, London",
//     avatar: "/testimonials/image-three.png",
//     demo: "Demo",
//   },
//   {
//     id: 4,
//     name: "Ms. Elena Volkov",
//     role: "Investor, London",
//     rating: 5,
//     quote:
//       "The rental income from my Layan Verde property exceeded my expectations. Novaa management is impeccable. — Ms. Elena Volkov, Investor, London",
//     avatar: "/testimonials/image-three.png",
//     demo: "Demo",
//   },
//   {
//     id: 5,
//     name: "Ms. Elena Volkov",
//     role: "Investor, London",
//     rating: 5,
//     quote:
//       "The rental income from my Layan Verde property exceeded my expectations. Novaa management is impeccable. — Ms. Elena Volkov, Investor, London",
//     avatar: "/testimonials/image-three.png",
//     demo: "Demo",
//   },
//   {
//     id: 6,
//     name: "Ms. Elena Volkov",
//     role: "Investor, London",
//     rating: 5,
//     quote:
//       "The rental income from my Layan Verde property exceeded my expectations. Novaa management is impeccable. — Ms. Elena Volkov, Investor, London",
//     avatar: "/testimonials/image-three.png",
//     demo: "Demo",
//   },
// ];

// interface Rating {
//   rating: number;
// }

// const StarRating = ({ rating }: Rating) => {
//   return (
//     <div className="flex gap-1 mb-4">
//       {[...Array(5)].map((_, index) => (
//         <motion.svg
//           key={index}
//           initial={{ opacity: 0, scale: 0 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ delay: index * 0.1 }}
//           className={`w-4 h-4 ${
//             index < rating ? "text-yellow-400" : "text-gray-200"
//           }`}
//           fill="currentColor"
//           viewBox="0 0 20 20"
//         >
//           <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//         </motion.svg>
//       ))}
//     </div>
//   );
// };

// type TestimonialCardProps = {
//   testimonial: Testimonial; // or a more specific type like `Testimonial[]`
//   isActive: boolean;
// };

// const TestimonialCard = ({ testimonial, isActive }: TestimonialCardProps) => {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5 }}
//       className=""
//     >
//       <div className="relative flex justify-center items-center overflow-hidden">
//         {/* Card with inverted radius */}
//         <div className="inverted-radius h-60 bg-white rounded-[40px] p-6 lg:p-8 sm:h-[300px] flex flex-col relative z-10 ">
//           <div className="flex pb-2">
//             {Array.from({ length: testimonial.rating }).map((_, index) => (
//               <Image
//                 key={index}
//                 src="/icons/star.svg"
//                 width={18}
//                 height={18}
//                 alt="Star Icon"
//               />
//             ))}
//           </div>
//           <p className="text-background description-text mb-0 lg:mb-8 flex-grow">
//             &quot;{testimonial.quote}&quot;
//           </p>
//           <p className="font-light">Demo</p>
//         </div>

//         {/* Avatar outside the mask */}
//         <div className="absolute  bottom-0 right-0 xl:right-5 2xl:right-15">
//           <img
//             src={testimonial.avatar}
//             alt={testimonial.name}
//             className="w-14 h-14 rounded-full object-cover border-1 border-[#CDB04E]"
//           />
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// export default function EliteClientsTestimonials() {
//   const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
//   const [selectedIndex, setSelectedIndex] = useState(0);

//   const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
//   const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

//   const onSelect = useCallback(() => {
//     if (!emblaApi) return;
//     setSelectedIndex(emblaApi.selectedScrollSnap());
//   }, [emblaApi]);

//   useEffect(() => {
//     if (!emblaApi) return;
//     emblaApi.on("select", onSelect);
//     onSelect();
//   }, [emblaApi, onSelect]);

//   return (
//     <div className="bg-secondary py-10 lg:py-20">
//       <div className="container">
//         {/* Header */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//           className="text-center mb-10 lg:mb-16 font-cinzel"
//         >
//           <h2 className="text-2xl sm:text-3xl lg:text-[50px] font-normal text-[#01292B] mb-4 uppercase">
//             What Our{" "}
//             <span className="text-[#D4AF37] font-bold">Elite Clients Say</span>
//           </h2>
//           <p className="font-josefin text-[#303030] description-text">
//             Real stories from real people who trust us
//           </p>
//         </motion.div>

//         {/* Embla Carousel */}
//         <div className="overflow-hidden" ref={emblaRef}>
//           <div className="flex ">
//             {testimonials.map((testimonial, index) => (
//               <div
//                 className="min-w-0 flex-[0_0_100%] lg:flex-[0_0_33.3333%]"
//                 key={testimonial.id}
//               >
//                 <TestimonialCard
//                   testimonial={testimonial}
//                   isActive={index === selectedIndex}
//                 />
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Navigation */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6, delay: 0.4 }}
//           className="flex items-center justify-center gap-4 mt-10"
//         >
//           <button
//             onClick={scrollPrev}
//             className="group flex items-center justify-center h-8 w-8 sm:w-12 sm:h-12 rounded-full bg-[#CDB04E] hover:bg-yellow-700 transition-colors duration-200 shadow-lg cursor-pointer"
//           >
//             <ArrowLeft className="w-3 h-3 sm:w-5 sm:h-5 text-background group-hover:scale-110 transition-transform duration-200" />
//           </button>

//           <button
//             onClick={scrollNext}
//             className="group flex items-center justify-center h-8 w-8 sm:w-12 sm:h-12 rounded-full bg-[#CDB04E] hover:bg-yellow-700 transition-colors duration-200 shadow-lg cursor-pointer"
//           >
//             <ArrowRight className="w-3 h-3 sm:w-5 sm:h-5 text-background group-hover:scale-110 transition-transform duration-200" />
//           </button>
//         </motion.div>
//       </div>
//     </div>
//   );
// }
// components/sections/EliteClientsTestimonials.tsx
"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import Image from "next/image";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  rating: number;
  quote: string;
  avatar: string;
  order: number;
  isActive: boolean;
}

interface TestimonialsData {
  content: {
    title: string;
    description: string;
  };
  testimonials: Testimonial[];
}

interface Rating {
  rating: number;
}

const StarRating = ({ rating }: Rating) => {
  return (
    <div className="flex gap-1 mb-4">
      {[...Array(5)].map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
        >
          <Star
            className={`w-4 h-4 ${
              index < rating ? "text-yellow-400 fill-current" : "text-gray-200"
            }`}
          />
        </motion.div>
      ))}
    </div>
  );
};

type TestimonialCardProps = {
  testimonial: Testimonial;
  isActive: boolean;
};

const TestimonialCard = ({ testimonial, isActive }: TestimonialCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className=""
    >
      <div className="relative flex justify-center items-center overflow-hidden">
        {/* Card with inverted radius */}
        <div className="inverted-radius h-60 bg-white rounded-[40px] p-6 lg:p-8 sm:h-[300px] flex flex-col relative z-10 ">
          <div className="flex pb-2">
            <StarRating rating={testimonial.rating} />
          </div>
          <div 
            className="text-background description-text mb-0 lg:mb-8 flex-grow"
            dangerouslySetInnerHTML={{ __html: testimonial.quote }}
          />
          <p className="font-light">Demo</p>
        </div>

        {/* Avatar outside the mask */}
        <div className="absolute  bottom-0 right-0 xl:right-5 2xl:right-15">
          <img
            src={testimonial.avatar}
            alt={testimonial.name}
            className="w-14 h-14 rounded-full object-cover border-1 border-[#CDB04E]"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default function EliteClientsTestimonials() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [testimonialsData, setTestimonialsData] = useState<TestimonialsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch testimonials data
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/cms/testimonials');
        if (!response.ok) {
          throw new Error('Failed to fetch testimonials');
        }
        const data = await response.json();
        if (data.success) {
          setTestimonialsData(data.data);
        } else {
          throw new Error(data.error || 'Failed to load testimonials');
        }
      } catch (error) {
        console.error('Error fetching testimonials:', error);
        setError(error instanceof Error ? error.message : 'Failed to load testimonials');
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  // Show loading state
  if (loading) {
    return (
      <div className="bg-secondary py-10 lg:py-20">
        <div className="container">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded mx-auto mb-4 w-64"></div>
              <div className="h-4 bg-gray-300 rounded mx-auto mb-8 w-48"></div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-[40px] p-6 h-60">
                    <div className="animate-pulse space-y-4">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <div key={star} className="w-4 h-4 bg-gray-300 rounded"></div>
                        ))}
                      </div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-300 rounded"></div>
                        <div className="h-4 bg-gray-300 rounded"></div>
                        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="bg-secondary py-10 lg:py-20">
        <div className="container">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error loading testimonials: {error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show empty state
  if (!testimonialsData || !testimonialsData.testimonials || testimonialsData.testimonials.length === 0) {
    return (
      <div className="bg-secondary py-10 lg:py-20">
        <div className="container">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-[50px] font-normal text-[#01292B] mb-4 uppercase font-cinzel">
              What Our{" "}
              <span className="text-[#D4AF37] font-bold">Elite Clients Say</span>
            </h2>
            <p className="font-josefin text-[#303030] description-text mb-8">
              Real stories from real people who trust us
            </p>
            <p className="text-gray-500">No testimonials available at the moment.</p>
          </div>
        </div>
      </div>
    );
  }

  // Filter active testimonials and sort by order
  const activeTestimonials = testimonialsData.testimonials
    .filter(testimonial => testimonial.isActive)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="bg-secondary py-10 lg:py-20">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 lg:mb-16 font-cinzel"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-[50px] font-normal text-[#01292B] mb-4 uppercase">
            <div dangerouslySetInnerHTML={{ __html: testimonialsData.content.title }} />
          </h2>
          <div 
            className="font-josefin text-[#303030] description-text"
            dangerouslySetInnerHTML={{ __html: testimonialsData.content.description }}
          />
        </motion.div>

        {activeTestimonials.length > 0 && (
          <>
            {/* Embla Carousel */}
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex ">
                {activeTestimonials.map((testimonial, index) => (
                  <div
                    className="min-w-0 flex-[0_0_100%] lg:flex-[0_0_33.3333%]"
                    key={testimonial.id}
                  >
                    <TestimonialCard
                      testimonial={testimonial}
                      isActive={index === selectedIndex}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation */}
            {activeTestimonials.length > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex items-center justify-center gap-4 mt-10"
              >
                <button
                  onClick={scrollPrev}
                  className="group flex items-center justify-center h-8 w-8 sm:w-12 sm:h-12 rounded-full bg-[#CDB04E] hover:bg-yellow-700 transition-colors duration-200 shadow-lg cursor-pointer"
                >
                  <ArrowLeft className="w-3 h-3 sm:w-5 sm:h-5 text-background group-hover:scale-110 transition-transform duration-200" />
                </button>

                <button
                  onClick={scrollNext}
                  className="group flex items-center justify-center h-8 w-8 sm:w-12 sm:h-12 rounded-full bg-[#CDB04E] hover:bg-yellow-700 transition-colors duration-200 shadow-lg cursor-pointer"
                >
                  <ArrowRight className="w-3 h-3 sm:w-5 sm:h-5 text-background group-hover:scale-110 transition-transform duration-200" />
                </button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}