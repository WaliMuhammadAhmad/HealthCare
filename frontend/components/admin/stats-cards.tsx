"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, Stethoscope, Activity } from "lucide-react";
import { useStatsStore } from "@/stores/useStatsStore";

export function StatsCards() {
  const stats = useStatsStore((state) => state.adminStats);

  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Total Patients</CardTitle>
          <Users className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{stats?.totalPatients || 0}</div>
          <p className='text-xs text-muted-foreground'>
            {(stats?.growth?.patientsGrowth ?? 0) > 0
              ? `+${stats?.growth?.patientsGrowth ?? 0}`
              : stats?.growth?.patientsGrowth ?? 0}
            % from last month
          </p>
        </CardContent>
      </Card>

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
          <p className='text-xs text-muted-foreground'>
            {(stats?.growth?.appointmentsGrowth ?? 0) > 0
              ? `+${stats?.growth?.appointmentsGrowth ?? 0}`
              : stats?.growth?.appointmentsGrowth ?? 0}
            % from last month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Active Doctors</CardTitle>
          <Stethoscope className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{stats?.activeDoctors || 0}</div>
          <p className='text-xs text-muted-foreground'>
            {(stats?.growth?.activeDoctorsGrowth ?? 0) > 0
              ? `+${stats?.growth?.activeDoctorsGrowth ?? 0}`
              : stats?.growth?.activeDoctorsGrowth ?? 0}
            % new this month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>
            Appointment Rate
          </CardTitle>
          <Activity className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>
            {stats?.appointmentRate || 0}%
          </div>
          <p className='text-xs text-muted-foreground'>
            {(stats?.growth?.appointmentRateGrowth ?? 0) > 0
              ? `+${stats?.growth?.appointmentRateGrowth ?? 0}`
              : stats?.growth?.appointmentRateGrowth ?? 0}
            % from last month
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
