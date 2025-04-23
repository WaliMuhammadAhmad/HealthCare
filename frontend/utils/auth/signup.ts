import axios from "../axiosInstance";
import { useAppStore } from "@/stores/useAppStore";

interface SignupData {
  fullName: string;
  username: string;
  email: string;
  password: string;
}

export async function signup({
  fullName,
  username,
  email,
  password,
}: SignupData) {
  try {
    const response = await axios.post("/Patient", {
      fullName,
      username,
      email,
      password,
      accountStatus: "Active",
    });

    if (response.status === 201) {
      await useAppStore.getState().refreshPatients();
    }

    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || "Signup failed";
    throw new Error(message);
  }
}
