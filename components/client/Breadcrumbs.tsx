"use client";

import Image from "next/image";
import { Josefin_Sans } from "next/font/google";
import Link from "next/link";
import parse from "html-react-parser";
import { setNavigationLoading } from "@/redux/slices/loadingSlice";
import { useAppDispatch } from "@/redux/hooks";

const josefin = Josefin_Sans({
  weight: "500",
  subsets: ["latin"],
});

// Update the props to accept all the new data
interface BreadcrumbsProps {
  title: string;
  description: string;
  backgroundImageUrl: string;
  pageSlug?: string;
}

// Helper: convert "contact-us" > "Contact Us"
function formatSlug(slug?: string) {
  if (!slug) return "";
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function Breadcrumbs({
  title,
  description,
  backgroundImageUrl,
  pageSlug,
}: BreadcrumbsProps) {
  const dispatch = useAppDispatch();
  const pageName = formatSlug(pageSlug);
  return (
    <section className="relative w-full h-[230px] sm:h-[530px] mt-20 sm:mt-0">
      {/* Dynamic background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(183.79deg, rgba(1, 41, 43, 0) 3.21%, #01292B 91.78%), url('${backgroundImageUrl}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      {/* Optional: Add a semi-transparent overlay to ensure text is readable */}
      {/* <div className="absolute inset-0 bg-black bg-opacity-30"></div> */}

      <div className="relative z-10 h-full w-full flex flex-col items-center justify-center text-white text-center pt-12 px-4">
        {/* Dynamic Title */}
        <h1
          className={`${josefin.className} text-[24px] sm:text-[62px] font-medium leading-[100%] max-w-lg mb-15 sm:mb-0`}
        >
          {title}
        </h1>

        {/* Dynamic Description (rendered from HTML) */}
        <div className="mt-4 text-sm sm:text-lg max-w-2x">
          {parse(description)}
        </div>

        <div className="absolute bottom-4 mb-7 sm:mt-4 flex items-center justify-center pb-2 px-4 sm:px-6 py-2 sm:py-4 rounded-[20px] tracking-[0.5%] bg-[#CDB04E1A] font-josefin capitalize">
          <Link href="/" onClick={() => dispatch(setNavigationLoading(true))}>
            <span className="text-[13px] sm:text-[16px] font-medium text-white cursor-pointer">
              HOME
            </span>
          </Link>
          <Image
            src="/images/home.svg"
            alt="Arrow icon"
            width={16}
            height={16}
            className="mx-3 sm:mb-1"
          />
          {/* Dynamic Page Name */}
          <span className="text-[13px] sm:text-[16px] font-medium text-white">
            {pageName}
          </span>
        </div>
      </div>
    </section>
  );
}
