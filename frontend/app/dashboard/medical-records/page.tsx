import { UserMedicalRecordsTable } from "@/components/dashboard/user-medical-records-table"

export default function MedicalRecordsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">My Medical Records</h2>
      </div>

      <UserMedicalRecordsTable />
    </div>
  )
}

