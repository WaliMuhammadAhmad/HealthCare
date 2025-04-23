import { create } from "zustand";
import { AdminStats } from "./types/AdminStats";
import { MonthlyAppointments, MonthlyUsers } from "./types/charts";
import { LatestAppointment, LatestUser } from "./types/Latest";
import { fetchAdminStats } from "@/utils/api/admin";
import { fetchMonthlyAppointments } from "@/utils/api/admin";
import { fetchMonthlyUsers } from "@/utils/api/admin";
import { fetchLatestAppointments } from "@/utils/api/latest";
import { fetchLatestUsers } from "@/utils/api/latest";

type StatsStore = {
  adminStats: AdminStats | null;
  monthlyAppointments: MonthlyAppointments[] | null;
  monthlyUsers: MonthlyUsers[] | null;
  latestAppointments: LatestAppointment[] | null;
  latestUsers: LatestUser[] | null;
  isRefreshing: boolean;

  setIsRefreshing: (val: boolean) => void;
  setAdminStats: (stats: AdminStats) => void;
  setMonthlyAppointments: (data: MonthlyAppointments[]) => void;
  setMonthlyUsers: (data: MonthlyUsers[]) => void;
  setLatestAppointments: (data: LatestAppointment[]) => void;
  setLatestUsers: (data: LatestUser[]) => void;

  refreshAll: () => Promise<void>;
  refreshStats: () => Promise<void>;
  refreshAdminStats: () => Promise<void>;
  refreshMonthlyAppointments: () => Promise<void>;
  refreshMonthlyUsers: () => Promise<void>;
  refreshLatestAppointments: () => Promise<void>;
  refreshLatestUsers: () => Promise<void>;
};

export const useStatsStore = create<StatsStore>()((set) => ({
  adminStats: null,
  monthlyAppointments: null,
  monthlyUsers: null,
  latestAppointments: null,
  latestUsers: null,
  isRefreshing: false,

  setIsRefreshing: (val: boolean) => set({ isRefreshing: val }),
  setAdminStats: (stats) => set({ adminStats: stats }),
  setMonthlyAppointments: (data) => set({ monthlyAppointments: data }),
  setMonthlyUsers: (data) => set({ monthlyUsers: data }),
  setLatestAppointments: (data) => set({ latestAppointments: data }),
  setLatestUsers: (data) => set({ latestUsers: data }),

  refreshAll: async () => {
    const state = useStatsStore.getState();
    set({ isRefreshing: true });
    try {
      await Promise.all([
        state.refreshStats(),
        state.refreshAdminStats(),
        state.refreshMonthlyAppointments(),
        state.refreshMonthlyUsers(),
        state.refreshLatestAppointments(),
        state.refreshLatestUsers(),
      ]);
    } catch (error) {
      console.error("Error refreshing admin stats data:", error);
    } finally {
      set({ isRefreshing: false });
    }
  },
  refreshStats: async () => {
    const state = useStatsStore.getState();
    set({ isRefreshing: true });
    try {
      await Promise.all([
        state.refreshAdminStats(),
        state.refreshMonthlyAppointments(),
        state.refreshMonthlyUsers(),
        state.refreshLatestAppointments(),
        state.refreshLatestUsers(),
      ]);
    } catch (error) {
      console.error("Error refreshing stats:", error);
    } finally {
      set({ isRefreshing: false });
    }
  },
  refreshAdminStats: async () => {
    try {
      const adminStats = await fetchAdminStats();
      set({ adminStats });
    } catch (error) {
      console.error("Error fetching Admin Stats:", error);
    }
  },
  refreshMonthlyAppointments: async () => {
    try {
      const monthlyAppointments = await fetchMonthlyAppointments();
      set({ monthlyAppointments });
    } catch (error) {
      console.error("Error fetching Monthly Appointments stats:", error);
    }
  },
  refreshMonthlyUsers: async () => {
    try {
      const monthlyUsers = await fetchMonthlyUsers();
      set({ monthlyUsers });
    } catch (error) {
      console.error("Error fetching Monthly Users stats:", error);
    }
  },
  refreshLatestAppointments: async () => {
    try {
      const latestAppointments = await fetchLatestAppointments();
      set({ latestAppointments });
    } catch (error) {
      console.error("Error fetching Latest Appointments:", error);
    }
  },
  refreshLatestUsers: async () => {
    try {
      const latestUsers = await fetchLatestUsers();
      set({ latestUsers });
    } catch (error) {
      console.error("Error fetching Latest Users:", error);
    }
  },
}));
