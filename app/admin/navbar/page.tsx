import ClientWrapper from '@/components/admin/ClientWrapper';
import NavbarManager from '@/components/admin/NavbarManager';

export const dynamic = 'force-dynamic';

export default function NavbarManagerPage() {
  return (
    <ClientWrapper>
      <NavbarManager />
    </ClientWrapper>
  );
}