// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CategoriesSection from '@/components/admin/CategoriesSection';

export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Categories Manager</h1>
      </div>
      <CategoriesSection />
    </div>
  );
}
