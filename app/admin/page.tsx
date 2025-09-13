import ClientWrapper from '@/components/admin/ClientWrapper';
import AdminPageContent from './AdminPageContent';

export const dynamic = 'force-dynamic';

export default function AdminPage() {
  return (
    <ClientWrapper>
      <AdminPageContent />
    </ClientWrapper>
  );
}