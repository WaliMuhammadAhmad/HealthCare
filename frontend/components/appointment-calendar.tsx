"use client";

import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { addDays, format, isSameDay } from "date-fns";
import { Check, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAppStore } from "@/stores/useAppStore";
import { doctorBookedAppointments } from "@/utils/doctor";
import { generateAvailableDays } from "@/utils/generateAvailableDays";
import { generateAvailableTimeSlots } from "@/utils/generateTimeSlots";
import { addAppointment } from "@/utils/api/appointment";

export function AppointmentCalendar() {
  const doctors = useAppStore((state) => state.doctors);
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [doctor, setDoctor] = useState<string>("");
  const [timeSlot, setTimeSlot] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [appointmentType, setAppointmentType] = useState<string>("in-person");
  const [bookedAppointments, setBookedAppointments] = useState<
    Array<{
      appointmentID: number;
      appointmentDate: string;
      appointmentTime: string;
    }>
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (doctor) {
      const fetchBookedAppointments = async () => {
        setIsLoading(true);
        try {
          const data = await doctorBookedAppointments(Number(doctor));
          setBookedAppointments(data);
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to load booked appointments.",
            variant: "destructive",
          });
          setBookedAppointments([]);
        } finally {
          setIsLoading(false);
        }
      };
      fetchBookedAppointments();
    } else {
      setBookedAppointments([]);
    }
  }, [doctor, toast]);

  const selectedDoctor = doctors.find((d) => d.doctorID === Number(doctor));
  const availableDays = generateAvailableDays(selectedDoctor?.serviceDays);
  const availabilityTimes = selectedDoctor
    ? selectedDoctor.availabilityTimes
        .split("-")
        .map((time) => parseInt(time.split(":")[0]))
    : [9, 17];
  const availableTimeSlots =
    date && doctor && availableDays.some((d) => isSameDay(d, date))
      ? generateAvailableTimeSlots(
          date,
          bookedAppointments,
          availabilityTimes[0],
          availabilityTimes[1]
        )
      : [];
  const isDateValid = date && availableDays.some((d) => isSameDay(d, date));

  const handleBookAppointment = () => {
    if (!date || !doctor || !timeSlot || !isDateValid) {
      toast({
        title: "Missing information",
        description: "Please select a valid date, doctor, and time slot.",
        variant: "destructive",
      });
      return;
    } else {
      const formatedDate = date && format(date, "yyyy-MM-dd");
      const [time, period] = timeSlot.split(" ");
      const [hourStr, minute] = time.split(":");
      let hour = parseInt(hourStr);
      if (period === "PM" && hour !== 12) hour += 12;
      if (period === "AM" && hour === 12) hour = 0;
      const formatedTimeSlot = `${hour
        .toString()
        .padStart(2, "0")}:${minute}:00`;

      addAppointment(
        Number(doctor),
        formatedDate,
        formatedTimeSlot,
        reason,
        appointmentType
      );
    }

    toast({
      title: "Appointment booked!",
      description: `Your appointment with ${
        selectedDoctor?.fullName
      } on ${format(date, "MMMM d, yyyy")} at ${timeSlot} has been confirmed.`,
    });
  };

  return (
    <div className='grid gap-6 lg:grid-cols-2'>
      <Card>
        <CardHeader className='text-center'>
          <CardTitle>Select Appointment Date</CardTitle>
          <CardDescription>
            Choose a date within the next 3 weeks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Calendar
            mode='single'
            selected={date}
            onSelect={setDate}
            disabled={(date) => {
              return !availableDays.some((availableDate) =>
                isSameDay(availableDate, date)
              );
            }}
            fromDate={new Date()}
            toDate={addDays(new Date(), 21)}
            className='mx-auto'
          />
        </CardContent>
      </Card>

      {date && (
        <Card>
          <CardHeader>
            <CardTitle>Appointment Details</CardTitle>
            <CardDescription>
              Select your preferred doctor and time
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='doctor'>Select Doctor</Label>
              <Select
                value={doctor}
                onValueChange={(value) => {
                  setDoctor(value);
                  setTimeSlot("");
                }}>
                <SelectTrigger id='doctor'>
                  <SelectValue placeholder='Choose a doctor' />
                </SelectTrigger>
                <SelectContent>
                  {doctors.length > 0 ? (
                    doctors.map((doc) => (
                      <SelectItem
                        key={doc.doctorID}
                        value={String(doc.doctorID)}>
                        {doc.fullName} - {doc.specialty}
                      </SelectItem>
                    ))
                  ) : (
                    <div className='p-2 text-sm text-muted-foreground'>
                      No doctors available
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>

            {date && doctor && (
              <div className='space-y-2'>
                <Label htmlFor='time-slot'>Available Time Slots</Label>
                {isLoading ? (
                  <p className='text-sm text-muted-foreground'>
                    Loading time slots...
                  </p>
                ) : !isDateValid ? (
                  <p className='text-sm text-muted-foreground'>
                    Please select a date from the doctor's service days (
                    {selectedDoctor?.serviceDays
                      .split(",")
                      .map((day) => day.trim())
                      .join(", ")}
                    )
                  </p>
                ) : availableTimeSlots.length > 0 ? (
                  <div className='grid grid-cols-2 gap-2'>
                    {availableTimeSlots.map((slot) => (
                      <Button
                        key={slot}
                        type='button'
                        variant={timeSlot === slot ? "default" : "outline"}
                        className='justify-start'
                        onClick={() => setTimeSlot(slot)}>
                        <Clock className='mr-2 h-4 w-4' />
                        {slot}
                        {timeSlot === slot && (
                          <Check className='ml-auto h-4 w-4' />
                        )}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <p className='text-sm text-muted-foreground'>
                    No available time slots for this date and doctor.
                  </p>
                )}
              </div>
            )}

            <div className='space-y-2'>
              <Label htmlFor='appointment-type'>Appointment Type</Label>
              <RadioGroup
                value={appointmentType}
                onValueChange={setAppointmentType}
                className='flex flex-col space-y-1'>
                <div className='flex items-center space-x-2'>
                  <RadioGroupItem value='in-person' id='in-person' />
                  <Label htmlFor='in-person'>In-Person Visit</Label>
                </div>
                <div className='flex items-center space-x-2'>
                  <RadioGroupItem value='video' id='video' />
                  <Label htmlFor='video'>Video Consultation</Label>
                </div>
                <div className='flex items-center space-x-2'>
                  <RadioGroupItem value='phone' id='phone' />
                  <Label htmlFor='phone'>Phone Consultation</Label>
                </div>
              </RadioGroup>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='reason'>Reason for Visit</Label>
              <Textarea
                id='reason'
                placeholder='Briefly describe your symptoms or reason for the appointment'
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleBookAppointment}
              disabled={
                !date || !doctor || !timeSlot || !isDateValid || isLoading
              }
              className='w-full'>
              Book Appointment
            </Button>
          </CardFooter>
        </Card>
      )}

      {date && doctor && timeSlot && isDateValid && (
        <Card>
          <CardHeader>
            <CardTitle>Appointment Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-2'>
              <div className='flex justify-between'>
                <span className='font-medium'>Date:</span>
                <span>{format(date, "MMMM d, yyyy")}</span>
              </div>
              <div className='flex justify-between'>
                <span className='font-medium'>Time:</span>
                <span>{timeSlot}</span>
              </div>
              <div className='flex justify-between'>
                <span className='font-medium'>Doctor:</span>
                <span>{selectedDoctor?.fullName}</span>
              </div>
              <div className='flex justify-between'>
                <span className='font-medium'>Type:</span>
                <span className='capitalize'>
                  {appointmentType.replace("-", " ")}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
