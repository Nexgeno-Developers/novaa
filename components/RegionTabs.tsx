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
    <div className="flex justify-center items-center mb-10 ">
      {regions.map((region) => {
        const isActive = selectedRegion === region;
        const isDisabled = region !== "Thailand";

        return (
          <Button
            key={region}
            onClick={() => dispatch(setRegion(region))}
            disabled={isDisabled}
            variant="ghost"
            className={`font-josefin cursor-pointer text-sm xs:text-base sm:text-[22px] relative rounded-none px-5 sm:px-10 py-6 sm:py-8 font-medium transition border-y-2
              ${
                isActive
                  ? "  border-background  text-[#01292B]"
                  : " border-[#01292B80] border-y-[1.2px]  text-[#01292BCC]"
              }
              hover:text-black`}
          >
            <span className="gap-2">
              {region}
              {isDisabled && (
                <Badge
                  variant="secondary"
                  className="font-josefin absolute font-medium text-background top-1 text-[8px] xs:text-[10px] sm:text-xs py-[0.5px] px-2 rounded-[20px]"
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
