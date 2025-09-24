import { Suspense } from 'react';
import ProjectsManager from '@/components/admin/ProjectsManager';
import ClientWrapper from '@/components/admin/ClientWrapper';

export default function ProjectsPage() {
  return (
    <ClientWrapper>
      <div className="container p-6">
        <Suspense fallback={<div className='text-primary/90 admin-theme'>Loading projects...</div>}>
          <ProjectsManager />
        </Suspense>
      </div>
    </ClientWrapper>
  );
}