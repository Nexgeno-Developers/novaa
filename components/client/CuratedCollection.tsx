"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/index";
import CollectionCard from "@/components/client/CollectionCard";
import RegionTabs from "@/components/client/RegionTabs";
import { useAppDispatch } from "@/redux/hooks";
import {
  setCuratedCollectionData,
  resetState,
  setDataSource,
  setCategories,
  setRegion,
} from "@/redux/slices/collectionSlice";

interface CuratedCollectionProps {
  pageSlug?: string;
  title?: string;
  description?: string;
  isActive?: boolean;
  items?: Record<string, any[]>;
  _categories?: any[]; // Fresh categories from getSectionData
  _projects?: any[]; // All fresh projects from getSectionData
  [key: string]: unknown;
}

export default function CuratedCollection({
  pageSlug = "home",
  title,
  description,
  isActive,
  items,
  _categories,
  _projects,
  ...props
}: CuratedCollectionProps) {
  const dispatch = useAppDispatch();
  const { collection } = useSelector((state: RootState) => state.curated);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Only proceed if we have the required props data
    if (title && description && isActive !== undefined && items) {
      dispatch(resetState());

      // Set data source to 'curated' so components know to use curated data
      dispatch(setDataSource("curated"));

      // Use fresh items data if available, fallback to original items
      const itemsToUse = items;

      // Set the collection data
      const collectionData = {
        title,
        description,
        isActive,
        items: itemsToUse,
        ...props,
      };
      dispatch(setCuratedCollectionData(collectionData));

      // Use fresh categories if available, otherwise extract from items
      let categories = [];

      if (_categories) {
        // DON'T filter - show all active categories
        // Create a copy since _categories is read-only
        categories = [..._categories];

        console.log("Using fresh categories:", {
          allCategories: _categories.map((c) => ({
            id: c._id.toString(),
            name: c.name,
          })),
          itemKeys: Object.keys(itemsToUse),
        });
      } else {
        // Fallback: extract categories from the items
        const categoryMap = new Map();

        Object.keys(itemsToUse).forEach((categoryId) => {
          const firstItem = itemsToUse[categoryId]?.[0];
          if (firstItem?.category) {
            categoryMap.set(
              firstItem.category._id.toString(),
              firstItem.category
            );
          }
        });

        categories = Array.from(categoryMap.values());
      }

      // Sort categories by order and set them
      // Create a copy before sorting to avoid mutation errors
      const sortedCategories = [...categories].sort(
        (a, b) => (a.order || 0) - (b.order || 0)
      );
      dispatch(setCategories(sortedCategories));

      // Set initial region if categories exist
      if (sortedCategories.length > 0 && !collection?.selectedRegion) {
        dispatch(setRegion(sortedCategories[0].name));
      }
    }
  }, [dispatch, title, description, isActive, items, _categories, _projects]);

  // Don't render on server to avoid hydration mismatch
  if (!isMounted) {
    return (
      <section className="py-10 sm:py-20 bg-secondary">
        <div className="container">
          <div className="flex justify-center items-center py-20 h-screen">
            <div className="animate-pulse text-muted-foreground text-lg font-josefin">
              Loading...
            </div>
          </div>
        </div>
      </section>
    );
  }

  // No loading state needed since data comes from props
  if (!title || !isActive) {
    return null;
  }

  return (
    <section className="py-10 sm:py-20 bg-secondary">
      <div className="container">
        <div className="flex flex-col lg:flex-row justify-center sm:justify-between items-center">
          <div className="mb-10 flex flex-col justify-center items-center lg:items-start text-center sm:text-left">
            <h2
              className="font-cinzel text-2xl lg:text-3xl xl:text-[50px] font-bold mb-3 text-[#D4AF37]"
              dangerouslySetInnerHTML={{ __html: title }}
            />
            <div
              className="font-josefin description-text text-[#303030] max-w-2xl mx-auto text-center lg:text-left"
              dangerouslySetInnerHTML={{ __html: description as string }}
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center mb-0 sm:mb-10">
            <RegionTabs />
          </div>
        </div>

        <div className="flex flex-col md:flex-row rounded-[20px] gap-6">
          <CollectionCard isLocationVisible={true} displayMode="carousel" />
        </div>
      </div>
    </section>
  );
}
