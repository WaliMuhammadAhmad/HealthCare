"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, Video, Phone, MapPin, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Dummy data for appointments
const appointments = [
  {
    id: "APT-001",
    date: "2023-03-25",
    time: "10:00 AM",
    doctor: "Dr. Smith",
    specialty: "Family Medicine",
    type: "in-person",
    status: "upcoming",
    location: "Main Clinic, Room 105",
    notes: "Annual physical examination",
  },
  {
    id: "APT-002",
    date: "2023-03-28",
    time: "2:00 PM",
    doctor: "Dr. Johnson",
    specialty: "Cardiology",
    type: "video",
    status: "upcoming",
    location: "Video consultation link will be sent 15 minutes before appointment",
    notes: "Follow-up on recent test results",
  },
  {
    id: "APT-003",
    date: "2023-04-05",
    time: "11:30 AM",
    doctor: "Dr. Williams",
    specialty: "Dermatology",
    type: "in-person",
    status: "upcoming",
    location: "Dermatology Clinic, 2nd Floor",
    notes: "Skin condition assessment",
  },
  {
    id: "APT-004",
    date: "2023-02-15",
    time: "9:00 AM",
    doctor: "Dr. Brown",
    specialty: "Pediatrics",
    type: "phone",
    status: "completed",
    location: "Phone consultation",
    notes: "Discussed vaccination schedule",
  },
  {
    id: "APT-005",
    date: "2023-02-10",
    time: "3:30 PM",
    doctor: "Dr. Smith",
    specialty: "Family Medicine",
    type: "in-person",
    status: "completed",
    location: "Main Clinic, Room 105",
    notes: "Flu symptoms",
  },
  {
    id: "APT-006",
    date: "2023-01-20",
    time: "1:00 PM",
    doctor: "Dr. Johnson",
    specialty: "Cardiology",
    type: "in-person",
    status: "completed",
    location: "Cardiology Department, 3rd Floor",
    notes: "Initial consultation",
  },
]

export function AppointmentsList() {
  const { toast } = useToast()
  const [selectedAppointment, setSelectedAppointment] = useState<(typeof appointments)[0] | null>(null)
  const [cancelDialog, setCancelDialog] = useState(false)

  const upcomingAppointments = appointments.filter((apt) => apt.status === "upcoming")
  const pastAppointments = appointments.filter((apt) => apt.status === "completed")

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

  const handleCancelAppointment = () => {
    // In a real app, this would send a request to the server
    toast({
      title: "Appointment cancelled",
      description: `Your appointment with ${selectedAppointment?.doctor} on ${formatDate(selectedAppointment?.date || "")} has been cancelled.`,
    })

    setCancelDialog(false)
    setSelectedAppointment(null)
  }

  const renderAppointmentCard = (appointment: (typeof appointments)[0]) => (
    <Card key={appointment.id} className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{appointment.doctor}</CardTitle>
            <CardDescription>{appointment.specialty}</CardDescription>
          </div>
          <Badge variant={appointment.status === "upcoming" ? "default" : "secondary"}>
            {appointment.status === "upcoming" ? "Upcoming" : "Completed"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{formatDate(appointment.date)}</span>
            <span className="mx-2">•</span>
            <Clock className="h-4 w-4 mr-1" />
            <span>{appointment.time}</span>
          </div>
          <div className="flex items-center text-sm">
            {getAppointmentTypeIcon(appointment.type)}
            <span className="capitalize">{appointment.type.replace("-", " ")} appointment</span>
          </div>
          <div className="text-sm text-muted-foreground">{appointment.notes}</div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex justify-end w-full space-x-2">
          {appointment.status === "upcoming" && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedAppointment(appointment)
                  setCancelDialog(true)
                }}
              >
                Cancel
              </Button>
              <Button variant="outline" size="sm" onClick={() => setSelectedAppointment(appointment)}>
                Reschedule
              </Button>
            </>
          )}
          <Button variant="default" size="sm" onClick={() => setSelectedAppointment(appointment)}>
            Details
          </Button>
        </div>
      </CardFooter>
    </Card>
  )

  return (
    <>
      <Tabs defaultValue="upcoming">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upcoming">Upcoming ({upcomingAppointments.length})</TabsTrigger>
          <TabsTrigger value="past">Past Appointments</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming" className="pt-6">
          {upcomingAppointments.length > 0 ? (
            upcomingAppointments.map(renderAppointmentCard)
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No upcoming appointments</h3>
              <p className="text-muted-foreground mt-2">
                You don't have any scheduled appointments. Book a new appointment to get started.
              </p>
            </div>
          )}
        </TabsContent>
        <TabsContent value="past" className="pt-6">
          {pastAppointments.length > 0 ? (
            pastAppointments.map(renderAppointmentCard)
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No past appointments</h3>
              <p className="text-muted-foreground mt-2">Your appointment history will appear here.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Appointment Details Dialog */}
      {selectedAppointment && !cancelDialog && (
        <Dialog open={!!selectedAppointment} onOpenChange={() => setSelectedAppointment(null)}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Appointment Details</DialogTitle>
              <DialogDescription>Complete information about your appointment.</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Doctor:</div>
                <div className="col-span-3">{selectedAppointment.doctor}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Specialty:</div>
                <div className="col-span-3">{selectedAppointment.specialty}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Date:</div>
                <div className="col-span-3">{formatDate(selectedAppointment.date)}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Time:</div>
                <div className="col-span-3">{selectedAppointment.time}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Type:</div>
                <div className="col-span-3 flex items-center">
                  {getAppointmentTypeIcon(selectedAppointment.type)}
                  <span className="capitalize">{selectedAppointment.type.replace("-", " ")} appointment</span>
                </div>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <div className="font-medium">Location:</div>
                <div className="col-span-3">{selectedAppointment.location}</div>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <div className="font-medium">Notes:</div>
                <div className="col-span-3">{selectedAppointment.notes}</div>
              </div>
            </div>

            <DialogFooter className="flex justify-end space-x-2">
              {selectedAppointment.status === "upcoming" && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setCancelDialog(true)
                      setSelectedAppointment(selectedAppointment)
                    }}
                  >
                    Cancel Appointment
                  </Button>
                  <Button variant="outline">Reschedule</Button>
                </>
              )}
              <Button variant="default" onClick={() => setSelectedAppointment(null)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Cancel Confirmation Dialog */}
      <Dialog open={cancelDialog} onOpenChange={setCancelDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center text-destructive">
              <AlertCircle className="h-5 w-5 mr-2" />
              Cancel Appointment
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this appointment? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {selectedAppointment && (
            <div className="py-4">
              <div className="rounded-lg border p-4 mb-4">
                <div className="font-medium">{selectedAppointment.doctor}</div>
                <div className="text-sm text-muted-foreground">{selectedAppointment.specialty}</div>
                <div className="text-sm mt-2 flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {formatDate(selectedAppointment.date)} at {selectedAppointment.time}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelDialog(false)}>
              Keep Appointment
            </Button>
            <Button variant="destructive" onClick={handleCancelAppointment}>
              Cancel Appointment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

