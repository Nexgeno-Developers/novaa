import { Josefin_Sans } from "next/font/google";
import { cn } from "@/lib/utils";
import { Providers } from "@/lib/providers";
import { Toaster } from 'sonner'
import AdminLayout from "@/components/admin/AdminLayout";
import connectDB from "@/lib/mongodb";
import Page from "@/models/Page";
import Section from "@/models/Section";

 // Default sections for home page
export const defaultHomeSections = [
  { name: 'Navigation Bar', slug: 'navbar', type: 'navbar', order: 1, component: 'NavbarSection' },
  { name: 'Hero Section', slug: 'hero', type: 'hero', order: 2, component: 'HeroSection' },
    { name: 'Curated Collection', slug: 'curated-collection', type: 'curated-collection', order: 3, component: 'NavbarSection' },
  { name: 'About Section', slug: 'about', type: 'about', order: 4, component: 'AboutSection' },
  { name: 'Phuket Properties Section', slug: 'properties', type: 'properties', order: 5, component: 'PropertiesSection' },
  { name: 'Why Invest Section', slug: 'why-invest', type: 'why-invest', order: 6, component: 'WhyInvestSection' },
  
  {
    name: 'Nova Advantages Section', slug: 'advantages', type: 'advantages', order: 7, component: 'TestimonialsSection' 
  },
  { name: 'FAQ Section', slug: 'faq', type: 'faq', order: 8, component: 'FaqSection' },
  { name: 'Testimonials Section', slug: 'testimonials', type: 'testimonials', order: 9, component: 'TestimonialsSection' },
  { name: 'Investor Insights Section', slug: 'investor-insights', type: 'investor-insights', order: 10, component: 'InvestorInsightsSection' },
  { name: 'Footer Section', slug: 'footer', type: 'footer', order: 11, component: 'FooterSection' },
];
async function initializeDefaultPages() {
  try {
    await connectDB();
    
    const existingPages = await Page.countDocuments();
    
    if (existingPages === 0) {
      const defaultPages = [
        { title: 'Home', slug: 'home', description: 'Homepage of the website' },
        {title : 'Projects' , slug : 'project' , description : 'Projects pages'},
        { title: 'About Us', slug: 'about-us', description: 'About us page' },
        { title: 'Properties', slug: 'properties', description: 'Properties listing page' },
        { title: 'Blog', slug: 'blog', description: 'Blog page' },
        { title: 'Contact Us', slug: 'contact-us', description: 'Contact us page' },
      ];
      
      // Create pages
      const createdPages = await Page.insertMany(defaultPages);
      
      // Create sections for home page
      const homePage = createdPages.find(p => p.slug === 'home');
      if (homePage) {
        const sections = defaultHomeSections.map(section => ({
          ...section,
          pageSlug: homePage.slug,
        }));
        
        await Section.insertMany(sections);
      }
    }
  } catch (error) {
    console.error('Default pages initialization error:', error);
  }
}

const josefin_sans = Josefin_Sans({ subsets: ["latin"] });

export const metadata = {
  title: "Admin Panel | Novaa Global Properties",
};

export default async function AdminLayoutPage({
  children,
}: {
  children: React.ReactNode;
}) {
      // Initialize default pages on server side
    await initializeDefaultPages();
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(josefin_sans.className)}>
        

        <Providers>
          <AdminLayout>

          {children}
          </AdminLayout>
          <Toaster 
          position="bottom-right"
          richColors
          closeButton
          duration={3000}
        />
        </Providers>
      </body>
    </html>
  );
}