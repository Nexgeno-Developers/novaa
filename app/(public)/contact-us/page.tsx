import { getBreadcrumbData } from '@/lib/data/getBreadcrumbData';
import { getContactData } from '@/lib/data/getContactData';
import ContactUsClient from './ContactUsClient';

export default async function ContactUsPage() {
    // Fetch all necessary data in parallel for better performance
    const [breadcrumbData, contactData] = await Promise.all([
        getBreadcrumbData('contact-us'),
        getContactData()
    ]);

    // Handle cases where data might not be found
    if (!breadcrumbData || !contactData) {
        return <div>Error: Page content could not be loaded. Please try again later.</div>;
    }

    // Pass all fetched data as props to the client component
    return <ContactUsClient breadcrumbData={breadcrumbData} contactData={contactData} />;
}
