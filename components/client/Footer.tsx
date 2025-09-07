"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FooterData } from "@/redux/slices/footerSlice";
import parse from 'html-react-parser';

// Define the component's props
interface FooterProps {
  data: FooterData;
}

export default function Footer({ data }: FooterProps) {
  // Mapping social names to icon paths
  const socialIconMap: { [key: string]: string } = {
    whatsapp: "/footer/whatsapp.svg",
    facebook: "/footer/facebook.svg",
    instagram: "/footer/insta-icon.svg",
    twitter: "/footer/twitter.svg",
  };

  return (
    <footer className="relative w-full bg-[#000000D9] overflow-hidden pt-10 pb-5 sm:pb-10 sm:pt-20">
        {/* Dynamic Backgrounds */}
        <div className="absolute inset-0 z-10 bg-cover bg-center" style={{ clipPath: "polygon(0 0, 0 53%, 58% 0)", backgroundImage: `url('${data.bgImageOne}')` }}><div className="absolute inset-0 bg-[#000000D9]"></div></div>
        <div className="absolute inset-0 z-10 bg-cover bg-center" style={{ clipPath: "polygon(0 53%, 58% 0, 100% 0, 0% 100%)", backgroundImage: `url('${data.bgImageTwo}')` }}><div className="absolute inset-0 bg-[#000000D9]"></div></div>
        <div className="absolute inset-0 z-10 bg-cover bg-center" style={{ clipPath: "polygon(100% 100%, 100% 0, 0% 100%)", backgroundImage: `url('${data.bgImageThree}')` }}><div className="absolute inset-0 bg-[#000000D9]"></div></div>

        <div className="container mx-auto relative z-40 flex flex-col justify-center items-center text-white">
            {/* Dynamic Tagline Section */}
            <div className="text-center mb-4 sm:mb-10 lg:mb-16">
                <h1 className="font-cinzel text-2xl sm:text-3xl lg:text-[50px] font-bold mb-4 leading-normal">{data.tagline.title}</h1>
                <h2 className="font-cinzel text-2xl sm:text-3xl lg:text-[50px] font-bold mb-6 bg-gradient-to-r from-[#C3912F] via-[#F5E7A8] to-[#C3912F] bg-clip-text text-transparent">{data.tagline.subtitle}</h2>
                <p className="font-josefin description-text mb-12 text-[#FFFFFFE5] max-w-2xl mx-auto">{data.tagline.description}</p>
                <div className="inline-block">
                    <button className="font-josefin group relative bg-[#30303033] border-3 border-[#F0DE9C] text-[#F0DE9C] px-6 py-3 sm:px-8 sm:py-4 rounded-full transition-all duration-300 flex flex-col items-center gap-1 text-base sm:text-lg font-medium text-center cursor-pointer">
                        {data?.ctaButtonLines.map((line, i) => <span key={i}>{line}</span>)}
                        <ArrowRight className="w-5 h-5 mt-1 group-hover:translate-x-1 transition-transform duration-300" />
                    </button>
                </div>
            </div>

            {/* Dynamic Content Box */}
            <div className="container bg-[#01292BCC] rounded-3xl font-josefin">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-6 sm:p-12">
                    {/* About Us */}
                    <div>
                        <h3 className="text-[#CDB04E] text-base sm:text-lg font-bold mb-2 sm:mb-6">{data.about.title}</h3>
                        <div className="text-[#FFFFFF] description-text" dangerouslySetInnerHTML={{ __html: data.about.description }} />
                    </div>
                    {/* Quick Links */}
                    <div>
                        <h3 className="text-[#CDB04E] text-base sm:text-lg font-semibold mb-6">{data.quickLinks.title}</h3>
                        <ul className="space-y-2 sm:space-y-3">
                            {data?.quickLinks?.links?.map((link) => (
                                <li key={link.url}>
                                    <Link href={link.url} className="text-gray-300 text-base sm:text-lg hover:text-[#CDB04E] transition-colors duration-300 flex items-center gap-2">
                                        <ArrowRight className="w-4 h-4" color="gold" />{link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    {/* Contact & Socials */}
                    <div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3"><span className="text-white text-base sm:text-4xl font-medium">{data.contact.phone}</span></div>
                            <div className="flex items-center gap-3"><span className="text-white text-lg sm:text-[24px] font-medium">{data.contact.email}</span></div>
                            <h3 className="text-[#CDB04E] text-base sm:text-xl font-semibold mt-2 sm:mt-8 sm:mb-4 mb-0">{data.socials.title}</h3>
                            <div className="flex gap-2 sm:gap-4">
                                {data.socials.links.map((social) => (
                                    <Link key={social.name} href={social.url} className="h-10 w-10 sm:w-15 sm:h-15 rounded-full flex items-center justify-center hover:bg-[#CDB04E] transition-colors duration-300">
                                        <Image src={socialIconMap[social.name]} width={social.name === 'facebook' ? 15:30} height={social.name === 'facebook' ? 15:30} alt={`${social.name} logo`} />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                {/* Copyright */}
                <div className="mt-2 py-2 sm:mt-12 sm:py-8 border-t border-t-[#CDB04E80] text-center">
                    <p className="text-[#FFFFFFCC] text-base sm:text-lg">{parse(data.copyrightText)}</p>
                </div>
            </div>
        </div>
    </footer>
  );
}