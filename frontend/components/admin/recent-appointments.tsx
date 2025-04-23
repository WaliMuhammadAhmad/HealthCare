"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock } from "lucide-react";
import { formatDate } from "@/utils/formatDate";
import { formatTime } from "@/utils/formatTime";
import { useStatsStore } from "@/stores/useStatsStore";

export function RecentAppointments() {
  const recentAppointments = useStatsStore((state) => state.latestAppointments);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Appointments</CardTitle>
        <CardDescription>
          Latest upcoming appointments across the platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {recentAppointments?.map((appointment) => (
            <div
              key={appointment.id}
              className='flex items-center justify-between border-b pb-4 last:border-0 last:pb-0'>
              <div className='flex items-center space-x-3'>
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
                  <p className='font-medium'>{appointment.patientName}</p>
                  <p className='text-sm text-muted-foreground'>
                    {appointment.doctor}
                  </p>
                </div>
              </div>
              <div className='flex flex-col items-end'>
                <div className='flex items-center text-sm text-muted-foreground'>
                  <Calendar className='mr-1 h-3 w-3' />
                  <span>{formatDate(appointment.date)}</span>
                </div>
                <div className='flex items-center text-sm text-muted-foreground'>
                  <Clock className='mr-1 h-3 w-3' />
                  <span>{formatTime(appointment.time)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
