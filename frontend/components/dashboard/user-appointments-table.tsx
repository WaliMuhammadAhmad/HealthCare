"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, MapPin, Video, Phone, AlertCircle, Info } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

// Sample data for user appointments
const userAppointmentsData = [
  {
    id: "APT-001",
    doctor: "Dr. Smith",
    specialty: "Family Medicine",
    date: "2023-11-15",
    time: "10:00 AM",
    type: "in-person",
    status: "upcoming",
    location: "Main Clinic, Room 105",
    notes: "Annual physical examination",
  },
  {
    id: "APT-002",
    doctor: "Dr. Johnson",
    specialty: "Cardiology",
    date: "2023-11-20",
    time: "2:00 PM",
    type: "video",
    status: "upcoming",
    location: "Video consultation link will be sent 15 minutes before appointment",
    notes: "Follow-up on recent test results",
  },
  {
    id: "APT-003",
    doctor: "Dr. Williams",
    specialty: "Dermatology",
    date: "2023-11-28",
    time: "11:30 AM",
    type: "in-person",
    status: "upcoming",
    location: "Dermatology Clinic, 2nd Floor",
    notes: "Skin condition assessment",
  },
  {
    id: "APT-004",
    doctor: "Dr. Brown",
    specialty: "Pediatrics",
    date: "2023-10-20",
    time: "9:00 AM",
    type: "in-person",
    status: "completed",
    location: "Pediatrics Department, 3rd Floor",
    notes: "Vaccination",
  },
  {
    id: "APT-005",
    doctor: "Dr. Smith",
    specialty: "Family Medicine",
    date: "2023-10-05",
    time: "3:30 PM",
    type: "phone",
    status: "completed",
    location: "Phone consultation",
    notes: "Medication consultation",
  },
  {
    id: "APT-006",
    doctor: "Dr. Johnson",
    specialty: "Cardiology",
    date: "2023-09-15",
    time: "1:00 PM",
    type: "in-person",
    status: "completed",
    location: "Cardiology Department, 3rd Floor",
    notes: "Initial consultation",
  },
  {
    id: "APT-007",
    doctor: "Dr. Williams",
    specialty: "Dermatology",
    date: "2023-09-01",
    time: "10:30 AM",
    type: "video",
    status: "cancelled",
    location: "Video consultation",
    notes: "Cancelled by patient: Schedule conflict",
    cancellationReason: "Schedule conflict with work meeting",
  },
  {
    id: "APT-008",
    doctor: "Dr. Brown",
    specialty: "Pediatrics",
    date: "2023-08-18",
    time: "2:30 PM",
    type: "in-person",
    status: "cancelled",
    location: "Pediatrics Department, 3rd Floor",
    notes: "Cancelled by doctor: Doctor unavailable",
    cancellationReason: "Doctor called for emergency surgery",
  },
]

export function UserAppointmentsTable() {
  const { toast } = useToast()
  const [appointments, setAppointments] = useState(userAppointmentsData)
  const [selectedAppointment, setSelectedAppointment] = useState<(typeof userAppointmentsData)[0] | null>(null)
  const [detailsDialog, setDetailsDialog] = useState(false)
  const [cancelDialog, setCancelDialog] = useState(false)
  const [cancellationReason, setCancellationReason] = useState("")

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "upcoming":
        return <Badge>Upcoming</Badge>
      case "completed":
        return <Badge variant="secondary">Completed</Badge>
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>
      default:
        return null
    }
  }

  // Check if appointment can be cancelled (1 day before)
  const canCancelAppointment = (appointment: (typeof userAppointmentsData)[0]) => {
    if (appointment.status !== "upcoming") return false

    const appointmentDate = new Date(appointment.date)
    const today = new Date()

    // Set both dates to midnight for accurate day comparison
    appointmentDate.setHours(0, 0, 0, 0)
    today.setHours(0, 0, 0, 0)

    // Calculate difference in days
    const diffTime = appointmentDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    // Can cancel if appointment is at least 1 day away
    return diffDays >= 1
  }

  const handleCancelAppointment = () => {
    if (selectedAppointment && cancellationReason) {
      setAppointments(
        appointments.map((appointment) =>
          appointment.id === selectedAppointment.id
            ? {
                ...appointment,
                status: "cancelled",
                notes: `Cancelled by patient: ${cancellationReason}`,
                cancellationReason: cancellationReason,
              }
            : appointment,
        ),
      )
      setCancelDialog(false)
      setSelectedAppointment(null)
      setCancellationReason("")

      toast({
        title: "Appointment cancelled",
        description: "Your appointment has been successfully cancelled.",
      })
    }
  }

  const upcomingAppointments = appointments.filter((apt) => apt.status === "upcoming")
  const completedAppointments = appointments.filter((apt) => apt.status === "completed")
  const cancelledAppointments = appointments.filter((apt) => apt.status === "cancelled")

  const renderAppointmentRow = (appointment: (typeof userAppointmentsData)[0]) => (
    <TableRow key={appointment.id}>
      <TableCell>
        <div>
          <div className="font-medium">{appointment.doctor}</div>
          <div className="text-sm text-muted-foreground">{appointment.specialty}</div>
        </div>
      </TableCell>
      <TableCell>
        <div>
          <div className="font-medium">{formatDate(appointment.date)}</div>
          <div className="text-sm text-muted-foreground">{appointment.time}</div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center">
          {getAppointmentTypeIcon(appointment.type)}
          <span className="capitalize">{appointment.type.replace("-", " ")}</span>
        </div>
      </TableCell>
      <TableCell>{getStatusBadge(appointment.status)}</TableCell>
      <TableCell>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedAppointment(appointment)
              setDetailsDialog(true)
            }}
          >
            <Info className="h-4 w-4 mr-1" />
            Details
          </Button>

          {appointment.status === "upcoming" && canCancelAppointment(appointment) && (
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
          )}
        </div>
      </TableCell>
    </TableRow>
  )

  return (
    <>
      <Tabs defaultValue="upcoming">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming">Upcoming ({upcomingAppointments.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedAppointments.length})</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled ({cancelledAppointments.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="pt-6">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {upcomingAppointments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No upcoming appointments.
                    </TableCell>
                  </TableRow>
                ) : (
                  upcomingAppointments.map(renderAppointmentRow)
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="completed" className="pt-6">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {completedAppointments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No completed appointments.
                    </TableCell>
                  </TableRow>
                ) : (
                  completedAppointments.map(renderAppointmentRow)
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="cancelled" className="pt-6">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cancelledAppointments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No cancelled appointments.
                    </TableCell>
                  </TableRow>
                ) : (
                  cancelledAppointments.map(renderAppointmentRow)
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      {/* Appointment Details Dialog */}
      <Dialog open={detailsDialog} onOpenChange={setDetailsDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
            <DialogDescription>Complete information about your appointment</DialogDescription>
          </DialogHeader>

          {selectedAppointment && (
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
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Status:</div>
                <div className="col-span-3">{getStatusBadge(selectedAppointment.status)}</div>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <div className="font-medium">Location:</div>
                <div className="col-span-3">{selectedAppointment.location}</div>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <div className="font-medium">Notes:</div>
                <div className="col-span-3">{selectedAppointment.notes}</div>
              </div>

              {selectedAppointment.status === "cancelled" && selectedAppointment.cancellationReason && (
                <div className="grid grid-cols-4 items-start gap-4">
                  <div className="font-medium">Cancellation Reason:</div>
                  <div className="col-span-3">{selectedAppointment.cancellationReason}</div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            {selectedAppointment &&
              selectedAppointment.status === "upcoming" &&
              canCancelAppointment(selectedAppointment) && (
                <Button
                  variant="destructive"
                  onClick={() => {
                    setDetailsDialog(false)
                    setCancelDialog(true)
                  }}
                >
                  Cancel Appointment
                </Button>
              )}
            <Button variant="outline" onClick={() => setDetailsDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Appointment Dialog */}
      <Dialog open={cancelDialog} onOpenChange={setCancelDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-destructive" />
              Cancel Appointment
            </DialogTitle>
            <DialogDescription>
              Please provide a reason for cancelling this appointment. Note that you can only cancel appointments at
              least 1 day in advance.
            </DialogDescription>
          </DialogHeader>

          {selectedAppointment && (
            <div className="py-4">
              <div className="flex flex-col space-y-2 rounded-lg border p-4 mb-4">
                <div>
                  <h4 className="font-medium">{selectedAppointment.doctor}</h4>
                  <p className="text-sm text-muted-foreground">{selectedAppointment.specialty}</p>
                </div>
                <div className="flex items-center text-sm">
                  <Calendar className="mr-1 h-4 w-4" />
                  <span>{formatDate(selectedAppointment.date)}</span>
                  <span className="mx-2">•</span>
                  <Clock className="mr-1 h-4 w-4" />
                  <span>{selectedAppointment.time}</span>
                </div>
                <div className="flex items-center text-sm">
                  {getAppointmentTypeIcon(selectedAppointment.type)}
                  <span className="capitalize">{selectedAppointment.type.replace("-", " ")} appointment</span>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="reason" className="text-sm font-medium">
                  Reason for Cancellation
                </label>
                <Textarea
                  id="reason"
                  placeholder="Please provide a reason for cancelling this appointment..."
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelDialog(false)}>
              Back
            </Button>
            <Button variant="destructive" onClick={handleCancelAppointment} disabled={!cancellationReason}>
              Confirm Cancellation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

