import Navbar from "@/components/client/Navbar";
import Footer from "@/components/client/Footer";
import WhatsAppChat from "@/components/ui/whatsapp-chat";
import PopupEnquiryForm from "@/components/client/PopupEnquiryForm";
import PriceEnquiryCTA from "@/components/client/PriceEnquiryCTA";
import { getFooterData } from "@/lib/data/getFooterData";
import { getNavbarData } from "@/lib/data/getNavbarData";
import LoadingBarWrapper from "@/components/client/LoadingBarWrapper";
import NavigationLoadingProvider from "@/components/client/NavigationLoadingProvider";

// Force dynamic rendering
// export const dynamic = 'force-dynamic';
// export const revalidate = 0;

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [navbarData, footerData] = await Promise.all([
    getNavbarData(),
    getFooterData(),
  ]);

  return (
    <>
      <LoadingBarWrapper>
        <NavigationLoadingProvider>
          {navbarData && <Navbar data={navbarData} />}
          {children}
          {footerData && <Footer data={footerData} />}
          <WhatsAppChat
            phoneNumber="+9867724223"
            websiteUrl="https://novaa-pi.vercel.app/"
            companyName="Novaa Global Properties"
          />
          <PopupEnquiryForm />
          <PriceEnquiryCTA />
        </NavigationLoadingProvider>
      </LoadingBarWrapper>
    </>
  );
}
