import { UserAppointmentsTable } from "@/components/dashboard/user-appointments-table"

export default function AppointmentsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">My Appointments</h2>
      </div>

      <UserAppointmentsTable />
    </div>
  )
}

