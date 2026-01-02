"use client";

import dynamic from "next/dynamic";

// Client-only components that don't need SSR
const WhatsAppChat = dynamic(() => import("@/components/ui/whatsapp-chat"), {
  loading: () => null,
  ssr: false, // Don't SSR chat widget
});

const PopupEnquiryForm = dynamic(() => import("@/components/client/PopupEnquiryForm"), {
  loading: () => null,
  ssr: false, // Don't SSR popup
});

interface ClientOnlyComponentsProps {
  whatsappPhoneNumber?: string;
  whatsappWebsiteUrl?: string;
  whatsappCompanyName?: string;
}

export default function ClientOnlyComponents({
  whatsappPhoneNumber = "+9867724223",
  whatsappWebsiteUrl = "https://novaa-pi.vercel.app/",
  whatsappCompanyName = "Novaa Global Properties",
}: ClientOnlyComponentsProps) {
  return (
    <>
      <WhatsAppChat
        phoneNumber={whatsappPhoneNumber}
        websiteUrl={whatsappWebsiteUrl}
        companyName={whatsappCompanyName}
      />
      <PopupEnquiryForm />
    </>
  );
}

