"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setRegion, resetVisibleItems } from "@/redux/slices/collectionSlice";
import { setRegionTabLoading } from "@/redux/slices/loadingSlice";
import { useCallback } from "react";

export default function RegionTabs() {
  const dispatch = useAppDispatch();
  const {
    selectedRegion,
    categories,
    allProjects,
    collection,
    dataSource,
    itemsPerPage,
  } = useAppSelector((state) => state.curated);

  const handleRegionChange = useCallback(
    (regionName: string) => {
      if (selectedRegion === regionName) return; // Don't reload if same region

      dispatch(setRegionTabLoading(true));

      // Add a small delay to show the loading animation
      setTimeout(() => {
        dispatch(setRegion(regionName));

        // Reset visible items for the new category to initial count
        dispatch(resetVisibleItems(regionName));

        // Stop loading after a short delay to allow content to render
        setTimeout(() => {
          dispatch(setRegionTabLoading(false));
        }, 300);
      }, 100);
    },
    [dispatch, selectedRegion]
  );

  // Show all active categories (even with 0 projects) and sort by order
  const activeCategories = categories
    .filter((category) => category.isActive)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  if (activeCategories.length === 0) {
    return null;
  }

  return (
    <div className="flex justify-center items-center mb-10 px-4 overflow-x-auto">
      {activeCategories.map((category) => {
        const isActive = selectedRegion === category.name;

        // Calculate project count based on data source
        let projectCount = 0;
        if (dataSource === "curated" && collection) {
          projectCount = collection.items[category._id]?.length || 0;
        } else {
          projectCount = allProjects.filter(
            (project) =>
              project?.category?._id === category._id && project.isActive
          ).length;
        }

        const hasProjects = projectCount > 0;

        return (
          <Button
            key={category._id}
            onClick={() => hasProjects && handleRegionChange(category.name)}
            variant="ghost"
            disabled={!hasProjects}
            className={`font-josefin relative rounded-none px-2 sm:px-10 py-6 sm:py-8 font-medium border-y-2 transition-colors duration-300
              text-sm sm:text-[22px]
              ${
                isActive
                  ? "border-background text-[#01292B]"
                  : "border-[#01292B80] border-y-[1.2px] text-[#01292BCC]"
              }
              ${
                !hasProjects
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer hover:text-[#D4AF37]"
              }`}
          >
            <span
              className={
                hasProjects
                  ? "flex items-center gap-2"
                  : "relative flex items-center"
              }
            >
              {category.name}
              <Badge
                variant="secondary"
                className={
                  hasProjects
                    ? "text-[10px] sm:text-xs absolute top-1 right-2"
                    : "absolute -top-3 -right-12 text-[8px] sm:text-[9px] px-1.5 py-[0.2px] whitespace-nowrap"
                }
              >
                {hasProjects ? projectCount : "Coming Soon"}
              </Badge>
            </span>
          </Button>
        );
      })}
    </div>
  );
}
