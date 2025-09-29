"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from "lucide-react";

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
  slug?: string;
}

export default function ProjectDetailErrorBoundary({
  error,
  reset,
  slug,
}: ErrorBoundaryProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Project detail page error:", {
      message: error.message,
      stack: error.stack,
      digest: error.digest,
      slug: slug || "unknown",
      timestamp: new Date().toISOString(),
    });
  }, [error, slug]);

  const handleRetry = () => {
    // Clear any cached data and retry
    if (typeof window !== "undefined") {
      // Clear any cached data
      window.location.reload();
    }
    reset();
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 p-4">
      <div className="max-w-md w-full text-center bg-white p-8 rounded-xl shadow-lg border border-slate-200">
        <div className="mb-8">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">
            Project Not Found
          </h1>
          <p className="text-slate-600 mb-6">
            We're having trouble loading this project. This might be a temporary
            issue.
          </p>
        </div>

        <div className="space-y-3">
          <Button
            onClick={handleRetry}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>

          <Button variant="outline" asChild className="w-full">
            <Link href="/project">
              <ArrowLeft className="mr-2 h-4 w-4" />
              View All Projects
            </Link>
          </Button>

          <Button variant="ghost" asChild className="w-full">
            <Link href="/">Go Home</Link>
          </Button>
        </div>

        {process.env.NODE_ENV === "development" && (
          <details className="mt-8 text-left">
            <summary className="cursor-pointer text-sm text-slate-500 hover:text-slate-700">
              Error Details (Development)
            </summary>
            <div className="mt-2 p-4 bg-slate-50 rounded-md text-xs overflow-x-auto">
              <div className="mb-2">
                <strong>Error:</strong> {error.message}
              </div>
              {error.digest && (
                <div className="mb-2">
                  <strong>Digest:</strong> {error.digest}
                </div>
              )}
              {error.stack && (
                <div>
                  <strong>Stack:</strong>
                  <pre className="mt-1 whitespace-pre-wrap">{error.stack}</pre>
                </div>
              )}
            </div>
          </details>
        )}
      </div>
    </main>
  );
}
