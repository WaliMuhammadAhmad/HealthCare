"use client";

import { useEffect } from "react";
import { redirect } from "next/navigation";
import { StatsCards } from "@/components/admin/stats-cards";
import { DashboardCharts } from "@/components/admin/dashboard-charts";
import { RecentAppointments } from "@/components/admin/recent-appointments";
import { NewUsers } from "@/components/admin/new-users";
import { useAppStore } from "@/stores/useAppStore";
import { useStatsStore } from "@/stores/useStatsStore";
import { usePatientStore } from "@/stores/usePatientStore";

export default function AdminDashboard() {
  const admin = useAppStore((state) => state.admin);
  const refreshStats = useStatsStore((state) => state.refreshStats);
  const refreshPatient = usePatientStore((state) => state.refreshAll);
  const isRefreshing = useStatsStore((state) => state.isRefreshing);

  useEffect(() => {
    if (admin) {
      refreshStats();
    }
  }, [admin]);

  if (!admin) {
    redirect("/signin");
    return null;
  }

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

          <StatsCards />

          <div className='grid gap-6 md:grid-cols-2'>
            <DashboardCharts />
          </div>

          <div className='grid gap-6 md:grid-cols-2'>
            <RecentAppointments />
            <NewUsers />
          </div>
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
  );
}
