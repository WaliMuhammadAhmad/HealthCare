"use client";
import { UserStatsCards } from "@/components/dashboard/user-stats-cards";
import { UserAppointmentChart } from "@/components/dashboard/user-appointment-chart";
import { UpcomingAppointments } from "@/components/dashboard/upcoming-appointments";
// import { RecentMedicalRecords } from "@/components/dashboard/recent-medical-records";
import { useAppStore } from "@/stores/useAppStore";
import { redirect } from "next/navigation";
import { usePatientStore } from "@/stores/usePatientStore";
import { useEffect } from "react";

export default function UserDashboard() {
  const user = useAppStore((state) => state.user);
  const isRefreshing = usePatientStore((state) => state.isRefreshing);
  const refreshStats = usePatientStore((state) => state.refreshAll);

  if (!user) {
    redirect("/signin");
  }

  useEffect(() => {
    if (user) {
      refreshStats();
    }
  }, [user]);

  return (
    <div className='relative'>
      <div
        className={`transition-all duration-300 ${
          isRefreshing
            ? "blur-sm opacity-30 pointer-events-none"
            : "blur-0 opacity-100"
        }`}>
        <div className='space-y-8'>
          <div className='flex items-center justify-between'>
            <h2 className='text-3xl font-bold tracking-tight'>Dashboard</h2>
          </div>

          <UserStatsCards />

          <div className='grid gap-6 grid-cols-2 md:grid-cols-1'>
            <UserAppointmentChart />
          </div>

          <div className='grid gap-6 grid-col-2 md:grid-cols-1'>
            <UpcomingAppointments />
            {/* <RecentMedicalRecords /> */}
          </div>
        </div>

        {isRefreshing && (
          <div className='absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm'>
            <div className='flex flex-col items-center gap-4'>
              <div className='w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin' />
              <p className='text-white text-lg font-medium'>
                Loading dashboard data...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
