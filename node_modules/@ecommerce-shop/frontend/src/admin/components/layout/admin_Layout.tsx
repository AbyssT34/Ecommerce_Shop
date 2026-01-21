import type { ReactNode } from 'react';
import { AdminHeader } from './admin_Header';
import { AdminSidebar } from './admin_Sidebar';

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-bg-primary">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 ml-64 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
