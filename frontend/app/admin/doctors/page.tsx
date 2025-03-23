import { DoctorsTable } from "@/components/admin/doctors-table"

export default function DoctorsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Doctors Management</h2>
      </div>

      <DoctorsTable />
    </div>
  )
}

