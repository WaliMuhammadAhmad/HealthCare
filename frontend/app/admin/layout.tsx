import type React from "react"
import { AdminSidebar } from "@/components/admin/sidebar"
import { AdminProvider } from "@/components/admin/admin-provider"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminProvider>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <div className="flex-1 overflow-auto">
          <div className="p-6 md:p-8">{children}</div>
        </div>
      </div>
    </AdminProvider>
  )
}

