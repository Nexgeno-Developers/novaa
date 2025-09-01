// components/client/OurStorySection.
"use client";

import React from 'react';
import parse from "html-react-parser";

interface OurStorySectionProps {
  title?: string;
  description?: string;
  mediaType?: "image" | "video";
  mediaUrl?: string;
  [key: string]: unknown;
}

export default function OurStorySection({
  title = "OUR STORY",
  description = "<p>Default story content...</p>",
  mediaType = "video",
  mediaUrl = "/images/dummyvid.mp4",
  ...props
}: OurStorySectionProps) {
  // Simple way to split title like "OUR STORY" into "OUR" and "STORY"
  const titleParts = title.split(" ");
  const firstWord = titleParts.shift();
  const restOfTitle = titleParts.join(" ");

  return (
    <section className="bg-[#FAF4EB] py-10 sm:py-20 text-center">
      <div className="container">
        <h2 className="font-cinzel text-2xl sm:text-3xl lg:text-[50px] leading-snug text-center">
          <span className="font-normal text-[#151515]">{firstWord} </span>
          <span className="font-bold text-[#CDB04E]">{restOfTitle}</span>
        </h2>

        <div className="font-josefin text-center mt-4 text-[#151515] description-text">
          {parse(description)}
        </div>

        {mediaUrl && (
          <div className="mt-12 flex justify-center">
            <div className="w-full rounded-xl overflow-hidden shadow-xl">
              {mediaType === "video" ? (
                <video
                  src={mediaUrl}
                  autoPlay
                  muted
                  playsInline
                  loop
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={mediaUrl}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}