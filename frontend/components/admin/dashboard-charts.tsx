"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
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
import { useStatsStore } from "@/stores/useStatsStore";

export function DashboardCharts() {
  const appointmentData = useStatsStore((state) => state.monthlyAppointments);
  const userData = useStatsStore((state) => state.monthlyUsers);
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Appointments Overview</CardTitle>
          <CardDescription>
            Monthly appointment bookings for the current year
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue='bar'>
            <TabsList className='mb-4'>
              <TabsTrigger value='bar'>Bar Chart</TabsTrigger>
              <TabsTrigger value='line'>Line Chart</TabsTrigger>
            </TabsList>
            <TabsContent value='bar'>
              <ChartContainer
                config={{
                  appointments: {
                    label: "Appointments",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className='h-[300px]'>
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
            </TabsContent>
            <TabsContent value='line'>
              <ChartContainer
                config={{
                  appointments: {
                    label: "Appointments",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className='h-[300px]'>
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
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>User Registrations</CardTitle>
          <CardDescription>
            Monthly new user registrations for the current year
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue='line'>
            <TabsList className='mb-4'>
              <TabsTrigger value='line'>Line Chart</TabsTrigger>
              <TabsTrigger value='bar'>Bar Chart</TabsTrigger>
            </TabsList>
            <TabsContent value='bar'>
              <ChartContainer
                config={{
                  users: {
                    label: "Users",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className='h-[300px]'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={userData || []}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='month' />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar
                      dataKey='users'
                      fill='var(--color-users)'
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </TabsContent>
            <TabsContent value='line'>
              <ChartContainer
                config={{
                  users: {
                    label: "Users",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className='h-[300px]'>
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart data={userData || []}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='month' />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type='monotone'
                      dataKey='users'
                      stroke='var(--color-users)'
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </>
  );
}
