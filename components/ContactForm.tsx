"use client";

import { motion, Variants } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ChevronDown, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux";
import {
  createEnquiry,
  resetSubmissionStatus,
} from "@/redux/slices/enquirySlice";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Validation schema
const contactFormSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name cannot exceed 100 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
  emailAddress: z
    .string()
    .email("Please enter a valid email address")
    .max(255, "Email cannot exceed 255 characters"),
  phoneNo: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.length >= 10,
      "Phone number must be at least 10 digits"
    ),
  country: z.string().min(1, "Please select your country"),
  investmentLocation: z
    .string()
    .min(1, "Please select your preferred investment location"),
  message: z
    .string()
    .max(1000, "Message cannot exceed 1000 characters")
    .optional(),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

const ContactForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { submissionStatus, error } = useSelector(
    (state: RootState) => state.enquiry
  );
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      fullName: "",
      emailAddress: "",
      phoneNo: "",
      country: "",
      investmentLocation: "Thailand (Phuket)",
      message: "",
    },
  });

  const selectedCountry = watch("country");
  const selectedInvestmentLocation = watch("investmentLocation");

  const onSubmit = async (data: ContactFormData) => {
    try {
      await dispatch(createEnquiry(data)).unwrap();

      // Reset form after successful submission
      reset();
      
      // Reset submission status
      dispatch(resetSubmissionStatus());

      // Redirect to thanks page instead of showing success message
      router.push('/thanks?from=project');
    } catch (error: any) {
      toast.error(
        error.message || "Failed to submit enquiry. Please try again."
      );
    }
  };

  const countries = [
    { value: "US", label: "United States" },
    { value: "UK", label: "United Kingdom" },
    { value: "AU", label: "Australia" },
    { value: "SG", label: "Singapore" },
    { value: "IN", label: "India" },
    { value: "TH", label: "Thailand" },
    { value: "AE", label: "United Arab Emirates" },
    { value: "CA", label: "Canada" },
    { value: "DE", label: "Germany" },
    { value: "FR", label: "France" },
    { value: "JP", label: "Japan" },
    { value: "CN", label: "China" },
  ];

  const investmentLocations = [
    { value: "Thailand (Phuket)", label: "Thailand (Phuket)" },
    { value: "Thailand (Koh Samui)", label: "Thailand (Koh Samui)" },
    { value: "Thailand (Pattaya)", label: "Thailand (Pattaya)" },
    { value: "Thailand (Bangkok)", label: "Thailand (Bangkok)" },
    { value: "Thailand (Hua Hin)", label: "Thailand (Hua Hin)" },
    { value: "Thailand (Krabi)", label: "Thailand (Krabi)" },
  ];

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
    <section className="relative w-full overflow-hidden">
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
      <div className="relative inset-0 z-10 container my-18 sm:my-30 py-15 sm:py-24 flex flex-col justify-center bg-[#01292BE5] backdrop-blur-xs h-[840px] rounded-[30px]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
          {/* Header */}
          <motion.div
            variants={itemVariants}
            className="text-center my-6 sm:my-12"
          >
            <h2 className="max-w-4xl mx-auto font-cinzel text-2xl sm:text-3xl lg:text-[50px] font-normal text-white pt-6 mb-2 sm:mt-10">
              OWN A PIECE OF{" "}
              <span className="text-primary font-bold">PARADISE IN PHUKET</span>
            </h2>
            <p className="font-josefin text-white description-text max-w-xl mx-auto">
              Is simply dummy text of the printing and typesetting industry.
              Lorem Ipsum has been the industry&apos;s standard dummy text ever
              since the 1500s.
            </p>
          </motion.div>

          {/* Contact Form */}
          <motion.form
            variants={containerVariants}
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 max-w-2xl mx-auto font-josefin"
          >
            {/* Full Name and Email Row */}
            <div className="grid grid-cols-1 gap-4">
              <motion.div variants={itemVariants}>
                <label className="block text-primary text-sm font-medium mb-2">
                  Full Name *
                </label>
                <input
                  {...register("fullName")}
                  type="text"
                  placeholder="Enter your full name"
                  className={`w-full px-4 py-3 bg-transparent border rounded-lg text-[#FFFFFFCC] placeholder-[#FFFFFF80] focus:outline-none focus:border-primary focus:ring-1 focus:ring-[#FFFFFF80] transition-all duration-300 ${
                    errors.fullName
                      ? "border-red-400 focus:border-red-400 focus:ring-red-400"
                      : "border-[#FFFFFF80]"
                  }`}
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.fullName.message}
                  </p>
                )}
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div variants={itemVariants}>
                <label className="block text-primary text-sm font-medium mb-2">
                  Email Address *
                </label>
                <input
                  {...register("emailAddress")}
                  type="email"
                  placeholder="Enter your email address"
                  className={`w-full px-4 py-3 bg-transparent border rounded-lg text-[#FFFFFFCC] placeholder-[#FFFFFF80] focus:outline-none focus:border-primary focus:ring-1 focus:ring-[#FFFFFF80] transition-all duration-300 ${
                    errors.emailAddress
                      ? "border-red-400 focus:border-red-400 focus:ring-red-400"
                      : "border-[#FFFFFF80]"
                  }`}
                />
                {errors.emailAddress && (
                  <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.emailAddress.message}
                  </p>
                )}
              </motion.div>
              {/* Phone Number */}
            <motion.div variants={itemVariants}>
              <label className="block text-primary text-sm font-medium mb-2">
                Phone Number (Optional)
              </label>
              <input
                {...register("phoneNo")}
                type="tel"
                placeholder="Enter your phone number"
                className={`w-full px-4 py-3 bg-transparent border rounded-lg text-[#FFFFFFCC] placeholder-[#FFFFFF80] focus:outline-none focus:border-primary focus:ring-1 focus:ring-[#FFFFFF80] transition-all duration-300 ${
                  errors.phoneNo
                    ? "border-red-400 focus:border-red-400 focus:ring-red-400"
                    : "border-[#FFFFFF80]"
                }`}
              />
              {errors.phoneNo && (
                <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.phoneNo.message}
                </p>
              )}
            </motion.div>
            </div>

            

            {/* Country and Investment Location Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div variants={itemVariants}>
                <label className="block text-primary text-sm font-medium mb-2">
                  Country of Residence *
                </label>
                <div className="relative">
                  <select
                    {...register("country")}
                    className={`w-full px-4 py-3 bg-transparent border rounded-lg text-[#FFFFFFCC] focus:outline-none focus:border-primary focus:ring-1 focus:ring-[#FFFFFF80] transition-all duration-300 appearance-none ${
                      errors.country
                        ? "border-red-400 focus:border-red-400 focus:ring-red-400"
                        : "border-[#FFFFFF80]"
                    }`}
                  >
                    <option value="" className="bg-background text-white">
                      Select your country
                    </option>
                    {countries.map((country) => (
                      <option
                        key={country.value}
                        value={country.value}
                        className="bg-background text-white"
                      >
                        {country.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
                {errors.country && (
                  <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.country.message}
                  </p>
                )}
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-primary text-sm font-medium mb-2">
                  Preferred Investment Location *
                </label>
                <div className="relative">
                  <select
                    {...register("investmentLocation")}
                    className={`w-full px-4 py-3 bg-transparent border rounded-lg text-[#FFFFFFCC] focus:outline-none focus:border-primary focus:ring-1 focus:ring-[#FFFFFF80] transition-all duration-300 appearance-none cursor-pointer ${
                      errors.investmentLocation
                        ? "border-red-400 focus:border-red-400 focus:ring-red-400"
                        : "border-[#FFFFFF80]"
                    }`}
                  >
                    {investmentLocations.map((location) => (
                      <option
                        key={location.value}
                        value={location.value}
                        className="bg-background text-white"
                      >
                        {location.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
                {errors.investmentLocation && (
                  <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.investmentLocation.message}
                  </p>
                )}
              </motion.div>
            </div>

            {/* Message Field */}
            <motion.div variants={itemVariants}>
              <label className="block text-primary text-sm font-medium mb-2">
                Message (Optional)
              </label>
              <textarea
                {...register("message")}
                placeholder="Tell us about your investment goals..."
                rows={3}
                className={`w-full px-4 py-3 bg-transparent border rounded-lg text-[#FFFFFFCC] placeholder-[#FFFFFF80] focus:outline-none focus:border-primary focus:ring-1 focus:ring-[#FFFFFF80] transition-all duration-300 resize-none ${
                  errors.message
                    ? "border-red-400 focus:border-red-400 focus:ring-red-400"
                    : "border-[#FFFFFF80]"
                }`}
              />
              {errors.message && (
                <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.message.message}
                </p>
              )}
            </motion.div>

            {/* Submit Button */}
            <motion.div
              variants={itemVariants}
              className="flex justify-center pt-0 sm:pt-2 pb-20"
            >
              <motion.button
                type="submit"
                disabled={isSubmitting || submissionStatus === "submitting"}
                whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
                className={`bg-gradient-to-r from-[#C3912F] via-[#F5E7A8] to-[#C3912F] hover:bg-[#CDB04E] text-background font-semibold px-12 py-2 sm:py-3 rounded-[10px] cursor-pointer text-base sm:text-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2 ${
                  isSubmitting || submissionStatus === "submitting"
                    ? "opacity-70 cursor-not-allowed"
                    : ""
                }`}
              >
                {isSubmitting || submissionStatus === "submitting" ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                  </>
                ) : (
                  "Submit"
                )}
              </motion.button>

              {/* Form submission guidelines */}
              {/* <p className="text-xs text-[#FFFFFF80] mt-4 max-w-md mx-auto">
                By submitting this form, you agree to our privacy policy and
                consent to being contacted by our team.
              </p> */}
            </motion.div>
          </motion.form>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactForm;
