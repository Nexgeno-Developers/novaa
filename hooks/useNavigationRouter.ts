"use client";

import { useRouter as useNextRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import { setNavigationLoading } from "@/redux/slices/loadingSlice";

export function useNavigationRouter() {
  const router = useNextRouter();
  const dispatch = useAppDispatch();

  return {
    ...router,
    push: (href: string, options?: any) => {
      dispatch(setNavigationLoading(true));
      return router.push(href, options);
    },
    replace: (href: string, options?: any) => {
      dispatch(setNavigationLoading(true));
      return router.replace(href, options);
    },
    back: () => {
      dispatch(setNavigationLoading(true));
      return router.back();
    },
    forward: () => {
      dispatch(setNavigationLoading(true));
      return router.forward();
    },
    refresh: () => {
      dispatch(setNavigationLoading(true));
      return router.refresh();
    },
  };
}