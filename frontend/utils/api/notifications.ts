import axios from "../axiosInstance";
import { useAppStore } from "@/stores/useAppStore";

export interface Notification {
  id: number;
  patientId: number;
  notificationType: "Email" | "SMS";
  appointmentReminders: boolean;
  appointmentChanges: boolean;
  medicalUpdates: boolean;
  isEnabled: boolean;
}

export async function getNotifications(patientId: number) {
  try {
    const response = await axios.get(`/Notification/${patientId}`);
    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message || "Failed to fetch notifications";
    throw new Error(message);
  }
}
export async function updateNotificationSettings(
  patientId: number,
  notificationType: "Email" | "SMS",
  appointmentReminders: boolean,
  appointmentChanges: boolean,
  medicalUpdates: boolean
) {
  try {
    const response = await axios.patch(`/Notification/${patientId}`, {
      notificationType,
      appointmentReminders,
      appointmentChanges,
      medicalUpdates,
    });

    if (response.status === 200) {
      await useAppStore.getState().refreshPatients();
    }

    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message || "Failed to update notifications";
    throw new Error(message);
  }
}
