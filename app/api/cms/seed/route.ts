import { NextRequest } from "next/server";
import connectDB from "@/lib/mongodb";
import Page from "@/models/Page";
import Section from "@/models/Section";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";
import { Subtitles } from "lucide-react";
import BlogCategory from "@/models/BlogCategory";

// POST - Seed default pages and sections (admin only)
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Verify admin authentication
    // const token = getTokenFromRequest(request);
    // if (!token || !verifyToken(token)) {
    //   return Response.json({ message: 'Unauthorized' }, { status: 401 });
    // }

    // Default pages to create
    const defaultPages = [
      {
        title: "Home",
        slug: "home",
        description: "Main landing page with hero, about, services, and more",
        status: "active",
        order: 1,
      },
      {
        title: "About Us",
        slug: "about-us",
        description: "Company information and story",
        status: "active",
        order: 2,
      },
      {
        title: "Projects",
        slug: "project",
        description: "Our property projects and developments",
        status: "active",
        order: 3,
      },
      {
        title: "Blog",
        slug: "blog",
        description: "Articles and news updates",
        status: "active",
        order: 4,
      },
      {
        title: "Contact Us",
        slug: "contact-us",
        description: "Contact information and inquiry form",
        status: "active",
        order: 5,
      },
    ];

    // Home page sections configuration
    const homePageSections = [
      {
        name: "Hero Section",
        slug: "hero-section",
        type: "hero",
        component: "HeroManager",
        order: 1,
        pageSlug: "home",
        status: "active",
        settings: {
          isVisible: true,
          backgroundColor: "transparent",
          padding: "0",
          margin: "0",
        },
        content: {
          title: "Experience Unparalleled",
          subtitle: "Luxury in Thailand",
          mediaType: "image",
          mediaUrl: "/images/hero.jpg",
        },
      },
      {
        name: "Curated Collection",
        slug: "curated-collection",
        type: "collection",
        component: "CuratedCollectionManager",
        order: 2,
        pageSlug: "home",
        status: "active",
        settings: {
          isVisible: true,
          backgroundColor: "#ffffff",
          padding: "40px 20px",
          margin: "0 auto",
        },
        content: {
          title: "CURATED COLLECTION",
          description:
            "Every property we list is handpicked, backed by deep research, developer due diligence, and real investment potential. If it's here, it's a home worth considering.",
          items: [], // will hold the curated projects you map here
        },
      },
      {
        name: "About Section",
        slug: "about-section",
        type: "about",
        component: "AboutManager",
        order: 2,
        pageSlug: "home",
        status: "active",
        settings: {
          isVisible: true,
          backgroundColor: "#f8f9fa",
          padding: "80px 0",
          margin: "0",
        },
        content: {
          title: "About Us",
          subtitle: "NOVAA",
          description:
            "We are a leading real estate company specializing in premium properties and investment opportunities. We are a leading real estate company specializing in premium properties and investment opportunities.We are a leading real estate company specializing in premium properties and investment opportunities.We are a leading real estate company specializing in premium properties and investment opportunities.We are a leading real estate company specializing in premium properties and investment opportunities.We are a leading real estate company specializing in premium properties and investment opportunities.",
          buttonText: "Discover More",
          bgType: "image",
          bgImage1: "/images/about-bg-with-clouds.png",
          bgImage2: "/images/about-bg-without-cloud.png",
          bgVideo: "",
          topOverlay: true,
          bottomOverlay: true,
        },
      },
      {
        name: "Why Invest Section",
        slug: "why-invest-section",
        type: "why-invest",
        component: "WhyInvestManager",
        order: 3,
        pageSlug: "home",
        status: "active",
        settings: {
          isVisible: true,
          backgroundColor: "white",
          padding: "80px 0",
          margin: "0",
        },
        content: {
          mainTitle: "Why Invest in",
          highlightedTitle: "Phuket Thailand",
          description:
            "With tourism revenue at 497.5 billion in 2024, making Phuket Thailand's top-earning province and a real estate market growing 5-7% per year, now is the time to explore high-potential opportunities in coastal investment.",
          investmentPoints: [
            {
              icon: "/icons/capital.svg",
              title: "Capital Appreciation",
              description:
                "Thailand's property market offers robust long-term growth, with luxury properties in Phuket appreciating by 8-10% annually due to high demand from international buyers and limited supply",
            },
            {
              icon: "/icons/dollar.svg",
              title: "Rental Benefits",
              description:
                "Enjoy high rental yields of 6-8% in prime locations like Phuket and Bangkok, driven by a thriving tourism industry attracting over 40 million visitors yearly.",
            },
            {
              icon: "/icons/location.svg",
              title: "Tourism Boom",
              description:
                "Phuket welcomed 12 million tourists in 2024, fueling demand for luxury accommodations and ensuring strong rental income for investors.",
            },
            {
              icon: "/icons/economy.svg",
              title: "Economic Stability",
              description:
                "Thailand's steady GDP growth and foreigner-friendly policies create a secure environment for investments, supported by world-class infrastructure and healthcare.",
            },
          ],
          images: [
            "/images/invest-one.png",
            "/images/invest-two.png",
            "/images/invest-three.png",
            "/images/invest-four.png",
          ],
        },
      },
      {
        name: "Phuket Properties Section",
        slug: "phuket-properties-section",
        type: "phuket-properties",
        component: "PhuketPropertiesManager",
        order: 4,
        pageSlug: "home",
        status: "active",
        settings: {
          isVisible: true,
          backgroundColor: "#f8f9fa",
          padding: "80px 0",
          margin: "0",
        },
        content: {
          mainHeading: "DISCOVER PRIME PROPERTIES",
          subHeading: "ACROSS PHUKET",
          description:
            "Explore a Curated Selection of Luxury Residences. Whether you're seeking a beachfront retreat, an investment opportunity, or a peaceful escape amidst nature, these developments represent the best of lifestyle and location in Phuket.",
          explorerHeading: "Phuket Explorer",
          explorerDescription:
            "Discover the beauty and development of Phuket Island",
          categories: [
            {
              id: "beaches",
              title: "Beaches Locations",
              icon: "/icons/beach.svg",
              locations: [
                {
                  id: "patong",
                  name: "Patong Beach",
                  image:
                    "https://placehold.co/200x150/C3912F/FFFFFF?text=Patong+Beach",
                  coords: { top: "35%", left: "20%" },
                  icon: "/icons/map-pin.svg",
                },
                {
                  id: "karon",
                  name: "Karon Beach",
                  image:
                    "https://placehold.co/200x150/C3912F/FFFFFF?text=Karon+Beach",
                  coords: { top: "55%", left: "30%" },
                  icon: "/icons/map-pin.svg",
                },
                {
                  id: "kata",
                  name: "Kata Beach",
                  image:
                    "https://placehold.co/200x150/C3912F/FFFFFF?text=Kata+Beach",
                  coords: { top: "60%", left: "50%" },
                  icon: "/icons/map-pin.svg",
                },
                {
                  id: "kamala",
                  name: "Kamala Beach",
                  image:
                    "https://placehold.co/200x150/C3912F/FFFFFF?text=Kamala+Beach",
                  coords: { top: "35%", left: "40%" },
                  icon: "/icons/map-pin.svg",
                },
                {
                  id: "surin",
                  name: "Surin Beach",
                  image:
                    "https://placehold.co/200x150/C3912F/FFFFFF?text=Surin+Beach",
                  coords: { top: "70%", left: "25%" },
                  icon: "/icons/map-pin.svg",
                },
              ],
            },
            {
              id: "projects",
              title: "Projects Locations",
              icon: "/icons/project.svg",
              locations: [
                {
                  id: "origin",
                  name: "Origin Project",
                  image:
                    "https://placehold.co/200x150/01292B/FFFFFF?text=Origin",
                  coords: { top: "35%", left: "20%" },
                  icon: "/icons/map-pin.svg",
                },
                {
                  id: "banyan",
                  name: "Banyan Tree Hub",
                  image:
                    "https://placehold.co/200x150/01292B/FFFFFF?text=Banyan",
                  coords: { top: "35%", left: "45%" },
                  icon: "/icons/map-pin.svg",
                },
                {
                  id: "laguna",
                  name: "Laguna Complex",
                  image:
                    "https://placehold.co/200x150/01292B/FFFFFF?text=Laguna",
                  coords: { top: "60%", left: "50%" },
                  icon: "/icons/map-pin.svg",
                },
                {
                  id: "central",
                  name: "Central Mall",
                  image:
                    "https://placehold.co/200x150/01292B/FFFFFF?text=Central",
                  coords: { top: "70%", left: "25%" },
                  icon: "/icons/map-pin.svg",
                },
                {
                  id: "villas",
                  name: "Island Villas",
                  image:
                    "https://placehold.co/200x150/01292B/FFFFFF?text=Villas",
                  coords: { top: "50%", left: "25%" },
                  icon: "/icons/map-pin.svg",
                },
              ],
            },
            {
              id: "alliance",
              title: "Government Alliance",
              icon: "/icons/alliance.svg",
              locations: [
                {
                  id: "townhall",
                  name: "Phuket Town Hall",
                  image:
                    "https://placehold.co/200x150/5B21B6/FFFFFF?text=Town+Hall",
                  coords: { top: "35%", left: "20%" },
                  icon: "/icons/map-pin.svg",
                },
                {
                  id: "tourism",
                  name: "Tourism Authority",
                  image:
                    "https://placehold.co/200x150/5B21B6/FFFFFF?text=Tourism",
                  coords: { top: "55%", left: "25%" },
                  icon: "/icons/map-pin.svg",
                },
                {
                  id: "marine",
                  name: "Marine Department",
                  image:
                    "https://placehold.co/200x150/5B21B6/FFFFFF?text=Marine",
                  coords: { top: "55%", left: "45%" },
                  icon: "/icons/map-pin.svg",
                },
                {
                  id: "tourism2",
                  name: "Tourism Authority",
                  image:
                    "https://placehold.co/200x150/5B21B6/FFFFFF?text=Tourism",
                  coords: { top: "50%", left: "15%" },
                  icon: "/icons/map-pin.svg",
                },
                {
                  id: "marine2",
                  name: "Marine Department",
                  image:
                    "https://placehold.co/200x150/5B21B6/FFFFFF?text=Marine",
                  coords: { top: "55%", left: "45%" },
                  icon: "/icons/map-pin.svg",
                },
              ],
            },
          ],
        },
      },
      {
        name: "Novaa Advantage Section",
        slug: "advantage-section",
        type: "advantage",
        component: "NovaaAdvantagesManager",
        order: 3,
        pageSlug: "home",
        status: "active",
        settings: {
          isVisible: true,
          backgroundColor: "#ffffff",
          padding: "80px 0",
          margin: "0",
        },
        content: {
          title: "THE NOVAA",
          highlightedTitle: "ADVANTAGE",
          description:
            "At Novaa, we redefine the investment experience by offering end-to-end solutions tailored for HNIs",
          backgroundImage: "/advantage-section-images/background.png",
          logoImage: "/advantage-section-images/logo.png",
          advantages: [
            {
              title: "Scouting Excellence",
              description:
                "<p>We identify prime properties in high-growth areas, ensuring maximum returns and flexibility.</p>",
              icon: "/advantage-section-images/icon-one.png",
              order: 0,
            },
            {
              title: "Freehold & Rental Income Support",
              description:
                "<p>Secure freehold ownership and set up rentals or your rental income with guaranteed returns.</p>",
              icon: "/advantage-section-images/icon-two.png",
              order: 1,
            },
            {
              title: "Unmatched Transparency",
              description:
                "<p>Every transaction is clear and documented, ensuring you gain the complete peace of mind.</p>",
              icon: "/advantage-section-images/icon-three.png",
              order: 2,
            },
            {
              title: "Bureaucratic Ease",
              description:
                "<p>We manage all regulatory processes, so you can focus on enjoying your investment.</p>",
              icon: "/advantage-section-images/icon-four.png",
              order: 3,
            },
            {
              title: "Visa & Legal Assistance",
              description:
                "<p>From residency programs to legal consultations, we provide comprehensive support.</p>",
              icon: "/advantage-section-images/icon-five.png",
              order: 4,
            },
            {
              title: "Expert Curation",
              description:
                "<p>Early property selection and exclusive access to the best developments of the global elite.</p>",
              icon: "/advantage-section-images/icon-six.png",
              order: 5,
            },
          ],
        },
      },
      {
        name: "Testimonials Section",
        slug: "testimonials-section",
        type: "testimonials",
        component: "TestimonialsManager",
        order: 5,
        pageSlug: "home",
        status: "active",
        settings: {
          isVisible: true,
          backgroundColor: "white",
          padding: "80px 0",
          margin: "0",
        },
        content: {
          title: "What Our Clients Say",
          subtitle: "Trusted by Investors Worldwide",
          displayStyle: "carousel",
          autoPlay: true,
          showRatings: true,
          testimonials: [
            {
              id: "t1",
              name: "John Carter",
              role: "Real Estate Investor",
              rating: 5,
              quote:
                "This platform has completely transformed how I manage my investments. Highly recommended!",
              avatar: "/assets/testimonials/john.png",
              order: 1,
              isActive: true,
            },
            {
              id: "t2",
              name: "Emily Johnson",
              role: "Home Buyer",
              rating: 4,
              quote:
                "Smooth experience from start to finish. I found my dream home quickly!",
              avatar: "/assets/testimonials/emily.png",
              order: 2,
              isActive: true,
            },
            {
              id: "t3",
              name: "Michael Lee",
              role: "Property Seller",
              rating: 5,
              quote:
                "The selling process was seamless, and I got the best value for my property.",
              avatar: "/assets/testimonials/michael.png",
              order: 3,
              isActive: true,
            },
          ],
        },
      },
      {
        name: "FAQ Section",
        slug: "faq-section",
        type: "faq",
        component: "FaqManager",
        order: 6,
        pageSlug: "home",
        status: "active",
        settings: {
          isVisible: true,
          backgroundColor: "#f8f9fa",
          padding: "80px 0",
          margin: "0",
        },
        content: {
          title: "Frequently Asked Questions",
          subtitle: "Get answers to common questions",
          layout: "accordion",
          showSearch: true,
          categories: ["General", "Investment", "Legal", "Process"],
          backgroundImage: "/clients/bg.png",
          description: "Here are some frequently asked questions.",
          faqs: [
            {
              question: "What is the first question?",
              answer: "<p>This is the answer to the first question.</p>",
              order: 0,
            },
            {
              question: "What is the second question?",
              answer: "<p>This is the answer to the second question.</p>",
              order: 1,
            },
            {
              question: "What is the third question?",
              answer: "<p>This is the answer to the third question.</p>",
              order: 2,
            },
            {
              question: "What is the fourth question?",
              answer: "<p>This is the answer to the fourth question.</p>",
              order: 3,
            },
          ],
        },
      },
      {
        name: "Investor Insights Section",
        slug: "investor-insights-section",
        type: "insights",
        component: "InvestorInsightsManager",
        order: 7,
        pageSlug: "home",
        status: "active",
        settings: {
          isVisible: true,
          backgroundColor: "white",
          padding: "80px 0",
          margin: "0",
        },
        content: {
          // title: "Investor Insights",
          // subtitle: "Market Analysis & Trends",
          // description:
          //   "Stay informed with our latest market insights and investment opportunities.",

          title: "Insights for the",
          subtitle: "Discerning Investor",
          description:
            "Stay informed with trending stories, industry updates, and thoughtful articles curated just for you.",

          showLatestPosts: true,
          maxPosts: 3,
          categories: ["Market Analysis", "Investment Tips", "Property News"],

          testimonials: [
            {
              quote:
                "Luxury residential properties in 2024 with heavy property demand averaging 25% increase while rental yields in prime areas reached 7.8%, making it a new destination for HNIs.",
              content:
                "Phuket Tourism Market Report 2024: Real Numbers for Savvy Investors",
              designation: "2024 Market Analysis",
              src: "/images/invest-three.png",
              order: 1,
            },
            {
              quote:
                "Commercial real estate opportunities showing 15% growth in Q3 2024, with office spaces in prime locations commanding premium rents.",
              content:
                "Phuket Tourism Market Report 2024: Real Numbers for Savvy Investors",
              designation: "Q3 2024 Report",
              src: "/images/invest-four.png",
              order: 2,
            },
            {
              quote:
                "Sustainable developments and green building initiatives are driving new investment patterns with 20% higher appreciation rates.",
              content:
                "Phuket Tourism Market Report 2024: Real Numbers for Savvy Investors",
              designation: "Green Investment Trends",
              src: "/images/invest-three.png",
              order: 3,
            },
            {
              quote:
                "Smart city developments and infrastructure projects are creating new opportunities for forward-thinking investors.",
              content:
                "Phuket Tourism Market Report 2024: Real Numbers for Savvy Investors",
              designation: "Future Development",
              src: "/images/invest-two.png",
              order: 4,
            },
            {
              quote:
                "Residential townships with integrated amenities showing consistent 12% annual growth in tier-2 cities across India.",
              content:
                "Phuket Tourism Market Report 2024: Real Numbers for Savvy Investors",
              designation: "Growth Markets",
              src: "/images/invest-one.png",
              order: 5,
            },
          ],
        },
      },
    ];

    const aboutPageSections = [
      {
        name: "Breadcrumb",
        slug: "breadcrumb",
        type: "breadcrumb",
        component: "BreadcrumbManager",
        order: 1,
        pageSlug: "about-us",
        status: "active",
        settings: {
          isVisible: true,
          backgroundColor: "transparent",
          padding: "20px 0",
          margin: "0",
        },
        content: {
          title: "About Us",
          description: "",
          backgroundImageUrl: "/images/breadcrumb-about.jpg",
        },
      },
      {
        name: "Our Story",
        slug: "our-story",
        type: "our-story",
        component: "OurStoryManager",
        order: 2,
        pageSlug: "about-us",
        status: "active",
        settings: {
          isVisible: true,
          backgroundColor: "#ffffff",
          padding: "60px 20px",
          margin: "0",
        },
        content: {
          title: "OUR STORY",
          description:
            "<p>We started with a simple vision: to create extraordinary experiences that connect people with the beauty and culture of Thailand. Our journey began over a decade ago, and today we continue to push boundaries in luxury hospitality and real estate development.</p><p>Every project we undertake is a testament to our commitment to excellence, sustainability, and innovation.</p>",
          mediaType: "video",
          mediaUrl: "/images/dummyvid.mp4",
        },
      },
      // Add more about-us sections as needed...
    ];
    const contactPageSections = [
      {
        name: "Breadcrumb",
        slug: "breadcrumb",
        type: "breadcrumb",
        component: "BreadcrumbManager",
        order: 1,
        pageSlug: "contact-us",
        status: "active",
        settings: {
          isVisible: true,
          backgroundColor: "transparent",
          padding: "20px 0",
          margin: "0",
        },
        content: {
          title: "Contact Us",
          description:
            "Get in touch with our team for any inquiries about our luxury properties and investment opportunities.",
          backgroundImageUrl: "/images/bg1.webp",
        },
      },
      {
        name: "Contact Details",
        slug: "contact",
        type: "contact",
        component: "ContactManager",
        order: 2,
        pageSlug: "contact-us",
        status: "active",
        settings: {
          isVisible: true,
          backgroundColor: "#FFFDF5",
          padding: "40px 20px 80px 20px",
          margin: "0",
        },
        content: {
          details: [
            {
              _id: "contact_detail_1",
              icon: "/images/location1.svg",
              title: "Visit Our Office",
              description: "123 Business District, Phuket, Thailand 83000",
            },
            {
              _id: "contact_detail_2",
              icon: "/images/phonenumber.svg",
              title: "Call Us",
              description: "+66 76 123 4567",
            },
            {
              _id: "contact_detail_3",
              icon: "/images/emailid.svg",
              title: "Email Us",
              description: "info@novaaproperties.com",
            },
          ],
          formTitle:
            "<p>We would like to Hear <br><span class='text-primary'>From You</span></p>",
          formDescription:
            "<p>Feel free to reach out with any questions or feedback &mdash; we are here to help!</p>",
          mapImage: "/images/map.webp",
        },
      },
      // Add more contact-us sections as needed...
    ];

    const projectPageSections = [
      {
        name: "Breadcrumb",
        slug: "breadcrumb",
        type: "breadcrumb",
        component: "BreadcrumbManager",
        order: 1,
        pageSlug: "project",
        status: "active",
        settings: {
          isVisible: true,
          backgroundColor: "transparent",
          padding: "20px 0",
          margin: "0",
        },
        content: {
          title: "Our Projects",
          description:
            "Discover our amazing portfolio of luxury properties and investment opportunities.",
          backgroundImageUrl: "/images/bg1.webp",
        },
      },
      {
        name: "Project Content",
        slug: "project-content",
        type: "project", // This matches your sectionComponentMap
        component: "ProjectManager", // You can name this whatever you want for admin display
        order: 2,
        pageSlug: "project",
        status: "active",
        settings: {
          isVisible: true,
          backgroundColor: "#fffef8",
          padding: "40px 0 80px 0", // py-10 sm:py-20
          margin: "0",
        },
        content: {
          // You can add any configuration options here if needed
          displayMode: "grid",
          isLocationVisible: true,
          showRegionTabs: true,
          // Add any other project-specific settings you might want to manage from CMS
        },
      },
      // Add more Project sections as needed...
    ];

    const blogPageSections = [
      {
        name: "Breadcrumb",
        slug: "breadcrumb",
        type: "breadcrumb",
        component: "BreadcrumbManager",
        order: 1,
        pageSlug: "blog",
        status: "active",
        settings: {
          isVisible: true,
          backgroundColor: "transparent",
          padding: "20px 0",
          margin: "0",
        },
        content: {
          title: "Our Blog",
          description:
            "Stay updated with the latest real estate insights, investment tips, and market trends from our experts.",
          backgroundImageUrl: "/images/bg1.webp",
        },
      },
      {
        name: "Blog Content",
        slug: "blog-content",
        type: "blog",
        component: "BlogSectionManager",
        order: 2,
        pageSlug: "blog",
        status: "active",
        settings: {
          isVisible: true,
          backgroundColor: "#F8F6ED",
          padding: "40px 0 80px 0",
          margin: "0",
        },
        content: {
          title: "Latest Insights",
          description:
            "Discover expert insights on real estate investment, market trends, and property management strategies.",
          showCategories: true,
          maxBlogs: 6,
          displayMode: "grid",
          showReadMore: true,
        },
      },
    ];

    // Sample blog categories data
    const defaultBlogCategories = [
      {
        title: "Real Estate Investment",
        slug: "real-estate-investment",
        description:
          "Expert tips and strategies for successful real estate investments",
        isActive: true,
        order: 1,
      },
      {
        title: "Market Trends",
        slug: "market-trends",
        description: "Latest trends and analysis of real estate markets",
        isActive: true,
        order: 2,
      },
      {
        title: "Property Management",
        slug: "property-management",
        description: "Best practices for managing and maintaining properties",
        isActive: true,
        order: 3,
      },
      {
        title: "Location Guides",
        slug: "location-guides",
        description:
          "Comprehensive guides about different investment locations",
        isActive: true,
        order: 4,
      },
      {
        title: "Phuket Properties",
        slug: "phuket-properties",
        description: "Insights specifically about Phuket real estate market",
        isActive: true,
        order: 5,
      },
    ];

    // Create pages if they don't exist
    const createdPages = [];
    for (const pageData of defaultPages) {
      const existingPage = await Page.findOne({ slug: pageData.slug });
      if (!existingPage) {
        const page = new Page(pageData);
        await page.save();
        createdPages.push(page);
      }
    }

    // Create home page sections if they dont exist
    const createdSections = [];
    for (const sectionData of homePageSections) {
      const existingSection = await Section.findOne({
        pageSlug: sectionData.pageSlug,
        slug: sectionData.slug,
      });
      if (!existingSection) {
        const section = new Section(sectionData);
        await section.save();
        createdSections.push(section);
      }
    }

    // Create About Page sections if they dont exist
    for (const sectionData of aboutPageSections) {
      const existingSection = await Section.findOne({
        pageSlug: sectionData.pageSlug,
        slug: sectionData.slug,
      });
      if (!existingSection) {
        const section = new Section(sectionData);
        await section.save();
        createdSections.push(section);
      }
    }

    // Create Contact Us Sections if they dont exist
    for (const sectionData of contactPageSections) {
      const existingSection = await Section.findOne({
        pageSlug: sectionData.pageSlug,
        slug: sectionData.slug,
      });
      if (!existingSection) {
        const section = new Section(sectionData);
        await section.save();
        createdSections.push(section);
      }
    }

    // Create Project Sections if they dont exist
    for (const sectionData of projectPageSections) {
      const existingSection = await Section.findOne({
        pageSlug: sectionData.pageSlug,
        slug: sectionData.slug,
      });
      if (!existingSection) {
        const section = new Section(sectionData);
        await section.save();
        createdSections.push(section);
      }
    }

    // CREATE BLOG SECTIONS - Add this new section
    for (const sectionData of blogPageSections) {
      const existingSection = await Section.findOne({
        pageSlug: sectionData.pageSlug,
        slug: sectionData.slug,
      });
      if (!existingSection) {
        const section = new Section(sectionData);
        await section.save();
        createdSections.push(section);
      }
    }

    // CREATE BLOG CATEGORIES - Add this new section
    const createdCategories = [];
    for (const categoryData of defaultBlogCategories) {
      const existingCategory = await BlogCategory.findOne({
        slug: categoryData.slug,
      });
      if (!existingCategory) {
        const category = new BlogCategory(categoryData);
        await category.save();
        createdCategories.push(category);
      }
    }

    return Response.json({
      message: "Default data seeded successfully",
      created: {
        pages: createdPages.length,
        sections: createdSections.length,
        blogCategories: createdCategories.length,
      },
    });
  } catch (error) {
    console.error("Seeding error:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
