import { Suspense } from "react";
import ProjectsManager from "@/components/admin/ProjectsManager";
import ClientWrapper from "@/components/admin/ClientWrapper";
import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";
import Category from "@/models/Category";

export const dynamic = "force-dynamic";

// Server-side data fetching to ensure data is available on initial load
async function getInitialData() {
  try {
    await connectDB();

    const [projects, categories] = await Promise.all([
      Project.find({}).populate("category").sort({ order: 1 }).lean(),
      Category.find({}).sort({ order: 1 }).lean(),
    ]);

    return {
      projects: JSON.parse(JSON.stringify(projects)),
      categories: JSON.parse(JSON.stringify(categories)),
    };
  } catch (error) {
    console.error("Error fetching initial data:", error);
    return {
      projects: [],
      categories: [],
    };
  }
}

export default async function ProjectsPage() {
  const initialData = await getInitialData();

  return (
    <ClientWrapper>
      <div className="container p-6">
        <Suspense
          fallback={
            <div className="text-primary/90 admin-theme">
              Loading projects...
            </div>
          }
        >
          <ProjectsManager initialData={initialData} />
        </Suspense>
      </div>
    </ClientWrapper>
  );
}
