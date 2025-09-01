import Navbar from "@/components/client/Navbar";
import Footer from "@/components/client/Footer";
import { getFooterData } from '@/lib/data/getFooterData';
import { getNavbarData } from '@/lib/data/getNavbarData';

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [navbarData, footerData] = await Promise.all([
    getNavbarData(),
    getFooterData()
  ]);

  return (
    <>
      {navbarData && <Navbar data={navbarData} />}
      {children}
      {footerData && <Footer data={footerData} />}
    </>
  );
}