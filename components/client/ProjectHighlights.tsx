"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";

interface DiscoverTranquilityTab {
  id: string;
  label: string;
  items: DiscoverTranquilityItem[];
}

interface DiscoverTranquilityItem {
  type: "image" | "video";
  image?: string;
  youtubeUrl?: string;
  title: string;
  order: number;
}

interface ProjectTabsProps {
  project: {
    name: string;
    projectDetail: {
      discoverTranquility: {
        sectionTitle: string;
        backgroundImage: string;
        description: string;
        tabs: DiscoverTranquilityTab[];
      };
    };
  };
}

// Helper function to extract YouTube video ID from various URL formats
const extractYouTubeId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/shorts\/|youtu\.be\/shorts\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
};

export default function ProjectTabsSection({ project }: ProjectTabsProps) {
  const discoverTranquility = project.projectDetail?.discoverTranquility || {
    sectionTitle: "Discover Tranquility at",
    backgroundImage: "",
    description: "",
    tabs: [],
  };

  // Filter tabs to only include those with items
  const availableTabs = discoverTranquility.tabs.filter(tab => tab.items && tab.items.length > 0);
  
  // Set active tab to first available tab
  const [activeTab, setActiveTab] = useState(
    availableTabs[0]?.id || ""
  );
  const [showAllItems, setShowAllItems] = useState(false);
  const projectName = project.name;

  // Bind Fancybox on mount and whenever activeTab changes so new anchors are wired
  useEffect(() => {
    // Ensure no previous instance remains
    try {
      Fancybox.destroy();
    } catch (e) {
      // ignore if not initialized
    }

    // v5 includes plugins; cast to `any` because type defs don't include plugin options
    Fancybox.bind("[data-fancybox='tranquility']", {
      Thumbs: { autoStart: false },
      Toolbar: { display: ["zoom", "close"] },
      animated: true,
    } as any);

    return () => {
      try {
        Fancybox.destroy();
      } catch (e) {
        // ignore
      }
    };
  }, [activeTab]);

  const activeTabData = availableTabs.find(
    (tab) => tab.id === activeTab
  );

  const handleTabChange = (tabId: string) => {
    if (activeTab === tabId) return;
    setActiveTab(tabId);
    setShowAllItems(false);
  };

  const toggleShowAll = () => {
    setShowAllItems((s) => !s);
  };

  // Calculate total items across all tabs (if needed somewhere else)
  const totalItemsAcrossAllTabs = availableTabs.reduce(
    (total, tab) => total + tab.items.length,
    0
  );

  const getItemsToDisplay = () => {
    if (!activeTabData) return [];
    const sorted = [...activeTabData.items].sort((a, b) => a.order - b.order);
    return showAllItems ? sorted : sorted.slice(0, 6);
  };

  const itemsToDisplay = getItemsToDisplay();
  const hasMoreItems = activeTabData && activeTabData.items.length > 6;

  if (!availableTabs || availableTabs.length === 0) {
    return null;
  }

  return (
    <section className="bg-background text-white py-12 sm:py-16">
      <div className="container">
        <div className="font-cinzel text-center space-y-2 sm:space-y-4 mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-[50px] font-normal uppercase text-center">
            {discoverTranquility.sectionTitle}{" "}
            <span className="text-primary font-bold">{projectName}</span>
          </h2>
        </div>

        {/* Region-style Tabs */}
        <div className="flex justify-center items-center mb-10 px-4 overflow-x-auto">
          {availableTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const itemCount = tab.items.length;

            return (
              <Button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                variant="ghost"
                className={`font-josefin relative rounded-none px-2 sm:px-10 py-6 sm:py-8 font-medium border-y-2 transition-colors duration-300 text-sm sm:text-[22px]
                  ${
                    isActive
                      ? "border-white text-white"
                      : "border-white/50 border-y-[1.2px] text-white/80"
                  }
                  cursor-pointer hover:text-primary`}
              >
                <span className="flex items-center gap-2">
                  {tab.label}
                  <span className="text-[10px] sm:text-xs bg-white/10 px-2 py-0.5 rounded-full">
                    {itemCount}
                  </span>
                </span>
              </Button>
            );
          })}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{
              duration: 0.5,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-6"
          >
            {itemsToDisplay.map((item, index) => (
              <motion.div
                key={`${activeTab}-${index}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.1,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
              >
                {item.type === "image" ? (
                  <HoverImageCard
                    defaultImage={item.image || ""}
                    hoverImage={item.image || ""}
                    title={item.title}
                  />
                ) : (
                  <YouTubeShortCard
                    youtubeUrl={item.youtubeUrl || ""}
                    title={item.title}
                  />
                )}
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Load More Button */}
        {hasMoreItems && (
          <div className="flex justify-center mt-8">
            <Button
              onClick={toggleShowAll}
              variant="outline"
              className="border-white/50 text-white hover:bg-white hover:text-black transition-colors duration-300 px-8 py-3 font-josefin"
            >
              {showAllItems ? "Show Less" : "Load More"}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

const HoverImageCard = ({
  defaultImage,
  hoverImage,
  title,
}: {
  defaultImage: string;
  hoverImage: string;
  title: string;
}) => {
  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl group cursor-pointer shadow-lg font-josefin"
      whileHover="hover"
      initial="rest"
      animate="rest"
    >
      {/* Anchor for Fancybox */}
      <a
        href={defaultImage}
        data-fancybox="tranquility"
        data-caption={title}
        className="block relative w-full h-full"
      >
        {/* Default Image */}
        <motion.div
          className="w-full h-50 sm:h-72 md:h-80 bg-gradient-to-b from-[#00000000] to-[#000000]"
          variants={{
            rest: { opacity: 1 },
            hover: { opacity: 0 },
          }}
          transition={{ duration: 0.4 }}
        >
          <Image
            src={defaultImage}
            alt={title}
            width={500}
            height={500}
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Hover Image */}
        <motion.div
          className="absolute inset-0 w-full h-full"
          variants={{
            rest: { opacity: 0 },
            hover: { opacity: 1 },
          }}
          transition={{ duration: 0.4 }}
        >
          <Image
            src={hoverImage}
            alt={title}
            width={500}
            height={500}
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Caption Overlay */}
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4">
          <h3 className="text-white text-lg font-semibold font-josefin">
            {title}
          </h3>
        </div>
      </a>
    </motion.div>
  );
};

const YouTubeShortCard = ({
  youtubeUrl,
  title,
}: {
  youtubeUrl: string;
  title: string;
}) => {
  const videoId = extractYouTubeId(youtubeUrl);
  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : "";

  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl shadow-lg font-josefin bg-black"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-full h-50 sm:h-72 md:h-80">
        {embedUrl ? (
          <iframe
            src={embedUrl}
            title={title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white">
            Invalid YouTube URL
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4 pointer-events-none">
        <h3 className="text-white text-lg font-semibold font-josefin">
          {title}
        </h3>
      </div>
    </motion.div>
  );
};