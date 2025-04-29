import axios from "../axiosInstance";
import { useAppStore } from "@/stores/useAppStore";
import { usePatientStore } from "@/stores/usePatientStore";

export interface Appointment {
  appointmentID: number;
  appointmentDate: string;
  appointmentStatus: string;
  appointmentTime: string;
  appointmentType: string;
  cancellationReason: null | string;
  doctorName: string;
  specialty: string;
  notes: null | string;
  patientEmail: string;
  patientImage: string;
  patientName: string;
  reasonForVisit: string | null;
  rescheduleDate: null | string;
  rescheduleReason: null | string;
  rescheduleTime: null | string;
  createdAt: string;
  updatedAt: string;
}

export interface RescheduleAppointment {
  appointmentStatus: "rescheduled";
  rescheduleDate: string;
  rescheduleTime: string;
  rescheduleReason: string;
  rescheduleNotes: string | null;
}

export async function fetchPatientAppointments(): Promise<Appointment[]> {
  const { user } = useAppStore.getState();
  if (!user) throw new Error("User not found");
  try {
    const res = await axios.get(`/Appointment/patient/${user.patientID}`);
    return res.data as Appointment[];
  } catch (error: any) {
    const message =
      error.response?.data?.message || "Failed to fetch appointments";
    throw new Error(message);
  }
}

export async function addAppointment(
  doctor: number,
  formatedDate: string,
  formatedTimeSlot: string,
  reason: string | null,
  appointmentType: string
) {
  const { user } = useAppStore.getState();
  try {
    const appointment = {
      doctorID: doctor,
      patientID: user?.patientID,
      appointmentDate: formatedDate,
      appointmentTime: formatedTimeSlot,
      reasonForVisit: reason,
      appointmentType: appointmentType,
      appointmentStatus: "scheduled",
    };

    const res = await axios.post("/Appointment", appointment);
    if (!res) {
      throw new Error("Failed to add appointment");
    }
    usePatientStore.getState().refreshPatientAppointments();
    useAppStore.getState().refreshAppointments();
    alert("Appointment added successfully");
    return res;
  } catch (error: any) {
    const message =
      error.response?.data?.message || "Failed to add appointment";
    throw new Error(message);
  }
}

export async function cancelAppointment(
  appointmentID: number,
  reason: null | string
) {
  try {
    await axios.patch(`/Appointment/status/${appointmentID}`, {
      Status: "cancelled",
    });
    await axios.patch(`/Appointment/cancel-reason/${appointmentID}`, {
      cancellationReason: reason ? reason : "Patient cancelled it willingly",
    });
    usePatientStore.getState().refreshPatientAppointments();
    useAppStore.getState().refreshAppointments();
  } catch (error: any) {
    const message =
      error.response?.data?.message || "Failed to cancel appointment";
    throw new Error(message);
  }
}

export async function rescheduleAppointment(
  appointmentID: number,
  rescheduleData: RescheduleAppointment
): Promise<void> {
  try {
    await axios.patch(
      `/Appointment/reschedule/${appointmentID}`,
      rescheduleData
    );
    if (rescheduleData.rescheduleNotes) {
      await axios.patch(
        `/Appointment/notes/${appointmentID}`,
        `"${rescheduleData.rescheduleNotes}"`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
    usePatientStore.getState().refreshPatientAppointments();
    useAppStore.getState().refreshAppointments();
  } catch (error: any) {
    const message =
      error.response?.data?.message || "Failed to recheduled appointment";
    throw new Error(message);
  }
}

export async function deleteAppointment(appointmentID: number) {
  try {
    await axios.delete(`/Appointment/${appointmentID}`);
    usePatientStore.getState().refreshPatientAppointments();
    useAppStore.getState().refreshAppointments();
  } catch (error: any) {
    const message =
      error.response?.data?.message || "Failed to delete appointment";
    throw new Error(message);
  }
}
