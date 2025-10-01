"use client";

import Image from "next/image";
import { useState, useEffect, useCallback, Key } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { setNavigationLoading } from "@/redux/slices/loadingSlice";
import { setLoadingMore } from "@/redux/slices/collectionSlice";
import useEmblaCarousel from "embla-carousel-react";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Autoplay from "embla-carousel-autoplay";
import { useNavigationRouter } from "@/hooks/useNavigationRouter";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface CardProps {
  isLocationVisible: boolean;
  displayMode?: "carousel" | "grid";
}

export default function CollectionCard({
  isLocationVisible,
  displayMode = "carousel",
}: CardProps) {
  const router = useNavigationRouter();
  const dispatch = useAppDispatch();
  const {
    selectedRegion,
    categories,
    allProjects,
    collection,
    dataSource,
    loading,
    visibleItemsPerCategory,
    itemsPerPage,
    loadingMore,
  } = useAppSelector((state) => state.curated);

  const [currentImageIndex, setCurrentImageIndex] = useState<
    Record<string, number>
  >({});
  const [cardsPerView, setCardsPerView] = useState(3);

  // Embla Carousel setup
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      slidesToScroll: 1,
      align: "center",
      // containScroll: "trimSnaps",
      breakpoints: {
        "(max-width: 768px)": { slidesToScroll: 1 },
        "(max-width: 1024px)": { slidesToScroll: 1 },
      },
    },
    [Autoplay({ delay: 3000, stopOnInteraction: true })] // Autoplay added
  );

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  // Enhanced navigation with error handling
  const handleNavigation = useCallback(
    (projectSlug: string) => {
      // Validate slug before navigation
      if (
        !projectSlug ||
        typeof projectSlug !== "string" ||
        projectSlug.trim().length === 0
      ) {
        console.error("Invalid project slug for navigation:", projectSlug);
        return;
      }

      dispatch(setNavigationLoading(true));

      // Add a small delay to show loading animation
      setTimeout(() => {
        try {
          const sanitizedSlug = projectSlug.trim();
          router.push(`/project/${sanitizedSlug}`);
        } catch (error) {
          console.error("Navigation error:", error);
          dispatch(setNavigationLoading(false));
        }
        // Loading state will be reset when the new page loads
      }, 100);
    },
    [router, dispatch]
  );

  // Reset loading state when component unmounts or navigation completes
  useEffect(() => {
    return () => {
      dispatch(setNavigationLoading(false));
    };
  }, [dispatch]);

  // Get current projects based on data source
  const { currentProjects, totalProjects } = (() => {
    if (!selectedRegion) return { currentProjects: [], totalProjects: 0 };

    // console.log("Selected region" , selectedRegion)

    const selectedCategory = categories.find(
      (c) => c.name === selectedRegion && c.isActive
    );
    if (!selectedCategory) return { currentProjects: [], totalProjects: 0 };

    let allCategoryProjects: any[] = [];

    if (dataSource === "curated" && collection) {
      allCategoryProjects = collection.items[selectedCategory._id] || [];
    } else {
      let categoryProjects = allProjects.filter(
        (project) =>
          project?.category?._id === selectedCategory._id && project.isActive
      );
      categoryProjects.sort((a, b) => (a.order || 0) - (b.order || 0));
      allCategoryProjects = categoryProjects;
    }

    // Get the number of visible items for this category
    const visibleCount =
      visibleItemsPerCategory[selectedRegion] || itemsPerPage;

    // Return visible projects and total count
    return {
      currentProjects: allCategoryProjects.slice(0, visibleCount),
      totalProjects: allCategoryProjects.length,
    };
  })();

  // Handle Load More functionality
  const handleLoadMore = useCallback(() => {
    dispatch(setLoadingMore(true));

    // Simulate loading delay for better UX
    setTimeout(() => {
      const currentVisible =
        visibleItemsPerCategory[selectedRegion] || itemsPerPage;
      const newVisibleCount = currentVisible + itemsPerPage;

      // Update visible items count
      dispatch({
        type: "curated/loadMoreProjects",
        payload: selectedRegion,
      });

      dispatch(setLoadingMore(false));
    }, 800);
  }, [dispatch, selectedRegion, visibleItemsPerCategory, itemsPerPage]);

  // Check if Load More button should be shown
  const shouldShowLoadMore = () => {
    const visibleCount =
      visibleItemsPerCategory[selectedRegion] || itemsPerPage;
    return displayMode === "grid" && totalProjects > visibleCount;
  };

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
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Embla carousel scroll handlers
  const scrollPrev = useCallback(() => {
    if (!emblaApi) return;

    // Stop autoplay when user interacts
    const autoplay = emblaApi.plugins()?.autoplay;
    autoplay && autoplay.stop();

    emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (!emblaApi) return;

    // Stop autoplay when user interacts
    const autoplay = emblaApi.plugins()?.autoplay;
    autoplay && autoplay.stop();

    emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  const slideWidth =
    cardsPerView === 1 ? "100%" : cardsPerView === 2 ? "50%" : "33.333%";

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
    const prevIndex =
      currentIndex === 0 ? property.images.length - 1 : currentIndex - 1;

    setCurrentImageIndex((prev) => ({
      ...prev,
      [propertyId]: prevIndex,
    }));
  };

  if (currentProjects.length === 0) {
    const emptyMessage =
      dataSource === "curated"
        ? "No curated projects in this category."
        : "No projects available in this category.";

    return (
      <div className="w-full text-center py-12">
        <p className="text-muted-foreground font-josefin">{emptyMessage}</p>
      </div>
    );
  }

  // Project Card Component
  const ProjectCard = ({ property }: { property: any }) => (
    <div className="w-full relative group rounded-3xl overflow-hidden transition-all duration-300 font-josefin">
      <Link
        href={`/project/${property.slug || "invalid-slug"}`}
        className="block group"
        onClick={(e) => {
          // Validate slug before navigation
          if (
            !property.slug ||
            typeof property.slug !== "string" ||
            property.slug.trim().length === 0
          ) {
            e.preventDefault();
            console.error("Invalid project slug:", property.slug);
            return;
          }
        }}
      >
        <div className="relative h-[450px] xl:h-[560px] overflow-hidden group cursor-pointer">
          {/* Background Images */}
          <div className="relative w-full h-full">
            {property.images.map(
              (imageSrc: string | StaticImport, imgIndex: number) => (
                <div
                  key={`${property._id}-${imgIndex}`}
                  className={`absolute inset-0 transition-opacity duration-300 ${
                    (currentImageIndex[property._id] || 0) === imgIndex
                      ? "opacity-100"
                      : "opacity-0"
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
              )
            )}
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
              <div className="flex items-center xl:items-start justify-start gap-2 py-2 px-2 mb-3 w-[60%] xl:min-w-[70%] rounded-[8px] bg-[#CDB04E1A]">
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
                className="description-text text-[#FFFFFF] pt-3 line-clamp-2 mb-4 sm:mb-0"
                dangerouslySetInnerHTML={{ __html: property.description }}
              />
            </div>
          </div>

          {/* Badge */}
          {property.badge && (
            <div
              className="absolute font-josefin top-15 right-0 bg-[#D4AF37] text-background pl-5 pr-4 pt-2 pb-1 rounded-l-[20px] text-lg font-medium z-20"
              style={{
                background:
                  "radial-gradient(117.4% 117.54% at -15.51% 0%, #C3912F 0%, #F5E7A8 16.95%, #C3912F 100%)",
              }}
            >
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
              {property.images.map(
                (_: any, imgIndex: Key | null | undefined) => (
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
                )
              )}
            </div>
          )}
        </div>
      </Link>
    </div>
  );

  // Load More Button Component
  const LoadMoreButton = () => (
    <div className="w-full flex justify-center mt-8">
      <Button
        onClick={handleLoadMore}
        size={"lg"}
        disabled={loadingMore}
        className="cursor-pointer px-8 py-3 bg-primary hover:bg-primary/90 text-background font-josefin text-lg font-medium rounded-full transition-all duration-300 hover:scale-105 disabled:hover:scale-100 disabled:opacity-70 ring-2 ring-primary"
      >
        {loadingMore ? (
          <span className="flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            Loading more...
          </span>
        ) : (
          <span>
            Load More (
            {Math.min(
              itemsPerPage,
              totalProjects -
                (visibleItemsPerCategory[selectedRegion] || itemsPerPage)
            )}{" "}
            more)
          </span>
        )}
      </Button>
    </div>
  );

  // Grid mode rendering
  if (displayMode === "grid") {
    return (
      <div className="w-full">
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {currentProjects.map((property) => (
            <ProjectCard key={property._id} property={property} />
          ))}
        </div>

        {/* Load More Button for Grid Mode */}
        {shouldShowLoadMore() && <LoadMoreButton />}

        {/* Show total count for reference */}
        {displayMode === "grid" && totalProjects > 0 && (
          <div className="text-center mt-4 text-sm text-muted-foreground font-josefin">
            Showing {currentProjects.length} of {totalProjects} projects
          </div>
        )}
      </div>
    );
  }

  // Carousel mode rendering (no Load More for carousel as it shows all items)
  return (
    <div className="w-full relative">
      {currentProjects.length > cardsPerView && (
        <div className="hidden sm:block">
          <button
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            className={`absolute sm:-ml-15 left-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full transition-all duration-200 ${
              canScrollPrev
                ? "bg-primary/90 text-gray-700 hover:bg-primary/80 hover:text-background shadow-lg cursor-pointer"
                : "bg-primary text-gray-400 cursor-not-allowed"
            }`}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={scrollNext}
            disabled={!canScrollNext}
            className={`absolute right-0 sm:-mr-15 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full transition-all duration-200 ${
              canScrollNext
                ? "bg-primary/90 text-gray-700 hover:bg-primary/80 hover:text-background shadow-lg cursor-pointer"
                : "bg-primary text-gray-400 cursor-not-allowed"
            }`}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {currentProjects.map((property) => (
            <div
              key={property._id}
              className="flex-shrink-0"
              style={{ width: slideWidth }}
            >
              <div className="px-3">
                <ProjectCard property={property} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
