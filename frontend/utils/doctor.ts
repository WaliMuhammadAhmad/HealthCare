import axios from "./axiosInstance";
import { useAppStore } from "@/stores/useAppStore";

export interface Doctor {
  fullName: string;
  email: string;
  specialty: string;
  serviceDays: string;
  availabilityTimes: string;
  status: string;
  bio: string | null;
}

// Add Doctor
export async function addDoctor({
  fullName,
  email,
  specialty,
  serviceDays,
  availabilityTimes,
  status,
  bio,
}: Doctor) {
  try {
    await axios.post("/Doctor", {
      fullName,
      email,
      specialty,
      serviceDays,
      availabilityTimes,
      status,
      bio,
    });

    useAppStore.getState().refreshDoctors();
  } catch (error: any) {
    const message = error.response?.data?.message || "Failed to add doctor";
    throw new Error(message);
  }
}

// Edit Doctor
export async function editDoctor(
  doctorID: number,
  updatedData: Partial<Doctor>
) {
  try {
    await axios.put(`/Doctor/${doctorID}`, {
      ...updatedData,
    });

    useAppStore.getState().refreshDoctors();
  } catch (error: any) {
    const message = error.response?.data?.message || "Failed to update doctor";
    throw new Error(message);
  }
}

// Delete Doctor
export async function deleteDoctor(doctorID: number) {
  try {
    await axios.delete(`/Doctor/${doctorID}`);

    useAppStore.getState().refreshDoctors();
  } catch (error: any) {
    const message = error.response?.data?.message || "Failed to delete doctor";
    throw new Error(message);
  }
}

export const doctorBookedAppointments = async (doctorId: number) => {
  try {
    const response = await axios.get(`/Appointment/doctor/${doctorId}/booked`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch booked appointments:", error);
    return [];
  }
};
