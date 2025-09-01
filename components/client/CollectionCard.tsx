"use client";

import Image from "next/image";
import { useState, useEffect, useCallback, Key } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import useEmblaCarousel from 'embla-carousel-react';
import { StaticImport } from "next/dist/shared/lib/get-img-props";
// import Autoplay from 'embla-carousel-autoplay';


interface CardProps {
  isLocationVisible: boolean;
  displayMode?: 'carousel' | 'grid';
}

export default function CollectionCard({ 
  isLocationVisible, 
  displayMode = 'carousel'
}: CardProps) {
  const router = useRouter();
  const { selectedRegion, categories, allProjects, collection, dataSource } = useAppSelector((state) => state.curated);

  const [currentImageIndex, setCurrentImageIndex] = useState<Record<string, number>>({});
  const [cardsPerView, setCardsPerView] = useState(3); 

  // Embla Carousel setup
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true,
      slidesToScroll: 1,
      align: 'start',
      containScroll: 'trimSnaps',
      breakpoints: {
        '(max-width: 768px)': { slidesToScroll: 1 },
        '(max-width: 1024px)': { slidesToScroll: 1 },
      }
    }
     // [Autoplay({ delay: 5000, stopOnInteraction: true })]

  );

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  // Get current projects based on data source
  const currentProjects = (() => {
    if (!selectedRegion) return [];
    
    const selectedCategory = categories.find((c) => c.name === selectedRegion && c.isActive);
    if (!selectedCategory) return [];
    
    if (dataSource === 'curated' && collection) {
      // For curated collection, use the selected projects from collection.items
      return collection.items[selectedCategory._id] || [];
    } else {
      // For projects page, use all active projects from the category
      let categoryProjects = allProjects.filter(
        project => project.category._id === selectedCategory._id && project.isActive
      );
      
      // Sort by order
      categoryProjects.sort((a, b) => (a.order || 0) - (b.order || 0));
      
      return categoryProjects;
    }
  })();

  // Handle responsive cards per view
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setCardsPerView(1);
      } else if (width < 1024) {
        setCardsPerView(2);
      } else {
        setCardsPerView(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Embla carousel scroll handlers
  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  const slideWidth = cardsPerView === 1 ? '100%' : cardsPerView === 2 ? '50%' : '33.333%';

  const nextImage = (propertyId: string) => {
    const property = currentProjects.find((p) => p._id === propertyId);
    if (!property) return;

    const currentIndex = currentImageIndex[propertyId] || 0;
    const nextIndex = (currentIndex + 1) % property.images.length;

    setCurrentImageIndex((prev) => ({
      ...prev,
      [propertyId]: nextIndex,
    }));
  };

  const prevImage = (propertyId: string) => {
    const property = currentProjects.find((p) => p._id === propertyId);
    if (!property) return;

    const currentIndex = currentImageIndex[propertyId] || 0;
    const prevIndex = currentIndex === 0 ? property.images.length - 1 : currentIndex - 1;

    setCurrentImageIndex((prev) => ({
      ...prev,
      [propertyId]: prevIndex,
    }));
  };

  if (currentProjects.length === 0) {
    const emptyMessage = dataSource === 'curated' 
      ? "No curated projects in this category." 
      : "No projects available in this category.";
      
    return (
      <div className="w-full text-center py-12">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  // Project Card Component
  const ProjectCard = ({ property }: { property: any }) => (
    <motion.div
      className="w-full relative group rounded-3xl overflow-hidden transition-all duration-300"
    >
      <div
        className="relative h-[450px] xl:h-[560px] overflow-hidden group cursor-pointer"
        onClick={() => router.push(`/project-detail/${property._id}`)}
      >
        {/* Background Images */}
        <div className="relative w-full h-full">
          {property.images.map((imageSrc: string | StaticImport, imgIndex: number) => (
            <div
              key={`${property._id}-${imgIndex}`}
              className={`absolute inset-0 transition-opacity duration-300 ${
                (currentImageIndex[property._id] || 0) === imgIndex 
                  ? 'opacity-100' 
                  : 'opacity-0'
              }`}
            >
              <Image
                src={imageSrc}
                alt={`${property.name} - Image ${imgIndex + 1}`}
                fill
                className="object-cover h-full group-hover:scale-105 transition-all duration-300"
                priority={imgIndex === 0}
                placeholder="empty"
              />
            </div>
          ))}
        </div>

        {/* Dark gradient overlay */}
        <div className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-t from-[#000000] to-[#00000000] z-10"></div>

        {/* Overlay Content */}
        <div className="absolute bottom-0 left-0 right-0 text-white p-4 lg:p-8 z-20">
          <div className="flex items-center gap-4 mb-2">
            <h3 className="text-lg lg:text-[22px] font-medium text-primary border-r-1 border-r-white pr-2 lg:pr-5">
              {property.name}
            </h3>
            <span className="text-base lg:text-lg font-light text-white">
              {property.price}
            </span>
          </div>
          
          {isLocationVisible && (
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
            <div 
              className="description-text text-[#FFFFFF] pt-3 pb-4 xl:pb-2 line-clamp-2"
              dangerouslySetInnerHTML={{ __html: property.description }}
            />
          </div>
        </div>

        {/* Badge */}
        {property.badge && (
          <div className="absolute font-josefin top-15 right-0 bg-[#D4AF37] text-background pl-5 pr-4 pt-2 pb-1 rounded-l-[20px] text-lg font-medium z-20">
            {property.badge}
          </div>
        )}

        {/* Navigation Arrows for Images */}
        {property.images.length > 1 && (
          <div className="absolute inset-0 flex items-center justify-between p-4 lg:opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30">
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                prevImage(property._id);
              }}
              className="cursor-pointer text-[#FFFFFFCC] hover:text-white transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft className="w-[25px] h-[25px] lg:w-10 lg:h-10 bg-transparent" />
            </motion.button>
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                nextImage(property._id);
              }}
              className="cursor-pointer text-[#FFFFFFCC] hover:text-white transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight className="w-[25px] h-[25px] lg:w-10 lg:h-10 bg-transparent" />
            </motion.button>
          </div>
        )}

        {/* Image Indicators */}
        {property.images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-30">
            {property.images.map((_: any, imgIndex: Key | null | undefined) => (
              <button
                key={imgIndex}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex((prev) => ({
                    ...prev,
                    [property._id]: imgIndex,
                  }));
                }}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  (currentImageIndex[property._id] || 0) === imgIndex
                    ? "bg-primary border-1 border-amber-400 scale-125"
                    : "bg-white/50 hover:bg-white/75"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );

  // Grid mode rendering
  if (displayMode === 'grid') {
    return (
      <div className="w-full">
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {currentProjects.map((property) => (
            <ProjectCard key={property._id} property={property} />
          ))}
        </div>
      </div>
    );
  }

  // Carousel mode rendering
  return (
    <div className="w-full relative">
      {currentProjects.length > cardsPerView && (
        <>
          <button
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full transition-all duration-200 ${
              canScrollPrev 
                ? "bg-white/90 text-gray-700 hover:bg-white hover:text-primary shadow-lg cursor-pointer" 
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
            style={{ marginLeft: '-20px' }}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={scrollNext}
            disabled={!canScrollNext}
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full transition-all duration-200 ${
              canScrollNext 
                ? "bg-white/90 text-gray-700 hover:bg-white hover:text-primary shadow-lg cursor-pointer" 
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
            style={{ marginRight: '-20px' }}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {currentProjects.map((property) => (
            <div key={property._id} className="flex-shrink-0 px-3" style={{ width: slideWidth }}>
              <ProjectCard property={property} />
            </div>
          ))}
        </div>
      </div>

      {currentProjects.length > cardsPerView && (
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: Math.max(1, currentProjects.length - cardsPerView + 1) }).map((_, index) => (
            <button
              key={index}
              onClick={() => emblaApi?.scrollTo(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                emblaApi?.selectedScrollSnap() === index
                  ? "bg-primary scale-125"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}