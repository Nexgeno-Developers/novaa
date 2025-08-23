import { getBreadcrumbData } from "@/lib/data/getBreadcrumbData";
import BlogDetailClient from "@/components/client/BlogDetailClient";

export default async function BlogDetailPage() {
  const breadcrumbData = await getBreadcrumbData("blog-detail");
  if (!breadcrumbData) {
    return <div>Error loading page header.</div>;
  }

  return <BlogDetailClient breadcrumbData={breadcrumbData} />
}