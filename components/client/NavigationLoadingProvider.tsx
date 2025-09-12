"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import { setNavigationLoading } from "@/redux/slices/loadingSlice";

export default function NavigationLoadingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  // Delay handling (to avoid flash)
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startLoading = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      dispatch(setNavigationLoading(true));
    }, 200);
  };

  const stopLoading = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    dispatch(setNavigationLoading(false));
  };

  // 1. Detect <Link> clicks (internal navigation)
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const link = target?.closest("a");

      if (link && link.href.startsWith(window.location.origin)) {
        startLoading();
      }
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  // 2. Stop loader when navigation finishes
  useEffect(() => {
    stopLoading();
  }, [pathname]);

  return <>{children}</>;
}