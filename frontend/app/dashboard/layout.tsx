import type React from "react";
import { UserSidebar } from "@/components/dashboard/user-sidebar";
import { UserProvider } from "@/components/dashboard/user-provider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
      <div className='flex min-h-screen'>
        <UserSidebar />
        <div className='flex-1 overflow-auto'>
          <div className='p-6 md:p-8'>{children}</div>
        </div>
      </div>
    </UserProvider>
  );
}
