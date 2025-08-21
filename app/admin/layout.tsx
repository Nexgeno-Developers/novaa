import { Josefin_Sans } from "next/font/google";
import { cn } from "@/lib/utils";
import { Providers } from "@/lib/providers";
import { Toaster } from 'sonner'
import AdminLayout from "@/components/admin/AdminLayout";
import { initializeDefaultPages } from '@/app/api/cms/pages/route';

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