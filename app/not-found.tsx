"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Search } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotFound() {
    const router = useRouter()
  return (
    <div className="min-h-screen admin-theme bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Animated 404 */}
        <div className="relative mb-8">
          <div
            className="text-9xl font-bold text-gray-200 select-none"
            style={{
              background:
                "radial-gradient(61.54% 61.54% at 1.15% 54.63%, #C3912F 0%, #F5E7A8 48.26%, #C3912F 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              color: "transparent",
            }}
          >
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            {/* <div className="w-24 h-24 bg-blue-500 rounded-full animate-pulse opacity-20"></div> */}
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-[#013537]mb-2">
              Page Not Found
            </h1>
            <p className="text-gray-600 text-lg">
              Sorry, we couldn't find the page you're looking for.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              asChild
              className="bg-[#01292b] hover:bg-[#013537] text-[#d4af37]"
            >
              <Link href="/" className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                Go Home
              </Link>
            </Button>

            <Button
              variant="outline"
              className="bg-[#d4af37] hover:bg-[#e5c459] text-[#013537] hover:text-[#00484a] cursor-pointer"
              onClick={() => router.back()}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>

          {/* Quick Links */}
          <div className="pt-4 border-t">
            <p className="text-sm text-gray-500 mb-3">
              Or try these popular pages:
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Link
                href="/"
                className="text-[#d4af37] hover:text-[#deb838] text-sm underline"
              >
                Home
              </Link>
              <Link
                href="/about-us"
                className="text-[#d4af37] hover:text-[#deb838] text-sm underline"
              >
                About Us
              </Link>
              <Link
                href="/project"
                className="text-[#d4af37] hover:text-[#deb838] text-sm underline"
              >
                Projects
              </Link>
              <Link
                href="/blog"
                className="text-[#d4af37] hover:text-[#deb838] text-sm underline"
              >
                Blog
              </Link>
              <Link
                href="/contact-us"
                className="text-[#d4af37] hover:text-[#deb838] text-sm underline"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-purple-200 rounded-full opacity-20 animate-float"></div>
        <div
          className="absolute bottom-10 right-10 w-16 h-16 bg-blue-200 rounded-full opacity-20 animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>
    </div>
  );
}
