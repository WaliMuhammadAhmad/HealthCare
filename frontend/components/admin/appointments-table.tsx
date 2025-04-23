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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MoreHorizontal,
  Search,
  AlertCircle,
  MapPin,
  Video,
  Phone,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { useAppStore } from "@/stores/useAppStore";
import { formatDate } from "@/utils/formatDate";
import { formatTime } from "@/utils/formatTime";
import { cancelAppointment } from "@/utils/api/appointment";

export function AppointmentsTable() {
  const appointments = useAppStore((state) => state.appointments);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedAppointment, setSelectedAppointment] = useState<
    (typeof appointments)[0] | null
  >(null);
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
      case "rescheduled":
        return <Badge>Rescheduled</Badge>;
      default:
        return null;
    }
  };

  const filteredAppointments = appointments.filter((appointment) => {
    // Filter by search query
    const matchesSearch =
      appointment.patientName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      appointment.doctorName.toLowerCase().includes(searchQuery.toLowerCase());

    // Filter by status
    const matchesStatus =
      statusFilter === "all" || appointment.appointmentStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleCancelAppointment = () => {
    if (selectedAppointment && cancellationReason) {
      cancelAppointment(selectedAppointment.appointmentID, cancellationReason);
      setCancelDialog(false);
      setSelectedAppointment(null);
      setCancellationReason("");
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className='flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0'>
          <CardTitle>All Appointments</CardTitle>
          <div className='flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0'>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className='w-[180px]'>
                <SelectValue placeholder='Filter by status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Statuses</SelectItem>
                <SelectItem value='scheduled'>Upcoming</SelectItem>
                <SelectItem value='completed'>Completed</SelectItem>
                <SelectItem value='cancelled'>Cancelled</SelectItem>
                <SelectItem value='rescheduled'>Rescheduled</SelectItem>
              </SelectContent>
            </Select>
            <div className='relative'>
              <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='Search appointments...'
                className='pl-8 w-full sm:w-[260px]'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
        <CardDescription>
          Manage and track all appointments across the platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='rounded-md border'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className='text-right'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAppointments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className='h-24 text-center'>
                    No appointments found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredAppointments.map((appointment) => (
                  <TableRow key={String(appointment.appointmentID)}>
                    <TableCell>
                      <div className='flex items-center gap-3'>
                        <Avatar>
                          <AvatarImage
                            src={appointment.patientImage}
                            alt={appointment.patientName}
                          />
                          <AvatarFallback>
                            {appointment.patientName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className='font-medium'>
                            {appointment.patientName}
                          </div>
                          <div className='text-sm text-muted-foreground'>
                            {appointment.patientEmail}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className='font-medium'>
                          {appointment.doctorName}
                        </div>
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
                          {formatTime(appointment.appointmentTime)}
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
                    <TableCell>
                      {getStatusBadge(appointment.appointmentStatus)}
                    </TableCell>
                    <TableCell className='text-right'>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant='ghost' size='icon'>
                            <MoreHorizontal className='h-4 w-4' />
                            <span className='sr-only'>Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                          <DropdownMenuItem
                            onClick={() => setSelectedAppointment(appointment)}>
                            View Details
                          </DropdownMenuItem>
                          {(appointment.appointmentStatus === "scheduled" ||
                            appointment.appointmentStatus ===
                              "rescheduled") && (
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedAppointment(appointment);
                                setCancelDialog(true);
                              }}>
                              Cancel Appointment
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter>
        <div className='text-sm text-muted-foreground'>
          Showing {filteredAppointments.length} of {appointments.length}{" "}
          appointments
        </div>
      </CardFooter>

      {/* Appointment Details Dialog */}
      {selectedAppointment && !cancelDialog && (
        <Dialog
          open={!!selectedAppointment}
          onOpenChange={() => setSelectedAppointment(null)}>
          <DialogContent className='sm:max-w-[500px]'>
            <DialogHeader>
              <DialogTitle>Appointment Details</DialogTitle>
              <DialogDescription>
                Complete information about this appointment
              </DialogDescription>
            </DialogHeader>

            <div className='grid gap-4 py-4'>
              <div className='grid grid-cols-4 items-center gap-4'>
                <div className='font-medium'>ID:</div>
                <div className='col-span-3'>
                  {selectedAppointment.appointmentID.toString()}
                </div>
              </div>
              <div className='grid grid-cols-4 items-center gap-4'>
                <div className='font-medium'>Patient:</div>
                <div className='col-span-3 flex items-center gap-2'>
                  <Avatar className='h-6 w-6'>
                    <AvatarImage
                      src={selectedAppointment.patientImage}
                      alt={selectedAppointment.patientName}
                    />
                    <AvatarFallback>
                      {selectedAppointment.patientName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  {selectedAppointment.patientName}
                </div>
              </div>
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
                  nope
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
                    {selectedAppointment.appointmentType.replace("-", " ")}
                  </span>
                </div>
              </div>
              <div className='grid grid-cols-4 items-center gap-4'>
                <div className='font-medium'>Status:</div>
                <div className='col-span-3'>
                  {getStatusBadge(selectedAppointment.appointmentStatus)}
                </div>
              </div>
              {selectedAppointment.appointmentStatus === "cancelled" && (
                <div className='grid grid-cols-4 items-start gap-4'>
                  <div className='font-medium'>Cancellation Reason:</div>
                  <div className='col-span-3'>
                    {selectedAppointment.cancellationReason}
                  </div>
                </div>
              )}
              {selectedAppointment.appointmentStatus === "rescheduled" && (
                <div className='grid grid-cols-4 items-start gap-4'>
                  <div className='font-medium'>Rescheduled Date:</div>
                  <div className='col-span-3'>
                    {formatDate(selectedAppointment.rescheduleDate || "")}
                  </div>
                </div>
              )}
              {selectedAppointment.appointmentStatus === "rescheduled" && (
                <div className='grid grid-cols-4 items-start gap-4'>
                  <div className='font-medium'>Rescheduled Time:</div>
                  <div className='col-span-3'>
                    {selectedAppointment.rescheduleTime}
                  </div>
                </div>
              )}
              {selectedAppointment.appointmentStatus === "rescheduled" && (
                <div className='grid grid-cols-4 items-start gap-4'>
                  <div className='font-medium'>Reschedule Reason:</div>
                  <div className='col-span-3'>
                    {selectedAppointment.rescheduleReason}
                  </div>
                </div>
              )}
              {selectedAppointment.reasonForVisit && (
                <div className='grid grid-cols-4 items-start gap-4'>
                  <div className='font-medium'>Reason for Visit:</div>
                  <div className='col-span-3'>
                    {selectedAppointment.reasonForVisit}
                  </div>
                </div>
              )}
              <div className='grid grid-cols-4 items-start gap-4'>
                <div className='font-medium'>Notes:</div>
                <div className='col-span-3'>{selectedAppointment.notes}</div>
              </div>
            </div>

            <DialogFooter>
              {selectedAppointment.appointmentStatus === "upcoming" && (
                <Button
                  variant='destructive'
                  onClick={() => {
                    setSelectedAppointment(selectedAppointment);
                    setCancelDialog(true);
                  }}>
                  Cancel Appointment
                </Button>
              )}
              <Button
                variant='outline'
                onClick={() => setSelectedAppointment(null)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Cancel Appointment Dialog */}
      <Dialog open={cancelDialog} onOpenChange={setCancelDialog}>
        <DialogContent className='sm:max-w-[500px]'>
          <DialogHeader>
            <DialogTitle className='flex items-center'>
              <AlertCircle className='h-5 w-5 mr-2 text-destructive' />
              Cancel Appointment
            </DialogTitle>
            <DialogDescription>
              This will cancel the appointment and notify the patient. Please
              provide a reason for cancellation.
            </DialogDescription>
          </DialogHeader>

          {selectedAppointment && (
            <div className='py-4'>
              <div className='flex items-center gap-3 p-4 border rounded-md mb-4'>
                <div>
                  <div className='font-medium'>
                    {selectedAppointment.patientName}
                  </div>
                  <div className='text-sm text-muted-foreground'>
                    {formatDate(selectedAppointment.appointmentDate)} at{" "}
                    {selectedAppointment.appointmentTime}
                  </div>
                  <div className='text-sm text-muted-foreground'>
                    {selectedAppointment.doctorName} -{" "}
                    {selectedAppointment.specialty}
                  </div>
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
    </Card>
  );
}
