import { Metadata } from 'next';
import ClientWrapper from '@/components/admin/ClientWrapper';
import EnquiriesManager from '@/components/admin/EnquiriesManager';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Enquiries Management | Admin Dashboard',
  description: 'Manage and track customer enquiries from contact forms',
};

export default function EnquiriesPage() {
  return (
    <ClientWrapper>
      <EnquiriesManager />
    </ClientWrapper>
  );
}