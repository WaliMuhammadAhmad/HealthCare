"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { addDays, format, isSameDay, startOfToday } from "date-fns"
import { Check, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Dummy data for doctors
const doctors = [
  { id: "dr-smith", name: "Dr. Smith", specialty: "Family Medicine" },
  { id: "dr-johnson", name: "Dr. Johnson", specialty: "Cardiology" },
  { id: "dr-williams", name: "Dr. Williams", specialty: "Dermatology" },
  { id: "dr-brown", name: "Dr. Brown", specialty: "Pediatrics" },
]

// Generate time slots from 9 AM to 5 PM
const generateTimeSlots = () => {
  const slots = []
  for (let hour = 9; hour < 17; hour++) {
    slots.push(`${hour}:00 ${hour < 12 ? "AM" : "PM"}`)
  }
  return slots
}

// Generate available slots for the next 3 weeks
const generateAvailableDays = () => {
  const today = startOfToday()
  const threeWeeksLater = addDays(today, 21)

  // Randomly make some days unavailable
  const availableDays = []
  let currentDay = today

  while (currentDay <= threeWeeksLater) {
    // Skip weekends (6 = Saturday, 0 = Sunday)
    if (currentDay.getDay() !== 0 && currentDay.getDay() !== 6) {
      // Randomly determine if the day is available (80% chance)
      if (Math.random() < 0.8) {
        availableDays.push(new Date(currentDay))
      }
    }
    currentDay = addDays(currentDay, 1)
  }

  return availableDays
}

// Generate available time slots for a specific day and doctor
const generateAvailableTimeSlots = (date: Date, doctorId: string) => {
  const allTimeSlots = generateTimeSlots()

  // Randomly make some time slots unavailable
  return allTimeSlots.filter(() => Math.random() < 0.7)
}

export function AppointmentCalendar() {
  const { toast } = useToast()
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [doctor, setDoctor] = useState<string>("")
  const [timeSlot, setTimeSlot] = useState<string>("")
  const [reason, setReason] = useState<string>("")
  const [appointmentType, setAppointmentType] = useState<string>("in-person")

  const availableDays = generateAvailableDays()
  const availableTimeSlots = date && doctor ? generateAvailableTimeSlots(date, doctor) : []

  const handleBookAppointment = () => {
    if (!date || !doctor || !timeSlot) {
      toast({
        title: "Missing information",
        description: "Please select a date, doctor, and time slot.",
        variant: "destructive",
      })
      return
    }

    // In a real app, this would send the data to the server
    toast({
      title: "Appointment booked!",
      description: `Your appointment with ${doctors.find((d) => d.id === doctor)?.name} on ${format(date, "MMMM d, yyyy")} at ${timeSlot} has been confirmed.`,
    })

    // Reset form
    setDate(undefined)
    setDoctor("")
    setTimeSlot("")
    setReason("")
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Select Appointment Date</CardTitle>
          <CardDescription>Choose a date within the next 3 weeks</CardDescription>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            disabled={(date) => {
              // Disable dates that are not in the available days list
              return !availableDays.some((availableDate) => isSameDay(availableDate, date))
            }}
            fromDate={new Date()}
            toDate={addDays(new Date(), 21)}
          />
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Appointment Details</CardTitle>
            <CardDescription>Select your preferred doctor and time</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="doctor">Select Doctor</Label>
              <Select value={doctor} onValueChange={setDoctor}>
                <SelectTrigger id="doctor">
                  <SelectValue placeholder="Choose a doctor" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map((doc) => (
                    <SelectItem key={doc.id} value={doc.id}>
                      {doc.name} - {doc.specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {date && doctor && (
              <div className="space-y-2">
                <Label htmlFor="time-slot">Available Time Slots</Label>
                <div className="grid grid-cols-2 gap-2">
                  {availableTimeSlots.length > 0 ? (
                    availableTimeSlots.map((slot) => (
                      <Button
                        key={slot}
                        type="button"
                        variant={timeSlot === slot ? "default" : "outline"}
                        className="justify-start"
                        onClick={() => setTimeSlot(slot)}
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        {slot}
                        {timeSlot === slot && <Check className="ml-auto h-4 w-4" />}
                      </Button>
                    ))
                  ) : (
                    <p className="col-span-2 text-sm text-muted-foreground">
                      No available time slots for this date and doctor.
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="appointment-type">Appointment Type</Label>
              <RadioGroup
                value={appointmentType}
                onValueChange={setAppointmentType}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="in-person" id="in-person" />
                  <Label htmlFor="in-person">In-Person Visit</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="video" id="video" />
                  <Label htmlFor="video">Video Consultation</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="phone" id="phone" />
                  <Label htmlFor="phone">Phone Consultation</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Visit</Label>
              <Textarea
                id="reason"
                placeholder="Briefly describe your symptoms or reason for the appointment"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleBookAppointment} disabled={!date || !doctor || !timeSlot} className="w-full">
              Book Appointment
            </Button>
          </CardFooter>
        </Card>

        {date && doctor && timeSlot && (
          <Card>
            <CardHeader>
              <CardTitle>Appointment Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Date:</span>
                  <span>{format(date, "MMMM d, yyyy")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Time:</span>
                  <span>{timeSlot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Doctor:</span>
                  <span>{doctors.find((d) => d.id === doctor)?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Type:</span>
                  <span className="capitalize">{appointmentType.replace("-", " ")}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

