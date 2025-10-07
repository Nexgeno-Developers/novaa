// "use client";

// import Image from "next/image";
// import { motion } from "framer-motion";
// import { ArrowRight, Divide, Star } from "lucide-react";
// import parse from "html-react-parser";

// interface ProjectHeroSectionProps {
//   project: {
//     name: string;
//     projectDetail?: {
//       hero?: {
//         backgroundImage?: string;
//         title?: string;
//         subtitle?: string;
//         scheduleMeetingButton?: string;
//         getBrochureButton?: string;
//         brochurePdf?: string;
//       };
//     };
//   };
// }

// const ProjectHeroSection: React.FC<ProjectHeroSectionProps> = ({ project }) => {
//   const heroData = project.projectDetail?.hero;

//   const backgroundImage =
//     heroData?.backgroundImage || "/images/project-details-hero.jpg";
//   const title = heroData?.title || project.name;
//   const subtitle = heroData?.subtitle || "A Resort-Inspired Lifestyle";
//   const scheduleMeetingText =
//     heroData?.scheduleMeetingButton || "Schedule a meeting";
//   const getBrochureText = heroData?.getBrochureButton || "Get Brochure";
//   const brochurePdf = heroData?.brochurePdf;

//   const handleBrochureDownload = () => {
//     if (brochurePdf) {
//       // Create a temporary link and trigger download
//       const link = document.createElement("a");
//       link.href = brochurePdf;
//       link.download = `${project.name}-Brochure.pdf`;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     } else {
//       console.log("No brochure PDF available");
//     }
//   };

//   const handleScheduleMeeting = () => {
//     // You can integrate with Calendly or any scheduling service here
//     // For now, just logging
//     console.log("Schedule meeting clicked");
//     // Example Calendly integration:
//     // window.open('https://calendly.com/your-calendly-link', '_blank');
//   };

//   return (
//     <section className="relative h-screen overflow-hidden bg-background">
//       {/* Background Image - Full Width */}
//       <Image
//         src={backgroundImage}
//         alt="project details background"
//         fill
//         priority
//         className="object-cover"
//       />

//       {/* Dark overlay */}
//       <div className="absolute bottom-0 w-full h-1/2 inset-x-0 z-0 bg-gradient-to-b from-bg-[#01292B00] to-[#01292B]" />

//       {/* Content Container - Constrained to container width */}
//       <div className="container relative h-full z-10">
//         <div className="relative h-full flex flex-col justify-end mt-10">
//           {/* Text Content */}
//           <div className="font-cinzel text-primary pb-5 sm:pb-0">
//             <motion.h2
//               initial={{ opacity: 0, y: 40 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 1 }}
//               className="text-[40px] xs:text-[50px] sm:text-[60px] leading-[100%] tracking-[0%] font-cinzel font-bold"
//             >
//               {title && <div>{parse(title)}</div>}
//             </motion.h2>
//             <motion.h3
//               initial={{ opacity: 0, y: 40 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 1 }}
//               className="flex items-center description-text gap-4 font-josefin font-light text-white mt-2 pl-1"
//             >
//               {subtitle && <div>{parse(subtitle)}</div>}
//             </motion.h3>
//           </div>

//           {/* Buttons Container */}
//           <div className="flex justify-start lg:justify-end gap-4 mb-20 pt-0 sm:pt-5 xl:pt-0">
//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={handleScheduleMeeting}
//               className="inline-flex bg-gradient-to-r from-[#C3912F] via-[#F5E7A8] to-[#C3912F] hover:bg-[#CDB04E] font-josefin items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-md text-background font-semibold shadow-lg cursor-pointer transition-all duration-300 text-xs sm:text-base"
//             >
//               {parse(scheduleMeetingText)}
//               <ArrowRight className="w-5 h-5" />
//             </motion.button>
//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={handleBrochureDownload}
//               className="inline-flex font-josefin items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-md border-[#CDB04E99] bg-[#CDB04E1A] text-primary font-semibold shadow-lg cursor-pointer transition-all duration-300 text-xs sm:text-base"
//             >
//               {parse(getBrochureText)}
//               <ArrowRight className="w-5 h-5" />
//             </motion.button>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default ProjectHeroSection;
"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, X, AlertCircle, Loader2 } from "lucide-react";
import parse from "html-react-parser";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux";
import {
  createEnquiry,
  resetSubmissionStatus,
} from "@/redux/slices/enquirySlice";
import { toast } from "sonner";
import { useNavigationRouter } from "@/hooks/useNavigationRouter";

interface ProjectHeroSectionProps {
  project: {
    name: string;
    projectDetail?: {
      hero?: {
        backgroundImage?: string;
        mediaType?: "image" | "video";
        title?: string;
        subtitle?: string;
        scheduleMeetingButton?: string;
        getBrochureButton?: string;
        brochurePdf?: string;
      };
    };
  };
}

const ProjectHeroSection: React.FC<ProjectHeroSectionProps> = ({ project }) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useNavigationRouter();
  const { submissionStatus, error } = useSelector(
    (state: RootState) => state.enquiry
  );

  const [showBrochureForm, setShowBrochureForm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    message: "",
  });
  const [showNotification, setShowNotification] = useState(false);
  const [formErrors, setFormErrors] = useState({
    fullName: "",
    phone: "",
    email: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const heroData = project.projectDetail?.hero;

  const backgroundImage =
    heroData?.backgroundImage || "/images/project-details-hero.jpg";

  // Auto-detect media type if not set, fallback to explicit mediaType
  const isVideoUrl =
    backgroundImage.includes(".mp4") ||
    backgroundImage.includes(".webm") ||
    backgroundImage.includes(".mov") ||
    backgroundImage.includes("video/upload");
  const mediaType = heroData?.mediaType || (isVideoUrl ? "video" : "image");

  const title = heroData?.title || project.name;
  const subtitle = heroData?.subtitle || "A Resort-Inspired Lifestyle";
  const scheduleMeetingText =
    heroData?.scheduleMeetingButton || "Schedule a meeting";
  const getBrochureText = heroData?.getBrochureButton || "Get Brochure";
  const brochurePdf = heroData?.brochurePdf;

  const validateForm = () => {
    const errors = {
      fullName: "",
      phone: "",
      email: "",
    };

    // Full name validation (mandatory)
    if (!formData.fullName.trim()) {
      errors.fullName = "Full name is required";
    } else if (formData.fullName.trim().length < 2) {
      errors.fullName = "Full name must be at least 2 characters";
    } else if (!/^[a-zA-Z\s]+$/.test(formData.fullName)) {
      errors.fullName = "Name can only contain letters and spaces";
    }

    // Phone validation (mandatory)
    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^[0-9+\-\s()]{10,}$/.test(formData.phone)) {
      errors.phone = "Please enter a valid phone number";
    }

    // Email validation (optional, but if provided must be valid)
    if (
      formData.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      errors.email = "Please enter a valid email address";
    }

    setFormErrors(errors);
    return !errors.fullName && !errors.phone && !errors.email;
  };

  const handleBrochureClick = () => {
    setShowBrochureForm(true);
  };

  const handleCloseForm = () => {
    setShowBrochureForm(false);
    setFormData({ fullName: "", phone: "", email: "", message: "" });
    setFormErrors({ fullName: "", phone: "", email: "" });
    dispatch(resetSubmissionStatus());
  };

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

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);

      // Get current page URL
      const pageUrl = window.location.href;

      // Prepare enquiry data with project title as location
      const enquiryData = {
        fullName: formData.fullName,
        emailAddress: formData.email || undefined,
        phoneNo: formData.phone,
        location: project.name, // Use project title as location
        message: formData.message,
        pageUrl,
      };

      // Submit enquiry using Redux
      await dispatch(createEnquiry(enquiryData)).unwrap();

      // Download the brochure
      // if (brochurePdf) {
      //   const link = document.createElement("a");
      //   link.href = brochurePdf;
      //   link.download = `${project.name}-Brochure.pdf`;
      //   document.body.appendChild(link);
      //   link.click();
      //   document.body.removeChild(link);
      // }

      // Close form
      handleCloseForm();

      // Reset submission status
      dispatch(resetSubmissionStatus());

      // Redirect to thanks page
      router.push("/thanks?from=project");
    } catch (error: any) {
      console.error("Enquiry submission error:", error);
      toast.error(
        error.message || "Failed to submit enquiry. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleScheduleMeeting = () => {
    console.log("Schedule meeting clicked");
  };

  return (
    <section className="relative h-screen overflow-hidden bg-background">
      {/* Background Media */}
      {mediaType === "video" ? (
        <video
          src={backgroundImage}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <Image
          src={backgroundImage}
          alt="project details background"
          fill
          priority
          className="object-cover"
        />
      )}

      {/* Dark overlay */}
      <div className="absolute bottom-0 w-full h-1/2 inset-x-0 z-0 bg-gradient-to-b from-bg-[#01292B00] to-[#01292B]" />

      {/* Content Container */}
      <div className="container relative h-full z-10">
        <div className="relative h-full flex flex-col justify-end mt-10">
          {/* Text Content */}
          <div className="font-cinzel text-primary pb-5 sm:pb-0">
            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-[40px] xs:text-[50px] sm:text-[60px] leading-[100%] tracking-[0%] font-cinzel font-bold"
            >
              {title && <div>{parse(title)}</div>}
            </motion.h2>
            <motion.h3
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="flex items-center description-text gap-4 font-josefin font-light text-white mt-2 pl-1"
            >
              {subtitle && <div>{parse(subtitle)}</div>}
            </motion.h3>
          </div>

          {/* Buttons Container */}
          <div className="flex justify-start lg:justify-end gap-4 mb-20 pt-0 sm:pt-5 xl:pt-0">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleScheduleMeeting}
              className="inline-flex bg-gradient-to-r from-[#C3912F] via-[#F5E7A8] to-[#C3912F] hover:bg-[#CDB04E] font-josefin items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-md text-background font-semibold shadow-lg cursor-pointer transition-all duration-300 text-xs sm:text-base"
            >
              {parse(scheduleMeetingText)}
              <ArrowRight className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBrochureClick}
              className="border border-[#CDB04E99] inline-flex font-josefin items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-md bg-[#CDB04E1A] text-primary font-semibold shadow-lg cursor-pointer transition-all duration-300 text-xs sm:text-base"
            >
              {parse(getBrochureText)}
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Brochure Form Modal */}
      <AnimatePresence>
        {showBrochureForm && (
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
              className="bg-[#01292B] border border-[#CDB04E]/30 rounded-lg p-6 sm:p-8 max-w-md w-full relative shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleCloseForm}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>

              <h3 className="text-2xl font-cinzel font-bold text-primary mb-2">
                Enquire Now
              </h3>
              <p className="text-gray-300 font-josefin mb-6 text-sm">
                Fill in your details to receive the brochure and get more
                information about this project
              </p>

              <form
                onSubmit={handleFormSubmit}
                className="space-y-4 font-josefin text-[14px]"
              >
                {/* Full Name Field */}
                <div>
                  <label className="text-primary block mb-1 font-normal">
                    Full Name (Optional)
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className={`w-full bg-transparent border px-4 py-2 rounded text-white ${
                      formErrors.fullName
                        ? "border-red-400"
                        : "border-[rgba(255,255,255,0.8)]"
                    }`}
                  />
                  {formErrors.fullName && (
                    <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {formErrors.fullName}
                    </p>
                  )}
                </div>

                {/* Phone Number Field */}
                <div>
                  <label className="text-primary block mb-1 font-normal">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                    className={`w-full bg-transparent border px-4 py-2 rounded text-white ${
                      formErrors.phone
                        ? "border-red-400"
                        : "border-[rgba(255,255,255,0.8)]"
                    }`}
                  />
                  {formErrors.phone && (
                    <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {formErrors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-primary block mb-1 font-normal">
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    className={`w-full bg-transparent border px-4 py-2 rounded text-white ${
                      formErrors.email
                        ? "border-red-400"
                        : "border-[rgba(255,255,255,0.8)]"
                    }`}
                  />
                  {formErrors.email && (
                    <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {formErrors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-primary block mb-1 font-normal">
                    Description (Optional)
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Any specific requirements or questions?"
                    rows={3}
                    className="w-full bg-transparent border px-4 py-2 rounded min-h-[96px] text-white"
                  />
                </div>

                {/* Submit Button */}
                <div className="flex justify-center items-center">
                  <button
                    type="submit"
                    disabled={isSubmitting || submissionStatus === "submitting"}
                    className={`w-[132px] h-[40px] rounded-[10px] border border-[#233C30] bg-gradient-to-br from-[#C3912F] via-[#F5E7A8] to-[#C3912F] hover:bg-[#d8bc59] text-[#01292B] font-josefin font-semibold text-[14px] leading-[100%] text-center cursor-pointer flex items-center justify-center gap-2 transition-all duration-300 ${
                      isSubmitting || submissionStatus === "submitting"
                        ? "opacity-70 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {isSubmitting || submissionStatus === "submitting" ? (
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Notification */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 right-4 z-50 bg-gradient-to-r from-[#C3912F] to-[#CDB04E] text-background px-6 py-4 rounded-lg shadow-2xl max-w-sm"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <p className="font-josefin font-semibold">Success!</p>
                <p className="text-sm font-josefin mt-1">
                  Brochure will be sent to you on WhatsApp shortly.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ProjectHeroSection;
