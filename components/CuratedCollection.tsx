"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/index";
import CollectionCard from "./CollectionCard";
import RegionTabs from "./RegionTabs";
import { useAppDispatch } from "@/redux/hooks";

export default function CuratedCollection() {
  const dispatch = useAppDispatch();
  const { selectedRegion, allData } = useSelector(
    (state: RootState) => state.curated
  );

  return (
    <section className="py-20 bg-[#fffef8]">
      <div className="flex flex-col sm:flex-row justify-around items-center p-2">
        <div className="text-center mb-10 flex flex-col justify-center items-center">
          <h2 className="text-4xl font-serif mb-2 text-[#D4AF37]">
            CURATED <span className="text-black">COLLECTION</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Discover our exclusive portfolio of luxury homes...
          </p>
        </div>

        <div className=" flex flex-col sm:flex-row justify-center items-center mb-10">
          <RegionTabs />
        </div>
      </div>

      <div className="min-h-[60vh] sm:min-h-[80vh] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 bg-white rounded-3xl gap-6 px-10">
        <CollectionCard />
      </div>
    </section>
  );
}
