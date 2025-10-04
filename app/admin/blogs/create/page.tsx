import ClientWrapper from '@/components/admin/ClientWrapper';
import BlogForm from '@/components/admin/BlogForm';

export const dynamic = 'force-dynamic';

export default function CreateBlogPage() {
  return (
    <ClientWrapper>
      <BlogForm />
    </ClientWrapper>
  );
}