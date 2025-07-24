

import Breadcrumbs from "@/components/Breadcrumbs";


export default function AboutUs() {
      return (
           <>
             <Breadcrumbs title="About Us" />
         <section className="bg-[#FAF4EB] pb-16 pt-25 text-center ">
  <div className="container mx-auto px-4">
    {/* Our Story Heading */}
    <h2 className="text-[40px] leading-[100%] text-center">
      <span className="font-normal text-[#151515]">OUR </span>
      <span className="font-bold text-[#CDB04E]">STORY</span>
    </h2>

    {/* Subtext */}
    <p
      className="lg:max-w-[850px] mx-auto mt-6 text-[16px] text-[#151515] font-light">
      is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industries
      standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it
      to make a type specimen book...
    </p>

    {/* Full-Width Video */}
    <div className="mt-12 flex justify-center">
  <div className="w-full rounded-xl overflow-hidden shadow-xl">
    <video
  src="/images/dummyvid.mp4"
  autoPlay
  muted
  playsInline
  loop
  controls
  className="w-full h-full object-cover"
/>

  </div>
</div>

    </div>
  

  
</section>

           
           </>

      );
}
