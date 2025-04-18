"use client"

import type React from "react"

import { createContext, useContext, useState } from "react"

type UserContextType = {
  sidebarOpen: boolean
  toggleSidebar: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  // Use localStorage to persist sidebar state if available
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    // Check if we're in the browser and if localStorage is available
    if (typeof window !== "undefined") {
      const savedState = localStorage.getItem("userSidebarOpen")
      return savedState !== null ? savedState === "true" : true
    }
    return true
  })

  const toggleSidebar = () => {
    const newState = !sidebarOpen
    setSidebarOpen(newState)

    // Save to localStorage if available
    if (typeof window !== "undefined") {
      localStorage.setItem("userSidebarOpen", String(newState))
    }
  }

  return <UserContext.Provider value={{ sidebarOpen, toggleSidebar }}>{children}</UserContext.Provider>
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
