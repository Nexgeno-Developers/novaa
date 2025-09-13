import ClientWrapper from '@/components/admin/ClientWrapper';
import CategoriesSection from '@/components/admin/CategoriesSection';

export const dynamic = 'force-dynamic';

export default function CategoriesPage() {
  return (
    <ClientWrapper>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Categories Manager</h1>
        </div>
        <CategoriesSection />
      </div>
    </ClientWrapper>
  );
}