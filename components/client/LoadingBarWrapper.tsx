"use client";

import TopLoadingBar from '@/components/client/TopLoadingBar';
import { useAppSelector } from '@/redux/hooks';

export default function LoadingBarWrapper({ children }: { children: React.ReactNode }) {
  const { isNavigationLoading, isRegionTabLoading } = useAppSelector((state) => state.loading);
  
  const isLoading = isNavigationLoading || isRegionTabLoading;

  return (
    <>
      <TopLoadingBar isLoading={isLoading} />
      {children}
    </>
  );
}