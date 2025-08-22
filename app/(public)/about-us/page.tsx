import Breadcrumbs from "@/components/Breadcrumbs";
import { getBreadcrumbData } from '@/lib/data/getBreadcrumbData'; // The new function

export default async function AboutUs() {
    const breadcrumbData = await getBreadcrumbData('about-us');
    // In case data is null
     if (!breadcrumbData) {
        // You could render a fallback or nothing at all
        return <div>Error loading page header.</div>;
    }

  return (
    <>
      {breadcrumbData && (
        <Breadcrumbs
          title={breadcrumbData.title}
          description={breadcrumbData.description}
          backgroundImageUrl={breadcrumbData.backgroundImageUrl}
          pageName="About Us"
        />
      )}
      <section className="bg-[#FAF4EB] py-10 sm:py-20 text-center ">
        <div className="container">
          {/* Our Story Heading */}
          <h2 className="font-cinzel text-2xl sm:text-3xl lg:text-[50px] leading-snug text-center">
            <span className="font-normal text-[#151515]">OUR </span>
            <span className="font-bold text-[#CDB04E]">STORY</span>
          </h2>

          {/* Subtext */}
          <p className="font-josefin text-center mt-4  text-[#151515] description-text">
            is simply dummy text of the printing and typesetting industry. Lorem
            Ipsum has been the industries standard dummy text ever since the
            1500s, when an unknown printer took a galley of type and scrambled
            it to make a type specimen book...
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
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
