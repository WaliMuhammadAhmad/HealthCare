"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock } from "lucide-react"

// Sample data for recent appointments
const recentAppointments = [
  {
    id: "APT-001",
    patientName: "Sarah Johnson",
    patientImage: "/placeholder.svg?height=32&width=32",
    doctor: "Dr. Smith",
    date: "2023-11-15",
    time: "10:00 AM",
    status: "upcoming",
  },
  {
    id: "APT-002",
    patientName: "Michael Rodriguez",
    patientImage: "/placeholder.svg?height=32&width=32",
    doctor: "Dr. Johnson",
    date: "2023-11-15",
    time: "11:30 AM",
    status: "upcoming",
  },
  {
    id: "APT-003",
    patientName: "Emily Chen",
    patientImage: "/placeholder.svg?height=32&width=32",
    doctor: "Dr. Williams",
    date: "2023-11-15",
    time: "2:00 PM",
    status: "upcoming",
  },
  {
    id: "APT-004",
    patientName: "David Wilson",
    patientImage: "/placeholder.svg?height=32&width=32",
    doctor: "Dr. Brown",
    date: "2023-11-15",
    time: "3:30 PM",
    status: "upcoming",
  },
  {
    id: "APT-005",
    patientName: "Jessica Martinez",
    patientImage: "/placeholder.svg?height=32&width=32",
    doctor: "Dr. Smith",
    date: "2023-11-16",
    time: "9:00 AM",
    status: "upcoming",
  },
]

export function RecentAppointments() {
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Appointments</CardTitle>
        <CardDescription>Latest upcoming appointments across the platform</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentAppointments.map((appointment) => (
            <div
              key={appointment.id}
              className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
            >
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={appointment.patientImage} alt={appointment.patientName} />
                  <AvatarFallback>{appointment.patientName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{appointment.patientName}</p>
                  <p className="text-sm text-muted-foreground">{appointment.doctor}</p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="mr-1 h-3 w-3" />
                  <span>{formatDate(appointment.date)}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="mr-1 h-3 w-3" />
                  <span>{appointment.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

