"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux";
import { useRouter } from "next/navigation";

interface CardProps {
  isLocationVisible: boolean;
}

export default function CollectionCard({ isLocationVisible }: CardProps) {
  const router = useRouter();

  const { selectedRegion, allData } = useAppSelector(
    (state: RootState) => state.curated
  );

  const [currentImageIndex, setCurrentImageIndex] = useState<
    Record<string, number>
  >({});

  const [preloadedImages, setPreloadedImages] = useState<
    Record<string, boolean>
  >({});

  // Preload images when component mounts or data changes
  useEffect(() => {
    if (allData && allData[selectedRegion]) {
      const preloadPromises = allData[selectedRegion].flatMap((property) =>
        property.images.map((imageSrc) => {
          return new Promise<void>((resolve) => {
            const img = document.createElement('img');
            img.onload = () => {
              setPreloadedImages(prev => ({
                ...prev,
                [imageSrc]: true
              }));
              resolve();
            };
            img.onerror = () => resolve(); // Still resolve on error to prevent hanging
            img.src = imageSrc;
          });
        })
      );

      Promise.all(preloadPromises);
    }
  }, [allData, selectedRegion]);

  const nextImage = (propertyId: number) => {
    const currentProperties = allData[selectedRegion];
    const property = currentProperties.find((p) => p.id === propertyId);
    if (!property) return;

    const currentIndex = currentImageIndex[propertyId] || 0;
    const nextIndex = (currentIndex + 1) % property.images.length;

    setCurrentImageIndex((prev) => ({
      ...prev,
      [propertyId]: nextIndex,
    }));
  };

  const prevImage = (propertyId: number) => {
    const currentProperties = allData[selectedRegion];
    const property = currentProperties.find((p) => p.id === propertyId);
    if (!property) return;

    const currentIndex = currentImageIndex[propertyId] || 0;
    const prevIndex =
      currentIndex === 0 ? property.images.length - 1 : currentIndex - 1;

    setCurrentImageIndex((prev) => ({
      ...prev,
      [propertyId]: prevIndex,
    }));
  };

  // Add null check for allData
  if (!allData || !allData[selectedRegion]) {
    return <div>Loading...</div>;
  }

  return (
    <AnimatePresence mode="wait">
      {allData[selectedRegion].map((property, index) => (
        <motion.div
          key={property.id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.6 }}
          className="w-full relative group rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
        >
          <div
            className="relative h-[450px] xl:h-[560px] overflow-hidden group cursor-pointer"
            onClick={() => router.push("/project-detail")}
          >
            {/* Background Images - All images rendered but only current one visible */}
            <div className="relative w-full h-full">
              {property.images.map((imageSrc, imgIndex) => (
                <div
                  key={`${property.id}-${imgIndex}`}
                  className={`absolute inset-0 transition-opacity duration-300 ${
                    (currentImageIndex[property.id] || 0) === imgIndex 
                      ? 'opacity-100' 
                      : 'opacity-0'
                  }`}
                >
                  <Image
                    src={imageSrc}
                    alt={`${property.name} - Image ${imgIndex + 1}`}
                    fill
                    className="object-cover h-full group-hover:scale-105 transition-all duration-300"
                    priority={imgIndex === 0} // Only prioritize first image
                    placeholder="empty" // Remove default placeholder
                  />
                </div>
              ))}
            </div>

            {/* Dark gradient overlay */}
            <div className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-t from-[#000000] to-[#00000000] z-10"></div>

            {/* Overlay Content at bottom */}
            <div className="absolute bottom-0 left-0 right-0 text-white p-4 lg:p-8 z-20">
              <div className="flex items-center gap-4 mb-2">
                <h3 className="text-lg lg:text-[22px] font-medium text-primary border-r-1 border-r-white pr-2 lg:pr-5">
                  {property.name}
                </h3>
                <span className="text-base lg:text-lg font-light text-white">
                  {property.price}
                </span>
              </div>
              
              {isLocationVisible === true && (
                <div className="flex items-center xl:items-start justify-start gap-2 py-2 px-2 mb-3 w-[60%] xl:w-[55%] rounded-[8px] bg-[#CDB04E1A]">
                  <div className="relative w-[10px] h-[10px] xl:w-[15px] xl:h-[15px]">
                    <Image
                      src={"/icons/map-pin.svg"}
                      fill
                      alt="Location Icon"
                      className="object-contain"
                    />
                  </div>
                  <p className="text-base xl:text-lg leading-tight">
                    <span className="font-medium">
                      {property.location.split(",")[0]}
                    </span>
                    {property.location.includes(",") && (
                      <span className="font-light">
                        ,{property.location.split(",").slice(1).join(",")}
                      </span>
                    )}
                  </p>
                </div>
              )}

              <div className="relative">
                <div className="absolute top-0 left-0 w-full h-[1px] flex">
                  <div className="w-1/2 bg-primary"></div>
                  <div className="w-1/2 bg-[#FFFFFF80]"></div>
                </div>
                <p className="description-text text-[#FFFFFF] pt-3 pb-4 xl:pb-2">
                  {property.description}
                </p>
              </div>
            </div>

            {/* Optional badge */}
            {property.badge && (
              <div className="absolute font-josefin top-15 right-0 bg-[#D4AF37] text-background pl-5 pr-4 pt-2 pb-1 rounded-l-[20px] text-lg font-medium z-20">
                {property.badge}
              </div>
            )}

            {/* Navigation Arrows */}
            <div className="absolute inset-0 flex items-center justify-between p-4 lg:opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30">
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage(property.id);
                }}
                className="cursor-pointer text-[#FFFFFFCC] hover:text-white transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronLeft className="w-10 h-10 lg:w-15 lg:h-15 bg-transparent" />
              </motion.button>
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage(property.id);
                }}
                className="cursor-pointer text-[#FFFFFFCC] hover:text-white transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronRight className="w-10 h-10 lg:w-15 lg:h-15 bg-transparent" />
              </motion.button>
            </div>

            {/* Image Indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-30">
              {property.images.map((_, imgIndex) => (
                <button
                  key={imgIndex}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex((prev) => ({
                      ...prev,
                      [property.id]: imgIndex,
                    }));
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    (currentImageIndex[property.id] || 0) === imgIndex
                      ? "bg-primary border-1 border-amber-400 scale-125"
                      : "bg-white/50 hover:bg-white/75"
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      ))}
    </AnimatePresence>
  );
}