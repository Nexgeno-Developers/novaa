"use client";

import { Suspense } from "react";
import ThanksPageContent from "./ThanksPageContent";

// Loading component for the suspense fallback
function ThanksPageLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#01292B] via-[#072D2C] to-[#01292B] flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
        <p className="font-josefin text-white/80">Loading...</p>
      </div>
    </div>
  );
}

export default function ThanksPage() {
  return (
    <Suspense fallback={<ThanksPageLoading />}>
      <ThanksPageContent />
    </Suspense>
  );
}