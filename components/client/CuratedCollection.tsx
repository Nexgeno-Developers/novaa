"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/index";
import CollectionCard from "@/components/client/CollectionCard";
import RegionTabs from "@/components/client/RegionTabs";
import { useAppDispatch } from "@/redux/hooks";
import {
  fetchCuratedCollectionData,
  resetState,
} from "@/redux/slices/collectionSlice";
import { Loader2 } from "lucide-react";

interface CuratedCollectionProps {
  pageSlug?: string;
}

export default function CuratedCollection({
  pageSlug = "home",
}: CuratedCollectionProps) {
  const dispatch = useAppDispatch();
  const { collection, loading, error } = useSelector(
    (state: RootState) => state.curated
  );

  useEffect(() => {
    // Reset state and fetch curated collection data
    dispatch(resetState());
    dispatch(fetchCuratedCollectionData(pageSlug));
  }, [dispatch, pageSlug]);

  if (loading) {
    return (
      <section className="py-10 sm:py-20 bg-secondary">
        <div className="container flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin mr-2" />
          <span>Loading curated collection...</span>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-10 sm:py-20 bg-secondary">
        <div className="container text-center">
          <p className="text-red-500">
            Error loading curated collection: {error}
          </p>
        </div>
      </section>
    );
  }

  if (!collection || !collection.isActive) {
    return null;
  }

  return (
    <section className="py-10 sm:py-20 bg-secondary">
      <div className="container">
        <div className="flex flex-col lg:flex-row justify-center sm:justify-between items-center">
          <div className="mb-10 flex flex-col justify-center items-center lg:items-start text-center sm:text-left">
            <h2
              className="font-cinzel text-2xl lg:text-3xl xl:text-[50px] font-bold mb-2 text-[#D4AF37]"
              dangerouslySetInnerHTML={{ __html: collection.title }}
            />
            <div
              className="font-josefin description-text text-[#303030] max-w-2xl mx-auto text-center lg:text-left"
              dangerouslySetInnerHTML={{ __html: collection.description }}
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
