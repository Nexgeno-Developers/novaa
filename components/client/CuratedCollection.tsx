"use client";

import { useEffect } from "react";
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
  [key: string]: unknown;
}

export default function CuratedCollection({
  pageSlug = "home",
  title,
  description,
  isActive,
  items,
  ...props
}: CuratedCollectionProps) {
  const dispatch = useAppDispatch();
  const { collection } = useSelector(
    (state: RootState) => state.curated
  );

  useEffect(() => {
    // Only proceed if we have the required props data
    if (title && description && isActive !== undefined && items) {
      dispatch(resetState());
      
      // Set data source to 'curated' so components know to use curated data
      dispatch(setDataSource('curated'));
      
      // Set the collection data
      const collectionData = {
        title,
        description,
        isActive,
        items,
        ...props
      };
      dispatch(setCuratedCollectionData(collectionData));
      
      // Extract and set categories from the items
      const categories = Object.keys(items).map(categoryId => {
        // Get category info from first item in that category
        const firstItem = items[categoryId]?.[0];
        if (firstItem?.category) {
          return firstItem.category;
        }
        return null;
      }).filter(Boolean);
      
      // Sort categories by order and set them
      const sortedCategories = categories.sort((a, b) => (a.order || 0) - (b.order || 0));
      dispatch(setCategories(sortedCategories));
    }
  }, [dispatch, title, description, isActive, items]);

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
              className="font-cinzel text-2xl lg:text-3xl xl:text-[50px] font-bold mb-2 text-[#D4AF37]"
              dangerouslySetInnerHTML={{ __html: title }}
            />
            <div
              className="font-josefin description-text text-[#303030] max-w-2xl mx-auto text-center lg:text-left"
              dangerouslySetInnerHTML={{ __html: description }}
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