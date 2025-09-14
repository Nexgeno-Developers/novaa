import "./globals.css";
import { Josefin_Sans } from "next/font/google";
import { cn } from "@/lib/utils";
import { Providers } from "@/lib/providers";
// const josefin_sans = Josefin_Sans({ subsets: ["latin"] });
import { Toaster } from "sonner";

export const metadata = {
  title: "Novaa Global Properties",
  description: "Luxury real estate in Thailand, UAE, and Europe",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          {children}
          <Toaster position="top-right" richColors closeButton />
        </Providers>
      </body>
    </html>
  );
}
