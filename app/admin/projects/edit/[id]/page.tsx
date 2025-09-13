import ClientWrapper from '@/components/admin/ClientWrapper';
import EditProjectForm from '@/components/admin/EditProjectForm';

export const dynamic = 'force-dynamic';

export default function EditProjectPage() {
  return (
    <ClientWrapper>
      <div className="container mx-auto p-6">
        <EditProjectForm />
      </div>
    </ClientWrapper>
  );
}