import ClientWrapper from '@/components/admin/ClientWrapper';
import DashboardManager from '@/components/admin/DashboardManager';

export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  return (
    <ClientWrapper>
      <DashboardManager />
    </ClientWrapper>
  );
}