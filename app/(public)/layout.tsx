import Navbar from "@/components/client/Navbar";
import Footer from "@/components/client/Footer";
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
        </NavigationLoadingProvider>
      </LoadingBarWrapper>
    </>
  );
}
