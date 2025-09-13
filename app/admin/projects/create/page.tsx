import ClientWrapper from '@/components/admin/ClientWrapper';
import CreateProjectForm from '@/components/admin/CreateProjectForm';

export const dynamic = 'force-dynamic';

export default function CreateProjectPage() {
  return (
    <ClientWrapper>
      <div className="container p-6">
        <CreateProjectForm />
      </div>
    </ClientWrapper>
  );
}