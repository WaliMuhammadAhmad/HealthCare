"use client";

import { useState } from "react";
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
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cancelAppointment } from "@/utils/api/appointment";
import { formatDate } from "@/utils/formatDate";
import { usePatientStore } from "@/stores/usePatientStore";

export function AppointmentsList() {
  const { toast } = useToast();
  const appointments = usePatientStore((state) => state.patientAppointments);

  const [selectedAppointment, setSelectedAppointment] = useState<
    (typeof appointments)[0] | null
  >(null);
  const [cancelDialog, setCancelDialog] = useState(false);

  const upcomingAppointments = appointments.filter(
    (apt) => apt.appointmentStatus === "scheduled"
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

  const renderAppointmentCard = (appointment: (typeof appointments)[0]) => (
    <Card key={String(appointment.appointmentID)} className='mb-4'>
      <CardHeader className='pb-2'>
        <div className='flex justify-between items-start'>
          <div>
            <CardTitle>{appointment.doctorName}</CardTitle>
            <CardDescription>{appointment.specialty}</CardDescription>
          </div>
          <Badge
            variant={
              appointment.appointmentStatus === "completed"
                ? "secondary"
                : "default"
            }>
            {appointment.appointmentStatus === "scheduled"
              ? "Upcoming"
              : "Completed"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className='space-y-2'>
          <div className='flex items-center text-sm'>
            <Calendar className='h-4 w-4 mr-1' />
            <span>{formatDate(appointment.appointmentDate)}</span>
            <span className='mx-2'>•</span>
            <Clock className='h-4 w-4 mr-1' />
            <span>{appointment.appointmentTime}</span>
          </div>
          <div className='flex items-center text-sm'>
            {getAppointmentTypeIcon(appointment.appointmentType)}
            <span className='capitalize'>
              {appointment.appointmentType.replace("-", " ")} appointment
            </span>
          </div>
          <div className='text-sm text-muted-foreground'>
            {appointment.notes}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className='flex justify-end w-full space-x-2'>
          {appointment.appointmentStatus === "scheduled" && (
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
                onClick={() => setSelectedAppointment(appointment)}>
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
    </>
  );
}
