import ClientWrapper from "@/components/admin/ClientWrapper";
import ProjectsManager from "@/components/admin/ProjectsManager";
import { store } from "@/redux";
import { fetchProjects } from "@/redux/slices/projectsSlice";

export const dynamic = "force-dynamic";

export default async function ProjectsListPage() {
  await store.dispatch(fetchProjects());

  return (
    <ClientWrapper>
      <div className="container p-6">
        <ProjectsManager />
      </div>
    </ClientWrapper>
  );
}
