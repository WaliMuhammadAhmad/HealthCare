import { AppointmentsTable } from "@/components/admin/appointments-table"

export default function AppointmentsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Appointments Management</h2>
      </div>

      <AppointmentsTable />
    </div>
  )
}

