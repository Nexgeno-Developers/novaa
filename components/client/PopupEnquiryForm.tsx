"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Phone, User, MapPin, Loader2, AlertCircle, Mail, MessageSquare } from "lucide-react";
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
    email: "",
    phone: "",
    location: "",
    description: "",
  });
  const [formErrors, setFormErrors] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    description: "",
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
      fullName: "",
      email: "",
      phone: "",
      location: "",
      description: "",
    };

    // Name validation (required, letters only, max 20)
    if (!formData.fullName.trim()) {
      errors.fullName = "Name is required";
    } else if (!/^[a-zA-Z\s]+$/.test(formData.fullName)) {
      errors.fullName = "Name can only contain letters";
    } else if (formData.fullName.length > 20) {
      errors.fullName = "Name cannot exceed 20 characters";
    }

    // Email validation (optional, but if provided must be valid)
    if (formData.email.trim()) {
      const emailRegex = /^[a-zA-Z0-9@\-_.]+@[a-zA-Z0-9@\-_.]+\.[a-zA-Z0-9@\-_.]+$/;
      if (!emailRegex.test(formData.email)) {
        errors.email = "Please enter a valid email address";
      }
    }

    // Phone validation (required, numbers only, max 15)
    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^\d+$/.test(formData.phone)) {
      errors.phone = "Phone number can only contain numbers";
    } else if (formData.phone.length > 15) {
      errors.phone = "Phone number cannot exceed 15 digits";
    }

    // Location validation (required, allowed chars, max 50)
    if (!formData.location.trim()) {
      errors.location = "Location is required";
    } else if (!/^[a-zA-Z0-9\s.,\-]+$/.test(formData.location)) {
      errors.location = "Location contains invalid characters";
    } else if (formData.location.length > 50) {
      errors.location = "Location cannot exceed 50 characters";
    }

    // Description validation (optional, letters only, max 200)
    if (formData.description.trim() && !/^[a-zA-Z\s]+$/.test(formData.description)) {
      errors.description = "Description can only contain letters";
    } else if (formData.description.length > 200) {
      errors.description = "Description cannot exceed 200 characters";
    }

    setFormErrors(errors);
    return !errors.fullName && !errors.email && !errors.phone && !errors.location && !errors.description;
  };

  // Input filtering functions
  const filterName = (value: string) => {
    // Only letters and spaces, max 20 characters
    return value.replace(/[^a-zA-Z\s]/g, "").slice(0, 20);
  };

  const filterPhone = (value: string) => {
    // Only numbers, max 15 characters
    return value.replace(/\D/g, "").slice(0, 15);
  };

  const filterEmail = (value: string) => {
    // Only @, -, _, and alphanumeric characters
    return value.replace(/[^a-zA-Z0-9@\-_.]/g, "");
  };

  const filterLocation = (value: string) => {
    // Only letters, numbers, spaces, and basic punctuation (.,-), max 50 characters
    // Exclude: #$%^&*() etc
    return value.replace(/[^a-zA-Z0-9\s.,\-]/g, "").slice(0, 50);
  };

  const filterDescription = (value: string) => {
    // Only letters and spaces, max 200 characters
    return value.replace(/[^a-zA-Z\s]/g, "").slice(0, 200);
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    let filteredValue = value;
    
    // Apply filters based on field name
    if (name === "fullName") {
      filteredValue = filterName(value);
    } else if (name === "phone") {
      filteredValue = filterPhone(value);
    } else if (name === "email") {
      filteredValue = filterEmail(value);
    } else if (name === "location") {
      filteredValue = filterLocation(value);
    } else if (name === "description") {
      filteredValue = filterDescription(value);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: filteredValue,
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
        message: formData.description || "Enquiry from popup form",
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
        email: "",
        phone: "",
        location: "",
        description: "",
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto lg:pt-[30px] pt-[220px]"
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
                aria-label="Close enquiry form"
              >
                <X className="w-5 h-5 text-primary" aria-hidden="true" />
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
                {/* Name Field (Required) */}
                <div>
                  <label className="block text-primary text-sm font-medium mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    maxLength={20}
                    className={`w-full px-4 py-3 bg-transparent border rounded-lg text-[#FFFFFFCC] placeholder-[#FFFFFF80] focus:outline-none focus:border-primary focus:ring-1 focus:ring-[#FFFFFF80] transition-all duration-300 ${
                      formErrors.fullName
                        ? "border-red-400 focus:border-red-400 focus:ring-red-400"
                        : "border-[#FFFFFF80]"
                    }`}
                    placeholder="Enter your name"
                    required
                  />
                  {formErrors.fullName && (
                    <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {formErrors.fullName}
                    </p>
                  )}
                </div>

                {/* Email Field (Optional) */}
                <div>
                  <label className="block text-primary text-sm font-medium mb-2">
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-transparent border rounded-lg text-[#FFFFFFCC] placeholder-[#FFFFFF80] focus:outline-none focus:border-primary focus:ring-1 focus:ring-[#FFFFFF80] transition-all duration-300 ${
                      formErrors.email
                        ? "border-red-400 focus:border-red-400 focus:ring-red-400"
                        : "border-[#FFFFFF80]"
                    }`}
                    placeholder="Enter your email"
                  />
                  {formErrors.email && (
                    <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {formErrors.email}
                    </p>
                  )}
                </div>

                {/* Phone Field (Required) */}

                <div className="flex justify-between">
                     <div>
                  <label className="block text-primary text-sm font-medium mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    maxLength={15}
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

                {/* Location Field (Required) */}
                <div>
                  <label className="block text-primary text-sm font-medium mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    maxLength={50}
                    className={`w-full px-4 py-3 bg-transparent border rounded-lg text-[#FFFFFFCC] placeholder-[#FFFFFF80] focus:outline-none focus:border-primary focus:ring-1 focus:ring-[#FFFFFF80] transition-all duration-300 ${
                      formErrors.location
                        ? "border-red-400 focus:border-red-400 focus:ring-red-400"
                        : "border-[#FFFFFF80]"
                    }`}
                    placeholder="Enter your location"
                    required
                  />
                  {formErrors.location && (
                    <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {formErrors.location}
                    </p>
                  )}
                </div>
                </div>
                

                {/* Description Field (Optional) */}
                <div>
                  <label className="block text-primary text-sm font-medium mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    maxLength={200}
                    className="w-full px-4 py-3 bg-transparent border rounded-lg text-[#FFFFFFCC] placeholder-[#FFFFFF80] focus:outline-none focus:border-primary focus:ring-1 focus:ring-[#FFFFFF80] transition-all duration-300 resize-none border-[#FFFFFF80]"
                    placeholder="Enter your message or description"
                  />
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
