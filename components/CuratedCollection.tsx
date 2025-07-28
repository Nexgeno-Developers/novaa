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
    <section className="py-20 bg-foreground">
      <div className="flex flex-col sm:flex-row justify-center sm:justify-around items-center p-2">
        <div className="mb-10 flex flex-col justify-center items-center sm:items-start text-center sm:text-left">
          <h2 className="font-cinzel text-4xl font-extrabold mb-2 text-[#D4AF37] ">
            CURATED <span className="text-black font-bold">COLLECTION</span>
          </h2>
          <p className="font-josefin font-light text-[#303030] max-w-2xl mx-auto">
          Discover our exclusive portfolio of luxury  homes in Thailand&apos;s most prestigious locations, each offering exceptional returns and unparalleled lifestyle experiences</p>
        </div>

        <div className=" flex flex-col sm:flex-row justify-center items-center mb-10">
          <RegionTabs />
        </div>
      </div>

      <div className="min-h-[50vh] sm:min-h-[80vh] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 bg-white rounded-3xl gap-6 px-10">
        <CollectionCard />
      </div>
    </section>
  );
}
