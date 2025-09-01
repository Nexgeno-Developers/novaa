import { Metadata } from 'next';
import EnquiriesManager from '@/components/admin/EnquiriesManager';

export const metadata: Metadata = {
  title: 'Enquiries Management | Admin Dashboard',
  description: 'Manage and track customer enquiries from contact forms',
};

export default function EnquiriesPage() {
  return <EnquiriesManager />;
}