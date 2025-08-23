"use client";

import Image from "next/image";
import Breadcrumbs from "@/components/client/Breadcrumbs";
import parse from "html-react-parser";

// Define TypeScript interfaces for the props for type safety and clarity
interface BreadcrumbData {
  title: string;
  description: string;
  backgroundImageUrl: string;
}

interface ContactDetail {
  _id?: string;
  icon: string;
  title:string;
  description: string;
}

interface ContactData {
  details: ContactDetail[];
  formTitle: string;
  formDescription: string;
  mapImage: string;
}

interface ContactUsClientProps {
  breadcrumbData: BreadcrumbData;
  contactData: ContactData;
}

export default function ContactUsClient({ breadcrumbData, contactData }: ContactUsClientProps) {
  return (
    <>
      <Breadcrumbs
        title={breadcrumbData.title}
        description={breadcrumbData.description}
        backgroundImageUrl={breadcrumbData.backgroundImageUrl}
        pageName="Contact Us"
      />
      <section className="bg-[#FFFDF5] pt-10 sm:py-20">
        <div className="container">
          {/* Top Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-8 sm:mb-20">
            {contactData.details.map((detail, index) => (
              <div key={detail._id || index} className="flex flex-col lg:flex-row items-center gap-4">
                <div className="w-[77px] h-[77px] rounded-[50px] bg-[#CDB04E] flex items-center justify-center shrink-0">
                  <Image
                    src={detail.icon}
                    alt={detail.title}
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                </div>
                <div className="font-josefin max-w-[278px] text-center lg:text-left">
                  <h3 className="text-[#01292B] text-[20px] font-bold leading-[20px] mb-1">
                    {detail.title}
                  </h3>
                  <p className="text-[#01292B] description-text leading-[22px]">
                    {detail.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Form and Map Section */}
          <div className="relative flex flex-col sm:flex-row py-4">
            <div className="rounded-[20px] sm:rounded-l-[20px] overflow-hidden bg-[#01292B] flex flex-col sm:flex-row w-full">
              {/* Map Section */}
              <div className="w-full sm:w-[514px] h-[200px] xs:h-[300px] sm:h-[666px] relative sm:rounded-l-[20px] sm:rounded-r-none">
                <Image
                  src={contactData.mapImage}
                  alt="Map"
                  fill
                  className="object-cover sm:rounded-l-[20px] sm:rounded-r-none"
                />
              </div>

              {/* Form Section */}
              <div className="w-full sm:w-[746px] h-auto sm:h-[666px] px-4 xs:px-6 sm:px-12 pt-10 sm:pt-15 pb-10 flex flex-col justify-center rounded-[20px] bg-[#072D2C]">
                <div className="font-cinzel text-white text-2xl sm:text-[40px] text-center sm:text-left font-bold sm:mb-3">
                  {parse(contactData.formTitle)}
                </div>

                <div className="text-center sm:text-left text-white font-josefin description-text mb-6 max-w-full sm:max-w-[517px]">
                   {parse(contactData.formDescription)}
                </div>

                {/* The form remains static as per your request */}
                <form className="space-y-4 sm:space-y-4 font-josefin text-[14px]">
                  {/* Form inputs... */}
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="text-primary block mb-1 font-normal"
                      >
                        Full Name
                      </label>
                      <input
                        id="name"
                        placeholder="Enter your full name"
                        className="w-full bg-transparent border border-[rgba(255,255,255,0.8)] text-white px-4 py-2 rounded"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="phone"
                        className="text-primary block mb-1 font-normal"
                      >
                        Phone No
                      </label>
                      <input
                        id="phone"
                        placeholder="Enter your phone no"
                        className="w-full bg-transparent border border-[rgba(255,255,255,0.8)] text-white px-4 py-2 rounded"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-primary block mb-1 font-normal">
                        Country of Residence
                      </label>
                      <select
                        className="w-full bg-transparent border border-[#FFFFFFCC] text-white px-4 py-2 rounded focus:bg-background"
                        defaultValue=""
                      >
                        <option value="" disabled>
                          Select your country
                        </option>
                        <option value="thailand">Thailand</option>
                        <option value="uae">UAE</option>
                        <option value="uk">UK</option>
                        <option value="usa">USA</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-primary block mb-1 font-normal">
                        Preferred Investment Location
                      </label>
                      <select
                        className="w-full bg-transparent border border-[#FFFFFFCC] text-white px-4 py-2 rounded focus:bg-background"
                        defaultValue=""
                      >
                        <option value="" disabled>
                          Select your country
                        </option>
                        <option value="thailand">Thailand</option>
                        <option value="uae">UAE</option>
                        <option value="uk">UK</option>
                        <option value="usa">USA</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-primary block mb-1 font-normal">
                      Message (Optional)
                    </label>
                    <textarea
                      placeholder="Tell us about investment goals..."
                      className="w-full bg-transparent border border-[rgba(255,255,255,0.8)] text-white px-4 py-2 rounded min-h-[96px]"
                    />
                  </div>

                  <div className="flex justify-center items-center sm:justify-start">
                    <button
                      type="submit"
                      className="w-[132px] h-[40px] rounded-[10px] border border-[#233C30] bg-gradient-to-br from-[#C3912F] via-[#F5E7A8] to-[#C3912F] hover:bg-[#d8bc59] text-[#01292B] font-josefin font-semibold text-[14px] leading-[100%] text-center cursor-pointer"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
