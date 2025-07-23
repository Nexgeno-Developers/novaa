import Breadcrumbs from "@/components/Breadcrumbs";
import Image from "next/image";
import { Cinzel, Josefin_Sans } from "next/font/google";

const cinzel = Cinzel({ subsets: ["latin"], weight: "700" });
const josefin = Josefin_Sans({ subsets: ["latin"], weight: "400" });

export default function Blogdetails() {
  return (
    <>
      <Breadcrumbs title="Blog Details" />

      <section className="w-full py-10 px-4 bg-[#F8F6ED]">
        <div className="max-w-screen-xl mx-auto flex flex-col lg:flex-row items-start justify-between gap-6 lg:gap-12">
          {/* Left Main Image */}
          <div className="w-full lg:w-[876px] h-[522px] rounded-[20px] overflow-hidden">
            <img
              src="/images/img1.webp"
              alt="Main Blog"
              className="w-full h-full object-cover rounded-[20px]"
            />
          </div>

          {/* Right Blog Highlights */}
          <div className="w-full lg:w-[354px] h-[522px] bg-[#072D2C] border border-[#CDB04E] rounded-[20px] p-4 overflow-y-auto">
            {/* Heading */}
            <h3
              className={`${cinzel.className} text-[#CDB04E] text-[20px] pt-6 font-bold leading-[100%] text-left mt-2`}
            >
        <span className="text-white">RECENT</span>{" "}
  <span className="text-[#CDB04E]">BLOG</span>
</h3>
            {/* Gold Border Below Heading */}
            <div className="w-[110px] h-[3px] bg-[#CDB04E] mt-1.5 mb-1.5 " />

            {/* Blog items */}
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="flex items-start gap-3 mb-4 last:mb-0">
                {/* Small Image */}
                <img
                  src={`/images/img${num}.webp`}
                  alt={`Blog ${num}`}
                  className="w-[89px] h-[89px] pt-3 object-cover rounded-[15px] flex-shrink-0"
                />

                {/* Text content */}
                <div className="text-white w-full">
                  <p className="text-[18px] pt-3 font-medium leading-[22px]">Lorem Ipsum</p>
                  <p
                    className={`${josefin.className} text-[10px] text-[#CFCFCF] leading-[13px] mb-1`}
                  >
                    is simply dummy text
                  </p>
                  <div className="flex items-center gap-[6px]">
                    <Image
                      src="/images/calender.svg"
                      alt="Calendar"
                      width={12}
                      height={12}
                    />
                    <p
                      className={`${josefin.className} pt-1 text-[10px] text-white leading-[13px]`}
                    >
                      1/10/2025
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
