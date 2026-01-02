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

// Optimize fonts with Next.js font optimization - self-hosted to avoid render blocking
const josefinSans = Josefin_Sans({ 
  subsets: ["latin"],
  variable: "--font-josefin",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "arial"],
  adjustFontFallback: true,
});

const cinzel = Cinzel({ 
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: "swap", // Critical: Show fallback immediately, swap when font loads
  preload: true, // Preload for faster LCP
  weight: ["400", "500", "600", "700"],
  fallback: ["Georgia", "serif"],
  adjustFontFallback: true,
});

const poppins = Poppins({ 
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
  preload: false, // Only preload if used on initial page
  weight: ["300", "400", "500", "600", "700", "800"],
  fallback: ["system-ui", "arial"],
  adjustFontFallback: true,
});

const sourceCodePro = Source_Code_Pro({ 
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  preload: false,
  weight: ["400", "500", "600"],
  fallback: ["Courier New", "monospace"],
  adjustFontFallback: true,
});

export const metadata = {
  title: "Novaa Global Properties - Luxury Real Estate",
  description: "Luxury real estate in Thailand, UAE, and Europe",
  other: {
    // Optimize font loading
    "font-display": "swap",
  },
  // Performance optimizations
  robots: {
    index: true,
    follow: true,
  },
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
