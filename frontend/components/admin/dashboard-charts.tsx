"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"

// Sample data for appointments by month
const appointmentData = [
  { month: "Jan", appointments: 120 },
  { month: "Feb", appointments: 145 },
  { month: "Mar", appointments: 162 },
  { month: "Apr", appointments: 175 },
  { month: "May", appointments: 185 },
  { month: "Jun", appointments: 201 },
  { month: "Jul", appointments: 216 },
  { month: "Aug", appointments: 230 },
  { month: "Sep", appointments: 245 },
  { month: "Oct", appointments: 260 },
  { month: "Nov", appointments: 275 },
  { month: "Dec", appointments: 290 },
]

// Sample data for user registrations
const userData = [
  { month: "Jan", users: 45 },
  { month: "Feb", users: 52 },
  { month: "Mar", users: 61 },
  { month: "Apr", users: 67 },
  { month: "May", users: 75 },
  { month: "Jun", users: 84 },
  { month: "Jul", users: 91 },
  { month: "Aug", users: 98 },
  { month: "Sep", users: 105 },
  { month: "Oct", users: 112 },
  { month: "Nov", users: 120 },
  { month: "Dec", users: 132 },
]

export function DashboardCharts() {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Appointments Overview</CardTitle>
          <CardDescription>Monthly appointment bookings for the current year</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="bar">
            <TabsList className="mb-4">
              <TabsTrigger value="bar">Bar Chart</TabsTrigger>
              <TabsTrigger value="line">Line Chart</TabsTrigger>
            </TabsList>
            <TabsContent value="bar">
              <ChartContainer
                config={{
                  appointments: {
                    label: "Appointments",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={appointmentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="appointments" fill="var(--color-appointments)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </TabsContent>
            <TabsContent value="line">
              <ChartContainer
                config={{
                  appointments: {
                    label: "Appointments",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={appointmentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="appointments" stroke="var(--color-appointments)" strokeWidth={2} />
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
          <CardDescription>Monthly new user registrations for the current year</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              users: {
                label: "New Users",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="users" stroke="var(--color-users)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </>
  )
}

