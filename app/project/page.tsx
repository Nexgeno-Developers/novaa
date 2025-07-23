"use client";

import Breadcrumbs from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CollectionCard from "@/components/CollectionCard";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setRegion } from "@/redux/slices/collectionSlice";

const regions = ["Thailand", "UAE", "Europe"];

export default function Project() {
  const dispatch = useAppDispatch();
  const selectedRegion = useAppSelector((state) => state.curated.selectedRegion);

  return (
    <>
      <Breadcrumbs title="Project" />

      <section className="py-20 bg-[#fffef8]">
        <div className="flex flex-col sm:flex-row justify-around items-center">
          {/* Region Tabs */}
          <div className="flex justify-center items-center mb-10 gap-6 border-y-[3px] border-gray-300 py-3 px-8">
            {regions.map((region) => {
              const isActive = selectedRegion === region;
              const isDisabled = region !== "Thailand";

              return (
                <Button
                  key={region}
                  onClick={() => dispatch(setRegion(region))}
                  disabled={isDisabled}
                  variant="ghost"
                  className={`cursor-pointer relative rounded-none px-6 py-6 text-[20px] sm:text-[22px] font-semibold transition 
                    ${isActive ? "text-black" : "text-black"} hover:text-black`}
                >
                  <span className="relative flex items-center gap-1">
                    {region}
                    {isDisabled && (
                      <Badge
                        variant="secondary"
                        className="absolute -top-3.5 -right-5  text-[#01292B] text-[8px] py-[2px] px-[6px] rounded-sm uppercase bg-gray-200"
                      >
                        Soon
                      </Badge>
                    )}
                  </span>

                  {isActive && (
  <>
    {/* Top black border if active */}
    <div className="absolute -top-[12px] left-0 right-0 h-[2px]  bg-black" />
    {/* Bottom black border if active */}
    <div className="absolute -bottom-[12px] left-0 right-0 h-[2px] bg-black" />
  </>
)}

                </Button>
              );
            })}
          </div>
        </div>

        {/* Cards Grid */}
        <div className="min-h-[80vh] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 bg-white rounded-3xl gap-6 px-10">
          <CollectionCard />
           <CollectionCard />
            <CollectionCard />
             
        </div>
      </section>
    </>
  );
}
