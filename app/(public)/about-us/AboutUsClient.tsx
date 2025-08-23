"use client";

import Breadcrumbs from "@/components/client/Breadcrumbs";
import parse from "html-react-parser";

// Define types for the props for better code quality
interface BreadcrumbData {
  title: string;
  description: string;
  backgroundImageUrl: string;
}

interface OurStoryData {
  title: string;
  description: string;
  mediaType: "image" | "video";
  mediaUrl: string;
}

interface AboutUsClientProps {
  breadcrumbData: BreadcrumbData;
  ourStoryData: OurStoryData;
}

// CLIENT component that handles renderin
export default function AboutUsClient({
  breadcrumbData,
  ourStoryData,
}: AboutUsClientProps) {
  // Simple way to split title like "OUR STORY" into "OUR" and "STORY"
  const titleParts = ourStoryData.title.split(" ");
  const firstWord = titleParts.shift();
  const restOfTitle = titleParts.join(" ");

  return (
    <>
      <Breadcrumbs
        title={breadcrumbData.title}
        description={breadcrumbData.description}
        backgroundImageUrl={breadcrumbData.backgroundImageUrl}
        pageName="About Us"
      />

      <section className="bg-[#FAF4EB] py-10 sm:py-20 text-center">
        <div className="container">
          <h2 className="font-cinzel text-2xl sm:text-3xl lg:text-[50px] leading-snug text-center">
            <span className="font-normal text-[#151515]">{firstWord} </span>
            <span className="font-bold text-[#CDB04E]">{restOfTitle}</span>
          </h2>

          <div className="font-josefin text-center mt-4 text-[#151515] description-text">
            {parse(ourStoryData.description)}
          </div>

          <div className="mt-12 flex justify-center">
            <div className="w-full rounded-xl overflow-hidden shadow-xl">
              {ourStoryData.mediaType === "video" ? (
                <video
                  src={ourStoryData.mediaUrl}
                  autoPlay
                  muted
                  playsInline
                  loop
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={ourStoryData.mediaUrl}
                  alt={ourStoryData.title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
