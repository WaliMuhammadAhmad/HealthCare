import { UsersTable } from "@/components/admin/users-table"

export default function UsersPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Users Management</h2>
      </div>

      <UsersTable />
    </div>
  )
}

