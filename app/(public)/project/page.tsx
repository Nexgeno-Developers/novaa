import CollectionCard from "@/components/CollectionCard";
import RegionTabs from "@/components/RegionTabs";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getBreadcrumbData } from '@/lib/data/getBreadcrumbData';

export default async function Project() {
   const breadcrumbData = await getBreadcrumbData('project');
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
                pageName="Project"
              />
            )}{" "}

      <section className="py-10 sm:py-20 bg-[#fffef8]">
        <div className="container">
          <div className="flex flex-col sm:flex-row justify-around items-center">
            {/* Region Tabs */}
            <div className="flex justify-center items-center sm:mb-10 gap-6 py-2 sm:py-3 px-8">
              <RegionTabs />
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 bg-white rounded-3xl gap-6">
            <CollectionCard isLocationVisible={true} />
            <CollectionCard isLocationVisible={true} />
            <CollectionCard isLocationVisible={true} />
          </div>
        </div>
      </section>
    </>
  );
}
