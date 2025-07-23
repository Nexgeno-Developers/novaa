

import Breadcrumbs from "@/components/Breadcrumbs";
import { Cinzel } from 'next/font/google';
import { Josefin_Sans } from 'next/font/google';

const cinzel = Cinzel({
  weight: ['400', '700'],
  subsets: ['latin'],
});

const josefin = Josefin_Sans({
  weight: '300',
  subsets: ['latin'],
});


export default function AboutUs() {
      return (
           <>
             <Breadcrumbs title="About Us" />
         <section className="bg-[#FAF4EB] pb-16 pt-25 text-center ">
  <div className="container mx-auto px-4">
    {/* Our Story Heading */}
    <h2 className={`text-[40px] leading-[100%] text-center ${cinzel.className}`}>
      <span className="font-normal text-[#151515]">OUR </span>
      <span className="font-bold text-[#CDB04E]">STORY</span>
    </h2>

    {/* Subtext */}
    <p
      className={`max-w-[800px] mx-auto mt-6 text-[16px] leading-[130%] text-[#151515] ${josefin.className} font-light`}
    >
      is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industries
      standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it
      to make a type specimen book...
    </p>

    {/* Full-Width Video */}
    <div className="mt-12 flex justify-center">
      <div className="w-full max-w-[1200px] h-[600px] rounded-xl overflow-hidden shadow-xl">

        <video
          src="/videos/story.mp4" // 🔁 replace with your video path
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
