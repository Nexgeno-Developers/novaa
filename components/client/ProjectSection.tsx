"use client";

import CollectionCard from "@/components/client/CollectionCard";
import RegionTabs from "@/components/client/RegionTabs";
import { useAppDispatch } from "@/redux/hooks";
import { useEffect } from "react";
import {
  resetState,
  setCategories,
  setAllProjects,
  setDataSource,
} from "@/redux/slices/collectionSlice";

interface ProjectSectionProps {
  pageSlug?: string;
  displayMode?: "grid" | "carousel";
  isLocationVisible?: boolean;
  showRegionTabs?: boolean;
  projectsData?: {
    categories: any[];
    projects: any[];
  };
  [key: string]: unknown;
}

export default function ProjectSection({
  pageSlug,
  displayMode = "grid",
  isLocationVisible = true,
  showRegionTabs = true,
  projectsData,
  ...props
}: ProjectSectionProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (projectsData?.categories && projectsData?.projects) {
      // Reset state and set the server-side data
      dispatch(resetState());
      dispatch(setDataSource("all"));
      dispatch(setCategories(projectsData.categories));
      dispatch(setAllProjects(projectsData.projects));
    }
  }, [dispatch, projectsData]);

  // No loading states needed since data comes from props
  if (!projectsData?.categories?.length || !projectsData?.projects?.length) {
    return (
      <section className="py-10 sm:py-20 bg-secondary">
        <div className="container text-center">
          <p className="text-muted-foreground">No projects available.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 sm:py-20 bg-[#fffef8] w-full">
      <div className="container">
        {showRegionTabs && (
          <div className="flex justify-center items-center w-full sm:mb-6">
            <RegionTabs />
          </div>
        )}

        <div className="bg-white rounded-3xl">
          <CollectionCard
            isLocationVisible={isLocationVisible}
            displayMode={displayMode}
          />
        </div>
      </div>
    </section>
  );
}
