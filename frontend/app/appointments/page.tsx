"use client";
import { Navbar } from "@/components/navbar";
import { AppointmentCalendar } from "@/components/appointment-calendar";
import { AppointmentsList } from "@/components/appointments-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppStore } from "@/stores/useAppStore";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function AppointmentsPage() {
  const user = useAppStore((state) => state.user);
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (!user) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            redirect("/signin");
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [user]);

  if (!user) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center space-y-4'>
          <h2 className='text-2xl font-bold'>You are not signed in!</h2>
          <p className='text-muted-foreground'>
            Please sign in to your account. If you don't have an account, sign
            up to create a new one.
          </p>
          <p className='text-lg font-semibold'>
            Redirecting to sign-in page in {countdown} seconds...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen flex flex-col'>
      <Navbar />
      <main className='flex-1 container py-8'>
        <div className='flex flex-col space-y-6'>
          <div className='flex flex-col space-y-2'>
            <h1 className='text-3xl font-bold tracking-tight'>Appointments</h1>
            <p className='text-muted-foreground'>
              Book and manage your healthcare appointments
            </p>
          </div>

          <Tabs defaultValue='book'>
            <TabsList className='grid w-full grid-cols-2'>
              <TabsTrigger value='book'>Book Appointment</TabsTrigger>
              <TabsTrigger value='manage'>Manage Appointments</TabsTrigger>
            </TabsList>
            <TabsContent value='book' className='pt-6'>
              <AppointmentCalendar />
            </TabsContent>
            <TabsContent value='manage' className='pt-6'>
              <AppointmentsList />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
