'use client';

import { useParams } from 'next/navigation';
import PageSections from '@/components/admin/PageSections';

export default function PageSlugPage() {
  const params = useParams();
  const pageSlug = params.slug as string;

  if (!pageSlug) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Invalid Page</h2>
          <p className="text-muted-foreground">No page slug provided</p>
        </div>
      </div>
    );
  }

  return <PageSections pageSlug={pageSlug} />;
}