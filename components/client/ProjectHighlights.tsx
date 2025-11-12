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

/**
 * Robust YouTube ID extractor for common URL variants.
 */
const extractYouTubeId = (url: string): string | null => {
  if (!url) return null;
  // Try common YouTube URL patterns (watch, embed, shorts, youtu.be)
  const regex =
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const m = url.match(regex);
  if (m && m[1]) return m[1];

  // As a fallback, try to extract v= query param
  try {
    const u = new URL(url);
    const v = u.searchParams.get("v");
    if (v && v.length === 11) return v;
  } catch {
    /* ignore */
  }

  return null;
};

export default function ProjectTabsSection({ project }: ProjectTabsProps) {
  const discoverTranquility =
    project.projectDetail?.discoverTranquility || {
      sectionTitle: "Discover Tranquility at",
      backgroundImage: "",
      description: "",
      tabs: [] as DiscoverTranquilityTab[],
    };

  const [activeTab, setActiveTab] = useState(
    discoverTranquility.tabs[0]?.id || ""
  );
  const [showAllItems, setShowAllItems] = useState(false);
  const projectName = project.name;

  // Re-bind Fancybox on mount and whenever activeTab (or content) changes.
  useEffect(() => {
    if (typeof window === "undefined") return;

    const bindFancybox = () => {
      try {
        (Fancybox as any).bind("[data-fancybox='tranquility']", {
          Thumbs: { autoStart: false },
          Toolbar: { display: ["zoom", "close"] },
          animated: true,
        });
      } catch (err) {
        // non-fatal; helps with debugging in prod builds
        // eslint-disable-next-line no-console
        console.warn("Fancybox.bind failed:", err);
      }
    };

    // Use requestAnimationFrame so DOM updates from AnimatePresence finish first.
    let rafId: number | null = null;
    if (typeof window !== "undefined" && window.requestAnimationFrame) {
      rafId = window.requestAnimationFrame(() => bindFancybox());
    } else {
      // fallback small timeout
      setTimeout(() => bindFancybox(), 50);
    }

    return () => {
      // cancel scheduled bind if any
      if (rafId && typeof window !== "undefined" && window.cancelAnimationFrame) {
        window.cancelAnimationFrame(rafId);
      }

      // safe cleanup; cast to any because types may be missing
      try {
        if ((Fancybox as any)?.close) (Fancybox as any).close();
        if ((Fancybox as any)?.destroy) (Fancybox as any).destroy();
      } catch {
        // ignore cleanup failures
      }
    };
    // Re-run binding when activeTab changes (so new anchors are bound).
  }, [activeTab, showAllItems]);

  const activeTabData = discoverTranquility.tabs.find(
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

  const totalItemsAcrossAllTabs = discoverTranquility.tabs.reduce(
    (total, tab) => total + (tab.items?.length || 0),
    0
  );

  const getItemsToDisplay = () => {
    if (!activeTabData) return [];
    const sorted = [...activeTabData.items].sort((a, b) => a.order - b.order);
    return showAllItems ? sorted : sorted.slice(0, 6);
  };

  const itemsToDisplay = getItemsToDisplay();
  const hasMoreItems = !!activeTabData && activeTabData.items.length > 6;

  if (!discoverTranquility.tabs || discoverTranquility.tabs.length === 0) {
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

        {/* Tabs */}
        <div className="flex justify-center items-center mb-10 px-4 overflow-x-auto">
          {discoverTranquility.tabs.map((tab) => {
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

/* ---------------------- HoverImageCard ---------------------- */
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

/* ---------------------- YouTubeShortCard ----------------------
   Renders a thumbnail that opens the video in Fancybox as an iframe.
   This avoids inline iframe sizing/CSP/autoplay issues in the grid.
-----------------------------------------------------------------*/
const YouTubeShortCard = ({
  youtubeUrl,
  title,
}: {
  youtubeUrl: string;
  title: string;
}) => {
  const videoId = extractYouTubeId(youtubeUrl);
  const embedUrl = videoId
    ? `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`
    : "";

  if (!videoId) {
    return (
      <motion.div
        className="relative overflow-hidden rounded-2xl shadow-lg font-josefin bg-black"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        <div className="w-full h-50 sm:h-72 md:h-80 flex items-center justify-center bg-gray-800 text-white">
          Invalid YouTube URL
        </div>

        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4 pointer-events-none">
          <h3 className="text-white text-lg font-semibold font-josefin">
            {title}
          </h3>
        </div>
      </motion.div>
    );
  }

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl shadow-lg font-josefin bg-black"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      {/* Anchor: Fancybox will open this as an iframe */}
      <a
        href={`https://www.youtube.com/watch?v=${videoId}`}
        data-fancybox="tranquility"
        data-caption={title}
        data-type="iframe"
        className="block w-full h-full"
      >
        <div className="w-full h-50 sm:h-72 md:h-80">
          <Image
            src={thumbnailUrl}
            alt={title}
            width={500}
            height={280}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4 pointer-events-none">
          <h3 className="text-white text-lg font-semibold font-josefin">
            {title}
          </h3>
        </div>
      </a>
    </motion.div>
  );
};
