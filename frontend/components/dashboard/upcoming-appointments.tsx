"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Video, Phone } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/utils/formatDate";
import { usePatientStore } from "@/stores/usePatientStore";

export function UpcomingAppointments() {
  const upcomingAppointments = usePatientStore(
    (state) => state.patientAppointments
  ).filter((appointment) => appointment.appointmentStatus === "scheduled");

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

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <div>
          <CardTitle>Upcoming Appointments</CardTitle>
          <CardDescription>Your next scheduled appointments</CardDescription>
        </div>
        <Link href='/dashboard/appointments'>
          <Button variant='outline' size='sm'>
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {upcomingAppointments.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-6 text-center'>
              <Calendar className='h-12 w-12 text-muted-foreground mb-4' />
              <h3 className='text-lg font-medium'>No upcoming appointments</h3>
              <p className='text-muted-foreground mt-2'>
                You don't have any scheduled appointments.
              </p>
              <Link href={"/appointments"}>
                <Button className='mt-4'>Book an Appointment</Button>
              </Link>
            </div>
          ) : (
            upcomingAppointments.map((appointment) => (
              <div
                key={appointment.appointmentID}
                className='flex flex-col space-y-2 rounded-lg border p-4'>
                <div className='flex justify-between'>
                  <div>
                    <h4 className='font-medium'>{appointment.doctorName}</h4>
                    <p className='text-sm text-muted-foreground'>
                      {appointment.specialty}
                    </p>
                  </div>
                  <Badge>Upcoming</Badge>
                </div>
                <div className='flex items-center text-sm'>
                  <Calendar className='mr-1 h-4 w-4' />
                  <span>{formatDate(appointment.appointmentDate)}</span>
                  <span className='mx-2'>•</span>
                  <Clock className='mr-1 h-4 w-4' />
                  <span>{appointment.appointmentTime}</span>
                </div>
                <div className='flex items-center text-sm'>
                  {getAppointmentTypeIcon(appointment.appointmentType)}
                  <span className='capitalize'>
                    {appointment.appointmentType.replace("-", " ")} appointment
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
