"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DollarSign,
  X,
  User,
  Phone,
  MapPin,
  Mail,
  MessageSquare,
  Loader2,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux";
import {
  createEnquiry,
  resetSubmissionStatus,
} from "@/redux/slices/enquirySlice";
import { toast } from "sonner";
import { useNavigationRouter } from "@/hooks/useNavigationRouter";

const PriceEnquiryCTA = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useNavigationRouter();
  const { submissionStatus, error } = useSelector(
    (state: RootState) => state.enquiry
  );

  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    location: "",
    message: "",
  });
  const [formErrors, setFormErrors] = useState({
    fullName: "",
    phone: "",
    email: "",
    location: "",
  });

  // Validate form
  const validateForm = () => {
    const errors = {
      fullName: "",
      phone: "",
      email: "",
      location: "",
    };

    if (!formData.fullName.trim()) {
      errors.fullName = "Full name is required";
    }

    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    } else {
      const phoneRegex = /^[+]?[\d\s\-\(\)]+$/;
      if (!phoneRegex.test(formData.phone)) {
        errors.phone = "Invalid phone number format";
      }
    }

    if (formData.email && formData.email.trim() !== "") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        errors.email = "Invalid email address format";
      }
    }

    if (!formData.location.trim()) {
      errors.location = "Location is required";
    }

    setFormErrors(errors);
    return (
      !errors.fullName && !errors.phone && !errors.email && !errors.location
    );
  };

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Handle form submission
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);

      // Get current page URL
      const pageUrl = window.location.href;

      // Prepare enquiry data
      const enquiryData = {
        fullName: formData.fullName,
        emailAddress: formData.email || undefined,
        phoneNo: formData.phone,
        location: formData.location,
        message: formData.message || "Price enquiry from floating CTA",
        pageUrl,
      };

      // Submit enquiry using Redux
      await dispatch(createEnquiry(enquiryData)).unwrap();

      // Close form
      setIsOpen(false);

      // Reset submission status
      dispatch(resetSubmissionStatus());

      // Show success message
      toast.success(
        "Thank you! We'll get back to you with pricing details soon."
      );

      // Reset form
      setFormData({
        fullName: "",
        phone: "",
        email: "",
        location: "",
        message: "",
      });
    } catch (error: any) {
      console.error("Enquiry submission error:", error);
      toast.error(
        error.message || "Failed to submit enquiry. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle close form
  const handleCloseForm = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating CTA Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-40 bg-gradient-to-r from-[#C3912F] via-[#F5E7A8] to-[#C3912F] hover:from-[#CDB04E] hover:via-[#F5E7A8] hover:to-[#CDB04E] text-background font-semibold px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2 group cursor-pointer"
      >
        <DollarSign className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
        <span className="hidden sm:block font-josefin text-sm">
          For Prices, Please Contact Us
        </span>
        <span className="sm:hidden font-josefin text-sm">Prices</span>
      </motion.button>

      {/* Popup Form Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleCloseForm}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-[#01292B] border border-[#CDB04E]/30 rounded-lg p-6 sm:p-8 max-w-xl w-full relative shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleCloseForm}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="text-center mb-6">
                {/* <div className="w-16 h-16 bg-gradient-to-r from-[#C3912F] via-[#F5E7A8] to-[#C3912F] rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-8 h-8 text-background" />
                </div> */}
                <h3 className="text-2xl font-cinzel font-bold text-primary mb-2 cursor-pointer">
                  Get Pricing Information
                </h3>
                <p className="text-gray-300 font-josefin text-sm">
                  Fill in your details to receive pricing information and get
                  more details about our properties
                </p>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Full Name Field */}
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Full Name (Optional)
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-3 bg-transparent border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all ${
                          formErrors.fullName
                            ? "border-red-500"
                            : "border-[#FFFFFF80]"
                        }`}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    {formErrors.fullName && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.fullName}
                      </p>
                    )}
                  </div>

                  {/* Phone Field */}
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-3 bg-transparent border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all ${
                          formErrors.phone
                            ? "border-red-500"
                            : "border-[#FFFFFF80]"
                        }`}
                        placeholder="Enter your phone number"
                        required
                      />
                    </div>
                    {formErrors.phone && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.phone}
                      </p>
                    )}
                  </div>
                </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                 {/* Email Field */}
                 <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Email Address (Optional)
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 bg-transparent border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all ${
                        formErrors.email
                          ? "border-red-500"
                          : "border-[#FFFFFF80]"
                      }`}
                      placeholder="Enter your email address"
                    />
                  </div>
                  {formErrors.email && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.email}
                    </p>
                  )}
                </div>

                {/* Location Field */}
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    City *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 bg-transparent border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all ${
                        formErrors.location
                          ? "border-red-500"
                          : "border-[#FFFFFF80]"
                      }`}
                      placeholder="Enter your city"
                      required
                    />
                  </div>
                  {formErrors.location && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.location}
                    </p>
                  )}
                </div>
                </div>

                {/* Message Field */}
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Description (Optional)
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full pl-10 pr-4 py-3 bg-transparent border border-[#FFFFFF80] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
                      placeholder="Tell us about your requirements..."
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-[#C3912F] via-[#F5E7A8] to-[#C3912F] hover:from-[#CDB04E] hover:via-[#F5E7A8] hover:to-[#CDB04E] text-background font-semibold py-3 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <DollarSign className="w-4 h-4" />
                      Get Pricing Information
                    </>
                  )}
                </motion.button>
              </form>

              {/* Footer */}
              <p className="text-xs text-gray-500 text-center mt-4">
                By submitting this form, you agree to our privacy policy
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PriceEnquiryCTA;
