import { LatestAppointment, LatestUser } from "@/stores/types/Latest";
import axios from "../axiosInstance";

// Fetch 5 latest registered users
export const fetchLatestUsers = async () => {
  try {
    const response = await axios.get("/Patient/latest-users");
    return response.data as LatestUser[];
  } catch (error) {
    console.error("Error fetching latest users:", error);
  }
};

// Fetch 5 latest appointments
export const fetchLatestAppointments = async () => {
  try {
    const response = await axios.get("Appointment/recent-appointments");
    return response.data as LatestAppointment[];
  } catch (error) {
    console.error("Error fetching latest appointments:", error);
  }
};
