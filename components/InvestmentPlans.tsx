'use client'

import { motion, Variants } from 'framer-motion'
import Image from 'next/image'

const InvestmentPlans = () => {
  const plans = [
    {
      id: 1,
      paymentPlan: "35% within 30 days",
      guaranteedReturn: "7%",
      returnStartDate: "5 years post-possession (End of 2027)"
    },
    {
      id: 2,
      paymentPlan: "50% within 30 days",
      guaranteedReturn: "7.7%",
      returnStartDate: "5 years post-possession (End of 2027)"
    },
    {
      id: 3,
      paymentPlan: "100% within 30 days",
      guaranteedReturn: "10%",
      returnStartDate: "5 years post-possession (End of 2027)"
    }
  ]

  const containerVariants : Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants : Variants = {
    hidden: { 
      opacity: 0, 
      y: 50 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  const tableVariants : Variants = {
    hidden: { 
      opacity: 0, 
      scale: 0.9 
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  }

  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/images/investment-plans/bg.jpg')`
        }}
      />
      
      {/* Color Overlay */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{ backgroundColor: '#01292BD9' }}
      />
      
      {/* Top to Bottom Gradient */}
      <div className="absolute inset-0 top-0  w-full h-1/4 bg-gradient-to-b from-[#01292B] to-[#01292B00]" />
      
      {/* Bottom to Top Gradient */}
      <div className="absolute inset-x-0 bottom-0 w-full h-1/4 bg-gradient-to-t from-[#01292B] to-[#01292B00]" />
      
      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-6 py-24 min-h-screen flex flex-col justify-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <motion.div 
            variants={itemVariants}
            className="text-center mb-16"
          >
            <h2 className="font-cinzel text-3xl md:text-4xl lg:text-[40px] font-light text-white mb-6">
              LIMITED-TIME <span className="text-primary font-bold">INVESTMENT PLANS</span>
            </h2>
            <p className="font-josefin font-light text-white text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
              Secure high returns with exclusive, time-sensitive opportunities.
            </p>
          </motion.div>

          {/* Investment Plans Table */}
          <motion.div 
            variants={tableVariants}
            className="font-josefin bg-white backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl"
          >
            {/* Table Header */}
            <div className="bg-primary grid grid-cols-12 md:grid-cols-12">
              <div className="col-span-4 md:col-span-3 border-r p-6 border-yellow-600/30 flex flex-col sm:flex-row justify-between sm:justify-center items-center space-x-3">
                <Image src={'/images/investment-plans/money.png'} width={20} height={20} alt="money icon" />
                <h3 className="text-background text-center font-medium text-sm sm:text-2xl">Payment Plan</h3>
              </div>
              <div className="col-span-4 md:col-span-6 p-6 border-r border-yellow-600/30 flex flex-col sm:flex-row justify-between sm:justify-center items-center space-x-3">
                <Image src={'/images/investment-plans/return.png'} width={20} height={20} alt="money icon" />
                <h3 className="text-background text-center font-medium text-sm sm:text-2xl">Guaranteed Return (Per Annum)</h3>
              </div>
              <div className="col-span-4 md:col-span-3 p-6 flex flex-col sm:flex-row justify-between sm:justify-center items-center text-center space-x-3">
                <Image src={'/images/investment-plans/calendar.png'} width={20} height={20} alt="money icon" />
                <h3 className="text-background text-center font-medium text-sm sm:text-2xl">Return Start Date</h3>
              </div>
            </div>

            {/* Table Rows */}
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1,
                  ease: "easeOut"
                }}
                viewport={{ once: true }}
                className={`grid grid-cols-12 md:grid-cols-12 hover:bg-gray-50 transition-colors duration-300 ${
                  index !== plans.length - 1 ? 'border-b border-gray-200' : ''
                }`}
              >
                {/* Payment Plan */}
                <div className="col-span-4 md:col-span-3 p-6 border-r border-gray-200 flex justify-center items-center">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 rounded-full bg-background text-white flex items-center justify-center text-sm font-semibold">
                      {String(plan.id).padStart(2, '0')}
                    </div>
                    <span className="text-background font-normal text-sm sm:text-[22px]">
                      {plan.paymentPlan}
                    </span>
                  </div>
                </div>

                {/* Guaranteed Return */}
                <div className="col-span-4 md:col-span-6 p-6 border-r border-gray-200 flex justify-center items-center">
                  <span className="text-2xl md:text-[40px] font-normal text-background">
                    {plan.guaranteedReturn}
                  </span>
                </div>

                {/* Return Start Date */}
                <div className="col-span-4 md:col-span-3 p-6 flex justify-center items-center">
                  <span className="text-[#01292BCC] font-medium text-sm sm:text-base leading-relaxed">
                    {plan.returnStartDate}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Call to Action */}
          {/* <motion.div 
            variants={itemVariants}
            className="text-center mt-12"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-yellow-400 hover:bg-yellow-300 text-background font-semibold px-8 py-4 rounded-full text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Learn More About Investment Plans
            </motion.button>
          </motion.div> */}
        </motion.div>
      </div>
    </section>
  )
}

export default InvestmentPlans