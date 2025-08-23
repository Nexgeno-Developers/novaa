"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Testimonial = {
  _id?: string;
  quote: string;
  content: string;
  designation: string;
  src: string;
  order: number;
};

type InvestorInsightsContent = {
  mainTitle: string;
  highlightedTitle: string;
  description: string;
};

type InvestorInsightsData = {
  content: InvestorInsightsContent;
  testimonials: Testimonial[];
  isActive: boolean;
};

const AnimatedTestimonials = ({
  testimonials,
  autoplay = false,
}: {
  testimonials: Testimonial[];
  autoplay?: boolean;
}) => {
  const [active, setActive] = useState(0);

  const handleNext = () => {
    setActive((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const isActive = (index: number) => {
    return index === active;
  };

  useEffect(() => {
    if (autoplay) {
      const interval = setInterval(handleNext, 5000);
      return () => clearInterval(interval);
    }
  }, [autoplay]);

  let toggle = true;

  const randomRotateY = () => {
    const value = toggle
      ? Math.floor(-12 * 1) - 0 // -20
      : Math.floor(11 * 1) + 0; // 20

    toggle = !toggle;
    return value;
  };

  if (!testimonials || testimonials.length === 0) {
    return (
      <div className="flex items-center justify-center h-[400px] text-white/50">
        No testimonials available
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center">
      <div className="relative  sm:h-[570px] w-[230px] h-[320px] xs:w-[300px] xs:h-[370px] sm:w-[500px] z-20">
        <AnimatePresence>
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial._id || index}
              onClick={handleNext}
              initial={{
                opacity: 0,
                scale: 0.9,
                z: -100,
                rotate: randomRotateY(),
              }}
              animate={{
                opacity: isActive(index) ? 1 : 0.7,
                scale: isActive(index) ? 1 : 0.95,
                z: isActive(index) ? 0 : -100,
                rotate: isActive(index) ? 0 : randomRotateY(),
                zIndex: isActive(index) ? 40 : testimonials.length + 2 - index,
                y: isActive(index) ? [0, -80, 0] : -25,
              }}
              exit={{
                opacity: 0,
                scale: 0.9,
                z: 100,
                rotate: randomRotateY(),
              }}
              transition={{
                duration: 0.9,
                ease: "easeInOut",
              }}
              className="absolute inset-0 origin-bottom"
            >
              <div className="relative h-full rounded-3xl bg-white overflow-hidden cursor-pointer">
                {/* Image Container with padding */}
                <div className="p-2 sm:p-4 pb-2">
                  <img
                    src={testimonial.src}
                    alt={testimonial.content}
                    className="w-full h-[180px] xs:h-[200px] sm:h-[360px] rounded-2xl object-cover object-center"
                    draggable={false}
                  />
                </div>

                {/* Content below image */}
                <div className="px-2 sm:px-4 pb-2 sm:pb-4">
                  <h1 className="py-1 font-josefin font-medium text-xs xs:text-md sm:text-xl text-background">
                    {testimonial.content}
                  </h1>
                  <div className="relative font-josefin pt-2 sm:pt-3 text-[10px] xs:text-sm sm:text-base text-[#303030]">
                    <div 
                      dangerouslySetInnerHTML={{ __html: testimonial.quote }} 
                      className="prose prose-sm max-w-none"
                    />
                    <span className="absolute top-0 left-0 w-1/2 h-[0.5px] bg-[#01292BCC]"></span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default function InvestorInsightsSection() {
  const [investorData, setInvestorData] = useState<InvestorInsightsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvestorInsights = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/cms/investor-insights');
        
        if (!response.ok) {
          throw new Error('Failed to fetch investor insights');
        }
        
        const data = await response.json();
        setInvestorData(data);
      } catch (err) {
        console.error('Error fetching investor insights:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
        
        // Fallback to default data if API fails
        setInvestorData({
          content: {
            mainTitle: "Insights for the",
            highlightedTitle: "Discerning Investor",
            description: "Stay informed with trending stories, industry updates, and thoughtful articles curated just for you."
          },
          testimonials: [
            {
              quote: "Luxury residential properties in 2024 with heavy property demand averaging 25% increase while rental yields in prime areas reached 7.8%, making it a new destination for HNIs.",
              content: "Phuket Tourism Market Report 2024: Real Numbers for Savvy Investors",
              designation: "2024 Market Analysis",
              src: "/images/invest-three.png",
              order: 1
            },
            {
              quote: "Commercial real estate opportunities showing 15% growth in Q3 2024, with office spaces in prime locations commanding premium rents.",
              content: "Phuket Tourism Market Report 2024: Real Numbers for Savvy Investors", 
              designation: "Q3 2024 Report",
              src: "/images/invest-four.png",
              order: 2
            }
          ],
          isActive: true
        });
      } finally {
        setLoading(false);
      }
    };

    fetchInvestorInsights();
  }, []);

  if (loading) {
    return (
      <div className="bg-background relative overflow-hidden py-10 lg:py-20">
        <div className="container relative z-10 lg:py-16">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!investorData || !investorData.isActive) {
    return null; // Don't render if data is not active
  }

  // Sort testimonials by order
  const sortedTestimonials = [...investorData.testimonials].sort((a, b) => a.order - b.order);

  return (
    <div className="bg-background relative overflow-hidden py-10 lg:py-20">
      {/* Background overlay - Made more visible for debugging */}
      <div className="absolute inset-0 sm:top-[15%] sm:bottom-[15%] md:top-[10%] md:bottom-[10%] lg:top-[20%] lg:bottom-[20%] left-0 right-0 bg-[#CDB04E0D] z-0" />

      <div className="container relative z-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-18 items-center mb-10">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="font-cinzel text-2xl sm:text-3xl lg:text-[50px] font-light text-white leading-tight text-center lg:text-left mt-0 sm:mt-10"
              >
                {investorData.content.mainTitle}{" "}
                <p
                  className=" font-cinzel text-2xl sm:text-3xl lg:text-[50px] font-bold mb-0 sm:mb-4 bg-clip-text text-transparent leading-tight "
                  style={{
                    background:
                      "linear-gradient(99.93deg, #C3912F 6.79%, #F5E7A8 31.89%, #C3912F 59.78%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {investorData.content.highlightedTitle}
                </p>
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="font-josefin description-text text-[#FFFFFFE5] text-center lg:text-left md:pb-20 lg:pb-0 px-4 sm:px-0"
                dangerouslySetInnerHTML={{ __html: investorData.content.description }}
              />
            </div>
          </motion.div>

          {/* Right Content - Animated Cards */}
          <div className="relative z-10">
            <AnimatedTestimonials
              testimonials={sortedTestimonials}
              autoplay={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}