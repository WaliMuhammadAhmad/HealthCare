"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { usePatientStore } from "@/stores/usePatientStore";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export function UserAppointmentChart() {
  const appointmentData = usePatientStore(
    (state) => state.monthlyPatientAppointments
  );
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Your Appointments</CardTitle>
          <CardDescription>
            History of your appointments over the past year
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col md:flex-row gap-4'>
            <ChartContainer
              config={{
                appointments: {
                  label: "Appointments",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className='h-[300px] flex-1'>
              <ResponsiveContainer width='100%' height='100%'>
                <LineChart data={appointmentData || []}>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='month' />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type='monotone'
                    dataKey='appointments'
                    stroke='var(--color-appointments)'
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
            <ChartContainer
              config={{
                appointments: {
                  label: "Appointments",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className='h-[300px] flex-1'>
              <ResponsiveContainer width='100%' height='100%'>
                <BarChart data={appointmentData || []}>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='month' />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey='appointments'
                    fill='var(--color-appointments)'
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
