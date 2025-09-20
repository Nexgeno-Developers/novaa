// components/client/LoadingSkeletons.tsx
'use client';

import React from 'react';

// Base skeleton component
const Skeleton = ({ className = "", ...props }: { className?: string; [key: string]: any }) => {
  return (
    <div
      className={`animate-pulse bg-gray-200 rounded ${className}`}
      {...props}
    />
  );
};

// Project detail page skeleton
export function ProjectDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section Skeleton */}
      <div className="relative h-96 bg-gray-200">
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-4 max-w-2xl px-4">
            <Skeleton className="h-12 w-64 mx-auto bg-white/20" />
            <Skeleton className="h-6 w-48 mx-auto bg-white/20" />
            <div className="flex gap-4 justify-center mt-8">
              <Skeleton className="h-12 w-32 bg-white/20" />
              <Skeleton className="h-12 w-32 bg-white/20" />
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections Skeleton */}
      <div className="container mx-auto px-4 py-8 space-y-12">
        {/* Gateway Section */}
        <section className="space-y-6">
          <div className="text-center space-y-4">
            <Skeleton className="h-8 w-64 mx-auto" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-16 w-16 mx-auto" />
                <Skeleton className="h-6 w-32 mx-auto" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        </section>

        {/* Highlights Section */}
        <section className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-5 w-5" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                ))}
              </div>
            </div>
            <Skeleton className="h-64 w-full rounded-lg" />
          </div>
        </section>

        {/* Amenities Section */}
        <section className="space-y-6">
          <div className="text-center space-y-4">
            <Skeleton className="h-8 w-80 mx-auto" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-32 w-full rounded-lg" />
                <Skeleton className="h-5 w-full" />
              </div>
            ))}
          </div>
        </section>

        {/* Investment Plans Section */}
        <section className="space-y-6">
          <div className="text-center space-y-4">
            <Skeleton className="h-8 w-72 mx-auto" />
            <Skeleton className="h-6 w-80 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-lg space-y-4">
                <Skeleton className="h-16 w-16 mx-auto" />
                <Skeleton className="h-6 w-32 mx-auto" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-10 w-full rounded" />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

// Blog detail page skeleton
export function BlogDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb Skeleton */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-16" />
            <span className="text-gray-400">/</span>
            <Skeleton className="h-4 w-20" />
            <span className="text-gray-400">/</span>
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <header className="space-y-6">
            <div className="space-y-4">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-6 w-3/4" />
            </div>
            
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
              <div className="ml-auto flex items-center gap-4">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-20" />
              </div>
            </div>
          </header>

          {/* Featured Image */}
          <Skeleton className="h-64 md:h-96 w-full rounded-lg" />

          {/* Content */}
          <article className="space-y-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                {i % 3 === 0 && <div className="py-2" />}
              </div>
            ))}
          </article>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-6 w-16 rounded-full" />
            ))}
          </div>

          {/* Related Posts */}
          <section className="space-y-6 pt-8 border-t">
            <Skeleton className="h-6 w-48" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white p-4 rounded-lg shadow space-y-4">
                  <Skeleton className="h-32 w-full rounded" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-16 rounded-full" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

// Inline content refresh skeleton (for partial updates)
export function ContentRefreshSkeleton({ type }: { type: 'project' | 'blog' }) {
  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
        <div className="text-center space-y-4">
          <div className="relative">
            <Skeleton className="h-16 w-16 mx-auto rounded-full" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Skeleton className="h-6 w-48 mx-auto" />
            <Skeleton className="h-4 w-64 mx-auto" />
          </div>
          
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <span>Refreshing {type} content...</span>
          </div>
        </div>
      </div>
    </div>
  );
}