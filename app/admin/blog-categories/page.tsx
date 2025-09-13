import BlogCategoriesManager from "@/components/admin/BlogCategoriesManager";
import ClientWrapper from "@/components/admin/ClientWrapper";

export const dynamic = "force-dynamic";

export default function BlogCategoriesManagerPage() {
  return (
    <ClientWrapper>
      <BlogCategoriesManager />
    </ClientWrapper>
  );
}
