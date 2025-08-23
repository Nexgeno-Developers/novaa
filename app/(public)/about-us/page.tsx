import { getBreadcrumbData } from '@/lib/data/getBreadcrumbData';
import { getOurStoryData } from '@/lib/data/getOurStoryData';
import AboutUsClient from './AboutUsClient';

export default async function AboutUsPage() {
    // Fetch all necessary data in parallel for performance
    const [breadcrumbData, ourStoryData] = await Promise.all([
        getBreadcrumbData('about-us'),
        getOurStoryData('about-us')
    ]);
    console.log(breadcrumbData , ourStoryData)
    if (!breadcrumbData || !ourStoryData) {
        return <div>Error: Page content could not be loaded.</div>;
    }

    // Pass all data as props to the client component
    return <AboutUsClient breadcrumbData={breadcrumbData} ourStoryData={ourStoryData} />;
}