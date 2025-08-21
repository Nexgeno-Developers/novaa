import { Josefin_Sans } from "next/font/google";
import { cn } from "@/lib/utils";
import { Providers } from "@/lib/providers";
import { Toaster } from 'sonner'
import AdminLayout from "@/components/admin/AdminLayout";
import connectDB from "@/lib/mongodb";
import Page from "@/models/Page";
import Section from "@/models/Section";

const josefin_sans = Josefin_Sans({ subsets: ["latin"] });

export const metadata = {
  title: "Admin Panel | Novaa Global Properties",
};

export default async function AdminLayoutPage({
  children,
}: {
  children: React.ReactNode;
}) {
  
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