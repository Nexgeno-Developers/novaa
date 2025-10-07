"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Phone, User, MapPin, Loader2, AlertCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux";
import {
  createEnquiry,
  resetSubmissionStatus,
} from "@/redux/slices/enquirySlice";
import { toast } from "sonner";
import { useNavigationRouter } from "@/hooks/useNavigationRouter";

const PopupEnquiryForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useNavigationRouter();
  const { submissionStatus, error } = useSelector(
    (state: RootState) => state.enquiry
  );

  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    location: "",
  });
  const [formErrors, setFormErrors] = useState({
    phone: "",
    location: "",
  });

  // Check if user has already submitted the popup form
  const hasSubmittedPopup = () => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("popupEnquirySubmitted") === "true";
  };

  // Mark that user has submitted the popup form
  const markPopupSubmitted = () => {
    if (typeof window === "undefined") return;
    localStorage.setItem("popupEnquirySubmitted", "true");
  };

  // Validate form
  const validateForm = () => {
    const errors = {
      phone: "",
      location: "",
    };

    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    } else {
      const phoneRegex = /^[+]?[\d\s\-\(\)]+$/;
      if (!phoneRegex.test(formData.phone)) {
        errors.phone = "Invalid phone number format";
      }
    }

    if (!formData.location.trim()) {
      errors.location = "City is required";
    }

    setFormErrors(errors);
    return !errors.phone && !errors.location;
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        fullName: formData.fullName || "Popup Enquiry",
        emailAddress: undefined,
        phoneNo: formData.phone,
        location: formData.location,
        message: "Enquiry from popup form",
        pageUrl,
      };

      // Submit enquiry using Redux
      await dispatch(createEnquiry(enquiryData)).unwrap();

      // Mark as submitted
      markPopupSubmitted();

      // Close form
      setIsVisible(false);

      // Reset submission status
      dispatch(resetSubmissionStatus());

      // Show success message
      toast.success("Thank you! We'll get back to you soon.");

      // Reset form
      setFormData({
        fullName: "",
        phone: "",
        location: "",
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
    setIsVisible(false);
  };

  // Timing logic
  useEffect(() => {
    // Don't show if user has already submitted
    if (hasSubmittedPopup()) {
      return;
    }

    // Initial popup after 10-15 seconds
    const initialTimeout = setTimeout(() => {
      setIsVisible(true);
    }, Math.random() * 5000 + 10000); // Random between 10-15 seconds

    // Set up recurring popup every 5 minutes
    const recurringInterval = setInterval(() => {
      if (!hasSubmittedPopup()) {
        setIsVisible(true);
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(recurringInterval);
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleCloseForm}
          >
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="bg-[#01292BE5] backdrop-blur-xs rounded-[30px] p-6 w-full max-w-md relative shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={handleCloseForm}
                className="cursor-pointer absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5 text-primary" />
              </button>

              {/* Header */}
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-primary mb-2 font-cinzel">
                  Get Your Dream Property
                </h3>
                <p className="text-white/80 text-sm font-josefin">
                  Fill in your details and we'll help you find the perfect home
                </p>
              </div>

              {/* Form */}
              <form
                onSubmit={handleFormSubmit}
                className="space-y-4 font-josefin text-[14px]"
              >
                {/* Name Field (Optional) */}
                <div>
                  <label className="block text-primary text-sm font-medium mb-2">
                    Name (Optional)
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-transparent border rounded-lg text-[#FFFFFFCC] placeholder-[#FFFFFF80] focus:outline-none focus:border-primary focus:ring-1 focus:ring-[#FFFFFF80] transition-all duration-300 border-[#FFFFFF80]"
                    placeholder="Enter your name"
                  />
                </div>

                {/* Phone Field (Mandatory) */}
                <div>
                  <label className="block text-primary text-sm font-medium mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-transparent border rounded-lg text-[#FFFFFFCC] placeholder-[#FFFFFF80] focus:outline-none focus:border-primary focus:ring-1 focus:ring-[#FFFFFF80] transition-all duration-300 ${
                      formErrors.phone
                        ? "border-red-400 focus:border-red-400 focus:ring-red-400"
                        : "border-[#FFFFFF80]"
                    }`}
                    placeholder="Enter your phone number"
                    required
                  />
                  {formErrors.phone && (
                    <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {formErrors.phone}
                    </p>
                  )}
                </div>

                {/* City Field (Mandatory) */}
                <div>
                  <label className="block text-primary text-sm font-medium mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-transparent border rounded-lg text-[#FFFFFFCC] placeholder-[#FFFFFF80] focus:outline-none focus:border-primary focus:ring-1 focus:ring-[#FFFFFF80] transition-all duration-300 ${
                      formErrors.location
                        ? "border-red-400 focus:border-red-400 focus:ring-red-400"
                        : "border-[#FFFFFF80]"
                    }`}
                    placeholder="Enter your city"
                    required
                  />
                  {formErrors.location && (
                    <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {formErrors.location}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex justify-center pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`bg-gradient-to-r from-[#C3912F] via-[#F5E7A8] to-[#C3912F] hover:bg-[#CDB04E] text-background font-semibold px-12 py-2 sm:py-3 rounded-[10px] cursor-pointer text-base sm:text-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2 ${
                      isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PopupEnquiryForm;
