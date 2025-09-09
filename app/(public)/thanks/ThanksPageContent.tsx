"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle, Mail, Phone, MapPin } from "lucide-react";

export default function ThanksPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [fromPage, setFromPage] = useState<string>("");

  useEffect(() => {
    // Get the 'from' parameter to know where user came from
    const from = searchParams.get("from") || "contact";
    setFromPage(from);
  }, [searchParams]);

  const handleGoBack = () => {
    // Navigate back based on where they came from
    if (fromPage === "project") {
      router.back(); // Go back to previous page (project detail)
    } else {
      router.push("/contact-us"); // Default to contact page
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#01292B] via-[#072D2C] to-[#01292B] flex flex-col py-10 sm:py-30">
      {/* Back Button */}
      <div className="container">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          onClick={handleGoBack}
          className="flex items-center gap-2 text-white hover:text-primary transition-colors duration-300 group cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="font-josefin text-sm sm:text-base">Go Back</span>
        </motion.button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ 
            duration: 0.8,
            ease: "easeOut",
            staggerChildren: 0.2 
          }}
          className="text-center max-w-2xl mx-auto"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              delay: 0.3,
              duration: 0.6,
              type: "spring",
              stiffness: 200 
            }}
            className="mb-8"
          >
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-[#C3912F] via-[#F5E7A8] to-[#C3912F] rounded-full flex items-center justify-center mx-auto shadow-2xl">
              <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-[#01292B]" />
            </div>
          </motion.div>

          {/* Thank You Message */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <h1 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Thank You!
            </h1>
            <h2 className="font-cinzel text-xl sm:text-2xl lg:text-3xl text-primary mb-6">
              Your Enquiry Has Been Submitted Successfully
            </h2>
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="mb-8"
          >
            <p className="font-josefin text-lg sm:text-xl text-white/90 leading-relaxed mb-4">
              We appreciate your interest in our premium investment opportunities.
            </p>
            <p className="font-josefin text-base sm:text-lg text-white/80 leading-relaxed">
              Our expert team will review your enquiry and get back to you within 
              <span className="text-primary font-semibold"> 24 hours</span> with detailed information 
              tailored to your investment goals.
            </p>
          </motion.div>

          {/* Next Steps */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="bg-white/5 backdrop-blur-sm rounded-xl p-6 sm:p-8 border border-white/10"
          >
            <h3 className="font-cinzel text-xl sm:text-2xl text-white mb-6 font-semibold">
              What Happens Next?
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-josefin font-semibold text-white mb-1">
                    Email Confirmation
                  </h4>
                  <p className="font-josefin text-sm text-white/70">
                    You&apos;ll receive a confirmation email shortly
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-josefin font-semibold text-white mb-1">
                    Personal Contact
                  </h4>
                  <p className="font-josefin text-sm text-white/70">
                    Our team will call you within 24 hours
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-josefin font-semibold text-white mb-1">
                    Tailored Options
                  </h4>
                  <p className="font-josefin text-sm text-white/70">
                    Receive investment options matched to your preferences
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Additional Actions */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            className="mt-8 pt-6 border-t border-white/10"
          >
            <p className="font-josefin text-white/70 text-sm mb-4">
              Have urgent questions? Feel free to reach out directly:
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+1234567890"
                className="inline-flex items-center gap-2 px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-300 backdrop-blur-sm border border-white/20"
              >
                <Phone className="w-4 h-4" />
                <span className="font-josefin text-sm">Call Us</span>
              </a>
              <a
                href="mailto:info@yourcompany.com"
                className="inline-flex items-center gap-2 px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-300 backdrop-blur-sm border border-white/20"
              >
                <Mail className="w-4 h-4" />
                <span className="font-josefin text-sm">Email Us</span>
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}