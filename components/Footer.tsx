"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Phone, Mail, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <>
      <footer className="relative min-h-screen w-full overflow-hidden pb-10 pt-20">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/footer.jpg"
            alt="Phuket Background"
            fill
            className="object-cover"
            priority
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center min-h-screen text-white px-4 sm:px-6 lg:px-8">
          {/* Main Hero Section */}
          <div className=" text-center mb-16 max-w-5xl">
            <h1 className="font-cinzel text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 leading-normal">
              YOUR DREAM HOME IN
            </h1>
            <h2
              className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 
               bg-gradient-to-r from-[#C3912F] via-[#F5E7A8] to-[#C3912F] 
               bg-clip-text text-transparent"
            >
              PHUKET AWAITS
            </h2>
            <p
              className="font-josefin font-light
 text-lg sm:text-xl mb-12 text-[#FFFFFFE5] max-w-2xl mx-auto"
            >
              Live the island life you've always imagined - serene, luxurious,
              and yours to own.
            </p>

            {/* CTA Button */}
            <div className="inline-block">
              <button className="group relative bg-transparent border-2 border-[#F0DE9C] text-[#F0DE9C] px-8 py-4 rounded-full hover:bg-[#F0DE9C] hover:text-black transition-all duration-300 flex flex-col items-center gap-1 text-lg font-medium text-center">
                <span>Explore</span>
                <span>Your Future</span>
                <span>Home</span>
                <ArrowRight className="w-5 h-5 mt-1 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          </div>

          {/* Footer Content */}
          <div className="w-full max-w-7xl bg-[#01292BCC]/90 backdrop-blur-sm rounded-3xl p-8 sm:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* About Us */}
              <div className="lg:col-span-1">
                <h3 className="text-[#CDB04E] text-xl font-bold mb-6">
                  About Us
                </h3>
                <p className="text-[#FFFFFF] text-sm font-normal leading-loose">
                  is simply dummy text of the printing and typesetting industry.
                  Lorem Ipsum has been the industry's standard dummy text ever
                  since the 1500s,
                </p>
              </div>

              {/* Quick Links */}
              <div className="lg:col-span-1">
                <h3 className="text-[#CDB04E] text-xl font-semibold mb-6">
                  Quick Links
                </h3>
                <ul className="space-y-3">
                  <li>
                    <Link
                      href="#"
                      className="text-gray-300 hover:text-[#CDB04E] transition-colors duration-300 flex items-center gap-2"
                    >
                      <ArrowRight className="w-4 h-4" color="gold" />
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-gray-300 hover:text-[#CDB04E] transition-colors duration-300 flex items-center gap-2"
                    >
                      <ArrowRight className="w-4 h-4" color="gold" />
                      Projects
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-gray-300 hover:text-[#CDB04E] transition-colors duration-300 flex items-center gap-2"
                    >
                      <ArrowRight className="w-4 h-4" color="gold" />
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-gray-300 hover:text-[#CDB04E] transition-colors duration-300 flex items-center gap-2"
                    >
                      <ArrowRight className="w-4 h-4" color="gold" />
                      Blogs
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-gray-300 hover:text-[#CDB04E] transition-colors duration-300 flex items-center gap-2"
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
                    <Phone className="w-5 h-5 text-[#CDB04E]" />
                    <span className="text-white text-lg font-medium">
                      +91 123456789
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-[#CDB04E]" />
                    <span className="text-white text-lg font-medium">
                      Demo@gmail.com
                    </span>
                  </div>
                  <h3 className="text-[#CDB04E] text-xl font-semibold mt-8 mb-4">
                    Follow on
                  </h3>
                  <div className="flex gap-4">
                    <Link
                      href="#"
                      className="w-10 h-10 bg-[#CDB04E] rounded-full flex items-center justify-center hover:bg-white transition-colors duration-300"
                    >
                      <MessageCircle className="w-5 h-5 text-[#01292B]" />
                    </Link>
                    <Link
                      href="#"
                      className="w-10 h-10 bg-[#CDB04E] rounded-full flex items-center justify-center hover:bg-white transition-colors duration-300"
                    >
                      <svg
                        className="w-5 h-5 text-[#01292B]"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                      </svg>
                    </Link>
                    <Link
                      href="#"
                      className="w-10 h-10 bg-[#CDB04E] rounded-full flex items-center justify-center hover:bg-white transition-colors duration-300"
                    >
                      <svg
                        className="w-5 h-5 text-[#01292B]"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                      </svg>
                    </Link>
                    <Link
                      href="#"
                      className="w-10 h-10 bg-[#CDB04E] rounded-full flex items-center justify-center hover:bg-white transition-colors duration-300"
                    >
                      <svg
                        className="w-5 h-5 text-[#01292B]"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.161-1.499-.69-2.436-2.878-2.436-4.624 0-3.78 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.749-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              {/* <div className="">
                
              </div> */}
            </div>

            {/* Copyright */}
            <div className="mt-12 pt-8 border-t border-t-[#CDB04E80] border-gray-600 text-center">
              <p className="text-gray-400 text-sm">
              Copyright © Novaa Real Estate | Designed by NEXGENO
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
