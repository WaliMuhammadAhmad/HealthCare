"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePatientStore } from "@/stores/usePatientStore";
import { formatDate } from "@/utils/formatDate";
import { Calendar, ClipboardList, CheckCircle } from "lucide-react";

export function UserStatsCards() {
  const stats = usePatientStore((state) => state.patientStats);

  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>
            Total Appointments
          </CardTitle>
          <Calendar className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>
            {stats?.totalAppointments || 0}
          </div>
          <p className='text-xs text-muted-foreground'>Since you joined</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>
            Upcoming Appointments
          </CardTitle>
          <Calendar className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>
            {stats?.upcomingAppointmentsCount || 0}
          </div>
          <p className='text-xs text-muted-foreground'>
            Next on {formatDate(stats?.nextUpcomingDate || "")}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>
            Completed Appointments
          </CardTitle>
          <CheckCircle className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>
            {stats?.completedAppointmentsCount}
          </div>
          <p className='text-xs text-muted-foreground'>
            Last on {formatDate(stats?.lastCompletedDate || "")}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Top Doctor</CardTitle>
          <ClipboardList className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{stats?.topDoctorName}</div>
          <p className='text-xs text-muted-foreground'>
            Total Appointments: {stats?.topDoctorAppointments}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
