import axios from "../axiosInstance";
import { User } from "../api/user";
import { Admin } from "../api/admin";
import { useAppStore } from "@/stores/useAppStore";
import { fetchPatientAppointments } from "../api/appointment";
import { usePatientStore } from "@/stores/usePatientStore";

export async function login(email: string, password: string) {
  try {
    const isAdmin = email.toLowerCase().endsWith("@healthcare.com");
    const endpoint = isAdmin ? "/Admin/login" : "/Patient/login";

    const res = await axios.post(endpoint, {
      email,
      password,
    });

    const data = res.data;

    if (isAdmin) {
      document.cookie = `admin_token=${data.token}; path=/; max-age=3600; Secure`;
      const admin: Admin = {
        adminID: data.adminID,
        name: data.name,
        username: data.username,
        email: data.email,
        profilePic: data.profilePic,
      };
      useAppStore.getState().setAdmin(admin);
    } else {
      document.cookie = `patient_token=${data.token}; path=/; max-age=3600; Secure`;
      const user: User = {
        patientID: data.patientID,
        fullName: data.fullName,
        username: data.username,
        email: data.email,
        profilePic: data.profilePic,
        phoneNumber: data.phoneNumber,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        address: data.address,
        emergencyContactName: data.emergencyContactName,
        emergencyContact: data.emergencyContact,
        accountStatus: data.accountStatus,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      };
      useAppStore.getState().setUser(user);
      const apt = await fetchPatientAppointments();
      usePatientStore.getState().setPatientAppointments(apt);
    }

    return data;
  } catch (error: any) {
    const message = error.response?.data?.message || "Login failed";
    throw new Error(message);
  }
}
