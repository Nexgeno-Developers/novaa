import Breadcrumbs from "@/components/Breadcrumbs";
import Image from "next/image";

export default function Blogdetails() {
  return (
    <>
      <Breadcrumbs title="Blog Details" />

      <section className="w-full py-10 px-4 sm:pt-25 bg-[#F8F6ED]">
        <div className="container">
          <div className=" flex flex-col lg:flex-row items-start justify-between gap-6 lg:gap-12">
            {/* Left Main Image */}
            <div className="w-full h-[300px] sm:h-[522px] rounded-[20px] overflow-hidden">
              <img
                src="/images/img1.webp"
                alt="Main Blog"
                className="w-full h-full object-cover rounded-[20px]"
              />
            </div>

            {/* Right Blog Highlights */}
            <div className="w-full lg:w-[354px] h-[522px] bg-[#072D2C] border border-[#CDB04E] rounded-[20px] p-4 overflow-y-auto">
              {/* Heading */}
              <h3 className="font-cinzel text-[#CDB04E] text-[20px] pt-6 font-bold leading-[100%] text-left mt-2">
                <span className="text-white">RECENT</span>{" "}
                <span className="text-[#CDB04E]">BLOG</span>
              </h3>

              {/* Gold Border Below Heading */}
              <div className="w-[110px] h-[3px] bg-[#CDB04E] mt-1.5 mb-1.5" />

              {/* Blog items */}
              {[1, 2, 3, 4].map((num) => (
                <div
                  key={num}
                  className="flex items-start gap-3 mb-4 last:mb-0"
                >
                  {/* Small Image */}
                  <img
                    src={`/images/img${num}.webp`}
                    alt={`Blog ${num}`}
                    className="w-[89px] h-[89px] pt-3 object-cover rounded-[15px] flex-shrink-0"
                  />

                  {/* Text content */}
                  <div className="text-white w-full">
                    <p className="text-[18px] pt-3 font-medium leading-[22px]">
                      Lorem Ipsum
                    </p>
                    <p className="text-[10px] text-[#CFCFCF] leading-[13px] mb-1">
                      is simply dummy text
                    </p>
                    <div className="flex items-center gap-[6px]">
                      <Image
                        src="/images/calender.svg"
                        alt="Calendar"
                        width={12}
                        height={12}
                      />
                      <p className="pt-1 text-[10px] text-white leading-[13px]">
                        1/10/2025
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className=" w-full py-10 pt-18">
            <div className="max-w-[841px] ">
              <h2 className="font-cinzel text-2xl sm:text-[35px] leading-[100%] text-[#072D2C] font-bold mb-6">
                Maximizing ROI with Phuket Holiday Homes
              </h2>

              <p className="font-josefin text-[#072D2C] description-text mb-4">
                is simply dummy text of the printing and typesetting industry.
                Lorem Ipsum has been the industry standard dummy text ever since
                the 1500s, when an unknown printer took a galley of type and
                scrambled it to make a type specimen book. It has survived not
                only five centuries, but also the leap into is simply dummy text
                of the printing and typesetting industry. Lorem Ipsum has been
                the industry standard dummy text ever since the 1500s, when an
                unknown printer took a galley of type and scrambled it to make a
                type specimen book. It has survived not only five centuries, but
                also the leap into
              </p>

              <p className="text-[16px] sm:text-lg text-[#072D2C] font-normal leading-[130%] mb-4">
                <strong>
                  is simply dummy text of the printing and typesetting industry.
                </strong>
              </p>

              <p className=" text-[#072D2C]  description-text mb-4">
                is simply dummy text of the printing and typesetting industry.
                Lorem Ipsum has been the industry standard dummy text ever since
                the 1500s, when an unknown printer took a galley of type and
                scrambled it to make a type specimen book. It has survived
              </p>
              <p className="text-[16px] sm:text-lg text-[#072D2C] font-normal leading-[130%] mb-4">
                <strong>
                  is simply dummy text of the printing and typesetting industry.
                </strong>
              </p>

              <p className="text-[#072D2C]  description-text mb-4">
                is simply dummy text of the printing and typesetting industry.
                Lorem Ipsum has been the industry standard dummy text ever since
                the 1500s, when an unknown printer took a galley of type and
                scrambled it to make a type specimen book. It has survived
              </p>
              <p className="text-[16px] sm:text-lg text-[#072D2C] font-normal leading-[130%] mb-4">
                <strong>
                  is simply dummy text of the printing and typesetting industry.
                </strong>
              </p>

              <p className=" text-[#072D2C] description-text mb-4">
                is simply dummy text of the printing and typesetting industry.
                Lorem Ipsum has been the industry standard dummy text ever since
                the 1500s, when an unknown printer took a galley of type and
                scrambled it to make a type specimen book. It has survived
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
