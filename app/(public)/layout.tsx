import Navbar from "@/components/client/Navbar";
import Footer from "@/components/client/Footer";
import { getFooterData } from '@/lib/data/getFooterData';

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    const footerData = await getFooterData();

  return (
    <>
      <Navbar />
      {children}
      {footerData && <Footer data={footerData} />}
    </>
  );
}