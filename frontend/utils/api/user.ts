import axios from "../axiosInstance";
import { useAppStore } from "@/stores/useAppStore";
import { usePatientStore } from "@/stores/usePatientStore";
import { PatientStats } from "@/stores/types/PatientStats";
import { MonthlyAppointments } from "@/stores/types/charts";

export interface User {
  patientID: number;
  fullName: string;
  username: string;
  email: string;
  profilePic: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  emergencyContactName: string;
  emergencyContact: string;
  accountStatus: string;
  createdAt: string;
  updatedAt: string;
}

interface updateUser {
  userId: number | undefined;
  fullName: string | undefined;
  email: string | undefined;
  phone: string | undefined;
  address: string | undefined;
  dateOfBirth: string | undefined;
  gender: string | undefined;
  emergencyContact: string | undefined;
  emergencyContactName: string | undefined;
  profilePic: string | undefined;
}

export const fetchUserProfile = async () => {
  try {
    const response = await axios.get("/Patient/me", {
      withCredentials: true,
    });

    if (response.status === 200 && response.data) {
      useAppStore.getState().setUser(response.data);
    } else {
      useAppStore.getState().setUser(null);
      throw new Error("Unexpected response from server");
    }
  } catch (err: any) {
    useAppStore.getState().setUser(null);
    let errorMessage = "An error occurred. Please try again.";

    if (err.response) {
      const status = err.response.status;
      const msg = err.response.data || "";

      if (status === 401) {
        errorMessage = "Unauthorized, please login again.";
      } else if (status === 404) {
        errorMessage = "Patient not found.";
      } else {
        errorMessage = typeof msg === "string" ? msg : "Something went wrong.";
      }
    }

    throw new Error(`Error fetching User profile: ${errorMessage}`);
  }
};

export async function deactivateAccount(id: number) {
  try {
    await axios.patch(`/Patient/account-status/${id}`, {
      AccountStatus: "Deactivated",
    });
    usePatientStore.getState().refreshPatients();
  } catch (error: any) {
    const message =
      error.response?.data?.message || "Failed to update appointment";
    throw new Error(message);
  }
}

export async function activateAccount(id: number) {
  try {
    await axios.patch(`/Patient/account-status/${id}`, {
      AccountStatus: "Active",
    });
    usePatientStore.getState().refreshPatients();
  } catch (error: any) {
    const message =
      error.response?.data?.message || "Failed to update appointment";
    throw new Error(message);
  }
}

export async function deleteAccount(id: number) {
  try {
    await axios.delete(`/Patient/${id}`);
    await usePatientStore.getState().refreshPatients();
  } catch (error: any) {
    const message = error.response?.data?.message || "Failed to delete account";
    throw new Error(message);
  }
}

export const updateAccountInfo = async (updatedProfile: updateUser) => {
  try {
    const response = await axios.put(
      `/Patient/${updatedProfile.userId}`,
      updatedProfile
    );
    if (response.status === 200) {
      useAppStore.getState().refreshUser();
      usePatientStore.getState().refreshPatients();
    }
    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message || "Failed to update patient password";
    throw new Error(message);
  }
};

export const updateAccountPassword = async (
  id: number,
  oldPassword: string,
  newPassword: string
) => {
  try {
    const response = await axios.patch(`/Patient/update-password/${id}`, {
      oldPassword,
      newPassword,
    });
    if (response.status === 200) {
      useAppStore.getState().refreshUser();
      usePatientStore.getState().refreshPatients();
    }
    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message || "Failed to update patient password";
    throw new Error(message);
  }
};

export async function fetchUserStats() {
  const { user } = useAppStore.getState();
  if (!user) throw new Error("User not found");

  try {
    const response = await axios.get(
      `/Appointment/user-stats/${user.patientID}`
    );

    if (response.status === 200) {
      return response.data as PatientStats;
    } else {
      throw new Error("Failed to fetch user stats");
    }
  } catch (error: any) {
    const message =
      error.response?.data?.message || "Failed to fetch user stats";
    throw new Error(message);
  }
}

export async function fetchUserAppointmentChart() {
  const { user } = useAppStore.getState();
  if (!user) throw new Error("User not logged in");

  try {
    const response = await axios.get(`/Appointment/monthly/${user?.patientID}`);

    if (response.status === 200) {
      return response.data as MonthlyAppointments[];
    } else {
      throw new Error("Failed to fetch appointment chart data");
    }
  } catch (error: any) {
    const message =
      error.response?.data?.message || "Failed to fetch appointment chart data";
    throw new Error(message);
  }
}
