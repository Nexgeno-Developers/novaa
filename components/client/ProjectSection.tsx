"use client";

import CollectionCard from "@/components/client/CollectionCard";
import RegionTabs from "@/components/client/RegionTabs";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useEffect } from "react";
import { fetchAllProjectsData, resetState } from "@/redux/slices/collectionSlice";
import { Loader2 } from "lucide-react";

interface ProjectSectionProps {
  pageSlug: string;
  displayMode?: "grid" | "carousel";
  isLocationVisible?: boolean;
  showRegionTabs?: boolean;
  // Add any other props that might come from your CMS content
  [key: string]: unknown;
}

export default function ProjectSection({
  pageSlug,
  displayMode = "grid",
  isLocationVisible = true,
  showRegionTabs = true,
  ...props
}: ProjectSectionProps) {
  const dispatch = useAppDispatch();
  const { loading, error, categories, allProjects } = useAppSelector(
    (state) => state.curated
  );

  useEffect(() => {
    // Reset state and fetch all projects data
    dispatch(resetState());
    dispatch(fetchAllProjectsData());
  }, [dispatch]);

  if (loading) {
    return (
      <section className="py-10 sm:py-20 bg-secondary">
        <div className="container flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin mr-2" />
          <span>Loading Projects...</span>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-10 sm:py-20 bg-secondary">
        <div className="container text-center">
          <p className="text-red-500">Error loading projects: {error}</p>
        </div>
      </section>
    );
  }

  if (!categories.length || !allProjects.length) {
    return (
      <section className="py-10 sm:py-20 bg-secondary">
        <div className="container text-center">
          <p className="text-muted-foreground">No projects available.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 sm:py-20 bg-[#fffef8]">
      <div className="container">
        {showRegionTabs && (
          <div className="flex flex-col sm:flex-row justify-around items-center">
            <div className="flex justify-center items-center sm:mb-10 gap-6 py-2 sm:py-3 px-8">
              <RegionTabs />
            </div>
          </div>
        )}

        <div className="bg-white rounded-3xl gap-6 p-6">
          <CollectionCard
            isLocationVisible={isLocationVisible}
            displayMode={displayMode}
            // No maxItems limit for project page - show all projects
          />
        </div>
      </div>
    </section>
  );
}