import axios from "./axiosInstance";

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
    } else {
      document.cookie = `patient_token=${data.token}; path=/; max-age=3600; Secure`;
    }

    return data;
  } catch (error: any) {
    const message = error.response?.data?.message || "Login failed";
    throw new Error(message);
  }
}
