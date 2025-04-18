"use client"

import type React from "react"

import { createContext, useContext, useState } from "react"

type AdminContextType = {
  sidebarOpen: boolean
  toggleSidebar: () => void
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children }: { children: React.ReactNode }) {
  // Use localStorage to persist sidebar state if available
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    // Check if we're in the browser and if localStorage is available
    if (typeof window !== "undefined") {
      const savedState = localStorage.getItem("adminSidebarOpen")
      return savedState !== null ? savedState === "true" : true
    }
    return true
  })

  const toggleSidebar = () => {
    const newState = !sidebarOpen
    setSidebarOpen(newState)

    // Save to localStorage if available
    if (typeof window !== "undefined") {
      localStorage.setItem("adminSidebarOpen", String(newState))
    }
  }

  return <AdminContext.Provider value={{ sidebarOpen, toggleSidebar }}>{children}</AdminContext.Provider>
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider")
  }
  return context
}
