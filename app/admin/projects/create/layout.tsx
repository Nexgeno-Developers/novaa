'use client';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {


  return (
    <div className="min-h-screen bg-sidebar rounded-xl">
        {/* <AdminHeader 
          sidebarCollapsed={sidebarCollapsed}
          onSidebarToggle={setSidebarCollapsed}
        /> */}
        <main className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
  );
}