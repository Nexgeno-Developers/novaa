"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux";

interface CardProps {
  name: string;
  image: string;
  price: string;
}

export default function CollectionCard() {
  const { selectedRegion, allData } = useAppSelector(
    (state: RootState) => state.curated
  );

  //   const tabs = ["Thailand", "UAE", "Europe"];

  const [currentImageIndex, setCurrentImageIndex] = useState<
    Record<string, number>
  >({});

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
          className="relative group rounded-3xl overflow-hidden shadow-xl bg-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
        >
          <div className="relative h-[80vh] overflow-hidden group">
            {/* Background Image */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`${property.id}-${currentImageIndex[property.id] || 0}`}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.01 }}
                className="absolute inset-0"
              >
                <Image
                  src={property.images[currentImageIndex[property.id] || 0]}
                  alt={property.name}
                  fill
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
              </motion.div>
            </AnimatePresence>

            {/* Overlay Content at bottom */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent text-white p-8">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-semibold text-[#D4AF37]">
                  {property.name}
                </h3>
                <span className="text-lg font-bold text-white">
                  {property.price}
                </span>
              </div>
              <p className="text-sm text-gray-200">{property.description}</p>
            </div>

            {/* Optional badge */}
            {property.badge && (
              <div className="absolute top-4 right-0 bg-yellow-500 text-white px-3 py-1 rounded-l-xl text-xs font-medium">
                {property.badge}
              </div>
            )}

            {/* Navigation Arrows */}
            <div className="absolute inset-0 flex items-center justify-between p-4">
              <motion.button
                onClick={() => prevImage(property.id)}
                className="text-[#FFFFFFCC]"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronLeft className="w-15 h-15 bg-transparent" />
              </motion.button>
              <motion.button
                onClick={() => nextImage(property.id)}
                className="text-[#FFFFFFCC]"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronRight className="w-15 h-15 bg-transparent" />
              </motion.button>
            </div>

            {/* Image Indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {property.images.map((_, imgIndex) => (
                <button
                  key={imgIndex}
                  onClick={() =>
                    setCurrentImageIndex((prev) => ({
                      ...prev,
                      [property.id]: imgIndex,
                    }))
                  }
                  className={`w-2 h-2 rounded-full ${
                    (currentImageIndex[property.id] || 0) === imgIndex
                      ? "bg-white scale-125"
                      : "bg-white/50 hover:bg-white/75"
                  } transition-all`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      ))}
    </AnimatePresence>
  );
}
