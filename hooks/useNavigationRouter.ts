"use client";

import { useRouter as useNextRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import { setNavigationLoading } from "@/redux/slices/loadingSlice";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function useNavigationRouter() {
  const router = useNextRouter();
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const isNavigatingRef = useRef(false);

  // Reset loading state when pathname changes
  useEffect(() => {
    if (isNavigatingRef.current) {
      dispatch(setNavigationLoading(false));
      isNavigatingRef.current = false;
    }
  }, [pathname, dispatch]);

  // Also reset after a timeout as a fallback (in case navigation fails or same route is clicked)
  useEffect(() => {
    if (isNavigatingRef.current) {
      const timeout = setTimeout(() => {
        dispatch(setNavigationLoading(false));
        isNavigatingRef.current = false;
      }, 1000); // Reset after 1 second if navigation hasn't completed

      return () => clearTimeout(timeout);
    }
  }, [pathname, dispatch]);

  return {
    ...router,
    push: (href: string, options?: any) => {
      isNavigatingRef.current = true;
      dispatch(setNavigationLoading(true));
      return router.push(href, options);
    },
    replace: (href: string, options?: any) => {
      isNavigatingRef.current = true;
      dispatch(setNavigationLoading(true));
      return router.replace(href, options);
    },
    back: () => {
      isNavigatingRef.current = true;
      dispatch(setNavigationLoading(true));
      return router.back();
    },
    forward: () => {
      isNavigatingRef.current = true;
      dispatch(setNavigationLoading(true));
      return router.forward();
    },
    refresh: () => {
      isNavigatingRef.current = true;
      dispatch(setNavigationLoading(true));
      return router.refresh();
    },
  };
}