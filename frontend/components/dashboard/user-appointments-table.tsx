"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  Phone,
  AlertCircle,
  Info,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/utils/formatDate";
import { cancelAppointment } from "@/utils/api/appointment";
import { usePatientStore } from "@/stores/usePatientStore";

export function UserAppointmentsTable() {
  const appointments = usePatientStore((state) => state.patientAppointments);
  const { toast } = useToast();
  const [selectedAppointment, setSelectedAppointment] = useState<
    (typeof appointments)[0] | null
  >(null);
  const [detailsDialog, setDetailsDialog] = useState(false);
  const [cancelDialog, setCancelDialog] = useState(false);
  const [cancellationReason, setCancellationReason] = useState("");

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return <Badge>Upcoming</Badge>;
      case "completed":
        return <Badge variant='secondary'>Completed</Badge>;
      case "cancelled":
        return <Badge variant='destructive'>Cancelled</Badge>;
      default:
        return null;
    }
  };

  // Check if appointment can be cancelled (1 day before)
  const canCancelAppointment = (appointment: (typeof appointments)[0]) => {
    if (appointment.appointmentStatus !== "scheduled") return false;

    const appointmentDate = new Date(appointment.appointmentDate);
    const today = new Date();

    // Set both dates to midnight for accurate day comparison
    appointmentDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    // Calculate difference in days
    const diffTime = appointmentDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Can cancel if appointment is at least 1 day away
    return diffDays >= 1;
  };

  const handleCancelAppointment = () => {
    if (selectedAppointment && cancellationReason) {
      cancelAppointment(selectedAppointment.appointmentID, cancellationReason);
      setCancelDialog(false);
      setSelectedAppointment(null);
      setCancellationReason("");

      toast({
        title: "Appointment cancelled",
        description: "Your appointment has been successfully cancelled.",
      });
    }
  };

  const upcomingAppointments = appointments.filter(
    (apt) => apt.appointmentStatus === "scheduled"
  );
  const completedAppointments = appointments.filter(
    (apt) => apt.appointmentStatus === "completed"
  );
  const cancelledAppointments = appointments.filter(
    (apt) => apt.appointmentStatus === "cancelled"
  );

  const renderAppointmentRow = (appointment: (typeof appointments)[0]) => (
    <TableRow key={appointment.appointmentID}>
      <TableCell>
        <div>
          <div className='font-medium'>{appointment.doctorName}</div>
          <div className='text-sm text-muted-foreground'>
            {appointment.specialty}
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div>
          <div className='font-medium'>
            {formatDate(appointment.appointmentDate)}
          </div>
          <div className='text-sm text-muted-foreground'>
            {appointment.appointmentTime}
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className='flex items-center'>
          {getAppointmentTypeIcon(appointment.appointmentType)}
          <span className='capitalize'>
            {appointment.appointmentType.replace("-", " ")}
          </span>
        </div>
      </TableCell>
      <TableCell>{getStatusBadge(appointment.appointmentStatus)}</TableCell>
      <TableCell>
        <div className='flex space-x-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => {
              setSelectedAppointment(appointment);
              setDetailsDialog(true);
            }}>
            <Info className='h-4 w-4 mr-1' />
            Details
          </Button>

          {appointment.appointmentStatus === "scheduled" &&
            canCancelAppointment(appointment) && (
              <Button
                variant='outline'
                size='sm'
                onClick={() => {
                  setSelectedAppointment(appointment);
                  setCancelDialog(true);
                }}>
                Cancel
              </Button>
            )}
        </div>
      </TableCell>
    </TableRow>
  );

  return (
    <>
      <Tabs defaultValue='upcoming'>
        <TabsList className='grid w-full grid-cols-3'>
          <TabsTrigger value='upcoming'>
            Upcoming ({upcomingAppointments.length})
          </TabsTrigger>
          <TabsTrigger value='completed'>
            Completed ({completedAppointments.length})
          </TabsTrigger>
          <TabsTrigger value='cancelled'>
            Cancelled ({cancelledAppointments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value='upcoming' className='pt-6'>
          <div className='rounded-md border'>
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
                    <TableCell colSpan={5} className='h-24 text-center'>
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

        <TabsContent value='completed' className='pt-6'>
          <div className='rounded-md border'>
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
                    <TableCell colSpan={5} className='h-24 text-center'>
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

        <TabsContent value='cancelled' className='pt-6'>
          <div className='rounded-md border'>
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
                    <TableCell colSpan={5} className='h-24 text-center'>
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
        <DialogContent className='sm:max-w-[500px]'>
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
            <DialogDescription>
              Complete information about your appointment
            </DialogDescription>
          </DialogHeader>

          {selectedAppointment && (
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
              <div className='grid grid-cols-4 items-center gap-4'>
                <div className='font-medium'>Status:</div>
                <div className='col-span-3'>
                  {getStatusBadge(selectedAppointment.appointmentStatus)}
                </div>
              </div>
              <div className='grid grid-cols-4 items-start gap-4'>
                <div className='font-medium'>Notes:</div>
                <div className='col-span-3'>{selectedAppointment.notes}</div>
              </div>

              {selectedAppointment.appointmentStatus === "cancelled" &&
                selectedAppointment.cancellationReason && (
                  <div className='grid grid-cols-4 items-start gap-4'>
                    <div className='font-medium'>Cancellation Reason:</div>
                    <div className='col-span-3'>
                      {selectedAppointment.cancellationReason}
                    </div>
                  </div>
                )}
            </div>
          )}

          <DialogFooter>
            {selectedAppointment &&
              selectedAppointment.appointmentStatus === "upcoming" &&
              canCancelAppointment(selectedAppointment) && (
                <Button
                  variant='destructive'
                  onClick={() => {
                    setDetailsDialog(false);
                    setCancelDialog(true);
                  }}>
                  Cancel Appointment
                </Button>
              )}
            <Button variant='outline' onClick={() => setDetailsDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Appointment Dialog */}
      <Dialog open={cancelDialog} onOpenChange={setCancelDialog}>
        <DialogContent className='sm:max-w-[500px]'>
          <DialogHeader>
            <DialogTitle className='flex items-center'>
              <AlertCircle className='h-5 w-5 mr-2 text-destructive' />
              Cancel Appointment
            </DialogTitle>
            <DialogDescription>
              Please provide a reason for cancelling this appointment. Note that
              you can only cancel appointments at least 1 day in advance.
            </DialogDescription>
          </DialogHeader>

          {selectedAppointment && (
            <div className='py-4'>
              <div className='flex flex-col space-y-2 rounded-lg border p-4 mb-4'>
                <div>
                  <h4 className='font-medium'>
                    {selectedAppointment.doctorName}
                  </h4>
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

              <div className='space-y-2'>
                <label htmlFor='reason' className='text-sm font-medium'>
                  Reason for Cancellation
                </label>
                <Textarea
                  id='reason'
                  placeholder='Please provide a reason for cancelling this appointment...'
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                  className='min-h-[100px]'
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant='outline' onClick={() => setCancelDialog(false)}>
              Back
            </Button>
            <Button
              variant='destructive'
              onClick={handleCancelAppointment}
              disabled={!cancellationReason}>
              Confirm Cancellation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
