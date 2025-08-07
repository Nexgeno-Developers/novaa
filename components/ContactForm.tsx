"use client";

import { motion, Variants } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    emailAddress: "",
    country: "",
    investmentLocation: "Thailand (Phuket)",
    message: "",
  });

  const handleInputChange = (e  : React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e : React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Handle form submission logic here
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 30,
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
    <section className="relative h-[885px] w-full overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/images/ContactFormBackground.jpg')`,
        }}
      />

      {/* Color Overlay */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{ backgroundColor: "#01292B33" }}
      />

      {/* Top to Bottom Gradient */}
      <div className="absolute top-0 w-full h-1/3 bg-gradient-to-b from-[#01292B] to-[#01292B00]" />

      {/* Bottom to Top Gradient */}
      <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-[#01292B] to-[#01292B00]" />

      {/* Content Container */}
      <div className="relative inset-0 z-10 container my-18 sm:my-34 py-15 sm:py-30 flex flex-col justify-center bg-[#01292BE5] backdrop-blur-xs h-[640px] rounded-[30px]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center my-12">
            <h2 className="max-w-4xl mx-auto font-cinzel text-2xl md:text-3xl lg:text-[40px] font-normal text-white mb-6">
              OWN A PIECE OF{" "}
              <span className="text-primary font-bold">PARADISE IN PHUKET</span>
            </h2>
            <p className="font-josefin text-white font-light text-sm md:text-base leading-relaxed max-w-xl mx-auto">
              Is simply dummy text of the printing and typesetting industry.
              Lorem Ipsum has been the industry&apos;s standard dummy text ever since
              the 1500s.
            </p>
          </motion.div>

          {/* Contact Form */}
          <motion.form
            variants={containerVariants}
            onSubmit={handleSubmit}
            className="space-y-4 max-w-2xl mx-auto"
          >
            {/* Full Name and Email Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div variants={itemVariants}>
                <label className="block text-primary text-sm font-medium mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 bg-transparent border border-[#FFFFFF80] rounded-lg text-[#FFFFFFCC] placeholder-[#FFFFFF80] focus:outline-none focus:border-primary focus:ring-1 focus:ring-[#FFFFFF80] transition-all duration-300"
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-primary text-sm font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="emailAddress"
                  value={formData.emailAddress}
                  onChange={handleInputChange}
                  placeholder="Enter your email address"
                  className="w-full px-4 py-3 bg-transparent border border-[#FFFFFF80] rounded-lg text-[#FFFFFFCC] placeholder-[#FFFFFF80] focus:outline-none focus:border-primary focus:ring-1 focus:ring-[#FFFFFF80] transition-all duration-300"
                />
              </motion.div>
            </div>

            {/* Country and Investment Location Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div variants={itemVariants}>
                <label className="block text-primary text-sm font-medium mb-2">
                  Country of Residence
                </label>
                <div className="relative">
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-transparent border border-[#FFFFFF80] rounded-lg text-[#FFFFFFCC] placeholder-[#FFFFFF80] focus:outline-none focus:border-primary focus:ring-1 focus:ring-[#FFFFFF80] transition-all duration-300 appearance-none"
                  >
                    <option value="" className="bg-background text-white">
                      Select your country
                    </option>
                    <option value="US" className="bg-background text-white">
                      United States
                    </option>
                    <option value="UK" className="bg-background text-white">
                      United Kingdom
                    </option>
                    <option value="AU" className="bg-background text-white">
                      Australia
                    </option>
                    <option value="SG" className="bg-background text-white">
                      Singapore
                    </option>
                    <option value="IN" className="bg-background text-white">
                      India
                    </option>
                    <option value="TH" className="bg-background text-white">
                      Thailand
                    </option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-primary text-sm font-medium mb-2">
                  Preferred Investment Location
                </label>
                <div className="relative">
                  <select
                    name="investmentLocation"
                    value={formData.investmentLocation}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-transparent border border-[#FFFFFF80] rounded-lg text-[#FFFFFFCC] placeholder-[#FFFFFF80] focus:outline-none focus:border-primary focus:ring-1 focus:ring-[#FFFFFF80] transition-all duration-300 appearance-none cursor-pointer"
                  >
                    <option
                      value="Thailand (Phuket)"
                      className="bg-background text-white"
                    >
                      Thailand (Phuket)
                    </option>
                    <option
                      value="Thailand (Koh Samui)"
                      className="bg-background text-white"
                    >
                      Thailand (Koh Samui)
                    </option>
                    <option
                      value="Thailand (Pattaya)"
                      className="bg-background text-white"
                    >
                      Thailand (Pattaya)
                    </option>
                    <option
                      value="Thailand (Bangkok)"
                      className="bg-background text-white"
                    >
                      Thailand (Bangkok)
                    </option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </motion.div>
            </div>

            {/* Message Field */}
            <motion.div variants={itemVariants}>
              <label className="block text-primary text-sm font-medium mb-2">
                Message (Optional)
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Tell us about investment goals..."
                rows={1}
                className="w-full px-4 py-3 bg-transparent border border-[#FFFFFF80] rounded-lg text-[#FFFFFFCC] placeholder-[#FFFFFF80] focus:outline-none focus:border-primary focus:ring-1 focus:ring-[#FFFFFF80] transition-all duration-300 resize-none"
              />
            </motion.div>

            {/* Submit Button */}
            <motion.div variants={itemVariants} className="text-center pt-6">
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-[#C3912F] via-[#F5E7A8] to-[#C3912F] hover:bg-[#CDB04E] text-background font-semibold px-12 py-3 rounded-[10px] cursor-pointer text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Submit
              </motion.button>
            </motion.div>
          </motion.form>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactForm;
