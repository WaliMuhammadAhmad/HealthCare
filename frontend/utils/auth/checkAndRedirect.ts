"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/stores/useAppStore";

export const useAdminRedirect = () => {
  const router = useRouter();
  const { admin, refreshAdmin } = useAppStore();

  useEffect(() => {
    const hasAdminToken =
      typeof document !== "undefined" &&
      document.cookie.includes("admin_token");

    const check = async () => {
      if (!admin && hasAdminToken) {
        try {
          await refreshAdmin();
        } catch (error) {
          console.error("Failed to refresh admin:", error);
        }
      }

      const updatedAdmin = useAppStore.getState().admin;
      if (updatedAdmin) {
        router.replace("/admin");
      }
    };

    check();
  }, [admin]);
};

export const useUserRedirect = () => {
  const router = useRouter();
  const { user, refreshUser } = useAppStore();

  useEffect(() => {
    const hasUserToken =
      typeof document !== "undefined" &&
      document.cookie.includes("patient_token");

    const check = async () => {
      if (!user && hasUserToken) {
        try {
          await refreshUser();
        } catch (error) {
          console.error("Failed to refresh user:", error);
        }
      }

      const updatedUser = useAppStore.getState().user;
      if (updatedUser) {
        router.replace("/appointments");
      }
    };

    check();
  }, [user]);
};
