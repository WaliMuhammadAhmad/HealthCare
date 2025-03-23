"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Calendar } from "lucide-react"
import Link from "next/link"

// Sample data for recent medical records
const recentRecords = [
  {
    id: "REC-001",
    date: "2023-10-28",
    doctor: "Dr. Smith",
    type: "Checkup",
    description: "Annual physical examination",
  },
  {
    id: "REC-002",
    date: "2023-10-15",
    doctor: "Dr. Johnson",
    type: "Lab Test",
    description: "Blood work analysis",
  },
  {
    id: "REC-003",
    date: "2023-09-22",
    doctor: "Dr. Williams",
    type: "Procedure",
    description: "Minor dermatological procedure",
  },
]

export function RecentMedicalRecords() {
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Checkup":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "Lab Test":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "Procedure":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "Vaccination":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "Prescription":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Recent Medical Records</CardTitle>
          <CardDescription>Your latest medical records</CardDescription>
        </div>
        <Link href="/dashboard/medical-records">
          <Button variant="outline" size="sm">
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentRecords.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No medical records</h3>
              <p className="text-muted-foreground mt-2">You don't have any medical records yet.</p>
            </div>
          ) : (
            recentRecords.map((record) => (
              <div key={record.id} className="flex flex-col space-y-2 rounded-lg border p-4">
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-medium">{record.description}</h4>
                    <p className="text-sm text-muted-foreground">{record.doctor}</p>
                  </div>
                  <Badge variant="outline" className={getTypeColor(record.type)}>
                    {record.type}
                  </Badge>
                </div>
                <div className="flex items-center text-sm">
                  <Calendar className="mr-1 h-4 w-4" />
                  <span>{formatDate(record.date)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

