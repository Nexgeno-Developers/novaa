"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  X,
  AlertCircle,
  Loader2,
  Play,
  Pause,
  Volume2,
  VolumeX,
} from "lucide-react";
import parse from "html-react-parser";
import { useState, useRef, useEffect } from "react";
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
        mediaType?: "image" | "video" | "vimeo";
        vimeoUrl?: string;
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
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Video control states
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const vimeoIframeRef = useRef<HTMLIFrameElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const heroData = project.projectDetail?.hero;

  const backgroundImage =
    heroData?.backgroundImage || "/images/project-details-hero.jpg";

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

  // Helper function to extract Vimeo video ID from URL
  const extractVimeoId = (url: string): string | null => {
    const match = url.match(
      /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/
    );
    return match ? match[1] : null;
  };

  // Get background media based on mediaType
  const getBackgroundMedia = () => {
    const heroData = project.projectDetail?.hero;
    const mediaType = heroData?.mediaType || "image";
    const backgroundImage =
      heroData?.backgroundImage || "/images/project-details-hero.jpg";
    const vimeoUrl = heroData?.vimeoUrl;

    if (mediaType === "vimeo" && vimeoUrl) {
      const videoId = extractVimeoId(vimeoUrl);
      if (videoId) {
        return {
          type: "vimeo",
          videoId: videoId,
          src: `https://player.vimeo.com/video/${videoId}?autoplay=1&muted=1&loop=1&background=1&controls=0&title=0&byline=0&portrait=0&playsinline=1&autopause=0`,
        };
      }
    } else if (mediaType === "video") {
      return {
        type: "video",
        src: backgroundImage,
      };
    } else {
      return {
        type: "image",
        src: backgroundImage,
      };
    }

    return {
      type: "image",
      src: backgroundImage,
    };
  };

  const backgroundMedia = getBackgroundMedia();

  // Vimeo Player API functions
  const sendVimeoCommand = (action: string, value?: any) => {
    if (vimeoIframeRef.current) {
      const data =
        value !== undefined ? { method: action, value } : { method: action };
      vimeoIframeRef.current.contentWindow?.postMessage(
        JSON.stringify(data),
        "*"
      );
    }
  };

  // Toggle play/pause
  const togglePlayPause = () => {
    if (backgroundMedia.type === "video" && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    } else if (backgroundMedia.type === "vimeo") {
      if (isPlaying) {
        sendVimeoCommand("pause");
      } else {
        sendVimeoCommand("play");
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Toggle mute/unmute
  const toggleMute = () => {
    if (backgroundMedia.type === "video" && videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    } else if (backgroundMedia.type === "vimeo") {
      sendVimeoCommand("setVolume", isMuted ? 1 : 0);
      setIsMuted(!isMuted);
    }
  };

  // Intersection Observer to pause/resume video based on visibility
  useEffect(() => {
    if (backgroundMedia.type === "image") return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            // Section is out of view - pause and mute
            if (backgroundMedia.type === "video" && videoRef.current) {
              videoRef.current.pause();
              videoRef.current.muted = true;
            } else if (backgroundMedia.type === "vimeo") {
              sendVimeoCommand("pause");
              sendVimeoCommand("setVolume", 0);
            }
            setIsPlaying(false);
            setIsMuted(true);
          } else {
            // Section is back in view - resume playing with sound
            if (backgroundMedia.type === "video" && videoRef.current) {
              videoRef.current.play().catch(console.error);
              videoRef.current.muted = false;
            } else if (backgroundMedia.type === "vimeo") {
              sendVimeoCommand("play");
              sendVimeoCommand("setVolume", 1);
            }
            setIsPlaying(true);
            setIsMuted(false);
          }
        });
      },
      {
        threshold: 0.5, // Trigger when 50% of section is visible/hidden
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [backgroundMedia.type]);

  // Initialize video state synchronization
  useEffect(() => {
    if (backgroundMedia.type === "video" && videoRef.current) {
      const video = videoRef.current;

      // Ensure video starts muted and playing
      video.muted = true;
      video.play().catch(console.error);
      setIsPlaying(true);
      setIsMuted(true);

      // Sync state with video element properties
      const syncState = () => {
        setIsPlaying(!video.paused);
        setIsMuted(video.muted);
      };

      // Listen for video events to keep state in sync
      video.addEventListener("play", syncState);
      video.addEventListener("pause", syncState);
      video.addEventListener("volumechange", syncState);

      return () => {
        video.removeEventListener("play", syncState);
        video.removeEventListener("pause", syncState);
        video.removeEventListener("volumechange", syncState);
      };
    } else if (backgroundMedia.type === "vimeo" && vimeoIframeRef.current) {
      // Wait for iframe to load and ensure muted state
      const timer = setTimeout(() => {
        sendVimeoCommand("setVolume", 0);
        setIsPlaying(true);
        setIsMuted(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [backgroundMedia.type]);

  const validateForm = () => {
    const errors = {
      fullName: "",
      phone: "",
      email: "",
      message: "",
    };

    // Name validation (letters only, max 20)
    if (!formData.fullName.trim()) {
      errors.fullName = "Full name is required";
    } else if (!/^[a-zA-Z\s]+$/.test(formData.fullName)) {
      errors.fullName = "Name can only contain letters";
    } else if (formData.fullName.length > 20) {
      errors.fullName = "Name cannot exceed 20 characters";
    }

    // Phone validation (numbers only, max 15)
    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^\d+$/.test(formData.phone)) {
      errors.phone = "Phone number can only contain numbers";
    } else if (formData.phone.length > 15) {
      errors.phone = "Phone number cannot exceed 15 digits";
    }

    // Email validation
    if (
      formData.email.trim() &&
      !/^[a-zA-Z0-9@\-_.]+@[a-zA-Z0-9@\-_.]+\.[a-zA-Z0-9@\-_.]+$/.test(formData.email)
    ) {
      errors.email = "Please enter a valid email address";
    }

    // Message validation (letters only, max 200)
    if (formData.message && formData.message.trim() && !/^[a-zA-Z\s]+$/.test(formData.message)) {
      errors.message = "Message can only contain letters";
    } else if (formData.message && formData.message.length > 200) {
      errors.message = "Message cannot exceed 200 characters";
    }

    setFormErrors(errors);
    return !errors.fullName && !errors.phone && !errors.email && !errors.message;
  };

  const handleBrochureClick = () => {
    setShowBrochureForm(true);
  };

  const handleCloseForm = () => {
    setShowBrochureForm(false);
    setFormData({ fullName: "", phone: "", email: "", message: "" });
    setFormErrors({ fullName: "", phone: "", email: "", message: "" });
    dispatch(resetSubmissionStatus());
  };

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

  const filterMessage = (value: string) => {
    return value.replace(/[^a-zA-Z\s]/g, "").slice(0, 200);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    let filteredValue = value;
    
    // Apply filters based on field name
    if (name === "fullName") {
      filteredValue = filterName(value);
    } else if (name === "phone") {
      filteredValue = filterPhone(value);
    } else if (name === "email") {
      filteredValue = filterEmail(value);
    } else if (name === "message") {
      filteredValue = filterMessage(value);
    }
    
    setFormData((prev) => ({
      ...prev,
      [name]: filteredValue,
    }));
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
      const pageUrl = window.location.href;
      const enquiryData = {
        fullName: formData.fullName,
        emailAddress: formData.email || undefined,
        phoneNo: formData.phone,
        location: project.name,
        message: formData.message,
        pageUrl,
      };

      await dispatch(createEnquiry(enquiryData)).unwrap();
      handleCloseForm();
      dispatch(resetSubmissionStatus());
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
    const phoneNumber = "+919867724223";
    const message = encodeURIComponent("Hi, I am contacting you through your website");
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${message}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <>
    <section
      ref={sectionRef}
      className="relative h-screen overflow-hidden bg-background"
    >
      {/* Background Media - Conditional Rendering */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        {backgroundMedia.type === "vimeo" ? (
          <iframe
            ref={vimeoIframeRef}
            src={backgroundMedia.src}
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
            allowFullScreen
            style={{
              pointerEvents: "none",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "100vw",
              height: "62.666vw",
              minWidth: "159.5vh",
              minHeight: "100vh",
            }}
          />
        ) : backgroundMedia.type === "video" ? (
          <video
            ref={videoRef}
            src={backgroundMedia.src}
            autoPlay
            muted
            loop
            playsInline
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "100vw",
              height: "100vh",
              objectFit: "cover",
            }}
          />
        ) : (
          <Image
            src={backgroundMedia.src}
            alt="project details background"
            fill
            priority
            className="object-cover"
          />
        )}
      </div>

      {/* Video Controls - Only show for video/vimeo */}
      {(backgroundMedia.type === "video" ||
        backgroundMedia.type === "vimeo") && (
        <div className="absolute flex-col bottom-24 xl:bottom-28 right-5 sm:right-8 z-20 flex gap-3">
          {/* Play/Pause Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={togglePlayPause}
            className="bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 cursor-pointer"
            aria-label={isPlaying ? "Pause video" : "Play video"}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 ml-0.5" />
            )}
          </motion.button>

          {/* Mute/Unmute Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleMute}
            className="bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 cursor-pointer"
            aria-label={isMuted ? "Unmute video" : "Mute video"}
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </motion.button>
        </div>
      )}

      {/* Dark overlay */}
      <div className="absolute bottom-0 left-0 right-0 w-full h-1/2 z-0 bg-gradient-to-b from-transparent to-[#01292B]" />

      {/* Content Container */}
      <div className="container relative h-full z-10">
        <div className="relative h-full flex flex-col justify-end mt-10">
          {/* Text Content */}
          <div className="hidden font-cinzel text-primary pb-5 sm:pb-0">
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
              className="flex items-center description-text gap-4 font-josefin font-light text-white mt-2 pl-1 max-w-[80%] lg:max-w-full"
            >
              {subtitle && <div>{parse(subtitle)}</div>}
            </motion.h3>
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={handleCloseForm}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-[#01292BE5] backdrop-blur-xs rounded-[30px] p-4 sm:p-6 md:p-8 max-w-md w-full relative shadow-2xl max-h-[90vh] overflow-y-auto my-4"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleCloseForm}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>

              <h3 className="text-xl sm:text-2xl font-cinzel font-bold text-primary mb-2">
                Enquire Now
              </h3>
              <p className="text-gray-300 font-josefin mb-4 sm:mb-6 text-xs sm:text-sm">
                Fill in your details to receive the brochure and get more
                information about this project
              </p>

              <form
                onSubmit={handleFormSubmit}
                className="space-y-3 sm:space-y-4 font-josefin text-[14px]"
              >
                <div>
                  <label className="block text-primary text-sm font-medium mb-2">
                    Full Name (Optional)
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    maxLength={20}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 bg-transparent border rounded-lg text-[#FFFFFFCC] placeholder-[#FFFFFF80] focus:outline-none focus:border-primary focus:ring-1 focus:ring-[#FFFFFF80] transition-all duration-300 border-[#FFFFFF80]"
                  />
                  {formErrors.fullName && (
                    <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {formErrors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-primary text-sm font-medium mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    maxLength={15}
                    placeholder="Enter your phone number"
                    className={`w-full px-4 py-3 bg-transparent border rounded-lg text-[#FFFFFFCC] placeholder-[#FFFFFF80] focus:outline-none focus:border-primary focus:ring-1 focus:ring-[#FFFFFF80] transition-all duration-300 ${
                      formErrors.phone
                        ? "border-red-400 focus:border-red-400 focus:ring-red-400"
                        : "border-[#FFFFFF80]"
                    }`}
                  />
                  {formErrors.phone && (
                    <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {formErrors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-primary text-sm font-medium mb-2">
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    className={`w-full px-4 py-3 bg-transparent border rounded-lg text-[#FFFFFFCC] placeholder-[#FFFFFF80] focus:outline-none focus:border-primary focus:ring-1 focus:ring-[#FFFFFF80] transition-all duration-300 ${
                      formErrors.email
                        ? "border-red-400 focus:border-red-400 focus:ring-red-400"
                        : "border-[#FFFFFF80]"
                    }`}
                  />
                  {formErrors.email && (
                    <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {formErrors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-primary text-sm font-medium mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Any specific requirements or questions?"
                    rows={3}
                    maxLength={200}
                    className="w-full px-4 py-3 bg-transparent border rounded-lg text-[#FFFFFFCC] placeholder-[#FFFFFF80] focus:outline-none focus:border-primary focus:ring-1 focus:ring-[#FFFFFF80] transition-all duration-300 resize-none border-[#FFFFFF80]"
                  />
                </div>

                <div className="flex justify-center pt-1 sm:pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting || submissionStatus === "submitting"}
                    className={`bg-gradient-to-r from-[#C3912F] via-[#F5E7A8] to-[#C3912F] hover:bg-[#CDB04E] text-background font-semibold px-8 sm:px-12 py-2 sm:py-3 rounded-[10px] cursor-pointer text-sm sm:text-base md:text-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2 ${
                      isSubmitting || submissionStatus === "submitting"
                        ? "opacity-70 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {isSubmitting || submissionStatus === "submitting" ? (
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


<div className="bg-[#01292B]">
      <div className="container">
        {/* Buttons Container */}
          <div className="flex justify-start gap-4 mb-0 pt-0 sm:pt-5 ">
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

      </>
  );
};

export default ProjectHeroSection;
