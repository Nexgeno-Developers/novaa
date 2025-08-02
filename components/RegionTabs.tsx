// RegionTabs.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setRegion } from "@/redux/slices/collectionSlice";

const regions = ["Thailand", "UAE", "Europe"];

export default function RegionTabs() {
  const dispatch = useAppDispatch();
  const selectedRegion = useAppSelector(
    (state) => state.curated.selectedRegion
  );

  return (
    <div className="flex justify-center items-center mb-10 gap-4 border-y-2 border-gray-200">
      {regions.map((region) => {
        const isActive = selectedRegion === region;
        const isDisabled = region !== "Thailand";

        return (
          <Button
            key={region}
            onClick={() => dispatch(setRegion(region))}
            disabled={isDisabled}
            variant="ghost"
            className={`font-josefin cursor-pointer text-[22px] relative rounded-none px-5 sm:px-10 py-8 font-medium transition 
              ${
                isActive
                  ? " border-t-gray-400 border-b-black border-y-2 text-[#01292B]"
                  : "border-transparent text-[#01292BCC]"
              }
              hover:text-black`}
          >
            <span className="gap-2">
              {region}
              {isDisabled && (
                <Badge
                  variant="secondary"
                  className="font-josefin absolute font-medium text-background top-0 text-[10px] py-0.5 px-2 rounded-lg uppercase"
                >
                  Soon
                </Badge>
              )}
            </span>
          </Button>
        );
      })}
    </div>
  );
}
