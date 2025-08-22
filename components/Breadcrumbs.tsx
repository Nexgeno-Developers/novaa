// components/Breadcrumbs.tsx (Updated)
"use client";

import Image from "next/image";
import { Josefin_Sans } from "next/font/google";
import Link from "next/link";
import parse from 'html-react-parser'; // You'll need to install this: npm install html-react-parser

const josefin = Josefin_Sans({
  weight: "500",
  subsets: ["latin"],
});

// Update the props to accept all the new data
interface BreadcrumbsProps {
  title: string;
  description: string;
  backgroundImageUrl: string;
  pageName: string; // The name for the current page link, e.g., "About Us"
}

export default function Breadcrumbs({ title, description, backgroundImageUrl, pageName }: BreadcrumbsProps) {
  return (
    <section className="relative w-full h-[438px]">
      {/* Dynamic background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${backgroundImageUrl}')` }}
      />
      {/* Optional: Add a semi-transparent overlay to ensure text is readable */}
      {/* <div className="absolute inset-0 bg-black bg-opacity-30"></div> */}

      <div className="relative z-10 h-full w-full flex flex-col items-center justify-center text-white text-center pt-12 px-4">
        {/* Dynamic Title */}
        <h1
          className={`${josefin.className} text-[62px] font-medium leading-[100%] max-w-lg`}
        >
          {title}
        </h1>
        
        {/* Dynamic Description (rendered from HTML) */}
        <div className="mt-4 text-lg max-w-2xl">
            {parse(description)}
        </div>

        <div className="absolute bottom-4 mb-7 mt-4 flex items-center justify-center pb-2 px-6 py-3 rounded-[20px] backdrop-blur-md bg-[#CDB04E1A]">
          <Link href="/">
            <span className="text-[16px] font-semibold text-white cursor-pointer">
              HOME
            </span>
          </Link>
          <Image
            src="/images/home.svg"
            alt="Arrow icon"
            width={16}
            height={16}
            className="mx-3 mb-1"
          />
          {/* Dynamic Page Name */}
          <span className="text-[16px] font-semibold text-white">
            {pageName.toUpperCase()}
          </span>
        </div>
      </div>
    </section>
  );
}