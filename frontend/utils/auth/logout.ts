import { useAppStore } from "@/stores/useAppStore";

export function logout(role: string) {
  if (role === "admin") {
    document.cookie = "admin_token=; path=/; max-age=0;";
    useAppStore.getState().setAdmin(null);
  } else if (role === "user") {
    document.cookie = "patient_token=; path=/; max-age=0;";
    useAppStore.getState().setUser(null);
  } else {
    console.error("Invalid role provided for logout");
  }
}
