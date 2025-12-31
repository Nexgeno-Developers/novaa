"use client";

import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux";
import {
  createEnquiry,
  resetSubmissionStatus,
} from "@/redux/slices/enquirySlice";
import { toast } from "sonner";
import { Loader2, AlertCircle, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { useNavigationRouter } from "@/hooks/useNavigationRouter";
import parse from "html-react-parser";

interface ContactDetail {
  _id?: string;
  icon: string;
  title: string;
  description: string;
}

interface ContactSectionProps {
  details?: ContactDetail[];
  formTitle?: string;
  formDescription?: string;
  mapImage?: string;
  [key: string]: unknown;
}

// Updated validation schema
const contactFormSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full name is required")
    .max(20, "Full name cannot exceed 20 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
  emailAddress: z
    .string()
    .regex(/^[a-zA-Z0-9@\-_.]+@[a-zA-Z0-9@\-_.]+\.[a-zA-Z0-9@\-_.]+$/, "Please enter a valid email address")
    .optional()
    .or(z.literal("")),
  phoneNo: z
    .string()
    .min(1, "Phone number is required")
    .max(15, "Phone number cannot exceed 15 digits")
    .regex(/^\d+$/, "Phone number can only contain numbers"),
  location: z
    .string()
    .min(1, "Please select your location")
    .max(50, "Location cannot exceed 50 characters")
    .regex(/^[a-zA-Z0-9\s.,\-]+$/, "Location contains invalid characters"),
  message: z
    .string()
    .max(200, "Message cannot exceed 200 characters")
    .regex(/^[a-zA-Z\s]*$/, "Message can only contain letters")
    .optional()
    .or(z.literal("")),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

// Helper function to parse addresses - split by line breaks
const parseAddresses = (addressString: string) => {
  // Split by newlines and filter empty strings
  const addresses = addressString
    .split("\n")
    .map((addr) => addr.trim().replace(/^[\s\u00A0]+/, ""))
    .filter((addr) => addr.length > 0);

  return addresses;
};

export default function ContactSection({
  details = [
    {
      icon: "/images/location-icon.svg",
      title: "Location",
      description: "123 Main St, City",
    },
    {
      icon: "/images/phone-icon.svg",
      title: "Phone",
      description: "+1 234 567 8900",
    },
    {
      icon: "/images/email-icon.svg",
      title: "Email",
      description: "info@example.com",
    },
  ],
  formTitle = "Get In <span class='text-primary'>Touch</span>",
  formDescription = "We'd love to hear from you. Send us a message and we'll respond as soon as possible.",
  mapImage = "/images/map-placeholder.jpg",
  ...props
}: ContactSectionProps) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useNavigationRouter();
  const { submissionStatus, error } = useSelector(
    (state: RootState) => state.enquiry
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      fullName: "",
      emailAddress: "",
      phoneNo: "",
      location: "",
      message: "",
    },
  });

  // Input filtering functions
  const filterName = (value: string) => {
    return value.replace(/[^a-zA-Z\s]/g, "").slice(0, 20);
  };

  const filterPhone = (value: string) => {
    return value.replace(/\D/g, "").slice(0, 15);
  };

  const filterEmail = (value: string) => {
    return value.replace(/[^a-zA-Z0-9@\-_.]/g, "");
  };

  const filterLocation = (value: string) => {
    return value.replace(/[^a-zA-Z0-9\s.,\-]/g, "").slice(0, 50);
  };

  const filterMessage = (value: string) => {
    return value.replace(/[^a-zA-Z\s]/g, "").slice(0, 200);
  };

  // Input handlers with filtering
  const handleNameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filtered = filterName(e.target.value);
    setValue("fullName", filtered, { shouldValidate: true });
  };

  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filtered = filterPhone(e.target.value);
    setValue("phoneNo", filtered, { shouldValidate: true });
  };

  const handleEmailInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filtered = filterEmail(e.target.value);
    setValue("emailAddress", filtered, { shouldValidate: true });
  };

  const handleLocationInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filtered = filterLocation(e.target.value);
    setValue("location", filtered, { shouldValidate: true });
  };

  const handleMessageInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const filtered = filterMessage(e.target.value);
    setValue("message", filtered, { shouldValidate: true });
  };

  const onSubmit = async (data: ContactFormData) => {
    try {
      const pageUrl = window.location.href;
      const enquiryData = {
        fullName: data.fullName,
        emailAddress: data.emailAddress || undefined,
        phoneNo: data.phoneNo,
        location: data.location,
        message: data.message,
        pageUrl,
      };

      await dispatch(createEnquiry(enquiryData)).unwrap();
      reset();
      dispatch(resetSubmissionStatus());
      router.push("/thanks?from=contact");
    } catch (error: any) {
      toast.error(
        error.message || "Failed to submit enquiry. Please try again."
      );
    }
  };

  // Find office details
  const officeDetail = details.find((detail) =>
    detail.title.toLowerCase().includes("visit our office")
  );

  const otherDetails = details.filter(
    (detail) => !detail.title.toLowerCase().includes("visit our office")
  );

  return (
    <section className="bg-[#FFFDF5] pt-10 sm:py-20">
      <div className="container">
        {/* Top Info Section */}
        <div className="sm:mb-20">
          {/* Visit our office section - Enhanced Layout */}
          {officeDetail && (
            <div className="mb-12 sm:mb-16">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-[77px] h-[77px] rounded-full bg-[#CDB04E] mb-4">
                  <Image
                    src={officeDetail.icon}
                    alt={officeDetail.title}
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </div>
                <h3 className="text-[#01292B] text-2xl sm:text-3xl font-bold font-josefin mb-2">
                  {parse(officeDetail.title)}
                </h3>
                {/* <p className="text-[#01292B]/70 font-josefin text-sm sm:text-base">
                  Find us at any of our convenient locations
                </p> */}
              </div>

              {/* Addresses Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                {parseAddresses(officeDetail.description).map(
                  (address, index) => (
                    <div
                      key={index}
                      className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-[#CDB04E]/20 hover:border-[#CDB04E]/40"
                    >
                      {/* Location Badge */}
                      <div className="absolute -top-3 left-6 bg-gradient-to-r from-[#CDB04E] to-[#B89D3F] text-white px-4 py-1 rounded-full text-xs font-semibold font-josefin">
                        Office {index + 1}
                      </div>

                      <div className="flex items-start gap-3 mt-2">
                        <div className="flex-shrink-0 mt-1">
                          <div className="w-10 h-10 rounded-full bg-[#CDB04E]/10 flex items-center justify-center group-hover:bg-[#CDB04E]/20 transition-colors duration-300">
                            <MapPin className="w-5 h-5 text-[#CDB04E]" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="text-[#01292B] font-josefin text-sm leading-relaxed">
                            {parse(address)}
                          </p>
                        </div>
                      </div>

                      {/* Decorative corner */}
                      {/* <div className="absolute bottom-0 right-0 w-16 h-16 opacity-5">
                      <svg viewBox="0 0 100 100" className="text-[#CDB04E]">
                        <circle cx="100" cy="100" r="100" fill="currentColor" />
                      </svg>
                    </div> */}
                    </div>
                  )
                )}
              </div>
            </div>
          )}
          {/* Other contact details - Enhanced Grid layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
            {otherDetails.map((detail, index) => (
              <div
                key={detail._id || index}
                className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-[#CDB04E]/10 hover:border-[#CDB04E]/30"
              >
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                  <div className="w-[70px] h-[70px] rounded-full bg-gradient-to-br from-[#CDB04E] to-[#B89D3F] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <Image
                      src={detail.icon}
                      alt={detail.title}
                      width={28}
                      height={28}
                      className="object-contain"
                    />
                  </div>
                  <div className="font-josefin text-center sm:text-left flex-1">
                    <h3 className="text-[#01292B] text-lg sm:text-xl font-semibold leading-tight mb-2 font-josefin">
                      {parse(detail.title)}
                    </h3>
                    <div className="text-[#01292B]/80 text-sm sm:text-base leading-relaxed">
                      {detail.title.toLowerCase() === "call us" ? (
                        <a
                          href={`tel:${detail.description.replace(/\s/g, "")}`}
                          className="hover:text-[#CDB04E] transition-colors duration-300 font-medium"
                        >
                          {parse(detail.description)}
                        </a>
                      ) : detail.title.toLowerCase() === "email us" ? (
                        <a
                          href={`mailto:${detail.description}`}
                          className="hover:text-[#CDB04E] transition-colors duration-300 font-medium break-all"
                        >
                          {parse(detail.description)}
                        </a>
                      ) : (
                        parse(detail.description)
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form and Map Section */}
        <div className="relative flex flex-col sm:flex-row py-4">
          <div className="rounded-[20px] sm:rounded-l-[20px] overflow-hidden bg-[#01292B] flex flex-col sm:flex-row w-full">
            {/* Map Section */}
            <div className="w-full sm:w-[514px] h-[200px] xs:h-[300px] sm:h-[820px] lg:h-[900px] xl:h-[800px] relative sm:rounded-l-[20px] sm:rounded-r-none overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3874.6135251589253!2d100.5086879748317!3d13.802156096126271!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29beca99f58b5%3A0x54ff9c07addbb3a!2sSoi%20Charan%20Sanitwong%2C%20Khwaeng%20Bang%20Ao%2C%20Khet%20Bang%20Phlat%2C%20Krung%20Thep%20Maha%20Nakhon%2010700%2C%20Thailand!5e0!3m2!1sen!2sin!4v1763102988541!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute top-0 left-0 w-full h-full sm:rounded-l-[20px] sm:rounded-r-none"
              ></iframe>
            </div>

            {/* Form Section */}
            <div className="w-full sm:w-[746px] h-auto sm:h-[820px] lg:h-[900px] xl:h-[800px] px-4 xs:px-6 sm:px-12 pt-10 sm:pt-15 pb-10 flex flex-col justify-center rounded-[20px] bg-[#072D2C]">
              <div className="font-cinzel text-white text-2xl sm:text-[40px] text-center sm:text-left font-bold sm:mb-3">
                {parse(formTitle)}
              </div>

              <div className="text-center sm:text-left text-white font-josefin description-text mb-6 max-w-full sm:max-w-[517px]">
                {parse(formDescription)}
              </div>

              {/* Contact Form with React Hook Form */}
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4 sm:space-y-4 font-josefin text-[14px]"
              >
                {/* Full Name */}
                <div>
                  <label
                    htmlFor="fullName"
                    className="text-primary block mb-1 font-normal"
                  >
                    Full Name *
                  </label>
                  <input
                    {...register("fullName")}
                    id="fullName"
                    placeholder="Enter your full name"
                    maxLength={20}
                    onInput={handleNameInput}
                    className={`w-full bg-transparent border px-4 py-2 rounded text-white ${
                      errors.fullName
                        ? "border-red-400"
                        : "border-[rgba(255,255,255,0.8)]"
                    }`}
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.fullName.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Phone Number (Mandatory) */}
                  <div>
                    <label
                      htmlFor="phoneNo"
                      className="text-primary block mb-1 font-normal"
                    >
                      Phone Number *
                    </label>
                    <input
                      {...register("phoneNo")}
                      id="phoneNo"
                      type="tel"
                      placeholder="Enter your phone number"
                      maxLength={15}
                      onInput={handlePhoneInput}
                      className={`w-full bg-transparent border px-4 py-2 rounded text-white ${
                        errors.phoneNo
                          ? "border-red-400"
                          : "border-[rgba(255,255,255,0.8)]"
                      }`}
                    />
                    {errors.phoneNo && (
                      <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.phoneNo.message}
                      </p>
                    )}
                  </div>

                  {/* Email (Optional) */}
                  <div>
                    <label
                      htmlFor="emailAddress"
                      className="text-primary block mb-1 font-normal"
                    >
                      Email Address (Optional)
                    </label>
                    <input
                      {...register("emailAddress")}
                      id="emailAddress"
                      type="email"
                      placeholder="Enter your email address"
                      onInput={handleEmailInput}
                      className={`w-full bg-transparent border px-4 py-2 rounded text-white ${
                        errors.emailAddress
                          ? "border-red-400"
                          : "border-[rgba(255,255,255,0.8)]"
                      }`}
                    />
                    {errors.emailAddress && (
                      <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.emailAddress.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Location (Replaced Country) */}
                <div>
                  <label
                    htmlFor="location"
                    className="text-primary block mb-1 font-normal"
                  >
                    Location *
                  </label>
                  <input
                    {...register("location")}
                    id="location"
                    type="text"
                    placeholder="Enter your location"
                    maxLength={50}
                    onInput={handleLocationInput}
                    className={`w-full bg-transparent border px-4 py-2 rounded text-white ${
                      errors.location
                        ? "border-red-400"
                        : "border-[rgba(255,255,255,0.8)]"
                    }`}
                  />
                  {errors.location && (
                    <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.location.message}
                    </p>
                  )}
                </div>

                {/* Message (Optional) */}
                <div>
                  <label
                    htmlFor="message"
                    className="text-primary block mb-1 font-normal"
                  >
                    Message (Optional)
                  </label>
                  <textarea
                    {...register("message")}
                    id="message"
                    placeholder="Tell us about your inquiry..."
                    maxLength={200}
                    onInput={handleMessageInput}
                    className={`w-full bg-transparent border px-4 py-2 rounded min-h-[96px] text-white ${
                      errors.message
                        ? "border-red-400"
                        : "border-[rgba(255,255,255,0.8)]"
                    }`}
                  />
                  {errors.message && (
                    <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.message.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex justify-center items-center sm:justify-start">
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
