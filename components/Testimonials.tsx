"use client";

import React, { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";

type UseCarouselOptions = {
  autoplay?: boolean;
  delay?: number;
};

// Simple carousel hook (replacing Embla for this demo)
const useCarousel = (slides: Testimonial[], options: UseCarouselOptions = {}) => {
  // console.log("Slides ", slides);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { autoplay = false, delay = 5000 } = options;

  const scrollNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const scrollPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const scrollTo = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  useEffect(() => {
    if (autoplay) {
      const interval = setInterval(scrollNext, delay);
      return () => clearInterval(interval);
    }
  }, [autoplay, delay, scrollNext]);

  return {
    currentIndex,
    scrollNext,
    scrollPrev,
    scrollTo,
  };
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

const testimonials : Testimonial[] = [
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
      className="bg-white rounded-2xl p-8 h-full flex flex-col"
    >
      <StarRating rating={testimonial.rating} />

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-[#303030CC] text-base leading-relaxed mb-8 flex-grow"
      >
        &quot;{testimonial.quote}&quot;
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex justify-between items-center gap-4"
      >
        <p className="font-light ">Demo</p>
        <div className="relative flex justify-end">
          <img
            src={testimonial.avatar}
            alt={testimonial.name}
            className="w-12 h-12 rounded-full object-cover"
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function EliteClientsTestimonials() {
  const { currentIndex, scrollNext, scrollPrev } = useCarousel(testimonials, {
    autoplay: true,
    delay: 5000,
  });

  // Get 3 testimonials to display (current and next 2)
  const getVisibleTestimonials = () => {
    const visible = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % testimonials.length;
      visible.push(testimonials[index]);
    }
    return visible;
  };

  const visibleTestimonials = getVisibleTestimonials();

  return (
    <div className="bg-gray-50 py-20">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 font-cinzel"
        >
          <h2 className="text-3xl lg:text-4xl font-nromal text-[#01292B] mb-4">
            What Our{" "}
            <span className="text-[#D4AF37] font-bold">Elite Clients</span> Say
          </h2>
          <p className="font-josefin text-[#303030] text-md font-light">
            Real stories from real people who trust us
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {visibleTestimonials.map((testimonial, index) => (
            <motion.div
              key={`${testimonial.id}-${currentIndex}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <TestimonialCard
                testimonial={testimonial}
                isActive={index === 0}
              />
            </motion.div>
          ))}
        </div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex items-center justify-center gap-4"
        >
          <button
            onClick={scrollPrev}
            className="group flex items-center justify-center w-12 h-12 rounded-full bg-[#CDB04E] hover:bg-yellow-700 transition-colors duration-200 shadow-lg"
          >
            <ArrowLeft className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-200" />
          </button>

          <button
            onClick={scrollNext}
            className="group flex items-center justify-center w-12 h-12 rounded-full bg-[#CDB04E] hover:bg-yellow-700 transition-colors duration-200 shadow-lg"
          >
            <ArrowRight className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-200" />
          </button>
        </motion.div>
      </div>
    </div>
  );
}
