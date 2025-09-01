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
import { Loader2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
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

// Validation schema
const contactFormSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name cannot exceed 100 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
  emailAddress: z.string().email("Please enter a valid email address"),
  phoneNo: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(20, "Phone number cannot exceed 20 characters")
    .regex(/^[+]?[\d\s\-\(\)]+$/, "Please enter a valid phone number"),
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

export default function ContactSection({
  details = [
    { icon: "/images/location-icon.svg", title: "Location", description: "123 Main St, City" },
    { icon: "/images/phone-icon.svg", title: "Phone", description: "+1 234 567 8900" },
    { icon: "/images/email-icon.svg", title: "Email", description: "info@example.com" },
  ],
  formTitle = "Get In <span class='text-primary'>Touch</span>",
  formDescription = "We'd love to hear from you. Send us a message and we'll respond as soon as possible.",
  mapImage = "/images/map-placeholder.jpg",
  ...props
}: ContactSectionProps) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { submissionStatus, error } = useSelector(
    (state: RootState) => state.enquiry
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      fullName: "",
      emailAddress: "",
      phoneNo: "",
      country: "",
      investmentLocation: "thailand",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      // Transform the data to match API expectations
      const enquiryData = {
        fullName: data.fullName,
        emailAddress: data.emailAddress,
        phoneNo: data.phoneNo,
        country: data.country,
        investmentLocation: data.investmentLocation,
        message: data.message,
      };

      await dispatch(createEnquiry(enquiryData)).unwrap();

      // Reset form after successful submission
      reset();
      
      // Reset submission status
      dispatch(resetSubmissionStatus());

      // Redirect to thanks page instead of showing success message
      router.push('/thanks?from=contact');

    } catch (error: any) {
      toast.error(
        error.message || "Failed to submit enquiry. Please try again."
      );
    }
  };

  return (
    <section className="bg-[#FFFDF5] pt-10 sm:py-20">
      <div className="container">
        {/* Top Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-8 sm:mb-20">
          {details.map((detail, index) => (
            <div
              key={detail._id || index}
              className="flex flex-col lg:flex-row items-center gap-4"
            >
              <div className="w-[77px] h-[77px] rounded-[50px] bg-[#CDB04E] flex items-center justify-center shrink-0">
                <Image
                  src={detail.icon}
                  alt={detail.title}
                  width={24}
                  height={24}
                  className="object-contain"
                />
              </div>
              <div className="font-josefin max-w-[278px] text-center lg:text-left">
                <h3 className="text-[#01292B] text-[20px] font-bold leading-[20px] mb-1">
                  {detail.title}
                </h3>
                <p className="text-[#01292B] description-text leading-[22px]">
                  {detail.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Form and Map Section */}
        <div className="relative flex flex-col sm:flex-row py-4">
          <div className="rounded-[20px] sm:rounded-l-[20px] overflow-hidden bg-[#01292B] flex flex-col sm:flex-row w-full">
            {/* Map Section */}
            <div className="w-full sm:w-[514px] h-[200px] xs:h-[300px] sm:h-[820px] lg:h-[900px] xl:h-[800px] relative sm:rounded-l-[20px] sm:rounded-r-none">
              <Image
                src={mapImage}
                alt="Map"
                fill
                className="object-cover sm:rounded-l-[20px] sm:rounded-r-none"
              />
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
                {/* Form inputs */}
                <div className="mb-2">
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                    {/* Email (Left) */}
                    <div>
                      <label className="block text-primary text-sm font-medium mb-2">
                        Email Address *
                      </label>
                      <input
                        {...register("emailAddress")}
                        type="email"
                        placeholder="Enter your email address"
                        className={`w-full bg-transparent border px-4 py-2 rounded text-white ${
                          errors.emailAddress
                            ? "border-red-400"
                            : "border-[rgba(255,255,255,0.8)]"
                        }`}
                      />
                      {errors.emailAddress && (
                        <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.emailAddress.message}
                        </p>
                      )}
                    </div>

                    {/* Phone (Right) */}
                    <div>
                      <label
                        htmlFor="phoneNo"
                        className="text-primary block mb-1 font-normal"
                      >
                        Phone No *
                      </label>
                      <input
                        {...register("phoneNo")}
                        id="phoneNo"
                        type="tel"
                        placeholder="Enter your phone no"
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
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-primary block mb-1 font-normal">
                      Country of Residence *
                    </label>
                    <select
                      {...register("country")}
                      className={`w-full bg-transparent border px-4 py-2 rounded text-white focus:bg-background ${
                        errors.country
                          ? "border-red-400"
                          : "border-[#FFFFFFCC]"
                      }`}
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Select your country
                      </option>
                      <option value="thailand">Thailand</option>
                      <option value="uae">UAE</option>
                      <option value="uk">UK</option>
                      <option value="usa">USA</option>
                      <option value="australia">Australia</option>
                      <option value="singapore">Singapore</option>
                      <option value="india">India</option>
                      <option value="canada">Canada</option>
                      <option value="germany">Germany</option>
                      <option value="france">France</option>
                    </select>
                    {errors.country && (
                      <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.country.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-primary block mb-1 font-normal">
                      Preferred Investment Location *
                    </label>
                    <select
                      {...register("investmentLocation")}
                      className={`w-full bg-transparent border px-4 py-2 rounded text-white focus:bg-background ${
                        errors.investmentLocation
                          ? "border-red-400"
                          : "border-[#FFFFFFCC]"
                      }`}
                      defaultValue="thailand"
                    >
                      <option value="thailand">Thailand (Phuket)</option>
                      <option value="koh-samui">Thailand (Koh Samui)</option>
                      <option value="pattaya">Thailand (Pattaya)</option>
                      <option value="bangkok">Thailand (Bangkok)</option>
                      <option value="hua-hin">Thailand (Hua Hin)</option>
                      <option value="krabi">Thailand (Krabi)</option>
                    </select>
                    {errors.investmentLocation && (
                      <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.investmentLocation.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-primary block mb-1 font-normal">
                    Message (Optional)
                  </label>
                  <textarea
                    {...register("message")}
                    placeholder="Tell us about investment goals..."
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

                <div className="flex justify-center items-center sm:justify-start">
                  <button
                    type="submit"
                    disabled={
                      isSubmitting || submissionStatus === "submitting"
                    }
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