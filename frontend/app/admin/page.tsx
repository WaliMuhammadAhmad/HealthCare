import { StatsCards } from "@/components/admin/stats-cards"
import { DashboardCharts } from "@/components/admin/dashboard-charts"
import { RecentAppointments } from "@/components/admin/recent-appointments"
import { NewUsers } from "@/components/admin/new-users"

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>

      <StatsCards />

      <div className="grid gap-6 md:grid-cols-2">
        <DashboardCharts />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <RecentAppointments />
        <NewUsers />
      </div>
    </div>
  )
}

