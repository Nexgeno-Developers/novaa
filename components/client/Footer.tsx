"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FooterData } from "@/redux/slices/footerSlice";
import parse from "html-react-parser";
import { setNavigationLoading } from "@/redux/slices/loadingSlice";
import { useAppDispatch } from "@/redux/hooks";

// Define the component's props
interface FooterProps {
  data: FooterData;
}

export default function Footer({ data }: FooterProps) {
  const dispatch = useAppDispatch();

  const options = {
    replace: (domNode: any) => {
      if (domNode.type === "text") {
        const regex = /\b(nexgeno)\b/gi;
        if (regex.test(domNode.data)) {
          const parts = domNode.data.split(regex);
          return (
            <>
              {parts.map((part: string, index: number): any =>
                regex.test(part) ? (
                  <a
                    key={index}
                    href="https://nexgeno.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors duration-300"
                  >
                    {part}
                  </a>
                ) : (
                  part
                )
              )}
            </>
          );
        }
      }
    },
  };

  // Mapping social names to icon paths
  const socialIconMap: { [key: string]: string } = {
    whatsapp: "/footer/whatsapp.svg",
    facebook: "/footer/facebook.svg",
    instagram: "/footer/insta-icon.svg",
    twitter: "/footer/twitter.svg",
    linkedin: "/footer/linkedin.png",
    snapchat: "/footer/snapchat.png",
    tiktok: "/footer/tiktok.png",
    youtube: "/footer/youtube.png",
    telegram: "/footer/telegram.png",
    pinterest: "/footer/pinterest.png",
    reddit: "/footer/reddit.png",
    discord: "/footer/discord.png",
    tumblr: "/footer/tumblr.png",
    wechat: "/footer/wechat.png",
  };
  // Filter out empty or invalid links
  const validQuickLinks = data.quickLinks.links.filter(
    (link) => link.label.trim() && link.url.trim()
  );

  const validSocialLinks = data.socials.links.filter(
    (link) => link.url.trim() && socialIconMap[link.name]
  );

  return (
    <footer className="relative w-full bg-[#000000D9] overflow-hidden pt-10 pb-5 sm:pb-10 sm:pt-20">
      {/* Dynamic Backgrounds */}
      <div
        className="absolute inset-0 z-10 bg-cover bg-center"
        style={{
          clipPath: "polygon(0 0, 0 53%, 58% 0)",
          backgroundImage: `url('${data.bgImageOne}')`,
        }}
      >
        <div className="absolute inset-0 bg-[#000000D9]"></div>
      </div>
      <div
        className="absolute inset-0 z-10 bg-cover bg-center"
        style={{
          clipPath: "polygon(0 53%, 58% 0, 100% 0, 0% 100%)",
          backgroundImage: `url('${data.bgImageTwo}')`,
        }}
      >
        <div className="absolute inset-0 bg-[#000000D9]"></div>
      </div>
      <div
        className="absolute inset-0 z-10 bg-cover bg-center"
        style={{
          clipPath: "polygon(100% 100%, 100% 0, 0% 100%)",
          backgroundImage: `url('${data.bgImageThree}')`,
        }}
      >
        <div className="absolute inset-0 bg-[#000000D9]"></div>
      </div>

      <div className="container mx-auto relative z-40 flex flex-col justify-center items-center text-white">
        {/* Dynamic Tagline Section */}
        <div className="text-center mb-4 sm:mb-10 lg:mb-16">
          <h1 className="font-cinzel text-2xl sm:text-3xl lg:text-[50px] font-bold mb-4 leading-normal">
            {data.tagline.title}
          </h1>
          <h2 className="font-cinzel text-2xl sm:text-3xl lg:text-[50px] font-bold mb-6 bg-gradient-to-r from-[#C3912F] via-[#F5E7A8] to-[#C3912F] bg-clip-text text-transparent">
            {data.tagline.subtitle}
          </h2>
          <p className="font-josefin description-text mb-12 text-[#FFFFFFE5] max-w-2xl mx-auto">
            {data.tagline.description}
          </p>
          <div className="inline-block">
            <button className="font-josefin group relative bg-[#30303033] border-3 border-[#F0DE9C] text-[#F0DE9C] px-6 py-3 sm:px-8 sm:py-4 rounded-full transition-all duration-300 flex flex-col items-center gap-1 text-base sm:text-lg font-medium text-center cursor-pointer">
              {data?.ctaButtonLines.map((line, i) => (
                <span key={i}>{line}</span>
              ))}
              <ArrowRight className="w-5 h-5 mt-1 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        </div>

        {/* Dynamic Content Box */}
        <div className="container bg-[#01292BCC] rounded-3xl font-josefin">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-6 sm:p-12">
            {/* About Us */}
            <div>
              <h3 className="text-[#CDB04E] text-base sm:text-lg font-bold mb-2 sm:mb-6">
                {data.about.title}
              </h3>
              <div
                className="text-[#FFFFFF] description-text"
                dangerouslySetInnerHTML={{ __html: data.about.description }}
              />
            </div>

            {/* Quick Links - Dynamic */}
            <div>
              <h3 className="text-[#CDB04E] text-base sm:text-lg font-semibold mb-6">
                {data.quickLinks.title}
              </h3>
              {validQuickLinks.length > 0 ? (
                <ul className="space-y-2 sm:space-y-3">
                  {validQuickLinks.map((link, index) => (
                    <li key={`${link.url}-${index}`}>
                      <Link
                        href={link.url}
                        onClick={() => dispatch(setNavigationLoading(true))}
                        className="text-gray-300 text-base sm:text-lg hover:text-[#CDB04E] transition-colors duration-300 flex items-center gap-2"
                      >
                        <ArrowRight className="w-4 h-4" color="gold" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400 text-sm italic">
                  No quick links available
                </p>
              )}
            </div>

            {/* Contact & Socials - Dynamic */}
            <div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <a
                    href={`tel:${data.contact.phone}`}
                    className="text-white text-base sm:text-4xl font-medium hover:text-primary transition-colors duration-300"
                  >
                    {data.contact.phone}
                  </a>
                </div>

                <div className="flex items-center gap-3">
                  <a
                    href={`mailto:${data.contact.email}`}
                    className="text-white text-lg sm:text-[24px] font-medium hover:text-primary transition-colors duration-300"
                  >
                    {data.contact.email}
                  </a>
                </div>

                {/* Social Links - Dynamic */}
                {validSocialLinks.length > 0 && (
                  <>
                    <h3 className="text-[#CDB04E] text-base sm:text-xl font-semibold mt-2 sm:mt-8 sm:mb-4 mb-0">
                      {data.socials.title}
                    </h3>
                    <div className="flex flex-wrap gap-2 sm:gap-4">
                      {validSocialLinks.map((social, index) => (
                        <Link
                          key={`${social.name}-${index}`}
                          onClick={() => dispatch(setNavigationLoading(true))}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="h-10 w-10 sm:w-15 sm:h-15 rounded-full flex items-center justify-center hover:bg-[#CDB04E] transition-colors duration-300"
                          title={`Follow us on ${social.name}`}
                        >
                          <Image
                            src={socialIconMap[social.name]}
                            width={social.name === "facebook" ? 15 : 30}
                            height={social.name === "facebook" ? 15 : 30}
                            alt={`${social.name} logo`}
                          />
                        </Link>
                      ))}
                    </div>
                  </>
                )}

                {validSocialLinks.length === 0 && (
                  <p className="text-gray-400 text-sm italic mt-4">
                    No social links available
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-2 py-2 sm:mt-12 sm:py-8 border-t border-t-[#CDB04E80] text-center">
            <p className="text-[#FFFFFFCC] text-base sm:text-lg">
              {parse(data.copyrightText, options)}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
