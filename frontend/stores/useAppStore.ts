import axios from "@/utils/axiosInstance";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Admin } from "./types/Admin";
import { Doctor } from "./types/Doctor";
import { Patient } from "./types/Patient";
import { Appointment } from "./types/Appointment";
import { fetchAdminProfile } from "@/utils/api/admin";
import { fetchUserProfile } from "@/utils/api/user";

type Store = {
  admin: Admin | null;
  user: Patient | null;
  doctors: Doctor[];
  appointments: Appointment[];
  initialized: boolean;

  initializeData: () => Promise<void>;

  setAdmin: (admin: Admin | null) => void;
  setUser: (user: Patient | null) => void;

  setDoctors: (doctors: Doctor[]) => void;
  setAppointments: (appointments: Appointment[]) => void;

  refreshAdmin: () => Promise<void>;
  refreshUser: () => Promise<void>;

  refreshDoctors: () => Promise<void>;
  refreshAppointments: () => Promise<void>;
};

export const useAppStore = create<Store>()(
  persist(
    (set, get) => ({
      admin: null,
      user: null,
      doctors: [],
      appointments: [],
      initialized: false,

      setAdmin: (admin) => set({ admin }),
      setUser: (user) => set({ user }),
      setDoctors: (doctors) => set({ doctors }),
      setAppointments: (appointments) => set({ appointments }),

      initializeData: async () => {
        if (get().initialized) return;

        const [doctorsRes, appointmentsRes] = await Promise.all([
          axios.get("/Doctor"),
          axios.get("/Appointment"),
        ]);

        set({
          doctors: doctorsRes.data,
          appointments: appointmentsRes.data,
          initialized: true,
        });
      },

      refreshAdmin: async () => {
        await fetchAdminProfile();
      },

      refreshUser: async () => {
        await fetchUserProfile();
      },

      refreshDoctors: async () => {
        const res = await axios.get("/Doctor");
        set({ doctors: res.data });
      },

      refreshAppointments: async () => {
        const res = await axios.get("/Appointment");
        set({ appointments: res.data });
      },
    }),
    {
      name: "app-store",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        user: state.user,
        admin: state.admin,
      }),
    }
  )
);
