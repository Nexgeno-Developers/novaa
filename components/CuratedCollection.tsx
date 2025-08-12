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
      <div className="container">
        <div className=" flex flex-col lg:flex-row justify-center sm:justify-between items-center p-2 sm:p-0">
          <div className="mb-10 flex flex-col justify-center items-center lg:items-start text-center sm:text-left">
            <h2 className="font-cinzel text-xl xs:text-2xl lg:text-3xl xl:text-[50px] font-bold mb-2 text-[#D4AF37] ">
              CURATED <span className="text-black font-normal">COLLECTION</span>
            </h2>
            <p className="font-josefin text-xs xs:text-sm sm:text-base leading-normal font-light text-[#303030] max-w-2xl mx-auto text-center lg:text-left">
             Every property we list is handpicked, backed by deep research, developer due diligence, and real investment potential. If it&apos;s here, it&apos;s a home worth considering.

            
            </p>
          </div>

          <div className="flex flex-col sm:flex-row  justify-center items-center mb-0 sm:mb-10">
            <RegionTabs />
          </div>
        </div>

        <div className="flex flex-col md:flex-row rounded-[20px] gap-6">
          <CollectionCard isLocationVisible={true} />
        </div>
      </div>
    </section>
  );
}
