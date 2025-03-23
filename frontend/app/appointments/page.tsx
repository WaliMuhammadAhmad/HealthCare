import { Navbar } from "@/components/navbar"
import { AppointmentCalendar } from "@/components/appointment-calendar"
import { AppointmentsList } from "@/components/appointments-list"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AppointmentsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-8">
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
            <p className="text-muted-foreground">Book and manage your healthcare appointments</p>
          </div>

          <Tabs defaultValue="book">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="book">Book Appointment</TabsTrigger>
              <TabsTrigger value="manage">Manage Appointments</TabsTrigger>
            </TabsList>
            <TabsContent value="book" className="pt-6">
              <AppointmentCalendar />
            </TabsContent>
            <TabsContent value="manage" className="pt-6">
              <AppointmentsList />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

