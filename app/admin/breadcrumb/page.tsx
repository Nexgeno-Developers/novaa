import BreadCrumbManager from '@/components/admin/BreadcrumbManager';
import ClientWrapper from '@/components/admin/ClientWrapper';

export const dynamic = 'force-dynamic';

export default function BreadCrumb() {
  return (
    <ClientWrapper>
      <BreadCrumbManager />
    </ClientWrapper>
  );
}