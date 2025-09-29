"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import Title from "@/components/client/Title";

interface CounterCard {
  _id?: string;
  number: string;
  title: string;
  description: string;
}

interface CounterSectionProps {
  title?: string;
  subtitle?: string;
  cards?: CounterCard[];
  [key: string]: unknown;
}

// Counter Animation Component
function AnimatedCounter({
  target,
  duration = 2000,
}: {
  target: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const counterRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(counterRef, { once: true });

  useEffect(() => {
    if (!isInView) return;

    // Extract numeric part from target string (e.g., "120+" -> 120)
    const numericValue = parseInt(target.replace(/\D/g, ""), 10) || 0;
    const suffix = target.replace(/\d/g, ""); // Extract non-numeric characters

    let startTime: number | null = null;
    const startCount = 0;

    const animateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      const currentCount = Math.floor(progress * numericValue);
      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(animateCount);
      }
    };

    requestAnimationFrame(animateCount);
  }, [isInView, target, duration]);

  // Extract suffix for display
  const suffix = target.replace(/\d/g, "");

  return (
    <span
      ref={counterRef}
      className="font-josefin font-medium text-xl sm:text-2xl xl:text-5xl"
    >
      {count}
      {/* {suffix} */}
    </span>
  );
}

export default function CounterSection({
  title = "Why Choose NOVAAA?",
  subtitle = "Trusted Real Estate Partner Delivering Value, Transparency & Growth",
  cards = [],
  ...props
}: CounterSectionProps) {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <motion.section
      ref={containerRef}
      className="relative py-16 lg:py-24 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25px 25px, #C3912F 2px, transparent 0), radial-gradient(circle at 75px 75px, #F5E7A8 2px, transparent 0)`,
            backgroundSize: "100px 100px",
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-10 lg:mb-16 font-cinzel"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-[50px] font-normal text-[#01292B] mb-4 uppercase">
            <Title title={title} />
          </h2>
          {subtitle && (
            <div
              className="font-josefin text-[#303030] description-text max-w-3xl mx-auto"
              dangerouslySetInnerHTML={{ __html: subtitle }}
            />
          )}
        </motion.div>

        {/* Counter Cards Grid */}
        {cards && cards.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {cards.map((card, index) => (
              <motion.div
                key={card._id || index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: "easeOut",
                }}
                viewport={{ once: true }}
                whileHover={{
                  y: -10,
                  transition: { duration: 0.3 },
                }}
                className="group"
              >
                {/* Card Container with Gradient Border */}
                <div className="relative py-2 rounded-3xl border-[1.7px] border-[#01292B80] overflow-hidden transition-all duration-500 group-hover:border-transparent">
                  {/* Gradient Border Effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="gradient-border-card group-hover:active absolute inset-0 rounded-3xl"></div>
                  </div>

                  {/* Inner Content */}
                  <div className="relative z-10 flex flex-col items-center">
                    {/* Golden Background Counter Box */}
                    <div
                      className="flex items-center justify-center h-28 w-[90%] rounded-2xl shadow-md relative"
                      style={{
                        background:
                          "radial-gradient(117.4% 117.54% at -15.51% 0%, #C3912F 0%, #F5E7A8 16.95%, #C3912F 100%)",
                      }}
                    >
                      <span className="font-cinzel font-bold text-3xl lg:text-4xl text-[#01292B]">
                        <AnimatedCounter target={card.number} />+
                      </span>
                    </div>
                  </div>
                </div>
                {/* Title */}
                <h3 className="font-josefin text-center font-semibold text-base sm:text-lg text-[#01292B] mb-2 group-hover:text-[#C3912F] transition-colors duration-300 pt-4">
                  {card.title}
                </h3>

                {/* Description */}
                <p className="font-josefin description-text text-gray-600 text-center leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                  {card.description}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.section>
  );
}
