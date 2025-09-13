import ClientWrapper from '@/components/admin/ClientWrapper';
import BlogManager from '@/components/admin/BlogManager';

export const dynamic = 'force-dynamic';

export default function BlogManagerPage() {
  return (
    <ClientWrapper>
      <BlogManager />
    </ClientWrapper>
  );
}