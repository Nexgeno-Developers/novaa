import "./globals.css";
import { 
  Josefin_Sans, 
  Cinzel, 
  Poppins, 
  Source_Code_Pro 
} from "next/font/google";
import { cn } from "@/lib/utils";
import { Providers } from "@/lib/providers";
import { Toaster } from "sonner";

// Optimize fonts with Next.js font optimization
const josefinSans = Josefin_Sans({ 
  subsets: ["latin"],
  variable: "--font-josefin",
  display: "swap",
  preload: true,
});

const cinzel = Cinzel({ 
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: "swap",
  preload: true,
  weight: ["400", "500", "600", "700"],
});

const poppins = Poppins({ 
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
  preload: false, // Only preload if used on initial page
  weight: ["300", "400", "500", "600", "700", "800"],
});

const sourceCodePro = Source_Code_Pro({ 
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  preload: false,
  weight: ["400", "500", "600"],
});

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
      <body className={cn(
        josefinSans.variable,
        cinzel.variable,
        poppins.variable,
        sourceCodePro.variable
      )}>
        <Providers>
          {children}
          <Toaster position="top-right" richColors closeButton />
        </Providers>
      </body>
    </html>
  );
}
