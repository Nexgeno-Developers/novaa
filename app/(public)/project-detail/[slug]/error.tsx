"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ProjectDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Project detail page error:", error);
  }, [error]);

  return (
    <main className="relative min-h-screen flex items-center justify-center bg-foreground">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-primary mb-4">
              Project Not Found
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              The project you're looking for might have been moved, deleted, or
              doesn't exist.
            </p>
          </div>

          <div className="space-y-4">
            <Button onClick={reset} className="w-full">
              Try Again
            </Button>

            <Button variant="outline" asChild className="w-full">
              <Link href="/project">View All Projects</Link>
            </Button>

            <Button variant="ghost" asChild className="w-full">
              <Link href="/">Go Home</Link>
            </Button>
          </div>

          {process.env.NODE_ENV === "development" && (
            <details className="mt-8 text-left">
              <summary className="cursor-pointer text-sm text-muted-foreground">
                Error Details (Development Only)
              </summary>
              <pre className="mt-2 text-xs bg-muted p-4 rounded overflow-auto">
                {error.message}
                {error.stack && `\n\nStack trace:\n${error.stack}`}
              </pre>
            </details>
          )}
        </div>
      </div>
    </main>
  );
}
