"use client";

import { motion, Variants } from "framer-motion";
import Image from "next/image";

interface InvestmentPlan {
  paymentPlan: string;
  guaranteedReturn: string;
  returnStartDate: string;
}

interface Project {
  _id: string;
  name: string;
  projectDetail?: {
    investmentPlans: {
      title: string;
      description: string;
      backgroundImage: string;
      plans: InvestmentPlan[];
    };
  };
}

interface InvestmentPlansProps {
  project: Project;
}

const InvestmentPlans = ({ project }: InvestmentPlansProps) => {
  const investmentPlans = project.projectDetail?.investmentPlans;

  // Return null if no investment plans data or no plans
  if (!investmentPlans || !investmentPlans.plans || investmentPlans.plans.length === 0) {
    return null;
  }

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

  const tableVariants: Variants = {
    hidden: {
      opacity: 0,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  // Use background image from project or default
  const backgroundImage = investmentPlans.backgroundImage || '/images/investment-plans/bg.jpg';

  return (
    <section className="relative w-full overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('${backgroundImage}')`,
        }}
      />

      {/* Color Overlay */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{ backgroundColor: "#01292BD9" }}
      />

      {/* Top to Bottom Gradient */}
      <div className="absolute inset-0 top-0 w-full h-1/4 bg-gradient-to-b from-[#01292B] to-[#01292B00]" />

      {/* Bottom to Top Gradient */}
      <div className="absolute inset-x-0 bottom-0 w-full h-1/4 bg-gradient-to-t from-[#01292B] to-[#01292B00]" />

      {/* Content Container */}
      <div className="relative z-10 py-10 sm:py-20 flex flex-col justify-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
          className="container"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-4 sm:mb-16">
            <h2 className="font-cinzel text-2xl sm:text-3xl lg:text-[50px] font-light text-white mb-6">
              {investmentPlans.title.split(' ').map((word, index) => {
                // Make certain words bold/primary colored - adjust this logic as needed
                const highlightWords = ['INVESTMENT', 'PLANS', 'LIMITED-TIME'];
                if (highlightWords.includes(word.replace(/[^A-Z]/g, ''))) {
                  return (
                    <span key={index} className="text-primary font-bold">
                      {word}{' '}
                    </span>
                  );
                }
                return word + ' ';
              })}
            </h2>
            {investmentPlans.description && (
              <div 
                className="font-josefin text-white max-w-2xl mx-auto description-text"
                dangerouslySetInnerHTML={{ __html: investmentPlans.description }}
              />
            )}
          </motion.div>

          {/* Investment Plans Table */}
          <motion.div
            variants={tableVariants}
            className="font-josefin bg-white backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl"
          >
            {/* Table Header */}
            <div className="bg-primary grid grid-cols-12 md:grid-cols-12">
              <div className="col-span-4 md:col-span-3 border-r p-2 sm:p-6 border-yellow-600/30 flex flex-col sm:flex-row justify-center sm:justify-center items-center space-x-3">
                <Image
                  src={"/images/investment-plans/money.png"}
                  width={20}
                  height={20}
                  alt="money icon"
                />
                <h3 className="text-background text-center font-medium text-sm sm:text-2xl">
                  Payment Plan
                </h3>
              </div>
              <div className="col-span-4 md:col-span-6 p-2 sm:p-6 border-r border-yellow-600/30 flex flex-col sm:flex-row justify-center sm:justify-center items-center space-x-3">
                <Image
                  src={"/images/investment-plans/return.png"}
                  width={20}
                  height={20}
                  alt="return icon"
                />
                <h3 className="text-background text-center font-medium text-sm sm:text-2xl">
                  Guaranteed Return (Per Annum)
                </h3>
              </div>
              <div className="col-span-4 md:col-span-3 p-2 sm:p-6 flex flex-col sm:flex-row justify-center sm:justify-center items-center text-center space-x-3">
                <Image
                  src={"/images/investment-plans/calendar.png"}
                  width={20}
                  height={20}
                  alt="calendar icon"
                />
                <h3 className="text-background text-center font-medium text-sm sm:text-2xl">
                  Return Start Date
                </h3>
              </div>
            </div>

            {/* Table Rows */}
            {investmentPlans.plans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: "easeOut",
                }}
                viewport={{ once: true }}
                className={`grid grid-cols-12 md:grid-cols-12 hover:bg-gray-50 transition-colors duration-300 ${
                  index !== investmentPlans.plans.length - 1
                    ? "border-b border-gray-200"
                    : ""
                }`}
              >
                {/* Payment Plan */}
                <div className="col-span-4 md:col-span-3 p-2 sm:p-6 border-r border-gray-200 flex justify-center items-center">
                  <div className="flex items-center space-x-2 sm:space-x-4">
                    <div className="w-8 h-8 rounded-full bg-background text-white flex items-center justify-center text-[10px] sm:text-sm font-semibold">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                    <span className="text-background font-normal text-sm sm:text-[22px]">
                      {plan.paymentPlan}
                    </span>
                  </div>
                </div>

                {/* Guaranteed Return */}
                <div className="col-span-4 md:col-span-6 p-2 sm:p-6 border-r border-gray-200 flex justify-center items-center">
                  <span className="text-2xl md:text-[40px] font-normal text-background">
                    {plan.guaranteedReturn}
                  </span>
                </div>

                {/* Return Start Date */}
                <div className="col-span-4 md:col-span-3 p-2 sm:p-6 flex justify-center items-center">
                  <span className="text-[#01292BCC] font-medium text-sm sm:text-base leading-relaxed">
                    {plan.returnStartDate}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default InvestmentPlans;