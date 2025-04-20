export function logout() {
  document.cookie = "admin_token=; path=/; max-age=0;";
  document.cookie = "patient_token=; path=/; max-age=0;";
  console.log("Logged out successfully");
}
