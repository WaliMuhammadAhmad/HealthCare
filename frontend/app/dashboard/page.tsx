import { UserStatsCards } from "@/components/dashboard/user-stats-cards"
import { UserAppointmentChart } from "@/components/dashboard/user-appointment-chart"
import { UpcomingAppointments } from "@/components/dashboard/upcoming-appointments"
import { RecentMedicalRecords } from "@/components/dashboard/recent-medical-records"

export default function UserDashboard() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>

      <UserStatsCards />

      <div className="grid gap-6 md:grid-cols-2">
        <UserAppointmentChart />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <UpcomingAppointments />
        <RecentMedicalRecords />
      </div>
    </div>
  )
}

