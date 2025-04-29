"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Clock,
  Video,
  Phone,
  MapPin,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  cancelAppointment,
  rescheduleAppointment,
  RescheduleAppointment,
} from "@/utils/api/appointment";
import { formatDate } from "@/utils/formatDate";
import { usePatientStore } from "@/stores/usePatientStore";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { doctorBookedAppointments } from "@/utils/doctor";
import { generateAvailableTimeSlots } from "@/utils/generateTimeSlots";
import { useAppStore } from "@/stores/useAppStore";

export function AppointmentsList() {
  const { toast } = useToast();
  const appointments = usePatientStore((state) => state.patientAppointments);

  const [selectedAppointment, setSelectedAppointment] = useState<
    (typeof appointments)[0] | null
  >(null);
  const [cancelDialog, setCancelDialog] = useState(false);

  const [rescheduleDialog, setRescheduleDialog] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState<string>("");
  const [rescheduleTime, setRescheduleTime] = useState<string>("");
  const [rescheduleReason, setRescheduleReason] = useState<string>("");
  const [rescheduleNotes, setRescheduleNotes] = useState<string>("");

  const [bookedAppointments, setBookedAppointments] = useState<
    Array<{
      appointmentID: number;
      appointmentDate: string;
      appointmentTime: string;
    }>
  >([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const doctors = useAppStore((state) => state.doctors);

  const upcomingAppointments = appointments.filter(
    (apt) =>
      apt.appointmentStatus === "scheduled" ||
      apt.appointmentStatus === "rescheduled"
  );
  const pastAppointments = appointments.filter(
    (apt) => apt.appointmentStatus === "completed"
  );

  const getAppointmentTypeIcon = (type: string) => {
    switch (type) {
      case "in-person":
        return <MapPin className='h-4 w-4 mr-1' />;
      case "video":
        return <Video className='h-4 w-4 mr-1' />;
      case "phone":
        return <Phone className='h-4 w-4 mr-1' />;
      default:
        return null;
    }
  };

  const handleCancelAppointment = (id: number) => {
    cancelAppointment(id, null);

    toast({
      title: "Appointment cancelled",
      description: `Your appointment with ${
        selectedAppointment?.doctorName
      } on ${formatDate(
        selectedAppointment?.appointmentDate || ""
      )} has been cancelled.`,
    });

    setCancelDialog(false);
    setSelectedAppointment(null);
  };

  const handleRescheduleAppointment = async () => {
    if (
      !selectedAppointment ||
      !rescheduleDate ||
      !rescheduleTime ||
      !rescheduleReason
    ) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      const updatedData: RescheduleAppointment = {
        appointmentStatus: "rescheduled",
        rescheduleDate,
        rescheduleTime,
        rescheduleReason,
        rescheduleNotes,
      };

      await rescheduleAppointment(
        selectedAppointment.appointmentID,
        updatedData
      );

      toast({
        title: "Appointment rescheduled",
        description: `Your appointment with ${
          selectedAppointment.doctorName
        } has been rescheduled to ${formatDate(
          rescheduleDate
        )} at ${rescheduleTime}.`,
      });

      setRescheduleDialog(false);
      setSelectedAppointment(null);
      // Reset form fields
      setRescheduleDate("");
      setRescheduleTime("");
      setRescheduleReason("");
      setRescheduleNotes("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to reschedule appointment",
        variant: "destructive",
      });
    }
  };

  const renderAppointmentCard = (appointment: (typeof appointments)[0]) => {
    const isRescheduled =
      appointment.rescheduleDate && appointment.rescheduleTime;

    return (
      <Card
        key={String(appointment.appointmentID)}
        className={`mb-4 ${isRescheduled ? "border-amber-400" : ""}`}>
        <CardHeader className='pb-2'>
          <div className='flex justify-between items-start'>
            <div>
              <CardTitle>{appointment.doctorName}</CardTitle>
              <CardDescription>{appointment.specialty}</CardDescription>
            </div>
            <Badge
              variant={
                isRescheduled
                  ? "outline"
                  : appointment.appointmentStatus === "completed"
                  ? "secondary"
                  : "default"
              }
              className={
                isRescheduled
                  ? "border-amber-400 text-amber-600 bg-amber-50"
                  : ""
              }>
              {isRescheduled
                ? "Rescheduled"
                : appointment.appointmentStatus === "scheduled"
                ? "Upcoming"
                : "Completed"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className='space-y-2'>
            {isRescheduled ? (
              <>
                <div className='flex items-start text-sm'>
                  <div className='flex items-center'>
                    <Calendar className='h-4 w-4 mr-1 text-muted-foreground' />
                    <span className='text-muted-foreground line-through'>
                      {formatDate(appointment.appointmentDate)}
                    </span>
                    <span className='mx-2 text-muted-foreground'>•</span>
                    <Clock className='h-4 w-4 mr-1 text-muted-foreground' />
                    <span className='text-muted-foreground line-through'>
                      {appointment.appointmentTime}
                    </span>
                  </div>
                  <ArrowRight className='mx-2 h-4 w-4 text-amber-500' />
                  <div className='flex items-center'>
                    <Calendar className='h-4 w-4 mr-1' />
                    <span className='font-medium'>
                      {formatDate(appointment.rescheduleDate || "")}
                    </span>
                    <span className='mx-2'>•</span>
                    <Clock className='h-4 w-4 mr-1' />
                    <span className='font-medium'>
                      {appointment.rescheduleTime}
                    </span>
                  </div>
                </div>
                <div className='text-sm bg-amber-50 p-2 rounded-md border border-amber-200'>
                  <span className='font-medium text-amber-700'>
                    Reason for reschedule:
                  </span>{" "}
                  <span className='text-sm text-amber-600'>
                    {appointment.rescheduleReason}
                  </span>
                </div>
              </>
            ) : (
              <div className='flex items-center text-sm'>
                <Calendar className='h-4 w-4 mr-1' />
                <span>{formatDate(appointment.appointmentDate)}</span>
                <span className='mx-2'>•</span>
                <Clock className='h-4 w-4 mr-1' />
                <span>{appointment.appointmentTime}</span>
              </div>
            )}
            <div className='flex items-center text-sm'>
              {getAppointmentTypeIcon(appointment.appointmentType)}
              <span className='capitalize'>
                {appointment.appointmentType.replace("-", " ")} appointment
              </span>
            </div>
            {appointment.notes && (
              <div className='text-sm text-muted-foreground'>
                {appointment.notes}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <div className='flex justify-end w-full space-x-2'>
            {(appointment.appointmentStatus === "scheduled" ||
              appointment.appointmentStatus === "rescheduled") && (
              <>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => {
                    setSelectedAppointment(appointment);
                    setCancelDialog(true);
                  }}>
                  Cancel
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => {
                    setSelectedAppointment(appointment);
                    setRescheduleDialog(true);
                  }}>
                  Reschedule
                </Button>
              </>
            )}
            <Button
              variant='default'
              size='sm'
              onClick={() => setSelectedAppointment(appointment)}>
              Details
            </Button>
          </div>
        </CardFooter>
      </Card>
    );
  };

  useEffect(() => {
    if (rescheduleDialog && selectedAppointment) {
      const fetchBookedAppointments = async () => {
        setIsLoading(true);
        try {
          // Find the doctor ID by matching name and specialty
          const doctor = doctors.find(
            (doc) =>
              doc.fullName === selectedAppointment.doctorName &&
              doc.specialty === selectedAppointment.specialty
          );

          if (!doctor) {
            toast({
              title: "Error",
              description: "Could not find doctor information.",
              variant: "destructive",
            });
            setBookedAppointments([]);
            setIsLoading(false);
            return;
          }

          const data = await doctorBookedAppointments(doctor.doctorID);
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
    }
  }, [rescheduleDialog, selectedAppointment, doctors, toast]);

  useEffect(() => {
    if (rescheduleDate && selectedAppointment) {
      // Assuming the doctor works from 9 AM to 5 PM
      // You might want to get this from the doctor's data if available
      const availabilityTimes = [9, 17];
      const slots = generateAvailableTimeSlots(
        new Date(rescheduleDate),
        bookedAppointments,
        availabilityTimes[0],
        availabilityTimes[1]
      );
      setAvailableTimeSlots(slots);
    } else {
      setAvailableTimeSlots([]);
    }
  }, [rescheduleDate, bookedAppointments, selectedAppointment]);

  return (
    <>
      <Tabs defaultValue='upcoming'>
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='upcoming'>
            Upcoming ({upcomingAppointments.length})
          </TabsTrigger>
          <TabsTrigger value='past'>Past Appointments</TabsTrigger>
        </TabsList>
        <TabsContent value='upcoming' className='pt-6'>
          {upcomingAppointments.length > 0 ? (
            upcomingAppointments.map(renderAppointmentCard)
          ) : (
            <div className='flex flex-col items-center justify-center py-12 text-center'>
              <Calendar className='h-12 w-12 text-muted-foreground mb-4' />
              <h3 className='text-lg font-medium'>No upcoming appointments</h3>
              <p className='text-muted-foreground mt-2'>
                You don't have any scheduled appointments. Book a new
                appointment to get started.
              </p>
            </div>
          )}
        </TabsContent>
        <TabsContent value='past' className='pt-6'>
          {pastAppointments.length > 0 ? (
            pastAppointments.map(renderAppointmentCard)
          ) : (
            <div className='flex flex-col items-center justify-center py-12 text-center'>
              <Calendar className='h-12 w-12 text-muted-foreground mb-4' />
              <h3 className='text-lg font-medium'>No past appointments</h3>
              <p className='text-muted-foreground mt-2'>
                Your appointment history will appear here.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Appointment Details Dialog */}
      {selectedAppointment && !cancelDialog && (
        <Dialog
          open={!!selectedAppointment}
          onOpenChange={() => setSelectedAppointment(null)}>
          <DialogContent className='sm:max-w-[500px]'>
            <DialogHeader>
              <DialogTitle>Appointment Details</DialogTitle>
              <DialogDescription>
                Complete information about your appointment.
              </DialogDescription>
            </DialogHeader>

            <div className='grid gap-4 py-4'>
              <div className='grid grid-cols-4 items-center gap-4'>
                <div className='font-medium'>Doctor:</div>
                <div className='col-span-3'>
                  {selectedAppointment.doctorName}
                </div>
              </div>
              <div className='grid grid-cols-4 items-center gap-4'>
                <div className='font-medium'>Specialty:</div>
                <div className='col-span-3'>
                  {selectedAppointment.specialty}
                </div>
              </div>
              <div className='grid grid-cols-4 items-center gap-4'>
                <div className='font-medium'>Date:</div>
                <div className='col-span-3'>
                  {formatDate(selectedAppointment.appointmentDate)}
                </div>
              </div>
              <div className='grid grid-cols-4 items-center gap-4'>
                <div className='font-medium'>Time:</div>
                <div className='col-span-3'>
                  {selectedAppointment.appointmentTime}
                </div>
              </div>
              <div className='grid grid-cols-4 items-center gap-4'>
                <div className='font-medium'>Type:</div>
                <div className='col-span-3 flex items-center'>
                  {getAppointmentTypeIcon(selectedAppointment.appointmentType)}
                  <span className='capitalize'>
                    {selectedAppointment.appointmentType.replace("-", " ")}{" "}
                    appointment
                  </span>
                </div>
              </div>
              <div className='grid grid-cols-4 items-start gap-4'>
                <div className='font-medium'>Location:</div>
                {/* <div className='col-span-3'>{selectedAppointment.location}</div> */}
              </div>
              <div className='grid grid-cols-4 items-start gap-4'>
                <div className='font-medium'>Notes:</div>
                <div className='col-span-3'>{selectedAppointment.notes}</div>
              </div>
            </div>

            <DialogFooter className='flex justify-end space-x-2'>
              {selectedAppointment.appointmentStatus === "upcoming" && (
                <>
                  <Button
                    variant='outline'
                    onClick={() => {
                      setCancelDialog(true);
                      setSelectedAppointment(selectedAppointment);
                    }}>
                    Cancel Appointment
                  </Button>
                  <Button variant='outline'>Reschedule</Button>
                </>
              )}
              <Button
                variant='default'
                onClick={() => setSelectedAppointment(null)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Cancel Confirmation Dialog */}
      <Dialog open={cancelDialog} onOpenChange={setCancelDialog}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle className='flex items-center text-destructive'>
              <AlertCircle className='h-5 w-5 mr-2' />
              Cancel Appointment
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this appointment? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {selectedAppointment && (
            <div className='py-4'>
              <div className='rounded-lg border p-4 mb-4'>
                <div className='font-medium'>
                  {selectedAppointment.doctorName}
                </div>
                <div className='text-sm text-muted-foreground'>
                  {selectedAppointment.specialty}
                </div>
                <div className='text-sm mt-2 flex items-center'>
                  <Calendar className='h-4 w-4 mr-1' />
                  {formatDate(selectedAppointment.appointmentDate)} at{" "}
                  {selectedAppointment.appointmentTime}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant='outline' onClick={() => setCancelDialog(false)}>
              Keep Appointment
            </Button>
            <Button
              variant='destructive'
              onClick={() => {
                if (selectedAppointment) {
                  handleCancelAppointment(selectedAppointment.appointmentID);
                }
              }}>
              Cancel Appointment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reschedule Appointment Dialog */}
      <Dialog open={rescheduleDialog} onOpenChange={setRescheduleDialog}>
        <DialogContent className='sm:max-w-[500px]'>
          <DialogHeader>
            <DialogTitle>Reschedule Appointment</DialogTitle>
            <DialogDescription>
              Please select a new date and time for your appointment.
            </DialogDescription>
          </DialogHeader>

          {selectedAppointment && (
            <div className='py-4'>
              <div className='flex flex-col space-y-2 rounded-lg border p-4 mb-4'>
                <div>
                  <h4 className='font-medium'>Current Appointment</h4>
                  <p className='text-sm font-medium'>
                    {selectedAppointment.doctorName}
                  </p>
                  <p className='text-sm text-muted-foreground'>
                    {selectedAppointment.specialty}
                  </p>
                </div>
                <div className='flex items-center text-sm'>
                  <Calendar className='mr-1 h-4 w-4' />
                  <span>{formatDate(selectedAppointment.appointmentDate)}</span>
                  <span className='mx-2'>•</span>
                  <Clock className='mr-1 h-4 w-4' />
                  <span>{selectedAppointment.appointmentTime}</span>
                </div>
                <div className='flex items-center text-sm'>
                  {getAppointmentTypeIcon(selectedAppointment.appointmentType)}
                  <span className='capitalize'>
                    {selectedAppointment.appointmentType.replace("-", " ")}{" "}
                    appointment
                  </span>
                </div>
              </div>

              <div className='space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='reschedule-date'>New Date</Label>
                  <Input
                    id='reschedule-date'
                    type='date'
                    value={rescheduleDate}
                    onChange={(e) => setRescheduleDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='reschedule-time'>New Time</Label>
                  <Select
                    value={rescheduleTime}
                    onValueChange={setRescheduleTime}>
                    <SelectTrigger id='reschedule-time'>
                      <SelectValue placeholder='Select a time' />
                    </SelectTrigger>
                    <SelectContent>
                      {isLoading ? (
                        <SelectItem value='loading' disabled>
                          Loading time slots...
                        </SelectItem>
                      ) : availableTimeSlots.length > 0 ? (
                        availableTimeSlots.map((slot) => {
                          // Convert from "9:00 AM" format to "09:00:00" format for the backend
                          const [time, period] = slot.split(" ");
                          const [hourStr, minute] = time.split(":");
                          let hour = Number.parseInt(hourStr);
                          if (period === "PM" && hour !== 12) hour += 12;
                          if (period === "AM" && hour === 12) hour = 0;
                          const formattedTime = `${hour
                            .toString()
                            .padStart(2, "0")}:${minute}:00`;

                          return (
                            <SelectItem key={slot} value={formattedTime}>
                              {slot}
                            </SelectItem>
                          );
                        })
                      ) : (
                        <SelectItem value='no-slots' disabled>
                          No available time slots
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='reschedule-reason'>
                    Reason for Rescheduling
                  </Label>
                  <Textarea
                    id='reschedule-reason'
                    placeholder='Please provide a reason for rescheduling this appointment...'
                    value={rescheduleReason}
                    onChange={(e) => setRescheduleReason(e.target.value)}
                    className='min-h-[80px]'
                    required
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='reschedule-notes'>
                    Additional Notes (Optional)
                  </Label>
                  <Textarea
                    id='reschedule-notes'
                    placeholder='Any additional information for your healthcare provider...'
                    value={rescheduleNotes}
                    onChange={(e) => setRescheduleNotes(e.target.value)}
                    className='min-h-[80px]'
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setRescheduleDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleRescheduleAppointment}>
              Confirm Reschedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
