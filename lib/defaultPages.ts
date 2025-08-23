import connectDB from "@/lib/mongodb";
import Page from "@/models/Page";
import Section from "@/models/Section";
import { Types } from "mongoose";

export interface SectionType {
  name: string;
  slug: string;
  type: string;
  order: number;
  component: string;
  page?: Types.ObjectId;   // when inserting, will be added
  pageSlug?: string;       // convenience field you’re adding
}

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
export const defaultAboutSections = [
  { name: 'Bread Crumb', slug: 'bread-crumb-about', type: 'breadCrumbAbout', order: 1, component: 'BreadCrumb' },
  { name: 'Our Story', slug: 'our-story', type: 'story', order: 2, component: 'OurStory' },
];
export const defaultContactSections = [
  { name: 'Bread Crumb', slug: 'bread-crumb-contact', type: 'breadCrumbContact', order: 1, component: 'BreadCrumb' },
  { name: 'Info Section', slug: 'info', type: 'info', order: 2, component: 'InfoSection' },
  { name: 'Our Story', slug: 'our story', type: 'story', order: 3, component: 'ContactForm' },
];
export const defaultProjectSection = [
  { name: 'Bread Crumb', slug: 'bread-crumb-project', type: 'breadCrumbProject', order: 1, component: 'BreadCrumb' },
  { name: 'Collection Card', slug: 'collection', type: 'collection', order: 2, component: 'CollectionCard' },
];

export const defaultProjectDetailSection = [
  { name: 'Hero Section', slug: 'hero-project-detail', type: 'heroProjectDetail', order: 1, component: 'ProjectHeroSection' },
  { name: 'Gateway Section', slug: 'gateway', type: 'gateway', order: 2, component: 'GatewaySection' },
  { name: 'Project Highlights', slug: 'project-highlights', type: 'projectHighlights', order: 3, component: 'ProjectHighlights' },
  { name: 'Highlights', slug: 'highlights', type: 'Highlights', order: 4, component: 'Highlights' },
  { name: 'Modern Amenties', slug: 'modern-amenties', type: 'modernAmenties', order: 5, component: 'ModernAmenties' },
  { name: 'Investment Plans', slug: 'investment-plans', type: 'investmentPlans', order: 6, component: 'InvestmentPlans' },
  { name: 'Master Plan', slug: 'master-plan', type: 'masterPlan', order: 7, component: 'Master Plan' },
  { name: 'Contact Form ', slug: 'contact-form', type: 'contactForm', order: 8, component: 'ContactForm' },
];
export const defaultBlogSection = [
  { name: 'Bread Crumb', slug: 'bread-crumb-blog', type: 'breadCrumbBlog', order: 1, component: 'BreadCrumb' },
  { name: 'Blog Section', slug: 'blog', type: 'blog', order: 2, component: 'BlogSection' },
];

export const defaultBlogDetailSection = [
  { name: 'Bread Crumb', slug: 'bread-crumb-blog-detail', type: 'breadCrumbBlogDetail', order: 1, component: 'BreadCrumb' },
  { name: 'Blog Detail', slug: 'blog-detail', type: 'blogDetail', order: 2, component: 'BlogDetailSection' },
  { name: 'Recent Blog', slug: 'recent-blog', type: 'recentBlog', order: 3, component: 'RecentBlogSidebar' },
];


export async function initializeDefaultPages() {
  try {
    await connectDB();

    const existingPages = await Page.countDocuments();
    if (existingPages > 0) {
      console.log("Pages already exist, skipping initialization.");
      return;
    }

    const defaultPages = [
      { title: "Home", slug: "home", description: "Homepage of the website" },
      { title: "About Us", slug: "about-us", description: "About us page" },
      { title: "Projects", slug: "projects", description: "Projects pages" },
      { title: "Project Detail", slug: "project-detail", description: "Project detail page" },
      { title: "Blog", slug: "blog", description: "Blog page" },
      { title: "Blog Detail", slug: "blog-detail", description: "Blog detail page" },
      { title: "Contact Us", slug: "contact-us", description: "Contact us page" },
    ];

    // Create pages
    const createdPages = await Page.insertMany(defaultPages);
    console.log("Default pages created:", createdPages.map(p => p.slug));

    // Helper to insert sections
    const createSections = async (pageSlug: string, sections: SectionType[]) => {
      const page = createdPages.find(p => p.slug === pageSlug);
      if (!page) return;

      const withPageRefs = sections.map(section => ({
        ...section,
        page: page._id,       // attach ObjectId
        pageSlug: page.slug,  // attach slug for convenience
      }));

      await Section.insertMany(withPageRefs);
      console.log(`Sections created for ${pageSlug}`);
    };

    // Attach sections for each page
    await createSections("home", defaultHomeSections);
    await createSections("about-us", defaultAboutSections);
    await createSections("contact-us", defaultContactSections);
    await createSections("projects", defaultProjectSection);
    await createSections("project-detail", defaultProjectDetailSection);
    await createSections("blog", defaultBlogSection);
    await createSections("blog-detail", defaultBlogDetailSection);

    console.log("All Pages and Section have been created successfully")

  } catch (error) {
    console.error("Default pages initialization error:", error);
  }
}