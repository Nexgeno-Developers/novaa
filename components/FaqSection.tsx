// components/public/FaqSection.tsx
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { ArrowUp, ArrowDown } from "lucide-react";

// Types matching the backend model
interface FaqItem {
  _id: string;
  question: string;
  answer: string;
  order: number;
}

interface FaqData {
  title: string;
  description: string;
  backgroundImage: string;
  faqs: FaqItem[];
}

const FaqSection = () => {
  const [data, setData] = useState<FaqData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedIndex, setExpandedIndex] = useState(0); // Accordion state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/cms/faq');
        if (!response.ok) throw new Error('Network response was not ok');
        const fetchedData: FaqData = await response.json();
        // Sort FAQs by order
        fetchedData.faqs.sort((a, b) => a.order - b.order);
        setData(fetchedData);
      } catch (error) {
        console.error("Failed to fetch FAQ data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleExpanded = (index: number) => {
    setExpandedIndex(expandedIndex === index ? -1 : index);
  };

  // Animation variants remain the same
  const containerVariants: Variants = { /* ... as before ... */ };
  const itemVariants: Variants = { /* ... as before ... */ };
  const headingVariants: Variants = { /* ... as before ... */ };

  if (loading) {
    return <section className="relative text-center py-20 bg-[#01292B]">Loading FAQs...</section>;
  }

  if (!data) {
    return null; // Or show an error message
  }

  return (
    <section className="relative overflow-hidden">
      {/* Background Image from CMS */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: `url(${data.backgroundImage})` }}
        ></div>
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 z-10 opacity-90" style={{ backgroundColor: "#01292BE5" }} />

      {/* Content */}
      <div className="container font-cinzel relative z-20 max-w-xl md:max-w-3xl lg:max-w-4xl py-10 lg:py-20">
        <div>
          {/* Header */}
          <motion.div
            className="text-center mb-4 sm:mb-6 lg:mb-10"
            variants={headingVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-2xl xs:text-3xl sm:text-4xl lg:text-[50px] font-bold bg-gradient-to-b from-[#C3912F] via-[#F5E7A8] to-[#C3912F] bg-clip-text text-transparent lg:mb-6">
                {data.title}
            </h2>
            {data.description && (
                 <div className="font-josefin font-light text-[#FFFFFFE5] text-base lg:text-lg"
                      dangerouslySetInnerHTML={{ __html: data.description }}/>
            )}
          </motion.div>

          {/* FAQ Accordion */}
          <motion.div
            className="space-y-2 lg:space-y-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            {data.faqs.map((faq, index) => (
              <motion.div
                key={faq._id}
                className="border-[0.5px] bg-[#CDB04E0D] border-[#CDB04E80] rounded-2xl overflow-hidden"
                variants={itemVariants}
                whileHover={{ borderColor: "#e1c159", transition: { duration: 0.3 } }}
              >
                <motion.button
                  className="w-full p-4 lg:p-5 cursor-pointer text-left focus:outline-none"
                  onClick={() => toggleExpanded(index)}
                  whileHover={{ backgroundColor: "rgba(212, 175, 55, 0.05)" }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-josefin text-[#C3912F] text-lg lg:text-xl pr-4">
                        {faq.question}
                      </p>
                    </div>
                    <motion.div className="flex-shrink-0 ml-4">
                      {expandedIndex === index ? (
                        <ArrowUp className="w-4 h-4 sm:w-6 sm:h-6 text-[#C3912F]" />
                      ) : (
                        <ArrowDown className="w-4 h-4 sm:w-6 sm:h-6 text-[#C3912F]" />
                      )}
                    </motion.div>
                  </div>
                </motion.button>

                <AnimatePresence>
                  {expandedIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-2 lg:px-6 lg:pb-6">
                        <div className="h-px bg-[#FFFFFF80] mb-4"></div>
                        <motion.div
                          className="font-josefin text-[#FFFFFF] description-text prose prose-invert"
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.1, duration: 0.3 }}
                          dangerouslySetInnerHTML={{ __html: faq.answer }}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;