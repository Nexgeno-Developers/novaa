"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux";
import { useRouter } from "next/navigation";

// interface CardProps {
//   name: string;
//   image: string;
//   price: string;
// }

export default function CollectionCard() {
  const router = useRouter();

  const { selectedRegion, allData } = useAppSelector(
    (state: RootState) => state.curated
  );

  // const router = useRouter();

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
          <div className="relatives h-[50vh] sm:h-[80vh] overflow-hidden group cursor-pointer" 
            onClick={() => router.push('/project-detail')}
          >
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
              <div className="flex items-center gap-4 justify-between mb-2">
                <h3 className="text-xl font-semibold text-primary border-r-2 border-r-primary pr-10 sm:pr-20">
                  {property.name}
                </h3>
                <span className="text-lg font-bold text-white">
                  {property.price}
                </span>
              </div>
              <p className="text-sm text-gray-200 border-t-2 pt-2 border-t-primary">
                {property.description}
              </p>
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
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage(property.id);
                }}
                className="text-[#FFFFFFCC]"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronLeft className="w-15 h-15 bg-transparent" />
              </motion.button>
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage(property.id)
                }}
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
                  onClick={(e) =>{
                    e.stopPropagation();
                    setCurrentImageIndex((prev ) => ({
                      ...prev,
                      [property.id]: imgIndex,
                    }))}
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
