"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Phone, Mail, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <>
      <footer className="relative w-full bg-[#000000D9] overflow-hidden pt-10 pb-5 sm:pb-10 sm:pt-20">
        <div
          className="absolute inset-0 z-10 bg-cover bg-center"
          style={{
            clipPath: "polygon(0 0, 0 53%, 58% 0)",
            backgroundImage: "url('/footer/bg-one.png')",
          }}
        >
          <div className="absolute inset-0 bg-[#000000D9]"></div>
        </div>

        {/* Layer 3: Second clipped background */}
        <div
          className="absolute inset-0 z-10 bg-cover bg-center"
          style={{
            clipPath: "polygon(0 53%, 58% 0, 100% 0, 0% 100%)",
            backgroundImage: "url('/footer/bg-two.png')",
          }}
        >
          {" "}
          <div className="absolute inset-0 bg-[#000000D9]"></div>
        </div>

        {/* Layer 4: Third clipped background */}
        <div
          className="absolute inset-0 z-10 bg-cover bg-center"
          style={{
            clipPath: "polygon(100% 100%, 100% 0, 0% 100%)",
            backgroundImage: "url('/footer/bg-three.png')",
          }}
        >
          {" "}
          <div className="absolute inset-0 bg-[#000000D9]"></div>
        </div>

        {/* <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" /> */}

        {/* Content */}
        <div className="container mx-auto relative z-40 flex flex-col justify-center items-center text-white ">
          {/* Main Hero Section */}
          <div className=" text-center mb-4 sm:mb-10 lg:mb-16 max-w-5xl">
            <h1 className="font-cinzel text-xl xs:text-2xl sm:text-3xl lg:text-[50px] font-bold mb-4 leading-normal">
              YOUR DREAM HOME IN
            </h1>
            <h2
              className="font-cinzel text-xl xs:text-2xl sm:text-3xl lg:text-[50px] font-bold mb-6 
               bg-gradient-to-r from-[#C3912F] via-[#F5E7A8] to-[#C3912F] 
               bg-clip-text text-transparent"
            >
              PHUKET AWAITS
            </h2>
            <p
              className="font-josefin font-light text-xs xs:text-sm sm:text-base lg:text-lg mb-12 text-[#FFFFFFE5] max-w-2xl mx-auto"
            >
              Live the island life you&apos;ve always imagined - serene,
              luxurious, and yours to own.
            </p>

            {/* CTA Button */}
            <div className="inline-block">
              <button className="group relative bg-[#30303033] border-3 border-[#F0DE9C] text-[#F0DE9C] px-6 py-3 sm:px-8 sm:py-4 rounded-full hover:bg-[#30303033] hover:text-[#ebd78d] transition-all duration-300 flex flex-col items-center gap-1 text-sm sm:text-lg font-medium text-center cursor-pointer">
                <span>Explore</span>
                <span>Your Future</span>
                <span>Home</span>
                <ArrowRight className="w-5 h-5 mt-1 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          </div>

          {/* Footer Content */}
          <div className="w-full max-w-7xl bg-[#01292BCC] rounded-3xl p-8 sm:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* About Us */}
              <div className="lg:col-span-1">
                <h3 className="text-[#CDB04E] text-sm sm:text-xl font-bold mb-2 sm:mb-6">
                  About Us
                </h3>
                <p className="text-[#FFFFFF] text-xs sm:text-sm font-normal leading-loose">
                  is simply dummy text of the printing and typesetting industry.
                  Lorem Ipsum has been the industry&apos;s standard dummy text
                  ever since the 1500s,
                </p>
              </div>

              {/* Quick Links */}
              <div className="lg:col-span-1">
                <h3 className="text-[#CDB04E] text-sm sm:text-xl font-semibold mb-6">
                  Quick Links
                </h3>
                <ul className="space-y-2 sm:space-y-3">
                  <li>
                    <Link
                      href="/"
                      className="text-gray-300 text-xs sm:text-base hover:text-[#CDB04E] transition-colors duration-300 flex items-center gap-2"
                    >
                      <ArrowRight className="w-4 h-4" color="gold" />
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/project"
                      className="text-gray-300 text-xs sm:text-base hover:text-[#CDB04E] transition-colors duration-300 flex items-center gap-2"
                    >
                      <ArrowRight className="w-4 h-4" color="gold" />
                      Projects
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/about-us"
                      className="text-gray-300 text-xs sm:text-base hover:text-[#CDB04E] transition-colors duration-300 flex items-center gap-2"
                    >
                      <ArrowRight className="w-4 h-4" color="gold" />
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/blog"
                      className="text-gray-300 text-xs sm:text-base hover:text-[#CDB04E] transition-colors duration-300 flex items-center gap-2"
                    >
                      <ArrowRight className="w-4 h-4" color="gold" />
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/contact-us"
                      className="text-gray-300 text-xs sm:text-base hover:text-[#CDB04E] transition-colors duration-300 flex items-center gap-2"
                    >
                      <ArrowRight className="w-4 h-4" color="gold" />
                      Contact Us
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Contact Information */}
              <div className="lg:col-span-1">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-white text-lg xs:text-xl sm:text-4xl font-medium">
                      +91 123456789
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-white text-lg xs:text-xl sm:text-3xl font-medium">
                      Demo@gmail.com
                    </span>
                  </div>
                  <h3 className="text-[rgb(205,176,78)] text-sm sm:text-xl font-semibold mt-2 sm:mt-8 sm:mb-4 mb-0">
                    Follow on
                  </h3>
                  <div className="flex gap-2 sm:gap-4">
                    <Link
                      href="#"
                      className="w-10 h-10  rounded-full flex items-center justify-center hover:bg-[#CDB04E] transition-colors duration-300"
                    >
                      <Image
                        src={"/footer/whatsapp.svg"}
                        width={20}
                        height={20}
                        alt="Twitter Logo"
                      />
                    </Link>
                    <Link
                      href="#"
                      className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#CDB04E] transition-colors duration-300"
                    >
                      <Image
                        src={"/footer/facebook.svg"}
                        width={10}
                        height={10}
                        alt="Facebook Logo"
                      />
                    </Link>
                    <Link
                      href="#"
                      className="w-10 h-10  rounded-full flex items-center justify-center hover:bg-[#CDB04E] transition-colors duration-300"
                    >
                      <Image
                        src={"/footer/insta-icon.svg"}
                        width={20}
                        height={20}
                        alt="Instagram Logo"
                      />
                    </Link>
                    <Link
                      href="#"
                      className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#CDB04E] transition-colors duration-300"
                    >
                      <Image
                        src={"/footer/twitter.svg"}
                        width={20}
                        height={20}
                        alt="Twitter Logo"
                      />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              {/* <div className="">
                
              </div> */}
            </div>

            {/* Copyright */}
            <div className="mt-2 pt-2 sm:mt-12 sm:pt-8 border-t border-t-[#CDB04E80] text-center">
              <p className="text-[#FFFFFFCC] text-sm">
                Copyright &copy; Novaa Real Estate | Designed by NEXGENO
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
