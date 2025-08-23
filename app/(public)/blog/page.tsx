import { getBreadcrumbData } from "@/lib/data/getBreadcrumbData";
import BlogClient from "@/components/client/BlogClient";

export default async function BlogPage() {
  const breadcrumbData = await getBreadcrumbData("blog");
  if (!breadcrumbData) {
    return <div>Error loading page header.</div>;
  }

  return <BlogClient breadcrumbData={breadcrumbData} />
}