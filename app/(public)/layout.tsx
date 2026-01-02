import dynamic from "next/dynamic";
import { getFooterData } from "@/lib/data/getFooterData";
import { getNavbarData } from "@/lib/data/getNavbarData";

// Critical - load immediately
import Navbar from "@/components/client/Navbar";
import LoadingBarWrapper from "@/components/client/LoadingBarWrapper";
import NavigationLoadingProvider from "@/components/client/NavigationLoadingProvider";
import ClientOnlyComponents from "@/components/client/ClientOnlyComponents";

// Non-critical - lazy load below the fold components
const Footer = dynamic(() => import("@/components/client/Footer"), {
  loading: () => null,
}); 
// Fancybox CSS moved to be loaded dynamically where needed to avoid blocking render

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
          <ClientOnlyComponents />
        </NavigationLoadingProvider>
      </LoadingBarWrapper>
    </>
  );
}
