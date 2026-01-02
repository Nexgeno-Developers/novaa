"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

interface VirtualTourProps {
  tourUrl: string;
  title?: string;
  height?: string;
}

export default function VirtualTour({
  tourUrl,
  title = "Virtual Tour",
  height = "600px",
}: VirtualTourProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Set a timeout to handle loading state
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!tourUrl) {
    return null;
  }

  return (
    <section className="py-10 sm:py-20 bg-white w-full">
      <div className="container">
        {title && (
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-cinzel font-bold text-primary mb-4">
              {title}
            </h2>
          </div>
        )}

        <div className="relative w-full rounded-2xl overflow-hidden shadow-lg bg-gray-100" style={{ height }}>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-gray-600 font-josefin">Loading virtual tour...</p>
              </div>
            </div>
          )}

          {hasError ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="text-center p-8">
                <p className="text-gray-600 font-josefin mb-4">
                  Unable to load virtual tour. Please try again later.
                </p>
                <a
                  href={tourUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-medium"
                >
                  Open in new window
                </a>
              </div>
            </div>
          ) : (
            <iframe
              src={tourUrl}
              className="w-full h-full border-0"
              allow="fullscreen"
              allowFullScreen
              loading="lazy"
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setHasError(true);
                setIsLoading(false);
              }}
              title={title}
              style={{ minHeight: height }}
            />
          )}
        </div>
      </div>
    </section>
  );
}

