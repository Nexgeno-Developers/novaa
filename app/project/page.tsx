"use client";

import Breadcrumbs from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CollectionCard from "@/components/CollectionCard";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setRegion } from "@/redux/slices/collectionSlice";
import RegionTabs from "@/components/RegionTabs";

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
          <div className="flex justify-center items-center mb-10 gap-6 py-3 px-8">
            <RegionTabs />
          </div>
        </div>

        {/* Cards Grid */}
       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 bg-white rounded-3xl gap-6 px-10">

          <CollectionCard isLocationVisible={false} />
          <CollectionCard isLocationVisible={false} />
          <CollectionCard isLocationVisible={false}/>
        </div>
      </section>
    </>
  );
}
