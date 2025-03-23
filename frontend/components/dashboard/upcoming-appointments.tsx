"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, Video, Phone } from "lucide-react"
import Link from "next/link"

// Sample data for upcoming appointments
const upcomingAppointments = [
  {
    id: "APT-001",
    doctor: "Dr. Smith",
    specialty: "Family Medicine",
    date: "2023-11-15",
    time: "10:00 AM",
    type: "in-person",
    location: "Main Clinic, Room 105",
  },
  {
    id: "APT-002",
    doctor: "Dr. Johnson",
    specialty: "Cardiology",
    date: "2023-11-20",
    time: "2:00 PM",
    type: "video",
    location: "Video consultation link will be sent 15 minutes before appointment",
  },
  {
    id: "APT-003",
    doctor: "Dr. Williams",
    specialty: "Dermatology",
    date: "2023-11-28",
    time: "11:30 AM",
    type: "in-person",
    location: "Dermatology Clinic, 2nd Floor",
  },
]

export function UpcomingAppointments() {
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const getAppointmentTypeIcon = (type: string) => {
    switch (type) {
      case "in-person":
        return <MapPin className="h-4 w-4 mr-1" />
      case "video":
        return <Video className="h-4 w-4 mr-1" />
      case "phone":
        return <Phone className="h-4 w-4 mr-1" />
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Upcoming Appointments</CardTitle>
          <CardDescription>Your next scheduled appointments</CardDescription>
        </div>
        <Link href="/dashboard/appointments">
          <Button variant="outline" size="sm">
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcomingAppointments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No upcoming appointments</h3>
              <p className="text-muted-foreground mt-2">You don't have any scheduled appointments.</p>
              <Button className="mt-4">Book an Appointment</Button>
            </div>
          ) : (
            upcomingAppointments.map((appointment) => (
              <div key={appointment.id} className="flex flex-col space-y-2 rounded-lg border p-4">
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-medium">{appointment.doctor}</h4>
                    <p className="text-sm text-muted-foreground">{appointment.specialty}</p>
                  </div>
                  <Badge>Upcoming</Badge>
                </div>
                <div className="flex items-center text-sm">
                  <Calendar className="mr-1 h-4 w-4" />
                  <span>{formatDate(appointment.date)}</span>
                  <span className="mx-2">•</span>
                  <Clock className="mr-1 h-4 w-4" />
                  <span>{appointment.time}</span>
                </div>
                <div className="flex items-center text-sm">
                  {getAppointmentTypeIcon(appointment.type)}
                  <span className="capitalize">{appointment.type.replace("-", " ")} appointment</span>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

