import axios from "../utils/axiosInstance";
import { create } from "zustand";
import { Patient } from "./types/Patient";
import { PatientStats } from "./types/PatientStats";
import { Appointment } from "./types/Appointment";
import { fetchUserAppointmentChart } from "@/utils/api/user";
import { fetchPatientAppointments } from "@/utils/api/appointment";
import { fetchUserStats } from "@/utils/api/user";
import { MonthlyAppointments } from "./types/charts";
import { createJSONStorage, persist } from "zustand/middleware";

type PatientStore = {
  patients: Patient[];
  patientStats: PatientStats | null;
  patientAppointments: Appointment[];
  monthlyPatientAppointments: MonthlyAppointments[] | null;
  isRefreshing: boolean;
  initialized: boolean;

  initializeData: () => Promise<void>;

  setIsRefreshing: (val: boolean) => void;
  setPatients: (patients: Patient[]) => void;
  setPatientStats: (stats: PatientStats) => void;
  setPatientAppointments: (appointments: Appointment[]) => void;
  setMonthlyPatientAppointments: (data: MonthlyAppointments[]) => void;

  refreshAll: () => Promise<void>;
  refreshPatients: () => Promise<void>;
  refreshPatientAppointments: () => Promise<void>;
  refreshPatientStats: () => Promise<void>;
  refreshMonthlyPatientAppointments: () => Promise<void>;
};

export const usePatientStore = create<PatientStore>()(
  persist(
    (set, get) => ({
      patients: [],
      patientStats: null,
      patientAppointments: [],
      monthlyPatientAppointments: [],
      isRefreshing: false,
      initialized: false,

      initializeData: async () => {
        if (get().initialized) return;
        const patientsRes = await axios.get("/Patient");
        set({
          patients: patientsRes.data,
          initialized: true,
        });
      },

      setIsRefreshing: (val: boolean) => {
        set({ isRefreshing: val });
      },
      setPatients: (patients) => {
        set({ patients });
      },
      setPatientStats: (stats) => {
        set({ patientStats: stats });
      },
      setPatientAppointments: (appointments) => {
        set({ patientAppointments: appointments });
      },
      setMonthlyPatientAppointments: (data) => {
        set({ monthlyPatientAppointments: data });
      },

      refreshAll: async () => {
        const state = usePatientStore.getState();
        set({ isRefreshing: true });
        try {
          await Promise.all([
            state.refreshPatients(),
            state.refreshPatientAppointments(),
            state.refreshPatientStats(),
            state.refreshMonthlyPatientAppointments(),
          ]);
        } catch (error) {
          console.error("Error refreshing patient data:", error);
        } finally {
          set({ isRefreshing: false });
        }
      },
      refreshPatients: async () => {
        const res = await axios.get("/Patient");
        set({ patients: res.data });
      },
      refreshPatientAppointments: async () => {
        const data = await fetchPatientAppointments();
        if (data) {
          set({ patientAppointments: data });
        }
      },
      refreshPatientStats: async () => {
        const data = await fetchUserStats();
        set({ patientStats: data });
      },
      refreshMonthlyPatientAppointments: async () => {
        const data = await fetchUserAppointmentChart();
        set({ monthlyPatientAppointments: data });
      },
    }),
    {
      name: "patient-store",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        patients: state.patients,
        patientAppointments: state.patientAppointments,
      }),
    }
  )
);
