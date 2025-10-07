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
  AlertCircle,
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
    message: "",
  });

  // Validate form
  const validateForm = () => {
    const errors = {
      fullName: "",
      phone: "",
      email: "",
      location: "",
      message: "",
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
      !errors.fullName &&
      !errors.phone &&
      !errors.email &&
      !errors.location &&
      !errors.message
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
      {/* Horizontal CTA Section */}
      <section className="py-10 sm:py-20 bg-background relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#CDB04E] rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#CDB04E] rounded-full blur-[120px]" />
        </div>

        <div className="container relative z-10 px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-8">
            {/* Left Side - Text */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-center sm:text-left max-w-[60%]"
            >
              <h2 className="text-2xl xs:text-3xl sm:text-4xl lg:text-[50px] font-cinzel  text-white mb-2">
                Get Your{" "}
                <span className="text-[#CDB04E] font-bold">
                  Personalized Price
                </span>{" "}
                Instantly!
              </h2>
            </motion.div>

            {/* Right Side - Button */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
              className="max-w-[40%]"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(true)}
                className="bg-gradient-to-r from-[#C3912F] via-[#F5E7A8] to-[#C3912F] hover:from-[#CDB04E] hover:via-[#F5E7A8] hover:to-[#CDB04E] text-background font-semibold w-full px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 group cursor-pointer font-josefin text-lg"
              >
                Contact for Prices
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>

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

              <form
                onSubmit={handleFormSubmit}
                className="space-y-4 font-josefin text-[14px]"
              >
                {/* Full Name */}
                <div>
                  <label className="text-primary block mb-1 font-normal">
                    Full Name (Optional)
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={`w-full bg-transparent border px-4 py-2 rounded text-white ${
                      formErrors.fullName
                        ? "border-red-400"
                        : "border-[rgba(255,255,255,0.8)]"
                    }`}
                    placeholder="Enter your full name"
                    required
                  />
                  {formErrors.fullName && (
                    <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {formErrors.fullName}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Phone Number (Mandatory) */}
                  <div>
                    <label className="text-primary block mb-1 font-normal">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full bg-transparent border px-4 py-2 rounded text-white ${
                        formErrors.phone
                          ? "border-red-400"
                          : "border-[rgba(255,255,255,0.8)]"
                      }`}
                      placeholder="Enter your phone number"
                      required
                    />
                    {formErrors.phone && (
                      <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {formErrors.phone}
                      </p>
                    )}
                  </div>

                  {/* Email (Optional) */}
                  <div>
                    <label className="text-primary block mb-1 font-normal">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full bg-transparent border px-4 py-2 rounded text-white ${
                        formErrors.email
                          ? "border-red-400"
                          : "border-[rgba(255,255,255,0.8)]"
                      }`}
                      placeholder="Enter your email address"
                    />
                    {formErrors.email && (
                      <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {formErrors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="text-primary block mb-1 font-normal">
                    City *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className={`w-full bg-transparent border px-4 py-2 rounded text-white ${
                      formErrors.location
                        ? "border-red-400"
                        : "border-[rgba(255,255,255,0.8)]"
                    }`}
                    placeholder="Enter your city"
                    required
                  />
                  {formErrors.location && (
                    <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {formErrors.location}
                    </p>
                  )}
                </div>

                {/* Message (Optional) */}
                <div>
                  <label className="text-primary block mb-1 font-normal">
                    Description (Optional)
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={3}
                    className={`w-full bg-transparent border px-4 py-2 rounded min-h-[96px] text-white ${
                      formErrors.message
                        ? "border-red-400"
                        : "border-[rgba(255,255,255,0.8)]"
                    }`}
                    placeholder="Tell us about your requirements..."
                  />
                </div>

                {/* Submit Button */}
                <div className="flex justify-center items-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-[132px] h-[40px] rounded-[10px] border border-[#233C30] bg-gradient-to-br from-[#C3912F] via-[#F5E7A8] to-[#C3912F] hover:bg-[#d8bc59] text-[#01292B] font-josefin font-semibold text-[14px] leading-[100%] text-center cursor-pointer flex items-center justify-center gap-2 transition-all duration-300 ${
                      isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit"
                    )}
                  </button>
                </div>
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
