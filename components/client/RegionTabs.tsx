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

        return (
          <Button
            key={category._id}
            onClick={() => handleRegionChange(category.name)}
            variant="ghost"
            disabled={projectCount === 0}
            className={`font-josefin relative rounded-none px-2 sm:px-10 py-6 sm:py-8 font-medium border-y-2 transition-colors duration-300
              ${projectCount === 0 ? "text-sm" : "text-sm sm:text-[22px]"}
              ${
                isActive
                  ? "border-background text-[#01292B]"
                  : "border-[#01292B80] border-y-[1.2px] text-[#01292BCC]"
              }
              ${
                projectCount === 0
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer hover:text-[#D4AF37]"
              }`}
          >
            <span className="flex items-center gap-2">
              {projectCount === 0 ? "Coming Soon" : category.name}
              {projectCount > 0 && (
                <Badge variant="secondary" className="text-[10px] sm:text-xs">
                  {projectCount}
                </Badge>
              )}
            </span>
          </Button>
        );
      })}
    </div>
  );
}
