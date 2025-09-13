import ClientWrapper from '@/components/admin/ClientWrapper';
import MediaManagement from '@/components/admin/MediaManagement';

export const dynamic = 'force-dynamic';

export default function MediaManagementPage() {
  return (
    <ClientWrapper>
      <MediaManagement />
    </ClientWrapper>
  );
}
