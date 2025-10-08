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
      <section
        className="py-10 sm:py-20 relative overflow-hidden"
        style={{
          background: `url('https://images.pexels.com/photos/1004366/pexels-photo-1004366.jpeg')`,
          backgroundSize: "cover",
          backgroundPosition: "bottom",
          backgroundRepeat: "no-repeat",
        }}
      >

         {/* Color Overlay */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{ backgroundColor: "#01292BCC" }}
      />
        {/* Background Elements */}
        {/* <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#CDB04E] rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#CDB04E] rounded-full blur-[120px]" />
        </div> */}



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
              className=" sm:max-w-[40%] cursor-pointer"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(true)}
                className="bg-gradient-to-r from-[#C3912F] via-[#F5E7A8] to-[#C3912F] hover:from-[#CDB04E] hover:via-[#F5E7A8] hover:to-[#CDB04E] text-background font-semibold w-full px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 group font-josefin text-lg cursor-pointer"
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={handleCloseForm}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-[#01292BE5] backdrop-blur-xs rounded-[30px] p-4 sm:p-6 md:p-8 max-w-xl w-full relative shadow-2xl max-h-[90vh] overflow-y-auto my-4"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleCloseForm}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="text-center mb-4 sm:mb-6">
                <h3 className="text-xl sm:text-2xl font-cinzel font-bold text-primary mb-2 cursor-pointer">
                  Get Pricing Information
                </h3>
                <p className="text-gray-300 font-josefin text-xs sm:text-sm">
                  Fill in your details to receive pricing information and get
                  more details about our properties
                </p>
              </div>

              <form
                onSubmit={handleFormSubmit}
                className="space-y-3 sm:space-y-4 font-josefin text-[14px]"
              >
                {/* Full Name */}
                <div>
                  <label className="block text-primary text-sm font-medium mb-2">
                    Full Name (Optional)
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-transparent border rounded-lg text-[#FFFFFFCC] placeholder-[#FFFFFF80] focus:outline-none focus:border-primary focus:ring-1 focus:ring-[#FFFFFF80] transition-all duration-300 border-[#FFFFFF80]"
                    placeholder="Enter your full name"
                    required
                  />
                  {formErrors.fullName && (
                    <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {formErrors.fullName}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Phone Number (Mandatory) */}
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

                  {/* Email (Optional) */}
                  <div>
                    <label className="block text-primary text-sm font-medium mb-2">
                      Email Address (Optional)
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
                      placeholder="Enter your email address"
                    />
                    {formErrors.email && (
                      <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {formErrors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Location */}
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

                {/* Message (Optional) */}
                <div>
                  <label className="block text-primary text-sm font-medium mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 bg-transparent border rounded-lg text-[#FFFFFFCC] placeholder-[#FFFFFF80] focus:outline-none focus:border-primary focus:ring-1 focus:ring-[#FFFFFF80] transition-all duration-300 resize-none border-[#FFFFFF80]"
                    placeholder="Tell us about your requirements..."
                  />
                </div>

                {/* Submit Button */}
                <div className="flex justify-center pt-1 sm:pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`bg-gradient-to-r from-[#C3912F] via-[#F5E7A8] to-[#C3912F] hover:bg-[#CDB04E] text-background font-semibold px-8 sm:px-12 py-2 sm:py-3 rounded-[10px] cursor-pointer text-sm sm:text-base md:text-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2 ${
                      isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
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
        )}
      </AnimatePresence>
    </>
  );
};

export default PriceEnquiryCTA;
