"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";

type UseCarouselOptions = {
  autoplay?: boolean;
  delay?: number;
};

interface Testimonial {
  id: number;
  name: string;
  role: string;
  rating: number;
  quote: string;
  avatar: string;
  demo: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Mr. David Chen",
    role: "Business Magnate, Singapore",
    rating: 5,
    quote:
      "From visa assistance to legal paperwork, Novaa handled everything flawlessly. A truly luxurious experience. — Mr. David Chen, Business Magnate, Singapore",
    avatar: "/testimonials/image-one.png",
    demo: "Demo",
  },
  {
    id: 2,
    name: "Mr. Arjun Mehta",
    role: "Entrepreneur, Mumbai",
    rating: 5,
    quote:
      "Novaa transformed my investment journey. Their transparency and end-to-end support made owning a luxury property in Phuket effortless. — Mr. Arjun Mehra, Entrepreneur, Mumbai",
    avatar: "/testimonials/image-two.png",
    demo: "Demo",
  },
  {
    id: 3,
    name: "Ms. Elena Volkov",
    role: "Investor, London",
    rating: 5,
    quote:
      "The rental income from my Layan Verde property exceeded my expectations. Novaa management is impeccable. — Ms. Elena Volkov, Investor, London",
    avatar: "/testimonials/image-three.png",
    demo: "Demo",
  },
  {
    id: 4,
    name: "Ms. Elena Volkov",
    role: "Investor, London",
    rating: 5,
    quote:
      "The rental income from my Layan Verde property exceeded my expectations. Novaa management is impeccable. — Ms. Elena Volkov, Investor, London",
    avatar: "/testimonials/image-three.png",
    demo: "Demo",
  },
  {
    id: 5,
    name: "Ms. Elena Volkov",
    role: "Investor, London",
    rating: 5,
    quote:
      "The rental income from my Layan Verde property exceeded my expectations. Novaa management is impeccable. — Ms. Elena Volkov, Investor, London",
    avatar: "/testimonials/image-three.png",
    demo: "Demo",
  },
  {
    id: 6,
    name: "Ms. Elena Volkov",
    role: "Investor, London",
    rating: 5,
    quote:
      "The rental income from my Layan Verde property exceeded my expectations. Novaa management is impeccable. — Ms. Elena Volkov, Investor, London",
    avatar: "/testimonials/image-three.png",
    demo: "Demo",
  },
];

interface Rating {
  rating: number;
}

const StarRating = ({ rating }: Rating) => {
  return (
    <div className="flex gap-1 mb-4">
      {[...Array(5)].map((_, index) => (
        <motion.svg
          key={index}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className={`w-4 h-4 ${
            index < rating ? "text-yellow-400" : "text-gray-200"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </motion.svg>
      ))}
    </div>
  );
};

type TestimonialCardProps = {
  testimonial: Testimonial; // or a more specific type like `Testimonial[]`
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
      <div className="relative flex justify-center items-center">
        {/* Card with inverted radius */}
        <div className="inverted-radius h-60 bg-white rounded-[40px] p-6 lg:p-8 sm:h-[300px] flex flex-col relative z-10 ">
          <StarRating rating={testimonial.rating} />
          <p className="text-[#303030CC] text-xs xs:text-sm lg:text-base leading-relaxed mb-0 lg:mb-8 flex-grow">
            &quot;{testimonial.quote}&quot;
          </p>
          <p className="font-light">Demo</p>
        </div>

        {/* Avatar outside the mask */}
        <div className="absolute sm:bottom-0 bottom-0 right-0 xs:right-0 md:right-0 lg:right-0 xl:right-0 ">
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

  return (
    <div className="bg-secondary py-10 lg:py-20">
      <div className="container mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 lg:mb-16 font-cinzel"
        >
          <h2 className="text-xl xs:text-2xl sm:text-3xl lg:text-[50px] font-normal text-[#01292B] mb-4 uppercase">
            What Our{" "}
            <span className="text-[#D4AF37] font-bold">Elite Clients Say</span>
          </h2>
          <p className="font-josefin text-[#303030] text-xs xs:text-sm sm:text-base lg:text-lg font-light">
            Real stories from real people who trust us
          </p>
        </motion.div>

        {/* Embla Carousel */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-2 lg:gap-6 sm:px-6">
            {testimonials.map((testimonial, index) => (
              <div
                className="min-w-0 flex-[0_0_100%] lg:flex-[0_0_33.3333%] px-4 sm:px-2"
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex items-center justify-center gap-4 mt-10"
        >
          <button
            onClick={scrollPrev}
            className="group flex items-center justify-center h-8 w-8 sm:w-12 sm:h-12 rounded-full bg-[#CDB04E] hover:bg-yellow-700 transition-colors duration-200 shadow-lg"
          >
            <ArrowLeft className="w-3 h-3 sm:w-5 sm:h-5 text-background group-hover:scale-110 transition-transform duration-200" />
          </button>

          <button
            onClick={scrollNext}
            className="group flex items-center justify-center h-8 w-8 sm:w-12 sm:h-12 rounded-full bg-[#CDB04E] hover:bg-yellow-700 transition-colors duration-200 shadow-lg"
          >
            <ArrowRight className="w-3 h-3 sm:w-5 sm:h-5 text-background group-hover:scale-110 transition-transform duration-200" />
          </button>
        </motion.div>
      </div>
    </div>
  );
}
