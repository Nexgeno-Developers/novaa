"use client";

import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import { start } from "repl";

interface TestimonialData {
  id: string;
  name: string;
  role: string;
  rating: number;
  quote: string;
  avatar: string;
  order: number;
  isActive: boolean;
}
// interface SectionContent {
//   title?: string;
//   subtitle?: string;
// }

interface TestimonialsSectionProps {
  title?: string;
  subtitle?: string;
  testimonials?: TestimonialData[];
  [key: string]: unknown;
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
  testimonial: TestimonialData;
  isActive: boolean;
};

const TestimonialCard = ({ testimonial, isActive }: TestimonialCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative flex justify-center items-center">
        {/* Masked card */}
        <div className="inverted-radius h-60 sm:h-[300px] bg-white rounded-[40px] p-6 lg:p-8 flex flex-col z-10">
          <div className="flex pb-2">
            <StarRating rating={testimonial.rating} />
          </div>
          <div
            className="text-background description-text mb-0 lg:mb-8 flex-grow font-josefin"
            dangerouslySetInnerHTML={{ __html: testimonial.quote }}
          />
          <p
            className="font-light font-josefin"
            dangerouslySetInnerHTML={{ __html: testimonial.name }}
          ></p>
        </div>

        {/* Avatar ABOVE mask */}
        <div className="absolute bottom-0 sm:bottom-0 right-0 sm:right-0 z-20">
          <img
            src={testimonial.avatar}
            alt={testimonial.name}
            className="w-14 h-14 rounded-full object-cover border border-[#CDB04E] bg-white"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default function EliteClientsTestimonials({
  testimonials = [],
  title = "What Our <span class='text-[#D4AF37] font-bold'>Elite Clients Say</span>",
  subtitle = "Real stories from real people who trust us",
  ...props
}: TestimonialsSectionProps) {
  // console.log("Title and subtitle" , title , subtitle)
  // console.log("Elite output " , content)
  // const title =
  //   content?.title ??
  //   ;

  // const description =
  //   content?.description ?? "";

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    dragFree: true,
    align: "start",
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

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

  // Show empty state
  if (!testimonials || testimonials.length === 0) {
    return (
      <div className="bg-secondary py-10 lg:py-20">
        <div className="container">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-[50px] font-normal text-[#01292B] mb-4 uppercase font-cinzel">
              What Our{" "}
              <span className="text-[#D4AF37] font-bold">
                Elite Clients Say
              </span>
            </h2>
            <p className="font-josefin text-[#303030] description-text mb-8">
              Real stories from real people who trust us
            </p>
            <p className="text-gray-500">
              No testimonials available at the moment.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Filter active testimonials and sort by order
  const activeTestimonials = testimonials
    .filter((testimonial) => testimonial.isActive)
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
            <div dangerouslySetInnerHTML={{ __html: title }} />
          </h2>
          <span
            className="font-josefin text-[#303030] description-text"
            dangerouslySetInnerHTML={{ __html: subtitle }}
          />
        </motion.div>

        {activeTestimonials.length > 0 && (
          <>
            {/* Embla Carousel */}
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex">
                {activeTestimonials.map((testimonial, index) => (
                  <div
                    key={testimonial.id}
                    className="min-w-0 flex-[0_0_100%] md:flex-[0_0_50%] xl:flex-[0_0_33.3333%] px-4"
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
                // initial={{ opacity: 0, y: 20 }}
                // animate={{ opacity: 1, y: 0 }}
                // transition={{ duration: 0.6, delay: 0.4 }}
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
