import ClientWrapper from '@/components/admin/ClientWrapper';
import ProjectsManager from '@/components/admin/ProjectsManager';

export const dynamic = 'force-dynamic';

export default function ProjectsListPage() {
  return (
    <ClientWrapper>
      <div className="container p-6">
        <ProjectsManager />
      </div>
    </ClientWrapper>
  );
}