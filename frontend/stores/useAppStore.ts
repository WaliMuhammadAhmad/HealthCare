import { create } from "zustand";
import axios from "@/utils/axiosInstance";

type Doctor = {
  DoctorID: number;
  FullName: string;
  Email: string;
  Specialty: string;
  Status: string;
  ServiceDays: string;
  AvailabilityTimes: string;
  Bio: string;
  CreatedAt: string;
  UpdatedAt: string;
};

type Patient = {
  patientID: number;
  fullName: string;
  username: string;
  email: string;
  password: string;
  profilePic: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  emergencyContactName: string;
  emergencyContact: string;
  accountStatus: string;
  appointments: any;
  notifications: any;
  createdAt: string;
  updatedAt: string;
};

type Appointment = {
  AppointmentID: number;
  PatientID: number;
  DoctorID: number;
  AppointmentDate: string;
  AppointmentTime: string;
  AppointmentType: string;
  ReasonForVisit: string;
  AppointmentStatus: string;
  Notes: string;
  CancellationReason: string;
  RescheduleReason: string;
  RescheduleDate: string;
  RescheduleTime: string;
  CreatedAt: string;
  UpdatedAt: string;
};

type Store = {
  patients: Patient[];
  doctors: Doctor[];
  appointments: Appointment[];
  initialized: boolean;

  // Fetch and Setters
  initializeData: () => Promise<void>;
  setPatients: (patients: Patient[]) => void;
  setDoctors: (doctors: Doctor[]) => void;
  setAppointments: (appointments: Appointment[]) => void;

  // Optional: Re-fetch from backend
  refreshPatients: () => Promise<void>;
  refreshDoctors: () => Promise<void>;
  refreshAppointments: () => Promise<void>;
};

export const useAppStore = create<Store>((set, get) => ({
  patients: [],
  doctors: [],
  appointments: [],
  initialized: false,

  setPatients: (patients) => set({ patients }),
  setDoctors: (doctors) => set({ doctors }),
  setAppointments: (appointments) => set({ appointments }),

  initializeData: async () => {
    if (get().initialized) return;

    const [patientsRes, doctorsRes, appointmentsRes] = await Promise.all([
      axios.get("/Patient"),
      axios.get("/Doctor"),
      axios.get("/Appointment"),
    ]);

    set({
      patients: patientsRes.data,
      doctors: doctorsRes.data,
      appointments: appointmentsRes.data,
      initialized: true,
    });
  },

  refreshPatients: async () => {
    const res = await axios.get("/Patient");
    set({ patients: res.data });
  },

  refreshDoctors: async () => {
    const res = await axios.get("/Doctor");
    set({ doctors: res.data });
  },

  refreshAppointments: async () => {
    const res = await axios.get("/Appointment");
    set({ appointments: res.data });
  },
}));
