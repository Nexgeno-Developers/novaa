"use client";

import { motion, Variants } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

const ModernAmenities = () => {
  const amenities = [
    {
      id: 1,
      title: "Landscaped Garden",
      image: "/images/modern-amenities/amenity-one.jpg",
    },
    {
      id: 2,
      title: "Senior Citizen Sit-Outs",
      image: "/images/modern-amenities/amenity-two.jpg",
    },
    {
      id: 3,
      title: "Kids' Play Area",
      image: "/images/modern-amenities/amenity-three.jpg",
    },
    {
      id: 4,
      title: "Fitness Center",
      image: "/images/modern-amenities/amenity-four.jpg",
    },
  ];

  // const autoplayOptions = {
  //   delay: 3000,
  //   stopOnInteraction: false,
  //   stopOnMouseEnter: true,
  //   stopOnFocusIn: false
  // }

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "center",
      containScroll: "trimSnaps",
      slidesToScroll: 1,
      breakpoints: {
        "(min-width: 768px)": { slidesToScroll: 1 },
        "(min-width: 1024px)": { slidesToScroll: 1 },
      },
    }
    // [Autoplay(autoplayOptions)] // Uncommented autoplay
  );

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  useEffect(() => {
    if (emblaApi) {
      // Optional: Add any additional carousel event listeners here
    }
  }, [emblaApi]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 50,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="relative bg-background py-10 sm:py-24 overflow-hidden">
      <div className="relative z-10 container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="font-cinzel text-3xl md:text-4xl lg:text-[40px] font-normal text-white mb-6">
              MODERN AMENITIES FOR A{" "}
              <span className="text-primary font-bold">BALANCED LIFESTYLE</span>
            </h2>
            <p className="font-josefin text-white text-base lg:text-large font-light max-w-3xl mx-auto leading-relaxed">
              Thoughtfully designed spaces that promote wellness, comfort, and
              everyday ease.
            </p>
          </motion.div>

          {/* Carousel Container */}
          <motion.div variants={itemVariants} className="relative">
            {/* Embla Carousel */}
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex">
                {amenities.map((amenity, index) => (
                  <div
                    key={amenity.id}
                    className="flex-[0_0_100%] min-w-0 pl-4 md:flex-[0_0_33.3333%] lg:flex-[0_0_33.333%]"
                  >
                    <motion.div
                      className="relative group cursor-pointer h-80 rounded-2xl overflow-hidden mx-2"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Image */}
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                        style={{ backgroundImage: `url(${amenity.image})` }}
                      />

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                      {/* Content */}
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h3 className="font-josefin text-white text-lg md:text-xl font-normal leading-tight">
                          {amenity.title}
                        </h3>
                      </div>

                      {/* Hover Effect */}
                      <div className="absolute inset-0 bg-yellow-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </motion.div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-center items-center space-x-4 mt-12">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={scrollPrev}
                className="w-12 h-12 rounded-full bg-primary hover:bg-yellow-400 transition-colors duration-300 flex items-center justify-center group cursor-pointer"
                aria-label="Previous slide"
              >
                <ArrowLeft className="w-6 h-6 text-background group-hover:text-teal-800 transition-colors" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={scrollNext}
                className="w-12 h-12 rounded-full bg-primary hover:bg-yellow-400 transition-colors duration-300 flex items-center justify-center group cursor-pointer"
                aria-label="Next slide"
              >
                <ArrowRight className="w-6 h-6 text-background group-hover:text-teal-800 transition-colors" />
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ModernAmenities;
