"use client";

import Image from "next/image";
import { Josefin_Sans } from "next/font/google";
import Link from "next/link";
const josefin = Josefin_Sans({
  weight: "500",
  subsets: ["latin"],
});

interface BreadcrumbsProps {
  title: string;
}

export default function Breadcrumbs({ title }: BreadcrumbsProps) {
  return (
    <section className="relative w-full h-[438px]">
      {/* Full background image without opacity */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/bg1.webp')" }}
      />

      {/* Content */}
      <div className="relative z-10 h-full w-full flex flex-col items-center justify-center text-white text-center pt-12  px-4">
        <h1
          className={`${josefin.className} text-[62px] font-medium leading-[100%] w-2xs sm:w-[388px] h-[70px]`}
        >
          {title}
        </h1>

        {/* Breadcrumb */}
        <div className="absolute bottom-4 mb-7 mt-4 flex items-center justify-center pb-2 px-6 py-3 rounded-[20px] backdrop-blur-md  bg-[#CDB04E1A]">
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
            className="mx-3"
          />

          <span className="text-[16px] font-semibold text-white">
            {title.toUpperCase()}
          </span>
        </div>
      </div>
    </section>
  );
}
