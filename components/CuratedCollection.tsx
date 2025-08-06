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
    <section className="py-10 sm:py-20 bg-secondary">
      <div className="container mx-auto flex flex-col lg:flex-row justify-center sm:justify-between items-center p-2 sm:p-0">
        <div className="mb-10 flex flex-col justify-center items-center lg:items-start text-center sm:text-left">
          <h2 className="font-cinzel text-xl xs:text-2xl lg:text-3xl xl:text-[50px] font-bold mb-2 text-[#D4AF37] ">
            CURATED <span className="text-black font-normal">COLLECTION</span>
          </h2>
          <p className="font-josefin text-xs xs:text-sm sm:text-base leading-normal font-light text-[#303030] max-w-2xl mx-auto text-center lg:text-left">
            Discover our exclusive portfolio of luxury homes in Thailand&apos;s
            most prestigious locations, each offering exceptional returns and
            unparalleled lifestyle experiences
          </p>
        </div>

        <div className="flex flex-col sm:flex-row  justify-center items-center mb-0 sm:mb-10">
          <RegionTabs />
        </div>
      </div>
      <div className="container mx-auto">
        <div className="flex flex-col  px-5 xl:px-0 md:flex-row rounded-[20px] gap-6">
          <CollectionCard isLocationVisible={true} />
        </div>
      </div>
    </section>
  );
}
