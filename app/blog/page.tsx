import Image from "next/image";
import Breadcrumbs from "@/components/Breadcrumbs";
import { galleryImages } from "@/lib/data";

export default function Blog() {
  return (
    <>
      <Breadcrumbs title="Blog" />

      <section className="bg-[#FAF4EB] py-16 px-4">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between gap-8">
          {/* Left Column */}
          <div className="flex flex-col gap-10 w-full md:w-1/2">
            {galleryImages.slice(0, 3).map((img, idx) => (
              <div
                key={idx}
                className="relative w-full max-w-[615px] h-[720px] rounded-[40px] overflow-hidden"
              >
                <Image
                  src={img.src}
                  alt={`Gallery ${idx + 1}`}
                  fill
                  className="object-cover rounded-[40px]"
                />
                {/* Overlay */}
                <div className="absolute bottom-0 left-0 p-4 z-10 text-white max-w-[474px]">
                  <h3 className="text-[20px] leading-[126%] font-medium font-[Josefin_Sans]">
                    {img.text}
                  </h3>
                  <div className="w-[363px] h-px bg-[#CDB04E] my-2" />
                  <p className="text-[14px] leading-[130%] font-light font-[Josefin_Sans]">
                    {img.subtext}
                  </p>
                </div>
                <div className="absolute inset-0 bg-black/20" />
              </div>
            ))}
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-10 w-full md:w-1/2">
            {galleryImages.slice(3, 6).map((img, idx) => (
              <div
                key={idx}
                className="relative w-full max-w-[615px] h-[540px] rounded-[40px] overflow-hidden"
              >
                <Image
                  src={img.src}
                  alt={`Gallery ${idx + 4}`}
                  fill
                  className="object-cover rounded-[40px]"
                />
                {/* Overlay */}
                <div className="absolute bottom-0 left-0 p-4 z-10 text-white max-w-[474px]">
                  <h3 className="text-[20px] leading-[126%] font-medium font-[Josefin_Sans]">
                    {img.text}
                  </h3>
                  <div className="w-[363px] h-px bg-[#CDB04E] my-2" />
                  <p className="text-[14px] leading-[130%] font-light font-[Josefin_Sans]">
                    {img.subtext}
                  </p>
                </div>
                <div className="absolute inset-0 bg-black/20" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
