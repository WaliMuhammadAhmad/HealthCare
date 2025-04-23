import { AdminStats } from "@/stores/types/AdminStats";
import axios from "../axiosInstance";
import { useAppStore } from "@/stores/useAppStore";

export interface Admin {
  adminID: number;
  name: string;
  username: string;
  email: string;
  profilePic: string;
}

export const fetchAdminProfile = async () => {
  try {
    const response = await axios.get("/Admin/me", {
      withCredentials: true,
    });

    if (response.status === 200 && response.data) {
      useAppStore.getState().setAdmin(response.data);
    } else {
      useAppStore.getState().setAdmin(null);
      throw new Error("Unexpected response from server");
    }
  } catch (err: any) {
    let errorMessage = "An error occurred. Please try again.";

    if (err.response) {
      const status = err.response.status;
      const msg = err.response.data || "";

      if (status === 401) {
        errorMessage = "Unauthorized, please login again.";
      } else if (status === 404) {
        errorMessage = "Admin not found.";
      } else {
        errorMessage = typeof msg === "string" ? msg : "Something went wrong.";
      }
    }

    console.error("Error fetching admin profile:", errorMessage);
    throw new Error(errorMessage);
  }
};

export const editAdminInformation = async (id: number, admin: Admin) => {
  try {
    const response = await axios.put(`/Admin/${id}`, admin);
    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message || "Failed to edit admin information";
    console.error(message);
  }
};

export const updateAdminPassword = async (
  id: number,
  oldPassword: string,
  newPassword: string
) => {
  try {
    const response = await axios.patch(`/Admin/update-password/${id}`, {
      oldPassword,
      newPassword,
    });
    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message || "Failed to update admin password";
    console.error(message);
  }
};

export async function fetchAdminStats(): Promise<AdminStats> {
  try {
    const res = await axios.get("/Appointment/dashboard/stats");
    return res.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message || "Failed to fetch admin dashboard stats";
    console.error(message);
    throw new Error(message);
  }
}

export async function fetchMonthlyAppointments() {
  try {
    const res = await axios.get("/Appointment/monthly");
    return res.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      "Failed to fetch monthly appointment stats";
    console.error(message);
    throw new Error(message);
  }
}

export async function fetchMonthlyUsers() {
  try {
    const res = await axios.get("/Patient/users/monthly");
    return res.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message || "Failed to fetch user monthly stats";
    console.error(message);
    throw new Error(message);
  }
}
